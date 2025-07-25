import { useState } from 'react';
import DetailedPlan from './DetailedPlan';
import ComplianceAnalysisDashboard from './ComplianceAnalysisDashboard';

function AnalysisResults({ analysis }) {
  // ✅ ENHANCED DOCUMENT VALIDATION REJECTION HANDLING
  if (analysis?.isValidDocument === false) {
    // Special handling for privacy policy validation
    const isPrivacyPolicyValidator = analysis.documentType === 'insufficient_privacy_content';
    const validationDetails = analysis.validationDetails;
    
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isPrivacyPolicyValidator 
                      ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"} />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isPrivacyPolicyValidator ? 'Privacy Policy Content Insufficient' : 'Document Not Accepted'}
          </h2>
          
          <div className={`${isPrivacyPolicyValidator ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-6`}>
            <div className="whitespace-pre-line">
              <p className={`${isPrivacyPolicyValidator ? 'text-yellow-800' : 'text-red-800'} text-lg font-medium mb-2`}>
                {analysis.quirkMessage || "This document doesn't appear to be a policy document."}
              </p>
            </div>
            <p className={`${isPrivacyPolicyValidator ? 'text-yellow-700' : 'text-red-700'} text-sm`}>
              <strong>Detected:</strong> {analysis.detectedContent || `${analysis.documentType} content`}
            </p>
            <p className={`${isPrivacyPolicyValidator ? 'text-yellow-700' : 'text-red-700'} text-sm`}>
              <strong>Confidence:</strong> {analysis.confidence || 90}%
            </p>
          </div>

          {/* ✅ ENHANCED PRIVACY POLICY GUIDANCE */}
          {isPrivacyPolicyValidator && validationDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">� Privacy Policy Requirements</h3>
              
              {validationDetails.missingElements && (
                <div className="text-left mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">❌ Missing Critical Elements:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {validationDetails.missingElements.map((element, index) => (
                      <li key={index}>• {element}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationDetails.suggestions && (
                <div className="text-left">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Improvement Suggestions:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {validationDetails.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              {isPrivacyPolicyValidator ? '�📋 Privacy Policy Must Include:' : '📋 We Accept These Document Types:'}
            </h3>
            
            {isPrivacyPolicyValidator ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">🔍 Data Collection & Usage</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Types of personal data collected</li>
                    <li>• How information is gathered</li>
                    <li>• Purposes for data processing</li>
                    <li>• Legal basis for collection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">👤 User Rights & Controls</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Right to access data</li>
                    <li>• Right to correct information</li>
                    <li>• Right to delete data</li>
                    <li>• Opt-out mechanisms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">🤝 Data Sharing & Security</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Third-party data sharing</li>
                    <li>• Security measures</li>
                    <li>• Data retention periods</li>
                    <li>• Breach notification procedures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">⚖️ Legal & Compliance</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• GDPR/CCPA compliance</li>
                    <li>• Contact information</li>
                    <li>• Policy update procedures</li>
                    <li>• Effective dates</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">🔒 Privacy & Security</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Privacy Policies</li>
                    <li>• Data Protection Procedures</li>
                    <li>• Security Policies</li>
                    <li>• Information Governance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">👥 HR & Compliance</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Employee Handbooks</li>
                    <li>• Code of Conduct</li>
                    <li>• Compliance Procedures</li>
                    <li>• Regulatory Policies</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ✅ ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📁 Upload Different Document
            </button>
            
            {isPrivacyPolicyValidator && (
              <button 
                onClick={() => {
                  const helpText = `
🔍 Privacy Policy Validation Help:

Your document was identified as potentially privacy-related but lacks sufficient content for comprehensive analysis.

Required sections for a complete privacy policy:
• Data collection practices and methods
• Information usage and processing purposes  
• User rights and control mechanisms
• Third-party data sharing disclosures
• Security measures and protections
• Data retention and deletion policies
• Legal compliance information (GDPR, CCPA, etc.)
• Contact information for privacy inquiries

Tips:
- Ensure your document is a complete, published privacy policy
- Include all major sections with detailed explanations
- Use clear privacy-related terminology throughout
- Reference applicable privacy laws and regulations
                  `;
                  alert(helpText);
                }}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                � Privacy Policy Help
              </button>
            )}
            
            <button
              onClick={() => window.open('https://policies.google.com/privacy', '_blank')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              🔗 See Example Policy
            </button>
          </div>

          {/* ✅ TECHNICAL DETAILS FOR DEBUGGING */}
          {validationDetails?.scores && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <details className="cursor-pointer">
                <summary className="font-medium text-gray-700 mb-2">🔧 Technical Validation Details</summary>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Privacy Score:</strong> {validationDetails.scores.privacyScore || 0}</p>
                  <p><strong>Structure Score:</strong> {validationDetails.scores.structureScore || 0}</p>
                  <p><strong>Quality Score:</strong> {validationDetails.scores.qualityScore || 0}</p>
                  <p><strong>Final Score:</strong> {validationDetails.scores.finalScore || 0}</p>
                  <p><strong>Threshold:</strong> {validationDetails.scores.threshold || 0}</p>
                </div>
              </details>
            </div>
          )}

          {analysis.rejectionReason && (
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Technical Details:</strong> {analysis.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowDetailedPlan(true);
    }, 2000);
  };

  const handleShowAdvancedDashboard = () => {
    setShowAdvancedDashboard(true);
  };

  // Filter gaps based on selected criteria
  const filteredGaps = (analysis.gaps && Array.isArray(analysis.gaps) ? analysis.gaps : [])
    .filter(gap => {
      if (selectedSeverity !== 'all' && gap.severity?.toLowerCase() !== selectedSeverity) return false;
      if (selectedFramework !== 'all' && gap.framework !== selectedFramework) return false;
      return true;
    });

  // Get unique frameworks for filter
  const uniqueFrameworks = [...new Set((analysis.gaps || []).map(gap => gap.framework).filter(Boolean))];

  const handleExport = async () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else if (exportFormat === 'json') {
      exportToJSON();
    } else {
      exportToPDF();
    }
  };

  const exportToCSV = () => {
    const headers = ['Gap #', 'Severity', 'Framework', 'Issue', 'Remediation'];
    const rows = filteredGaps.map((gap, index) => [
      index + 1,
      gap.severity || 'Unknown',
      gap.framework || 'General',
      gap.issue || '',
      gap.remediation || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-gaps-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        totalGaps: filteredGaps.length,
        overallScore: analysis.overallScore,
        exportDate: new Date().toISOString(),
        filters: { severity: selectedSeverity, framework: selectedFramework }
      },
      summary: analysis.summary,
      gaps: filteredGaps
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-gaps-analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF export - could be enhanced with jsPDF
    window.print();
  };

  const getSeverityColor = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'bg-red-500';
    if (s === 'high') return 'bg-orange-500';
    if (s === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSeverityIcon = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return '🚨';
    if (s === 'high') return '⚠️';
    if (s === 'medium') return '📋';
    return '✅';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-fadeInUp">

          {/* Header Section with Controls */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 backdrop-blur-sm bg-white/95">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mr-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analysis Results</h1>
                  <p className="text-gray-600">Comprehensive compliance gap assessment</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {analysis.overallScore && (
                  <div className="text-center">
                    <div className={`text-2xl lg:text-3xl font-black ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}%
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 font-semibold">Overall Score</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-black text-gray-900">
                    {filteredGaps.length}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 font-semibold">
                    {selectedSeverity !== 'all' || selectedFramework !== 'all' ? 'Filtered' : 'Total'} Gaps
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  {/* Severity Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Severity:</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Framework Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Framework:</label>
                    <select
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="all">All Frameworks</option>
                      {uniqueFrameworks.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">View:</label>
                    <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm transition-all ${
                          viewMode === 'grid'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm transition-all ${
                          viewMode === 'list'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Export Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                  <button
                    onClick={handleExport}
                    className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold btn-hover focus-ring transition-all"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Industry Benchmark */}
            {analysis.industryBenchmark && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-900">Industry Benchmark</span>
                      <p className="text-sm text-blue-700">Compared to industry peers</p>
                    </div>
                  </div>
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold text-sm">
                    {analysis.industryBenchmark.comparison}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 backdrop-blur-sm bg-white/95">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Executive Summary</h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed whitespace-pre-wrap">
                  {analysis.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Gaps */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 backdrop-blur-sm bg-white/95">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Identified Compliance Gaps</h2>
                  <p className="text-sm text-gray-600">Showing {filteredGaps.length} of {(analysis.gaps || []).length} gaps</p>
                </div>
              </div>
            </div>

            {filteredGaps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No gaps found</h3>
                <p className="text-gray-600">No compliance gaps match your current filter criteria.</p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 xl:grid-cols-2 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredGaps.map((gap, index) => (
                  <div key={index} className={`${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 card-hover shadow-lg'
                      : 'bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-200 card-hover shadow-lg'
                  } transition-all duration-300 hover:shadow-xl`}>
                    <div className={`${
                      viewMode === 'grid'
                        ? 'flex items-start justify-between mb-4'
                        : 'flex items-center justify-between'
                    }`}>
                      <div className="flex items-center">
                        <div className={`${
                          getSeverityColor(gap.severity)} w-10 h-10 rounded-xl flex items-center justify-center mr-3 relative`}>
                          <span className="text-white text-lg">{getSeverityIcon(gap.severity)}</span>
                          {gap.riskLevel && (
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                              gap.riskLevel === 'Critical' ? 'bg-red-600' :
                              gap.riskLevel === 'High' ? 'bg-orange-500' :
                              gap.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base lg:text-lg">
                            {gap.framework} Gap #{index + 1}
                          </h4>
                          {gap.currentScore !== undefined && (
                            <div className="flex items-center mt-1 gap-2">
                              <div className="bg-gray-200 rounded-full h-2 flex-1 max-w-20">
                                <div
                                  className={`h-2 rounded-full ${
                                    gap.currentScore < 50 ? 'bg-red-500' :
                                    gap.currentScore < 70 ? 'bg-orange-500' :
                                    gap.currentScore < 85 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.max(gap.currentScore, 5)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {gap.currentScore}% → {gap.targetScore}%
                              </span>
                            </div>
                          )}
                          {viewMode === 'list' && (
                            <p className="text-sm text-gray-600 truncate max-w-md mt-1">
                              {gap.issue.split('.')[0]}...
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`${getSeverityColor(gap.severity)} text-white px-3 py-1 rounded-xl text-sm font-semibold flex items-center`}>
                          {gap.severity}
                          {gap.timeframe && (
                            <span className="ml-2 text-xs opacity-90">{gap.timeframe}</span>
                          )}
                        </div>
                        {gap.framework && (
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-xl text-xs font-medium">
                            {gap.framework}
                          </div>
                        )}
                        {gap.effort && (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs">
                            {gap.effort}
                          </div>
                        )}
                      </div>
                    </div>

                    {viewMode === 'grid' && (
                      <div className="space-y-4">
                        {/* Issue Identified */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-gray-900 text-sm">Compliance Gap Analysis</p>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{gap.issue}</p>
                          </div>
                        </div>

                        {/* Business Impact */}
                        {gap.businessImpact && (
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center mb-2">
                              <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <p className="font-semibold text-amber-900 text-sm">Business Impact & Risk</p>
                            </div>
                            <p className="text-amber-800 text-sm leading-relaxed">{gap.businessImpact}</p>
                          </div>
                        )}

                        {/* Compliance Requirement */}
                        {gap.complianceRequirement && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center mb-2">
                              <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="font-semibold text-blue-900 text-sm">Regulatory Requirement</p>
                            </div>
                            <p className="text-blue-800 text-sm leading-relaxed">{gap.complianceRequirement}</p>
                          </div>
                        )}

                        {/* Recommended Actions */}
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-green-900 text-sm">Remediation Strategy</p>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-green-800 text-sm whitespace-pre-wrap leading-relaxed">{gap.remediation}</p>
                          </div>

                          {/* Implementation Timeline */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
                              🕰️ {gap.timeframe || 'Timeline TBD'}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg">
                              💼 {gap.effort || 'Effort TBD'}
                            </span>
                            {gap.targetScore && (
                              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-lg">
                                🎯 Target: {gap.targetScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generate Detailed Plan */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 lg:p-8 shadow-xl border border-green-200 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Remediation Plan</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Get a comprehensive, prioritized action plan with timelines, resource requirements,
                  and business impact analysis.
                </p>
                <button
                  onClick={handleGeneratePlan}
                  disabled={isGeneratingPlan || filteredGaps.length === 0}
                  className="bg-gradient-primary text-white text-base font-semibold px-6 py-3 rounded-2xl btn-hover focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full"
                >
                  {isGeneratingPlan ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Plan...
                    </div>
                  ) : (
                    'Generate Plan'
                  )}
                </button>
                {filteredGaps.length === 0 && (
                  <p className="text-amber-600 text-sm mt-2">No gaps available to generate plan</p>
                )}
              </div>
            </div>

            {/* Advanced Compliance Dashboard */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 lg:p-8 shadow-xl border border-blue-200 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analysis Dashboard</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Deep dive into structured compliance analysis with red flags, section scores, and framework details.
                </p>
                <button
                  onClick={handleShowAdvancedDashboard}
                  disabled={!analysis.structuredAnalysis}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-semibold px-6 py-3 rounded-2xl btn-hover focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full"
                >
                  <span className="mr-2">📊</span>
                  View Advanced Dashboard
                </button>
                {!analysis.structuredAnalysis && (
                  <p className="text-amber-600 text-sm mt-2">Structured analysis not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {isGeneratingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-glow">
            <div className="animate-pulse">
              {/* Header skeleton */}
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-gray-300 rounded-2xl w-80"></div>
                <div className="h-8 bg-gray-300 rounded-2xl w-32"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-6 bg-gray-300 rounded-xl w-48"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
                </div>
                
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-4 bg-gray-300 rounded w-8 mr-4"></div>
                      <div className="h-5 bg-gray-300 rounded w-64"></div>
                    </div>
                    <div className="space-y-2 ml-12">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading message */}
              <div className="text-center py-8 mt-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-ai-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-2">
                  AI Crafting Your Remediation Plan
                </div>
                <div className="text-gray-600">
                  Analyzing compliance gaps and generating actionable solutions...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Plan Modal */}
      {showDetailedPlan && (
        <DetailedPlan
          analysis={analysis}
          onClose={() => setShowDetailedPlan(false)}
        />
      )}

      {/* Advanced Compliance Dashboard */}
      {showAdvancedDashboard && (
        <ComplianceAnalysisDashboard
          analysisResults={analysis}
          onClose={() => setShowAdvancedDashboard(false)}
        />
      )}
    </div>
  );
}

export default AnalysisResults;
