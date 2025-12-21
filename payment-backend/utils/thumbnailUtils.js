/**
 * Skill Thumbnail Utility
 * Provides category-based thumbnail assignment for skills
 * 
 * This is a zero-runtime-dependency system that uses pre-generated static assets.
 */

// Category to folder slug mapping
const CATEGORY_SLUG_MAP = {
  'Tech & Development': 'tech',
  'Data & AI': 'tech',
  'Design & Creative': 'design',
  'Arts & Music': 'design',
  'Business': 'business',
  'Career & Job Prep': 'business',
  'Personal Finance': 'business',
  'Life Skills & Productivity': 'lifestyle',
  'Health & Fitness': 'lifestyle',
  'Home & Lifestyle': 'lifestyle',
  'Language & Communication': 'language',
  'Hobbies & Games': 'hobbies',
  'Academics & Exams': 'academics',
  'Parenting & Relationships': 'relationships'
};

// Available thumbnails per category slug
const THUMBNAILS = {
  tech: ['tech_1.png', 'tech_2.png', 'tech_3.png'],
  design: ['design_1.png', 'design_2.png'],
  business: ['business_1.png', 'business_2.png'],
  lifestyle: ['lifestyle_1.png', 'lifestyle_2.png'],
  language: ['language_1.png', 'language_2.png'],
  hobbies: ['hobbies_1.png', 'hobbies_2.png'],
  academics: ['academics_1.png', 'academics_2.png'],
  relationships: ['relationships_1.png', 'relationships_2.png']
};

// Default fallback
const DEFAULT_SLUG = 'tech';
const DEFAULT_THUMBNAIL = 'tech_1.png';

/**
 * Get the category slug for a given category name
 * @param {string} category - The skill category name
 * @returns {string} The category slug for the thumbnails folder
 */
function getCategorySlug(category) {
  return CATEGORY_SLUG_MAP[category] || DEFAULT_SLUG;
}

/**
 * Pick a random thumbnail for a given category
 * @param {string} category - The skill category name
 * @returns {{slug: string, filename: string}} The category slug and thumbnail filename
 */
function pickThumbnail(category) {
  const slug = getCategorySlug(category);
  const thumbnails = THUMBNAILS[slug] || [DEFAULT_THUMBNAIL];
  const filename = thumbnails[Math.floor(Math.random() * thumbnails.length)];
  return { slug, filename };
}

/**
 * Get the full thumbnail path for frontend rendering
 * @param {string} slug - Category slug
 * @param {string} filename - Thumbnail filename
 * @returns {string} Full path like "/thumbnails/tech/tech_1.png"
 */
function getThumbnailPath(slug, filename) {
  return `/thumbnails/${slug}/${filename}`;
}

/**
 * Get a thumbnail for a skill (combines pick + path)
 * @param {string} category - The skill category name
 * @returns {string} Full path to the thumbnail
 */
function getSkillThumbnailPath(category) {
  const { slug, filename } = pickThumbnail(category);
  return getThumbnailPath(slug, filename);
}

/**
 * Get available category slugs
 * @returns {string[]} List of valid category slugs
 */
function getAvailableSlugs() {
  return Object.keys(THUMBNAILS);
}

/**
 * Get all thumbnails for a category
 * @param {string} slug - Category slug
 * @returns {string[]} List of thumbnail filenames
 */
function getThumbnailsForSlug(slug) {
  return THUMBNAILS[slug] || [DEFAULT_THUMBNAIL];
}

module.exports = {
  CATEGORY_SLUG_MAP,
  THUMBNAILS,
  DEFAULT_SLUG,
  DEFAULT_THUMBNAIL,
  getCategorySlug,
  pickThumbnail,
  getThumbnailPath,
  getSkillThumbnailPath,
  getAvailableSlugs,
  getThumbnailsForSlug
};
