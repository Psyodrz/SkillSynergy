import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Learner'>('Learner');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // REAL LOGIN with Supabase
        const result = await signIn(email, password);

        if (result.success) {
          console.log('Login successful');
          navigate('/dashboard');
        } else {
          if (result.error?.includes('Email not confirmed')) {
            setError('Please confirm your email address before logging in. Check your inbox.');
          } else {
            setError(result.error || 'Invalid credentials. Please try again.');
          }
          setLoading(false);
        }
      } else {
        // REAL SIGNUP with Supabase
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const result = await signUp(email, password, fullName, role);

        if (result.success) {
          setSuccessMessage('Account created! Please check your email to confirm your account before logging in.');
          setIsLogin(true); // Switch to login mode
          setLoading(false);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative min-h-screen w-full overflow-hidden
        bg-mint-50 dark:bg-charcoal-900
        font-sans transition-colors duration-500
        flex items-center justify-center
      "
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back to Home Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mb-6 flex items-center space-x-2 text-charcoal-600 dark:text-mint-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          {/* Login/Signup Card */}
          <motion.div
            layout
            className="
              relative p-8 rounded-3xl
              bg-white dark:bg-charcoal-800
              shadow-premium-emerald
              border border-mint-200 dark:border-charcoal-700
            "
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
              >
                <SparklesIcon className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-black text-charcoal-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Join SkillSynergy'}
              </h1>
              <p className="text-charcoal-600 dark:text-mint-200">
                {isLogin
                  ? 'Sign in to continue your journey'
                  : 'Create your account and start learning'}
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field (Signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-charcoal-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-charcoal-400 dark:text-mint-400" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required={!isLogin}
                        placeholder="John Doe"
                        className="
                          w-full pl-12 pr-4 py-3 rounded-xl
                          border border-mint-200 dark:border-charcoal-600
                          bg-white dark:bg-charcoal-900
                          text-charcoal-900 dark:text-white
                          placeholder:text-charcoal-400 dark:placeholder:text-mint-500
                          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                          transition-all
                        "
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-charcoal-900 dark:text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-charcoal-400 dark:text-mint-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="
                      w-full pl-12 pr-4 py-3 rounded-xl
                      border border-mint-200 dark:border-charcoal-600
                      bg-white dark:bg-charcoal-900
                      text-charcoal-900 dark:text-white
                      placeholder:text-charcoal-400 dark:placeholder:text-mint-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all
                    "
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-charcoal-900 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-charcoal-400 dark:text-mint-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="
                      w-full pl-12 pr-12 py-3 rounded-xl
                      border border-mint-200 dark:border-charcoal-600
                      bg-white dark:bg-charcoal-900
                      text-charcoal-900 dark:text-white
                      placeholder:text-charcoal-400 dark:placeholder:text-mint-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-charcoal-400 dark:text-mint-400 hover:text-charcoal-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-semibold text-charcoal-900 dark:text-white mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-charcoal-400 dark:text-mint-400" />
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        placeholder="••••••••"
                        className="
                          w-full pl-12 pr-4 py-3 rounded-xl
                          border border-mint-200 dark:border-charcoal-600
                          bg-white dark:bg-charcoal-900
                          text-charcoal-900 dark:text-white
                          placeholder:text-charcoal-400 dark:placeholder:text-mint-500
                          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                          transition-all
                        "
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="
                  w-full py-4 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-teal-500
                  hover:from-emerald-600 hover:to-teal-600
                  text-white font-bold
                  shadow-emerald-glow
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2
                "
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </motion.button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMessage('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
                }}
                className="
                  text-sm
                  text-charcoal-600 dark:text-mint-300
                  hover:text-emerald-600 dark:hover:text-emerald-400
                  font-medium transition-colors
                "
              >
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Sign In
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
