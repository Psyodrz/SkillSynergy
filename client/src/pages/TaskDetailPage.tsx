import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  BookOpenIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import config from '../config';

interface TaskContent {
  objective: string;
  instructions: string[];
  resources: { title: string; url: string }[];
  hints: string[];
  expectedOutput?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: 'reading' | 'exercise' | 'quiz' | 'project';
  project_id: string;
  project_title: string;
  project_description: string;
  milestone_title: string;
  milestone_description: string;
  difficulty: string;
  content: TaskContent;
  isCompleted: boolean;
  completion: {
    ai_feedback: string;
    completed_at: string;
    user_answer: any;
  } | null;
  navigation: {
    current: number;
    total: number;
    prevTask: { id: string; title: string } | null;
    nextTask: { id: string; title: string } | null;
  };
}

const TaskDetailPage: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workNotes, setWorkNotes] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      try {
        setIsLoading(true);
        const url = user?.id 
          ? `${config.API_URL}/api/challenge/task/${taskId}?user_id=${user.id}`
          : `${config.API_URL}/api/challenge/task/${taskId}`;
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setTask(data.task);
          if (data.task.completion?.user_answer?.notes) {
            setWorkNotes(data.task.completion.user_answer.notes);
          }
        }
      } catch (err) {
        console.error('Error fetching task:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId, user?.id]);

  // Reset AI chat when changing tasks
  useEffect(() => {
    setAiResponse('');
    setAiQuestion('');
    setShowAIChat(false);
  }, [taskId]);

  // Submit task
  const handleSubmit = async () => {
    if (!user?.id || !taskId) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${config.API_URL}/api/challenge/task/${taskId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id,
          work: { completed: true },
          notes: workNotes
        })
      });
      
      const data = await response.json();
      if (data.success && task) {
        setTask({
          ...task,
          isCompleted: true,
          completion: data.completion
        });
      }
    } catch (err) {
      console.error('Error submitting task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ask AI for help
  const askAIForHelp = async () => {
    if (!aiQuestion.trim() || !task) return;
    
    setIsAskingAI(true);
    setAiResponse(''); 
    
    const requestBody = {
      message: `I'm working on a task called "${task.title}" which is: ${task.description}. My question is: ${aiQuestion}`,
      skill_name: task.project_title,
      conversation_history: []
    };
    
    try {
      const response = await fetch(`${config.API_URL}/api/chat/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      // Handle response - backend may return 'message' or 'response'
      if (data.message || data.response) {
        setAiResponse(data.message || data.response);
      } else if (data.error) {
        setAiResponse(`Sorry, there was an error: ${data.error}`);
      } else {
        setAiResponse('Sorry, I received an empty response. Please try again.');
        console.error('Unexpected response format:', data);
      }
    } catch (err) {
      console.error('Error asking AI:', err);
      setAiResponse('Sorry, I had trouble connecting. Please check if the server is running.');
    } finally {
      setIsAskingAI(false);
      setAiQuestion('');
    }
  };

  // Get task type icon
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpenIcon className="w-6 h-6" />;
      case 'exercise': return <PencilSquareIcon className="w-6 h-6" />;
      case 'quiz': return <AcademicCapIcon className="w-6 h-6" />;
      case 'project': return <RocketLaunchIcon className="w-6 h-6" />;
      default: return <BookOpenIcon className="w-6 h-6" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'reading': return 'Reading';
      case 'exercise': return 'Exercise';
      case 'quiz': return 'Quiz';
      case 'project': return 'Project';
      default: return 'Task';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint-50 dark:bg-charcoal-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-mint-50 dark:bg-charcoal-950">
        <p className="text-charcoal-600 dark:text-mint-300 mb-4">Task not found</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-teal-50 dark:from-charcoal-950 dark:to-charcoal-900">
      {/* Header */}
      <div className="bg-white dark:bg-charcoal-800 border-b border-mint-200 dark:border-charcoal-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(`/challenge/${projectId}`)}
                className="p-2 hover:bg-mint-100 dark:hover:bg-charcoal-700 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-charcoal-600 dark:text-mint-300" />
              </button>
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  {task.project_title}
                </p>
                <h1 className="text-lg font-bold text-charcoal-900 dark:text-white">
                  {task.title}
                </h1>
              </div>
            </div>
            
            {/* Task Navigation */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-charcoal-500 dark:text-mint-400">
                Task {task.navigation.current} of {task.navigation.total}
              </span>
              <div className="flex gap-1">
                {task.navigation.prevTask && (
                  <Link
                    to={`/challenge/${projectId}/task/${task.navigation.prevTask.id}`}
                    className="p-2 hover:bg-mint-100 dark:hover:bg-charcoal-700 rounded-lg transition-colors"
                    title={task.navigation.prevTask.title}
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-charcoal-600 dark:text-mint-300" />
                  </Link>
                )}
                {task.navigation.nextTask && (
                  <Link
                    to={`/challenge/${projectId}/task/${task.navigation.nextTask.id}`}
                    className="p-2 hover:bg-mint-100 dark:hover:bg-charcoal-700 rounded-lg transition-colors"
                    title={task.navigation.nextTask.title}
                  >
                    <ChevronRightIcon className="w-5 h-5 text-charcoal-600 dark:text-mint-300" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Task Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task Type Badge & Status */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                task.task_type === 'reading' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                task.task_type === 'exercise' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                task.task_type === 'quiz' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              }`}>
                {getTaskIcon(task.task_type)}
                {getTaskTypeLabel(task.task_type)}
              </span>
              
              {task.isCompleted && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm font-medium">
                  <CheckCircleSolidIcon className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>

            {/* Objective */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
            >
              <h2 className="text-lg font-bold text-charcoal-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  🎯
                </span>
                Objective
              </h2>
              <p className="text-charcoal-700 dark:text-mint-200">
                {task.content.objective}
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
            >
              <h2 className="text-lg font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  📝
                </span>
                Instructions
              </h2>
              <ol className="space-y-3">
                {(task.content.instructions || []).map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-mint-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center text-sm font-medium text-charcoal-600 dark:text-mint-300">
                      {index + 1}
                    </span>
                    <span className="text-charcoal-700 dark:text-mint-200">{instruction}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Work Area (if not completed) */}
            {!task.isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
              >
                <h2 className="text-lg font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    ✍️
                  </span>
                  Your Work
                </h2>
                <textarea
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="Add your notes, answers, or reflections here..."
                  className="w-full h-40 p-4 border border-mint-200 dark:border-charcoal-600 rounded-xl bg-mint-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-white placeholder-charcoal-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Complete Task
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* AI Feedback (if completed) */}
            {task.isCompleted && task.completion?.ai_feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700"
              >
                <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6" />
                  AI Tutor Feedback
                </h2>
                <p className="text-charcoal-700 dark:text-mint-200 whitespace-pre-wrap">
                  {task.completion.ai_feedback}
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Hints */}
            {task.content.hints && task.content.hints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
              >
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-amber-500" />
                    Need a Hint?
                  </h3>
                  <span className={`transform transition-transform ${showHints ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {showHints && (
                  <ul className="mt-4 space-y-2">
                    {task.content.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-charcoal-600 dark:text-mint-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                        💡 {hint}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}

            {/* Resources */}
            {task.content.resources && task.content.resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
              >
                <h3 className="font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5 text-blue-500" />
                  Resources
                </h3>
                <ul className="space-y-2">
                  {task.content.resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        📎 {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-lg p-6 border border-mint-200 dark:border-charcoal-700"
            >
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-500" />
                  Ask AI Tutor
                </h3>
                <span className={`transform transition-transform ${showAIChat ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {showAIChat && (
                <div className="mt-4 space-y-4">
                  {/* Input Area */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && askAIForHelp()}
                      placeholder="Type your question here..."
                      className="flex-1 px-4 py-3 text-sm border border-mint-200 dark:border-charcoal-600 rounded-xl bg-mint-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-white placeholder-charcoal-400 focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={askAIForHelp}
                      disabled={isAskingAI || !aiQuestion.trim()}
                      className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium"
                    >
                      {isAskingAI ? '⏳' : '🚀 Ask'}
                    </button>
                  </div>
                  
                  {/* AI Response Box */}
                  {aiResponse && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700 max-h-96 overflow-y-auto custom-scrollbar"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">AI Tutor Response</p>
                          <p className="text-sm text-charcoal-800 dark:text-mint-100 whitespace-pre-wrap leading-relaxed">
                            {aiResponse}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Loading State */}
                  {isAskingAI && (
                    <div className="p-4 bg-gray-50 dark:bg-charcoal-900 rounded-xl text-center">
                      <span className="animate-pulse">🤔 AI is thinking...</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Navigation to Next Task */}
            {task.isCompleted && task.navigation.nextTask && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center"
              >
                <p className="text-sm mb-2">Great job! Ready for the next task?</p>
                <Link
                  to={`/challenge/${projectId}/task/${task.navigation.nextTask.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Next: {task.navigation.nextTask.title.substring(0, 20)}...
                  <ChevronRightIcon className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
