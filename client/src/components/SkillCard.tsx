import React from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  onConnect?: (skill: Skill) => void;
  className?: string;
}

const getSkillLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    case 'Intermediate':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Advanced':
      return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
    default:
      return 'text-navy-600 bg-warm-100 dark:bg-navy-700 dark:text-warm-300';
  }
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, onConnect, className = '' }) => {
  // Extract background color from tailwind text class

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.32 }}
      className={`bg-white dark:bg-navy-800 border border-warm-200 dark:border-navy-700 p-6 rounded-xl shadow-premium hover:shadow-xl cursor-pointer group ${className}`}
    >
      {/* Skill Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-emerald-glow group-hover:scale-105 transition-transform`}>
            <span className="text-white font-bold text-lg">
              {skill.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
              {skill.name}
            </h3>
            <p className="text-sm text-navy-500 dark:text-warm-400">
              {skill.category}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
          {skill.level}
        </span>
      </div>

      {/* Skill Description */}
      <p className="text-navy-600 dark:text-warm-300 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {skill.description || 'No description available'}
      </p>

      {/* Skill Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-navy-500 dark:text-warm-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{skill.users_count} {skill.users_count === 1 ? 'user' : 'users'}</span>
        </div>
      </div>

      {/* Connect Button */}
      {onConnect && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onConnect(skill)}
          className="w-full bg-gradient-emerald text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-emerald-glow hover:shadow-premium-emerald"
        >
          Connect
        </motion.button>
      )}
    </motion.div>
  );
};

export default SkillCard;
