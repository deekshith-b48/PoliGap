import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';

// Wrapper component to handle navigation and shared state
function AppContent() {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
            element={<LandingPage onNavigate={handleNavigate} onSearch={handleSearch} />} 
          />
          <Route 
            path="/analyzer" 
            element={
              <PolicyAnalyzer 
                onNavigate={handleNavigate} 
                onDocumentUpload={handleDocumentUpload} 
              />
            } 
          />
          <Route 
            path="/generator" 
            element={<PolicyGenerator onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/compliances" 
            element={<KnowCompliances onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/assessment" 
            element={<RiskAssessment onNavigate={handleNavigate} />} 
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
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
