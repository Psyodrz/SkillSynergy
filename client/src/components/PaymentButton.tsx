import { useState, useEffect } from 'react';
import { config } from '../config';

interface PaymentButtonProps {
  plan: {
    id: string;
    name: string;
    code: string;
    price: number;
    billing_cycle: string;
  };
  user: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ plan, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const orderResponse = await fetch(`${config.API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.id,
          user_id: user.id,
          customer_name: user.name || 'Customer',
          customer_email: user.email || '',
          customer_phone: user.phone || ''
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      const orderData = await orderResponse.json();

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'SkillSynergy',
        description: `${plan.name} Subscription`,
        image: '/logo.png',
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#10b981' // Emerald color
        },
        handler: async (response: any) => {
          try {
            // 3. Verify payment
            const verifyResponse = await fetch(`${config.API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');

            await verifyResponse.json(); // Just ensure response is valid JSON

            alert(`Payment successful! Subscription activated.`);
            window.location.href = '/dashboard';

          } catch (err: any) {
            setError(err.message);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (plan.price === 0) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 rounded-xl font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
      >
        Free Plan - No Payment Required
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className={`
          w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
          ${loading || !scriptLoaded
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl active:scale-95'
          }
        `}
      >
        {loading ? 'Processing...' : !scriptLoaded ? 'Loading...' : `Pay ₹${plan.price}`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
