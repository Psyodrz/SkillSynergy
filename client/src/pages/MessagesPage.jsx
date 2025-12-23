import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon,
  ChatBubbleLeftIcon,
  XMarkIcon,
  PhotoIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { InlineLoader } from '../components/BrandLoader';
import { useDirectMessages } from '../hooks/useDirectMessages';
import { useFriends } from '../hooks/useFriends';
import { usePresence } from '../hooks/usePresence';
import { useTyping } from '../hooks/useTyping';
import { supabase } from '../lib/supabaseClient';

// Import new chat components
import MessageBubble from '../components/chat/MessageBubble';
import { EmojiButton } from '../components/chat/EmojiPicker';
import DateSeparator, { groupMessagesByDate } from '../components/chat/DateSeparator';

const MessagesPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [targetProfile, setTargetProfile] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Message being replied to
  const [uploadingMedia, setUploadingMedia] = useState(false); // Media upload in progress
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const isUserId = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const targetUserId = isUserId(id) ? id : null;

  const { 
    messages, 
    sendMessage, 
    loading: loadingMessages,
    markAsRead,
    markAsDelivered,
    deleteMessage 
  } = useDirectMessages(user?.id || '', targetUserId || '');
  
  const { getFriendStatus } = useFriends(user?.id || null);
  const [friendStatus, setFriendStatus] = useState('checking');

  // Presence Logic
  const { isOnline, getLastSeen } = usePresence(user?.id, {
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url
  });

  // Typing Logic
  const typingChannelName = user?.id && targetUserId 
    ? `typing:${[user.id, targetUserId].sort().join(':')}` 
    : '';
  const { typingUsers, sendTyping } = useTyping(typingChannelName, user?.id);
  const isTargetTyping = targetUserId && typingUsers.has(targetUserId);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTargetTyping]);

  // Mark messages as delivered when conversation opens
  useEffect(() => {
    if (targetUserId && user?.id) {
      markAsDelivered();
    }
  }, [targetUserId, user?.id, markAsDelivered]);

  // Mark unread messages as read when viewing
  useEffect(() => {
    if (!user?.id || !targetUserId) return;
    
    const unreadMessageIds = messages
      .filter(m => m.sender_id === targetUserId && !m.read && m.status !== 'read')
      .map(m => m.id);
    
    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds);
    }
  }, [messages, user?.id, targetUserId, markAsRead]);

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

  // Fetch conversations (Friends list)
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const { data: friendsData, error } = await supabase
          .from('friends')
          .select('*')
          .or(`user1.eq.${user.id},user2.eq.${user.id}`);

        if (error) throw error;

        if (friendsData && friendsData.length > 0) {
          const friendIds = friendsData.map(f => f.user1 === user.id ? f.user2 : f.user1);
          const validFriendIds = friendIds.filter(id => id);
          
          if (validFriendIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('*')
              .in('id', validFriendIds);
              
            setConversations(profiles || []);
          } else {
            setConversations([]);
          }
        } else {
          setConversations([]);
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
      await sendMessage(newMessage, replyingTo?.id);
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    sendTyping();
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId, deleteForAll) => {
    await deleteMessage(messageId, deleteForAll);
  };

  // Handle media file upload
  const handleMediaUpload = async (file) => {
    if (!file || !targetUserId || !user?.id) return;
    
    setUploadingMedia(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        // If bucket doesn't exist, show helpful message
        if (uploadError.message?.includes('bucket') || uploadError.statusCode === 404) {
          alert('Media upload not configured. Please create a "chat-media" storage bucket in Supabase.');
        } else {
          alert(`Upload failed: ${uploadError.message}`);
        }
        return;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(fileName);
      
      // Determine media type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      // Send message with media
      const mediaMessage = isImage 
        ? `📷 [Image](${publicUrl})`
        : isVideo 
          ? `🎥 [Video](${publicUrl})`
          : `📎 [${file.name}](${publicUrl})`;
      
      await sendMessage(mediaMessage, replyingTo?.id);
      setReplyingTo(null);
      
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Format last seen time
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return null;
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    if (diffMins < 1440) return `Last seen today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="flex h-[100dvh] md:h-[calc(100vh-64px)] overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-mint-200 dark:border-charcoal-700 flex flex-col min-h-0 overflow-hidden bg-mint-50/50 dark:bg-charcoal-950 ${targetUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex-shrink-0 p-4 bg-mint-100 dark:bg-charcoal-900 border-b border-mint-200 dark:border-charcoal-700">
          <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">Learning Discussions</h2>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto pt-1">
          {loadingConversations ? (
            <div className="flex justify-center p-8">
              <InlineLoader size="md" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-charcoal-500 dark:text-mint-300">
              <UserCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No friends yet.</p>
              <p className="text-sm">Add friends to start chatting!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={`flex items-center p-3 cursor-pointer hover:bg-mint-100 dark:hover:bg-charcoal-800 transition-colors border-b border-mint-100 dark:border-charcoal-800 ${
                  targetUserId === conv.id ? 'bg-mint-100 dark:bg-charcoal-800' : ''
                }`}
              >
                <div className="relative">
                  {conv.avatar_url ? (
                    <img src={conv.avatar_url} alt={conv.full_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {conv.full_name?.[0]}
                    </div>
                  )}
                  {isOnline(conv.id) && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-charcoal-950" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal-900 dark:text-white truncate">{conv.full_name}</h3>
                  <p className="text-sm text-charcoal-500 dark:text-mint-400 truncate">
                    {isOnline(conv.id) ? '● Online' : conv.role || 'Student'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Full height flex container */}
      <div className={`flex-1 flex flex-col min-h-0 overflow-hidden ${!targetUserId ? 'hidden md:flex' : 'flex'}`}>
        {targetUserId ? (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-mint-50 to-white dark:from-charcoal-900 dark:to-charcoal-950">
            {/* Chat Header - fixed height, never shrinks */}
            <div className="flex-shrink-0 p-3 bg-white/80 dark:bg-charcoal-900/90 backdrop-blur-sm border-b border-mint-200 dark:border-charcoal-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/messages')}
                  className="md:hidden text-charcoal-500 dark:text-mint-400 hover:text-charcoal-700 dark:hover:text-white p-2 -ml-2 mr-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {targetProfile && (
                  <div 
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/profile/${targetProfile.id}`)}
                  >
                    <div className="relative">
                      {targetProfile.avatar_url ? (
                        <img src={targetProfile.avatar_url} alt={targetProfile.full_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {targetProfile.full_name?.[0]}
                        </div>
                      )}
                      {isOnline(targetProfile.id) && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-charcoal-900" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 dark:text-white">{targetProfile.full_name}</h3>
                      <p className="text-xs text-charcoal-500 dark:text-mint-300">
                        {isOnline(targetProfile.id) 
                          ? '● Online' 
                          : (formatLastSeen(targetProfile.last_seen) || targetProfile.role)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area - fills remaining space, scrolls only when needed, no visible scrollbar */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-4 space-y-2">
              {friendStatus === 'checking' ? (
                <div className="flex justify-center p-4">
                  <InlineLoader size="md" />
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
                  {groupedMessages.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      <DateSeparator date={group.date} />
                      {group.messages.map((msg) => (
                        <MessageBubble
                          key={msg.id}
                          message={{
                            ...msg,
                            reply_to_content: msg.reply_to_content,
                            reply_to_sender_name: msg.reply_to_sender_name
                          }}
                          isOwnMessage={msg.sender_id === user?.id}
                          onReply={handleReply}
                          onDelete={handleDeleteMessage}
                          showStatus={msg.sender_id === user?.id}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTargetTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-charcoal-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-mint-100 dark:border-charcoal-700">
                        <div className="flex space-x-1.5 items-center h-4">
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
                              initial={{ y: 0 }}
                              animate={{ y: -6 }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                delay: dot * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Reply Preview */}
            {replyingTo && friendStatus === 'friends' && (
              <div className="px-4 py-2 bg-charcoal-100 dark:bg-charcoal-800 border-t border-mint-200 dark:border-charcoal-700 flex items-center justify-between">
                <div className="flex-1 min-w-0 border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Replying to {replyingTo.sender_id === user?.id ? 'yourself' : targetProfile?.full_name}
                  </p>
                  <p className="text-sm text-charcoal-600 dark:text-charcoal-300 truncate">
                    {replyingTo.content}
                  </p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="p-1 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-white"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Input Area - flex-shrink-0 keeps it at bottom */}
            {friendStatus === 'friends' && (
              <div className="flex-shrink-0 p-3 sm:p-4 bg-white/80 dark:bg-charcoal-900/90 backdrop-blur-sm border-t border-mint-200 dark:border-charcoal-700 pb-safe">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  {/* Emoji Button */}
                  <EmojiButton onEmojiSelect={handleEmojiSelect} />
                  
                  {/* Attachment/Media Button */}
                  <label className={`p-2 rounded-full transition-colors ${uploadingMedia ? 'cursor-wait opacity-50' : 'cursor-pointer text-charcoal-500 dark:text-charcoal-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-700'}`}>
                    {uploadingMedia ? (
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <PaperClipIcon className="w-6 h-6" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*,video/*,.pdf,.doc,.docx" 
                      className="hidden" 
                      disabled={uploadingMedia}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleMediaUpload(file);
                          e.target.value = ''; // Reset input
                        }
                      }}
                    />
                  </label>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
                    className="flex-1 p-2.5 sm:p-2 border border-teal-200 dark:border-charcoal-700 rounded-full bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base px-4"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-charcoal-500 dark:text-mint-300">
            <ChatBubbleLeftIcon className="w-16 h-16 mb-4" />
            <p className="text-lg">Select a discussion to start learning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
