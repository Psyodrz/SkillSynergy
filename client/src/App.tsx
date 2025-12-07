import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/DashboardNavbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import InstructorsPage from './pages/InstructorsPage';
import MessagesPage from './pages/MessagesPage';
import OnboardingPage from './pages/OnboardingPage';
import { useOnboardingGuard } from './hooks/useOnboardingGuard';
import ProjectsPage from './pages/ProjectsPage'; // This is the dashboard projects page
import CreateProjectPage from './pages/CreateProjectPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import FAQPage from './pages/FAQPage';
import ConnectPage from './pages/ConnectPage';
import LearnPage from './pages/LearnPage';
import ProjectFeaturePage from './pages/ProjectFeaturePage';
import ChatPage from './pages/ChatPage';
import DemoPage from './pages/DemoPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import MySkillsPage from './pages/MySkillsPage';
import MyProjectsPage from './pages/MyProjectsPage';
import DiscoverProjectsPage from './pages/DiscoverProjectsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Check if current route is a public route
  const publicRoutes = [
    '/', '/login', '/terms', '/privacy', '/refund', '/about', '/contact',
    '/cookies', '/faq', '/connect', '/learn', '/projects', '/chat', '/demo', '/blog'
  ];
  // Helper to check if path starts with public route (for dynamic routes like /blog/:slug)
  const isPublicRoute = publicRoutes.some(route => location.pathname === route) || location.pathname.startsWith('/blog/');
  
  const showSidebar = isAuthenticated && !isPublicRoute && location.pathname !== '/onboarding';

  const { loading: guardLoading } = useOnboardingGuard();

  if (guardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mint-50 dark:bg-charcoal-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

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
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/faq" element={<FAQPage />} />
              
              {/* Feature Pages */}
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/projects" element={<ProjectFeaturePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/demo" element={<DemoPage />} />
              
              {/* Blog */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              
              {/* Protected Routes */}
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
              <Route path="/messages/:id" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              
              {/* Renamed internal projects route to avoid conflict with public page */}
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

              
              {/* Admin Panel - Separate Interface */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminPanelPage />
                </ProtectedAdminRoute>
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
