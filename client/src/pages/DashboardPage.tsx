import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import UserCard from '../components/UserCard';
import AITeacherCard from '../components/AITeacherCard';
import type { AITeacher } from '../components/AITeacherCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { getAllSkills } from '../api/skillsApi';
import { getAllProfiles } from '../api/profileApi';
import type { Skill } from '../types';
import config from '../config';

import { supabase } from '../lib/supabaseClient';
import 'keen-slider/keen-slider.min.css';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [aiTutors, setAiTutors] = useState<AITeacher[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isNewUser, setIsNewUser] = useState(false);

  // Check if user is new (created within the last hour)
  useEffect(() => {
    if (profile?.created_at) {
      const createdAt = new Date(profile.created_at);
      const now = new Date();
      const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      setIsNewUser(hoursSinceCreation < 1); // New user if created within last hour
    }
  }, [profile]);

  // Real stats from database
  const [stats, setStats] = useState({
    skills: 0,
    professionals: 0,
    projects: 0,
    connections: 0,
  });

  // Fetch real skills and projects from database
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getAllSkills();
        // Sort by users_count to show most popular first
        const sortedSkills = skillsData.sort((a, b) => b.users_count - a.users_count);
        setSkills(sortedSkills);
        setStats(prev => ({ ...prev, skills: skillsData.length }));
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    const fetchProjectsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('visibility', 'public');
        
        if (error) throw error;
        if (count !== null) {
          setStats(prev => ({ ...prev, projects: count }));
        }
      } catch (error) {
        console.error('Error fetching projects count:', error);
      }
    };

    fetchSkills();
    fetchProjectsCount();
  }, []);

  // Fetch real users from database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const profilesData = await getAllProfiles();

        // Filter out current user and show instructors (any instructor-like role)
        const formattedUsers = profilesData
          .filter(u => {
            if (u.id === user?.id) return false;
            const role = u.role?.toLowerCase().trim() || '';
            return role === 'teacher' || role === 'both' || role === 'instructor & student' || role === 'instructor';
          })
          .map(u => ({
            id: u.id,
            name: u.full_name || 'User',
            role: u.role || 'Member',
            location: u.location || 'Unknown',
            skills: u.skills ? u.skills.map((s: any) => s.name) : [],
            avatar: u.avatar_url,
            bio: u.bio,
          }));

        setUsers(formattedUsers);
        setStats(prev => ({ ...prev, professionals: formattedUsers.length }));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch AI tutors as well
    const fetchAITutors = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/ai-teachers?limit=6`);
        const data = await response.json();
        if (data.success && data.teachers) {
          setAiTutors(data.teachers);
        }
      } catch (error) {
        console.error('Error fetching AI tutors:', error);
      }
    };

    if (user) {
      fetchUsers();
      fetchAITutors();
    }
  }, [user]);

  const handleSkillConnect = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleUserConnect = (user: any) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  return (
    // Background/layout ab parent layout se aayega, yaha sirf transition
    <div className="transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 px-4 sm:px-6 py-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                {isNewUser 
                  ? `Welcome to SkillSynergy, ${profile?.full_name || user?.email || 'User'}! 🎉`
                  : `Welcome back, ${profile?.full_name || user?.email || 'User'}! 👋`
                }
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                {isNewUser 
                  ? "Let's get you started! Explore skills and connect with professionals"
                  : "Discover new skills and connect with professionals"
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-4"
          >
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-1">
              {stats.skills}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">Skills</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-4"
          >
            <div className="text-2xl sm:text-3xl font-bold text-teal-500 dark:text-teal-400 mb-1">
              {stats.professionals}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Professionals
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-4"
          >
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 dark:text-emerald-300 mb-1">
              {stats.projects}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">Projects</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-4"
          >
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-1">
              {stats.connections}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Connections
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
              Popular Skills
            </h2>
            <Button variant="outline" size="sm" className="text-sm" onClick={() => navigate('/discover')}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
          ) : skills.length === 0 ? (
            <div className="bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-8 text-center">
              <p className="text-slate-700 dark:text-slate-300 mb-4">No skills available yet</p>
              <Button variant="primary" onClick={() => navigate('/discover')}>
                Add Your First Skill
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.slice(0, 6).map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <SkillCard skill={skill} onConnect={handleSkillConnect} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Users Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
              Featured Instructors
            </h2>
            <Button variant="outline" size="sm" className="text-sm" onClick={() => navigate('/instructors')}>
              View All
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Show 2 AI Tutors first */}
              {aiTutors.slice(0, 2).map((teacher, index) => (
                <AITeacherCard key={teacher.id} teacher={teacher} index={index} />
              ))}
              
              {/* Show remaining spots with Human Instructors (up to 4) */}
              {users.slice(0, 4).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index + 2) * 0.1 }}
                >
                  <UserCard user={user} onConnect={handleUserConnect} />
                </motion.div>
              ))}
              
              {aiTutors.length === 0 && users.length === 0 && (
                <div className="col-span-full bg-mint-100 dark:bg-charcoal-900/80 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-8 text-center">
                  <p className="text-slate-700 dark:text-slate-300">No instructors available yet</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Skill Connection Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title={`Connect to ${selectedSkill?.name}`}
        size="md"
      >
        {selectedSkill && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 ${selectedSkill.color.replace('text-', 'bg-')} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white font-bold text-2xl">
                  {selectedSkill.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedSkill.name}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedSkill.description || 'No description available'}
                </p>
                <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">
                  {selectedSkill.category} • {selectedSkill.level}
                </p>
              </div>
            </div>

            <div className="bg-mint-100 dark:bg-charcoal-800 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-2">
                What would you like to do?
              </h4>
              <div className="space-y-2">
                <Button variant="primary" className="w-full" onClick={() => {}}>
                  Add to My Skills
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/instructors')}
                >
                  Find Professionals
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/app/discover-projects')}
                >
                  Start a Learning Challenge
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

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

export default DashboardPage;
