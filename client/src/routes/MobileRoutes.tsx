import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { Capacitor } from '@capacitor/core';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/DashboardNavbar';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import DiscoverPage from '../pages/DiscoverPage';
import InstructorsPage from '../pages/InstructorsPage';
import MessagesPage from '../pages/MessagesPage';
import OnboardingPage from '../pages/OnboardingPage';
import ProjectsPage from '../pages/ProjectsPage';
import CreateProjectPage from '../pages/CreateProjectPage';
import ProfilePage from '../pages/ProfilePage';
import RequestsPage from '../pages/RequestsPage';
import SettingsPage from '../pages/SettingsPage';
import NotificationsPage from '../pages/NotificationsPage';
import AIChatPage from '../pages/AIChatPage'; // Import relevant pages
import SkillRoomPage from '../pages/SkillRoomPage';
import ChallengePage from '../pages/ChallengePage';
import TaskDetailPage from '../pages/TaskDetailPage';
import MySkillsPage from '../pages/MySkillsPage';
import MyProjectsPage from '../pages/MyProjectsPage';
import DiscoverProjectsPage from '../pages/DiscoverProjectsPage';
import { useAuth } from '../context/AuthContext';
import { useOnboardingGuard } from '../hooks/useOnboardingGuard';
import SplashScreen from '../components/SplashScreen';
// import { CapacitorUpdater } from '@capgo/capacitor-updater';

// import { useUpdateCheck } from '../hooks/useUpdateCheck';

// Placeholder for the hook we will create next
import { useMobileNotifications } from '../hooks/useMobileNotifications';

function MobileRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useMobileNotifications();
  // useUpdateCheck();
  
  // Minimal OTA Logic - Commented out due to build conflict with RR7
  /*
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
        // CapacitorUpdater.notifyAppReady();
    }
  }, []);
  */

  console.log('MobileRoutes Render. Auth:', isAuthenticated, 'Loading:', loading);

  const { loading: guardLoading } = useOnboardingGuard();

  // If Auth is still loading, show a native-like splash or spinner
  // This prevents the "Login" screen from flashing before redirecting to "Dashboard"
  if (loading || guardLoading) {
    return <SplashScreen />;
  }

  // Mobile App Layout Logic
  // We likely want the Sidebar/Navbar for authenticated users
  // But strictly NO public landing pages logic
  const showSidebar = isAuthenticated; 

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-mint-100 transition-colors duration-300">
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}
        
        <main className={`flex-1 ${showSidebar ? '' : ''} transition-all duration-300 flex flex-col`}>
          {showSidebar && (
            <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />
          )}
          
          <div className="flex-1">
            <Routes>
              {/* Entry Point Logic */}
              <Route path="/" element={
                 isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              } />

              {/* Login is the only "Public" page allowed in the App flow (besides /signup if separate) */}
              <Route path="/login" element={
                 isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } />

              {/* Protected Routes - Same as Web, but focused */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              <Route path="/discover" element={
                <ProtectedRoute>
                  <DiscoverPage />
                </ProtectedRoute>
              } />
              <Route path="/instructors" element={
                 <ProtectedRoute>
                  <InstructorsPage />
                 </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />

               {/* Messages Detail */}
               <Route path="/messages/:id" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />

              <Route path="/ai-chat/:skillId" element={
                <ProtectedRoute>
                  <AIChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/skill/:skillId/room" element={
                <ProtectedRoute>
                  <SkillRoomPage />
                </ProtectedRoute>
              } />

               {/* Project Routes */}
               <Route path="/app/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/projects/create" element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              } />
              
               {/* Challenge & Tasks */}
               <Route path="/challenge/:projectId" element={
                <ProtectedRoute>
                  <ChallengePage />
                </ProtectedRoute>
              } />
              <Route path="/challenge/:projectId/task/:taskId" element={
                <ProtectedRoute>
                  <TaskDetailPage />
                </ProtectedRoute>
              } />

               {/* New Feature Routes */}
               <Route path="/app/my-skills" element={
                <ProtectedRoute>
                  <MySkillsPage />
                </ProtectedRoute>
              } />
               <Route path="/app/my-projects" element={
                <ProtectedRoute>
                  <MyProjectsPage />
                </ProtectedRoute>
              } />
               <Route path="/app/discover-projects" element={
                <ProtectedRoute>
                  <DiscoverProjectsPage />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/requests" element={
                <ProtectedRoute>
                  <RequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/settings/:tab?" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />

              {/* Fallback - Send to dashboard if unknown, NOT landing page */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MobileRoutes;
