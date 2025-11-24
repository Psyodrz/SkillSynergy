import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Cookie, Settings, ShieldCheck, Info } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Cookie Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Cookie Policy. Learn how we use cookies to improve your experience and how you can manage them." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <Cookie className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            This policy explains how SkillSynergy uses cookies and similar technologies to recognize you when you visit our website.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last Updated: November 25, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-800 p-8 md:p-12 prose dark:prose-invert max-w-none">
          {/* 1. What are cookies? */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-emerald-500" />
              1. What are cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Cookies set by the website owner (in this case, SkillSynergy) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies".
            </p>
          </section>

          {/* 2. Why do we use cookies? */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Why do we use cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
            </p>
            <div className="grid gap-6 mt-6">
              <div className="bg-gray-50 dark:bg-charcoal-800 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Essential Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal-800 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Performance &amp; Functionality Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal-800 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analytics &amp; Customization Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
                </p>
              </div>
            </div>
          </section>

          {/* 3. How can I control cookies? */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-500" />
              3. How can I control cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. In addition, most advertising networks offer you a way to opt out of targeted advertising.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
          </section>

          {/* 4. Updates to this Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              4. Updates to this Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>

          {/* 5. Contact Us */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about our use of cookies or other technologies, please email us at aditya.s70222@gmail.com.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
