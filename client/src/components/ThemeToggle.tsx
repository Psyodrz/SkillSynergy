import React from 'react'
import { motion } from 'framer-motion'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-mint-100 dark:bg-charcoal-800 hover:bg-mint-200 dark:hover:bg-charcoal-700 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <SunIcon className="h-5 w-5 text-emerald-500" />
        ) : (
          <MoonIcon className="h-5 w-5 text-teal-500" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle
