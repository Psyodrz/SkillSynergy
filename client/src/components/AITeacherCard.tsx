import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../config';
import { 
  ChatBubbleLeftRightIcon,
  SparklesIcon
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
    navigate(`/skill/${teacher.skill_id}/room?skill=${encodeURIComponent(teacher.skill_name)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col h-full bg-white dark:bg-charcoal-900 border border-mint-200/60 dark:border-charcoal-700/60 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* ── Gradient accent bar ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Top row: avatar + meta */}
        <div className="flex items-center gap-3.5 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md overflow-hidden ring-2 ring-emerald-100 dark:ring-emerald-900/40">
              {avatarUrl ? (
                <img src={avatarUrl} alt={teacher.full_name} className="w-full h-full object-cover" />
              ) : (
                <CpuChipIcon className={`w-6 h-6 text-white ${loadingAvatar ? 'animate-pulse' : ''}`} />
              )}
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-charcoal-900" />
          </div>

          {/* Name + headline */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-charcoal-900 dark:text-white truncate leading-tight">
              {teacher.full_name}
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-mint-300/80 truncate mt-0.5">
              {teacher.headline}
            </p>
          </div>

          {/* AI badge */}
          <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-full border border-emerald-200/60 dark:border-emerald-700/40">
            <SparklesIcon className="w-2.5 h-2.5" />
            AI
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-charcoal-500 dark:text-mint-200/60 leading-relaxed mb-4 line-clamp-2 flex-grow">
          {teacher.bio}
        </p>

        {/* Skill pill */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200/50 dark:border-emerald-800/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{teacher.skill_name}</span>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-mint-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-mint-300 border border-mint-200/50 dark:border-charcoal-700/50">
            {teacher.skill_category}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-teal-50 dark:bg-teal-900/15 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/30">
            24/7 Available
          </span>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-cyan-50 dark:bg-cyan-900/15 text-cyan-600 dark:text-cyan-400 border border-cyan-200/50 dark:border-cyan-800/30">
            Instant
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <button
            onClick={handleStartChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98]"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Start Learning with AI
          </button>
        </div>
      </div>
    </motion.div>
  );
}
