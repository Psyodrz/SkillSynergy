import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useDirectMessages } from '../hooks/useDirectMessages';
import { useFriends } from '../hooks/useFriends';
import { supabase } from '../lib/supabaseClient';

const MessagesPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [targetProfile, setTargetProfile] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const isUserId = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const targetUserId = isUserId(id) ? id : null;

  const { messages, sendMessage, loading: loadingMessages } = useDirectMessages(user?.id || '', targetUserId || '');
  const { getFriendStatus } = useFriends(user?.id || null);
  const [friendStatus, setFriendStatus] = useState('checking');

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check friend status and fetch target profile
  useEffect(() => {
    if (user && targetUserId) {
      setFriendStatus('checking');
      getFriendStatus(targetUserId).then(status => {
        setFriendStatus(status);
      });

      supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single()
        .then(({ data }) => {
          if (data) setTargetProfile(data);
        });
    } else {
      setTargetProfile(null);
      setFriendStatus('none');
    }
  }, [user, targetUserId]);

  // Fetch conversations (Friends list for now)
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        // Fetch friends
        const { data: friendsData, error } = await supabase
          .from('friends')
          .select('*')
          .or(`user1.eq.${user.id},user2.eq.${user.id}`);

        if (error) throw error;

        if (friendsData) {
          const friendIds = friendsData.map(f => f.user1 === user.id ? f.user2 : f.user1);
          
          if (friendIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('*')
              .in('id', friendIds);
              
            setConversations(profiles || []);
          } else {
            setConversations([]);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar / Conversations List */}
      <div className={`w-full md:w-80 bg-mint-100 dark:bg-charcoal-900 border-r border-mint-200 dark:border-charcoal-700 flex flex-col ${targetUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-mint-200 dark:border-charcoal-700">
          <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-charcoal-500 dark:text-mint-300">
              <p>No friends yet.</p>
              <p className="text-sm mt-2">Connect with people to start chatting!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={`p-4 border-b border-mint-100 dark:border-charcoal-700 cursor-pointer hover:bg-mint-50 dark:hover:bg-charcoal-800 transition-colors ${
                  targetUserId === conv.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {conv.avatar_url ? (
                    <img src={conv.avatar_url} alt={conv.full_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {conv.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-white">{conv.full_name}</h3>
                    <p className="text-xs text-charcoal-500 dark:text-mint-300">{conv.role}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!targetUserId ? 'hidden md:flex' : 'flex'}`}>
        {targetUserId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-mint-100 dark:bg-charcoal-900 border-b border-mint-200 dark:border-charcoal-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/messages')}
                  className="md:hidden text-charcoal-500 hover:text-charcoal-700"
                >
                  ← Back
                </button>
                {targetProfile && (
                  <>
                    {targetProfile.avatar_url ? (
                      <img src={targetProfile.avatar_url} alt={targetProfile.full_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        {targetProfile.full_name?.[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-charcoal-900 dark:text-white">{targetProfile.full_name}</h3>
                      <p className="text-xs text-charcoal-500 dark:text-mint-300">{targetProfile.role}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Messages or Gate */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {friendStatus === 'checking' ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : friendStatus !== 'friends' ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <UserCircleIcon className="w-16 h-16 text-teal-400 mb-4" />
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
                    Not Connected
                  </h3>
                  <p className="text-charcoal-600 dark:text-mint-200 max-w-md">
                    You must be connected (friend request accepted) to start a chat with this user.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] px-4 py-2 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white shadow-sm border border-mint-100 dark:border-charcoal-700'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-emerald-100' : 'text-charcoal-500 dark:text-mint-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            {friendStatus === 'friends' && (
              <div className="p-4 bg-mint-100 dark:bg-charcoal-900 border-t border-mint-200 dark:border-charcoal-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-teal-200 dark:border-charcoal-700 rounded-lg bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-charcoal-500 dark:text-mint-300">
            <ChatBubbleLeftIcon className="w-16 h-16 mb-4" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
