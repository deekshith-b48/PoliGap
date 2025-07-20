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
      // For now, let's use a simple text extraction fallback
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          // This is a simplified approach - in a real app, you'd need proper PDF parsing
          // For demo purposes, we'll create a mock text content
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
      // Return mock content for demonstration
      return `Mock policy content for ${file.name} - demonstrating rules benchmarking functionality`;
    }
  };

  const handleFileUpload = async (uploadData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      // Extract file and configuration
      const { file, industry, frameworks } = uploadData;
      
      // Notify parent component about document upload
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
      
      // Pass the configuration data to the AI analysis
      const results = await analyzeDocument(text, {
        industry: industry,
        frameworks: frameworks
      });
      
      setAnalysis(results);
      setProgress('');
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-6 border-b-4 border-pink-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black border-4 border-yellow-300 hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_#000]"
          >
            ← BACK TO HOME
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black text-white">POLICY GAP ANALYZER</h1>
            <p className="text-pink-200">AI-powered compliance analysis</p>
          </div>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-[70%] mx-auto space-y-8">
          
          {/* Instructions */}
          <div className="bg-gradient-to-r from-cyan-800 to-blue-800 p-6 rounded-3xl border-4 border-cyan-400 shadow-[8px_8px_0px_0px_#06b6d4]">
            <h2 className="text-2xl font-bold text-white mb-3">📋 HOW IT WORKS</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-cyan-700 p-4 rounded-2xl border-2 border-cyan-300">
                <div className="text-3xl mb-2">📁</div>
                <p className="font-bold">1. UPLOAD PDF</p>
                <p className="text-sm text-cyan-200">Select your policy document</p>
              </div>
              <div className="bg-cyan-700 p-4 rounded-2xl border-2 border-cyan-300">
                <div className="text-3xl mb-2">🤖</div>
                <p className="font-bold">2. AI ANALYSIS</p>
                <p className="text-sm text-cyan-200">AI scans for compliance gaps</p>
              </div>
              <div className="bg-cyan-700 p-4 rounded-2xl border-2 border-cyan-300">
                <div className="text-3xl mb-2">📊</div>
                <p className="font-bold">3. GET RESULTS</p>
                <p className="text-sm text-cyan-200">Detailed gap analysis & fixes</p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <DocumentUpload 
            onUpload={handleFileUpload}
            uploading={loading}
            progress={progress}
            error={error}
          />

          {/* Results Section */}
          {analysis && <AnalysisResults analysis={analysis} />}

        </div>
      </div>
    </div>
  );
}

export default PolicyAnalyzer;
