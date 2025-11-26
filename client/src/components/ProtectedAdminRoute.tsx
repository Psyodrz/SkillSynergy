import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// List of authorized admin emails
// TODO: Add your email here to grant admin access
const ADMIN_EMAILS = [
  'aditya.s70222@gmail.com',
  'Adisrivastav23@gmail.com'
];

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-charcoal-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // 1. Must be logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Must be an admin
  // Normalize emails to lowercase for comparison
  const userEmail = user.email?.toLowerCase();
  const allowedEmails = ADMIN_EMAILS.map(email => email.toLowerCase());
  
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-charcoal-950 px-4">
        <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-200 dark:border-charcoal-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You do not have permission to view this page. This area is restricted to administrators only.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
