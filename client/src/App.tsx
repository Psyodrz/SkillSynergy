import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/DashboardNavbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import MessagesPage from './pages/MessagesPage';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import PlansPage from './pages/PlansPage';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Check if current route is a public route (home or login)
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';
  const showSidebar = isAuthenticated && !isPublicRoute;

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
          
          <div className="flex-1 px-6 py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/discover" element={
                <ProtectedRoute>
                  <DiscoverPage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/messages/:id" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/projects/create" element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/my-projects" element={
                <ProtectedRoute>
                  <MyProjectsPage />
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
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/plans" element={
                <ProtectedRoute>
                  <PlansPage />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
