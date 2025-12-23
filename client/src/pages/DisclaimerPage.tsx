import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { AlertTriangle, ExternalLink, BookOpen, DollarSign, Scale, Info } from 'lucide-react';

const DisclaimerPage = () => {
  const lastUpdated = "December 23, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Disclaimer - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Disclaimer. Important notice about the use of our website, external links, advertising, and educational content." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Disclaimer</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read this disclaimer carefully before using the SkillSynergy website.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          
          {/* 1. General Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-emerald-500" />
              1. General Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The information provided on SkillSynergy ("we," "us," or "our") website is for general informational and educational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the website.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Important:</strong> Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </div>
          </section>

          {/* 2. Educational Content Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-500" />
              2. Educational Content Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              SkillSynergy is a digital learning platform that provides educational content and resources. Please note:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Our content is designed to provide general educational information and should not be considered as a substitute for professional advice, training, or certification.</li>
              <li>We do not guarantee any specific outcomes, certifications, or employment opportunities as a result of using our platform.</li>
              <li>The educational content may contain information that is subject to change, and we do not warrant that such content is up-to-date at all times.</li>
              <li>Users are responsible for verifying the accuracy and applicability of any educational content to their specific circumstances.</li>
            </ul>
          </section>

          {/* 3. No Professional Advice */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-500" />
              3. No Professional Advice
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The content on this website is not intended to be a substitute for professional advice. This includes, but is not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Legal Advice:</strong> The content on this site does not constitute legal advice. For legal matters, consult a qualified attorney.</li>
              <li><strong>Financial Advice:</strong> We do not provide financial, investment, or tax advice. Consult a qualified financial advisor for such matters.</li>
              <li><strong>Medical Advice:</strong> Any health-related content is for informational purposes only and is not a substitute for professional medical advice.</li>
              <li><strong>Career Advice:</strong> While we provide educational guidance, career decisions should be made after consultation with appropriate professionals.</li>
            </ul>
          </section>

          {/* 4. External Links Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-emerald-500" />
              4. External Links Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The SkillSynergy website may contain links to external websites that are not provided or maintained by us. Please note that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</li>
              <li>We have no control over the content, privacy policies, or practices of any third-party websites.</li>
              <li>Inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.</li>
              <li>We are not responsible for any damages or losses arising from your use of external websites.</li>
            </ul>
          </section>

          {/* 5. Advertising Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-500" />
              5. Advertising Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This website displays advertisements through third-party advertising networks, including Google AdSense. Please be aware of the following:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>Advertisements displayed on this website are served by third-party advertising companies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>These companies may use cookies to serve ads based on your prior visits to our website or other websites.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>The products or services advertised are not endorsed, sponsored, or recommended by SkillSynergy unless specifically stated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>We are not responsible for the content, claims, or representations made in advertisements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>Users should conduct their own due diligence before purchasing any products or services advertised on this site.</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              For more information about how advertising cookies work, please see our <a href="/cookies" className="text-emerald-600 dark:text-emerald-400 hover:underline">Cookie Policy</a>.
            </p>
          </section>

          {/* 6. Earnings & Results Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Earnings & Results Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We make no representations or guarantees about the results you can achieve through our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Any examples of success or results mentioned are not intended to represent typical results.</li>
              <li>Individual results will vary based on effort, background, and many other factors.</li>
              <li>We do not guarantee that you will achieve any specific academic, professional, or financial outcomes.</li>
              <li>Past performance of any educational program does not guarantee future results.</li>
            </ul>
          </section>

          {/* 7. User-Generated Content Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. User-Generated Content Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our platform may include content generated by users (comments, projects, forum posts, etc.). Please note:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>User-generated content represents the views and opinions of the individual users and does not necessarily reflect our views.</li>
              <li>We do not endorse, guarantee, or assume responsibility for user-generated content.</li>
              <li>Users are solely responsible for the content they create and share on our platform.</li>
              <li>We reserve the right to remove any user-generated content at our discretion.</li>
            </ul>
          </section>

          {/* 8. Fair Use Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Fair Use Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This website may contain copyrighted material, the use of which may not have been specifically authorized by the copyright owner. This material is made available for educational purposes, thus constituting "fair use" as provided in section 107 of the US Copyright Law and similar provisions in Indian Copyright Act, 1957.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you wish to use copyrighted material from this site for purposes that go beyond fair use, you must obtain permission from the copyright owner.
            </p>
          </section>

          {/* 9. Changes to This Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Changes to This Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify this disclaimer at any time without prior notice. Your continued use of the website after any changes indicates your acceptance of the modified disclaimer.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Contact Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about this Disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6">
              <p className="font-bold text-gray-900 dark:text-white">SkillSynergy</p>
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

export default DisclaimerPage;
