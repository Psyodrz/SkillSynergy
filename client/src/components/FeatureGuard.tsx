import React from 'react';


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
  children 
}) => {
  // Subscription system is currently disabled/refactored.
  // Always allowing access for now.
  return <>{children}</>;
};
