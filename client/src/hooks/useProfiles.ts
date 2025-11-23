import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

import type { Profile } from '../types';

interface UseProfilesReturn {
  profiles: Profile[];
  loading: boolean;
  error?: string;
}

/**
 * Hook for realtime profiles updates
 * Listens to INSERT and UPDATE events on the profiles table
 */
export function useProfiles(): UseProfilesReturn {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();


  // Fetch initial profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(undefined);

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setProfiles(data || []);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const profilesChannel = supabase
      .channel('profiles:all')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('New profile created:', payload);
          const newProfile = payload.new as Profile;
          setProfiles((prev) => [newProfile, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Profile updated:', payload);
          const updatedProfile = payload.new as Profile;
          setProfiles((prev) =>
            prev.map((profile) =>
              profile.id === updatedProfile.id ? updatedProfile : profile
            )
          );
        }
      )
      .subscribe();



    // Cleanup subscription on unmount
    return () => {
      console.log('Unsubscribing from profiles channel');
      profilesChannel.unsubscribe();
    };
  }, []);

  return {
    profiles,
    loading,
    error,
  };
}
