import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import DocumentHistory from './components/DocumentHistory';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <main className="relative">
        <Routes>
          <Route
            path="/"
            element={
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
          {/* Fallback to home page for any unmatched routes */}
          <Route
            path="*"
            element={<LandingPage onNavigate={handleNavigate} />}
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
      <ChatExpert
        policyDocument={uploadedDocument}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={handleChatClose}
        initialQuery={searchQuery}
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
      <DocumentHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onDocumentSelect={(doc) => {
          console.log('Selected document:', doc);
          // Navigate to analysis results
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
