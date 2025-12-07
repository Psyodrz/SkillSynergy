import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText, Server, Globe, Megaphone } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "November 25, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Privacy Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and Indian laws." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy details how we handle your data with the utmost care and security.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-emerald-500" />
              1. Introduction and Scope
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy ("we," "us," or "our") operates the SkillSynergy platform. This Privacy Policy applies to all visitors, users, and others who access the Service ("Users"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at aditya.s70222@gmail.com.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This policy complies with the Information Technology Act, 2000 (India) and the General Data Protection Regulation (GDPR) for our European users.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-500" />
              2. Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We collect information that you provide directly to us, information we obtain automatically when you visit the Service, and information from third-party sources.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">A. Personal Information You Disclose to Us</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
              <li><strong>Contact Data:</strong> Email address, telephone number.</li>
              <li><strong>Profile Data:</strong> Your interests, preferences, feedback, and survey responses.</li>
              <li><strong>Professional Data:</strong> Skills, experience, education history, and portfolio links.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">B. Information Automatically Collected</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Log Data:</strong> IP address, browser type, operating system, referring/exit pages, and date/time stamps.</li>
              <li><strong>Device Data:</strong> Information about the device you use to access our services.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-500" />
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use personal information collected via our Services for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>To provide and maintain our Service, including monitoring the usage of our Service.</li>
              <li>To manage your Account: to manage your registration as a user of the Service.</li>
              <li>To contact you: regarding updates or informative communications related to the functionalities.</li>
              <li>To provide you with news, special offers, and general information about other goods, services, and events.</li>
              <li>To manage your requests: To attend and manage your requests to us.</li>
              <li>To facilitate peer-to-peer matching: Our algorithm uses your skills and interests to suggest connections.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-500" />
              4. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-emerald-500" />
              5. Data Retention
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your Privacy Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-emerald-500" />
              7. Advertising Partners
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may work with third-party advertising companies to serve ads when you visit our website. These companies may collect and use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">Google AdSense</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use Google AdSense to display ads on our site. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Google Ads Settings</a>.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              For more information on how Google uses data when you use our partners' sites or apps, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">How Google uses data when you use our partners’ sites or apps</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have questions or comments about this policy, you may email us at aditya.s70222@gmail.com or by post to:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">SkillSynergy</p>
              <p className="text-gray-600 dark:text-gray-400">Lucknow, Uttar Pradesh</p>
              <p className="text-gray-600 dark:text-gray-400">India</p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
