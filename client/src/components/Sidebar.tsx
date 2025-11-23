import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  PlusCircleIcon,
  FolderIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const { pathname } = useLocation();
  const { signOut, user, profile } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Discover', href: '/discover', icon: SparklesIcon },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Projects', href: '/projects', icon: BriefcaseIcon },
    { name: 'My Projects', href: '/my-projects', icon: FolderIcon },
    { name: 'Requests', href: '/requests', icon: UserGroupIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col bg-mint-100/80 dark:bg-charcoal-900/90 backdrop-blur-xl border-r border-teal-200 dark:border-charcoal-700`}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="SkillSynergy" />
              <span className="ml-2 text-xl font-bold bg-gradient-emerald bg-clip-text text-transparent">
                SkillSynergy
              </span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 text-teal-500 hover:text-teal-700 dark:text-mint-400 dark:hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 mb-6">
            <Link
              to="/projects/create"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform bg-gradient-emerald rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              New Project
            </Link>
          </div>

          <div className="flex flex-col flex-grow px-3 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose && onClose()}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-teal-100 dark:bg-charcoal-800 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-teal-600 dark:text-mint-400 hover:bg-teal-100 dark:hover:bg-charcoal-800 hover:text-teal-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                      active
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-teal-400 dark:text-teal-500 group-hover:text-teal-600 dark:group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </Link>
              );
            })}
          </div>

          <div className="p-4 mt-auto border-t border-teal-200 dark:border-charcoal-700">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-emerald flex items-center justify-center text-white font-bold text-sm">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-teal-900 dark:text-white truncate max-w-[120px]">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-teal-500 dark:text-mint-400 truncate max-w-[120px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
