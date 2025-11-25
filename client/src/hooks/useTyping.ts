import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useTyping(channelName: string, currentUserId: string) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const lastSentRef = useRef<number>(0);
  const timeoutsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!channelName || !currentUserId) return;

    const channel = supabase.channel(channelName);

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== currentUserId) {
          // Clear existing timeout for this user to prevent premature removal
          if (timeoutsRef.current[payload.userId]) {
            clearTimeout(timeoutsRef.current[payload.userId]);
          }

          setTypingUsers((prev) => {
            // Optimization: only update state if user wasn't already typing
            if (prev.has(payload.userId)) return prev;
            const newSet = new Set(prev);
            newSet.add(payload.userId);
            return newSet;
          });

          // Set new timeout to remove user after 3 seconds of silence
          timeoutsRef.current[payload.userId] = setTimeout(() => {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(payload.userId);
              return newSet;
            });
            delete timeoutsRef.current[payload.userId];
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      // Cleanup timeouts and channel
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      supabase.removeChannel(channel);
    };
  }, [channelName, currentUserId]);

  const sendTyping = useCallback(async () => {
    if (!channelName || !currentUserId) return;

    const now = Date.now();
    // Throttle sending to once every 2 seconds to prevent flooding
    if (now - lastSentRef.current < 2000) {
      return;
    }

    lastSentRef.current = now;

    const channel = supabase.channel(channelName);
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId },
    });
  }, [channelName, currentUserId]);

  return { typingUsers, sendTyping };
}
