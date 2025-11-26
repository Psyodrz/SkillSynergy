import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const OnboardingPage = () => {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '', // 'Student', 'Instructor', 'Both'
    // Instructor fields
    qualification: '',
    experience: '',
    languages: '',
    teaching_skills: [] as { name: string; type: 'teach' }[],
    // Learner fields
    learning_skills: [] as { name: string; type: 'learn' }[],
    learning_goals: ''
  });

  const [newSkill, setNewSkill] = useState('');

  const handleRoleSelect = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    setStep(1);
  };

  const handleAddSkill = (type: 'teach' | 'learn') => {
    if (!newSkill.trim()) return;
    
    if (type === 'teach') {
      setFormData(prev => ({
        ...prev,
        teaching_skills: [...prev.teaching_skills, { name: newSkill.trim(), type: 'teach' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        learning_skills: [...prev.learning_skills, { name: newSkill.trim(), type: 'learn' }]
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number, type: 'teach' | 'learn') => {
    if (type === 'teach') {
      setFormData(prev => ({
        ...prev,
        teaching_skills: prev.teaching_skills.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        learning_skills: prev.learning_skills.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Update Profile in Supabase
      const allSkills = [
        ...formData.teaching_skills,
        ...formData.learning_skills
      ];

      // Append extra info to bio since we can't change schema
      let bioAppend = '';
      if (formData.qualification) bioAppend += `\nQualification: ${formData.qualification}`;
      if (formData.languages) bioAppend += `\nLanguages: ${formData.languages}`;
      if (formData.experience) bioAppend += `\nExperience: ${formData.experience}`;
      if (formData.learning_goals) bioAppend += `\nLearning Goals: ${formData.learning_goals}`;

      // Fetch existing profile to preserve name/avatar
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const updates = {
        role: formData.role === 'Both' ? 'Instructor & Student' : formData.role,
        skills: allSkills,
        bio: (existingProfile?.bio || '') + bioAppend,
        // We can't easily save experience/qualification to dedicated columns if they don't exist
        // But we try to save to 'experience' JSON column if we format it right
        experience: formData.experience ? [{
          position: 'Instructor',
          company: 'Self-Employed', 
          duration: formData.experience,
          description: `Qualification: ${formData.qualification}`
        }] : existingProfile?.experience || []
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update User Metadata to mark onboarding as completed
      const { error: authError } = await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });

      if (authError) throw authError;

      await refreshSession();
      navigate('/dashboard');

    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Steps Logic
  // 0: Role
  // 1: Teacher Details (if role is Instructor or Both)
  // 2: Learner Details (if role is Student or Both)
  // If role is Student, skip step 1. If role is Instructor, skip step 2? No, usually just one path.
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white">Welcome to SkillSynergy</h1>
              <p className="text-charcoal-600 dark:text-mint-200">How would you like to use the platform?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('Student')}
                className="p-6 rounded-xl border-2 border-mint-200 dark:border-charcoal-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-charcoal-800 transition-all group text-left"
              >
                <div className="w-12 h-12 bg-mint-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                  <AcademicCapIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-1">Learn New Skills</h3>
                <p className="text-sm text-charcoal-500 dark:text-mint-300">I want to discover projects, find mentors, and learn.</p>
              </button>

              <button
                onClick={() => handleRoleSelect('Instructor')}
                className="p-6 rounded-xl border-2 border-mint-200 dark:border-charcoal-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-charcoal-800 transition-all group text-left"
              >
                <div className="w-12 h-12 bg-mint-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                  <BriefcaseIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-1">Share Knowledge</h3>
                <p className="text-sm text-charcoal-500 dark:text-mint-300">I want to teach, mentor others, and contribute content.</p>
              </button>
            </div>
            
            <button
              onClick={() => handleRoleSelect('Both')}
              className="w-full p-4 text-center text-charcoal-500 dark:text-mint-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium"
            >
              I want to do both
            </button>
          </motion.div>
        );

      case 1:
        // Logic: If Student, show Learner Step. If Instructor/Both, show Teacher Step first.
        if (formData.role === 'Student') {
          return renderLearnerStep();
        } else {
          return renderTeacherStep();
        }

      case 2:
        // Logic: If Both, show Learner Step now. If Instructor, finish.
        if (formData.role === 'Both') {
          return renderLearnerStep();
        } else {
          // Should not happen if logic is correct, but just in case
          return renderLearnerStep();
        }

      default:
        return null;
    }
  };

  const renderTeacherStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">Instructor Profile</h2>
        <p className="text-charcoal-600 dark:text-mint-200">Tell us about your expertise.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Qualification</label>
          <input
            value={formData.qualification}
            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
            className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g. PhD in Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Experience (Years)</label>
          <input
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g. 5 years"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Languages</label>
          <input
            value={formData.languages}
            onChange={(e) => setFormData({...formData, languages: e.target.value})}
            className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g. English, Spanish"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Skills you can teach</label>
          <div className="flex gap-2 mb-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('teach')}
            />
            <button
              onClick={() => handleAddSkill('teach')}
              className="px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.teaching_skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-full text-sm flex items-center gap-1">
                {skill.name}
                <button onClick={() => handleRemoveSkill(idx, 'teach')}><XMarkIcon className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(0)}
          className="text-charcoal-500 hover:text-charcoal-700 dark:text-mint-300 dark:hover:text-white font-medium"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (formData.role === 'Both') setStep(2);
            else handleFinish();
          }}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          {formData.role === 'Both' ? 'Next' : 'Finish'}
          {formData.role === 'Both' && <ArrowRightIcon className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );

  const renderLearnerStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white">Learning Profile</h2>
        <p className="text-charcoal-600 dark:text-mint-200">What do you want to achieve?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Skills you want to learn</label>
          <div className="flex gap-2 mb-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill('learn')}
            />
            <button
              onClick={() => handleAddSkill('learn')}
              className="px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.learning_skills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-mint-100 dark:bg-charcoal-700 text-charcoal-700 dark:text-mint-200 rounded-full text-sm flex items-center gap-1">
                {skill.name}
                <button onClick={() => handleRemoveSkill(idx, 'learn')}><XMarkIcon className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-1">Learning Goals</label>
          <textarea
            value={formData.learning_goals}
            onChange={(e) => setFormData({...formData, learning_goals: e.target.value})}
            className="w-full rounded-lg border-mint-200 dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            rows={3}
            placeholder="e.g. I want to become a Full Stack Developer..."
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(formData.role === 'Both' ? 1 : 0)}
          className="text-charcoal-500 hover:text-charcoal-700 dark:text-mint-300 dark:hover:text-white font-medium"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          disabled={loading}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          {loading ? 'Saving...' : 'Get Started'}
          {!loading && <CheckCircleIcon className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium p-8 border border-mint-200 dark:border-charcoal-700">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
