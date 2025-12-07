import config from '../config';

const API_URL = config.API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  order?: any; // For Razorpay order
  message?: string;
}

/**
 * Helper to get the current session token from localStorage
 * Matches the key used by Supabase Auth
 */
const getAuthToken = (): string | null => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return null;
    
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
    const key = `sb-${projectRef}-auth-token`;
    const sessionData = localStorage.getItem(key);
    
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return parsed.access_token || null;
    }
    return null;
  } catch (e) {
    console.error('Error retrieving auth token:', e);
    return null;
  }
};

/**
 * Helper for authenticated fetch
 */
const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
};

/**
 * Add a skill to the user's profile
 */
export const addUserSkill = async (userId: string, skillId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await authFetch('/api/user-skills', {
      method: 'POST',
      body: JSON.stringify({ skill_id: skillId }), // Backend expects skill_id, user_id is from token
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
    // Public endpoint, use regular fetch
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
    const response = await authFetch('/api/mentorship-requests', {
      method: 'POST',
      body: JSON.stringify({ skill_id: skillId, instructor_id: instructorId, message }), // learner_id from token
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
    const response = await authFetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title, description, tags, visibility, capacity }), // owner_id from token
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
    const response = await authFetch('/api/project_members', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId }), // user_id from token
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
    const response = await authFetch('/api/project_members', {
      method: 'DELETE',
      body: JSON.stringify({ project_id: projectId }), // user_id from token
    });
    
    if (response.status === 204) return { success: true };
    
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Create Razorpay Order
 */
export const createRazorpayOrder = async (amount: number, currency: string = 'INR'): Promise<ApiResponse<any>> => {
  try {
    const response = await authFetch('/api/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Verify Razorpay Payment
 */
export const verifyRazorpayPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await authFetch('/api/verify-payment', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
