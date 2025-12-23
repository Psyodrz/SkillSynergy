import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFriends, type FriendStatus } from '../hooks/useFriends';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleLeftIcon, UserPlusIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    role: string;
    location?: string;
    skills: string[];
    avatar?: string | null;
    bio?: string | null;
    connections?: number;
    projects?: number;
  };
  onConnect?: (user: any) => void;
  className?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const UserCard: React.FC<UserCardProps> = ({ user, onConnect, className = '' }) => {
  const { user: currentUser } = useAuth();
  const { getFriendStatus, sendFriendRequest } = useFriends(currentUser?.id || null);
  const [status, setStatus] = useState<FriendStatus>('none');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (currentUser && user.id && currentUser.id !== user.id) {
      getFriendStatus(user.id).then(s => {
        if (mounted) setStatus(s);
      });
    }
    return () => { mounted = false; };
  }, [currentUser, user.id, getFriendStatus]);

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await sendFriendRequest(user.id);
      setStatus('pending');
      if (onConnect) onConnect(user);
    } catch (error) {
      console.error('Failed to send request:', error);
      alert('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/messages/${user.id}`);
  };

  const isSelf = currentUser?.id === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-navy-800 rounded-xl shadow-premium border border-warm-200 dark:border-navy-700
        p-6 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full
        ${className}
      `}
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      {/* User Header */}
      <div className="flex items-center space-x-4 mb-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 bg-gradient-emerald rounded-full flex items-center justify-center shadow-emerald-glow shrink-0">
            <span className="text-white font-bold text-lg">
              {getInitials(user.name)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white truncate">
            {user.name}
          </h3>
          <p className="text-sm text-navy-500 dark:text-warm-400 truncate">
            {user.role}
          </p>
          {user.location && (
            <p className="text-xs text-navy-400 dark:text-warm-500 truncate flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {user.location}
            </p>
          )}
        </div>
      </div>

      {/* User Bio (if available) */}
      <div className="flex-grow">
        {user.bio && (
          <p className="text-sm text-navy-600 dark:text-warm-300 mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}
        
        {/* User Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-navy-700 dark:text-warm-300 mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-emerald-100 dark:bg-charcoal-900 text-emerald-700 dark:text-emerald-400 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-2 py-1 bg-warm-100 dark:bg-navy-700 text-navy-500 dark:text-warm-400 text-xs rounded-full">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Button */}
      {!isSelf && (
        <div className="mt-auto pt-4">
          {status === 'friends' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMessage}
              className="w-full bg-gradient-emerald text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-emerald-glow hover:shadow-premium-emerald"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              Message
            </motion.button>
          ) : status === 'pending' ? (
            <button
              disabled
              className="w-full bg-mint-100 dark:bg-charcoal-800 text-emerald-500 dark:text-emerald-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ClockIcon className="w-5 h-5" />
              Pending
            </button>
          ) : status === 'received' ? (
            <button
              disabled
              className="w-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              Request Received
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-white dark:bg-charcoal-900 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-mint-100 dark:hover:bg-charcoal-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlusIcon className="w-5 h-5" />
              )}
              Connect
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;
