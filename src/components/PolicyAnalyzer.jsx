import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EnhancedDocumentUpload from './EnhancedDocumentUpload';
import AnalysisResultsRevamped from './AnalysisResultsRevamped';
import { analyzeDocument } from '../lib/gemini';
import { nlpProcessor } from '../lib/nlpProcessor';
import { extractText, validateFile, getFileInfo } from '../lib/documentParser';
import EnhancedComplianceAnalyzer from '../lib/enhancedComplianceAnalyzer';

function PolicyAnalyzer({ onNavigate, onDocumentUpload, onAuthOpen, onProfileOpen, onHistoryOpen }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [documentInfo, setDocumentInfo] = useState(null);
  const { user } = useAuth();

  // Document extraction is now handled by the advanced DocumentParser

  const handleFileUpload = async (uploadData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const { file, industry, frameworks } = uploadData;

      // Validate file before processing
      validateFile(file);

      // Get detailed file information
      const fileInfo = getFileInfo(file);

      const docInfo = {
        file,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date(),
        industry,
        frameworks,
        size: file.size,
        ...fileInfo
      };

      setDocumentInfo(docInfo);

      if (onDocumentUpload) {
        onDocumentUpload(docInfo);
      }

      setProgress('📄 Extracting text from document...');

      // Use advanced document parser
      const text = await extractText(file);

      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in the document');
      }

      // ✅ ENHANCED COMPLIANCE ANALYSIS WITH ADVANCED AI
      setProgress('🤖 Running enhanced compliance analysis...');
      let analysisResult;
      
      try {
        // Initialize enhanced analyzer
        const enhancedAnalyzer = new EnhancedComplianceAnalyzer();
        
        // Primary enhanced analysis
        analysisResult = await enhancedAnalyzer.analyzePolicy(text, {
          industry,
          frameworks,
          documentInfo: docInfo
        });
        
        setProgress('🧠 Applying AI analysis and validation...');
        
        // Combine with AI analysis for additional insights
        try {
          const aiAnalysis = await analyzeDocument(text, {
            industry,
            frameworks,
            documentInfo: docInfo
          });
          
          // Merge AI insights with enhanced analysis
          analysisResult = {
            ...analysisResult,
            aiInsights: aiAnalysis,
            summary: aiAnalysis?.summary || analysisResult.summary,
            documentInfo: docInfo
          };
        } catch (aiError) {
          console.warn('AI analysis failed, using enhanced analysis only:', aiError);
        }
        
        // Apply NLP enhancements if available
        if (analysisResult) {
          try {
            setProgress('🔬 Applying NLP processing...');
            const nlpEnhancements = await nlpProcessor.enhanceAnalysis(analysisResult, text);
            analysisResult = {
              ...analysisResult,
              ...nlpEnhancements,
              nlpAnalysis: nlpEnhancements
            };
          } catch (nlpError) {
            console.warn('NLP enhancement failed, using base analysis:', nlpError);
          }
        }
      } catch (analysisError) {
        console.error('Enhanced analysis failed:', analysisError);
        
        // Fallback to traditional analysis methods
        setProgress('⚠️ Using fallback analysis method...');
        try {
          analysisResult = await analyzeDocument(text, {
            industry,
            frameworks,
            documentInfo: docInfo
          });
        } catch (fallbackError) {
          // Ultimate fallback to NLP-only analysis
          analysisResult = await nlpProcessor.fallbackAnalysis(text, {
            industry,
            frameworks,
            documentInfo: docInfo
          });
        }
      }

      // Ensure we have a valid analysis result
      if (!analysisResult) {
        throw new Error('Failed to generate analysis results');
      }

      // Add processing metadata
      const enhancedResults = {
        ...analysisResult,
        documentInfo: docInfo,
        processingTime: Date.now() - docInfo.uploadDate.getTime(),
        analysisVersion: '2.0',
        enhancedFeatures: true
      };

      setAnalysis(enhancedResults);
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

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setDocumentInfo(null);
    setError(null);
    setProgress('');
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
              <p className="text-gray-600 mt-1 text-sm lg:text-base">AI-powered compliance analysis with enhanced accuracy</p>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <button
                    onClick={onHistoryOpen}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden lg:inline">History</span>
                  </button>
                  <button
                    onClick={onProfileOpen}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:inline">Profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onAuthOpen('signin')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <EnhancedDocumentUpload
            onFileUpload={handleFileUpload}
            loading={loading}
            error={error}
            progress={progress}
            onAuthOpen={onAuthOpen}
          />
        ) : (
          <AnalysisResultsRevamped
            analysis={analysis}
            documentInfo={documentInfo}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </div>
    </div>
  );
}

export default PolicyAnalyzer;
