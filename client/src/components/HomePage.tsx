import { Link } from 'react-router-dom';
import Footer from './Footer';
import FeatureShowcase from './FeatureShowcase';
import ThemeToggle from './ThemeToggle';
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
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { label: 'AI-Assisted Learning', value: 'Smart Learning', icon: SparklesIcon },
    { label: 'Curated Modules', value: '200+', icon: CheckBadgeIcon },
    { label: 'Doubt Support', value: 'Instant', icon: ChatBubbleLeftRightIcon },
    { label: 'Global Learners', value: 'Growing', icon: GlobeAltIcon }
  ];

  const skillCategories = [
    { name: 'Technology', description: 'Learn coding, AI, and emerging tech skills.', image: '/images/skill_technology.png', color: 'bg-teal-500' },
    { name: 'Design', description: 'Explore UI/UX, graphics, illustration, and creative arts.', image: '/images/skill_design.png', color: 'bg-emerald-500' },
    { name: 'Marketing', description: 'Build digital marketing and branding expertise.', image: '/images/skill_marketing.png', color: 'bg-cyan-500' },
    { name: 'Business', description: 'Improve entrepreneurship, leadership, and strategy.', image: '/images/skill_business.png', color: 'bg-teal-600' },
    { name: 'Writing', description: 'Develop creative writing and communication skills.', image: '/images/skill_writing.png', color: 'bg-emerald-600' },
    { name: 'Finance', description: 'Learn money management, investing, and financial literacy.', image: '/images/skill_finance.png', color: 'bg-teal-400' }
  ];

  return (
    <>
      <Helmet>
        <title>SkillSynergy - Learn, Practice, and Grow</title>
        <meta name="description" content="Join the premier platform for learners to master skills, practice on challenges, and follow guided paths. Start your journey with SkillSynergy today." />
      </Helmet>
      <div className="min-h-screen bg-mint-100 dark:bg-charcoal-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl bg-mint-100/80 dark:bg-charcoal-900/90 border-b border-teal-200 dark:border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/"} 
              onClick={() => !isAuthenticated && window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img 
                src="/logo.png" 
                alt="SkillSynergy Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-emerald bg-clip-text text-transparent">
                SkillSynergy
              </h1>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <ThemeToggle />
              <Link
                to="/login"
                className="hidden sm:block text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white font-medium transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-emerald hover:opacity-90 text-white font-semibold rounded-xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
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
                  Join a growing platform of learners
                </span>
              </motion.div>

              {/* Hero Title */}
              <h1 className="text-5xl md:text-7xl font-black mb-6">
                <span className="block text-charcoal-900 dark:text-white">Master New</span>
                <span className="block bg-gradient-emerald bg-clip-text text-transparent">
                  Skills & Passions
                </span>
              </h1>

              {/* Hero Description */}
              <p className="text-xl md:text-2xl text-charcoal-700 dark:text-mint-200 max-w-3xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                SkillSynergy intelligently guides learners based on their skills, goals,
                and learning interests. Follow structured paths and master amazing
                skills together.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16 lg:mb-0">
                <Link
                  to="/login"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-emerald hover:opacity-90 text-white font-bold rounded-2xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <RocketLaunchIcon className="h-6 w-6" />
                  <span>Start Learning</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/demo"
                  className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-charcoal-800/80 hover:bg-white dark:hover:bg-charcoal-800 backdrop-blur-xl border border-teal-200/50 dark:border-charcoal-700/50 text-charcoal-900 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Watch Demo
                </Link>
              </div>
            </motion.div>

            {/* Hero Image - Now visible on all screens */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative lg:block mt-8 lg:mt-0"
            >
              <div className="relative max-w-sm sm:max-w-md mx-auto lg:max-w-none">
                <img
                  src="/images/indian_student.png"
                  alt="Indian student learning on laptop"
                  className="rounded-3xl shadow-2xl w-full h-auto max-h-[280px] sm:max-h-[350px] lg:max-h-none object-cover object-top"
                />
                {/* Floating Stats Card - Hidden on very small screens, shown on sm+ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="hidden sm:flex absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white dark:bg-charcoal-800 rounded-2xl shadow-xl p-3 lg:p-4 border border-gray-100 dark:border-charcoal-700"
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Active Learners</p>
                      <p className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Growing Daily</p>
                    </div>
                  </div>
                </motion.div>
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-gradient-emerald text-white rounded-xl lg:rounded-2xl shadow-xl px-3 py-1.5 lg:px-4 lg:py-2"
                >
                  <p className="font-bold text-xs lg:text-sm">100% Free</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
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
                <div className="text-lg sm:text-2xl font-black bg-gradient-emerald bg-clip-text text-transparent mb-1 leading-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-charcoal-600 dark:text-mint-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
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
              Everything you need to learn, practice, and master the right skills
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
              Discover learning modules across diverse skill categories
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
                <div className="w-16 h-16 mb-3 mx-auto group-hover:scale-125 transition-transform duration-300">
                  <img src={category.image} alt={category.name} className="w-full h-full object-contain" />
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

      {/* AI-Powered Learning Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-charcoal-900 dark:to-charcoal-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-700/50 mb-6">
                <SparklesIcon className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">AI-Powered</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-6">
                Learn with <span className="bg-gradient-emerald bg-clip-text text-transparent">AI Tutors</span>
              </h2>
              <p className="text-lg text-charcoal-600 dark:text-mint-200 mb-8 leading-relaxed">
                Our AI-powered tutors provide personalized guidance, instant doubt resolution, and adaptive learning paths tailored to your pace and style. Get expert-level help 24/7.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Instant answers to your questions',
                  'Personalized learning recommendations',
                  'Practice problems with step-by-step solutions',
                  'Track your progress with AI insights'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckBadgeIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-charcoal-700 dark:text-mint-100">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/instructors"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-emerald text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                <span>Meet Our AI Tutors</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <img
                src="/images/ai_tutoring.png"
                alt="AI-Powered Tutoring"
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Personalized Learning Paths Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/skill_paths.png"
                alt="Learning Paths"
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-200/50 dark:border-teal-700/50 mb-6">
                <RocketLaunchIcon className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Structured Learning</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-6">
                Follow <span className="bg-gradient-emerald bg-clip-text text-transparent">Learning Paths</span>
              </h2>
              <p className="text-lg text-charcoal-600 dark:text-mint-200 mb-8 leading-relaxed">
                Don't know where to start? Our curated learning paths guide you from beginner to expert with a structured curriculum designed by industry professionals.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Web Development', progress: '12 modules' },
                  { label: 'Data Science', progress: '10 modules' },
                  { label: 'UI/UX Design', progress: '8 modules' },
                  { label: 'Digital Marketing', progress: '9 modules' }
                ].map((path, index) => (
                  <motion.div
                    key={path.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-white dark:bg-charcoal-800 shadow-lg border border-gray-100 dark:border-charcoal-700"
                  >
                    <p className="font-bold text-charcoal-900 dark:text-white">{path.label}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{path.progress}</p>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/learn"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-emerald text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                <span>Explore Learning Paths</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-charcoal-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
              How <span className="bg-gradient-emerald bg-clip-text text-transparent">It Works</span>
            </h2>
            <p className="text-xl text-charcoal-700 dark:text-mint-200 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up for free and tell us about your skills, interests, and learning goals.',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Choose Your Path',
                description: 'Browse our curated learning paths or let our AI recommend the best one for you.',
                icon: '🎯'
              },
              {
                step: '03',
                title: 'Start Learning',
                description: 'Dive into interactive modules, practice challenges, and get AI-powered doubt support.',
                icon: '🚀'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 rounded-3xl bg-white dark:bg-charcoal-800 shadow-xl border border-gray-100 dark:border-charcoal-700 text-center"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-emerald rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-charcoal-600 dark:text-mint-200">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Team collaborating on learning"
              className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-emerald opacity-10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Indian team celebrating success"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
            
            {/* CTA Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-2xl border border-teal-200/50 dark:border-charcoal-700/50 shadow-2xl text-center"
            >
              <CheckBadgeIcon className="h-16 w-16 text-teal-600 dark:text-teal-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black text-charcoal-900 dark:text-white mb-4">
                Ready to <span className="bg-gradient-emerald bg-clip-text text-transparent">Learn?</span>
              </h2>
              <p className="text-xl text-charcoal-700 dark:text-mint-200 mb-8">
                Join a global learning platform mastering new skills together
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
      {/* Trust & Security Section */}
      <div className="py-16 bg-mint-50 dark:bg-charcoal-950 border-t border-gray-200 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckBadgeIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Verified Instructors</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn from trusted content. All profiles are verified for authenticity.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Community Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with learners worldwide and get help when you need it.
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
