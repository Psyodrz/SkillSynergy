import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { ScrollText, CheckCircle, AlertCircle } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Terms and Conditions - SkillSynergy</title>
        <meta name="description" content="Read the Terms and Conditions for using SkillSynergy. Understand our policies on digital services, user responsibilities, and payments." />
      </Helmet>
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <ScrollText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using SkillSynergy. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: November 25, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          {/* 1. Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">1. Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Welcome to SkillSynergy ("we," "our," or "us"). We provide a digital platform for professionals to share skills, collaborate on projects, and find mentors. These Terms and Conditions govern your use of our website and services.
            </p>
          </section>
          {/* 2. Nature of Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">2. Nature of Services</h2>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm mb-1">Digital Services Only</h3>
                  <p className="text-emerald-800 dark:text-emerald-200 text-sm">
                    SkillSynergy deals exclusively in digital goods and services. We do not sell or ship any physical products. All subscriptions, mentorship sessions, and collaborative tools are accessed online.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Our services include:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Access to a network of professionals and mentors.</li>
              <li>Project collaboration tools and workspaces.</li>
              <li>Digital messaging and communication features.</li>
              <li>Profile hosting and portfolio display.</li>
            </ul>
          </section>
          {/* 3. User Accounts and Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts and Responsibilities</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Provide accurate and complete information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
              <li>Not use the platform for any illegal or unauthorized purpose.</li>
            </ul>
          </section>
          {/* 4. Payments and Subscriptions */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Payments and Subscriptions</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We offer Free, Pro Monthly, Pro Yearly, and Deluxe Yearly plans.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Billing:</strong> Payments are processed securely via Razorpay. Subscriptions auto-renew unless cancelled.</li>
              <li><strong>Currency:</strong> All transactions are processed in INR (Indian Rupees).</li>
              <li><strong>Taxes:</strong> Prices may be exclusive of applicable taxes, which will be calculated at checkout.</li>
            </ul>
          </section>
          {/* 5. Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Prohibited Activities</h2>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">Restricted Businesses</h3>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    SkillSynergy strictly prohibits the use of its platform for the sale or promotion of financial services, investment schemes, adult content, gambling, betting, or cryptocurrency services.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Users found engaging in these activities will have their accounts terminated immediately without refund.
            </p>
          </section>
          {/* 6. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws. You may not copy, redistribute, use or publish any part of the Site without our express permission.
            </p>
          </section>
          {/* 7. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>
          {/* 8. Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For any questions regarding these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-900 dark:text-white">SkillSynergy Support</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400">Address: Lucknow, Uttar Pradesh, India</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
