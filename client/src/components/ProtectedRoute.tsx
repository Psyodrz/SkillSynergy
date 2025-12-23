import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLoader from './BrandLoader';

/**
 * ProtectedRoute Component
 * 
 * This component wraps around routes that require authentication.
 * If the user is not authenticated, they are redirected to /login.
 * 
 * Features:
 * - Shows brand loader while checking authentication
 * - Redirects to /login if not authenticated
 * - Renders children if authenticated
 * 
 * Usage:
 * ```jsx
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 * ```
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show brand loader while checking authentication status
  if (loading) {
    return <BrandLoader loading={true} />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
