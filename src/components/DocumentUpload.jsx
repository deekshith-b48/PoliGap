import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeDocument } from '../lib/gemini';

function DocumentUpload({ onUpload, uploading, progress, error }) {
  const [file, setFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const availableFrameworks = [
    { id: 'GDPR', name: 'GDPR (General Data Protection Regulation)', region: 'EU', color: 'blue' },
    { id: 'HIPAA', name: 'HIPAA (Health Insurance Portability)', region: 'US', color: 'green' },
    { id: 'SOX', name: 'SOX (Sarbanes-Oxley Act)', region: 'US', color: 'purple' },
    { id: 'CCPA', name: 'CCPA (California Consumer Privacy Act)', region: 'California', color: 'orange' },
    { id: 'PCI_DSS', name: 'PCI DSS (Payment Card Industry)', region: 'Global', color: 'red' },
    { id: 'ISO_27001', name: 'ISO 27001 (Information Security Management)', region: 'International', color: 'indigo' },
    { id: 'FERPA', name: 'FERPA (Family Educational Rights)', region: 'US', color: 'teal' },
    { id: 'GLBA', name: 'GLBA (Gramm-Leach-Bliley Act)', region: 'US', color: 'pink' },
    { id: 'COPPA', name: 'COPPA (Children\'s Online Privacy)', region: 'US', color: 'yellow' },
    { id: 'NIST_CSF', name: 'NIST Cybersecurity Framework', region: 'US', color: 'gray' },
    { id: 'CAN_SPAM', name: 'CAN-SPAM Act', region: 'US', color: 'cyan' },
    { id: 'FISMA', name: 'FISMA (Federal Information Security)', region: 'US', color: 'emerald' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Financial', 'Manufacturing', 
    'Retail', 'Education', 'Government', 'Energy'
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

  const getFrameworkColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100',
      teal: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100',
      pink: 'bg-pink-50 border-pink-200 text-pink-800 hover:bg-pink-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      gray: 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
    };
    return colorMap[color] || colorMap.blue;
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

      {/* Industry Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Industry Sector
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        >
          <option value="">Select your industry...</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Regulatory Frameworks */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Regulatory Frameworks
        </label>
        <p className="text-sm text-gray-600 mb-4">Select frameworks to benchmark against</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
          {availableFrameworks.map((framework) => (
            <label 
              key={framework.id} 
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                selectedFrameworks.includes(framework.id) 
                  ? `${getFrameworkColorClasses(framework.color)} ring-2 ring-${framework.color}-300`
                  : `bg-gray-50 border-gray-200 hover:bg-gray-100`
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(framework.id)}
                onChange={() => handleFrameworkChange(framework.id)}
                className="mr-3 w-4 h-4 text-blue-600 rounded focus-ring"
              />
              <div className="flex-1">
                <span className="font-medium block">{framework.name}</span>
                <span className="text-xs opacity-75">{framework.region}</span>
              </div>
            </label>
          ))}
        </div>
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
