import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';
import { ArrowRightOnRectangleIcon, UserPlusIcon, FunnelIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const DiscoverProjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedProjectIds, setJoinedProjectIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories derived from seed data
  const categories = [
    'All',
    'Tech & Development',
    'Data & AI',
    'Design & Creative',
    'Language & Communication',
    'Career & Job Prep',
    'Personal Finance',
    'Life Skills & Productivity',
    'Health & Fitness',
    'Arts & Music',
    'Hobbies & Games',
    'Academics & Exams',
    'Home & Lifestyle',
    'Parenting & Relationships'
  ];

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, selectedCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data: projectsData, error: projectsError } = await query;

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      // Fetch memberships
      const { data: memberships, error: memberError } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      const joinedSet = new Set(memberships?.map(m => m.project_id) || []);
      setJoinedProjectIds(joinedSet);

      const mappedProjects = projectsData?.map(p => ({
        ...p,
        owner: undefined, 
        member_count: 0
      })) || [];
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (projectId: string) => {
    if (!user) return;
    setActionLoading(projectId);
    try {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      setJoinedProjectIds(prev => new Set(prev).add(projectId));
    } catch (error) {
      console.error('Error joining project:', error);
      alert('Failed to join project. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (projectId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to leave this challenge?')) return;
    
    setActionLoading(projectId);
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;

      setJoinedProjectIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    } catch (error) {
      console.error('Error leaving project:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('owner_id', user?.id); // Extra safety check

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      alert('Project deleted successfully.');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">Discover Learning Challenges</h2>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-charcoal-900/50 rounded-xl border border-dashed border-gray-300 dark:border-charcoal-600">
          <p className="text-gray-500 dark:text-gray-400">No public learning challenges found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const isOwner = project.owner_id === user?.id;
            const isMember = joinedProjectIds.has(project.id);

            return (
              <div 
                key={project.id} 
                className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-700 flex flex-col h-full hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer overflow-hidden"
                onClick={() => navigate(`/challenge/${project.id}`)}
              >
                {project.thumbnail_url && (
                  <div className="h-48 w-full bg-gray-100 dark:bg-charcoal-900 border-b border-gray-100 dark:border-charcoal-700">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      P
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 dark:text-white line-clamp-1" title={project.title}>{project.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        {project.difficulty && (
                          <span className={`px-1.5 py-0.5 rounded ${
                            project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {project.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {project.category && (
                  <div className="mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 rounded-md">
                      {project.category}
                    </span>
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                  {project.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-charcoal-700" onClick={(e) => e.stopPropagation()}>
                  {isOwner ? (
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="w-full py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" /> Delete Challenge
                    </button>
                  ) : isMember ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/challenge/${project.id}`)}
                        className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors flex items-center justify-center shadow-lg shadow-emerald-500/20"
                      >
                        <EyeIcon className="w-5 h-5 mr-2" /> Open Challenge
                      </button>
                      <button
                        onClick={() => handleLeave(project.id)}
                        disabled={actionLoading === project.id}
                        className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
                        title="Leave Challenge"
                      >
                        {actionLoading === project.id ? '...' : <ArrowRightOnRectangleIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(project.id)}
                      disabled={actionLoading === project.id}
                      className={`w-full py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20`}
                    >
                      {actionLoading === project.id ? 'Joining...' : <><UserPlusIcon className="w-5 h-5 mr-2" /> Join Challenge</>}
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscoverProjects;
