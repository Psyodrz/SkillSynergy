import { supabase } from '../lib/supabaseClient';
import type { Skill, CreateSkillPayload, SkillFilters } from '../types';

/**
 * Fetch all skills from the database with optional filters
 */
export async function getAllSkills(filters?: SkillFilters): Promise<Skill[]> {
  try {
    let query = supabase
      .from('skills')
      .select('*')
      .order('users_count', { ascending: false });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply category filter
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    // Apply level filter
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('getAllSkills error:', error);
    return [];
  }
}

/**
 * Create a new skill in the database
 */
export async function createSkill(payload: CreateSkillPayload): Promise<Skill | null> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        name: payload.name,
        category: payload.category,
        level: payload.level,
        description: payload.description || null,
        color: payload.color || 'text-blue-500',
        users_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating skill:', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('createSkill error:', error);
    
    // Handle duplicate skill name
    if (error.code === '23505') {
      throw new Error('A skill with this name already exists');
    }
    
    throw error;
  }
}

/**
 * Get a single skill by ID
 */
export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching skill by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('getSkillById error:', error);
    return null;
  }
}

/**
 * Increment the users_count for a skill
 */
export async function incrementSkillUsersCount(skillId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_skill_users', {
      skill_id: skillId
    });

    if (error) {
      // If RPC doesn't exist, fall back to manual increment
      const skill = await getSkillById(skillId);
      if (skill) {
        await supabase
          .from('skills')
          .update({ users_count: skill.users_count + 1 })
          .eq('id', skillId);
      }
    }
  } catch (error) {
    console.error('incrementSkillUsersCount error:', error);
  }
}

/**
 * Decrement the users_count for a skill
 */
export async function decrementSkillUsersCount(skillId: string): Promise<void> {
  try {
    const skill = await getSkillById(skillId);
    if (skill && skill.users_count > 0) {
      await supabase
        .from('skills')
        .update({ users_count: skill.users_count - 1 })
        .eq('id', skillId);
    }
  } catch (error) {
    console.error('decrementSkillUsersCount error:', error);
  }
}

/**
 * Get all unique skill categories
 */
export async function getSkillCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories.sort();
  } catch (error) {
    console.error('getSkillCategories error:', error);
    return [];
  }
}

/**
 * Search skills by name (for autocomplete/typeahead)
 */
export async function searchSkills(searchTerm: string): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error searching skills:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('searchSkills error:', error);
    return [];
  }
}
