export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number; // in INR
  yearlyPrice: number;  // in INR
  description: string;
  features: string[];
  recommended?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Basic Plan',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for starters exploring the platform.',
    features: [
      'Create 1 Project',
      'Basic Skill Matching',
      'Community Access',
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    monthlyPrice: 499,
    yearlyPrice: 4990, // ~2 months free
    description: 'Unlock the full potential of SkillSynergy with advanced features.',
    features: [
      'Unlimited Project Creation',
      'AI Smart Match (+100/mo)',
      'Priority Teacher Matching',
      'Verified Badge',
      'Advanced Analytics'
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Elite Plan',
    monthlyPrice: 999,
    yearlyPrice: 9999, // ~2 months free
    description: 'The ultimate package for organizations and super-learners.',
    features: [
      'Everything in Pro',
      'Unlimited AI Smart Match',
      'Dedicated Support',
      'Team Matchmaking',
      'Custom Skill Tags'
    ]
  }
];
