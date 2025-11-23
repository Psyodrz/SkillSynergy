// Helper functions for SkillSynergy application

/**
 * Filter skills based on search query
 * @param {Array} skills - Array of skill objects
 * @param {string} query - Search query
 * @returns {Array} Filtered skills
 */
export const filterSkills = (skills, query) => {
  if (!query) return skills;
  
  return skills.filter(skill => 
    skill.name.toLowerCase().includes(query.toLowerCase()) ||
    skill.description.toLowerCase().includes(query.toLowerCase()) ||
    skill.category.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Filter users based on search query
 * @param {Array} users - Array of user objects
 * @param {string} query - Search query
 * @returns {Array} Filtered users
 */
export const filterUsers = (users, query) => {
  if (!query) return users;
  
  return users.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.role.toLowerCase().includes(query.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
  );
};

/**
 * Get skill level color
 * @param {string} level - Skill level
 * @returns {string} Tailwind color class
 */
export const getSkillLevelColor = (level) => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
