import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../lib/supabaseClient';

// ============================================================================
// SUPABASE AUTH CONTEXT - REAL BACKEND AUTHENTICATION
// ============================================================================
// This replaces the old fake/demo auth that accepted any email/password
// and logged in a hardcoded "John Doe" user.
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
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from the profiles table
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('🟢 Fetching profile for user:', userId);
      
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
      console.log('🟢 fetchUserProfile response:', { status: response.status, data });

      // If empty array, profile doesn't exist
      if (!data || data.length === 0) {
        console.log('Profile not found, creating new profile for:', userId);
        
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
            full_name: '',
            role: 'New User',
            skills: [],
            experience: []
          })
        });

        const newProfile = await createResponse.json();
        console.log('Created new profile:', newProfile);
        return (Array.isArray(newProfile) ? newProfile[0] : newProfile) as UserProfile;
      }

      console.log('🟢 Profile fetched successfully:', data[0]);
      return data[0] as UserProfile;
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

    // Check for existing Supabase session
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      try {
        // Get the current session from Supabase
        // getSession() is fast as it checks localStorage first
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for:', session.user.email);
          // User is authenticated
          setUser(session.user);
          
          // Fetch their profile
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          
          // Only fetch profile if we don't have it or if it's a login/initial event
          // For token refresh, we might not need to refetch profile every time, 
          // but it's safer to ensure consistency.
          if (!profile || event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
             const userProfile = await fetchUserProfile(session.user.id);
             setProfile(userProfile);
          }
        } else if (!session) {
           // Handle case where session is null but event wasn't SIGNED_OUT (e.g. generic change)
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
      // REMOVED: Fake authentication that accepted any email/password
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // const userData = { id: 1, name: 'John Doe', ... };

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
        // Auth state will be updated by the onAuthStateChange listener
        console.log('Sign in successful:', data.user.email);
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
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // REMOVED: Fake registration that created a demo user
      // const userData = { id: Date.now(), name: email.split('@')[0], ... };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: 'New User',
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
        
        // Note: If email confirmation is enabled in Supabase, the user will need to
        // confirm their email before they can sign in. The profile will be created
        // automatically by the database trigger when the user is created.
        
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
      // REMOVED: Manual localStorage clearing
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('userData');

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

  // Refresh the current session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      if (data.user) {
        setUser(data.user);
        const userProfile = await fetchUserProfile(data.user.id);
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    userData: user && profile ? { user, profile } : null,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
