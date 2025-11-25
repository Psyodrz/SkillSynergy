import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  StarIcon,
  UserGroupIcon,
  PlusIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import SkillCard from '../components/SkillCard';
import UserCard from '../components/UserCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getAllSkills, createSkill, getSkillCategories, deleteSkill } from '../api/skillsApi';
import { getAllProfiles } from '../api/profileApi';
import type { Skill, SkillLevel } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { addSkillToUser } from '../lib/skillHelpers';
import { useTeacherMatch } from '../hooks/useTeacherMatch';
import TeacherMatchList from '../components/TeacherMatchList';

const DiscoverPage = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { teachers: matchedTeachers, loading: matchTeachersLoading, error: matchTeachersError, findTeachers } = useTeacherMatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'All'>('All');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false);
  const [isTeacherMatchOpen, setIsTeacherMatchOpen] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Data states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Create skill form state
  const [newSkillForm, setNewSkillForm] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate' as SkillLevel,
    description: '',
    color: 'text-emerald-500'
  });

  const skillLevels: Array<SkillLevel | 'All'> = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const skillColors = [
    'text-emerald-500',
    'text-teal-500',
    'text-mint-500',
    'text-pink-500',
    'text-orange-500',
    'text-indigo-500',
    'text-red-500',
    'text-teal-500',
    'text-yellow-500'
  ];

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Add to My Skills
  const handleAddSkillToProfile = async () => {
    if (!currentUser || !selectedSkill) return;

    console.log('Adding skill to user:', { userId: currentUser.id, skillId: selectedSkill.id });

    setAddingSkill(true);
    try {
      const result = await addSkillToUser(currentUser.id, selectedSkill.id, selectedSkill.level);

      if (result.success) {
        setToastMessage({ type: 'success', message: `${selectedSkill.name} added to your skills!` });
        setIsSkillModalOpen(false);
      } else if (result.alreadyExists) {
        setToastMessage({ type: 'error', message: 'You already have this skill!' });
      } else {
        setToastMessage({ type: 'error', message: result.error || 'Failed to add skill' });
      }
    } catch (error: any) {
      setToastMessage({ type: 'error', message: 'An error occurred' });
    } finally {
      setAddingSkill(false);
    }
  };

  // Handle Find Professionals - Now includes AI teacher matching
  const handleFindProfessionals = async () => {
    if (!selectedSkill) return;

    console.log('Finding professionals for skill:', { skillId: selectedSkill.id });

    // Close modal
    setIsSkillModalOpen(false);

    // Call teacher matching API if user is logged in
    if (currentUser) {
      await findTeachers({
        userId: currentUser.id,
        skillIds: [selectedSkill.id],
        limit: 10
      });
      // Show teacher match results
      setIsTeacherMatchOpen(true);
    } else {
      // Fallback: Set search query and scroll to users section
      setSearchQuery(selectedSkill.name);
      const usersSection = document.getElementById('users-section');
      if (usersSection) {
        usersSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle Start a Project
  const handleStartProject = () => {
    if (!selectedSkill) return;

    console.log('Starting project with skill:', { skillId: selectedSkill.id, skillName: selectedSkill.name });

    // Navigate to projects page with skill pre-selected
    navigate(`/projects?skillId=${selectedSkill.id}&skillName=${encodeURIComponent(selectedSkill.name)}`);
    setIsSkillModalOpen(false);
  };

  // Fetch skills from database
  useEffect(() => {
    const fetchSkills = async () => {
      setLoadingSkills(true);
      try {
        const skillsData = await getAllSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getSkillCategories();
      setCategories(['All', ...cats]);
    };

    fetchCategories();
  }, [skills]);

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const profilesData = await getAllProfiles();
        
        // Filter out current user and map to expected format
        const formattedUsers = profilesData
          .filter(u => u.id !== currentUser?.id)
          .map(u => ({
            id: u.id,
            name: u.full_name || 'User',
            role: u.role || 'Learner', // Default to Learner if null
            location: u.location || 'Unknown',
            skills: u.skills ? u.skills.map((s: any) => s.name) : [],
            avatar: u.avatar_url,
            bio: u.bio
          }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter skills based on search, category, and level
  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description?.toLowerCase().includes(lowerQuery) ||
        skill.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(skill => skill.level === selectedLevel);
    }

    return filtered;
  }, [skills, searchQuery, selectedCategory, selectedLevel]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery) ||
      user.bio?.toLowerCase().includes(lowerQuery) ||
      user.skills.some((skill: string) => skill.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, users]);

  // Split users into Teachers and Learners
  const teachers = useMemo(() => filteredUsers.filter(u => u.role === 'Teacher'), [filteredUsers]);
  const learners = useMemo(() => filteredUsers.filter(u => u.role !== 'Teacher'), [filteredUsers]);

  // Check if search query matches any existing skill
  const skillExists = useMemo(() => {
    if (!searchQuery) return true;
    return skills.some(skill => 
      skill.name.toLowerCase() === searchQuery.toLowerCase()
    );
  }, [skills, searchQuery]);

  const handleSkillConnect = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleCreateSkillClick = () => {
    setNewSkillForm({
      ...newSkillForm,
      name: searchQuery
    });
    setIsCreateSkillModalOpen(true);
  };

  const handleCreateSkill = async () => {
    try {
      const newSkill = await createSkill(newSkillForm);
      if (newSkill) {
        setSkills([newSkill, ...skills]);
        setIsCreateSkillModalOpen(false);
        setNewSkillForm({
          name: '',
          category: 'Frontend',
          level: 'Intermediate',
          description: '',
          color: 'text-emerald-500'
        });
        alert('✅ Skill created successfully!');
      }
    } catch (error: any) {
      console.error('Error creating skill:', error);
      alert(error.message || 'Failed to create skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill? It will be removed from all user profiles.')) {
      return;
    }

    try {
      await deleteSkill(skillId);
      setSkills(skills.filter(s => s.id !== skillId));
      alert('✅ Skill deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting skill:', error);
      alert(error.message || 'Failed to delete skill. You can only delete skills you created.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toastMessage.message}
        </div>
      )}

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
              Discover Skills & Modules
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 dark:text-mint-200">
              Explore diverse skills and start learning modules
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:min-w-[600px]">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
              </div>
              <input
                type="text"
                placeholder="Search skills, modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 placeholder-teal-500 dark:placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:min-w-[120px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as SkillLevel | 'All')}
              className="px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:min-w-[120px]"
            >
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl bg-mint-100 dark:bg-charcoal-900/85 border border-mint-200 dark:border-charcoal-700 shadow-sm p-4 sm:p-6">
        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-charcoal-900 dark:text-white">
              Skills ({filteredSkills.length})
            </h2>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-charcoal-500 dark:text-mint-300">
              <StarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Discover new skills to learn</span>
              <span className="sm:hidden">Discover skills</span>
            </div>
          </div>

          {/* "Create new skill" prompt if no match found */}
          {searchQuery && !skillExists && filteredSkills.length === 0 && (
            <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-6 text-center">
              <p className="text-charcoal-700 dark:text-mint-200 mb-4">
                No skill found matching <strong>"{searchQuery}"</strong>
              </p>
              <Button
                variant="primary"
                onClick={handleCreateSkillClick}
                className="inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Skill "{searchQuery}"
              </Button>
            </div>
          )}
          
          {loadingSkills ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="relative">
                    <SkillCard
                      skill={skill}
                      onConnect={handleSkillConnect}
                    />
                    {/* Delete button for own skills */}
                    {skill.created_by === currentUser?.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSkill(skill.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-110 shadow-lg z-10"
                        title="Delete skill"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !searchQuery ? (
            <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-xl shadow-premium border border-warm-200 dark:border-navy-700">
              <StarIcon className="h-12 w-12 mx-auto text-navy-400 mb-3" />
              <h3 className="text-lg font-medium text-navy-900 dark:text-white">No skills available</h3>
              <p className="text-navy-500 dark:text-warm-400 mb-4">Be the first to add skills!</p>
              <Button variant="primary" onClick={() => setIsCreateSkillModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                Create First Skill
              </Button>
            </div>
          ) : null}
        </motion.div>

        {/* Teachers Section */}
        {teachers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <AcademicCapIcon className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                Instructors
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {teachers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Learners Section */}
        {learners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                Students
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {learners.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </motion.div>
        )}

        {loadingUsers && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {!loadingUsers && filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-xl shadow-premium border border-warm-200 dark:border-navy-700">
            <UserGroupIcon className="h-12 w-12 mx-auto text-emerald-400 mb-3" />
            <h3 className="text-lg font-medium text-navy-900 dark:text-white">No instructors found</h3>
            <p className="text-navy-500 dark:text-warm-400">Try adjusting your search query</p>
          </div>
        )}
      </div>

      {/* Create Skill Modal */}
      <Modal
        isOpen={isCreateSkillModalOpen}
        onClose={() => setIsCreateSkillModalOpen(false)}
        title="Create New Skill"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={newSkillForm.name}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
              placeholder="e.g., React, Python, UI Design"
              className="w-full p-3 border border-warm-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
                Category *
              </label>
              <select
                value={newSkillForm.category}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value })}
                className="w-full p-3 border border-warm-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
                Level *
              </label>
              <select
                value={newSkillForm.level}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, level: e.target.value as SkillLevel })}
                className="w-full p-3 border border-warm-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
              Description
            </label>
            <textarea
              value={newSkillForm.description}
              onChange={(e) => setNewSkillForm({ ...newSkillForm, description: e.target.value })}
              placeholder="Brief description of this skill..."
              rows={3}
              className="w-full p-3 border border-warm-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-9 gap-2">
              {skillColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewSkillForm({ ...newSkillForm, color })}
                  className={`w-8 h-8 rounded-full ${color.replace('text-', 'bg-')} ${
                    newSkillForm.color === color ? 'ring-2 ring-offset-2 ring-emerald-500' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreateSkill}
              disabled={!newSkillForm.name.trim()}
            >
              Create Skill
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsCreateSkillModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Skill Connection Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={`Start Learning ${selectedSkill?.name}`}
        size="md"
      >
        {selectedSkill && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${selectedSkill.color.replace('text-', 'bg-')} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-2xl">
                  {selectedSkill.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white">
                  {selectedSkill.name}
                </h3>
                <p className="text-navy-600 dark:text-warm-400">
                  {selectedSkill.description || 'No description available'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">
                    {selectedSkill.category}
                  </span>
                  <span className="text-navy-400">•</span>
                  <span className="text-sm text-navy-600 dark:text-warm-400">
                    {selectedSkill.level}
                  </span>
                  <span className="text-navy-400">•</span>
                  <span className="text-sm text-navy-600 dark:text-warm-400">
                    {selectedSkill.users_count} users
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-warm-50 dark:bg-navy-700 rounded-lg p-4">
              <h4 className="font-medium text-navy-900 dark:text-white mb-2">
                What would you like to do?
              </h4>
              <div className="space-y-2">
                <Button 
                  variant="primary" 
                  className="w-full" 
                  onClick={handleAddSkillToProfile}
                  disabled={addingSkill}
                >
                  {addingSkill ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add to My Learning Path'
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleFindProfessionals}>
                  Start Learning
                </Button>
                <Button variant="outline" className="w-full" onClick={handleStartProject}>
                  Join a Practice Challenge
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Teacher Match List Modal */}
      {isTeacherMatchOpen && (
        <TeacherMatchList
          teachers={matchedTeachers}
          loading={matchTeachersLoading}
          error={matchTeachersError}
          onClose={() => setIsTeacherMatchOpen(false)}
          skillName={selectedSkill?.name}
        />
      )}
    </div>
  );
};

export default DiscoverPage;
