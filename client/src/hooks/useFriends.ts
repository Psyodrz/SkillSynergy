import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRealtimeTable } from './useRealtimeTable';
import type { FriendRequest } from '../types';

export type FriendStatus = 'none' | 'pending' | 'friends' | 'received';

export function useFriends(currentUserId: string | null) {
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch incoming requests
  const fetchIncomingRequests = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      // Note: This assumes profiles are linked via foreign key or we might need to fetch manually if not
      // Using a simpler query first to avoid join issues if FK not set up perfectly
      const { data: requests, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_id', currentUserId)
        .eq('status', 'pending');

      if (error) throw error;

      if (requests && requests.length > 0) {
        // Manually fetch sender profiles to be safe
        const senderIds = requests.map(r => r.sender_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', senderIds);
          
        const requestsWithProfiles = requests.map(r => ({
          ...r,
          sender: profiles?.find(p => p.id === r.sender_id)
        }));
        
        setIncomingRequests(requestsWithProfiles as FriendRequest[]);
      } else {
        setIncomingRequests([]);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  useRealtimeTable({
    table: 'friend_requests',
    filter: currentUserId ? `receiver_id=eq.${currentUserId}` : '',
    onChange: () => {
      fetchIncomingRequests();
    },
  });

  // Check status with another user
  const getFriendStatus = async (otherUserId: string): Promise<FriendStatus> => {
    if (!currentUserId || !otherUserId) return 'none';

    // Check if friends
    const { data: friends } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user1.eq.${currentUserId},user2.eq.${otherUserId}),and(user1.eq.${otherUserId},user2.eq.${currentUserId})`);

    if (friends && friends.length > 0) return 'friends';

    // Check if request sent
    const { data: sent } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('sender_id', currentUserId)
      .eq('receiver_id', otherUserId)
      .eq('status', 'pending');

    if (sent && sent.length > 0) return 'pending';

    // Check if request received
    const { data: received } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('sender_id', otherUserId)
      .eq('receiver_id', currentUserId)
      .eq('status', 'pending');

    if (received && received.length > 0) return 'received';

    return 'none';
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!currentUserId) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('friend_requests')
      .insert([{ sender_id: currentUserId, receiver_id: receiverId }]);

    if (error) throw error;
  };

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    if (!currentUserId) throw new Error('Not authenticated');

    // 1. Update request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // 2. Create friendship
    const { error: insertError } = await supabase
      .from('friends')
      .insert([{ user1: currentUserId, user2: senderId }]);

    if (insertError) throw insertError;
    
    fetchIncomingRequests();
  };

  const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;
    fetchIncomingRequests();
  };

  return {
    incomingRequests,
    loading,
    getFriendStatus,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    refreshRequests: fetchIncomingRequests
  };
}
