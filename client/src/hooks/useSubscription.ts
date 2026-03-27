import { useAuth } from '../context/AuthContext';
import { subscriptionPlans } from '../data/plans';

export const useSubscription = () => {
  const { profile } = useAuth();

  const currentPlanId = profile?.subscription_plan || 'free';
  const planDetails = subscriptionPlans.find(p => p.id === currentPlanId) || subscriptionPlans[0];

  const isPro = currentPlanId === 'pro' || currentPlanId === 'elite';
  const isElite = currentPlanId === 'elite';

  // Feature: Project Creation Limit
  // Free: 1 project, Pro/Elite: unlimited
  const canCreateProject = (currentProjectCount: number) => {
    if (isPro) return true;
    return currentProjectCount < 1;
  };

  // Feature: AI Smart Match
  // Free: limited, Pro: 100/mo, Elite: unlimited
  const canUseAIMatch = (currentUsageCount: number) => {
    if (isElite) return true;
    if (isPro) return currentUsageCount < 100;
    return currentUsageCount < 5; // Free tier limit
  };

  // Feature: Priority Teacher Matching
  const hasPriorityMatching = isPro;

  // Feature: Verified Badge
  const hasVerifiedBadge = isPro;

  // Feature: Dedicated Support
  const hasDedicatedSupport = isElite;

  return {
    currentPlanId,
    planDetails,
    isPro,
    isElite,
    canCreateProject,
    canUseAIMatch,
    hasPriorityMatching,
    hasVerifiedBadge,
    hasDedicatedSupport
  };
};
