const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ===============================
// API ENDPOINTS
// ===============================

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order and saves it in database
 */
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { plan_id, user_id, customer_name, customer_email, customer_phone } = req.body;

    console.log('Creating order for:', { plan_id, user_id, customer_name });

    // Fetch plan from database
    const planResult = await pool.query(
      'SELECT id, name, price, currency, billing_cycle FROM plans WHERE id = $1',
      [plan_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.rows[0];
    const amountInPaise = Math.round(plan.price * 100); // Convert to paise

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: plan.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan_id,
        user_id,
        plan_name: plan.name,
        billing_cycle: plan.billing_cycle
      }
    });

    console.log('Razorpay order created:', razorpayOrder.id);

    // Save order in database
    const paymentResult = await pool.query(
      `INSERT INTO payments 
        (user_id, plan_id, razorpay_order_id, amount, currency, status, customer_name, customer_email, customer_phone, receipt, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        user_id,
        plan_id,
        razorpayOrder.id,
        plan.price,
        plan.currency || 'INR',
        'created',
        customer_name,
        customer_email,
        customer_phone,
        razorpayOrder.receipt,
        JSON.stringify(razorpayOrder.notes)
      ]
    );

    console.log('Payment record created:', paymentResult.rows[0].id);

    res.json({
      order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency: plan.currency || 'INR',
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/verify
 * Verifies payment signature and activates subscription
 */
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    console.log('Signature verified successfully');

    // Fetch payment details from Razorpay
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    console.log('Payment details fetched:', razorpayPayment.status);

    // Get payment record from database
    const paymentResult = await pool.query(
      'SELECT * FROM payments WHERE razorpay_order_id = $1',
      [razorpay_order_id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentResult.rows[0];

    // Get plan details
    const planResult = await pool.query(
      'SELECT billing_cycle FROM plans WHERE id = $1',
      [payment.plan_id]
    );

    const plan = planResult.rows[0];

    // Calculate subscription period
    let endDate;
    if (plan.billing_cycle === 'monthly') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billing_cycle === 'yearly') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate = null; // Lifetime
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update payment record
      await client.query(
        `UPDATE payments 
         SET razorpay_payment_id = $1, 
             razorpay_signature = $2, 
             status = $3, 
             payment_method = $4,
             paid_at = $5
         WHERE razorpay_order_id = $6`,
        [
          razorpay_payment_id,
          razorpay_signature,
          'success',
          razorpayPayment.method,
          new Date(razorpayPayment.created_at * 1000),
          razorpay_order_id
        ]
      );

      // Cancel existing active subscriptions
      await client.query(
        `UPDATE user_subscriptions 
         SET status = 'canceled', cancel_at = now() 
         WHERE user_id = $1 AND status IN ('active', 'trialing')`,
        [payment.user_id]
      );

      // Create new subscription
      const subscriptionResult = await client.query(
        `INSERT INTO user_subscriptions 
          (user_id, plan_id, status, started_at, current_period_start, current_period_end, next_billing_date, auto_renew)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          payment.user_id,
          payment.plan_id,
          'active',
          new Date(),
          new Date(),
          endDate,
          endDate,
          true
        ]
      );

      const subscriptionId = subscriptionResult.rows[0].id;

      // Link payment to subscription
      await client.query(
        'UPDATE payments SET subscription_id = $1 WHERE id = $2',
        [subscriptionId, payment.id]
      );

      await client.query('COMMIT');

      console.log('Subscription activated:', subscriptionId);

      res.json({
        success: true,
        subscription_id: subscriptionId,
        payment_id: payment.id
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payments/user/:user_id
 * Fetch payment history with plan details
 */
app.get('/api/payments/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT 
        p.*,
        pl.name as plan_name,
        pl.billing_cycle
      FROM payments p
      JOIN plans pl ON p.plan_id = pl.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Payment server running on port ${PORT}`);
  console.log(`📘 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID}`);
});
