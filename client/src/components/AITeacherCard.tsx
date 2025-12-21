import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { CpuChipIcon } from '@heroicons/react/24/solid';
import Button from './Button';

export interface AITeacher {
  id: string;
  full_name: string;
  role: string;
  is_ai: boolean;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  avatar_url: string | null;
  headline: string;
  bio: string;
  languages: string[];
  teaching_modes: string[];
  similarity?: number;
  always_available: boolean;
}

interface AITeacherCardProps {
  teacher: AITeacher;
  index?: number;
}

export default function AITeacherCard({ teacher, index = 0 }: AITeacherCardProps) {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(teacher.avatar_url);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    if (!avatarUrl && teacher.skill_id) {
      const fetchAvatar = async () => {
        setLoadingAvatar(true);
        try {
          // Use the config.API_URL
          const response = await fetch(`${config.API_URL}/api/tutor-avatar/${teacher.skill_id}`);
          const data = await response.json();
          if (data.success && data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
          }
        } catch (error) {
          console.error('Error fetching avatar:', error);
        } finally {
          setLoadingAvatar(false);
        }
      };
      
      fetchAvatar();
    }
  }, [teacher.skill_id, avatarUrl]);

  const handleStartChat = () => {
    // Navigate to public skill learning room
    navigate(`/skill/${teacher.skill_id}/room?skill=${encodeURIComponent(teacher.skill_name)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-violet-200 dark:border-violet-800 shadow-sm hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 relative overflow-hidden"
    >
      {/* AI Badge */}
      <div className="absolute top-3 right-3">
        <div className="flex items-center gap-1 px-2 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">
          <SparklesIcon className="w-3 h-3" />
          AI Powered
        </div>
      </div>

      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-4">
        {/* AI Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={teacher.full_name} className="w-full h-full object-cover" />
            ) : (
              <CpuChipIcon className={`w-8 h-8 text-white ${loadingAvatar ? 'animate-pulse' : ''}`} />
            )}
          </div>
          {/* Always Online indicator */}
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white dark:ring-charcoal-900" />
        </div>

        {/* Name & Headline */}
        <div className="flex-1 pt-1">
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
            {teacher.full_name}
            <CheckBadgeIcon className="w-5 h-5 text-violet-500" />
          </h3>
          <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
            {teacher.headline}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-4 line-clamp-2">
        {teacher.bio}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-lg font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Always Available
        </span>
        <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs rounded-lg font-medium">
          {teacher.skill_category}
        </span>
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-lg font-medium">
          Instant Responses
        </span>
      </div>

      {/* Skill Badge */}
      <div className="mb-4">
        <p className="text-xs text-charcoal-500 dark:text-gray-400 mb-2">Teaches:</p>
        <span className="px-3 py-1.5 bg-white dark:bg-charcoal-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-sm rounded-lg font-semibold">
          {teacher.skill_name}
        </span>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex items-center justify-center gap-2"
        onClick={handleStartChat}
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
        Start Learning with AI
      </Button>
    </motion.div>
  );
}
