import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { RefreshCcw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Refund and Cancellation Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Refund and Cancellation Policy. Understand our terms for subscription cancellations and refund eligibility." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <RefreshCcw className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refund & Cancellation Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We strive to provide the best experience. Here is how we handle cancellations and refunds for our premium services.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: November 24, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Cancellation Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You may cancel your SkillSynergy subscription at any time.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-6 mb-4">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                How to Cancel
              </h3>
              <p className="text-emerald-800 dark:text-emerald-200">
                Go to <strong>Settings {'>'} Billing</strong> in your dashboard and click on "Cancel Subscription". Your access to premium features will continue until the end of your current billing period.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Refund Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We offer a limited refund policy to ensure customer satisfaction while preventing abuse of our digital services.
            </p>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Monthly Subscriptions</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monthly subscriptions are non-refundable. If you cancel your monthly subscription, you will retain access to the service for the remainder of that month, but you will not receive a refund for the current billing cycle.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Yearly Subscriptions</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We offer a <strong>7-day money-back guarantee</strong> for yearly subscriptions. If you are not satisfied with our service, you may request a full refund within 7 calendar days of your initial purchase.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Refund requests made after 7 days of a yearly subscription purchase will not be processed.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Exceptions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy reserves the right to refuse a refund if:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>We detect abuse of the platform or violation of our Terms of Service.</li>
              <li>The account has been banned for fraudulent activity.</li>
              <li>The refund request is made outside the eligible period.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
              4. Contact for Refunds
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To request a refund, please contact our support team with your order details and reason for the request.
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">Support Team</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Please allow up to 5-7 business days for the refund to appear in your bank account after approval.</p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPage;
