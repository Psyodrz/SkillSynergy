import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
}

interface UseDirectMessagesReturn {
  messages: Message[];
  loading: boolean;
  error?: string;
  sendMessage: (text: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
}

/**
 * Hook for realtime direct messages between two users
 * @param currentUserId - The logged-in user's ID
 * @param otherUserId - The other user's ID in the conversation
 */
export function useDirectMessages(
  currentUserId: string,
  otherUserId: string
): UseDirectMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Fetch initial messages
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(undefined);

        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
          )
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        setMessages(data || []);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUserId, otherUserId]);

  // Realtime subscription
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const channel = supabase
      .channel(`messages:${currentUserId}:${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Filter for messages relevant to this conversation
          if (
            (newMessage.sender_id === currentUserId && newMessage.receiver_id === otherUserId) ||
            (newMessage.sender_id === otherUserId && newMessage.receiver_id === currentUserId)
          ) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              // Add and sort
              const updated = [...prev, newMessage];
              return updated.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, otherUserId]);

  // Send a new message with optimistic update
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId || !otherUserId) return;

      // Generate a temporary ID (or real UUID if possible) for optimistic update
      const optimisticId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      const optimisticMessage: Message = {
        id: optimisticId,
        created_at: timestamp,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: text.trim(),
        read: false,
      };

      // 1. Optimistic UI update
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        // 2. Send to Supabase
        // We use the same ID to ensure the realtime event matches our optimistic message
        const { error: sendError } = await supabase.from('messages').insert({
          id: optimisticId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: text.trim(),
          read: false,
        });

        if (sendError) throw sendError;

        // 3. Create Notification for the receiver
        // We don't await this to avoid blocking the UI, but we log errors
        supabase
          .from('notifications')
          .insert({
            user_id: otherUserId,
            type: 'info',
            title: 'New Message',
            message: 'You have a new message',
            read: false,
            link: `/messages/${currentUserId}`
          })
          .then(({ error }) => {
            if (error) console.error('Error creating notification:', error);
          });

      } catch (err: any) {
        console.error('Error sending message:', err);
        setError(err.message);
        // Revert optimistic update on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        throw err;
      }
    },
    [currentUserId, otherUserId]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (messageIds.length === 0) return;

      try {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', messageIds);

        if (updateError) throw updateError;
      } catch (err: any) {
        console.error('Error marking messages as read:', err);
        setError(err.message);
      }
    },
    []
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
  };
}
