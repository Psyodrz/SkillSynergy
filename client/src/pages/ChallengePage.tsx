import React, { useState, useEffect } from 'react';
import { InlineLoader } from '../components/BrandLoader';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  SparklesIcon,
  BookOpenIcon,
  PencilSquareIcon,
  BeakerIcon,
  RocketLaunchIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import config from '../config';

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: 'reading' | 'exercise' | 'quiz' | 'project';
  milestone_id: string;
  order_index: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  owner_name: string;
  duration_weeks: number;
  difficulty: string;
  milestones: Milestone[];
  tasks: Task[];
  progress: { completion_percentage: number } | null;
  completedTasks: string[];
  reward_xp?: number;
  reward_badge?: string;
  reward_certificate?: boolean;
}

const ChallengePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [completingTask, setCompletingTask] = useState<string | null>(null); // Unused
  // const [aiFeedback, setAiFeedback] = useState<{ taskId: string; feedback: string } | null>(null); // Unused
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!projectId) return;
      
      try {
        const url = user?.id 
          ? `${config.API_URL}/api/challenge/${projectId}?user_id=${user.id}`
          : `${config.API_URL}/api/challenge/${projectId}`;
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setChallenge(data.challenge);
        }
      } catch (err) {
        console.error('Error fetching challenge:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [projectId, user?.id]);

  // Start challenge
  const startChallenge = async () => {
    if (!user?.id || !projectId) return;
    
    try {
      const response = await fetch(`${config.API_URL}/api/challenge/${projectId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      
      const data = await response.json();
      if (data.success && challenge) {
        setChallenge({ ...challenge, progress: data.progress, completedTasks: [] });
      }
    } catch (err) {
      console.error('Error starting challenge:', err);
    }
  };

  // Complete task - CURRENTLY UNUSED (Tasks completed in TaskDetailPage)
  /*
  const completeTask = async (taskId: string) => {
    if (!user?.id) return;
    
    setCompletingTask(taskId);
    try {
      const response = await fetch(`${config.API_URL}/api/challenge/task/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      
      const data = await response.json();
      if (data.success && challenge) {
        setChallenge({
          ...challenge,
          completedTasks: [...challenge.completedTasks, taskId],
          progress: { completion_percentage: data.progress.percentage }
        });
        setAiFeedback({ taskId, feedback: data.aiFeedback });
      }
    } catch (err) {
      console.error('Error completing task:', err);
    } finally {
      setCompletingTask(null);
    }
  };
  */

  // Generate AI content
  const generateContent = async () => {
    if (!projectId) return;
    
    setIsGeneratingContent(true);
    try {
      const response = await fetch(`${config.API_URL}/api/challenge/${projectId}/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        // Refetch challenge to get new content
        window.location.reload();
      }
    } catch (err) {
      console.error('Error generating content:', err);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Get task icon
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpenIcon className="w-5 h-5" />;
      case 'exercise': return <PencilSquareIcon className="w-5 h-5" />;
      case 'quiz': return <AcademicCapIcon className="w-5 h-5" />;
      case 'project': return <RocketLaunchIcon className="w-5 h-5" />;
      default: return <BeakerIcon className="w-5 h-5" />;
    }
  };

  // Group tasks by milestone
  const getTasksForMilestone = (milestoneId: string) => {
    return challenge?.tasks.filter(t => t.milestone_id === milestoneId) || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint-50 dark:bg-charcoal-950">
        <InlineLoader size="lg" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint-50 dark:bg-charcoal-950">
        <p className="text-charcoal-600 dark:text-mint-300">Challenge not found</p>
      </div>
    );
  }

  const hasStarted = challenge.progress !== null;
  const progressPercentage = challenge.progress?.completion_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-teal-50 dark:from-charcoal-950 dark:to-charcoal-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{challenge.title}</h1>
              <p className="text-emerald-100 mb-4">{challenge.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <ClockIcon className="w-4 h-4" />
                  {challenge.duration_weeks || 4} weeks
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <AcademicCapIcon className="w-4 h-4" />
                  {challenge.difficulty || 'Beginner'}
                </span>
                {challenge.reward_xp && (
                  <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-medium">
                    <TrophyIcon className="w-4 h-4" />
                    {challenge.reward_xp} XP
                  </span>
                )}
                {challenge.reward_badge && (
                  <span className="bg-purple-400 text-purple-900 px-3 py-1 rounded-full font-medium">
                    {challenge.reward_badge}
                  </span>
                )}
              </div>
            </div>
            
            {!hasStarted ? (
              <button
                onClick={startChallenge}
                className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Start Challenge 🚀
              </button>
            ) : (
              <div className="text-right">
                <p className="text-emerald-100 text-sm mb-1">Progress</p>
                <p className="text-3xl font-bold">{progressPercentage}%</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        {hasStarted && (
          <div className="h-2 bg-emerald-800">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* No milestones - show generate button */}
        {challenge.milestones.length === 0 && challenge.tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <SparklesIcon className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
              No Learning Content Yet
            </h2>
            <p className="text-charcoal-600 dark:text-mint-300 mb-6 max-w-md mx-auto">
              This challenge doesn't have structured content yet. Use AI to generate milestones and tasks automatically!
            </p>
            <button
              onClick={generateContent}
              disabled={isGeneratingContent}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all shadow-lg"
            >
              {isGeneratingContent ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Generating...
                </>
              ) : (
                <>🤖 Generate Learning Content with AI</>
              )}
            </button>
          </motion.div>
        )}

        {/* Milestones and Tasks */}
        <div className="space-y-6">
          {challenge.milestones.map((milestone, mIndex) => {
            const milestoneTasks = getTasksForMilestone(milestone.id);
            const completedInMilestone = milestoneTasks.filter(t => 
              challenge.completedTasks.includes(t.id)
            ).length;
            const isMilestoneComplete = completedInMilestone === milestoneTasks.length && milestoneTasks.length > 0;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mIndex * 0.1 }}
                className={`bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg overflow-hidden border-2 ${
                  isMilestoneComplete ? 'border-emerald-400' : 'border-transparent'
                }`}
              >
                {/* Milestone header */}
                <div className={`p-4 ${isMilestoneComplete ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-mint-50 dark:bg-charcoal-700'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isMilestoneComplete 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-charcoal-200 dark:bg-charcoal-600 text-charcoal-600 dark:text-mint-300'
                      }`}>
                        {isMilestoneComplete ? (
                          <CheckCircleSolidIcon className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{mIndex + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-charcoal-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-sm text-charcoal-600 dark:text-mint-300">{milestone.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-charcoal-500 dark:text-mint-400">
                      {completedInMilestone}/{milestoneTasks.length} tasks
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="p-4 space-y-3">
                  {milestoneTasks.map((task) => {
                    const isCompleted = challenge.completedTasks.includes(task.id);
                    // const isCompleting = completingTask === task.id; // Unused
                    // const showFeedback = aiFeedback?.taskId === task.id; // Unused

                    return (
                      <div key={task.id} className="relative">
                        <div 
                          onClick={() => navigate(`/challenge/${projectId}/task/${task.id}`)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group ${
                            isCompleted 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                              : 'bg-mint-50 dark:bg-charcoal-700 border-mint-200 dark:border-charcoal-600 hover:border-emerald-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                              isCompleted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-charcoal-600 text-charcoal-600 dark:text-mint-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30'
                            }`}>
                              {isCompleted ? <CheckCircleSolidIcon className="w-5 h-5" /> : getTaskIcon(task.task_type)}
                            </div>
                            <div>
                              <p className={`font-medium ${isCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-charcoal-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-charcoal-500 dark:text-mint-400">{task.description}</p>
                            </div>
                          </div>
                          
                          {hasStarted && !isCompleted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/challenge/${projectId}/task/${task.id}`);
                              }}
                              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                            >
                              Start Task →
                            </button>
                          )}
                          
                          {isCompleted && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">View</span>
                              <CheckCircleSolidIcon className="w-6 h-6 text-emerald-500" />
                            </div>
                          )}
                        </div>

                        {/* AI Feedback */}
                        {/* showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xl">🤖</span>
                              <div>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">AI Tutor Feedback</p>
                                <p className="text-charcoal-700 dark:text-mint-200">{aiFeedback.feedback}</p>
                              </div>
                            </div>
                          </motion.div>
                        ) */}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion message */}
        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center py-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white"
          >
            <span className="text-6xl mb-4 block">🎉</span>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p>You've completed this challenge. Keep up the amazing work!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
