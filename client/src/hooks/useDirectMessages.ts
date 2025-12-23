import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reply_to_id?: string;
  reply_to_content?: string;
  reply_to_sender_name?: string;
  deleted_for_sender?: boolean;
  deleted_for_all?: boolean;
}

interface UseDirectMessagesReturn {
  messages: Message[];
  loading: boolean;
  error?: string;
  sendMessage: (text: string, replyToId?: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  markAsDelivered: () => Promise<void>;
  deleteMessage: (messageId: string, deleteForAll: boolean) => Promise<void>;
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

        // Filter out deleted messages and set default status
        const processedMessages = (data || [])
          .filter(msg => {
            // Hide if deleted for everyone
            if (msg.deleted_for_all) return true; // Show "deleted" placeholder
            // Hide if deleted for sender and current user is sender
            if (msg.deleted_for_sender && msg.sender_id === currentUserId) return false;
            return true;
          })
          .map(msg => ({
            ...msg,
            status: msg.read ? 'read' : (msg.status || 'sent')
          }));

        setMessages(processedMessages);
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
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
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
                const updated = [...prev, { ...newMessage, status: 'sent' as const }];
                return updated.sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            setMessages((prev) => 
              prev.map((m) => m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id));
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
    async (text: string, replyToId?: string) => {
      if (!text.trim() || !currentUserId || !otherUserId) return;

      // Generate a temporary ID for optimistic update
      const optimisticId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      // If replying, find the original message content
      let replyToContent: string | undefined;
      let replyToSenderName: string | undefined;
      if (replyToId) {
        const replyMsg = messages.find(m => m.id === replyToId);
        if (replyMsg) {
          replyToContent = replyMsg.content;
          replyToSenderName = replyMsg.sender_id === currentUserId ? 'You' : undefined;
        }
      }

      const optimisticMessage: Message = {
        id: optimisticId,
        created_at: timestamp,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: text.trim(),
        read: false,
        status: 'sending',
        reply_to_id: replyToId,
        reply_to_content: replyToContent,
        reply_to_sender_name: replyToSenderName
      };

      // 1. Optimistic UI update
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        // 2. Send to Supabase
        const { error: sendError } = await supabase.from('messages').insert({
          id: optimisticId,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: text.trim(),
          read: false,
          status: 'sent',
          reply_to_id: replyToId
        });

        if (sendError) throw sendError;

        // Update status to sent
        setMessages((prev) => 
          prev.map((m) => m.id === optimisticId ? { ...m, status: 'sent' } : m)
        );

        // 3. Create Notification for the receiver
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
    [currentUserId, otherUserId, messages]
  );

  // Mark messages as delivered when conversation is opened
  const markAsDelivered = useCallback(async () => {
    if (!currentUserId || !otherUserId) return;

    try {
      await supabase
        .from('messages')
        .update({ status: 'delivered' })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', currentUserId)
        .eq('status', 'sent');
    } catch (err: any) {
      console.error('Error marking messages as delivered:', err);
    }
  }, [currentUserId, otherUserId]);

  // Mark messages as read
  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (messageIds.length === 0) return;

      try {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true, status: 'read' })
          .in('id', messageIds);

        if (updateError) throw updateError;

        // Update local state
        setMessages((prev) => 
          prev.map((m) => messageIds.includes(m.id) ? { ...m, read: true, status: 'read' } : m)
        );
      } catch (err: any) {
        console.error('Error marking messages as read:', err);
        setError(err.message);
      }
    },
    []
  );

  // Delete a message
  const deleteMessage = useCallback(
    async (messageId: string, deleteForAll: boolean) => {
      try {
        if (deleteForAll) {
          // Mark as deleted for everyone
          await supabase
            .from('messages')
            .update({ deleted_for_all: true, content: '' })
            .eq('id', messageId);
          
          // Update local state
          setMessages((prev) => 
            prev.map((m) => m.id === messageId ? { ...m, deleted_for_all: true } : m)
          );
        } else {
          // Mark as deleted for sender only
          await supabase
            .from('messages')
            .update({ deleted_for_sender: true })
            .eq('id', messageId);
          
          // Remove from local state
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        }
      } catch (err: any) {
        console.error('Error deleting message:', err);
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
    markAsDelivered,
    deleteMessage
  };
}

