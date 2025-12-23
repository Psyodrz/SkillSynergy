import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  ArrowLeftIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CpuChipIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import config from '../config';

interface Message {
  id: string;
  skill_id: string;
  sender_id: string | null;
  sender_name: string;
  display_name: string;
  avatar_url: string | null;
  is_ai: boolean;
  content: string;
  created_at: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  message_count: number;
  participant_count: number;
}

const SkillRoomPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldScrollRef = useRef(true); // Track if we should auto-scroll
  const prevMessageCountRef = useRef(0); // Track previous message count

  // Check if user is near the bottom of the chat
  const isUserNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Only scroll to bottom on initial load or when user sends a message
  useEffect(() => {
    if (shouldScrollRef.current && messages.length > 0) {
      scrollToBottom();
      shouldScrollRef.current = false; // Reset after initial scroll
    }
  }, [messages.length, scrollToBottom]);

  // Fetch skill details - directly from Supabase
  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId) return;
      
      try {
        // Fetch skill directly from Supabase
        const { data: skillData, error: skillError } = await supabase
          .from('skills')
          .select('*')
          .eq('id', skillId)
          .single();
        
        if (skillData && !skillError) {
          // Get message count
          const { count: msgCount } = await supabase
            .from('skill_room_messages')
            .select('*', { count: 'exact', head: true })
            .eq('skill_id', skillId);
          
          // Get unique participants count
          const { data: participants } = await supabase
            .from('skill_room_messages')
            .select('sender_id')
            .eq('skill_id', skillId)
            .not('sender_id', 'is', null);
          
          const uniqueParticipants = new Set(participants?.map(p => p.sender_id) || []);
          
          setSkill({
            ...skillData,
            message_count: msgCount || 0,
            participant_count: uniqueParticipants.size
          });
        } else {
          // Fallback to API
          const response = await fetch(`${config.API_URL}/api/skill/${skillId}`);
          const data = await response.json();
          if (data.success) {
            setSkill(data.skill);
          }
        }
      } catch (err) {
        console.error('Error fetching skill:', err);
      }
    };

    fetchSkill();
  }, [skillId]);

  // Fetch messages
  const fetchMessages = useCallback(async (isPolling = false) => {
    if (!skillId) return;
    
    try {
      const response = await fetch(`${config.API_URL}/api/skill-room/${skillId}/messages?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        const newMessages = data.messages;
        // Only scroll if user is near bottom and there are new messages
        if (isPolling && newMessages.length > prevMessageCountRef.current && isUserNearBottom()) {
          setTimeout(scrollToBottom, 100);
        }
        prevMessageCountRef.current = newMessages.length;
        setMessages(newMessages);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      setIsLoading(false);
    }
  }, [skillId, isUserNearBottom, scrollToBottom]);

  // Initial fetch and polling
  useEffect(() => {
    shouldScrollRef.current = true; // Enable scroll on initial load
    fetchMessages(false);
    
    // Poll for new messages every 5 seconds
    pollIntervalRef.current = setInterval(() => fetchMessages(true), 5000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchMessages]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !skillId || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await fetch(`${config.API_URL}/api/skill-room/${skillId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageContent,
          sender_id: user?.id,
          sender_name: profile?.full_name || 'Anonymous',
          trigger_ai: true
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add messages to state immediately, avoiding duplicates by ID
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = [...prev];
          if (data.message && !existingIds.has(data.message.id)) {
            newMessages.push(data.message);
          }
          if (data.aiResponse && !existingIds.has(data.aiResponse.id)) {
            newMessages.push(data.aiResponse);
          }
          return newMessages;
        });
        // Scroll to bottom after sending a message
        setTimeout(scrollToBottom, 100);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Navigate to private chat
  const goToPrivateChat = () => {
    navigate(`/ai-chat/${skillId}?skill=${encodeURIComponent(skill?.name || '')}`);
  };

  // Format message content
  const formatMessage = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^\w+\n/, '');
        return (
          <pre key={i} className="bg-charcoal-900 text-green-400 p-3 rounded-lg my-2 overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-charcoal-950 dark:to-charcoal-900">
      {/* Header - Compact */}
      <div className="flex-shrink-0 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-500 flex items-center gap-3 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 bg-green-400 text-[10px] text-charcoal-900 px-1 py-0.5 rounded-full font-bold">
              LIVE
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-sm truncate flex items-center gap-1">
              {skill?.name || 'Loading...'} Room
              <SparklesIcon className="w-3 h-3 flex-shrink-0" />
            </h3>
            <p className="text-xs text-emerald-100 flex items-center gap-1 truncate">
              <UserGroupIcon className="w-3 h-3 flex-shrink-0" />
              {new Set(messages.filter(m => m.sender_id && !m.is_ai).map(m => m.sender_id)).size || 0} • {messages.length} msgs
            </p>
          </div>
        </div>

        <button
          onClick={goToPrivateChat}
          className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs font-medium"
        >
          <LockClosedIcon className="w-3 h-3" />
          <span className="hidden sm:inline">Private</span>
        </button>
      </div>

      {/* Info Banner - Compact */}
      <div className="flex-shrink-0 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800">
        <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center">
          🌍 This is a public learning room. Ask questions and learn together with the AI tutor and other students!
        </p>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <CpuChipIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
              Welcome to the {skill?.name} Learning Room!
            </h2>
            <p className="text-charcoal-600 dark:text-mint-300 max-w-md mx-auto mb-4">
              This is a public space where you can ask questions and learn with the AI tutor. 
              Your messages are visible to all participants.
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Be the first to start a discussion! 🎉
            </p>
          </motion.div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for others */}
              {msg.sender_id !== user?.id && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                  msg.is_ai 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                    : 'bg-charcoal-300 dark:bg-charcoal-600'
                }`}>
                  {msg.is_ai ? (
                    <CpuChipIcon className="w-4 h-4 text-white" />
                  ) : msg.avatar_url ? (
                    <img src={msg.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {msg.display_name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
              )}

              <div className={`max-w-[75%] ${msg.sender_id === user?.id ? 'text-right' : ''}`}>
                {/* Sender name */}
                {msg.sender_id !== user?.id && (
                  <p className={`text-xs mb-1 ${
                    msg.is_ai ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-charcoal-500 dark:text-mint-400'
                  }`}>
                    {msg.display_name}
                    {msg.is_ai && <span className="ml-1">✨ AI Tutor</span>}
                  </p>
                )}

                {/* Message bubble */}
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.sender_id === user?.id
                    ? 'bg-emerald-500 text-white rounded-tr-sm'
                    : msg.is_ai
                      ? 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white border-2 border-emerald-200 dark:border-emerald-800 rounded-tl-sm'
                      : 'bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{formatMessage(msg.content)}</div>
                </div>

                {/* Timestamp */}
                <p className={`text-xs mt-1 ${
                  msg.sender_id === user?.id ? 'text-charcoal-400' : 'text-charcoal-400 dark:text-mint-500'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}

        {/* Sending indicator */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-2">
              <CpuChipIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-charcoal-800 px-4 py-3 rounded-2xl rounded-tl-sm border-2 border-emerald-200 dark:border-emerald-800">
              <div className="flex space-x-1.5 items-center h-5">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                    initial={{ y: 0 }}
                    animate={{ y: -6 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: dot * 0.15
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-center py-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Compact */}
      <div className="flex-shrink-0 p-3 bg-white dark:bg-charcoal-900 border-t border-mint-200 dark:border-charcoal-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Ask about ${skill?.name || 'this topic'}...`}
            disabled={isSending}
            className="flex-1 p-2.5 border border-emerald-200 dark:border-charcoal-700 rounded-xl bg-mint-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 placeholder-charcoal-500 dark:placeholder-mint-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkillRoomPage;
