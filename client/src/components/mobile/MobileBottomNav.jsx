import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  MagnifyingGlassCircleIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassCircleIcon as SearchIconSolid,
  FolderIcon as FolderIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  UserCircleIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const MobileBottomNav = ({ className = '' }) => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon,
      iconActive: HomeIconSolid,
      label: 'Home'
    },
    {
      name: 'Discover',
      path: '/discover',
      icon: MagnifyingGlassCircleIcon,
      iconActive: SearchIconSolid,
      label: 'Discover'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderIcon,
      iconActive: FolderIconSolid,
      label: 'Projects'
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: ChatBubbleLeftRightIcon,
      iconActive: ChatIconSolid,
      label: 'Messages',
      badge: 3 // Example badge count
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: UserCircleIcon,
      iconActive: UserIconSolid,
      label: 'Profile'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-white dark:bg-gray-800
        border-t border-gray-200 dark:border-gray-700
        md:hidden
        safe-area-bottom
        ${className}
      `}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = active ? item.iconActive : item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full touch-target"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={`
                      h-6 w-6 transition-colors duration-200
                      ${active 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-[10px] font-medium mt-0.5 transition-colors duration-200
                  ${active 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
