import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  skillCategories, 
  searchSkills, 
  getCategoryByName,
  type SkillPreset 
} from '../data/skillPresets';
import SkillChip from './SkillChip';

interface SelectedSkill extends SkillPreset {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface SkillPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  mode: 'teach' | 'learn';
  maxSelections?: number;
}

export default function SkillPickerModal({
  isOpen,
  onClose,
  selectedSkills,
  onSkillsChange,
  mode,
  maxSelections = 20
}: SkillPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Tech & Development');
  const [customSkillLevel, setCustomSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);

  // Filter skills based on search and category
  const filteredSkills = useMemo(() => {
    return searchSkills(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  // Check if a skill is selected
  const isSelected = useCallback((skillId: string) => {
    return selectedSkills.some(s => s.id === skillId);
  }, [selectedSkills]);

  // Toggle skill selection
  const toggleSkill = useCallback((skill: SkillPreset) => {
    if (isSelected(skill.id)) {
      onSkillsChange(selectedSkills.filter(s => s.id !== skill.id));
    } else if (selectedSkills.length < maxSelections) {
      onSkillsChange([...selectedSkills, { ...skill, level: skill.level }]);
    }
  }, [selectedSkills, onSkillsChange, isSelected, maxSelections]);

  // Update skill level
  const updateSkillLevel = useCallback((skillId: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    onSkillsChange(selectedSkills.map(s => 
      s.id === skillId ? { ...s, level } : s
    ));
  }, [selectedSkills, onSkillsChange]);

  // Remove skill
  const removeSkill = useCallback((skillId: string) => {
    onSkillsChange(selectedSkills.filter(s => s.id !== skillId));
  }, [selectedSkills, onSkillsChange]);

  // Add custom skill
  const addCustomSkill = useCallback(() => {
    if (!customSkillName.trim()) return;
    
    const customSkill: SelectedSkill = {
      id: `custom-${Date.now()}`,
      name: customSkillName.trim(),
      category: customSkillCategory,
      level: customSkillLevel,
      description: 'Custom skill',
      keywords: [],
      isCustom: true
    };
    
    onSkillsChange([...selectedSkills, customSkill]);
    setCustomSkillName('');
    setShowCustomModal(false);
  }, [customSkillName, customSkillCategory, customSkillLevel, selectedSkills, onSkillsChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (showCustomModal) {
            setShowCustomModal(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, filteredSkills.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < filteredSkills.length) {
            toggleSkill(filteredSkills[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, filteredSkills, toggleSkill, onClose, showCustomModal]);

  // Focus search on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setActiveCategory('all');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && skillsContainerRef.current) {
      const items = skillsContainerRef.current.querySelectorAll('[data-skill-item]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-4xl bg-white dark:bg-charcoal-900 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-charcoal-700">
            <div>
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">
                {mode === 'teach' ? 'Skills You Can Teach' : 'Skills to Learn'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedSkills.length} / {maxSelections} skills selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-charcoal-800 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-charcoal-700 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder="Search skills... (e.g., React, Python, Design)"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 rounded-xl text-charcoal-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setFocusedIndex(-1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? `${cat.bgColor} ${cat.color}`
                      : 'bg-gray-100 dark:bg-charcoal-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-charcoal-700'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-800/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Selected Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-1">
                    <SkillChip
                      name={skill.name}
                      category={skill.category}
                      level={skill.level}
                      isCustom={skill.isCustom}
                      onRemove={() => removeSkill(skill.id)}
                      size="sm"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkillLevel(skill.id, e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="text-xs px-1.5 py-0.5 rounded border border-gray-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-800 text-gray-700 dark:text-gray-300"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          <div 
            ref={skillsContainerRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {filteredSkills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No skills found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add "{searchQuery}" as Custom Skill
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSkills.map((skill, index) => {
                  const selected = isSelected(skill.id);
                  const focused = focusedIndex === index;
                  const categoryInfo = getCategoryByName(skill.category);
                  
                  return (
                    <motion.button
                      key={skill.id}
                      data-skill-item
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => toggleSkill(skill)}
                      disabled={!selected && selectedSkills.length >= maxSelections}
                      className={`
                        relative p-4 rounded-xl text-left transition-all duration-200
                        ${selected 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500' 
                          : 'bg-white dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                        }
                        ${focused ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-charcoal-900' : ''}
                        ${!selected && selectedSkills.length >= maxSelections ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                      `}
                    >
                      {/* Selection indicator */}
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Category badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${categoryInfo?.bgColor} ${categoryInfo?.color}`}>
                        {categoryInfo && <categoryInfo.icon className="w-3 h-3" />}
                        {skill.category.split(' ')[0]}
                      </div>
                      
                      {/* Skill name */}
                      <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">
                        {skill.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {skill.description}
                      </p>
                      
                      {/* Level */}
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          skill.level === 'Advanced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                          skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-t border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-800/50 pb-safe">
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Custom Skill
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Done ({selectedSkills.length})
              </button>
            </div>
          </div>
        </motion.div>

        {/* Custom Skill Modal */}
        <AnimatePresence>
          {showCustomModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-4 z-10"
            >
              <div 
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowCustomModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-charcoal-900 rounded-2xl shadow-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center gap-2 mb-4">
                  <StarIcon className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">Add Custom Skill</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={customSkillName}
                      onChange={(e) => setCustomSkillName(e.target.value)}
                      placeholder="e.g., Blockchain Development"
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 rounded-xl text-charcoal-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={customSkillCategory}
                      onChange={(e) => setCustomSkillCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 rounded-xl text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {skillCategories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Level
                    </label>
                    <select
                      value={customSkillLevel}
                      onChange={(e) => setCustomSkillLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 rounded-xl text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCustomModal(false)}
                    className="flex-1 px-4 py-2.5 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-charcoal-800 rounded-xl hover:bg-gray-200 dark:hover:bg-charcoal-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCustomSkill}
                    disabled={!customSkillName.trim()}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Skill
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
