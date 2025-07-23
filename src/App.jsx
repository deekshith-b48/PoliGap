import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import UserProfile from './components/profile/UserProfile';
import AuthCallback from './components/auth/AuthCallback';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';

// Main App Content Component (wrapped with auth context)
function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (path === '/auth/callback') {
      setCurrentPage('auth-callback');
    } else if (path === '/dashboard' && user) {
      setCurrentPage('dashboard');
    } else if (path === '/admin' && user && isAdmin()) {
      setCurrentPage('admin');
    } else if (path === '/profile' && user) {
      setCurrentPage('profile');
    } else if (path === '/analyzer') {
      setCurrentPage('analyzer');
    } else if (path === '/generator') {
      setCurrentPage('generator');
    } else if (path === '/compliances') {
      setCurrentPage('compliances');
    } else if (path === '/assessment') {
      setCurrentPage('assessment');
    } else {
      setCurrentPage('home');
    }
  }, [user, isAdmin]);

  const navigate = (page) => {
    setCurrentPage(page);
    
    // Update URL without page reload
    const routes = {
      home: '/',
      dashboard: '/dashboard',
      admin: '/admin',
      profile: '/profile',
      analyzer: '/analyzer',
      generator: '/generator',
      compliances: '/compliances',
      assessment: '/assessment',
    };
    
    if (routes[page]) {
      window.history.pushState({}, '', routes[page]);
    }
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-blue/10">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading POLIGAP</h2>
          <p className="text-gray-600">Preparing your policy compliance platform...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigate} />;
      case 'dashboard':
        return user ? <UserDashboard onNavigate={navigate} /> : <LandingPage onNavigate={navigate} />;
      case 'admin':
        return user && isAdmin() ? <AdminDashboard onNavigate={navigate} /> : <LandingPage onNavigate={navigate} />;
      case 'profile':
        return user ? <UserProfile onNavigate={navigate} /> : <LandingPage onNavigate={navigate} />;
      case 'analyzer':
        return <PolicyAnalyzer onNavigate={navigate} onDocumentUpload={handleDocumentUpload} />;
      case 'generator':
        return <PolicyGenerator onNavigate={navigate} />;
      case 'compliances':
        return <KnowCompliances onNavigate={navigate} />;
      case 'assessment':
        return <RiskAssessment onNavigate={navigate} />;
      case 'auth-callback':
        return <AuthCallback />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <main className="relative">
        {renderPage()}
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
      <ChatExpert
        policyDocument={uploadedDocument}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

// Main App Component with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
