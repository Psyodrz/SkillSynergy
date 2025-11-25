
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Starter Learning Plan',
      price: '₹0',
      period: '/month',
      description: 'Perfect for getting started and exploring the learning modules.',
      features: [
        'Basic Profile',
        'Join up to 3 Challenges',
        'Community Access',
        'Read-only Message Access'
      ],
      cta: 'Get Started',
      highlight: false,
      icon: Star
    },
    {
      name: 'Pro Learning Monthly',
      price: '₹499',
      period: '/month',
      description: 'For active learners who want to practice.',
      features: [
        'Enhanced Profile',
        'Unlimited Challenges',
        'Direct Doubt Support',
        'Priority Support',
        'Skill Certificates'
      ],
      cta: 'Upgrade Now',
      highlight: true,
      icon: Zap
    },
    {
      name: 'Pro Learning Yearly',
      price: '₹4999',
      period: '/year',
      description: 'Best value for long-term growth and commitment.',
      features: [
        'All Pro Features',
        '2 Months Free',
        'Verified Learner Badge',
        'Featured Portfolio',
        'Early Access to New Modules'
      ],
      cta: 'Upgrade Now',
      highlight: false,
      icon: Zap
    },
    {
      name: 'Premium Learning Bundle',
      price: '₹9999',
      period: '/year',
      description: 'The ultimate toolkit for serious instructors and contributors.',
      features: [
        'All Pro Learning Features',
        'Instructor Tools',
        'Analytics Dashboard',
        'Custom Domain Support',
        'Dedicated Success Manager'
      ],
      cta: 'Upgrade Now',
      highlight: false,
      icon: Crown
    }
  ];

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Learning Plans - SkillSynergy</title>
        <meta name="description" content="Choose the right plan for your learning growth. Transparent pricing for guided paths, practice, and skill-sharing." />
      </Helmet>
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. No hidden fees. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border ${
                plan.highlight 
                  ? 'border-emerald-500 ring-2 ring-emerald-500 ring-opacity-50' 
                  : 'border-gray-200 dark:border-charcoal-800'
              } p-8 flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  plan.highlight ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-charcoal-800 text-gray-600 dark:text-gray-400'
                }`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/login" 
                className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all ${
                  plan.highlight
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-100 dark:bg-charcoal-800 hover:bg-gray-200 dark:hover:bg-charcoal-700 text-gray-900 dark:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            * All subscriptions auto-renew unless cancelled. Prices are in INR and inclusive of applicable taxes.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Secure payment processing by Razorpay</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
