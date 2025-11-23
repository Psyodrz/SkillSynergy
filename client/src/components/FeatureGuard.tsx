import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface FeatureGuardProps {
  feature: 'projects_limit' | 'connections_limit';
  currentCount: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps content that should only be visible/enabled if the user is within their plan limits.
 */
export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  feature, 
  currentCount, 
  children, 
  fallback 
}) => {
  const { user } = useAuth();
  const { checkLimit, loading } = useSubscription(user?.id);

  if (loading) return <div className="animate-pulse h-10 w-full bg-gray-100 rounded"></div>;

  const isAllowed = checkLimit(feature, currentCount);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-charcoal-800 dark:border-charcoal-600">
      <div className="bg-gray-200 dark:bg-charcoal-700 p-3 rounded-full mb-3">
        <LockClosedIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        Limit Reached
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
        You've reached the {feature.replace('_', ' ')} for your current plan. Upgrade to unlock more.
      </p>
      <Link 
        to="/plans"
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        Upgrade Plan
      </Link>
    </div>
  );
};
