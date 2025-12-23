import { 
  CodeBracketIcon, 
  ChartBarIcon, 
  PaintBrushIcon, 
  LanguageIcon, 
  BriefcaseIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  HeartIcon, 
  MusicalNoteIcon, 
  PuzzlePieceIcon, 
  AcademicCapIcon, 
  HomeIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export interface SkillPreset {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  keywords: string[];
  isCustom?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: typeof CodeBracketIcon;
  color: string;
  bgColor: string;
}

export const skillCategories: SkillCategory[] = [
  { id: 'all', name: 'All Skills', icon: PuzzlePieceIcon, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'tech', name: 'Tech & Development', icon: CodeBracketIcon, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'data', name: 'Data & AI', icon: ChartBarIcon, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'design', name: 'Design & Creative', icon: PaintBrushIcon, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { id: 'language', name: 'Language & Communication', icon: LanguageIcon, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'career', name: 'Career & Job Prep', icon: BriefcaseIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'finance', name: 'Personal Finance', icon: CurrencyDollarIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'productivity', name: 'Life Skills & Productivity', icon: ClockIcon, color: 'text-teal-600', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  { id: 'health', name: 'Health & Fitness', icon: HeartIcon, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'arts', name: 'Arts & Music', icon: MusicalNoteIcon, color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  { id: 'hobbies', name: 'Hobbies & Games', icon: PuzzlePieceIcon, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'academics', name: 'Academics & Exams', icon: AcademicCapIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  { id: 'home', name: 'Home & Lifestyle', icon: HomeIcon, color: 'text-lime-600', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  { id: 'parenting', name: 'Parenting & Relationships', icon: UserGroupIcon, color: 'text-rose-600', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
];

// Map full category names to short IDs
const categoryMap: Record<string, string> = {
  'Tech & Development': 'tech',
  'Data & AI': 'data',
  'Design & Creative': 'design',
  'Language & Communication': 'language',
  'Career & Job Prep': 'career',
  'Personal Finance': 'finance',
  'Life Skills & Productivity': 'productivity',
  'Health & Fitness': 'health',
  'Arts & Music': 'arts',
  'Hobbies & Games': 'hobbies',
  'Academics & Exams': 'academics',
  'Home & Lifestyle': 'home',
  'Parenting & Relationships': 'parenting',
};

export const getCategoryId = (categoryName: string): string => {
  return categoryMap[categoryName] || 'other';
};

export const getCategoryByName = (categoryName: string): SkillCategory | undefined => {
  const id = getCategoryId(categoryName);
  return skillCategories.find(c => c.id === id);
};

// Enhanced skill presets with search keywords
export const skillPresets: SkillPreset[] = [
  // Tech & Development
  { id: 'html5', name: 'HTML5 Basics', category: 'Tech & Development', level: 'Beginner', description: 'Learn the structure of the web.', keywords: ['html', 'web', 'frontend', 'markup'] },
  { id: 'css3', name: 'CSS3 Styling', category: 'Tech & Development', level: 'Beginner', description: 'Style your web pages with modern CSS.', keywords: ['css', 'styling', 'frontend', 'design', 'tailwind'] },
  { id: 'js-fundamentals', name: 'JavaScript Fundamentals', category: 'Tech & Development', level: 'Beginner', description: 'Core concepts of programming in JS.', keywords: ['javascript', 'js', 'programming', 'frontend', 'es6'] },
  { id: 'react', name: 'React.js Development', category: 'Tech & Development', level: 'Intermediate', description: 'Build dynamic UIs with React.', keywords: ['react', 'reactjs', 'frontend', 'ui', 'jsx', 'hooks'] },
  { id: 'nodejs', name: 'Node.js Backend', category: 'Tech & Development', level: 'Intermediate', description: 'Server-side JavaScript programming.', keywords: ['node', 'nodejs', 'backend', 'server', 'express', 'api'] },
  { id: 'python', name: 'Python for Beginners', category: 'Tech & Development', level: 'Beginner', description: 'Start your coding journey with Python.', keywords: ['python', 'programming', 'scripting', 'automation'] },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'Tech & Development', level: 'Intermediate', description: 'Ace your coding interviews.', keywords: ['dsa', 'algorithms', 'leetcode', 'interview', 'coding'] },
  { id: 'git', name: 'Git & GitHub', category: 'Tech & Development', level: 'Beginner', description: 'Version control for developers.', keywords: ['git', 'github', 'version control', 'collaboration'] },
  { id: 'docker', name: 'Docker & Containers', category: 'Tech & Development', level: 'Intermediate', description: 'Containerize your applications.', keywords: ['docker', 'containers', 'kubernetes', 'devops'] },
  { id: 'aws', name: 'AWS Cloud Basics', category: 'Tech & Development', level: 'Intermediate', description: 'Introduction to cloud computing.', keywords: ['aws', 'cloud', 'amazon', 'ec2', 's3', 'lambda'] },
  { id: 'sql', name: 'SQL Database Design', category: 'Tech & Development', level: 'Intermediate', description: 'Design and query relational databases.', keywords: ['sql', 'database', 'mysql', 'postgresql', 'queries'] },
  { id: 'mongodb', name: 'NoSQL with MongoDB', category: 'Tech & Development', level: 'Intermediate', description: 'Working with document databases.', keywords: ['mongodb', 'nosql', 'database', 'json'] },
  { id: 'typescript', name: 'TypeScript Essentials', category: 'Tech & Development', level: 'Intermediate', description: 'Type-safe JavaScript development.', keywords: ['typescript', 'ts', 'types', 'javascript'] },
  { id: 'nextjs', name: 'Next.js Framework', category: 'Tech & Development', level: 'Advanced', description: 'Production-grade React applications.', keywords: ['nextjs', 'next', 'react', 'ssr', 'fullstack'] },
  { id: 'graphql', name: 'GraphQL API Design', category: 'Tech & Development', level: 'Advanced', description: 'Modern API development with GraphQL.', keywords: ['graphql', 'api', 'apollo', 'queries'] },
  { id: 'cybersecurity', name: 'Cybersecurity Basics', category: 'Tech & Development', level: 'Beginner', description: 'Protect yourself and systems online.', keywords: ['security', 'cyber', 'hacking', 'protection'] },
  { id: 'ethical-hacking', name: 'Ethical Hacking', category: 'Tech & Development', level: 'Advanced', description: 'Penetration testing and security auditing.', keywords: ['hacking', 'pentesting', 'security', 'kali'] },
  { id: 'ml', name: 'Machine Learning Concepts', category: 'Tech & Development', level: 'Advanced', description: 'Intro to ML algorithms and models.', keywords: ['ml', 'machine learning', 'ai', 'tensorflow'] },
  { id: 'flutter', name: 'Mobile App Dev (Flutter)', category: 'Tech & Development', level: 'Intermediate', description: 'Build cross-platform mobile apps.', keywords: ['flutter', 'mobile', 'dart', 'android', 'ios'] },
  { id: 'swift', name: 'iOS Development (Swift)', category: 'Tech & Development', level: 'Intermediate', description: 'Native iOS app creation.', keywords: ['swift', 'ios', 'apple', 'xcode', 'mobile'] },
  { id: 'react-native', name: 'React Native', category: 'Tech & Development', level: 'Intermediate', description: 'Mobile apps with React.', keywords: ['react native', 'mobile', 'android', 'ios', 'javascript'] },
  { id: 'vue', name: 'Vue.js Development', category: 'Tech & Development', level: 'Intermediate', description: 'Progressive JavaScript framework.', keywords: ['vue', 'vuejs', 'frontend', 'javascript'] },
  { id: 'angular', name: 'Angular Framework', category: 'Tech & Development', level: 'Intermediate', description: 'Enterprise-grade web apps.', keywords: ['angular', 'frontend', 'typescript', 'google'] },

  // Data & AI
  { id: 'excel-data', name: 'Data Analysis with Excel', category: 'Data & AI', level: 'Beginner', description: 'Master spreadsheets for data insights.', keywords: ['excel', 'spreadsheet', 'data', 'analysis'] },
  { id: 'powerbi', name: 'Power BI Visualization', category: 'Data & AI', level: 'Intermediate', description: 'Create interactive business dashboards.', keywords: ['powerbi', 'visualization', 'dashboard', 'microsoft'] },
  { id: 'tableau', name: 'Tableau for Data Science', category: 'Data & AI', level: 'Intermediate', description: 'Visual analytics with Tableau.', keywords: ['tableau', 'visualization', 'analytics', 'charts'] },
  { id: 'pandas', name: 'Python Pandas Library', category: 'Data & AI', level: 'Intermediate', description: 'Data manipulation and analysis.', keywords: ['pandas', 'python', 'data', 'dataframe'] },
  { id: 'neural-networks', name: 'Intro to Neural Networks', category: 'Data & AI', level: 'Advanced', description: 'Deep learning fundamentals.', keywords: ['neural', 'deep learning', 'ai', 'tensorflow'] },
  { id: 'nlp', name: 'Natural Language Processing', category: 'Data & AI', level: 'Advanced', description: 'Processing text with AI.', keywords: ['nlp', 'text', 'language', 'chatgpt'] },
  { id: 'computer-vision', name: 'Computer Vision Basics', category: 'Data & AI', level: 'Advanced', description: 'Image recognition and processing.', keywords: ['vision', 'image', 'opencv', 'detection'] },
  { id: 'prompt-engineering', name: 'Generative AI Prompting', category: 'Data & AI', level: 'Beginner', description: 'Mastering prompts for ChatGPT/Midjourney.', keywords: ['prompt', 'chatgpt', 'midjourney', 'ai', 'generative'] },
  { id: 'statistics', name: 'Statistics for Data Science', category: 'Data & AI', level: 'Intermediate', description: 'Statistical methods for analysis.', keywords: ['statistics', 'math', 'probability', 'analysis'] },
  { id: 'spark', name: 'Big Data with Spark', category: 'Data & AI', level: 'Advanced', description: 'Processing large datasets.', keywords: ['spark', 'big data', 'hadoop', 'distributed'] },

  // Design & Creative
  { id: 'graphic-design', name: 'Graphic Design Principles', category: 'Design & Creative', level: 'Beginner', description: 'Layout, color, and typography basics.', keywords: ['graphic', 'design', 'layout', 'visual'] },
  { id: 'photoshop', name: 'Adobe Photoshop Mastery', category: 'Design & Creative', level: 'Intermediate', description: 'Photo editing and manipulation.', keywords: ['photoshop', 'adobe', 'photo', 'editing'] },
  { id: 'illustrator', name: 'Illustrator Vector Art', category: 'Design & Creative', level: 'Intermediate', description: 'Creating logos and vector graphics.', keywords: ['illustrator', 'vector', 'logo', 'adobe'] },
  { id: 'ui-ux', name: 'UI/UX Design Basics', category: 'Design & Creative', level: 'Beginner', description: 'Designing user-friendly interfaces.', keywords: ['ui', 'ux', 'design', 'user experience', 'interface'] },
  { id: 'figma', name: 'Figma for Web Design', category: 'Design & Creative', level: 'Intermediate', description: 'Collaborative interface design.', keywords: ['figma', 'design', 'prototype', 'ui'] },
  { id: 'premiere', name: 'Video Editing (Premiere Pro)', category: 'Design & Creative', level: 'Intermediate', description: 'Professional video post-production.', keywords: ['premiere', 'video', 'editing', 'adobe'] },
  { id: 'after-effects', name: 'Motion Graphics (After Effects)', category: 'Design & Creative', level: 'Advanced', description: 'Animation and visual effects.', keywords: ['after effects', 'motion', 'animation', 'vfx'] },
  { id: 'blender', name: '3D Modeling (Blender)', category: 'Design & Creative', level: 'Intermediate', description: 'Create 3D assets and animations.', keywords: ['blender', '3d', 'modeling', 'animation'] },
  { id: 'typography', name: 'Typography Essentials', category: 'Design & Creative', level: 'Beginner', description: 'The art of arranging type.', keywords: ['typography', 'fonts', 'type', 'text'] },
  { id: 'color-theory', name: 'Color Theory', category: 'Design & Creative', level: 'Beginner', description: 'Understanding color relationships.', keywords: ['color', 'palette', 'design', 'visual'] },

  // Language & Communication
  { id: 'spoken-english', name: 'Spoken English Fluency', category: 'Language & Communication', level: 'Beginner', description: 'Improve your daily conversation.', keywords: ['english', 'speaking', 'fluency', 'conversation'] },
  { id: 'business-english', name: 'Business English Writing', category: 'Language & Communication', level: 'Intermediate', description: 'Professional emails and reports.', keywords: ['business', 'english', 'writing', 'professional'] },
  { id: 'spanish', name: 'Spanish for Travelers', category: 'Language & Communication', level: 'Beginner', description: 'Essential phrases for travel.', keywords: ['spanish', 'travel', 'language', 'espanol'] },
  { id: 'french', name: 'French Basics', category: 'Language & Communication', level: 'Beginner', description: 'Intro to French language.', keywords: ['french', 'language', 'francais'] },
  { id: 'mandarin', name: 'Mandarin Chinese Intro', category: 'Language & Communication', level: 'Beginner', description: 'Basic Mandarin conversation.', keywords: ['mandarin', 'chinese', 'language'] },
  { id: 'german', name: 'German Grammar', category: 'Language & Communication', level: 'Intermediate', description: 'Mastering German sentence structure.', keywords: ['german', 'grammar', 'deutsch'] },
  { id: 'japanese', name: 'Japanese Kanji', category: 'Language & Communication', level: 'Advanced', description: 'Reading and writing Japanese characters.', keywords: ['japanese', 'kanji', 'nihongo'] },
  { id: 'creative-writing', name: 'Creative Writing', category: 'Language & Communication', level: 'Intermediate', description: 'Storytelling and fiction writing.', keywords: ['writing', 'creative', 'story', 'fiction'] },
  { id: 'copywriting', name: 'Copywriting for Sales', category: 'Language & Communication', level: 'Intermediate', description: 'Writing persuasive marketing copy.', keywords: ['copywriting', 'marketing', 'sales', 'persuasion'] },
  { id: 'technical-writing', name: 'Technical Writing', category: 'Language & Communication', level: 'Advanced', description: 'Documenting technical products.', keywords: ['technical', 'documentation', 'writing'] },

  // Career & Job Prep
  { id: 'resume', name: 'Resume Building', category: 'Career & Job Prep', level: 'Beginner', description: 'Crafting a winning CV.', keywords: ['resume', 'cv', 'job', 'application'] },
  { id: 'linkedin', name: 'LinkedIn Profile Optimization', category: 'Career & Job Prep', level: 'Beginner', description: 'Building your professional brand.', keywords: ['linkedin', 'profile', 'networking', 'professional'] },
  { id: 'interview', name: 'Job Interview Skills', category: 'Career & Job Prep', level: 'Intermediate', description: 'Acing behavioral and technical interviews.', keywords: ['interview', 'job', 'hiring', 'behavioral'] },
  { id: 'networking', name: 'Networking Strategies', category: 'Career & Job Prep', level: 'Intermediate', description: 'Building professional connections.', keywords: ['networking', 'connections', 'professional'] },
  { id: 'salary', name: 'Salary Negotiation', category: 'Career & Job Prep', level: 'Advanced', description: 'Getting paid what you\'re worth.', keywords: ['salary', 'negotiation', 'compensation'] },
  { id: 'freelancing', name: 'Freelancing 101', category: 'Career & Job Prep', level: 'Beginner', description: 'Starting your freelance career.', keywords: ['freelance', 'gig', 'self-employed', 'upwork'] },
  { id: 'remote-work', name: 'Remote Work Productivity', category: 'Career & Job Prep', level: 'Beginner', description: 'Thriving in a work-from-home environment.', keywords: ['remote', 'work from home', 'productivity'] },
  { id: 'personal-branding', name: 'Personal Branding', category: 'Career & Job Prep', level: 'Intermediate', description: 'Marketing yourself effectively.', keywords: ['branding', 'personal', 'marketing'] },
  { id: 'leadership', name: 'Leadership Fundamentals', category: 'Career & Job Prep', level: 'Advanced', description: 'Managing teams and projects.', keywords: ['leadership', 'management', 'team'] },
  { id: 'agile', name: 'Agile & Scrum Methodologies', category: 'Career & Job Prep', level: 'Intermediate', description: 'Modern project management.', keywords: ['agile', 'scrum', 'kanban', 'project management'] },

  // Personal Finance
  { id: 'budgeting', name: 'Budgeting Basics', category: 'Personal Finance', level: 'Beginner', description: 'Managing your monthly expenses.', keywords: ['budget', 'money', 'expenses', 'savings'] },
  { id: 'investing', name: 'Investing for Beginners', category: 'Personal Finance', level: 'Beginner', description: 'Stocks, bonds, and mutual funds.', keywords: ['investing', 'stocks', 'bonds', 'mutual funds'] },
  { id: 'retirement', name: 'Retirement Planning', category: 'Personal Finance', level: 'Intermediate', description: 'Securing your financial future.', keywords: ['retirement', '401k', 'pension', 'planning'] },
  { id: 'taxes', name: 'Understanding Taxes', category: 'Personal Finance', level: 'Intermediate', description: 'Navigating tax laws and filing.', keywords: ['taxes', 'tax', 'filing', 'irs'] },
  { id: 'real-estate', name: 'Real Estate Investing', category: 'Personal Finance', level: 'Advanced', description: 'Building wealth through property.', keywords: ['real estate', 'property', 'investing', 'rental'] },
  { id: 'crypto', name: 'Cryptocurrency Basics', category: 'Personal Finance', level: 'Intermediate', description: 'Understanding blockchain and crypto.', keywords: ['crypto', 'bitcoin', 'blockchain', 'ethereum'] },
  { id: 'debt', name: 'Debt Management', category: 'Personal Finance', level: 'Beginner', description: 'Strategies to pay off debt.', keywords: ['debt', 'credit', 'loans', 'payoff'] },
  { id: 'credit-score', name: 'Credit Score Improvement', category: 'Personal Finance', level: 'Beginner', description: 'Building and maintaining good credit.', keywords: ['credit', 'score', 'fico', 'credit card'] },
  { id: 'passive-income', name: 'Passive Income Streams', category: 'Personal Finance', level: 'Intermediate', description: 'Generating income while you sleep.', keywords: ['passive', 'income', 'dividends', 'royalties'] },
  { id: 'fire', name: 'Financial Independence (FIRE)', category: 'Personal Finance', level: 'Advanced', description: 'Strategies for early retirement.', keywords: ['fire', 'financial independence', 'early retirement'] },

  // Life Skills & Productivity
  { id: 'time-management', name: 'Time Management', category: 'Life Skills & Productivity', level: 'Beginner', description: 'Getting more done in less time.', keywords: ['time', 'management', 'productivity', 'schedule'] },
  { id: 'goal-setting', name: 'Goal Setting', category: 'Life Skills & Productivity', level: 'Beginner', description: 'Setting and achieving SMART goals.', keywords: ['goals', 'smart', 'achievement', 'planning'] },
  { id: 'critical-thinking', name: 'Critical Thinking', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Analyzing information effectively.', keywords: ['critical', 'thinking', 'analysis', 'logic'] },
  { id: 'problem-solving', name: 'Problem Solving', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Creative solutions to challenges.', keywords: ['problem', 'solving', 'solutions', 'creativity'] },
  { id: 'stress-management', name: 'Stress Management', category: 'Life Skills & Productivity', level: 'Beginner', description: 'Coping with daily stress.', keywords: ['stress', 'anxiety', 'coping', 'relaxation'] },
  { id: 'mindfulness', name: 'Mindfulness Meditation', category: 'Life Skills & Productivity', level: 'Beginner', description: 'Living in the present moment.', keywords: ['mindfulness', 'meditation', 'zen', 'calm'] },
  { id: 'decision-making', name: 'Effective Decision Making', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Making better choices.', keywords: ['decision', 'choices', 'analysis'] },
  { id: 'public-speaking', name: 'Public Speaking Confidence', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Overcoming stage fright.', keywords: ['public speaking', 'presentation', 'confidence'] },
  { id: 'speed-reading', name: 'Speed Reading', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Reading faster with comprehension.', keywords: ['reading', 'speed', 'comprehension'] },
  { id: 'memory', name: 'Memory Improvement', category: 'Life Skills & Productivity', level: 'Intermediate', description: 'Techniques to remember more.', keywords: ['memory', 'memorization', 'recall'] },

  // Health & Fitness
  { id: 'yoga', name: 'Yoga for Beginners', category: 'Health & Fitness', level: 'Beginner', description: 'Basic poses and breathing.', keywords: ['yoga', 'poses', 'stretching', 'flexibility'] },
  { id: 'hiit', name: 'HIIT Workouts', category: 'Health & Fitness', level: 'Intermediate', description: 'High-intensity interval training.', keywords: ['hiit', 'cardio', 'workout', 'fitness'] },
  { id: 'nutrition', name: 'Nutrition Basics', category: 'Health & Fitness', level: 'Beginner', description: 'Eating for health and energy.', keywords: ['nutrition', 'diet', 'healthy', 'food'] },
  { id: 'weightlifting', name: 'Weightlifting Fundamentals', category: 'Health & Fitness', level: 'Intermediate', description: 'Strength training techniques.', keywords: ['weights', 'lifting', 'strength', 'gym'] },
  { id: 'marathon', name: 'Marathon Training', category: 'Health & Fitness', level: 'Advanced', description: 'Preparing for long-distance running.', keywords: ['marathon', 'running', 'endurance'] },
  { id: 'mental-health', name: 'Mental Health Awareness', category: 'Health & Fitness', level: 'Beginner', description: 'Understanding mental well-being.', keywords: ['mental', 'health', 'wellbeing', 'therapy'] },
  { id: 'first-aid', name: 'First Aid & CPR', category: 'Health & Fitness', level: 'Beginner', description: 'Emergency life-saving skills.', keywords: ['first aid', 'cpr', 'emergency', 'safety'] },
  { id: 'calisthenics', name: 'Calisthenics', category: 'Health & Fitness', level: 'Intermediate', description: 'Bodyweight strength training.', keywords: ['calisthenics', 'bodyweight', 'workout'] },
  { id: 'meal-prep', name: 'Meal Prepping', category: 'Health & Fitness', level: 'Beginner', description: 'Planning meals for the week.', keywords: ['meal prep', 'cooking', 'planning'] },
  { id: 'sleep', name: 'Sleep Hygiene', category: 'Health & Fitness', level: 'Beginner', description: 'Improving sleep quality.', keywords: ['sleep', 'rest', 'insomnia', 'hygiene'] },

  // Arts & Music  
  { id: 'guitar', name: 'Guitar for Beginners', category: 'Arts & Music', level: 'Beginner', description: 'Chords, strumming, and songs.', keywords: ['guitar', 'music', 'chords', 'strumming'] },
  { id: 'piano', name: 'Piano Basics', category: 'Arts & Music', level: 'Beginner', description: 'Keys, scales, and simple tunes.', keywords: ['piano', 'keyboard', 'music', 'keys'] },
  { id: 'digital-painting', name: 'Digital Painting', category: 'Arts & Music', level: 'Intermediate', description: 'Art creation on tablets/PC.', keywords: ['digital', 'painting', 'art', 'procreate'] },
  { id: 'watercolor', name: 'Watercolor Painting', category: 'Arts & Music', level: 'Beginner', description: 'Techniques for watercolor art.', keywords: ['watercolor', 'painting', 'art'] },
  { id: 'sketching', name: 'Sketching & Drawing', category: 'Arts & Music', level: 'Beginner', description: 'Foundations of visual art.', keywords: ['sketching', 'drawing', 'art', 'pencil'] },
  { id: 'music-theory', name: 'Music Theory', category: 'Arts & Music', level: 'Intermediate', description: 'Understanding how music works.', keywords: ['music', 'theory', 'notes', 'scales'] },
  { id: 'music-production', name: 'Music Production (DAW)', category: 'Arts & Music', level: 'Advanced', description: 'Recording and mixing music.', keywords: ['production', 'daw', 'mixing', 'beats'] },
  { id: 'photography', name: 'Photography Basics', category: 'Arts & Music', level: 'Beginner', description: 'Composition and camera settings.', keywords: ['photography', 'camera', 'photos'] },
  { id: 'acting', name: 'Acting Fundamentals', category: 'Arts & Music', level: 'Beginner', description: 'Stage presence and emotion.', keywords: ['acting', 'theater', 'drama'] },
  { id: 'singing', name: 'Singing & Vocal Training', category: 'Arts & Music', level: 'Intermediate', description: 'Improving vocal range and control.', keywords: ['singing', 'vocals', 'voice'] },

  // Hobbies & Games
  { id: 'chess', name: 'Chess Strategy', category: 'Hobbies & Games', level: 'Intermediate', description: 'Tactics to win at chess.', keywords: ['chess', 'strategy', 'game', 'tactics'] },
  { id: 'gardening', name: 'Gardening for Beginners', category: 'Hobbies & Games', level: 'Beginner', description: 'Growing plants and vegetables.', keywords: ['gardening', 'plants', 'vegetables', 'outdoor'] },
  { id: 'cooking', name: 'Cooking 101', category: 'Hobbies & Games', level: 'Beginner', description: 'Basic culinary skills.', keywords: ['cooking', 'culinary', 'food', 'kitchen'] },
  { id: 'baking', name: 'Baking Essentials', category: 'Hobbies & Games', level: 'Intermediate', description: 'Bread, cakes, and pastries.', keywords: ['baking', 'bread', 'cakes', 'pastry'] },
  { id: 'knitting', name: 'Knitting & Crocheting', category: 'Hobbies & Games', level: 'Beginner', description: 'Creating textiles with yarn.', keywords: ['knitting', 'crochet', 'yarn', 'crafts'] },
  { id: 'origami', name: 'Origami', category: 'Hobbies & Games', level: 'Beginner', description: 'The art of paper folding.', keywords: ['origami', 'paper', 'folding', 'crafts'] },
  { id: 'magic', name: 'Magic Tricks', category: 'Hobbies & Games', level: 'Beginner', description: 'Simple illusions to amaze friends.', keywords: ['magic', 'tricks', 'illusions'] },
  { id: 'poker', name: 'Poker Strategy', category: 'Hobbies & Games', level: 'Intermediate', description: 'Texas Hold\'em tactics.', keywords: ['poker', 'cards', 'gambling', 'strategy'] },
  { id: 'streaming', name: 'Video Game Streaming', category: 'Hobbies & Games', level: 'Intermediate', description: 'Streaming on Twitch/YouTube.', keywords: ['streaming', 'twitch', 'youtube', 'gaming'] },
  { id: 'diy', name: 'DIY Home Repair', category: 'Hobbies & Games', level: 'Intermediate', description: 'Fixing common household issues.', keywords: ['diy', 'repair', 'home', 'fix'] },

  // Academics & Exams
  { id: 'sat', name: 'SAT/ACT Prep', category: 'Academics & Exams', level: 'Intermediate', description: 'Strategies for college entrance exams.', keywords: ['sat', 'act', 'college', 'exam'] },
  { id: 'calculus', name: 'Calculus I', category: 'Academics & Exams', level: 'Advanced', description: 'Limits, derivatives, and integrals.', keywords: ['calculus', 'math', 'derivatives', 'integrals'] },
  { id: 'physics', name: 'Physics Mechanics', category: 'Academics & Exams', level: 'Advanced', description: 'Motion, forces, and energy.', keywords: ['physics', 'mechanics', 'forces', 'motion'] },
  { id: 'chemistry', name: 'Chemistry Basics', category: 'Academics & Exams', level: 'Intermediate', description: 'Atoms, molecules, and reactions.', keywords: ['chemistry', 'atoms', 'molecules', 'reactions'] },
  { id: 'history', name: 'World History', category: 'Academics & Exams', level: 'Intermediate', description: 'Overview of global historical events.', keywords: ['history', 'world', 'events', 'civilization'] },
  { id: 'essay', name: 'Essay Writing', category: 'Academics & Exams', level: 'Intermediate', description: 'Structuring academic papers.', keywords: ['essay', 'writing', 'academic', 'papers'] },
  { id: 'study-skills', name: 'Study Skills', category: 'Academics & Exams', level: 'Beginner', description: 'Effective learning techniques.', keywords: ['study', 'learning', 'techniques', 'memory'] },
  { id: 'research', name: 'Research Methods', category: 'Academics & Exams', level: 'Advanced', description: 'Conducting academic research.', keywords: ['research', 'academic', 'methods', 'thesis'] },
  { id: 'gmat', name: 'GMAT/GRE Prep', category: 'Academics & Exams', level: 'Advanced', description: 'Graduate school exam preparation.', keywords: ['gmat', 'gre', 'graduate', 'mba'] },
  { id: 'biology', name: 'Biology Fundamentals', category: 'Academics & Exams', level: 'Intermediate', description: 'Cell structure and genetics.', keywords: ['biology', 'cells', 'genetics', 'life'] },

  // Home & Lifestyle
  { id: 'interior-design', name: 'Interior Design Basics', category: 'Home & Lifestyle', level: 'Beginner', description: 'Decorating your living space.', keywords: ['interior', 'design', 'home', 'decor'] },
  { id: 'decluttering', name: 'Decluttering (KonMari)', category: 'Home & Lifestyle', level: 'Beginner', description: 'Organizing your home.', keywords: ['declutter', 'organize', 'konmari', 'minimalism'] },
  { id: 'sustainable', name: 'Sustainable Living', category: 'Home & Lifestyle', level: 'Beginner', description: 'Eco-friendly daily habits.', keywords: ['sustainable', 'eco', 'green', 'environment'] },
  { id: 'car', name: 'Car Maintenance', category: 'Home & Lifestyle', level: 'Intermediate', description: 'Oil changes and basic repairs.', keywords: ['car', 'maintenance', 'repair', 'automotive'] },
  { id: 'pet-care', name: 'Pet Care 101', category: 'Home & Lifestyle', level: 'Beginner', description: 'Looking after dogs and cats.', keywords: ['pet', 'dog', 'cat', 'care'] },
  { id: 'feng-shui', name: 'Feng Shui', category: 'Home & Lifestyle', level: 'Intermediate', description: 'Harmonizing your environment.', keywords: ['feng shui', 'harmony', 'energy', 'home'] },
  { id: 'urban-garden', name: 'Urban Gardening', category: 'Home & Lifestyle', level: 'Intermediate', description: 'Growing food in small spaces.', keywords: ['urban', 'gardening', 'apartment', 'plants'] },
  { id: 'minimalism', name: 'Minimalism', category: 'Home & Lifestyle', level: 'Beginner', description: 'Living with less.', keywords: ['minimalism', 'simple', 'less', 'lifestyle'] },
  { id: 'home-security', name: 'Home Security', category: 'Home & Lifestyle', level: 'Beginner', description: 'Keeping your home safe.', keywords: ['security', 'home', 'safety', 'protection'] },
  { id: 'coffee', name: 'Coffee Brewing', category: 'Home & Lifestyle', level: 'Beginner', description: 'Making the perfect cup.', keywords: ['coffee', 'brewing', 'espresso', 'barista'] },

  // Parenting & Relationships
  { id: 'positive-parenting', name: 'Positive Parenting', category: 'Parenting & Relationships', level: 'Beginner', description: 'Raising happy, confident kids.', keywords: ['parenting', 'children', 'positive', 'kids'] },
  { id: 'conflict', name: 'Conflict Resolution', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Resolving disputes peacefully.', keywords: ['conflict', 'resolution', 'disputes', 'peace'] },
  { id: 'listening', name: 'Active Listening', category: 'Parenting & Relationships', level: 'Beginner', description: 'Hearing what others really say.', keywords: ['listening', 'communication', 'empathy'] },
  { id: 'baby-care', name: 'Baby Care Basics', category: 'Parenting & Relationships', level: 'Beginner', description: 'Newborn essentials.', keywords: ['baby', 'newborn', 'care', 'infant'] },
  { id: 'toddler', name: 'Toddler Tantrums', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Managing difficult behaviors.', keywords: ['toddler', 'tantrums', 'behavior', 'parenting'] },
  { id: 'relationship-comm', name: 'Relationship Communication', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Building stronger bonds.', keywords: ['relationship', 'communication', 'couples'] },
  { id: 'work-life', name: 'Work-Life Balance', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Juggling career and family.', keywords: ['work', 'life', 'balance', 'family'] },
  { id: 'elderly', name: 'Elderly Care', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Caring for aging parents.', keywords: ['elderly', 'care', 'aging', 'seniors'] },
  { id: 'social-kids', name: 'Social Skills for Kids', category: 'Parenting & Relationships', level: 'Beginner', description: 'Helping children make friends.', keywords: ['social', 'kids', 'friends', 'children'] },
  { id: 'marriage', name: 'Marriage Enrichment', category: 'Parenting & Relationships', level: 'Intermediate', description: 'Strengthening your partnership.', keywords: ['marriage', 'relationship', 'partnership', 'couples'] },
];

// Helper function to search skills
export const searchSkills = (query: string, categoryFilter?: string): SkillPreset[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery && (!categoryFilter || categoryFilter === 'all')) {
    return skillPresets;
  }
  
  return skillPresets.filter(skill => {
    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      const categoryId = getCategoryId(skill.category);
      if (categoryId !== categoryFilter) return false;
    }
    
    // Search filter
    if (lowerQuery) {
      const matchesName = skill.name.toLowerCase().includes(lowerQuery);
      const matchesCategory = skill.category.toLowerCase().includes(lowerQuery);
      const matchesKeywords = skill.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
      const matchesDescription = skill.description.toLowerCase().includes(lowerQuery);
      
      return matchesName || matchesCategory || matchesKeywords || matchesDescription;
    }
    
    return true;
  });
};

// Get skills by category
export const getSkillsByCategory = (categoryId: string): SkillPreset[] => {
  if (categoryId === 'all') return skillPresets;
  
  return skillPresets.filter(skill => {
    return getCategoryId(skill.category) === categoryId;
  });
};
