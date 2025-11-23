// Sample data for SkillSynergy application
export const sampleSkills = [
  {
    id: 1,
    name: 'React Development',
    level: 'Advanced',
    description: 'Building modern web applications with React and TypeScript',
    category: 'Frontend',
    users: 24,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Node.js Backend',
    level: 'Intermediate',
    description: 'Server-side JavaScript development with Express and MongoDB',
    category: 'Backend',
    users: 18,
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: 'UI/UX Design',
    level: 'Advanced',
    description: 'Creating beautiful and intuitive user interfaces',
    category: 'Design',
    users: 32,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'Python Data Science',
    level: 'Intermediate',
    description: 'Data analysis and machine learning with Python',
    category: 'Data Science',
    users: 15,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'DevOps & AWS',
    level: 'Beginner',
    description: 'Cloud infrastructure and deployment automation',
    category: 'DevOps',
    users: 12,
    color: 'bg-red-500'
  },
  {
    id: 6,
    name: 'Mobile Development',
    level: 'Intermediate',
    description: 'Cross-platform mobile apps with React Native',
    category: 'Mobile',
    users: 20,
    color: 'bg-indigo-500'
  }
];

export const sampleUsers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: 'SC',
    skills: ['React Development', 'UI/UX Design'],
    level: 'Advanced',
    location: 'San Francisco, CA',
    connections: 156,
    projects: 12
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    role: 'Full Stack Developer',
    avatar: 'MR',
    skills: ['React Development', 'Node.js Backend'],
    level: 'Advanced',
    location: 'Austin, TX',
    connections: 203,
    projects: 18
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'UI/UX Designer',
    avatar: 'EW',
    skills: ['UI/UX Design', 'Mobile Development'],
    level: 'Advanced',
    location: 'New York, NY',
    connections: 189,
    projects: 15
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Data Scientist',
    avatar: 'DK',
    skills: ['Python Data Science', 'DevOps & AWS'],
    level: 'Intermediate',
    location: 'Seattle, WA',
    connections: 98,
    projects: 8
  }
];

export const sampleConnections = [
  {
    id: 1,
    user: sampleUsers[0],
    status: 'connected',
    connectedAt: '2024-01-15'
  },
  {
    id: 2,
    user: sampleUsers[1],
    status: 'pending',
    connectedAt: null
  },
  {
    id: 3,
    user: sampleUsers[2],
    status: 'connected',
    connectedAt: '2024-02-03'
  }
];
