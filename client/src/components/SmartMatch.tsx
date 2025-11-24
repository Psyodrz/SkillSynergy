import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon, RocketLaunchIcon, UserIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Types
interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  similarity: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  similarity: number;
}

interface Mentor {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string;
  bio: string;
  similarity: number;
}

export default function SmartMatch() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    skills: Skill[];
    projects: Project[];
    mentors: Mentor[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Assuming backend is running on port 5000
      const response = await fetch('http://localhost:5000/api/smart-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          query: query
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch matches');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl shadow-xl border border-teal-100 dark:border-charcoal-700 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <SparklesIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 dark:text-white mb-4">
              AI-Assisted Discovery
            </h2>
            <p className="text-lg text-charcoal-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tell us what you want to learn or build, and our AI will match you with the perfect skills, projects, and mentors.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., I want to build a React Native app for fitness tracking..."
                className="flex-1 px-6 py-4 rounded-xl border border-gray-200 dark:border-charcoal-600 bg-gray-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-4 bg-gradient-emerald text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Get Smart Matches
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-center">{error}</p>
            )}
          </div>

          {results && (
            <div className="space-y-16">
              {/* Skills Section */}
              {results.skills.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 flex items-center gap-2">
                    <CheckBadgeIcon className="w-6 h-6 text-teal-500" />
                    Recommended Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gray-50 dark:bg-charcoal-700/50 border border-gray-100 dark:border-charcoal-600 hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                            {skill.category}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {Math.round(skill.similarity * 100)}% Match
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">{skill.name}</h4>
                        <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {skill.description}
                        </p>
                        <button className="w-full py-2 rounded-lg bg-white dark:bg-charcoal-600 text-teal-600 dark:text-teal-400 font-semibold text-sm border border-teal-200 dark:border-charcoal-500 hover:bg-teal-50 dark:hover:bg-charcoal-500 transition-colors">
                          Add to My Skills
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {results.projects.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 flex items-center gap-2">
                    <RocketLaunchIcon className="w-6 h-6 text-emerald-500" />
                    Suggested Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gray-50 dark:bg-charcoal-700/50 border border-gray-100 dark:border-charcoal-600 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {project.category || 'Project'}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {Math.round(project.similarity * 100)}% Match
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">{project.title}</h4>
                        <p className="text-sm text-charcoal-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <button className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors">
                          View Project
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Mentors Section */}
              {results.mentors.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-cyan-500" />
                    Mentors & Experts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.mentors.map((mentor) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gray-50 dark:bg-charcoal-700/50 border border-gray-100 dark:border-charcoal-600 hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors flex items-center gap-4"
                      >
                        <img 
                          src={mentor.avatar_url || `https://ui-avatars.com/api/?name=${mentor.full_name}&background=random`} 
                          alt={mentor.full_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-cyan-200 dark:border-cyan-800"
                        />
                        <div>
                          <h4 className="text-lg font-bold text-charcoal-900 dark:text-white">{mentor.full_name}</h4>
                          <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-1">{mentor.role}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{mentor.bio}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
