import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaceSmileIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Common emojis organized by category
const emojiCategories = {
  recent: [] as string[],
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥'],
  gestures: ['👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤏', '✍️', '💪', '🦾', '🙏'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  objects: ['💡', '📚', '📖', '✏️', '📝', '💻', '📱', '⌨️', '🖥️', '🖱️', '💾', '📷', '🎥', '🔍', '💰', '💳', '📧', '📞', '⏰', '🔔'],
  symbols: ['✅', '❌', '⭐', '🌟', '💯', '🔥', '✨', '💥', '💫', '🎉', '🎊', '🏆', '🥇', '🎯', '💪', '👀', '💬', '💭', '🗯️', '❓', '❗', '‼️', '⁉️']
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>('smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Load recent emojis from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentEmojis');
    if (saved) {
      setRecentEmojis(JSON.parse(saved));
    }
  }, []);

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(updated);
    localStorage.setItem('recentEmojis', JSON.stringify(updated));
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const categoryIcons: Record<keyof typeof emojiCategories, string> = {
    recent: '🕐',
    smileys: '😊',
    gestures: '👋',
    hearts: '❤️',
    objects: '💡',
    symbols: '✨'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={pickerRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full left-0 mb-2 bg-white dark:bg-charcoal-800 rounded-2xl shadow-xl border border-charcoal-200 dark:border-charcoal-600 overflow-hidden w-72 sm:w-80"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-charcoal-200 dark:border-charcoal-600">
            <span className="text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
              Emoji
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-charcoal-100 dark:hover:bg-charcoal-700 text-charcoal-500"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-charcoal-200 dark:border-charcoal-600 px-1">
            {Object.keys(emojiCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as keyof typeof emojiCategories)}
                className={`flex-1 py-2 text-center text-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-700 rounded-t transition-colors ${
                  activeCategory === cat 
                    ? 'bg-charcoal-100 dark:bg-charcoal-700' 
                    : ''
                }`}
                title={cat.charAt(0).toUpperCase() + cat.slice(1)}
              >
                {categoryIcons[cat as keyof typeof emojiCategories]}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="h-48 overflow-y-auto p-2">
            {activeCategory === 'recent' && recentEmojis.length === 0 ? (
              <div className="flex items-center justify-center h-full text-charcoal-400 text-sm">
                No recent emojis
              </div>
            ) : (
              <div className="grid grid-cols-8 gap-1">
                {(activeCategory === 'recent' ? recentEmojis : emojiCategories[activeCategory]).map((emoji, idx) => (
                  <button
                    key={`${emoji}-${idx}`}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-charcoal-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Emoji Button Component for easy integration
export const EmojiButton: React.FC<{ onEmojiSelect: (emoji: string) => void }> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-charcoal-500 dark:text-charcoal-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700 rounded-full transition-colors"
      >
        <FaceSmileIcon className="w-6 h-6" />
      </button>
      <EmojiPicker 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onEmojiSelect={(emoji) => {
          onEmojiSelect(emoji);
          setIsOpen(false);
        }} 
      />
    </div>
  );
};

export default EmojiPicker;
