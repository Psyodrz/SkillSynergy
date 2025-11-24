import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';

const MyProjectsSection = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [category, setCategory] = useState('Tech & Development');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // 1. Fetch Owned Projects
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*, project_members(count)')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (ownedError) throw ownedError;

      // 2. Fetch Joined Projects (via project_members)
      const { data: joinedMemberships, error: joinedError } = await supabase
        .from('project_members')
        .select('project:projects(*, project_members(count))')
        .eq('user_id', user?.id)
        .neq('role', 'owner'); // Exclude owned ones if we want to avoid duplicates, though owner check above handles it.

      if (joinedError) throw joinedError;

      // Extract projects from memberships
      // The type assertion is needed because Supabase types for nested relations can be tricky
      const joinedProjects = joinedMemberships?.map((m: any) => m.project).filter(Boolean) || [];

      // Merge and Deduplicate (just in case)
      const allProjects = [...(ownedProjects || []), ...joinedProjects];
      
      // Map count correctly
      const mappedProjects = allProjects.map(p => ({
        ...p,
        member_count: p.project_members?.[0]?.count || 0
      }));
      
      // Sort by created_at desc
      mappedProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);

    try {
      // 1. Create Project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title,
          description,
          max_members: maxMembers,
          visibility,
          category,
          difficulty,
          status: 'active'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Add Owner as Member
      if (projectData) {
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({
            project_id: projectData.id,
            user_id: user.id,
            role: 'owner'
          });

        if (memberError) throw memberError;

        setProjects([{ ...projectData, member_count: 1 }, ...projects]);
        setShowCreateModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMaxMembers(5);
    setVisibility('public');
  };

  if (loading) return <div className="p-8 text-center">Loading projects...</div>;

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">My Projects</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-charcoal-900/50 rounded-xl border border-dashed border-gray-300 dark:border-charcoal-600">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any projects yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Start your first project
            </button>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-charcoal-900 border border-gray-100 dark:border-charcoal-700 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">{project.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.visibility === 'public' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {project.visibility}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 gap-4">
                    <div className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 mr-1" />
                      {project.member_count} / {project.max_members} Members
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Members">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Edit">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-charcoal-900 rounded-2xl w-full max-w-lg p-6 shadow-xl border border-gray-200 dark:border-charcoal-700">
            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-6">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tech & Development">Tech & Development</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Language & Communication">Language & Communication</option>
                    <option value="Career & Job Prep">Career & Job Prep</option>
                    <option value="Personal Finance">Personal Finance</option>
                    <option value="Life Skills & Productivity">Life Skills & Productivity</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Arts & Music">Arts & Music</option>
                    <option value="Hobbies & Games">Hobbies & Games</option>
                    <option value="Academics & Exams">Academics & Exams</option>
                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                    <option value="Parenting & Relationships">Parenting & Relationships</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Members</label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-charcoal-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-charcoal-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-charcoal-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjectsSection;
