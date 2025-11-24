import { Link } from 'react-router-dom';
import Footer from './Footer';
import FeatureShowcase from './FeatureShowcase';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  FireIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

import { Helmet } from 'react-helmet-async';

const HomePage = () => {


  const stats = [
    { label: 'AI-Assisted Discovery', value: 'Smart Match', icon: SparklesIcon },
    { label: 'Curated Skills', value: '200+', icon: CheckBadgeIcon },
    { label: 'Real-time Chat', value: 'Instant', icon: ChatBubbleLeftRightIcon },
    { label: 'Global Community', value: 'Growing', icon: GlobeAltIcon }
  ];

  const skillCategories = [
    { name: 'Technology', description: 'Learn coding, AI, and emerging tech skills.', icon: '💻', color: 'bg-teal-500' },
    { name: 'Design', description: 'Explore UI/UX, graphics, illustration, and creative arts.', icon: '🎨', color: 'bg-emerald-500' },
    { name: 'Marketing', description: 'Build digital marketing and branding expertise.', icon: '📈', color: 'bg-cyan-500' },
    { name: 'Business', description: 'Improve entrepreneurship, leadership, and strategy.', icon: '💼', color: 'bg-teal-600' },
    { name: 'Writing', description: 'Develop creative writing and communication skills.', icon: '✍️', color: 'bg-emerald-600' },
    { name: 'Finance', description: 'Learn money management, investing, and financial literacy.', icon: '💰', color: 'bg-teal-400' }
  ];

  return (
    <>
      <Helmet>
        <title>SkillSynergy - Connect, Collaborate, and Grow</title>
        <meta name="description" content="Join the premier platform for professionals to share skills, collaborate on projects, and find mentors. Start your journey with SkillSynergy today." />
      </Helmet>
      <div className="min-h-screen bg-mint-100 dark:bg-charcoal-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-mint-100/80 dark:bg-charcoal-900/90 border-b border-teal-200 dark:border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="SkillSynergy Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-emerald bg-clip-text text-transparent">
                SkillSynergy
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-emerald hover:opacity-90 text-white font-semibold rounded-xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-700/50 mb-8"
            >
              <FireIcon className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-semibold bg-gradient-emerald bg-clip-text text-transparent">
                Join a growing community of professionals
              </span>
            </motion.div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="block text-charcoal-900 dark:text-white">Connect Through</span>
              <span className="block bg-gradient-emerald bg-clip-text text-transparent">
                Skills & Passion
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-charcoal-700 dark:text-mint-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              SkillSynergy intelligently connects professionals based on their skills, goals,
              and collaboration interests. Build meaningful partnerships and create amazing
              projects together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/login"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-emerald hover:opacity-90 text-white font-bold rounded-2xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <RocketLaunchIcon className="h-6 w-6" />
                <span>Start Collaborating</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-charcoal-800/80 hover:bg-white dark:hover:bg-charcoal-800 backdrop-blur-xl border border-teal-200/50 dark:border-charcoal-700/50 text-charcoal-900 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Watch Demo
              </button>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/60 dark:bg-charcoal-800/60 backdrop-blur-xl border border-teal-200/50 dark:border-charcoal-700/50 hover:bg-white dark:hover:bg-charcoal-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <stat.icon className="h-8 w-8 text-teal-600 dark:text-teal-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-xl sm:text-2xl font-black bg-gradient-emerald bg-clip-text text-transparent mb-1 whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-sm text-charcoal-600 dark:text-mint-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
              Why Choose <span className="bg-gradient-emerald bg-clip-text text-transparent">SkillSynergy?</span>
            </h2>
            <p className="text-xl text-charcoal-700 dark:text-mint-200 max-w-2xl mx-auto">
              Everything you need to find, connect, and collaborate with the right people
            </p>
          </motion.div>
        </div>
        <FeatureShowcase />
      </div>

      {/* Skills Categories */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-charcoal-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
              Explore <span className="bg-gradient-emerald bg-clip-text text-transparent">Popular Skills</span>
            </h2>
            <p className="text-xl text-charcoal-700 dark:text-mint-200">
              Discover professionals across diverse skill categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xl border border-teal-200/50 dark:border-charcoal-700/50 hover:bg-white dark:hover:bg-charcoal-800 hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-charcoal-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-charcoal-500 dark:text-mint-300">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-emerald opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-2xl border border-teal-200/50 dark:border-charcoal-700/50 shadow-2xl"
          >
            <CheckBadgeIcon className="h-16 w-16 text-teal-600 dark:text-teal-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
              Ready to <span className="bg-gradient-emerald bg-clip-text text-transparent">Collaborate?</span>
            </h2>
            <p className="text-xl text-charcoal-700 dark:text-mint-200 mb-8">
              Join a global community building amazing projects together
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-gradient-emerald hover:opacity-90 text-white font-bold rounded-2xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105"
            >
              <SparklesIcon className="h-6 w-6" />
              <span>Create Your Profile - It's Free</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      {/* Trust & Security Section */}
      <div className="py-16 bg-mint-50 dark:bg-charcoal-950 border-t border-gray-200 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckBadgeIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Verified Professionals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with trusted experts. All profiles are verified for authenticity.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <RocketLaunchIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transactions are 100% secure and processed via Razorpay.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data Privacy First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your data is encrypted and protected. We prioritize your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default HomePage;
