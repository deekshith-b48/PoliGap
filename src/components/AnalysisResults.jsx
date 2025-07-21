import { useState } from 'react';
import DetailedPlan from './DetailedPlan';

function AnalysisResults({ analysis }) {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
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
                          getSeverityColor(gap.severity)} w-8 h-8 rounded-xl flex items-center justify-center mr-3`}>
                          <span className="text-white text-lg">{getSeverityIcon(gap.severity)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base lg:text-lg">Gap #{index + 1}</h4>
                          {viewMode === 'list' && (
                            <p className="text-sm text-gray-600 truncate max-w-md">{gap.issue}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`${getSeverityColor(gap.severity)} text-white px-3 py-1 rounded-xl text-sm font-semibold`}>
                          {gap.severity}
                        </div>
                        {gap.framework && (
                          <div className="bg-gray-600 text-white px-3 py-1 rounded-xl text-xs font-medium">
                            {gap.framework}
                          </div>
                        )}
                      </div>
                    </div>

                    {viewMode === 'grid' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-gray-900 text-sm">Issue Identified</p>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{gap.issue}</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-gray-900 text-sm">Recommended Action</p>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{gap.remediation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Detailed Plan */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 lg:p-8 shadow-xl border border-green-200 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Generate Detailed Remediation Plan</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm lg:text-base">
                Get a comprehensive, prioritized action plan with timelines, resource requirements,
                and business impact analysis to address all identified gaps.
              </p>
              <button
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan || filteredGaps.length === 0}
                className="bg-gradient-primary text-white text-base lg:text-lg font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl btn-hover focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGeneratingPlan ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Plan...
                  </div>
                ) : (
                  'Generate Detailed Plan'
                )}
              </button>
              {filteredGaps.length === 0 && (
                <p className="text-amber-600 text-sm mt-2">No gaps available to generate plan</p>
              )}
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
    </div>
  );
}

export default AnalysisResults;
