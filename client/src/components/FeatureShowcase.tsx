import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    id: 'connect',
    title: 'Connect with Experts',
    subtitle: 'Build your dream team',
    icon: UserGroupIcon,
    description: 'Stop searching aimlessly. Our smart matching algorithm connects you with professionals who have the complementary skills you need to succeed.',
    bullets: [
      'AI-powered skill matching',
      'Verified professional profiles',
      'Global talent network'
    ],
    ctaText: 'Find Experts',
    badge: 'Networking',
    color: 'from-teal-500 to-emerald-500'
  },
  {
    id: 'learn',
    title: 'Learn Together',
    subtitle: 'Grow through collaboration',
    icon: AcademicCapIcon,
    description: 'Accelerate your learning journey by pairing with mentors and peers. Share resources, get feedback, and master new skills faster together.',
    bullets: [
      'Peer-to-peer mentorship',
      'Resource sharing hubs',
      'Skill progression tracking'
    ],
    ctaText: 'Start Learning',
    badge: 'Education',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'build',
    title: 'Build Projects',
    subtitle: 'Showcase your expertise',
    icon: BriefcaseIcon,
    description: 'Turn ideas into reality. Join existing projects or start your own, manage tasks, and build a portfolio that proves your capabilities.',
    bullets: [
      'Project management tools',
      'Portfolio showcase',
      'Collaborative workspaces'
    ],
    ctaText: 'Create Project',
    badge: 'Portfolio',
    color: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'chat',
    title: 'Real-time Chat',
    subtitle: 'Stay connected instantly',
    icon: ChatBubbleLeftRightIcon,
    description: 'Seamless communication is key to collaboration. Connect instantly with your team through integrated messaging and video calls.',
    bullets: [
      'Instant messaging',
      'HD video conferencing',
      'File sharing integration'
    ],
    ctaText: 'Start Chatting',
    badge: 'Communication',
    color: 'from-teal-400 to-emerald-400'
  }
];

const FeatureShowcase = () => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full" role="tablist">
          {features.map((feature, index) => {
            const isActive = selectedFeature === index;
            return (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(index)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${feature.id}`}
                className={`
                  relative p-6 rounded-2xl text-left transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-charcoal-900
                  ${isActive 
                    ? 'bg-white dark:bg-charcoal-800 shadow-premium-emerald scale-[1.02] border-2 border-emerald-500/50' 
                    : 'bg-white/50 dark:bg-charcoal-800/40 hover:bg-white/80 dark:hover:bg-charcoal-800/60 border border-teal-100 dark:border-charcoal-700 hover:shadow-lg hover:-translate-y-1'
                  }
                `}
              >
                <div className={`p-3 rounded-xl inline-block mb-4 ${isActive ? 'bg-gradient-emerald text-white shadow-lg' : 'bg-teal-50 dark:bg-charcoal-700 text-teal-600 dark:text-teal-400'}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-charcoal-900 dark:text-white' : 'text-charcoal-700 dark:text-gray-300'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isActive ? 'text-charcoal-600 dark:text-mint-200' : 'text-charcoal-500 dark:text-gray-500'}`}>
                  {feature.subtitle}
                </p>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Details Panel */}
        <div className="relative min-h-[600px] lg:h-full rounded-3xl overflow-hidden bg-white dark:bg-charcoal-800 border border-teal-100 dark:border-charcoal-700 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center overflow-y-auto"
              id={`panel-${features[selectedFeature].id}`}
              role="tabpanel"
            >
              {/* Background Gradient Blob */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${features[selectedFeature].color} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`} />
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wider uppercase mb-6">
                  {features[selectedFeature].badge}
                </span>
                
                <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 dark:text-white mb-6">
                  {features[selectedFeature].title}
                </h2>
                
                <p className="text-lg text-charcoal-600 dark:text-mint-100 mb-8 leading-relaxed">
                  {features[selectedFeature].description}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {features[selectedFeature].bullets.map((bullet, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      className="flex items-center text-charcoal-700 dark:text-gray-300"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <button className="group inline-flex items-center px-6 py-3 bg-gradient-emerald text-white font-bold rounded-xl shadow-emerald-glow hover:shadow-premium-emerald transition-all duration-300 hover:-translate-y-0.5">
                  {features[selectedFeature].ctaText}
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
