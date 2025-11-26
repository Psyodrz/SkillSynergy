import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { CheckCircle, HelpCircle } from 'lucide-react';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Service Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy is a completely free learning platform. Learn about our service policy and how we handle user accounts." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Service Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            SkillSynergy is a completely free learning platform with no paid subscriptions or transactions.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: November 25, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          {/* Free Platform Notice */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Learning Platform</h2>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-6 mb-4">
              <div className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    No Subscriptions or Payments Required
                  </h3>
                  <p className="text-emerald-800 dark:text-emerald-200">
                    SkillSynergy is provided as a completely free service. All features, including skill modules, community discussions, collaborative projects, and learning resources are available to all registered users at no cost.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can manage your account and data through your profile settings:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Update your personal information and preferences at any time</li>
              <li>Delete your account and associated data through Settings</li>
              <li>Export your data by contacting support</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
              Questions or Concerns?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about our service or need assistance, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">SkillSynergy Support</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400">Location: Lucknow, Uttar Pradesh, India</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPage;
