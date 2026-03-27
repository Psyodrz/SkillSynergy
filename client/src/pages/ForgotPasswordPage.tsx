import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset link. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-mint-50 dark:bg-charcoal-900 font-sans transition-colors duration-500 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="mb-6 flex items-center space-x-2 text-charcoal-600 dark:text-mint-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Login</span>
          </motion.button>

          <motion.div className="relative p-8 rounded-3xl bg-white dark:bg-charcoal-800 shadow-premium-emerald border border-mint-200 dark:border-charcoal-700">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
              >
                <SparklesIcon className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-black text-charcoal-900 dark:text-white mb-2">Reset Password</h1>
              <p className="text-charcoal-600 dark:text-mint-200">
                {success 
                  ? "Check your inbox! We've sent you a secure reset link." 
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-charcoal-400 dark:text-mint-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-mint-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-emerald-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/login')}
                className="w-full py-4 rounded-xl border border-mint-200 dark:border-charcoal-700 text-charcoal-600 dark:text-mint-300 font-bold hover:bg-mint-50 dark:hover:bg-charcoal-700 transition-all duration-300"
              >
                Return to Login
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
