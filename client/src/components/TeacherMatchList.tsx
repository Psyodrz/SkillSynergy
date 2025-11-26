import { SparklesIcon, XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { TeacherProfile } from '../types';
import TeacherCard from './TeacherCard';

interface TeacherMatchListProps {
  teachers: TeacherProfile[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  skillName?: string;
}

export default function TeacherMatchList({
  teachers,
  loading,
  error,
  onClose,
  skillName
}: TeacherMatchListProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-charcoal-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">
                  Recommended Teachers
                </h2>
                {skillName && (
                  <p className="text-sm text-charcoal-600 dark:text-mint-300">
                    For {skillName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white dark:bg-charcoal-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-charcoal-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-charcoal-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-charcoal-600 dark:text-mint-300">Finding the best teachers for you...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {!loading && !error && teachers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-charcoal-800 flex items-center justify-center">
                  <SparklesIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
                  No specific matches found
                </h3>
                <p className="text-charcoal-600 dark:text-gray-400 mb-6">
                  We couldn't find a teacher specifically for this skill yet.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/discover#instructors');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Browse All Teachers
                </button>
              </div>
            )}

            {!loading && !error && teachers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.map((teacher, index) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && teachers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-800/50">
              <p className="text-sm text-charcoal-600 dark:text-gray-400 text-center">
                Found {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} with AI-powered matching
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
