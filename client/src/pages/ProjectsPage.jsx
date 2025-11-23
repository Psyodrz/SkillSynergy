import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabaseClient';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const statuses = ['All', 'active', 'planning', 'completed'];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      query = query.neq('owner_id', userId);

      const { data, error } = await query;
      if (error) throw error;

      const ownerIds = [...new Set(data.map(p => p.owner_id))];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', ownerIds);

      const mapped = data.map(project => ({
        ...project,
        profiles: profiles?.find(p => p.id === project.owner_id) || null
      }));

      setProjects(mapped);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesText =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;

    return matchesText && matchesStatus;
  });

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleJoinProject = async (projectId) => {
    if (!userId) return alert('Please log in');

    const project = projects.find(p => p.id === projectId);
    const collaborators = project.collaborators || [];

    if (collaborators.includes(userId))
      return alert('Already collaborating');

    try {
      await supabase
        .from('projects')
        .update({
          collaborators: [...collaborators, userId],
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      alert('Joined project!');
      fetchProjects();
      setIsProjectModalOpen(false);
    } catch (error) {
      alert('Error joining project');
    }
  };

  // Emerald-styled status chip
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20';
      case 'planning':
        return 'text-teal-500 bg-teal-500/10 border border-teal-500/20';
      case 'completed':
        return 'text-blue-400 bg-blue-500/10 border border-blue-400/20';
      default:
        return 'text-slate-500 bg-white/5 dark:bg-charcoal-800 border border-charcoal-700';
    }
  };

  // Emerald project icon box color
  const getProjectColor = (title) => {
    const emeralds = [
      'bg-emerald-500',
      'bg-teal-500',
      'bg-green-500',
      'bg-emerald-400',
      'bg-teal-400'
    ];
    const index = title.charCodeAt(0) % emeralds.length;
    return emeralds[index];
  };

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-900 transition-colors duration-300">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-charcoal-800/70 backdrop-blur-xl border-b border-mint-200 dark:border-charcoal-700 px-6 py-5 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white">Projects</h1>
            <p className="text-sm text-charcoal-600 dark:text-mint-300">
              Discover and join high-quality collaborations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[500px]">
            
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects…"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white dark:bg-charcoal-800 border border-mint-300 dark:border-charcoal-700 text-charcoal-900 dark:text-white placeholder-charcoal-400 dark:placeholder-mint-500 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-white dark:bg-charcoal-800 border border-mint-300 dark:border-charcoal-700 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              {statuses.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Create */}
            <Button
              variant="primary"
              onClick={() => navigate('/my-projects')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-glow"
            >
              <PlusIcon className="h-5 w-5" />
              Create
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Project List */}
      <div className="p-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="h-12 w-12 animate-spin border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-mint-600 dark:text-mint-300 mt-4">Loading projects…</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleProjectClick(project)}
                className="bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xl border border-mint-200 dark:border-charcoal-700 rounded-xl p-6 shadow hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                {/* Icon + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getProjectColor(project.title)}`}>
                    <span className="text-white font-bold text-lg">{project.title[0]}</span>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
                  {project.title}
                </h3>

                {/* Desc */}
                <p className="text-sm text-charcoal-600 dark:text-mint-300 line-clamp-2">
                  {project.description || 'No description'}
                </p>

                {/* Creator */}
                {project.profiles && (
                  <p className="text-emerald-500 text-sm font-medium mt-2">
                    By {project.profiles.full_name}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-between mt-4 text-sm text-charcoal-500 dark:text-mint-400">
                  <span className="flex items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    {project.collaborators?.length || 0} people
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinProject(project.id);
                    }}
                  >
                    Join
                  </Button>

                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-5">
            <p className="text-charcoal-700 dark:text-mint-300">
              {selectedProject.description || 'No description'}
            </p>
            <Button
              variant="primary"
              onClick={() => handleJoinProject(selectedProject.id)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              Join Project
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
