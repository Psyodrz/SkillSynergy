import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useOnboardingGuard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If not logged in, stop checking (let ProtectedRoute handle auth)
    if (!user) {
      setIsChecking(false);
      return;
    }

    const checkGuard = async () => {
      const path = location.pathname;

      // 1. Admin Bypass
      // If URL starts with /admin, allow access regardless of onboarding status
      if (path.startsWith('/admin')) {
        setIsChecking(false);
        return;
      }

      // If user has admin role, allow access (optional, but good for UX)
      // Check both profile role and metadata role
      const isAdmin = 
        profile?.role === 'admin' || 
        user.user_metadata?.role === 'admin' ||
        (typeof profile?.role === 'string' && profile.role.toLowerCase().includes('admin'));

      if (isAdmin) {
        setIsChecking(false);
        return;
      }

      // 2. Onboarding Route Bypass
      // If already on onboarding, don't redirect again
      if (path.startsWith('/onboarding')) {
        setIsChecking(false);
        return;
      }

      // 3. Check Onboarding Completion
      // Primary source: user_metadata (fast, set on finish)
      // Secondary source: profile (if we decide to store it there later, currently relying on metadata)
      const isCompleted = user.user_metadata?.onboarding_completed === true;

      if (!isCompleted) {
        // Redirect to onboarding
        // Using replace to prevent back-button loops
        navigate('/onboarding', { replace: true });
      }

      setIsChecking(false);
    };

    checkGuard();

  }, [user, profile, authLoading, location.pathname, navigate]);

  return { loading: authLoading || isChecking };
};
