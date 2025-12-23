import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Cookie, Settings, ShieldCheck, Info, ExternalLink, ToggleRight } from 'lucide-react';

const CookiePolicyPage = () => {
  const lastUpdated = "December 23, 2025";

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Cookie Policy - SkillSynergy</title>
        <meta name="description" content="SkillSynergy Cookie Policy. Learn how we use cookies including Google AdSense advertising cookies and how you can manage them." />
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
            Last Updated: {lastUpdated}
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
              Cookies set by the website owner (in this case, SkillSynergy) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
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
                  These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas, session management, and authentication.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal-800 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Performance & Functionality Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your preferences) may become unavailable.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-charcoal-800 p-6 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analytics & Customization Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">Advertising Cookies</h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and selecting advertisements based on your interests.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Google AdSense Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-emerald-500" />
              3. Google AdSense & Advertising Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use Google AdSense to display advertisements on our website. Google, as a third-party advertising vendor, uses cookies to serve ads on our site. Below are the specific cookies used:
            </p>
            
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-charcoal-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Cookie Name</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Purpose</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-400">
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">DSID</td>
                    <td className="py-3 px-4">Used to identify a signed-in user on non-Google sites for the purpose of ad personalization</td>
                    <td className="py-3 px-4">2 weeks</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">IDE</td>
                    <td className="py-3 px-4">Used by Google DoubleClick for registering and reporting user actions on the website for measuring ad effectiveness</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">NID</td>
                    <td className="py-3 px-4">Stores visitor preferences and personalizes ads on Google websites</td>
                    <td className="py-3 px-4">6 months</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">1P_JAR</td>
                    <td className="py-3 px-4">Gathers website statistics and tracks conversion rates</td>
                    <td className="py-3 px-4">1 month</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">ANID</td>
                    <td className="py-3 px-4">Used for advertising purposes, storing a unique ID for displaying ads</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-charcoal-700">
                    <td className="py-3 px-4 font-mono text-xs">CONSENT</td>
                    <td className="py-3 px-4">Stores the user's cookie consent state</td>
                    <td className="py-3 px-4">17 years</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-xs">__gads</td>
                    <td className="py-3 px-4">Enables sites to show Google ads, including personalized ads</td>
                    <td className="py-3 px-4">13 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-4">
              These cookies are set by Google and its advertising partners. For more information about how Google uses data, please visit: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">How Google uses data when you use our partners' sites or apps</a>.
            </p>
          </section>

          {/* 4. IAB TCF Compliance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. IAB Transparency and Consent Framework (TCF)
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For users in the European Economic Area (EEA), the UK, and Switzerland, we participate in the IAB Europe Transparency and Consent Framework (TCF) to obtain, store, and communicate user consent preferences for personalized advertising.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              When you first visit our website from these regions, you will be presented with a consent banner that allows you to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mt-2">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences by category</li>
            </ul>
          </section>

          {/* 5. How to control cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-500" />
              5. How can I control cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">Browser Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas may be restricted.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2 flex items-center gap-2">
              <ToggleRight className="w-5 h-5 text-emerald-500" />
              Opt-Out Options
            </h3>
            <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg p-6 mt-4">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Google Ads Settings:</strong> <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">google.com/settings/ads</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Digital Advertising Alliance (US):</strong> <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">aboutads.info/choices</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>European Interactive Digital Advertising Alliance:</strong> <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">youronlinechoices.eu</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">optout.networkadvertising.org</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Updates to this policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              6. Updates to this Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>

          {/* 7. Contact Us */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about our use of cookies or other technologies, please contact us:
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

export default CookiePolicyPage;
