import { supabase } from './supabaseClient';

/**
 * Add a skill to a user's profile
 * @param userId - The user's ID
 * @param skillId - The skill's ID
 * @param level - Optional skill level (defaults to 'Beginner')
 * @returns Promise with success status
 */
export async function addSkillToUser(
  userId: string,
  skillId: string,
  level: string = 'Beginner'
): Promise<{ success: boolean; error?: string; alreadyExists?: boolean }> {
  try {
    // Check if skill already exists for user
    const { data: existing, error: checkError } = await supabase
      .from('user_skills')
      .select('id')
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected
      throw checkError;
    }

    if (existing) {
      return { success: false, alreadyExists: true };
    }

    // Insert the skill
    const { error: insertError } = await supabase
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        level_override: level,
      });

    if (insertError) throw insertError;

    return { success: true };
  } catch (error: any) {
    console.error('Error adding skill to user:', error);
    return { success: false, error: error.message };
  }
}
