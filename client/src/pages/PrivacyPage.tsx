import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText, Server, Globe, Megaphone, CreditCard, Scale, UserCheck } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "December 23, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Privacy Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with DPDPA 2023, GDPR, and Indian laws." />
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
              SkillSynergy ("we," "us," or "our") operates the SkillSynergy platform (the "Service"). This Privacy Policy applies to all visitors, users, and others who access the Service ("Users"). We are committed to protecting your personal information and your right to privacy.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Business Details:</strong><br />
              Entity Name: SkillSynergy<br />
              Registered Address: Lucknow, Uttar Pradesh, India<br />
              Contact Email: aditya.s70222@gmail.com
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              This policy complies with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>, the Information Technology Act, 2000 (India), and the General Data Protection Regulation (GDPR) for our European users.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-500" />
              2. Legal Basis for Processing (DPDPA 2023)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Under the Digital Personal Data Protection Act, 2023, we process your personal data based on the following lawful grounds:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for specific purposes.</li>
              <li><strong>Contractual Necessity:</strong> Processing is necessary to perform our contract with you (providing our services).</li>
              <li><strong>Legal Obligation:</strong> Processing is necessary to comply with applicable laws and regulations.</li>
              <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests, such as improving our services and preventing fraud.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-500" />
              3. Information We Collect
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
              <li><strong>Cookie Data:</strong> Data collected through cookies and similar tracking technologies (see our Cookie Policy for details).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-500" />
              4. Payment Data Handling
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When you make payments through our platform, we use <strong>Razorpay</strong> as our payment gateway provider. We do not directly store, process, or retain your complete payment card details.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>All payment transactions are encrypted using SSL technology and processed securely by Razorpay.</li>
              <li>Razorpay is PCI-DSS compliant, ensuring the highest standards of payment security.</li>
              <li>We may receive transaction confirmation details including transaction ID, amount, date, and payment status.</li>
              <li>Your payment information is subject to Razorpay's Privacy Policy: <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">razorpay.com/privacy</a></li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              We comply with the Payment and Settlement Systems Act, 2007 and RBI guidelines for payment data handling.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-500" />
              5. How We Use Your Information
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
              <li>To process payments: Securely process transactions through our payment provider.</li>
              <li>To comply with legal obligations: Including KYC requirements and tax regulations.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-500" />
              6. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. These include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted storage for sensitive data at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Compliance with Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-emerald-500" />
              7. Data Retention
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-500" />
              8. Your Data Principal Rights (DPDPA 2023)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Under the Digital Personal Data Protection Act, 2023, you have the following rights as a Data Principal:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Right to Access:</strong> You have the right to obtain confirmation as to whether we are processing your personal data and to request access to your personal data.</li>
              <li><strong>Right to Correction:</strong> You have the right to request correction of inaccurate or misleading personal data and completion of incomplete personal data.</li>
              <li><strong>Right to Erasure:</strong> You have the right to request erasure of your personal data where it is no longer necessary for the purpose for which it was collected.</li>
              <li><strong>Right to Grievance Redressal:</strong> You have the right to have readily available means of registering grievances and receiving a response within a reasonable time.</li>
              <li><strong>Right to Nominate:</strong> You have the right to nominate another individual who can exercise your rights in case of your death or incapacity.</li>
              <li><strong>Right to Withdraw Consent:</strong> Where we rely on consent to process your data, you have the right to withdraw your consent at any time.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              To exercise any of these rights, please contact our Grievance Officer (details provided below).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-emerald-500" />
              9. Advertising Partners & Google AdSense
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may work with third-party advertising companies to serve ads when you visit our website. These companies may collect and use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">Google AdSense & Advertising Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use Google AdSense to display advertisements on our site. Google, as a third-party vendor, uses cookies to serve ads on our site based on your prior visits to our website or other websites.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>DART Cookie:</strong> Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.</li>
              <li><strong>NID Cookie:</strong> Used by Google to store preferences and other information like your preferred language and number of search results to show per page.</li>
              <li><strong>IDE Cookie:</strong> Used by Google to show personalized ads on non-Google websites.</li>
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">Opt-Out Options</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Google Ads Settings</a>.</li>
              <li>You can also opt out of third-party vendor's use of cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">aboutads.info</a>.</li>
              <li>For users in the EEA/UK, we comply with the IAB Transparency and Consent Framework (TCF) for obtaining consent.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              For more information on how Google uses data when you use our partners' sites or apps, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">How Google uses data when you use our partners' sites or apps</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your information may be transferred to and processed in countries other than India. These countries may have data protection laws that are different from the laws of India. We take appropriate safeguards to ensure your personal information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Children's Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our Service is not intended for children under the age of 18. We do not knowingly collect personal data from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us so that we can take necessary actions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              13. Grievance Officer & Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In accordance with the Information Technology Act, 2000 and DPDPA 2023, we have appointed a Grievance Officer to address your concerns:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">Grievance Officer Details</p>
              <p className="text-gray-600 dark:text-gray-400">Name: Aditya Srivastava</p>
              <p className="text-gray-600 dark:text-gray-400">Designation: Grievance Officer</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Address:</p>
              <p className="text-gray-600 dark:text-gray-400">SkillSynergy</p>
              <p className="text-gray-600 dark:text-gray-400">Lucknow, Uttar Pradesh</p>
              <p className="text-gray-600 dark:text-gray-400">India</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <strong>Response Time:</strong> We will acknowledge your grievance within 48 hours and resolve it within 30 days from the date of receipt.
              </p>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
