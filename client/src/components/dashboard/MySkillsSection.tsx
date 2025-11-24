import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import type { DbSkill, UserSkill } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const MySkillsSection = () => {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [allSkills, setAllSkills] = useState<DbSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Form State
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [notes, setNotes] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Create Global Skill State
  const [showNewSkillModal, setShowNewSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Tech & Development');
  const [creatingSkill, setCreatingSkill] = useState(false);

  const handleCreateGlobalSkill = async () => {
    if (!newSkillName) return;
    setCreatingSkill(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          name: newSkillName,
          category: newSkillCategory,
          level: 'Beginner', // Default, doesn't matter much for the catalog item itself
          description: 'User created skill',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setAllSkills([...allSkills, data]);
        setSelectedSkillId(data.id); // Auto-select the new skill
        setShowNewSkillModal(false);
        setNewSkillName('');
      }
    } catch (error) {
      console.error('Error creating global skill:', error);
      alert('Failed to create skill. It might already exist.');
    } finally {
      setCreatingSkill(false);
    }
  };

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
      
      if (userSkillsData) setUserSkills(userSkillsData);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!user || !selectedSkillId) return;
    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill_id: selectedSkillId,
          level_override: selectedLevel,
          notes: notes
        })
        .select('*, skill:skills(*)')
        .single();

      if (error) throw error;
      if (data) {
        setUserSkills([...userSkills, data]);
        setSelectedSkillId('');
        setNotes('');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('user_skills').delete().eq('id', id);
      if (error) throw error;
      setUserSkills(userSkills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const startEdit = (skill: UserSkill) => {
    setEditingId(skill.id);
    setEditLevel(skill.level_override || 'Beginner');
    setEditNotes(skill.notes || '');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .update({ level_override: editLevel, notes: editNotes })
        .eq('id', editingId)
        .select('*, skill:skills(*)')
        .single();

      if (error) throw error;
      if (data) {
        setUserSkills(userSkills.map(s => s.id === editingId ? data : s));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  // Filter out skills user already has
  const availableSkills = allSkills.filter(
    s => !userSkills.some(us => us.skill_id === s.id)
  );

  if (loading) return <div className="p-8 text-center">Loading skills...</div>;

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-sm border border-gray-200 dark:border-charcoal-700 p-6">
      <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-6">My Skills</h2>

      {/* Add Skill Form */}
      <div className="bg-mint-50 dark:bg-charcoal-900/50 p-4 rounded-xl mb-8 border border-mint-100 dark:border-charcoal-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-charcoal-700 dark:text-mint-200">Add New Skill</h3>
          <button 
            onClick={() => setShowNewSkillModal(true)}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
          >
            Can't find your skill? Create it
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a skill...</option>
              {Object.entries(
                availableSkills.reduce((acc, skill) => {
                  const cat = skill.category || 'Other';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(skill);
                  return acc;
                }, {} as Record<string, DbSkill[]>)
              ).map(([category, skills]) => (
                <optgroup key={category} label={category}>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleAddSkill}
              disabled={!selectedSkillId || adding}
              className="w-full p-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            >
              {adding ? 'Adding...' : <><PlusIcon className="w-5 h-5 mr-2" /> Add Skill</>}
            </button>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Optional notes (e.g. '3 years experience', 'Certified')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* Create New Global Skill Modal */}
      {showNewSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-charcoal-900 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-charcoal-700">
            <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-4">Create New Skill</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Add a skill to the global database so you and others can use it.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Underwater Basket Weaving"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
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
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-charcoal-700">
                <button
                  onClick={() => setShowNewSkillModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-charcoal-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-charcoal-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGlobalSkill}
                  disabled={!newSkillName || creatingSkill}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {creatingSkill ? 'Creating...' : 'Create Skill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-3">
        {userSkills.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No skills added yet.</p>
        ) : (
          userSkills.map(skill => (
            <div key={skill.id} className="flex items-center justify-between p-4 bg-white dark:bg-charcoal-900 border border-gray-100 dark:border-charcoal-700 rounded-xl hover:shadow-md transition-shadow">
              {editingId === skill.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-charcoal-900 dark:text-white">{skill.skill?.name}</div>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="p-2 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-sm"
                    />
                    <button onClick={saveEdit} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckIcon className="w-5 h-5" /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XMarkIcon className="w-5 h-5" /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-charcoal-900 dark:text-white text-lg">{skill.skill?.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        skill.level_override === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        skill.level_override === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}>
                        {skill.level_override}
                      </span>
                    </div>
                    {skill.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{skill.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => startEdit(skill)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MySkillsSection;
