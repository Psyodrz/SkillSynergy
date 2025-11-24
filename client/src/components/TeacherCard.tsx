import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { TeacherProfile } from '../types';
import Button from './Button';

interface TeacherCardProps {
  teacher: TeacherProfile;
  index?: number;
}

export default function TeacherCard({ teacher, index = 0 }: TeacherCardProps) {
  const navigate = useNavigate();

  const getMatchBadge = (similarity?: number) => {
    if (!similarity) return { label: 'Match', color: 'bg-gray-500' };
    if (similarity >= 80) return { label: 'Best Match', color: 'bg-emerald-500' };
    if (similarity >= 60) return { label: 'Strong Match', color: 'bg-teal-500' };
    return { label: 'Good Match', color: 'bg-blue-500' };
  };

  const matchBadge = getMatchBadge(teacher.similarity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-charcoal-800 rounded-2xl p-6 border border-gray-200 dark:border-charcoal-700 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Header with Avatarmatching badge */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <img
            src={teacher.avatar_url || `https://ui-avatars.com/api/?name=${teacher.full_name}&background=random`}
            alt={teacher.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-800"
          />
          {teacher.similarity && teacher.similarity >= 70 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <StarIconSolid className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name & Headline */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">
            {teacher.full_name}
          </h3>
          <p className="text-sm text-charcoal-600 dark:text-mint-300 mt-1">
            {teacher.headline || 'Educator'}
          </p>
        </div>

        {/* Match Badge */}
        <div className={`px-3 py-1 rounded-full ${matchBadge.color} text-white text-xs font-semibold`}>
          {matchBadge.label}
        </div>
      </div>

      {/* Bio */}
      {teacher.bio && (
        <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-4 line-clamp-2">
          {teacher.bio}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Experience */}
        {teacher.experience_years !== null && teacher.experience_years !== undefined && (
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-charcoal-700 dark:text-gray-300">
              {teacher.experience_years}+ yrs
            </span>
          </div>
        )}

        {/* Languages */}
        {teacher.languages && teacher.languages.length > 0 && (
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="w-4 h-4 text-teal-500" />
            <span className="text-sm text-charcoal-700 dark:text-gray-300">
              {teacher.languages.slice(0, 2).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      {teacher.skills && teacher.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mb-2">Teaches:</p>
          <div className="flex flex-wrap gap-2">
            {teacher.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg font-medium"
              >
                {skill.name}
              </span>
            ))}
            {teacher.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                +{teacher.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => navigate(`/profile/${teacher.id}`)}
        >
          View Profile
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/messages?userId=${teacher.id}`)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          Message
        </Button>
      </div>

      {/* Similarity Score (debug/optional) */}
      {teacher.similarity !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-charcoal-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-500 dark:text-gray-400">Match Score</span>
            <div className="flex items-center gap-1">
              <div className="w-24 h-2 bg-gray-200 dark:bg-charcoal-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${teacher.similarity}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {teacher.similarity}%
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
