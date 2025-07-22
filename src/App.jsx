import { useState } from 'react';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import Pricing from './components/Pricing';
import Resources from './components/Resources';
import Frameworks from './components/Frameworks';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigate} />;
      case 'analyzer':
        return <PolicyAnalyzer onNavigate={navigate} onDocumentUpload={handleDocumentUpload} />;
      case 'generator':
        return <PolicyGenerator onNavigate={navigate} />;
      case 'compliances':
        return <KnowCompliances onNavigate={navigate} />;
      case 'assessment':
        return <RiskAssessment onNavigate={navigate} />;
      case 'pricing':
        return <Pricing onNavigate={navigate} />;
      case 'resources':
        return <Resources onNavigate={navigate} />;
      case 'frameworks':
        return <Frameworks onNavigate={navigate} />;
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

export default App;
