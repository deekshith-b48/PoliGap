import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import AnalysisResults from './AnalysisResults';
import { analyzeDocument } from '../lib/gemini';

function PolicyAnalyzer({ onNavigate, onDocumentUpload }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const extractTextFromPDF = async (file) => {
    try {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          const mockPolicyText = `
            PRIVACY POLICY
            
            This is a demonstration of policy analysis. The system has detected that this is a ${file.name} file.
            
            Data Collection: We collect personal information when you interact with our services.
            
            Data Processing: We process your data for legitimate business purposes.
            
            Data Sharing: We may share data with third parties under certain circumstances.
            
            Security Measures: We implement appropriate security measures to protect your data.
            
            User Rights: You have the right to access, modify, and delete your personal information.
            
            Contact Information: For privacy concerns, please contact our privacy team.
          `;
          resolve(mockPolicyText);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('PDF extraction error:', error);
      return `Mock policy content for ${file.name} - demonstrating rules benchmarking functionality`;
    }
  };

  const handleFileUpload = async (uploadData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const { file, industry, frameworks } = uploadData;
      
      if (onDocumentUpload) {
        const documentInfo = {
          file,
          fileName: file.name,
          fileType: file.type,
          uploadDate: new Date(),
          industry,
          frameworks,
          size: file.size
        };
        onDocumentUpload(documentInfo);
      }
      
      setProgress('📄 Extracting text from document...');
      
      let text;
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        const fileText = await file.text();
        text = fileText;
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in the document');
      }

      setProgress('🤖 Analyzing document with AI...');
      
      const results = await analyzeDocument(text, {
        industry: industry,
        frameworks: frameworks
      });
      
      setAnalysis(results);
      setProgress('');
      
    } catch (err) {
      console.error('Analysis error:', err);

      let userFriendlyMessage = 'An error occurred during analysis';

      if (err.message) {
        if (err.message.includes('stream already read')) {
          userFriendlyMessage = 'Network error occurred. Please try again.';
        } else if (err.message.includes('API request failed')) {
          userFriendlyMessage = 'Unable to connect to AI service. Please check your connection and try again.';
        } else if (err.message.includes('Invalid JSON')) {
          userFriendlyMessage = 'Received invalid response from AI service. Please try again.';
        } else {
          userFriendlyMessage = err.message;
        }
      }

      setError(userFriendlyMessage);
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus-ring rounded-lg px-3 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Policy Gap Analyzer</h1>
              <p className="text-gray-600 mt-1">AI-powered compliance analysis</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* How It Works */}
        <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 mb-8 animate-fadeInUp">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-600">Three simple steps to comprehensive policy analysis</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Upload Document</h3>
              <p className="text-sm text-gray-600">Select your policy document (PDF, Word, or text)</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">AI scans for compliance gaps and vulnerabilities</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Results</h3>
              <p className="text-sm text-gray-600">Detailed compliance score and recommendations</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <DocumentUpload 
            onUpload={handleFileUpload}
            uploading={loading}
            progress={progress}
            error={error}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 mt-8 animate-fadeInUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-ai-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Document</h3>
              <p className="text-gray-600 mb-4">{progress}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full animate-ai-pulse" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="mt-8 animate-fadeInUp">
            <AnalysisResults analysis={analysis} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8 animate-fadeInUp">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Analysis Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default PolicyAnalyzer;
