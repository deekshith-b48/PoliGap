import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ModernLandingWorkflow({ onAuthOpen }) {
  const [currentStep, setCurrentStep] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisPreview, setAnalysisPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { id: 'upload', title: 'Upload Document', icon: '📄', completed: !!uploadedFile },
    { id: 'preview', title: 'Preview & Configure', icon: '👁️', completed: false },
    { id: 'analyze', title: 'AI Analysis', icon: '🤖', completed: false }
  ];

  const validateFile = useCallback((file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF, Word, and text files are supported' };
    }

    return { valid: true };
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        setUploadedFile(file);
        setCurrentStep('preview');
      } else {
        alert(validation.error);
      }
    }
  }, [validateFile]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        setUploadedFile(file);
        setCurrentStep('preview');
      } else {
        alert(validation.error);
      }
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analyze');
    
    // Simulate API call with progressive updates
    const stages = [
      { progress: 20, message: 'Extracting document content...' },
      { progress: 45, message: 'Analyzing compliance frameworks...' },
      { progress: 70, message: 'Identifying policy gaps...' },
      { progress: 90, message: 'Generating recommendations...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Update progress UI here if needed
    }

    // Mock analysis results
    setAnalysisPreview({
      overallScore: 85,
      frameworkScores: {
        'GDPR': 88,
        'HIPAA': 82,
        'CCPA': 90
      },
      criticalGaps: 3,
      recommendations: 12,
      riskLevel: 'Medium'
    });

    setIsAnalyzing(false);
  };

  const handleStartAnalysis = () => {
    if (!user) {
      onAuthOpen('signup');
      return;
    }
    
    // Navigate to full analyzer with uploaded file
    navigate('/analyzer', { state: { uploadedFile } });
  };

  const handleDemoAnalysis = () => {
    simulateAnalysis();
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Try Our AI-Powered Compliance Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a policy document and see how our AI identifies compliance gaps in real-time
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep === step.id 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : step.completed 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  <span className="text-xl">{step.icon}</span>
                  {step.completed && currentStep !== step.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-8 w-16 h-0.5 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="p-8">
              <div
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Drop your policy document here
                </h3>
                <p className="text-gray-600 mb-6">
                  or click to browse files
                </p>
                
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Choose File
                </label>
                
                <p className="text-sm text-gray-500 mt-4">
                  Supports PDF, Word documents, and text files up to 10MB
                </p>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && uploadedFile && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* File Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Document Preview</h3>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{uploadedFile.name}</h4>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • {uploadedFile.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-2">File Type</h5>
                        <p className="text-sm text-gray-600">
                          {uploadedFile.type.includes('pdf') ? 'PDF Document' :
                           uploadedFile.type.includes('word') ? 'Word Document' : 'Text File'}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Status</h5>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <p className="text-sm text-green-600 font-medium">Ready for Analysis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Options */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Analysis Options</h3>
                  <div className="space-y-6">
                    {/* Demo Analysis */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">🎯</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900">Quick Demo Analysis</h4>
                          <p className="text-sm text-blue-700">Get a preview of our analysis capabilities</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDemoAnalysis}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Start Demo Analysis
                      </button>
                    </div>

                    {/* Full Analysis */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg">🚀</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Full Enterprise Analysis</h4>
                          <p className="text-sm text-gray-700">Complete analysis with export & history</p>
                        </div>
                      </div>
                      
                      {user ? (
                        <button
                          onClick={handleStartAnalysis}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                        >
                          Start Full Analysis
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">Sign up for full features:</p>
                          <button
                            onClick={() => onAuthOpen('signup')}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                          >
                            Sign Up for Full Analysis
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Step */}
          {currentStep === 'analyze' && (
            <div className="p-8">
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Document</h3>
                  <p className="text-gray-600 mb-8">Our AI is examining your policy for compliance gaps...</p>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                        <div className="text-green-600 font-semibold">✓ Content Extracted</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                        <div className="text-blue-600 font-semibold">🔄 Analyzing...</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <div className="text-gray-500">⏳ Generating Report</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : analysisPreview && (
                <div>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
                    <p className="text-gray-600">Here's a preview of your compliance analysis</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Overall Score</h4>
                      <div className="text-3xl font-bold text-blue-600">{analysisPreview.overallScore}%</div>
                      <p className="text-sm text-blue-700 mt-2">Good compliance level</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-2">Critical Gaps</h4>
                      <div className="text-3xl font-bold text-yellow-600">{analysisPreview.criticalGaps}</div>
                      <p className="text-sm text-yellow-700 mt-2">Issues to address</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Recommendations</h4>
                      <div className="text-3xl font-bold text-green-600">{analysisPreview.recommendations}</div>
                      <p className="text-sm text-green-700 mt-2">Actionable insights</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center">
                    <h4 className="text-xl font-bold mb-4">Ready for the Full Experience?</h4>
                    <p className="mb-6 opacity-90">Get detailed reports, export options, and save your analysis history</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => onAuthOpen('signup')}
                        className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Sign Up for Full Access
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStep('upload');
                          setUploadedFile(null);
                          setAnalysisPreview(null);
                        }}
                        className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                      >
                        Try Another Document
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get compliance analysis results in under 30 seconds</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">99% Accurate</h3>
            <p className="text-gray-600">AI trained on thousands of compliance frameworks</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Secure</h3>
            <p className="text-gray-600">Bank-level encryption and GDPR compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernLandingWorkflow;
