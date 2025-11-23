import { supabase } from '../lib/supabaseClient';
import type { Profile, ProfileSkill, Experience } from '../types';
import { incrementSkillUsersCount, decrementSkillUsersCount } from './skillsApi';

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('getCurrentUserProfile error:', error);
    return null;
  }
}

/**
 * Get all profiles (for discovering professionals)
 */
export async function getAllProfiles(filters?: {
  search?: string;
  skillId?: string;
  role?: string;
}): Promise<Profile[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply search filter on name or role
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,role.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
    }

    // Apply role filter
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    let profiles = data || [];

    // Filter by skill if provided (client-side filtering for JSONB)
    if (filters?.skillId && profiles.length > 0) {
      profiles = profiles.filter(profile => {
        const skills = profile.skills as ProfileSkill[];
        return skills && skills.some(skill => skill.id === filters.skillId);
      });
    }

    return profiles;
  } catch (error) {
    console.error('getAllProfiles error:', error);
    return [];
  }
}

/**
 * Update profile skills
 */
export async function updateProfileSkills(
  userId: string,
  newSkills: ProfileSkill[]
): Promise<Profile | null> {
  try {
    // Get current profile to compare skills
    const currentProfile = await getCurrentUserProfile(userId);
    const oldSkills = (currentProfile?.skills as ProfileSkill[]) || [];

    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ skills: newSkills })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile skills:', error);
      throw error;
    }

    // Update users_count for added/removed skills
    const oldSkillIds = new Set(oldSkills.map(s => s.id));
    const newSkillIds = new Set(newSkills.map(s => s.id));

    // Increment count for newly added skills
    const addedSkills = newSkills.filter(s => !oldSkillIds.has(s.id));
    for (const skill of addedSkills) {
      await incrementSkillUsersCount(skill.id);
    }

    // Decrement count for removed skills
    const removedSkills = oldSkills.filter(s => !newSkillIds.has(s.id));
    for (const skill of removedSkills) {
      await decrementSkillUsersCount(skill.id);
    }

    return data;
  } catch (error) {
    console.error('updateProfileSkills error:', error);
    throw error;
  }
}

/**
 * Update profile experience
 */
export async function updateProfileExperience(
  userId: string,
  experience: Experience[]
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ experience })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile experience:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateProfileExperience error:', error);
    throw error;
  }
}

/**
 * Update profile basic information
 */
export async function updateProfileInfo(
  userId: string,
  updates: {
    full_name?: string;
    role?: string;
    location?: string;
    bio?: string;
    avatar_url?: string;
  }
): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile info:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateProfileInfo error:', error);
    throw error;
  }
}

/**
 * Get profile by ID (for viewing other users' profiles)
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('getProfileById error:', error);
    return null;
  }
}
