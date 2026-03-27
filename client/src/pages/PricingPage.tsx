import { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PricingCard from '../components/PricingCard';
import { subscriptionPlans } from '../data/plans';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import PaymentSuccessModal from '../components/PaymentSuccessModal';

const PricingPage = () => {
  const { isAuthenticated, profile, refreshSession } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePaymentSuccess = (planName: string) => {
    setPurchasedPlan(planName);
    setShowSuccess(true);
    refreshSession?.();
  };

  return (
    <>
      <Helmet>
        <title>Pricing - SkillSynergy Plans</title>
        <meta name="description" content="Choose the perfect SkillSynergy plan. Start free or unlock advanced features with Pro and Elite plans." />
      </Helmet>

      <div className="min-h-screen bg-mint-100 dark:bg-charcoal-900 transition-colors duration-300">
        {/* Navigation */}
        <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl bg-mint-100/80 dark:bg-charcoal-900/90 border-b border-teal-200 dark:border-charcoal-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                to={isAuthenticated ? "/dashboard" : "/"} 
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img src="/logo.png" alt="SkillSynergy Logo" className="w-10 h-10 object-contain" />
                <h1 className="text-2xl font-bold bg-gradient-emerald bg-clip-text text-transparent">
                  SkillSynergy
                </h1>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle />
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-emerald hover:opacity-90 text-white font-semibold rounded-xl shadow-emerald-glow transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-700/50 mb-6"
            >
              <SparklesIcon className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Simple, Transparent Pricing</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-charcoal-900 dark:text-white mb-6"
            >
              Choose Your <span className="bg-gradient-emerald bg-clip-text text-transparent">Learning Plan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-charcoal-600 dark:text-mint-200 max-w-2xl mx-auto"
            >
              Start free and upgrade as you grow. Every plan includes access to our core learning platform.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-12 flex flex-col items-center"
            >
              <div className="flex items-center space-x-4 p-1.5 bg-mint-50/50 dark:bg-charcoal-800/50 backdrop-blur-md rounded-2xl border border-teal-200 dark:border-charcoal-700 shadow-sm relative overflow-hidden group">
                {/* Animated Background Slide */}
                <motion.div
                  className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-emerald-glow z-0"
                  initial={false}
                  animate={{ x: billingCycle === 'monthly' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 whitespace-nowrap ${
                    billingCycle === 'monthly' ? 'text-white' : 'text-charcoal-600 dark:text-mint-300'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 whitespace-nowrap flex items-center space-x-2 ${
                    billingCycle === 'yearly' ? 'text-white' : 'text-charcoal-600 dark:text-mint-300'
                  }`}
                >
                  <span>Yearly</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${
                    billingCycle === 'yearly' ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white shadow-emerald-glow'
                  }`}>
                    Save 20%
                  </span>
                </button>
              </div>
              <p className="mt-4 text-xs font-semibold text-charcoal-400 dark:text-mint-400/60 flex items-center space-x-1">
                <SparklesIcon className="h-3.5 w-3.5" />
                <span>Get 2 months free with annual billing</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <PricingCard
                    plan={plan}
                    billingCycle={billingCycle}
                    isCurrentPlan={isAuthenticated && ((profile as any)?.subscription_plan || 'free') === plan.id}
                    onSuccess={(name) => handlePaymentSuccess(name)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* FAQ-like section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <div className="max-w-2xl mx-auto space-y-6 text-left mt-8">
                {[
                  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your access continues until the end of the billing period.' },
                  { q: 'Is there a free trial?', a: 'The Basic plan is completely free forever. You can try all core features before upgrading.' },
                  { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards, net banking, and all major Indian payment methods via Razorpay.' },
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-mint-200 dark:border-charcoal-700 shadow-sm">
                    <h3 className="font-bold text-charcoal-900 dark:text-white mb-2">{item.q}</h3>
                    <p className="text-charcoal-600 dark:text-mint-200 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom CTA */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-emerald hover:opacity-90 text-white font-bold rounded-2xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105"
                >
                  <SparklesIcon className="h-6 w-6" />
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
        
        {/* Success Modal */}
        <PaymentSuccessModal 
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          planName={purchasedPlan}
        />
      </div>
    </>
  );
};

export default PricingPage;
