import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import ChatButton from './components/ChatButton';
import EnterpriseChatExpert from './components/EnterpriseChatExpert';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import EnterpriseDocumentHistory from './components/EnterpriseDocumentHistory';
import IntegrationsPanel from './components/IntegrationsPanel';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ModernNavigation from './components/ModernNavigation';
import ConfigurationNotice from './components/ConfigurationNotice';
import { PageLoader } from './components/LoadingSpinner';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import DashboardAnalytics from './components/DashboardAnalytics';
import DashboardResources from './components/DashboardResources';
import DashboardAdminPanel from './components/DashboardAdminPanel';
import DashboardProfile from './components/DashboardProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AuthErrorBoundary from './components/AuthErrorBoundary';
import { useAuth } from './contexts/AuthContext';

// Wrapper component to handle navigation and shared state
function AppContent() {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  // Handle initial loading and auth-based redirects
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);

      // If user is logged in and on landing page, redirect to dashboard
      if (user && location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [loading, user, location.pathname, navigate]);

  // Show loading screen while initializing
  if (isLoading) {
    return <PageLoader />;
  }

  // Navigation function that uses React Router
  const handleNavigate = (page) => {
    navigate(`/${page === 'home' ? '' : page}`);
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search from navbar
  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      setIsChatOpen(true);
    }
  };

  // Reset search query when chat is closed
  const handleChatClose = () => {
    setIsChatOpen(false);
    setSearchQuery(null);
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };

  // Show different navigation based on route
  const showTopNavigation = !location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Configuration Notice */}
      <ConfigurationNotice />

      {/* Modern Navigation - only show on non-dashboard pages */}
      {showTopNavigation && (
        <ModernNavigation
          onAuthOpen={(mode) => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
          onProfileOpen={() => setIsProfileOpen(true)}
          onHistoryOpen={() => setIsHistoryOpen(true)}
          onIntegrationsOpen={() => setIsIntegrationsOpen(true)}
          onAdminOpen={() => setIsAdminOpen(true)}
          onPrivacyOpen={() => setIsPrivacyOpen(true)}
        />
      )}
      
      <main className="relative">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              user ? (
                // If logged in, don't show full landing page - redirect will happen in useEffect
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <LandingPage
                  onNavigate={handleNavigate}
                  onSearch={handleSearch}
                  onAuthOpen={(mode) => {
                    setAuthMode(mode);
                    setIsAuthModalOpen(true);
                  }}
                  onProfileOpen={() => setIsProfileOpen(true)}
                  onHistoryOpen={() => setIsHistoryOpen(true)}
                />
              )
            }
          />
          <Route
            path="/analyzer"
            element={
              <PolicyAnalyzer
                onNavigate={handleNavigate}
                onDocumentUpload={handleDocumentUpload}
                onAuthOpen={(mode) => {
                  setAuthMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onProfileOpen={() => setIsProfileOpen(true)}
                onHistoryOpen={() => setIsHistoryOpen(true)}
              />
            }
          />
          <Route
            path="/generator"
            element={
              <PolicyGenerator
                onNavigate={handleNavigate}
                onAuthOpen={(mode) => {
                  setAuthMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onProfileOpen={() => setIsProfileOpen(true)}
              />
            }
          />
          <Route
            path="/compliances"
            element={
              <KnowCompliances
                onNavigate={handleNavigate}
                onAuthOpen={(mode) => {
                  setAuthMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onProfileOpen={() => setIsProfileOpen(true)}
              />
            }
          />
          <Route
            path="/assessment"
            element={
              <RiskAssessment
                onNavigate={handleNavigate}
                onAuthOpen={(mode) => {
                  setAuthMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onProfileOpen={() => setIsProfileOpen(true)}
              />
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="resources" element={<DashboardResources />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardAdminPanel />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback to home page for any unmatched routes */}
          <Route
            path="*"
            element={
              user ? (
                // Redirect authenticated users to dashboard for unknown routes
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <LandingPage onNavigate={handleNavigate} />
              )
            }
          />
        </Routes>
      </main>

      {/* AI Chat Assistant - Enhanced styling */}
      {uploadedDocument && (
        <div className="fixed bottom-6 right-6 z-50">
          <ChatButton
            hasDocument={!!uploadedDocument}
            onClick={() => setIsChatOpen(true)}
          />
        </div>
      )}

      {/* Chat Expert Modal */}
      <EnterpriseChatExpert
        policyDocument={uploadedDocument}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={handleChatClose}
        initialQuery={searchQuery}
        analysisContext={uploadedDocument?.analysis}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Document History Modal */}
      <EnterpriseDocumentHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onDocumentSelect={(doc) => {
          console.log('Selected document:', doc);
          // Navigate to analysis results
        }}
      />

      {/* Integrations Panel */}
      <IntegrationsPanel
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </AuthErrorBoundary>
  );
}

export default App;
