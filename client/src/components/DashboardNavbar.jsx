import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notificationsApi';

const Navbar = ({ onSearch = null, className = '', onToggleSidebar }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // UPDATED: Using new Supabase auth context with user and profile
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'warning': return <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />;
      case 'info': default: return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          sticky top-0 z-40
          bg-mint-100/80 dark:bg-charcoal-900/90 backdrop-blur-xl shadow-sm border-b border-teal-200 dark:border-charcoal-700
          px-4 sm:px-6 py-4 flex items-center justify-between
          ${className}
        `}
      >
        {/* Sidebar toggle button (Mobile and Tablet) */}
        <div className="block xl:hidden mr-4">
          <button
            onClick={() => {
              if (onToggleSidebar) onToggleSidebar();
              setIsMobileMenuOpen(false);
            }}
            className="p-2 text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white hover:bg-teal-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo - Mobile */}
        <div className="md:hidden flex-1">
          <Link to="/dashboard">
            <h1 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400">
              SkillSynergy
            </h1>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto px-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-navy-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills, modules, or challenges..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                block w-full pl-10 pr-3 py-2 border border-teal-200 dark:border-charcoal-600 rounded-xl
                bg-white/80 dark:bg-charcoal-800/90 text-charcoal-900 dark:text-mint-100 placeholder-teal-400 dark:placeholder-teal-600
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-all duration-200
                ${isSearchFocused ? 'shadow-md' : 'shadow-sm'}
              `}
            />
          </div>
        </div>

      {/* Right Side */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search Icon - Mobile Only */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2 text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white hover:bg-teal-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white hover:bg-teal-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-teal-600 dark:text-mint-400 hover:text-teal-800 dark:hover:text-white hover:bg-teal-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors relative"
          >
            <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-charcoal-900" />
            )}
          </motion.button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-charcoal-900 rounded-xl shadow-premium-emerald border border-teal-200 dark:border-charcoal-700 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-teal-100 dark:border-charcoal-700 flex justify-between items-center">
                  <h3 className="font-semibold text-charcoal-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-charcoal-500 dark:text-mint-400">
                      <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-teal-50 dark:divide-charcoal-800">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`p-4 hover:bg-teal-50/50 dark:hover:bg-charcoal-800/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-teal-50/30 dark:bg-charcoal-800/30' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-charcoal-900 dark:text-white' : 'text-charcoal-600 dark:text-mint-200'
                                }`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-charcoal-400 dark:text-mint-500 whitespace-nowrap ml-2">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-charcoal-500 dark:text-mint-300 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 self-center">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-teal-100 dark:border-charcoal-700 bg-teal-50/30 dark:bg-charcoal-800/30 text-center">
                  <Link to="/notifications" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium">
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-teal-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'User'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-teal-200 dark:border-charcoal-600"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">
                  {profile?.full_name 
                    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() 
                    : user?.email ? user.email[0].toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-charcoal-900 dark:text-white">
                {/* UPDATED: Display profile.full_name from the database */}
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-teal-700 dark:text-mint-300">
                {/* UPDATED: Display profile.role from the database */}
                {profile?.role || 'Student'}
              </p>
            </div>
            <ChevronDownIcon className="hidden sm:block h-4 w-4 text-teal-600 dark:text-mint-400" />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-900 rounded-xl shadow-premium-emerald border border-teal-200 dark:border-charcoal-700 py-1 z-50"
              >
                <Link to="/profile" className="block px-4 py-2 text-sm text-charcoal-900 dark:text-mint-100 hover:bg-teal-100/50 dark:hover:bg-charcoal-800 rounded-lg mx-1">
                  View Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-charcoal-900 dark:text-mint-100 hover:bg-teal-100/50 dark:hover:bg-charcoal-800 rounded-lg mx-1">
                  Settings
                </Link>
                <hr className="my-1 border-teal-200 dark:border-charcoal-700" />
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg mx-1"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>

    {/* Mobile Search Bar */}
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-mint-100/80 dark:bg-charcoal-900/90 backdrop-blur-xl border-b border-teal-200 dark:border-charcoal-700 px-4 py-3"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-navy-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-teal-200 dark:border-charcoal-600 rounded-xl
                  bg-white/80 dark:bg-charcoal-800/90 text-charcoal-900 dark:text-mint-100 placeholder-teal-400 dark:placeholder-teal-600
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Mobile Menu - disabled when global sidebar is used */}
    </>
  );
};

export default Navbar;
