import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { ScrollText, CheckCircle, AlertCircle, Scale, CreditCard, Shield, FileText } from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = "December 23, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Terms and Conditions - SkillSynergy</title>
        <meta name="description" content="Read the Terms and Conditions for using SkillSynergy. Understand our policies on digital services, user responsibilities, and legal compliance." />
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
            Last Updated: {lastUpdated}
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
              Welcome to SkillSynergy ("we," "our," or "us"). We provide a digital platform for professionals to share skills, collaborate on projects, find mentors, and access educational content. These Terms and Conditions ("Terms") govern your use of our website and services (collectively, the "Service").
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-900 dark:text-white">Business Entity Information:</p>
              <p className="text-gray-600 dark:text-gray-400">Entity Name: SkillSynergy</p>
              <p className="text-gray-600 dark:text-gray-400">Registered Address: Lucknow, Uttar Pradesh, India</p>
              <p className="text-gray-600 dark:text-gray-400">Contact Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400">Founders: Aditya Srivastava (Owner) & Bhavya Srivastava (CEO)</p>
            </div>
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
                    SkillSynergy is a digital learning platform. We provide access to educational content, skill modules, community features, and collaborative tools. We do not sell or ship any physical products. All services are delivered electronically.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Our services include:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Access to educational content and learning modules</li>
              <li>Access to a network of professionals and mentors</li>
              <li>Project collaboration tools and workspaces</li>
              <li>Digital messaging and communication features</li>
              <li>Profile hosting and portfolio display</li>
              <li>AI-assisted learning recommendations</li>
            </ul>
          </section>

          {/* 3. User Accounts and Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts and Responsibilities</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security of your account credentials and not share them with others.</li>
              <li>Accept full responsibility for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Not use the platform for any illegal or unauthorized purpose.</li>
              <li>Comply with all applicable laws and regulations.</li>
            </ul>
          </section>

          {/* 4. Payment Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              4. Payment Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For any paid services or features on our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Payment Processing:</strong> All payments are processed securely through <strong>Razorpay</strong>, a RBI-authorized payment aggregator. We do not store your complete payment card details.</li>
              <li><strong>Currency:</strong> All prices are displayed and charged in Indian Rupees (INR) unless otherwise specified.</li>
              <li><strong>Taxes:</strong> All applicable taxes (including GST) are included in the displayed prices unless stated otherwise.</li>
              <li><strong>Failed Transactions:</strong> In case of failed transactions where money is debited, refunds will be processed within 5-7 working days as per RBI guidelines.</li>
              <li><strong>Receipts:</strong> Electronic receipts/invoices will be sent to your registered email address.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              By making a payment, you agree to Razorpay's Terms of Service and Privacy Policy available at <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">razorpay.com/terms</a>.
            </p>
          </section>

          {/* 5. Platform Usage */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Platform Usage</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy provides access to educational content and community features.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Access:</strong> Core features are available to registered users. Some premium features may require payment.</li>
              <li><strong>Content:</strong> Educational materials, skill modules, and collaborative tools are provided as-is.</li>
              <li><strong>Fair Use:</strong> Users should utilize platform resources responsibly and not abuse system capabilities.</li>
              <li><strong>Availability:</strong> We strive for 99.9% uptime but do not guarantee uninterrupted service.</li>
            </ul>
          </section>

          {/* 6. Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Prohibited Activities</h2>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">Restricted Activities</h3>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    SkillSynergy strictly prohibits the use of its platform for the sale or promotion of financial services, investment schemes, adult content, gambling, betting, cryptocurrency services, or any illegal activities.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or extract data</li>
              <li>Infringe on intellectual property rights of others</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              Users found engaging in prohibited activities will have their accounts terminated immediately without refund.
            </p>
          </section>

          {/* 7. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary laws. You may not copy, redistribute, use, or publish any part of the Site without our express written permission.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              User-generated content remains the property of the respective users, but by posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with our Service.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SkillSynergy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </section>

          {/* 9. Indemnification */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Indemnification</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You agree to indemnify, defend, and hold harmless SkillSynergy and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
            </p>
          </section>

          {/* 10. Legal Compliance */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              10. Legal Compliance
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy operates in compliance with the following Indian laws and regulations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Information Technology Act, 2000:</strong> We comply with all provisions including those related to electronic contracts, digital signatures, and cybersecurity.</li>
              <li><strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:</strong> We operate as an intermediary and have implemented the required due diligence measures.</li>
              <li><strong>Consumer Protection Act, 2019 and E-Commerce Rules, 2020:</strong> We follow all consumer protection guidelines for digital services.</li>
              <li><strong>Digital Personal Data Protection Act, 2023:</strong> We handle personal data in accordance with this act (see our Privacy Policy).</li>
              <li><strong>Payment and Settlement Systems Act, 2007:</strong> Our payment processing complies with RBI guidelines.</li>
            </ul>
          </section>

          {/* 11. Governing Law & Jurisdiction */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-500" />
              11. Governing Law & Jurisdiction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Lucknow, Uttar Pradesh, India</strong>.
            </p>
          </section>

          {/* 12. Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              12. Dispute Resolution
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In case of any dispute or grievance:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
              <li><strong>Step 1:</strong> Contact our Grievance Officer at aditya.s70222@gmail.com. We will acknowledge your complaint within 48 hours and aim to resolve it within 30 days.</li>
              <li><strong>Step 2:</strong> If unsatisfied with the resolution, you may approach the appropriate consumer forum or court.</li>
              <li><strong>Step 3:</strong> For payment-related disputes, you may also approach the RBI Ombudsman for Digital Transactions.</li>
            </ol>
          </section>

          {/* 13. Modifications to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. Modifications to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          {/* 14. Severability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">14. Severability</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          {/* 15. Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">15. Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For any questions regarding these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-900 dark:text-white">SkillSynergy Support</p>
              <p className="text-gray-600 dark:text-gray-400">Email: aditya.s70222@gmail.com</p>
              <p className="text-gray-600 dark:text-gray-400">Address: Lucknow, Uttar Pradesh, India</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <strong>Grievance Officer:</strong> Aditya Srivastava<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
