/**
 * Skill Thumbnail Utility for Frontend
 * Provides category-based thumbnail assignment and path resolution
 * 
 * This mirrors the backend utility for consistency
 */

// Category to folder slug mapping
export const CATEGORY_SLUG_MAP: Record<string, string> = {
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
export const THUMBNAILS: Record<string, string[]> = {
  tech: ['tech_1.png', 'tech_2.png', 'tech_3.png'],
  design: ['design_1.png', 'design_2.png'],
  business: ['business_1.png', 'business_2.png'],
  lifestyle: ['lifestyle_1.png', 'lifestyle_2.png'],
  language: ['language_1.png', 'language_2.png'],
  hobbies: ['hobbies_1.png', 'hobbies_2.png'],
  academics: ['academics_1.png', 'academics_2.png'],
  relationships: ['relationships_1.png', 'relationships_2.png']
};

// Default fallbacks
export const DEFAULT_SLUG = 'tech';
export const DEFAULT_THUMBNAIL = 'tech_1.png';

/**
 * Get the category slug for a given category name
 */
export function getCategorySlug(category: string): string {
  return CATEGORY_SLUG_MAP[category] || DEFAULT_SLUG;
}

/**
 * Pick a random thumbnail for a given category
 */
export function pickThumbnail(category: string): { slug: string; filename: string } {
  const slug = getCategorySlug(category);
  const thumbnails = THUMBNAILS[slug] || [DEFAULT_THUMBNAIL];
  const filename = thumbnails[Math.floor(Math.random() * thumbnails.length)];
  return { slug, filename };
}

/**
 * Get the full thumbnail URL/path for a skill
 * If skill has a thumbnail in DB, use it
 * Otherwise, use the fallback based on category
 */
export function getSkillThumbnailUrl(skill: { thumbnail?: string | null; category: string }): string {
  if (skill.thumbnail) {
    // Thumbnail stored as "slug/filename" format
    return `/thumbnails/${skill.thumbnail}`;
  }
  
  // Fallback: pick based on category
  const { slug, filename } = pickThumbnail(skill.category);
  return `/thumbnails/${slug}/${filename}`;
}

/**
 * Get a fallback thumbnail for a category
 * Always returns the first thumbnail for consistency (no randomness for fallbacks)
 */
export function getFallbackThumbnail(category: string): string {
  const slug = getCategorySlug(category);
  const fallback = THUMBNAILS[slug]?.[0] || DEFAULT_THUMBNAIL;
  return `/thumbnails/${slug}/${fallback}`;
}

/**
 * Generate a thumbnail path to be stored in the database
 * Format: "slug/filename"
 */
export function generateThumbnailPath(category: string): string {
  const { slug, filename } = pickThumbnail(category);
  return `${slug}/${filename}`;
}
