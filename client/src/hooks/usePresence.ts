import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';


export interface OnlineUser {
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  online_at?: string;
}

interface UsePresenceReturn {
  onlineUsers: OnlineUser[];
  isOnline: (userId: string) => boolean;
}

/**
 * Hook for tracking online presence of users
 * @param currentUserId - The logged-in user's ID
 * @param userProfile - Optional profile data to broadcast
 */
export function usePresence(
  currentUserId: string | null,
  userProfile?: { full_name?: string; avatar_url?: string }
): UsePresenceReturn {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);


  useEffect(() => {
    if (!currentUserId) {
      setOnlineUsers([]);
      return;
    }

    const presenceChannel = supabase.channel('presence:online-users', {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    // Subscribe to presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Presence sync:', state);

        // Convert presence state to array of online users
        const users: OnlineUser[] = [];
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          presences.forEach((presence) => {
            if (presence.user_id && presence.user_id !== currentUserId) {
              users.push({
                user_id: presence.user_id,
                full_name: presence.full_name,
                avatar_url: presence.avatar_url,
                online_at: presence.online_at,
              });
            }
          });
        });

        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track our own presence
          await presenceChannel.track({
            user_id: currentUserId,
            full_name: userProfile?.full_name || 'Anonymous',
            avatar_url: userProfile?.avatar_url || null,
            online_at: new Date().toISOString(),
          });
          console.log('Presence tracked for user:', currentUserId);
        }
      });



    // Cleanup on unmount
    return () => {
      console.log('Unsubscribing from presence channel');
      presenceChannel.untrack();
      presenceChannel.unsubscribe();
    };
  }, [currentUserId, userProfile?.full_name, userProfile?.avatar_url]);

  // Helper function to check if a specific user is online
  const isOnline = (userId: string): boolean => {
    return onlineUsers.some((user) => user.user_id === userId);
  };

  return {
    onlineUsers,
    isOnline,
  };
}
