import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  PencilSquareIcon, 
  PlusIcon, 
  XMarkIcon, 
  CheckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AvatarUploader from '../components/AvatarUploader';

// Modal Component for adding Experience
const ExperienceModal = ({ isOpen, onClose, onSave }) => {
  const [exp, setExp] = useState({
    position: '',
    company: '',
    duration: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(exp);
    setExp({ position: '', company: '', duration: '', description: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-mint-200 dark:border-charcoal-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">Add Teaching Experience</h3>
          <button onClick={onClose} className="text-charcoal-500 hover:text-charcoal-700 dark:text-mint-300 dark:hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Position</label>
            <input 
              required
              value={exp.position}
              onChange={e => setExp({...exp, position: e.target.value})}
              className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Senior Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Company</label>
            <input 
              required
              value={exp.company}
              onChange={e => setExp({...exp, company: e.target.value})}
              className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Tech Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Duration</label>
            <input 
              required
              value={exp.duration}
              onChange={e => setExp({...exp, duration: e.target.value})}
              className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. 2020 - Present"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Description</label>
            <textarea 
              value={exp.description}
              onChange={e => setExp({...exp, description: e.target.value})}
              className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Brief description of your role..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-charcoal-700 dark:text-mint-200 hover:bg-mint-100 dark:hover:bg-charcoal-700 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-emerald-glow">
              Add Teaching Experience
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, profile, loading: authLoading, refreshSession } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showExpModal, setShowExpModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    role: '',
    location: '',
    bio: '',
    skills: [],
    teaching_skills: [],
    qualification: '',
    languages: '',
    experience: []
  });

  // Helper to safely parse JSON
  const parseJSON = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return [];
      }
    }
    return [];
  };

  // Load data
  useEffect(() => {
    if (profile) {
      const allSkills = parseJSON(profile.skills);
      const learning = allSkills.filter(s => !s.type || s.type === 'learn');
      const teaching = allSkills.filter(s => s.type === 'teach');

      // Parse bio for qualification/languages
      let bioText = profile.bio || '';
      let qual = '';
      let langs = '';
      
      const qualMatch = bioText.match(/Qualification: (.*?)(\n|$)/);
      if (qualMatch) {
        qual = qualMatch[1];
        bioText = bioText.replace(qualMatch[0], '').trim();
      }
      
      const langMatch = bioText.match(/Languages: (.*?)(\n|$)/);
      if (langMatch) {
        langs = langMatch[1];
        bioText = bioText.replace(langMatch[0], '').trim();
      }

      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        role: profile.role || '',
        location: profile.location || '',
        bio: bioText,
        skills: learning,
        teaching_skills: teaching,
        qualification: qual,
        languages: langs,
        experience: parseJSON(profile.experience)
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Skill Handlers
  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: 'Intermediate' }]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const [newTeachingSkill, setNewTeachingSkill] = useState('');

  const addTeachingSkill = (e) => {
    e.preventDefault();
    if (newTeachingSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        teaching_skills: [...prev.teaching_skills, { name: newTeachingSkill.trim(), level: 'Expert', type: 'teach' }]
      }));
      setNewTeachingSkill('');
    }
  };

  const removeTeachingSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      teaching_skills: prev.teaching_skills.filter((_, i) => i !== index)
    }));
  };

  // Experience Handlers
  const addExperience = (exp) => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, exp]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    console.log('🔵 handleSave called');
    console.log('🔵 User object:', user);
    
    if (!user) {
      console.error('❌ No user object, aborting save');
      setMessage({ type: 'error', text: 'Not authenticated' });
      return;
    }
    
    console.log('🔵 Setting saving state to true');
    setSaving(true);
    setMessage(null);

    try {
      console.log('🔵 Current formData:', formData);
      
      const combinedSkills = [
        ...formData.skills.map(s => ({ ...s, type: 'learn' })),
        ...formData.teaching_skills.map(s => ({ ...s, type: 'teach' }))
      ];
      
      let finalBio = formData.bio;
      if (formData.qualification) finalBio += `\nQualification: ${formData.qualification}`;
      if (formData.languages) finalBio += `\nLanguages: ${formData.languages}`;

      const updates = {
        full_name: formData.full_name?.trim() || null,
        avatar_url: formData.avatar_url || null,
        role: formData.role?.trim() || null,
        location: formData.location?.trim() || null,
        bio: finalBio?.trim() || null,
        skills: combinedSkills,
        experience: formData.experience,
      };

      console.log('🔵 Updates object prepared:', updates);
      console.log('🔵 Skills type:', Array.isArray(updates.skills) ? 'Array' : typeof updates.skills);
      console.log('🔵 Experience type:', Array.isArray(updates.experience) ? 'Array' : typeof updates.experience);
      console.log('🔵 User ID:', user.id);
      
      console.log('🔵 Calling Supabase update...');
      
      // Get user's session token from localStorage (Supabase client is hanging)
      const supabaseAuthKey = `sb-${import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
      const sessionData = localStorage.getItem(supabaseAuthKey);
      let userToken = null;
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          userToken = parsed?.access_token || parsed?.currentSession?.access_token;
          console.log('🔵 Got token from localStorage:', userToken ? 'Yes' : 'No');
        } catch (e) {
          console.error('Failed to parse session from localStorage:', e);
        }
      }
      
      if (!userToken) {
        throw new Error('No valid session token found in localStorage');
      }
      
      // Try direct REST API call with user token
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🔵 Using direct fetch to:', `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`);
      console.log('🔵 Using user token:', userToken ? 'Yes (exists)' : 'No (missing)');
      
      let data = null;
      let error = null;
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${userToken}`, // Use USER token, not anon key!
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updates)
        });

        console.log('🔵 Fetch response received');
        console.log('🔵 Status:', response.status);
        console.log('🔵 Status Text:', response.statusText);

        data = await response.json();
        console.log('🔵 Response data:', data);

        if (!response.ok) {
          error = new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
          throw error;
        }

      } catch (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        error = fetchError;
      }

      console.log('🔵 Data:', data);
      console.log('🔵 Error:', error);

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Save successful!');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      console.log('🔵 Calling refreshSession...');
      await refreshSession();
      console.log('✅ Session refreshed');

    } catch (error) {
      console.error('❌ Save error:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      setMessage({ 
        type: 'error', 
        text: `Failed to save: ${error.message || 'Unknown error'}` 
      });
    } finally {
      console.log('🔵 Setting saving state to false');
      setSaving(false);
      setTimeout(() => setMessage(null), 5000); // Increased to 5s for visibility
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mint-50 dark:bg-charcoal-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Toast Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-8 z-50 px-6 py-3 rounded-xl shadow-lg font-medium ${
                message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-mint-200 dark:border-charcoal-700 overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-charcoal-800 p-1 shadow-lg">
                <AvatarUploader
                  url={formData.avatar_url}
                  size={88} // 24 * 4 - padding (approx) or just fit parent
                  onUpload={(url) => {
                    setFormData(prev => ({ ...prev, avatar_url: url }));
                    // Optional: Auto-save or just let user click save
                  }}
                  editable={isEditing}
                  userId={user?.id}
                  name={formData.full_name}
                />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 hover:bg-mint-50 rounded-lg transition-colors text-sm font-medium shadow-sm"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckIcon className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            {isEditing ? (
              <div className="space-y-4 max-w-xl">
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-charcoal-900 dark:text-white w-full bg-transparent border-b border-mint-200 dark:border-charcoal-600 focus:border-emerald-500 focus:outline-none px-0 py-1"
                  placeholder="Your Name"
                />
                <div className="mt-2 mb-2">
                  <label className="text-xs font-medium text-charcoal-500 dark:text-mint-300 uppercase tracking-wider mb-1 block">
                    Primary Role
                  </label>
                  <select
                    name="role"
                    value={formData.role || 'Student'}
                    onChange={handleInputChange}
                    className="text-lg text-charcoal-700 dark:text-mint-200 w-full bg-transparent border-b border-mint-200 dark:border-charcoal-600 focus:border-emerald-500 focus:outline-none px-0 py-1 cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Instructor & Student">Instructor & Student</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-charcoal-500 dark:text-mint-300">
                  <MapPinIcon className="w-5 h-5" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-mint-200 dark:border-charcoal-600 focus:border-emerald-500 focus:outline-none px-0 py-1 w-full max-w-xs"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white">
                  {formData.full_name || 'Your Name'}
                </h1>
                <p className="text-lg text-charcoal-700 dark:text-mint-200">
                  {formData.role || 'Add your role'}
                </p>
                <div className="flex items-center gap-2 text-charcoal-500 dark:text-mint-300">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{formData.location || 'Add location'}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bio Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
            >
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6 text-emerald-500" />
                About
              </h2>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 p-4"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Qualification</label>
                      <input
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g. PhD in CS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Languages</label>
                      <input
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g. English, Spanish"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-charcoal-700 dark:text-mint-200 leading-relaxed whitespace-pre-wrap">
                    {formData.bio || 'No bio added yet.'}
                  </p>
                  {(formData.qualification || formData.languages) && (
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-mint-100 dark:border-charcoal-700">
                      {formData.qualification && (
                        <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-mint-300">
                          <AcademicCapIcon className="w-5 h-5 text-emerald-500" />
                          <span>{formData.qualification}</span>
                        </div>
                      )}
                      {formData.languages && (
                        <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-mint-300">
                          <span className="font-semibold text-emerald-500">Aa</span>
                          <span>{formData.languages}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Experience Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-emerald-500" />
                  Teaching Experience
                </h2>
                {isEditing && (
                  <button 
                    onClick={() => setShowExpModal(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Teaching Experience
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {formData.experience.length > 0 ? (
                  formData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8 border-l-2 border-mint-200 dark:border-charcoal-700 last:border-0 pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-charcoal-800" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">{exp.position}</h3>
                          <p className="text-emerald-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-charcoal-500 dark:text-mint-300 mt-1">{exp.duration}</p>
                          <p className="text-charcoal-700 dark:text-mint-200 mt-2">{exp.description}</p>
                        </div>
                        {isEditing && (
                          <button 
                            onClick={() => removeExperience(index)}
                            className="text-charcoal-500 hover:text-red-500 transition-colors p-1"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-charcoal-500 dark:text-mint-300 italic">No experience added yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Teaching Skills Section - Only for Instructors */}
            {(formData.role?.toLowerCase().includes('instructor') || formData.role?.toLowerCase().includes('teacher')) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
              >
                <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-emerald-500" />
                  Skills I Teach
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.teaching_skills.length > 0 ? (
                    formData.teaching_skills.map((skill, index) => (
                      <div 
                        key={index}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-sm font-medium text-emerald-800 dark:text-emerald-200"
                      >
                        <span>{skill.name}</span>
                        {isEditing && (
                          <button 
                            onClick={() => removeTeachingSkill(index)}
                            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-charcoal-500 dark:text-mint-300 italic text-sm">No teaching skills added yet.</p>
                  )}
                </div>

                {isEditing && (
                  <form onSubmit={addTeachingSkill} className="flex gap-2">
                    <input
                      value={newTeachingSkill}
                      onChange={(e) => setNewTeachingSkill(e.target.value)}
                      placeholder="Add a skill you teach..."
                      className="flex-1 rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button 
                      type="submit"
                      disabled={!newTeachingSkill.trim()}
                      className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-emerald-glow"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Skills Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
            >
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
                <AcademicCapIcon className="w-6 h-6 text-emerald-500" />
                Skills I'm Learning
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-mint-100 dark:bg-charcoal-700 rounded-full text-sm font-medium text-charcoal-700 dark:text-mint-200"
                    >
                      <span>{skill.name}</span>
                      {isEditing && (
                        <button 
                          onClick={() => removeSkill(index)}
                          className="text-charcoal-500 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-charcoal-500 dark:text-mint-300 italic text-sm">No skills added yet.</p>
                )}
              </div>

              {isEditing && (
                <form onSubmit={addSkill} className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button 
                    type="submit"
                    disabled={!newSkill.trim()}
                    className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-emerald-glow"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-charcoal-900 to-charcoal-800 rounded-2xl shadow-lg p-6 text-white border border-charcoal-700"
            >
              <h3 className="text-lg font-semibold mb-4">Profile Strength</h3>
              <div className="w-full bg-charcoal-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-1000 shadow-emerald-glow" 
                  style={{ width: `${Math.min(100, (formData.skills.length * 10) + (formData.experience.length * 20) + (formData.bio ? 20 : 0))}%` }}
                ></div>
              </div>
              <p className="text-sm text-mint-300">
                Add more details to improve your profile visibility and strength.
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Experience Modal */}
      <ExperienceModal 
        isOpen={showExpModal} 
        onClose={() => setShowExpModal(false)} 
        onSave={addExperience}
      />
    </div>
  );
};

export default ProfilePage;