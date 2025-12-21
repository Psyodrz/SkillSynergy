// TypeScript types for Skills and Profiles

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  description?: string;
  users_count: number;
  color: string;
  created_at: string;
  created_by?: string | null;
  thumbnail?: string | null; // Format: "slug/filename.png" (e.g., "tech/tech_1.png")
};

export type ProfileSkill = {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
};

export type Experience = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  skills: ProfileSkill[];
  experience: Experience[];
  created_at: string;
};

export type CreateSkillPayload = {
  name: string;
  category: string;
  level: SkillLevel;
  description?: string;
  color?: string;
};

export type SkillFilters = {
  search?: string;
  category?: string;
  level?: SkillLevel;
};

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export type FriendRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: FriendRequestStatus;
  created_at: string;
  sender?: Profile; // For joining
};

export type Friend = {
  id: string;
  user1: string;
  user2: string;
  created_at: string;
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
};
export type DbSkill = {
  id: string;
  name: string;
  category: string;
  level: string;
  description?: string;
  created_at: string;
};

export type UserSkill = {
  id: string;
  user_id: string;
  skill_id: string;
  level_override?: string;
  notes?: string;
  created_at: string;
  skill?: DbSkill; // Joined data
};

export type Project = {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  max_members: number;
  visibility: 'public' | 'private';
  thumbnail_url?: string;
  category?: string;
  difficulty?: string;
  created_at: string;
  owner?: Profile; // Joined data
  members?: ProjectMember[]; // Joined data
  member_count?: number; // Computed or joined
};

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  profile?: Profile; // Joined data
};

// ==========================================
// TEACHER/LEARNER SYSTEM TYPES
// ==========================================

export type UserRole = 'learner' | 'teacher' | 'both';

export type TeachingMode = '1:1' | 'Group' | 'Chat-only';

export type ExtendedProfile = Profile & {
  onboarding_completed?: boolean;
  headline?: string | null;
  languages?: string[] | null;
  timezone?: string | null;
  experience_years?: number | null;
  qualification?: string | null;
  teaching_modes?: TeachingMode[] | null;
  hourly_rate?: number | null;
  learning_goals?: string | null;
  learning_modes?: TeachingMode[] | null;
  interests?: string | null;
};

export type TeacherSkill = {
  id: string;
  name: string;
  category: string;
  level: 'intermediate' | 'advanced' | 'expert';
};

export type TeacherProfile = {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  headline?: string | null;
  bio?: string | null;
  languages?: string[];
  experience_years?: number;
  qualification?: string | null;
  teaching_modes?: TeachingMode[];
  skills?: TeacherSkill[];
  similarity?: number;
};

export type TeacherMatchRequest = {
  userId?: string;
  skillIds?: string[];
  limit?: number;
};

export type TeacherMatchResponse = {
  teachers: TeacherProfile[];
};

export type OnboardingStep = 'role' | 'teacher' | 'learner' | 'complete';

export type TeacherOnboardingData = {
  full_name?: string;
  headline: string;
  bio: string;
  qualification: string;
  experience_years: number;
  languages: string[];
  teaching_modes: TeachingMode[];
  timezone: string;
  skills: Array<{
    skill_id: string;
    level: 'intermediate' | 'advanced' | 'expert';
  }>;
};

export type LearnerOnboardingData = {
  learning_goals?: string;
  learning_modes: TeachingMode[];
  skills: Array<{
    skill_id: string;
    level: 'beginner' | 'intermediate';
  }>;
};
