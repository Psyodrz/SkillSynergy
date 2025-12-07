import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import PricingCard from '../components/PricingCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { tab = 'profile' } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const { user, profile, refreshSession } = useAuth();

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyDigest: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC-8',
      dateFormat: 'MM/DD/YYYY'
    }
  });

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'help', label: 'Help', icon: QuestionMarkCircleIcon },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">
              {profile?.full_name || 'User'}
            </h2>
            <p className="text-charcoal-500 dark:text-mint-300">
              {user?.email}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
              {profile?.role || 'Member'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <PaintBrushIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
            Appearance
          </h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
              Theme
            </h3>
            <p className="text-charcoal-700 dark:text-mint-200">
              {isDark ? 'Dark mode is enabled' : 'Light mode is enabled'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={toggleTheme}
          >
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
            Privacy
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full p-3 border border-mint-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
                Show Email Address
              </h3>
              <p className="text-charcoal-700 dark:text-mint-200">
                Allow others to see your email address
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-mint-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mint-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-charcoal-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <GlobeAltIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
            Preferences
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-2">
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full p-3 border border-mint-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full p-3 border border-mint-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <KeyIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
            Security
          </h2>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full md:w-auto">
            Change Password
          </Button>
          <Button variant="outline" className="w-full md:w-auto ml-0 md:ml-4">
            Two-Factor Authentication
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <TrashIcon className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">
            Danger Zone
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-red-900 dark:text-red-400">
              Delete Account
            </h3>
            <p className="text-red-700 dark:text-red-300">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete Account
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BellIcon className="h-6 w-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
          Notification Preferences
        </h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-mint-200 dark:border-charcoal-700">
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
              Email Notifications
            </h3>
            <p className="text-charcoal-700 dark:text-mint-200">
              Receive updates, tips, and offers via email
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => handleNotificationChange('email', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-mint-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mint-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-charcoal-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-mint-200 dark:border-charcoal-700">
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
              Push Notifications
            </h3>
            <p className="text-charcoal-700 dark:text-mint-200">
              Receive real-time notifications in your browser
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => handleNotificationChange('push', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-mint-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mint-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-charcoal-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-mint-200 dark:border-charcoal-700">
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
              SMS Notifications
            </h3>
            <p className="text-charcoal-700 dark:text-mint-200">
              Receive urgent alerts via text message
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-mint-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mint-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-charcoal-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
              Weekly Digest
            </h3>
            <p className="text-charcoal-700 dark:text-mint-200">
              Receive a weekly summary of your activity and stats
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.weeklyDigest}
              onChange={(e) => handleNotificationChange('weeklyDigest', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-mint-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-charcoal-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-mint-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-charcoal-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <CreditCardIcon className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-charcoal-900 dark:text-white">
            Subscription & Billing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Plan Info */}
          <div>
            <h3 className="text-lg font-medium text-charcoal-900 dark:text-white mb-2">
              Your Plan
            </h3>
            <p className="text-charcoal-600 dark:text-mint-200 mb-4">
              You are currently on the <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{profile?.subscription_plan || 'Free'}</span> plan.
            </p>
            {profile?.subscription_status === 'active' && (
               <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                 Active
               </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Free Plan (Visual only) */}
            <div className="p-8 rounded-2xl border border-mint-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 shadow-sm flex flex-col opacity-70">
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Free Plan</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-charcoal-900 dark:text-white">₹0</span>
                <span className="text-charcoal-500 dark:text-mint-300 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start">
                  <span className="mr-3 text-emerald-500">✓</span>
                  <span className="text-charcoal-700 dark:text-mint-100 text-sm">Basic Project Creation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-emerald-500">✓</span>
                  <span className="text-charcoal-700 dark:text-mint-100 text-sm">Limited AI Matches</span>
                </li>
              </ul>
              <Button variant="outline" disabled>Current Plan</Button>
            </div>

            {/* Pro Plan */}
            <PricingCard 
              isCurrentPlan={profile?.subscription_plan === 'pro'} 
              onSuccess={() => {
                refreshSession(); // Refresh profile to show updated status
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-6">
      {/* Help Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-emerald-glow p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
        <p className="text-emerald-100">
          Search our knowledge base or contact our support team.
        </p>
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <QuestionMarkCircleIcon className="absolute right-4 top-3.5 h-5 w-5 text-white/60" />
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
        >
          <BookOpenIcon className="h-8 w-8 text-emerald-600 mb-4" />
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">
            Documentation
          </h3>
          <p className="text-charcoal-700 dark:text-mint-200 text-sm">
            Browse detailed guides and tutorials about SkillSynergy features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
        >
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-emerald-600 mb-4" />
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">
            Community Forum
          </h3>
          <p className="text-charcoal-700 dark:text-mint-200 text-sm">
            Connect with other users, share tips, and get answers from the community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all"
        >
          <EnvelopeIcon className="h-8 w-8 text-emerald-600 mb-4" />
          <h3 className="text-lg font-bold text-charcoal-900 dark:text-white mb-2">
            Contact Support
          </h3>
          <p className="text-charcoal-700 dark:text-mint-200 text-sm">
            Need personalized help? Our support team is available 24/7.
          </p>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-charcoal-800 rounded-xl shadow-premium border border-mint-200 dark:border-charcoal-700 p-6"
      >
        <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {[
            { q: "How do I change my password?", a: "Go to Settings > Profile > Security to update your password." },
            { q: "Can I export my data?", a: "Yes, you can request a data export from the Privacy settings." },
            { q: "How does the matching algorithm work?", a: "Our AI analyzes your skills and interests to find the best project matches." }
          ].map((item, index) => (
            <div key={index} className="border-b border-mint-200 dark:border-charcoal-700 last:border-0 pb-4 last:pb-0">
              <h4 className="text-base font-semibold text-charcoal-900 dark:text-white mb-2">
                {item.q}
              </h4>
              <p className="text-charcoal-700 dark:text-mint-200 text-sm">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-mint-50 dark:bg-charcoal-900 p-6 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-2 capitalize">
            {tab === 'profile' ? 'Profile Settings' : tab === 'notifications' ? 'Notifications' : tab === 'billing' ? 'Billing & Subscription' : 'Help Center'}
          </h1>
          <p className="text-charcoal-700 dark:text-mint-200">
            {tab === 'profile' 
              ? 'Manage your account settings and preferences'
              : tab === 'notifications'
              ? 'Control how and when you receive updates'
              : tab === 'billing'
              ? 'Manage your subscription plan and payment methods'
              : 'Get help and support for SkillSynergy'
            }
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const isActive = tab === t.id;
            return (
              <Link
                key={t.id}
                to={`/settings/${t.id}`}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-mint-200 hover:bg-emerald-50 dark:hover:bg-charcoal-700'
                }`}
              >
                <t.icon className={`h-5 w-5 mr-2 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                <span className="font-medium">{t.label}</span>
              </Link>
            );
          })}
        </div>

        {tab === 'profile' && renderProfileSettings()}
        {tab === 'notifications' && renderNotificationSettings()}
        {tab === 'billing' && renderBillingSettings()}
        {tab === 'help' && renderHelpSettings()}
      </div>
    </div>
  );
};

export default SettingsPage;