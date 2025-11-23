import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden 
                    bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-emerald-900 text-slate-50">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Floating skill chips */}
      <div className="absolute top-20 left-20 px-4 py-2 rounded-full bg-charcoal-900/90 border border-emerald-500/30 backdrop-blur-xl">
        <span className="text-emerald-400 text-sm font-medium">React</span>
      </div>
      <div className="absolute top-32 right-32 px-4 py-2 rounded-full bg-charcoal-900/90 border border-teal-500/30 backdrop-blur-xl">
        <span className="text-teal-400 text-sm font-medium">Design</span>
      </div>
      <div className="absolute bottom-32 left-32 px-4 py-2 rounded-full bg-charcoal-900/90 border border-emerald-500/30 backdrop-blur-xl">
        <span className="text-emerald-400 text-sm font-medium">DevOps</span>
      </div>
      <div className="absolute bottom-20 right-20 px-4 py-2 rounded-full bg-charcoal-900/90 border border-teal-500/30 backdrop-blur-xl">
        <span className="text-teal-400 text-sm font-medium">Teaching</span>
      </div>

      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-charcoal-900/90 border border-emerald-500/15 shadow-emerald-glow px-8 py-10 space-y-6 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400">
              {isLogin ? 'Sign in to your SkillSynergy account' : 'Join SkillSynergy and start collaborating'}
            </p>
          </div>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl bg-charcoal-800/80 border border-charcoal-700
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400
                           px-4 py-2.5 text-sm placeholder:text-slate-500 text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-2.5 pr-10 rounded-xl bg-charcoal-800/80 border border-charcoal-700
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400
                             text-sm placeholder:text-slate-500 text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl bg-charcoal-800/80 border border-charcoal-700
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400
                             px-4 py-2.5 text-sm placeholder:text-slate-500 text-white"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-500 focus:ring-emerald-500/50 border-charcoal-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <motion.button
                type="submit"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 
                           text-sm font-semibold py-2.5 shadow-emerald-glow hover:opacity-95 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
