
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  FireIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Connect with Experts',
      description: 'Find professionals with complementary skills and build your dream team',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learn Together',
      description: 'Share knowledge, mentor others, and grow your skills through collaboration',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: BriefcaseIcon,
      title: 'Build Projects',
      description: 'Collaborate on real-world projects and showcase your expertise',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Chat',
      description: 'Instant messaging and video calls to stay connected with your network',
      color: 'from-teal-400 to-emerald-400'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: UserGroupIcon },
    { label: 'Skills Matched', value: '50,000+', icon: SparklesIcon },
    { label: 'Projects Created', value: '5,000+', icon: RocketLaunchIcon },
    { label: 'Success Stories', value: '15,000+', icon: StarIcon }
  ];

  const skillCategories = [
    { name: 'Technology', count: 2847, icon: '💻', color: 'bg-teal-500' },
    { name: 'Design', count: 1523, icon: '🎨', color: 'bg-emerald-500' },
    { name: 'Marketing', count: 1289, icon: '📈', color: 'bg-cyan-500' },
    { name: 'Business', count: 2156, icon: '💼', color: 'bg-teal-600' },
    { name: 'Writing', count: 987, icon: '✍️', color: 'bg-emerald-600' },
    { name: 'Finance', count: 1654, icon: '💰', color: 'bg-teal-400' }
  ];

  return (
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
                Join 10,000+ professionals building together
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
                  <div className="text-3xl font-black bg-gradient-emerald bg-clip-text text-transparent mb-1">
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
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
              Why Choose <span className="bg-gradient-emerald bg-clip-text text-transparent">SkillSynergy?</span>
            </h2>
            <p className="text-xl text-charcoal-700 dark:text-mint-200 max-w-2xl mx-auto">
              Everything you need to find, connect, and collaborate with the right people
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white/70 dark:bg-charcoal-800/70 backdrop-blur-2xl border border-teal-200/50 dark:border-charcoal-700/50 hover:bg-white dark:hover:bg-charcoal-800 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-700 dark:text-mint-200 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-2 transition-transform">
                    Learn more <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
                  {category.count.toLocaleString()} experts
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
              Join thousands of professionals already building amazing projects together
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
    </div>
  );
};

export default HomePage;
