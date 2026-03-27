import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from './Button';
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/backendApi';
import { loadRazorpay } from '../utils/razorpay';
import { useAuth } from '../context/AuthContext';
import type { SubscriptionPlan } from '../data/plans';

interface PricingCardProps {
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  isCurrentPlan?: boolean;
  onSuccess?: (planName: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, billingCycle, isCurrentPlan = false, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isFree = plan.monthlyPrice === 0;
  const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  React.useEffect(() => {
    const checkoutPlanId = searchParams.get('checkout');
    if (checkoutPlanId === plan.id && isAuthenticated && !isCurrentPlan && !isFree) {
      // Clear the parameter so it doesn't trigger again immediately on re-renders 
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('checkout');
      setSearchParams(newParams, { replace: true });
      
      handlePayment();
    }
  }, [searchParams, plan.id, isAuthenticated, isCurrentPlan, isFree, setSearchParams]);

  const handlePayment = async () => {
    if (isCurrentPlan || isFree) return;
    
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/pricing?checkout=${plan.id}`)}`);
      return;
    }
    
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 2. Create Order with plan_id and billing_cycle
      const orderResponse = await createRazorpayOrder(currentPrice, 'INR', plan.id, billingCycle);

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      const { order } = orderResponse;

      // 3. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: `SkillSynergy ${plan.name}`,
        description: `Upgrade to ${plan.name} (${billingCycle})`,
        image: '/logo.png',
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
              if (onSuccess) onSuccess(plan.name);
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
          contact: ''
        },
        theme: {
          color: '#10B981'
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

  // Determine button label
  const getButtonLabel = () => {
    if (loading) return 'Processing...';
    if (isCurrentPlan) return 'Active';
    if (isFree) return 'Current Plan';
    return 'Upgrade Now';
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-2xl border flex flex-col transition-all ${
        plan.recommended 
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-charcoal-800 shadow-lg shadow-emerald-500/10' 
          : isCurrentPlan 
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' 
            : 'border-mint-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800'
      } shadow-premium`}
    >
      {/* Recommended Badge */}
      {plan.recommended && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <SparklesIcon className="h-3.5 w-3.5" />
          RECOMMENDED
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
          CURRENT PLAN
        </div>
      )}

      <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">{plan.name}</h3>
      <div className="flex flex-col mb-4">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-charcoal-900 dark:text-white transition-all duration-300">
            {isFree ? 'Free' : `₹${currentPrice}`}
          </span>
          {!isFree && (
            <span className="text-charcoal-500 dark:text-mint-300 ml-2">
              /{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          )}
        </div>
        
        {billingCycle === 'yearly' && !isFree && (
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              ₹{(plan.yearlyPrice / 12).toFixed(0)}/mo effectively
            </span>
            <span className="text-[10px] text-charcoal-400 line-through">
              ₹{plan.monthlyPrice * 12}
            </span>
          </div>
        )}
      </div>

      <p className="text-charcoal-600 dark:text-mint-200 mb-6 text-sm">
        {plan.description}
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
            <span className="text-charcoal-700 dark:text-mint-100 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isCurrentPlan || isFree ? 'outline' : 'primary'}
        className={`w-full justify-center ${plan.recommended && !isCurrentPlan ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0' : ''}`}
        onClick={handlePayment}
        disabled={isCurrentPlan || isFree || loading}
      >
        {getButtonLabel()}
      </Button>
    </motion.div>
  );
};

export default PricingCard;
