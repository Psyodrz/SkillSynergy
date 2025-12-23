import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import { Mail, MapPin, Clock, Shield, User, Building } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Contact Us - SkillSynergy</title>
        <meta name="description" content="Get in touch with SkillSynergy support. We are here to help with any questions, feedback, or grievances." />
      </Helmet>
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out to our team for support, feedback, or inquiries.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Email Support */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:aditya.s70222@gmail.com" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                    aditya.s70222@gmail.com
                  </a>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Registered Address</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    SkillSynergy<br />
                    Lucknow, Uttar Pradesh<br />
                    India - 226001
                  </p>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Support Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                    Saturday: 10:00 AM - 2:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Grievance Officer Section */}
            <div className="mt-12 bg-white dark:bg-charcoal-800 rounded-xl border border-gray-200 dark:border-charcoal-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Grievance Officer</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                In accordance with the Information Technology Act, 2000, IT (Intermediary Guidelines) Rules, 2021, and Consumer Protection (E-Commerce) Rules, 2020:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Name: <strong className="text-gray-900 dark:text-white">Aditya Srivastava</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Designation: <strong className="text-gray-900 dark:text-white">Grievance Officer</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Email: <a href="mailto:aditya.s70222@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">aditya.s70222@gmail.com</a></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-charcoal-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Response Time:</strong> We will acknowledge your grievance within <strong>48 hours</strong> and aim to resolve it within <strong>30 days</strong> from the date of receipt.
                </p>
              </div>
            </div>

            {/* Business Entity Info */}
            <div className="mt-6 bg-gray-50 dark:bg-charcoal-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Business Entity Information</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Entity Name: SkillSynergy<br />
                Country of Origin: India<br />
                Nature of Business: Digital Learning Platform (Educational Services)
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-charcoal-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Founders:</strong> Aditya Srivastava (Owner) & Bhavya Srivastava (CEO)
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
