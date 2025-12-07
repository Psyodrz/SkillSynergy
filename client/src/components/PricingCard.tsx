import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Button from './Button';
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/backendApi';
import { loadRazorpay } from '../utils/razorpay';
import { useAuth } from '../context/AuthContext';

interface PricingCardProps {
  isCurrentPlan?: boolean;
  onSuccess?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ isCurrentPlan = false, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  const handlePayment = async () => {
    if (isCurrentPlan) return;
    
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 2. Create Order
      const amount = 499; // INR
      const orderResponse = await createRazorpayOrder(amount);

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      const { order } = orderResponse;

      // 3. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add this to your frontend .env
        amount: order.amount,
        currency: order.currency,
        name: 'SkillSynergy Pro',
        description: 'Upgrade to Pro Plan',
        image: '/favicon.ico', // Update with your logo
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment
            const verifyResponse = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyResponse.success) {
              alert('Payment Successful! Welcome to Pro.');
              if (onSuccess) onSuccess();
            } else {
              alert('Payment Verification Failed: ' + verifyResponse.error);
            }
          } catch (error: any) {
            console.error('Verification Error:', error);
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
          contact: '' // Can ask user for phone if needed
        },
        theme: {
          color: '#10B981' // Emerald-500
        },
        // Prioritize UPI and Scan & Pay
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  {
                    method: "card"
                  },
                  {
                    method: "netbanking"
                  }
                ]
              }
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response: any){
        alert(response.error.description);
      });

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-2xl border ${isCurrentPlan ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-mint-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800'} shadow-premium flex flex-col`}
    >
      {isCurrentPlan && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
          CURRENT PLAN
        </div>
      )}

      <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Pro Plan</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold text-charcoal-900 dark:text-white">₹499</span>
        <span className="text-charcoal-500 dark:text-mint-300 ml-2">/month</span>
      </div>

      <p className="text-charcoal-600 dark:text-mint-200 mb-6 text-sm">
        Unlock the full potential of SkillSynergy with advanced features and priority support.
      </p>

      <ul className="space-y-4 mb-8 flex-1">
        {[
          'Unlimited Project Creation',
          'AI Smart Match (Unlimited)',
          'Priority Teacher Matching',
          'Verified Badge',
          'Advanced Analytics'
        ].map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
            <span className="text-charcoal-700 dark:text-mint-100 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isCurrentPlan ? 'outline' : 'primary'}
        className="w-full justify-center"
        onClick={handlePayment}
        disabled={isCurrentPlan || loading}
      >
        {loading ? 'Processing...' : isCurrentPlan ? 'Active' : 'Upgrade Now'}
      </Button>
    </motion.div>
  );
};

export default PricingCard;
