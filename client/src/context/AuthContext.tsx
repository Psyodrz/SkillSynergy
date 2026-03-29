import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/supabaseClient';

// ============================================================================
// SUPABASE AUTH CONTEXT - REAL BACKEND AUTHENTICATION
// ============================================================================

interface AuthContextType {
  // Supabase User object (contains id, email, etc.)
  user: User | null;
  // Extended profile data from the profiles table
  profile: UserProfile | null;
  // Combined user + profile for convenience
  userData: { user: User; profile: UserProfile } | null;
  // Auth state
  isAuthenticated: boolean;
  loading: boolean;
  // Auth functions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function isInvalidRefreshAuthError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return msg.includes('Refresh Token Not Found') || msg.includes('Invalid Refresh Token');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  /** Avoids stale closure: skip redundant profile fetches on TOKEN_REFRESHED and duplicate INITIAL_SESSION */
  const lastProfileUserIdRef = useRef<string | null>(null);

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('[Auth] Fetching profile for user:', userId);
      
      // Get user's session token from localStorage
      const supabaseAuthKey = `sb-${import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`;
      const sessionData = localStorage.getItem(supabaseAuthKey);
      let userToken = null;
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          userToken = parsed?.access_token || parsed?.currentSession?.access_token;
        } catch (e) {
          console.error('Failed to parse session:', e);
        }
      }
      
      // Use direct fetch instead of Supabase client
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${userToken || supabaseKey}` // Use user token if available
        }
      });

      const data = await response.json();
      console.log('[Auth] fetchUserProfile response:', { status: response.status, data });

      // If empty array, profile doesn't exist
      if (!data || data.length === 0) {
        console.log('Profile not found, creating new profile for:', userId);
        
        // Try to get user metadata from Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const fullNameFromMeta = authUser?.user_metadata?.full_name || '';
        const roleFromMeta = authUser?.user_metadata?.role || 'Learner';
        const email = authUser?.email || '';
        
        const createResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${userToken || supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            id: userId,
            email: email, // Save email to profile
            full_name: fullNameFromMeta,
            role: roleFromMeta,
            skills: [],
            experience: []
          })
        });

        const newProfile = await createResponse.json();
        console.log('Created new profile:', newProfile);
        return (Array.isArray(newProfile) ? newProfile[0] : newProfile) as UserProfile;
      }

      // Existing profile found
      const userProfile = data[0] as UserProfile;

      // Check if email is missing in profile and sync it if possible
      if (!userProfile.email) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.email) {
          console.log('Syncing email to profile...');
          await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${userToken || supabaseKey}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ email: authUser.email })
          });
          userProfile.email = authUser.email;
        }
      }

      console.log('[Auth] Profile fetched successfully:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    // Safety timeout to prevent infinite loading state
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timed out, forcing completion');
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    // Probe session for corrupt / revoked refresh tokens; profile loads via onAuthStateChange
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (isInvalidRefreshAuthError(error)) {
            console.warn('Auth session expired or invalid. Clearing local session...');
            await supabase.auth.signOut({ scope: 'local' });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isInvalidRefreshAuthError(error)) {
          await supabase.auth.signOut({ scope: 'local' });
        }
      } finally {
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out accurately');
          lastProfileUserIdRef.current = null;
          setUser(null);
          setProfile(null);
          localStorage.removeItem('supabase.auth.token'); // Safety clear
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);

          if (event === 'TOKEN_REFRESHED') {
            setLoading(false);
            return;
          }

          const uid = session.user.id;
          if (event !== 'SIGNED_IN' && lastProfileUserIdRef.current === uid) {
            setLoading(false);
            return;
          }

          const userProfile = await fetchUserProfile(uid);
          setProfile(userProfile);
          lastProfileUserIdRef.current = uid;
        } else if (!session) {
          lastProfileUserIdRef.current = null;
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // REAL Sign In with Supabase
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return {
          success: false,
          error: error.message || 'Invalid email or password',
        };
      }

      if (data.user) {
        setUser(data.user);
        console.log('Sign in successful:', data.user.email);
        // Profile is loaded by onAuthStateChange (SIGNED_IN) only, to avoid duplicate fetches
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  };

  // REAL Sign Up with Supabase
  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    role?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: role || 'Learner',
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return {
          success: false,
          error: error.message || 'Registration failed',
        };
      }

      if (data.user) {
        console.log('Sign up successful:', data.user.email);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  };

  // REAL Sign Out with Supabase
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      // Auth state will be updated by the onAuthStateChange listener
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Password Reset Request
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update Password (used after clicking reset link)
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Update Password Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        lastProfileUserIdRef.current = data.user.id;
        const userProfile = await fetchUserProfile(data.user.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      if (isInvalidRefreshAuthError(error)) {
        lastProfileUserIdRef.current = null;
        await supabase.auth.signOut({ scope: 'local' });
      }
    }
  };

  const value = {
    user,
    profile,
    userData: user && profile ? { user, profile } : null,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
