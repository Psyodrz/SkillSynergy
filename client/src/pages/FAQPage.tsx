import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is SkillSynergy?",
          a: "SkillSynergy is a professional collaboration platform designed to connect individuals with complementary skills. Whether you're looking for a mentor, a project partner, or someone to trade skills with, our platform uses smart matching to help you find the right people."
        },
        {
          q: "Is SkillSynergy free to use?",
          a: "Yes! We offer a robust Free plan that allows you to create a profile, list your skills, and connect with other users. We also offer Premium plans (Pro and Deluxe) for users who want enhanced visibility, unlimited messaging, and advanced project tools."
        },
        {
          q: "How does the matching algorithm work?",
          a: 'Our algorithm analyzes your profile, including your listed skills, interests, and goals ("I want to learn" vs "I can teach"). It then cross-references this with other users to suggest matches that are mutually beneficial.'
        }
      ]
    },
    {
      category: "Account & Profile",
      questions: [
        {
          q: "How do I verify my profile?",
          a: "Profile verification is available for Pro and Deluxe members. You can submit professional certifications or link your LinkedIn profile in the Settings page to get the 'Verified' badge."
        },
        {
          q: "Can I have multiple roles (e.g., Mentor and Learner)?",
          a: "Absolutely. We encourage users to be multifaceted. You can list skills you are an expert in (to mentor others) and skills you want to learn (to be mentored) on the same profile."
        },
        {
          q: "How do I delete my account?",
          a: "You can delete your account permanently from the Settings > Privacy page. Please note that this action is irreversible and will remove all your data and project history."
        }
      ]
    },
    {
      category: "Collaboration & Projects",
      questions: [
        {
          q: "How do I start a project?",
          a: "Navigate to the 'Projects' tab and click 'Create Project'. You can define the project scope, required skills, and timeline. Once published, other users can request to join your team."
        },
        {
          q: "Is there a limit to how many projects I can join?",
          a: "Free users can join up to 3 active projects at a time. Pro and Deluxe users have unlimited project participation limits."
        },
        {
          q: "How does the chat system work?",
          a: "Once you connect with another user, you can message them instantly via our secure chat system. We support text, file sharing, and for premium users, integrated video calls."
        }
      ]
    },
    {
      category: "Subscriptions & Payments",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards, UPI, and Net Banking via our secure payment partner, Razorpay."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, you can cancel your subscription at any time from your billing settings. You will retain access to premium features until the end of your current billing cycle."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer a 7-day money-back guarantee for yearly subscriptions. Monthly subscriptions are non-refundable. Please check our Refund Policy page for full details."
        }
      ]
    },
    {
      category: "Safety & Privacy",
      questions: [
        {
          q: "Is my data safe?",
          a: "Yes, we use industry-standard encryption to protect your data. We do not sell your personal information to third parties. Read our Privacy Policy for more information."
        },
        {
          q: "How do I report a user?",
          a: "If you encounter inappropriate behavior, you can report a user directly from their profile or chat window. Our trust and safety team reviews all reports within 24 hours."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions - SkillSynergy</title>
        <meta name="description" content="Find answers to common questions about SkillSynergy, including account management, subscriptions, and platform features." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-charcoal-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question? We're here to help. If you can't find what you're looking for, please contact our support team.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqs.map((category, catIdx) => (
          <div key={catIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 border-b border-gray-200 dark:border-charcoal-700 pb-2">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="mt-16 bg-gradient-emerald rounded-2xl p-8 text-center text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="mb-6 opacity-90">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-emerald-600 font-bold py-3 px-8 rounded-xl hover:bg-emerald-50 transition-colors shadow-md"
          >
            Get in Touch
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-xl border border-gray-200 dark:border-charcoal-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
      >
        <span className="font-semibold text-charcoal-900 dark:text-white pr-8">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-4 text-charcoal-600 dark:text-gray-300 border-t border-gray-100 dark:border-charcoal-700 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage;
