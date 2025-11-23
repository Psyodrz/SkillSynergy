import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabaseClient';
import type { Project } from '../lib/supabaseClient';
import { useProjects } from '../hooks/useProjects';

const MyProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Create/Edit project modal states
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: [] as string[],
    tagInput: ''
  });

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Realtime projects hook
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects({
    ownerOnly: true,
    ownerId: userId || undefined
  });

  const filteredProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      status: 'active',
      tags: [],
      tagInput: ''
    });
    setIsCreateEditModalOpen(true);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      tags: project.tags || [],
      tagInput: ''
    });
    setIsCreateEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteProject(projectId);
      
      // Close modal if this project was open
      if (selectedProject?.id === projectId) {
        setIsProjectModalOpen(false);
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert('You must be logged in to create/edit projects');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a project title');
      return;
    }

    try {
      if (editingProject) {
        // Update existing project
        await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          tags: formData.tags,
        });
      } else {
        // Create new project
        await createProject({
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          tags: formData.tags,
        });
      }

      // Close modal and reset form
      setIsCreateEditModalOpen(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        status: 'active',
        tags: [],
        tagInput: ''
      });
    } catch (error: any) {
      console.error('Error saving project:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Show user-friendly error message
      if (error.message?.includes('relation') || error.code === '42P01') {
        alert('❌ Database Error: The projects table does not exist.\n\n' +
              'Please run the database migration script first:\n' +
              '1. Go to your Supabase Dashboard\n' +
              '2. Open SQL Editor\n' +
              '3. Run the script from update_schema.sql\n\n' +
              'See DATABASE_SETUP.md for detailed instructions.');
      } else {
        alert(`Failed to save project: ${error.message || 'Unknown error'}\n\nPlease check the console for details.`);
      }
    }
  };

  const handleAddTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'planning':
        return 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300';
      case 'completed':
        return 'text-teal-700 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300';
      case 'paused':
        return 'text-charcoal-600 bg-charcoal-100 dark:bg-charcoal-700 dark:text-charcoal-300';
      default:
        return 'text-charcoal-600 bg-mint-100 dark:bg-charcoal-700 dark:text-mint-300';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getProjectColor = (title: string) => {
    const colors = [
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-cyan-600',
      'bg-emerald-400',
      'bg-teal-400'
    ];
    const index = title.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-mint-100 dark:bg-charcoal-900/85 border border-mint-200 dark:border-charcoal-700 shadow-sm px-6 py-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-white">
              My Projects
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 dark:text-mint-200">
              Manage the projects you've created
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:min-w-[500px]">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
              </div>
              <input
                type="text"
                placeholder="Search my projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 placeholder-teal-500 dark:placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              className="whitespace-nowrap text-sm sm:text-base py-2 sm:py-2.5 flex items-center justify-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl bg-mint-100 dark:bg-charcoal-900/85 border border-mint-200 dark:border-charcoal-700 shadow-sm p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-charcoal-600 dark:text-mint-200">Loading your projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-teal-400 dark:text-teal-500 mb-4">
              <UserGroupIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white mb-2">
              {searchQuery ? 'No projects found' : "You haven't created any projects yet"}
            </h3>
            <p className="text-charcoal-600 dark:text-mint-200 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start by creating your first project and collaborate with others'}
            </p>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              className="inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Project
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleProjectClick(project)}
                className="bg-white dark:bg-charcoal-900 rounded-xl shadow-sm border border-mint-200 dark:border-charcoal-700 p-4 sm:p-6 hover:shadow-emerald-glow transition-all duration-300 cursor-pointer active:scale-[0.98]"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getProjectColor(project.title)} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-base sm:text-lg">
                      {project.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {/* Project Info */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-charcoal-900 dark:text-white mb-1 sm:mb-2">
                    {project.title}
                  </h3>
                  <p className="text-charcoal-600 dark:text-mint-200 text-xs sm:text-sm line-clamp-2 mb-2">
                    {project.description || 'No description provided'}
                  </p>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-mint-100 dark:bg-charcoal-700 text-charcoal-500 dark:text-mint-400 text-xs rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center text-charcoal-500 dark:text-mint-300">
                      <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-charcoal-500 dark:text-mint-300">
                      <UserGroupIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span>{project.collaborators?.length || 0} collaborators</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={(e: React.MouseEvent) => handleEditProject(project, e)}
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800" 
                    onClick={(e: React.MouseEvent) => handleDeleteProject(project.id, e)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={() => setIsCreateEditModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmitProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="Enter project title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your project..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-300 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Add a tag..."
                value={formData.tagInput}
                onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                  }
                }}
                className="flex-1 p-3 border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button type="submit" variant="primary" className="flex-1" onClick={() => {}}>
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsCreateEditModalOpen(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Detail Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={selectedProject?.title}
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 ${getProjectColor(selectedProject.title)} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-2xl">
                  {selectedProject.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                <p className="text-navy-600 dark:text-warm-400 mb-2">
                  {selectedProject.description || 'No description provided'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-navy-500 dark:text-warm-400">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                    {getStatusLabel(selectedProject.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-navy-900 dark:text-white mb-3">Project Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-navy-600 dark:text-warm-400">Collaborators:</span>
                    <span className="text-navy-900 dark:text-white">{selectedProject.collaborators?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-600 dark:text-warm-400">Created:</span>
                    <span className="text-navy-900 dark:text-white">
                      {new Date(selectedProject.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-600 dark:text-warm-400">Last Updated:</span>
                    <span className="text-navy-900 dark:text-white">
                      {new Date(selectedProject.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-navy-900 dark:text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={(e: React.MouseEvent) => {
                  setIsProjectModalOpen(false);
                  handleEditProject(selectedProject, e);
                }}
              >
                Edit Project
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800" 
                onClick={(e: React.MouseEvent) => {
                  handleDeleteProject(selectedProject.id, e);
                }}
              >
                Delete Project
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyProjectsPage;
