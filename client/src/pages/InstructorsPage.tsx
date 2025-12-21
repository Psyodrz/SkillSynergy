import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import UserCard from '../components/UserCard';
import AITeacherCard from '../components/AITeacherCard';
import type { AITeacher } from '../components/AITeacherCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getAllProfiles } from '../api/profileApi';
import config from '../config';

const InstructorsPage = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [aiTeachers, setAiTeachers] = useState<AITeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Initialize search from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const skill = params.get('skill');
    
    if (skill) {
      setSearchQuery(skill);
    } else if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Fetch AI teachers
  useEffect(() => {
    const fetchAITeachers = async () => {
      try {
        const url = searchQuery 
          ? `${config.API_URL}/api/ai-teachers?skill_name=${encodeURIComponent(searchQuery)}`
          : `${config.API_URL}/api/ai-teachers?limit=50`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && data.teachers) {
          setAiTeachers(data.teachers);
        }
      } catch (error) {
        console.error('Error fetching AI teachers:', error);
      }
    };

    fetchAITeachers();
  }, [searchQuery]);

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const profilesData = await getAllProfiles();
        
        // Filter out current user and map to expected format
        const formattedUsers = profilesData
          .filter(u => u.id !== currentUser?.id)
          .map(u => ({
            id: u.id,
            name: u.full_name || 'User',
            role: u.role || 'Learner',
            location: u.location || 'Unknown',
            skills: u.skills ? u.skills.map((s: any) => s.name) : [],
            avatar: u.avatar_url,
            bio: u.bio,
            tagline: 'Passionate Educator' // Placeholder since tagline is not in DB
          }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter for Teachers and apply search
  const teachers = useMemo(() => {
    // Filter by role: Teacher, Both, or Instructor & Student
    let filtered = users.filter(u => {
      const role = u.role?.toLowerCase().trim();
      return role === 'teacher' || role === 'both' || role === 'instructor & student';
    });

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.bio?.toLowerCase().includes(lowerQuery) ||
        user.skills.some((skill: string) => skill.toLowerCase().includes(lowerQuery))
      );
    }

    return filtered;
  }, [users, searchQuery]);

  const handleUserConnect = (user: any) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
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
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-emerald-600" />
              Find Instructors
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 dark:text-mint-200">
              Connect with expert mentors to accelerate your learning
            </p>
          </div>
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-teal-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 text-base border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 placeholder-teal-500 dark:placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </motion.div>
      {/* AI Teachers Section */}
      {aiTeachers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-6 w-6 text-violet-500" />
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">
              AI Tutors - Available 24/7
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTeachers.map((teacher, index) => (
              <AITeacherCard key={teacher.id} teacher={teacher} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Human Teachers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : teachers.length === 0 && aiTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-xl shadow-premium border border-warm-200 dark:border-navy-700">
            <AcademicCapIcon className="h-12 w-12 mx-auto text-emerald-400 mb-3" />
            <h3 className="text-lg font-medium text-navy-900 dark:text-white">
              {searchQuery ? "No instructors available for this skill yet." : "No instructors found"}
            </h3>
            <p className="text-navy-500 dark:text-warm-400">
              {searchQuery ? `We couldn't find any instructors matching "${searchQuery}".` : "Check back later for new instructors!"}
            </p>
          </div>
        ) : teachers.length > 0 ? (
          <>
            {aiTeachers.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <AcademicCapIcon className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">
                  Human Instructors
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teachers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <UserCard user={user} onConnect={handleUserConnect} />
              </motion.div>
            ))}
          </div>
          </>
        ) : null}
      </motion.div>

      {/* User Connection Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={`Connect with ${selectedUser?.name}`}
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedUser.name}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{selectedUser.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedUser.location}
                </p>
              </div>
            </div>

            <div className="bg-mint-100 dark:bg-charcoal-800 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-2">
                Send Connection Request
              </h4>
              <textarea
                placeholder="Add a personal message (optional)"
                className="w-full p-3 border border-mint-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
              />
              <div className="flex space-x-3 mt-4">
                <Button variant="primary" className="flex-1" onClick={() => {}}>
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InstructorsPage;
