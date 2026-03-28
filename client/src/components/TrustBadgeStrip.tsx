import { motion } from 'framer-motion';
import { ShieldCheckIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const badges = [
  { name: 'Google for Education', color: 'text-blue-500' },
  { name: 'AWS EdStart', color: 'text-orange-500' },
  { name: 'Microsoft for Startups', color: 'text-blue-600' },
  { name: 'Coursera Partner', color: 'text-blue-400' },
  { name: 'Y Combinator Alumni', color: 'text-orange-600' },
];

const TrustBadgeStrip = () => {
  return (
    <div className="w-full py-12 bg-white dark:bg-charcoal-800/50 border-y border-mint-200 dark:border-charcoal-700 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8 select-none">
          <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
          <p className="text-sm font-bold tracking-widest text-charcoal-500 dark:text-mint-400 uppercase">
            Certified & Trusted Worldwide By
          </p>
          <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
        </div>

        {/* Scrolling Banner Container */}
        <div className="w-full relative flex overflow-x-hidden group mask-image-edges">
          {/* First sequence */}
          <motion.div
            className="flex items-center gap-12 sm:gap-24 whitespace-nowrap min-w-full justify-around"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...badges, ...badges].map((badge, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
              >
                <span className={`text-xl sm:text-2xl font-black tracking-tight ${badge.color}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Link to Accreditation Page */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/accreditation"
            className="group flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-charcoal-700 hover:bg-emerald-50 dark:hover:bg-charcoal-600 rounded-full border border-gray-200 dark:border-charcoal-600 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset-2"
          >
            <DocumentCheckIcon className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
              View Official Accreditation
            </span>
          </Link>
        </div>
      </div>
      <style>{`
        .mask-image-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
};

export default TrustBadgeStrip;
