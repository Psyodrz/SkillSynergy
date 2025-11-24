import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { MessageCircle, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Real-time Chat - SkillSynergy</title>
        <meta name="description" content="Seamless communication for your teams. Instant messaging and file sharing all in one place." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-charcoal-900 dark:to-charcoal-800 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold text-sm mb-6">
              <MessageCircle className="w-4 h-4" />
              <span>Seamless Communication</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-charcoal-900 dark:text-white mb-8 leading-tight">
              Connect Instantly. <br />
              <span className="text-teal-600 dark:text-teal-400">Collaborate Effortlessly.</span>
            </h1>
            <p className="text-xl text-charcoal-600 dark:text-mint-200 mb-10 max-w-2xl mx-auto">
              No need to switch between apps. SkillSynergy brings chat and file sharing directly into your project workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg transition-all">
                Start Chatting
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700 text-center">
              <div className="w-16 h-16 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Instant Messaging</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Real-time 1:1 and group conversations with message history synced across devices.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700 text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Smart Collaboration</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Share ideas, links, and tasks in focused conversations to keep your projects moving.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Secure & Private</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Your conversations are private. We protect your data and never sell your messages.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;
