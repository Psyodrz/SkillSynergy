import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import type { DbSkill, UserSkill } from '../../types';
import { PlusIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import SkillPickerModal from '../SkillPickerModal';
import SkillChip from '../SkillChip';
import type { SkillPreset } from '../../data/skillPresets';

interface SelectedSkill extends SkillPreset {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const MySkillsSection = () => {
  const { user } = useAuth();
  const [_userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [_allSkills, setAllSkills] = useState<DbSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal States
  const [isTeachModalOpen, setIsTeachModalOpen] = useState(false);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  
  // Selected skills for each mode
  const [teachingSkills, setTeachingSkills] = useState<SelectedSkill[]>([]);
  const [learningSkills, setLearningSkills] = useState<SelectedSkill[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch global skills
      const { data: skillsData } = await supabase.from('skills').select('*').order('name');
      if (skillsData) setAllSkills(skillsData);

      // Fetch user skills
      const { data: userSkillsData } = await supabase
        .from('user_skills')
        .select('*, skill:skills(*)')
        .eq('user_id', user?.id);
      
      if (userSkillsData) {
        setUserSkills(userSkillsData);
        
        // Convert to SelectedSkill format for modals
        const teaching = userSkillsData
          .filter(us => us.skill_type === 'teach')
          .map(us => ({
            id: us.skill_id || us.skill?.id || '',
            name: us.skill?.name || '',
            category: us.skill?.category || 'Other',
            level: (us.level_override || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
            description: us.skill?.description || '',
            keywords: [],
            isCustom: us.is_custom
          }));
        
        const learning = userSkillsData
          .filter(us => us.skill_type === 'learn' || !us.skill_type)
          .map(us => ({
            id: us.skill_id || us.skill?.id || '',
            name: us.skill?.name || '',
            category: us.skill?.category || 'Other',
            level: (us.level_override || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
            description: us.skill?.description || '',
            keywords: [],
            isCustom: us.is_custom
          }));
        
        setTeachingSkills(teaching);
        setLearningSkills(learning);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSkills = async (skills: SelectedSkill[], type: 'teach' | 'learn') => {
    if (!user) return;
    setSaving(true);
    
    try {
      // Delete existing skills of this type
      await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_type', type);
      
      if (skills.length > 0) {
        // For each skill, check if it exists in the global skills table
        for (const skill of skills) {
          let skillId = skill.id;
          
          // If it's a custom skill, create it in the global skills table first
          if (skill.isCustom || skill.id.startsWith('custom-')) {
            const { data: existingSkill } = await supabase
              .from('skills')
              .select('id')
              .eq('name', skill.name)
              .single();
            
            if (existingSkill) {
              skillId = existingSkill.id;
            } else {
              const { data: newSkill } = await supabase
                .from('skills')
                .insert({
                  name: skill.name,
                  category: skill.category,
                  level: skill.level,
                  description: skill.description || 'Custom skill',
                  created_by: user.id
                })
                .select()
                .single();
              
              if (newSkill) {
                skillId = newSkill.id;
              }
            }
          }
          
          // Insert user skill
          await supabase
            .from('user_skills')
            .insert({
              user_id: user.id,
              skill_id: skillId,
              skill_type: type,
              level_override: skill.level,
              is_custom: skill.isCustom || false
            });
        }
      }
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTeachingSkillsChange = (skills: SelectedSkill[]) => {
    setTeachingSkills(skills);
  };

  const handleLearningSkillsChange = (skills: SelectedSkill[]) => {
    setLearningSkills(skills);
  };

  const handleTeachModalClose = () => {
    setIsTeachModalOpen(false);
    saveSkills(teachingSkills, 'teach');
  };

  const handleLearnModalClose = () => {
    setIsLearnModalOpen(false);
    saveSkills(learningSkills, 'learn');
  };

  const removeTeachingSkill = (skillId: string) => {
    const updated = teachingSkills.filter(s => s.id !== skillId);
    setTeachingSkills(updated);
    saveSkills(updated, 'teach');
  };

  const removeLearningSkill = (skillId: string) => {
    const updated = learningSkills.filter(s => s.id !== skillId);
    setLearningSkills(updated);
    saveSkills(updated, 'learn');
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
      <p className="mt-2 text-gray-500">Loading skills...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Skills I Can Teach Section */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">Skills I Can Teach</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teachingSkills.length} skill{teachingSkills.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTeachModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Skills
          </button>
        </div>

        {teachingSkills.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-charcoal-900/50 rounded-xl border border-dashed border-gray-300 dark:border-charcoal-600">
            <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No teaching skills added yet.</p>
            <button
              onClick={() => setIsTeachModalOpen(true)}
              className="mt-3 text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              Add skills you can teach →
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {teachingSkills.map(skill => (
              <SkillChip
                key={skill.id}
                name={skill.name}
                category={skill.category}
                level={skill.level}
                isCustom={skill.isCustom}
                onRemove={() => removeTeachingSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skills I'm Learning Section */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">Skills I'm Learning</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {learningSkills.length} skill{learningSkills.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLearnModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Skills
          </button>
        </div>

        {learningSkills.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-charcoal-900/50 rounded-xl border border-dashed border-gray-300 dark:border-charcoal-600">
            <SparklesIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No learning goals added yet.</p>
            <button
              onClick={() => setIsLearnModalOpen(true)}
              className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Add skills you want to learn →
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {learningSkills.map(skill => (
              <SkillChip
                key={skill.id}
                name={skill.name}
                category={skill.category}
                level={skill.level}
                isCustom={skill.isCustom}
                onRemove={() => removeLearningSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skill Picker Modals */}
      <SkillPickerModal
        isOpen={isTeachModalOpen}
        onClose={handleTeachModalClose}
        selectedSkills={teachingSkills}
        onSkillsChange={handleTeachingSkillsChange}
        mode="teach"
        maxSelections={20}
      />

      <SkillPickerModal
        isOpen={isLearnModalOpen}
        onClose={handleLearnModalClose}
        selectedSkills={learningSkills}
        onSkillsChange={handleLearningSkillsChange}
        mode="learn"
        maxSelections={20}
      />

      {/* Saving Indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-charcoal-900 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Saving...
        </div>
      )}
    </div>
  );
};

export default MySkillsSection;
