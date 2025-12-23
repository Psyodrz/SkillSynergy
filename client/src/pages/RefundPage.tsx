import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { CheckCircle, HelpCircle, XCircle, Clock, CreditCard, AlertTriangle } from 'lucide-react';

const RefundPage = () => {
  const lastUpdated = "December 23, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Refund & Cancellation Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Refund and Cancellation Policy. Learn about our refund process, cancellation terms, and timeline as per RBI guidelines." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refund & Cancellation Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We value your trust. This policy outlines our refund and cancellation procedures in accordance with RBI guidelines and consumer protection laws.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          
          {/* 1. Overview */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy is committed to providing a transparent and fair refund and cancellation policy. This policy is designed to protect your rights as a consumer while ensuring compliance with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Consumer Protection Act, 2019</li>
              <li>Consumer Protection (E-Commerce) Rules, 2020</li>
              <li>RBI Guidelines on Payment Aggregators and Gateways</li>
              <li>Payment and Settlement Systems Act, 2007</li>
            </ul>
          </section>

          {/* 2. Free Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              2. Free Services
            </h2>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-6 mb-4">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    Core Features Are Free
                  </h3>
                  <p className="text-emerald-800 dark:text-emerald-200">
                    Most of SkillSynergy's core features, including skill modules, community discussions, collaborative projects, and learning resources are available to all registered users at no cost. No refund is applicable for free services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cancellation Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              3. Cancellation Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For any paid services or subscriptions:
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">A. Before Service Delivery</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>100% Refund:</strong> If you cancel your order before the service has been activated or delivered, you are entitled to a full refund.</li>
              <li><strong>Cancellation Window:</strong> You may cancel within 24 hours of placing your order without any deduction.</li>
              <li><strong>How to Cancel:</strong> Send an email to aditya.s70222@gmail.com with your order details and cancellation request.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">B. After Service Delivery</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Pro-rata Refund:</strong> For subscription services, cancellation after activation may be eligible for a pro-rata refund based on unused time.</li>
              <li><strong>No Refund:</strong> For one-time purchases (e.g., course access), refunds are not available once the content has been accessed or downloaded.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">C. Subscription Cancellation</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>You may cancel your subscription at any time from your account settings.</li>
              <li>Cancellation will take effect at the end of your current billing period.</li>
              <li>You will retain access to paid features until the end of the billing period.</li>
              <li>No automatic renewal will occur after cancellation.</li>
            </ul>
          </section>

          {/* 4. Refund Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-500" />
              4. Refund Policy
            </h2>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">A. Eligibility for Refund</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Service not delivered as described</li>
              <li>Technical issues preventing access to paid content</li>
              <li>Duplicate payment or overcharging</li>
              <li>Cancellation within the eligible cancellation window</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">B. Non-Refundable Items</h3>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-200 text-sm">
                  <li>Services that have been fully consumed or accessed</li>
                  <li>Downloadable content that has been downloaded</li>
                  <li>Personalized or customized services</li>
                  <li>Services cancelled after the refund window</li>
                  <li>Accounts terminated for policy violations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Refund Timeline */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-500" />
              5. Refund Timeline (As per RBI Guidelines)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Once your refund request is approved:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-charcoal-700">
                    <th className="text-left py-2 text-gray-900 dark:text-white">Payment Method</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Refund Timeline</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-400">
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-2">Credit/Debit Card</td>
                    <td className="py-2">5-7 working days</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-2">Net Banking</td>
                    <td className="py-2">5-7 working days</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-2">UPI</td>
                    <td className="py-2">2-3 working days</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-2">Wallets</td>
                    <td className="py-2">2-3 working days</td>
                  </tr>
                  <tr>
                    <td className="py-2">EMI</td>
                    <td className="py-2">7-10 working days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
              Note: Refund timelines are indicative and may vary based on your bank's processing time.
            </p>
          </section>

          {/* 6. Failed Transaction Refunds */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Failed Transaction Refunds</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In case of a failed transaction where money has been debited from your account:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Refunds are initiated automatically within T+5 working days (as per RBI guidelines).</li>
              <li>If you do not receive the refund within 5-7 business days, please contact your bank first.</li>
              <li>If the bank confirms the amount has not been reversed, contact us with your transaction ID.</li>
              <li>We will investigate with our payment partner (Razorpay) and ensure the refund is processed.</li>
            </ul>
          </section>

          {/* 7. How to Request a Refund */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. How to Request a Refund</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Send an email to <strong>aditya.s70222@gmail.com</strong> with the subject line "Refund Request".</li>
              <li>Include your registered email address and order/transaction ID.</li>
              <li>Provide a brief reason for the refund request.</li>
              <li>We will acknowledge your request within 48 hours.</li>
              <li>Approved refunds will be processed within 5-7 working days.</li>
            </ol>
          </section>

          {/* 8. Grievance Redressal */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
              8. Grievance Redressal
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you are unsatisfied with our response to your refund request:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">Grievance Officer</p>
              <p className="text-gray-600 dark:text-gray-400">Name: Aditya Srivastava</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400">Address: Lucknow, Uttar Pradesh, India</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <strong>Response Time:</strong> We will acknowledge grievances within 48 hours and resolve within 30 days.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
                For payment-related disputes, you may also contact the RBI Ombudsman for Digital Transactions at <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">cms.rbi.org.in</a>.
              </p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPage;
