import React, { useState, useEffect } from 'react';

interface BrandLoaderProps {
  loading: boolean;
  minDisplayTime?: number; // Minimum time to show loader once visible
  delayMs?: number; // Only show loader if loading takes longer than this
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * Custom animated loading indicator using SkillSynergy's brand logo.
 * Features:
 * - Stroke-draw animation on the "S" path
 * - Subtle breathing/pulse effect
 * - 300ms delay before showing (prevents flash for quick loads)
 * - Smooth fade in/out transitions
 */
const BrandLoader: React.FC<BrandLoaderProps> = ({
  loading,
  delayMs = 300,
  className = '',
  size = 'md',
  fullScreen = true
}) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  useEffect(() => {
    let delayTimer: ReturnType<typeof setTimeout>;
    let minDisplayTimer: ReturnType<typeof setTimeout>;

    if (loading) {
      // Only show loader after delay
      delayTimer = setTimeout(() => {
        setShouldRender(true);
        // Small delay for CSS transition
        requestAnimationFrame(() => {
          setVisible(true);
        });
      }, delayMs);
    } else {
      // Fade out smoothly
      if (visible) {
        setVisible(false);
        // Keep rendered during fade out
        minDisplayTimer = setTimeout(() => setShouldRender(false), 300);
      } else {
        setShouldRender(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDisplayTimer);
    };
  }, [loading, delayMs, visible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-charcoal-950/90 backdrop-blur-sm' : 'flex items-center justify-center'}
        transition-opacity duration-300 ease-out
        ${visible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <div className={`${sizeClasses[size]} animate-brand-pulse`}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer hexagon - subtle, low opacity */}
          <path
            d="M50 5 L92 27.5 L92 72.5 L50 95 L8 72.5 L8 27.5 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-emerald-200 dark:text-emerald-900/50"
            strokeLinejoin="round"
          />
          
          {/* Inner glow circle */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-teal-300/30 dark:text-teal-600/30 animate-brand-glow"
          />
          
          {/* Animated "S" path - main feature */}
          <path
            d="M65 32 
               C65 32 60 25 50 25 
               C38 25 32 33 32 42 
               C32 50 40 55 50 55 
               C60 55 68 60 68 68 
               C68 77 60 82 50 82 
               C38 82 32 75 32 75"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-brand-stroke"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: 0
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BrandLoader;

// Export a simpler inline loader variant
export const InlineLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} animate-brand-pulse ${className}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M65 32 C65 32 60 25 50 25 C38 25 32 33 32 42 C32 50 40 55 50 55 C60 55 68 60 68 68 C68 77 60 82 50 82 C38 82 32 75 32 75"
          fill="none"
          stroke="url(#inline-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-brand-stroke"
          style={{ strokeDasharray: 200, strokeDashoffset: 0 }}
        />
        <defs>
          <linearGradient id="inline-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
