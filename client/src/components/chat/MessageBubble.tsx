import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckIcon, 
  TrashIcon, 
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

export interface MessageData {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reply_to_id?: string;
  reply_to_content?: string;
  reply_to_sender_name?: string;
  deleted_for_all?: boolean;
}

interface MessageBubbleProps {
  message: MessageData;
  isOwnMessage: boolean;
  onReply?: (message: MessageData) => void;
  onDelete?: (messageId: string, deleteForAll: boolean) => void;
  showStatus?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onReply,
  onDelete,
  showStatus = true
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Format timestamp
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Render status ticks for sent messages
  const renderStatusTicks = () => {
    if (!isOwnMessage || !showStatus) return null;

    const status = message.status || 'sent';

    switch (status) {
      case 'sending':
        return (
          <span className="ml-1 opacity-60">
            <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </span>
        );
      case 'sent':
        return (
          <span className="ml-1 opacity-70">
            <CheckIcon className="w-3.5 h-3.5 inline" />
          </span>
        );
      case 'delivered':
        return (
          <span className="ml-1 opacity-70">
            <CheckIcon className="w-3.5 h-3.5 inline -mr-1.5" />
            <CheckIcon className="w-3.5 h-3.5 inline" />
          </span>
        );
      case 'read':
        return (
          <span className="ml-1 text-blue-400">
            <CheckIconSolid className="w-3.5 h-3.5 inline -mr-1.5" />
            <CheckIconSolid className="w-3.5 h-3.5 inline" />
          </span>
        );
      default:
        return null;
    }
  };

  // Handle deleted message
  if (message.deleted_for_all) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`px-4 py-2 rounded-2xl italic text-sm ${
          isOwnMessage 
            ? 'bg-charcoal-200 dark:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400' 
            : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-500 dark:text-charcoal-400'
        }`}>
          🚫 This message was deleted
        </div>
      </motion.div>
    );
  }

  // Render message content with media support
  const renderContent = () => {
    const content = message.content;
    
    // Check for image message pattern: 📷 [Image](url)
    const imageMatch = content.match(/📷 \[Image\]\((https?:\/\/[^\)]+)\)/);
    if (imageMatch) {
      const imageUrl = imageMatch[1];
      return (
        <div className="space-y-1">
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={imageUrl} 
              alt="Shared image" 
              className="max-w-full rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      );
    }
    
    // Check for video message pattern: 🎥 [Video](url)
    const videoMatch = content.match(/🎥 \[Video\]\((https?:\/\/[^\)]+)\)/);
    if (videoMatch) {
      const videoUrl = videoMatch[1];
      return (
        <div className="space-y-1">
          <video 
            src={videoUrl} 
            controls 
            className="max-w-full rounded-lg max-h-64"
          >
            Your browser does not support video playback.
          </video>
        </div>
      );
    }
    
    // Check for file message pattern: 📎 [filename](url)
    const fileMatch = content.match(/📎 \[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
    if (fileMatch) {
      const fileName = fileMatch[1];
      const fileUrl = fileMatch[2];
      return (
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isOwnMessage 
              ? 'bg-emerald-600/50 hover:bg-emerald-600/70' 
              : 'bg-charcoal-100 dark:bg-charcoal-700 hover:bg-charcoal-200 dark:hover:bg-charcoal-600'
          } transition-colors`}
        >
          <span className="text-lg">📎</span>
          <span className="truncate max-w-[200px]">{fileName}</span>
        </a>
      );
    }
    
    // Regular text message
    return <p className="whitespace-pre-wrap break-words">{content}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'} relative`}
    >
      {/* Message Actions - Show on hover (desktop) */}
      <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${
        isOwnMessage ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'
      }`}>
        {onReply && (
          <button
            onClick={() => onReply(message)}
            className="p-1.5 rounded-full bg-charcoal-100 dark:bg-charcoal-700 hover:bg-charcoal-200 dark:hover:bg-charcoal-600 text-charcoal-600 dark:text-charcoal-300 transition-colors"
            title="Reply"
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={`max-w-[75%] relative ${isOwnMessage ? 'order-1' : ''}`}>
        {/* Reply Preview */}
        {message.reply_to_content && (
          <div className={`px-3 py-1.5 mb-1 rounded-lg text-xs border-l-2 ${
            isOwnMessage 
              ? 'bg-emerald-600/30 border-emerald-300 text-emerald-100' 
              : 'bg-charcoal-100 dark:bg-charcoal-700 border-emerald-500 text-charcoal-600 dark:text-charcoal-300'
          }`}>
            <span className="font-medium text-emerald-400">
              {message.reply_to_sender_name || 'Reply'}
            </span>
            <p className="truncate opacity-80">{message.reply_to_content}</p>
          </div>
        )}

        {/* Message Bubble */}
        <div 
          className={`px-4 py-2 rounded-2xl relative ${
            isOwnMessage
              ? 'bg-emerald-500 text-white rounded-tr-sm shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white rounded-tl-sm shadow-sm border border-mint-100 dark:border-charcoal-700'
          }`}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(true);
          }}
        >
          {/* Message Content */}
          {renderContent()}
          
          
          {/* Time & Status */}
          <div className={`flex items-center justify-end gap-0.5 mt-1 -mb-0.5 ${
            isOwnMessage ? 'text-emerald-100' : 'text-charcoal-400 dark:text-mint-500'
          }`}>
            <span className="text-xs">{formatTime(message.created_at)}</span>
            {renderStatusTicks()}
          </div>
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`absolute z-50 bg-white dark:bg-charcoal-800 rounded-xl shadow-xl border border-charcoal-200 dark:border-charcoal-600 py-1 min-w-[140px] ${
                  isOwnMessage ? 'right-0' : 'left-0'
                } top-full mt-1`}
              >
                {onReply && (
                  <button
                    onClick={() => {
                      onReply(message);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-charcoal-100 dark:hover:bg-charcoal-700 flex items-center gap-2 text-charcoal-700 dark:text-charcoal-200"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    Reply
                  </button>
                )}
                {isOwnMessage && onDelete && (
                  <>
                    <button
                      onClick={() => {
                        onDelete(message.id, false);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-charcoal-100 dark:hover:bg-charcoal-700 flex items-center gap-2 text-charcoal-700 dark:text-charcoal-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete for me
                    </button>
                    <button
                      onClick={() => {
                        onDelete(message.id, true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete for everyone
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
