import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../hooks/useSubscription";
import { subscriptionService } from "../services/subscriptionService";
import type { Plan } from "../services/subscriptionService";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { PaymentButton } from "../components/PaymentButton";

const PlansPage = () => {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useSubscription(user?.id);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log("Fetching plans...");
        const data = await subscriptionService.getPlans();
        console.log("Plans fetched:", data);
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-charcoal-600 dark:text-mint-300 text-lg">
            Unlock the full potential of SkillSynergy with our flexible pricing plans.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const isCurrent = subscription?.plan_id === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300
                  ${isCurrent 
                    ? 'bg-white dark:bg-charcoal-800 border-emerald-500 shadow-premium-emerald transform scale-105 z-10' 
                    : 'bg-white dark:bg-charcoal-800 border-transparent hover:border-mint-200 dark:hover:border-charcoal-600 shadow-lg'
                  }
                `}
              >
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md">
                    <SparklesIcon className="w-4 h-4" />
                    Current Plan
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-charcoal-500 dark:text-mint-400 mt-1 min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-charcoal-900 dark:text-white">
                    {plan.currency === 'INR' ? '₹' : '$'}{plan.price}
                  </span>
                  <span className="text-charcoal-500 dark:text-mint-400">
                    /{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>

                <div className="flex-grow space-y-3 mb-8">
                  {plan.features && Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-charcoal-600 dark:text-mint-300">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: <strong>{String(value)}</strong>
                      </span>
                    </div>
                  ))}
                </div>

                <PaymentButton 
                  plan={{
                    id: plan.id,
                    name: plan.name,
                    code: plan.code,
                    price: plan.price,
                    billing_cycle: plan.billing_cycle
                  }}
                  user={{
                    id: user!.id,
                    name: user!.email || 'User',
                    email: user!.email,
                    phone: ''
                  }}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Subscription Details (Debug/Info) */}
        {subscription && (
          <div className="mt-12 p-6 bg-white dark:bg-charcoal-800 rounded-xl shadow-sm border border-gray-100 dark:border-charcoal-700">
            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-4">Subscription Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-charcoal-900 dark:text-white capitalize">{subscription.status}</span>
              </div>
              <div>
                <span className="block text-gray-500 dark:text-gray-400">Started</span>
                <span className="font-medium text-charcoal-900 dark:text-white">{new Date(subscription.started_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-gray-500 dark:text-gray-400">Renews/Expires</span>
                <span className="font-medium text-charcoal-900 dark:text-white">
                  {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlansPage;
