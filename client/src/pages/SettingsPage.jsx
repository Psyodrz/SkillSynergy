import React, { useState, useEffect } from 'react';
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
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

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
      timezone: 'UTC+5:30',
      dateFormat: 'DD/MM/YYYY'
    }
  });
  
  // Settings save status
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 2FA state
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', user.id)
          .single();
        
        if (data?.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.settings,
            notifications: { ...prev.notifications, ...(data.settings.notifications || {}) },
            privacy: { ...prev.privacy, ...(data.settings.privacy || {}) },
            preferences: { ...prev.preferences, ...(data.settings.preferences || {}) }
          }));
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, [user?.id]);

  // Auto-save settings when they change (after initial load)
  useEffect(() => {
    if (!settingsLoaded || !user?.id) return;

    const saveSettings = async () => {
      setSavingSettings(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ settings: settings })
          .eq('id', user.id);
        
        if (!error) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        }
      } catch (err) {
        console.error('Error saving settings:', err);
      } finally {
        setSavingSettings(false);
      }
    };

    // Debounce save
    const timeoutId = setTimeout(saveSettings, 500);
    return () => clearTimeout(timeoutId);
  }, [settings, settingsLoaded, user?.id]);

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

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle 2FA info
  const handle2FAClick = () => {
    setShow2FAModal(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
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
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="bn">Bengali</option>
              <option value="mr">Marathi</option>
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
              <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
              <option value="UTC+0">UTC / GMT</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
              <option value="UTC+8">Singapore/China (UTC+8)</option>
              <option value="UTC+9">Japan Standard Time (UTC+9)</option>
              <option value="UTC+5:45">Nepal Time (UTC+5:45)</option>
              <option value="UTC+6">Bangladesh Time (UTC+6)</option>
              <option value="UTC+4">Gulf Standard Time (UTC+4)</option>
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
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-mint-50 dark:bg-charcoal-700 rounded-lg">
            <div>
              <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-sm text-charcoal-600 dark:text-mint-300">
                Update your password to keep your account secure
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordModal(true)}
            >
              Update
            </Button>
          </div>
          
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-mint-50 dark:bg-charcoal-700 rounded-lg">
            <div>
              <h3 className="text-lg font-medium text-charcoal-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-charcoal-600 dark:text-mint-300">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handle2FAClick}
            >
              Learn More
            </Button>
          </div>
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
            {tab === 'profile' ? 'Profile Settings' : tab === 'notifications' ? 'Notifications' : 'Help Center'}
          </h1>
          <p className="text-charcoal-700 dark:text-mint-200">
            {tab === 'profile' 
              ? 'Manage your account settings and preferences'
              : tab === 'notifications'
              ? 'Control how and when you receive updates'
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
        {tab === 'help' && renderHelpSettings()}
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError('');
          setPasswordSuccess(false);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        title="Change Password"
      >
        <div className="space-y-4">
          {passwordSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircleIcon className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white">
                Password Updated Successfully!
              </h3>
              <p className="text-charcoal-600 dark:text-mint-300 text-center">
                Your password has been changed.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full p-3 border border-mint-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 dark:text-mint-200 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full p-3 border border-mint-200 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400 text-sm">{passwordError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 2FA Info Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Two-Factor Authentication"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <ShieldCheckIcon className="h-10 w-10 text-amber-500" />
            <div>
              <h3 className="font-semibold text-charcoal-900 dark:text-white">
                Coming Soon!
              </h3>
              <p className="text-sm text-charcoal-600 dark:text-mint-300">
                Two-Factor Authentication is currently being developed.
              </p>
            </div>
          </div>
          
          <p className="text-charcoal-700 dark:text-mint-200">
            Two-Factor Authentication (2FA) adds an extra layer of security by requiring a verification code in addition to your password when signing in.
          </p>
          
          <div className="bg-mint-50 dark:bg-charcoal-700 rounded-lg p-4">
            <h4 className="font-medium text-charcoal-900 dark:text-white mb-2">
              What to expect:
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-600 dark:text-mint-300">
              <li>• Authenticator app support (Google Authenticator, Authy)</li>
              <li>• SMS verification as backup</li>
              <li>• Recovery codes for emergencies</li>
            </ul>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => setShow2FAModal(false)}
          >
            Got it!
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;