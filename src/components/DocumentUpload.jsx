import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeDocument } from '../lib/gemini';

function DocumentUpload({ onUpload, uploading, progress, error }) {
  const [file, setFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const availableFrameworks = [
    { id: 'GDPR', name: 'GDPR (General Data Protection Regulation)', region: 'EU', icon: '🇪🇺' },
    { id: 'HIPAA', name: 'HIPAA (Health Insurance Portability)', region: 'US', icon: '🏥' },
    { id: 'SOX', name: 'SOX (Sarbanes-Oxley Act)', region: 'US', icon: '📊' },
    { id: 'CCPA', name: 'CCPA (California Consumer Privacy Act)', region: 'California', icon: '🌴' },
    { id: 'PCI_DSS', name: 'PCI DSS (Payment Card Industry)', region: 'Global', icon: '💳' },
    { id: 'ISO_27001', name: 'ISO 27001 (Information Security Management)', region: 'International', icon: '🔒' },
    { id: 'FERPA', name: 'FERPA (Family Educational Rights)', region: 'US', icon: '🎓' },
    { id: 'GLBA', name: 'GLBA (Gramm-Leach-Bliley Act)', region: 'US', icon: '🏦' },
    { id: 'COPPA', name: 'COPPA (Children\'s Online Privacy)', region: 'US', icon: '👶' },
    { id: 'NIST_CSF', name: 'NIST Cybersecurity Framework', region: 'US', icon: '🛡️' },
    { id: 'CAN_SPAM', name: 'CAN-SPAM Act', region: 'US', icon: '📧' },
    { id: 'FISMA', name: 'FISMA (Federal Information Security)', region: 'US', icon: '🏛️' }
  ];

  const industries = [
    { id: 'technology', name: 'Technology', icon: '💻', description: 'Software, SaaS, IT services, and tech startups' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Hospitals, medical devices, health services' },
    { id: 'financial', name: 'Financial Services', icon: '🏦', description: 'Banks, insurance, investment firms' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Production, industrial, automotive' },
    { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️', description: 'Online stores, consumer goods, retail chains' },
    { id: 'education', name: 'Education', icon: '🎓', description: 'Schools, universities, educational platforms' },
    { id: 'government', name: 'Government', icon: '🏛️', description: 'Public sector, agencies, municipalities' },
    { id: 'energy', name: 'Energy & Utilities', icon: '⚡', description: 'Power, oil & gas, renewable energy' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => {
      const currentFrameworks = Array.isArray(prev) ? prev : [];
      return currentFrameworks.includes(frameworkId) 
        ? currentFrameworks.filter(id => id !== frameworkId)
        : [...currentFrameworks, frameworkId];
    });
  };

  const handleIndustryChange = (industryId) => {
    setSelectedIndustry(industryId);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if (!selectedIndustry) {
      alert('Please select your industry sector');
      return;
    }

    const frameworksToUse = Array.isArray(selectedFrameworks) ? selectedFrameworks : [];
    if (frameworksToUse.length === 0) {
      alert('Please select at least one regulatory framework');
      return;
    }

    try {
      await onUpload({
        file,
        industry: selectedIndustry,
        frameworks: frameworksToUse
      });
      
      // Reset form
      setFile(null);
      setSelectedIndustry('');
      setSelectedFrameworks([]);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <p className="text-gray-600">Select your policy document for analysis</p>
        </div>
      </div>
      
      {/* File Upload Area */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Policy Document
        </label>
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : file 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{Math.round(file.size / 1024)} KB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Drop your file here or click to browse</p>
                <p className="text-sm text-gray-600">PDF, Word, or text files supported</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Industry Selection - Professional Card Grid */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Industry Sector
        </label>
        <p className="text-sm text-gray-600 mb-4">Select your organization's primary industry</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                selectedIndustry === industry.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="industry"
                value={industry.id}
                checked={selectedIndustry === industry.id}
                onChange={() => handleIndustryChange(industry.id)}
                className="sr-only"
              />
              <div className="flex-shrink-0 mr-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedIndustry === industry.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <span className="text-xl">{industry.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold mb-1 ${
                  selectedIndustry === industry.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {industry.name}
                </h4>
                <p className={`text-sm ${
                  selectedIndustry === industry.id ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {industry.description}
                </p>
              </div>
              {selectedIndustry === industry.id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Regulatory Frameworks - Consistent Styling */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Regulatory Frameworks
        </label>
        <p className="text-sm text-gray-600 mb-4">Select frameworks to benchmark against (choose multiple)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
          {availableFrameworks.map((framework) => (
            <label 
              key={framework.id} 
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                selectedFrameworks.includes(framework.id) 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(framework.id)}
                onChange={() => handleFrameworkChange(framework.id)}
                className="mr-4 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <div className="flex-shrink-0 mr-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedFrameworks.includes(framework.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}>
                  <span className="text-sm">{framework.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold block ${
                  selectedFrameworks.includes(framework.id) ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {framework.name}
                </span>
                <span className={`text-sm ${
                  selectedFrameworks.includes(framework.id) ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {framework.region}
                </span>
              </div>
              {selectedFrameworks.includes(framework.id) && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          ))}
        </div>
        
        {/* Selected Frameworks Summary */}
        {selectedFrameworks.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-blue-900">
                {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFrameworks.map((frameworkId) => {
                const framework = availableFrameworks.find(f => f.id === frameworkId);
                return (
                  <span
                    key={frameworkId}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-xl"
                  >
                    {framework?.icon} {frameworkId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !file || !selectedIndustry || selectedFrameworks.length === 0}
        className="w-full bg-gradient-primary text-white text-lg font-semibold px-8 py-4 rounded-2xl btn-hover focus-ring disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Document...
          </div>
        ) : (
          'Analyze Policy'
        )}
      </button>

      {/* Progress Indicator */}
      {progress && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-full mr-3 animate-ai-pulse"></div>
            <p className="text-blue-800 font-medium">{progress}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-red-500 rounded-full mr-3 mt-0.5"></div>
            <div>
              <p className="text-red-800 font-medium">Analysis Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
