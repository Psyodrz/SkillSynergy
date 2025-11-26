import config from '../config';

const API_URL = config.API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Add a skill to the user's profile
 */
export const addUserSkill = async (userId: string, skillId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/user-skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, skill_id: skillId }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Find instructors for a specific skill
 */
export const getInstructors = async (skillId: string, page: number = 1, pageSize: number = 12): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/instructors?skill_id=${skillId}&page=${page}&page_size=${pageSize}`);
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Create a mentorship request
 */
export const createMentorshipRequest = async (
  skillId: string, 
  learnerId: string, 
  instructorId: string | null, 
  message: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/mentorship-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skill_id: skillId, learner_id: learnerId, instructor_id: instructorId, message }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Create a new learning challenge (project)
 */
export const createProject = async (
  title: string, 
  description: string, 
  tags: string[], 
  visibility: 'public' | 'private', 
  capacity: number, 
  ownerId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, tags, visibility, capacity, owner_id: ownerId }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Join a project
 */
export const joinProject = async (projectId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/project_members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_id: projectId, user_id: userId }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Leave a project
 */
export const leaveProject = async (projectId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/api/project_members`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_id: projectId, user_id: userId }),
    });
    
    // Handle 204 or empty response if applicable, but our API returns JSON
    if (response.status === 204) return { success: true };
    
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
