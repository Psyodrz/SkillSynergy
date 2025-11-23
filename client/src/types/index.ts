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
