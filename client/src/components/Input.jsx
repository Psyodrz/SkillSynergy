import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  className = '',
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-navy-700 dark:text-warm-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <motion.div
        className="relative"
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            dark:bg-charcoal-800 dark:border-teal-600 dark:text-white dark:placeholder-teal-400
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-teal-300'}
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
          {...props}
        />
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
