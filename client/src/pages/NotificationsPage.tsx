import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  InformationCircleIcon, 
  ExclamationCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notificationsApi';
import { useRealtimeTable } from '../hooks/useRealtimeTable';
import type { Notification } from '../types';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useRealtimeTable({
    table: 'notifications',
    filter: user ? `user_id=eq.${user.id}` : '',
    onChange: (payload) => {
      if (payload.eventType === 'INSERT') {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      }
    },
  });

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-6 w-6 text-emerald-500" />;
      case 'warning': return <ExclamationCircleIcon className="h-6 w-6 text-amber-500" />;
      case 'info': default: return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white">Notifications</h1>
          <p className="text-charcoal-500 dark:text-mint-400 mt-1">
            Stay updated with your latest activities
          </p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-charcoal-900 rounded-2xl shadow-sm border border-teal-100 dark:border-charcoal-800">
          <BellIcon className="h-12 w-12 mx-auto text-teal-200 dark:text-charcoal-600 mb-3" />
          <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">No notifications</h3>
          <p className="text-charcoal-500 dark:text-mint-400">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              className={`
                p-4 rounded-xl border transition-all cursor-pointer
                ${!notification.read 
                  ? 'bg-white dark:bg-charcoal-800 border-emerald-200 dark:border-emerald-900/30 shadow-sm' 
                  : 'bg-gray-50 dark:bg-charcoal-900/50 border-transparent opacity-75 hover:opacity-100'
                }
              `}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-base font-medium ${
                      !notification.read ? 'text-charcoal-900 dark:text-white' : 'text-charcoal-600 dark:text-mint-200'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-charcoal-400 dark:text-mint-500 whitespace-nowrap ml-2">
                      {new Date(notification.created_at).toLocaleDateString()} {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-charcoal-600 dark:text-mint-300">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0 self-center">
                    <div className="h-3 w-3 bg-emerald-500 rounded-full shadow-emerald-glow" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
