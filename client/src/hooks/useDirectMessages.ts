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

  // Subscribe to realtime changes
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    // Create a unique channel name for this conversation
    const channelName = `messages:${[currentUserId, otherUserId].sort().join('-')}`;

    const messageChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUserId},receiver_id=eq.${otherUserId}`,
        },
        (payload) => {
          console.log('New message (sent):', payload);
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${otherUserId},receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          console.log('New message (received):', payload);
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Message updated:', payload);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as Message) : msg
            )
          );
        }
      )
      .subscribe();



    // Cleanup subscription on unmount
    return () => {
      console.log('Unsubscribing from messages channel');
      messageChannel.unsubscribe();
    };
  }, [currentUserId, otherUserId]);

  // Send a new message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId || !otherUserId) return;

      try {
        const { error: sendError } = await supabase.from('messages').insert({
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: text.trim(),
          read: false,
        });

        if (sendError) throw sendError;
      } catch (err: any) {
        console.error('Error sending message:', err);
        setError(err.message);
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
