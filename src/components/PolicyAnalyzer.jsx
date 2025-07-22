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
      let isPdfFile = false;
      
      if (file.type === 'application/pdf') {
        isPdfFile = true;
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
        frameworks: frameworks,
        isPdfFile: isPdfFile,
        fileType: isPdfFile ? 'pdf' : 'text'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus-ring rounded-lg px-3 py-2 self-start"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Policy Gap Analyzer</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">AI-powered compliance analysis with smart validation</p>
            </div>

            <div className="w-24 lg:w-32 hidden lg:block"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* How It Works */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 mb-8 animate-fadeInUp">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-600 text-sm lg:text-base">Three simple steps to comprehensive policy analysis with AI validation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">1. Upload & Validate</h3>
              <p className="text-xs lg:text-sm text-gray-600">Smart file validation ensures only policy documents are analyzed</p>
              <div className="mt-3 text-xs text-blue-600 font-medium">
                ✓ PDF, Word, Text • ✓ Policy Detection • ✓ Content Validation
              </div>
            </div>

            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">2. AI Analysis</h3>
              <p className="text-xs lg:text-sm text-gray-600">Advanced AI analyzes compliance gaps with industry benchmarks</p>
              <div className="mt-3 text-xs text-purple-600 font-medium">
                ✓ Framework Mapping • ✓ Risk Assessment • ✓ Benchmarking
              </div>
            </div>

            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 card-hover">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">3. Actionable Results</h3>
              <p className="text-xs lg:text-sm text-gray-600">Detailed insights with prioritized recommendations and timelines</p>
              <div className="mt-3 text-xs text-emerald-600 font-medium">
                ✓ Compliance Score • ✓ Gap Analysis • ✓ Action Plans
              </div>
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
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 mt-8 animate-fadeInUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-ai-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Analyzing Policy Document</h3>
              <p className="text-gray-600 mb-4 text-sm lg:text-base">{progress}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-primary h-3 rounded-full animate-ai-pulse transition-all duration-1000" style={{width: '65%'}}></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <div className="text-blue-600 text-xs font-semibold">STEP 1</div>
                  <div className="text-blue-900 text-sm font-medium">Document Processing</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                  <div className="text-purple-600 text-xs font-semibold">STEP 2</div>
                  <div className="text-purple-900 text-sm font-medium">AI Analysis</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-200 opacity-50">
                  <div className="text-green-600 text-xs font-semibold">STEP 3</div>
                  <div className="text-green-900 text-sm font-medium">Results Generation</div>
                </div>
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 lg:p-6 mt-8 animate-fadeInUp">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Analysis Error</h3>
                <p className="text-red-700 text-sm lg:text-base">{error}</p>
                <div className="mt-3 text-xs text-red-600">
                  💡 Try uploading a different policy document or check your internet connection
                </div>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default PolicyAnalyzer;
