import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Users, Search, Zap, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConnectPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Connect with Experts - SkillSynergy</title>
        <meta name="description" content="Find and connect with professionals, mentors, and collaborators worldwide. Use our AI-powered matching to build your dream team." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-emerald opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Matching</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-charcoal-900 dark:text-white mb-8 leading-tight">
              Build Your <span className="bg-gradient-emerald bg-clip-text text-transparent">Dream Team</span> in Minutes
            </h1>
            <p className="text-xl text-charcoal-600 dark:text-mint-200 mb-10 max-w-2xl mx-auto">
              Stop searching aimlessly. SkillSynergy connects you with the right people based on skills, goals, and compatibility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="px-8 py-4 bg-gradient-emerald text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Start Connecting
              </Link>
              <Link to="/demo" className="px-8 py-4 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-charcoal-700 hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-all">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">Smart Discovery</h3>
              <p className="text-charcoal-600 dark:text-gray-400 leading-relaxed">
                Our advanced search filters let you find people by specific skills (e.g., "React", "Python"), experience level, availability, and even timezone. No more cold messaging random profiles.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">Role-Based Matching</h3>
              <p className="text-charcoal-600 dark:text-gray-400 leading-relaxed">
                Are you looking for a mentor? A co-founder? Or just a study buddy? Define your intent, and we'll show you users who are looking for exactly what you offer.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-4">Global Network</h3>
              <p className="text-charcoal-600 dark:text-gray-400 leading-relaxed">
                Break geographical boundaries. Connect with talent from over 50 countries. Diverse teams build better products, and SkillSynergy makes global collaboration effortless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white dark:bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal-900 dark:text-white mb-4">How Connection Works</h2>
            <p className="text-xl text-charcoal-600 dark:text-gray-400">Three simple steps to expand your network</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-200 dark:from-charcoal-700 dark:via-emerald-900 dark:to-charcoal-700" />

            {[
              { step: "01", title: "Create Profile", desc: "List your skills, interests, and what you're looking for." },
              { step: "02", title: "Get Matched", desc: "Our algorithm suggests the most compatible professionals for you." },
              { step: "03", title: "Start Collaborating", desc: "Send a connection request and start building together." }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white dark:bg-charcoal-900 p-6 text-center z-10">
                <div className="w-24 h-24 mx-auto bg-gradient-emerald rounded-full flex items-center justify-center text-3xl font-black text-white mb-6 shadow-lg shadow-emerald-500/20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-charcoal-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-charcoal-900 dark:bg-emerald-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to find your people?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers, designers, and creators who are already building the future together.
            </p>
            <Link to="/login" className="inline-flex items-center px-8 py-4 bg-white text-emerald-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConnectPage;
