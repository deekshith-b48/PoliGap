import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

function EnhancedDocumentUpload({ onUpload, uploading, progress, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationStep, setValidationStep] = useState('');
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const industries = [
    { value: 'healthcare', label: 'Healthcare', icon: '🏥', frameworks: ['HIPAA', 'HITECH'] },
    { value: 'financial', label: 'Financial Services', icon: '🏦', frameworks: ['SOX', 'PCI DSS', 'GDPR'] },
    { value: 'technology', label: 'Technology', icon: '💻', frameworks: ['GDPR', 'CCPA', 'ISO 27001'] },
    { value: 'education', label: 'Education', icon: '🎓', frameworks: ['FERPA', 'GDPR'] },
    { value: 'retail', label: 'Retail', icon: '🛍️', frameworks: ['PCI DSS', 'GDPR', 'CCPA'] },
    { value: 'manufacturing', label: 'Manufacturing', icon: '🏭', frameworks: ['ISO 27001', 'GDPR'] },
    { value: 'government', label: 'Government', icon: '🏛️', frameworks: ['FISMA', 'GDPR'] },
    { value: 'other', label: 'Other', icon: '🏢', frameworks: ['GDPR', 'ISO 27001'] }
  ];

  const allFrameworks = [
    { value: 'GDPR', label: 'GDPR (General Data Protection Regulation)', description: 'EU data protection law' },
    { value: 'HIPAA', label: 'HIPAA (Health Insurance Portability)', description: 'US healthcare privacy law' },
    { value: 'SOX', label: 'SOX (Sarbanes-Oxley Act)', description: 'US financial disclosure law' },
    { value: 'CCPA', label: 'CCPA (California Consumer Privacy Act)', description: 'California privacy law' },
    { value: 'PCI DSS', label: 'PCI DSS (Payment Card Industry)', description: 'Credit card security standard' },
    { value: 'ISO 27001', label: 'ISO 27001 (Information Security)', description: 'International security standard' },
    { value: 'HITECH', label: 'HITECH Act', description: 'Health IT privacy enhancement' },
    { value: 'FERPA', label: 'FERPA (Family Educational Rights)', description: 'Student privacy law' },
    { value: 'FISMA', label: 'FISMA (Federal Information Security)', description: 'US government security law' }
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
        setSelectedFile(file);
        // Auto-suggest industry if user has one in profile
        if (user?.user_metadata?.industry && !selectedIndustry) {
          setSelectedIndustry(user.user_metadata.industry);
        }
      } else {
        alert(validation.error);
      }
    }
  }, [validateFile, user, selectedIndustry]);

  const handleFileSelect = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation.valid) {
        setSelectedFile(file);
        // Auto-suggest industry if user has one in profile
        if (user?.user_metadata?.industry && !selectedIndustry) {
          setSelectedIndustry(user.user_metadata.industry);
        }
      } else {
        alert(validation.error);
      }
    }
  }, [validateFile, user, selectedIndustry]);

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    // Auto-select relevant frameworks
    const industryData = industries.find(ind => ind.value === industry);
    if (industryData) {
      setSelectedFrameworks(industryData.frameworks);
    }
  };

  const handleFrameworkToggle = (framework) => {
    setSelectedFrameworks(prev => 
      prev.includes(framework)
        ? prev.filter(f => f !== framework)
        : [...prev, framework]
    );
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    setValidationStep('Uploading file...');
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setValidationStep('Validating document...');
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedIndustry || selectedFrameworks.length === 0) {
      alert('Please select a file, industry, and at least one framework');
      return;
    }

    // Enhanced validation before processing
    try {
      setValidationStep('🔍 Validating document...');
      setUploadProgress(10);

      // Import validation utility
      const { validateFile } = await import('../lib/documentParser.js');

      // Validate file format and size
      validateFile(selectedFile);
      console.log('✅ Document validation passed');

      setValidationStep('📄 Processing document...');
      setUploadProgress(25);

      simulateUploadProgress();

      // Save document metadata if user is authenticated
      if (user) {
        console.log('Saving document metadata for user:', user.id);
      }

      await onUpload({
        file: selectedFile,
        industry: selectedIndustry,
        frameworks: selectedFrameworks,
        userId: user?.id,
        validated: true
      });

      setUploadProgress(100);
      setValidationStep('✅ Analysis complete!');
    } catch (error) {
      console.error('❌ Document validation failed:', error);
      setUploadProgress(0);
      setValidationStep('❌ Validation failed: ' + error.message);

      // Show user-friendly error message
      setTimeout(() => {
        alert(`Document validation failed: ${error.message}\n\nPlease ensure your document is a valid policy file and try again.`);
        setValidationStep('');
      }, 2000);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedIndustry('');
    setSelectedFrameworks([]);
    setUploadProgress(0);
    setValidationStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Upload Policy Document</h2>
        <p className="text-gray-600">Upload your document and select relevant compliance frameworks for analysis</p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : selectedFile 
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Choose different file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your policy document here
              </p>
              <p className="text-sm text-gray-600 mb-4">
                or click to browse files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Browse Files
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Supports PDF, Word documents, and text files up to 10MB
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
        />
      </div>

      {/* Industry Selection */}
      {selectedFile && (
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Industry
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() => handleIndustryChange(industry.value)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedIndustry === industry.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{industry.icon}</div>
                  <div className="text-sm font-medium">{industry.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Framework Selection */}
          {selectedIndustry && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Compliance Frameworks
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allFrameworks.map((framework) => (
                  <button
                    key={framework.value}
                    onClick={() => handleFrameworkToggle(framework.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selectedFrameworks.includes(framework.value)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{framework.label}</span>
                      {selectedFrameworks.includes(framework.value) && (
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{framework.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Processing Document</h3>
                  <p className="text-sm text-blue-700">{validationStep || progress}</p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Upload Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedFile && selectedIndustry && selectedFrameworks.length > 0 && !uploading && (
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Analyze Document ({selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EnhancedDocumentUpload;
