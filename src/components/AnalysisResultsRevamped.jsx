import { useState, useRef, useEffect } from 'react';
import { FiDownload, FiEye, FiFilter, FiGrid, FiList, FiRefreshCw, FiShare2, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiBarChart } from 'react-icons/fi';
import DetailedPlan from './DetailedPlan';
import ComplianceAnalysisDashboard from './ComplianceAnalysisDashboard';
import PDFExportUtility from '../utils/pdfExport';

function AnalysisResultsRevamped({ analysis }) {
  // Document validation rejection handling
  if (analysis?.isValidDocument === false) {
    return <DocumentRejectionView analysis={analysis} />;
  }

  const [activeView, setActiveView] = useState('overview');
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showFilters, setShowFilters] = useState(false);
  
  const chartRefs = useRef([]);
  const summaryRef = useRef(null);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowDetailedPlan(true);
    }, 2000);
  };

  const handleAdvancedDashboard = () => {
    setShowAdvancedDashboard(true);
  };

  // Filter gaps based on selected criteria
  const filteredGaps = (analysis.gaps && Array.isArray(analysis.gaps) ? analysis.gaps : [])
    .filter(gap => {
      if (selectedSeverity !== 'all' && gap.severity?.toLowerCase() !== selectedSeverity) return false;
      if (selectedFramework !== 'all' && gap.framework !== selectedFramework) return false;
      return true;
    });

  const uniqueFrameworks = [...new Set((analysis.gaps || []).map(gap => gap.framework).filter(Boolean))];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else if (exportFormat === 'json') {
        exportToJSON();
      } else {
        await exportToPDF();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const doc = await PDFExportUtility.exportAnalysisResults(analysis, {
        company: 'Your Organization',
        includeCharts: true
      });
      
      // Add charts if available
      const chartElements = chartRefs.current.filter(ref => ref);
      if (chartElements.length > 0) {
        const docWithCharts = await PDFExportUtility.exportWithCharts(analysis, chartElements);
        docWithCharts.save(`compliance-analysis-${Date.now()}.pdf`);
      } else {
        doc.save(`compliance-analysis-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      // Fallback to simple export
      window.print();
    }
  };

  const exportToCSV = () => {
    const headers = ['Gap #', 'Severity', 'Framework', 'Issue', 'Remediation', 'Timeline', 'Business Impact'];
    const rows = filteredGaps.map((gap, index) => [
      index + 1,
      gap.severity || 'Unknown',
      gap.framework || 'General',
      gap.issue || '',
      gap.remediation || '',
      gap.timeframe || 'TBD',
      gap.businessImpact || 'To be assessed'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-gaps-analysis-${Date.now()}.csv`;
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
        filters: { severity: selectedSeverity, framework: selectedFramework },
        documentInfo: analysis.documentInfo || {}
      },
      summary: analysis.summary,
      gaps: filteredGaps,
      structuredAnalysis: analysis.structuredAnalysis,
      recommendations: analysis.recommendations || []
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { color: 'bg-red-500', icon: '🚨', bgColor: 'bg-red-50 border-red-200', textColor: 'text-red-800' },
      high: { color: 'bg-orange-500', icon: '⚠️', bgColor: 'bg-orange-50 border-orange-200', textColor: 'text-orange-800' },
      medium: { color: 'bg-yellow-500', icon: '📋', bgColor: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-800' },
      low: { color: 'bg-green-500', icon: '✅', bgColor: 'bg-green-50 border-green-200', textColor: 'text-green-800' }
    };
    return configs[severity?.toLowerCase()] || configs.medium;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const views = [
    { key: 'overview', label: 'Overview', icon: FiBarChart },
    { key: 'gaps', label: 'Compliance Gaps', icon: FiAlertTriangle },
    { key: 'insights', label: 'Insights', icon: FiTrendingUp },
    { key: 'recommendations', label: 'Actions', icon: FiCheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5"></div>
          <div className="relative p-8">
            
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FiBarChart className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <FiCheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Analysis Results
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg">Comprehensive compliance assessment with actionable insights</p>
                  {analysis.documentInfo && (
                    <p className="text-sm text-gray-500 mt-1">
                      Document: <span className="font-medium">{analysis.documentInfo.name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Score Cards */}
              <div className="flex flex-wrap items-center gap-4">
                {analysis.overallScore && (
                  <div className={`text-center px-6 py-4 rounded-2xl ${getScoreColor(analysis.overallScore)} shadow-lg`}>
                    <div className="text-3xl font-black">{analysis.overallScore}%</div>
                    <div className="text-sm font-semibold opacity-80">Overall Score</div>
                  </div>
                )}
                <div className="text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                  <div className="text-3xl font-black">{filteredGaps.length}</div>
                  <div className="text-sm font-semibold opacity-90">
                    {selectedSeverity !== 'all' || selectedFramework !== 'all' ? 'Filtered' : 'Total'} Gaps
                  </div>
                </div>
                {analysis.structuredAnalysis?.redFlags && (
                  <div className="text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                    <div className="text-3xl font-black">{analysis.structuredAnalysis.redFlags.length}</div>
                    <div className="text-sm font-semibold opacity-90">Red Flags</div>
                  </div>
                )}
              </div>
            </div>

            {/* View Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {views.map(view => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.key}
                      onClick={() => setActiveView(view.key)}
                      className={`flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        activeView === view.key
                          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                          : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {view.label}
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FiFilter className="w-4 h-4 mr-2" />
                  Filters
                </button>
                
                <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>

                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="pdf">PDF Report</option>
                  <option value="csv">CSV Data</option>
                  <option value="json">JSON Export</option>
                </select>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {isExporting ? (
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FiDownload className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-white/70 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Severity:</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Framework:</label>
                    <select
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="all">All Frameworks</option>
                      {uniqueFrameworks.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSeverity('all');
                      setSelectedFramework('all');
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Views */}
        <div className="space-y-8">
          
          {/* Overview View */}
          {activeView === 'overview' && (
            <OverviewView 
              analysis={analysis} 
              filteredGaps={filteredGaps}
              summaryRef={summaryRef}
              chartRefs={chartRefs}
            />
          )}

          {/* Gaps View */}
          {activeView === 'gaps' && (
            <GapsView 
              filteredGaps={filteredGaps}
              viewMode={viewMode}
              getSeverityConfig={getSeverityConfig}
            />
          )}

          {/* Insights View */}
          {activeView === 'insights' && (
            <InsightsView 
              analysis={analysis}
              chartRefs={chartRefs}
            />
          )}

          {/* Recommendations View */}
          {activeView === 'recommendations' && (
            <RecommendationsView 
              analysis={analysis}
              filteredGaps={filteredGaps}
              getSeverityConfig={getSeverityConfig}
            />
          )}

          {/* Action Buttons */}
          <ActionButtonsSection
            handleGeneratePlan={handleGeneratePlan}
            handleAdvancedDashboard={handleAdvancedDashboard}
            isGeneratingPlan={isGeneratingPlan}
            filteredGaps={filteredGaps}
            analysis={analysis}
          />
        </div>

        {/* Loading Modal */}
        {isGeneratingPlan && <LoadingModal />}

        {/* Modals */}
        {showDetailedPlan && (
          <DetailedPlan
            analysis={analysis}
            onClose={() => setShowDetailedPlan(false)}
          />
        )}

        {showAdvancedDashboard && (
          <ComplianceAnalysisDashboard
            analysisResults={analysis}
            onClose={() => setShowAdvancedDashboard(false)}
          />
        )}
      </div>
    </div>
  );
}

// Component for document rejection view
function DocumentRejectionView({ analysis }) {
  const isPrivacyPolicyValidator = analysis.documentType === 'insufficient_privacy_content';
  const validationDetails = analysis.validationDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-red-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isPrivacyPolicyValidator ? 'Privacy Policy Content Insufficient' : 'Document Not Accepted'}
          </h2>
          
          <div className={`${isPrivacyPolicyValidator ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-6 mb-8`}>
            <p className={`${isPrivacyPolicyValidator ? 'text-yellow-800' : 'text-red-800'} text-lg font-medium mb-4`}>
              {analysis.quirkMessage || "This document doesn't appear to be a policy document."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Detected:</span> {analysis.detectedContent || `${analysis.documentType} content`}
              </div>
              <div>
                <span className="font-semibold">Confidence:</span> {analysis.confidence || 90}%
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg"
            >
              📁 Upload Different Document
            </button>
            
            <button
              onClick={() => window.open('https://policies.google.com/privacy', '_blank')}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-semibold"
            >
              🔗 See Example Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview View Component
function OverviewView({ analysis, filteredGaps, summaryRef, chartRefs }) {
  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div ref={summaryRef} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <FiBarChart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
          <p className="text-gray-700 text-lg leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Framework Scores */}
      {analysis.structuredAnalysis?.frameworkScores && (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">⚖️</span>
            Framework Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analysis.structuredAnalysis.frameworkScores).map(([framework, data]) => (
              <div key={framework} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">{framework}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className={`font-bold px-3 py-1 rounded-xl ${
                      data.score >= 80 ? 'bg-green-100 text-green-700' :
                      data.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {data.score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requirements:</span>
                    <span className="font-medium">{data.foundRequirements}/{data.totalRequirements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maturity:</span>
                    <span className="font-medium">{data.maturityLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Critical Issues" 
          value={filteredGaps.filter(g => g.severity === 'critical').length}
          color="from-red-500 to-red-600"
          icon="🚨"
        />
        <StatCard 
          title="High Priority" 
          value={filteredGaps.filter(g => g.severity === 'high').length}
          color="from-orange-500 to-orange-600"
          icon="⚠️"
        />
        <StatCard 
          title="Medium Risk" 
          value={filteredGaps.filter(g => g.severity === 'medium').length}
          color="from-yellow-500 to-yellow-600"
          icon="📋"
        />
        <StatCard 
          title="Low Priority" 
          value={filteredGaps.filter(g => g.severity === 'low').length}
          color="from-green-500 to-green-600"
          icon="✅"
        />
      </div>
    </div>
  );
}

// Gaps View Component
function GapsView({ filteredGaps, viewMode, getSeverityConfig }) {
  if (filteredGaps.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Gaps Found</h3>
        <p className="text-gray-600">No compliance gaps match your current filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
          <FiAlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Gaps</h2>
          <p className="text-gray-600">Showing {filteredGaps.length} identified gaps</p>
        </div>
      </div>

      <div className={`${
        viewMode === 'grid'
          ? 'grid grid-cols-1 xl:grid-cols-2 gap-6'
          : 'space-y-4'
      }`}>
        {filteredGaps.map((gap, index) => (
          <GapCard 
            key={index}
            gap={gap}
            index={index}
            viewMode={viewMode}
            getSeverityConfig={getSeverityConfig}
          />
        ))}
      </div>
    </div>
  );
}

// Gap Card Component
function GapCard({ gap, index, viewMode, getSeverityConfig }) {
  const severityConfig = getSeverityConfig(gap.severity);

  return (
    <div className={`${
      viewMode === 'grid'
        ? 'bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl'
        : 'bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg'
    } transition-all duration-300`}>
      
      <div className={`${
        viewMode === 'grid' 
          ? 'flex items-start justify-between mb-4'
          : 'flex items-center justify-between'
      }`}>
        <div className="flex items-center">
          <div className={`${severityConfig.color} w-10 h-10 rounded-xl flex items-center justify-center mr-3`}>
            <span className="text-white text-lg">{severityConfig.icon}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {gap.framework} Gap #{index + 1}
            </h4>
            {viewMode === 'list' && (
              <p className="text-sm text-gray-600 truncate max-w-md mt-1">
                {gap.issue?.substring(0, 80)}...
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`${severityConfig.color} text-white px-3 py-1 rounded-xl text-sm font-semibold`}>
            {gap.severity?.toUpperCase()}
          </div>
          {gap.framework && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-xl text-xs font-medium">
              {gap.framework}
            </div>
          )}
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
              <FiAlertTriangle className="w-4 h-4 mr-2 text-red-500" />
              Issue Identified
            </h5>
            <p className="text-gray-700 text-sm leading-relaxed">{gap.issue}</p>
          </div>

          {gap.businessImpact && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h5 className="font-semibold text-amber-900 mb-2 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                Business Impact
              </h5>
              <p className="text-amber-800 text-sm">{gap.businessImpact}</p>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h5 className="font-semibold text-green-900 mb-2 flex items-center">
              <FiCheckCircle className="w-4 h-4 mr-2" />
              Recommended Action
            </h5>
            <p className="text-green-800 text-sm leading-relaxed">{gap.remediation}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
                🕰️ {gap.timeframe || 'Timeline TBD'}
              </span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg">
                💼 {gap.effort || 'Effort TBD'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Insights View Component
function InsightsView({ analysis, chartRefs }) {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FiTrendingUp className="w-6 h-6 mr-3" />
          Compliance Insights
        </h2>
        
        {/* Red Flags */}
        {analysis.structuredAnalysis?.redFlags && analysis.structuredAnalysis.redFlags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Critical Red Flags</h3>
            <div className="space-y-4">
              {analysis.structuredAnalysis.redFlags.slice(0, 5).map((flag, index) => (
                <div key={index} className="bg-red-50 rounded-2xl p-4 border border-red-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-red-900">{flag.category}</h4>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-red-800 text-sm mb-2">Pattern: "{flag.pattern}"</p>
                  <p className="text-red-700 text-sm">{flag.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Analysis */}
        {analysis.structuredAnalysis?.sectionAnalysis && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Section Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.structuredAnalysis.sectionAnalysis).map(([section, data]) => (
                <div key={section} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{section.replace(/([A-Z])/g, ' $1')}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      data.score >= 80 ? 'bg-green-500' :
                      data.score >= 60 ? 'bg-yellow-500' :
                      data.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{data.score}%</div>
                  <div className="text-sm text-gray-600">
                    {data.keywords?.length || 0} keywords found
                  </div>
                  {data.redFlags?.length > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {data.redFlags.length} red flags
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Recommendations View Component
function RecommendationsView({ analysis, filteredGaps, getSeverityConfig }) {
  const prioritizedGaps = filteredGaps.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity?.toLowerCase()] - severityOrder[b.severity?.toLowerCase()];
  });

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FiCheckCircle className="w-6 h-6 mr-3" />
        Prioritized Action Plan
      </h2>
      
      <div className="space-y-6">
        {prioritizedGaps.slice(0, 10).map((gap, index) => {
          const severityConfig = getSeverityConfig(gap.severity);
          return (
            <div key={index} className={`${severityConfig.bgColor} rounded-2xl p-6 border`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{gap.issue?.substring(0, 80)}...</h3>
                    <p className="text-sm text-gray-600">{gap.framework} Framework</p>
                  </div>
                </div>
                <span className={`${severityConfig.color} text-white px-3 py-1 rounded-xl text-xs font-semibold`}>
                  {gap.severity?.toUpperCase()}
                </span>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🎯 Recommended Action:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{gap.remediation}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg">
                    ⏰ {gap.timeframe || '30-90 days'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-lg">
                    💼 {gap.effort || 'Medium effort'}
                  </span>
                  {gap.businessImpact && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-lg">
                      📈 High business impact
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Action Buttons Section Component
function ActionButtonsSection({ handleGeneratePlan, handleAdvancedDashboard, isGeneratingPlan, filteredGaps, analysis }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl border border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Remediation Plan</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Get a comprehensive, prioritized action plan with timelines and business impact analysis.
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan || filteredGaps.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base font-semibold px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full shadow-lg"
          >
            {isGeneratingPlan ? (
              <div className="flex items-center justify-center">
                <FiRefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Generating Plan...
              </div>
            ) : (
              'Generate Detailed Plan'
            )}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBarChart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics Dashboard</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Deep dive into structured compliance analysis with detailed insights and framework scores.
          </p>
          <button
            onClick={handleAdvancedDashboard}
            disabled={!analysis.structuredAnalysis}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-semibold px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full shadow-lg"
          >
            <FiEye className="w-4 h-4 inline mr-2" />
            View Advanced Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color, icon }) {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-sm font-medium opacity-90">{title}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

// Loading Modal Component
function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FiRefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Crafting Your Plan</h3>
          <p className="text-gray-600">Analyzing compliance gaps and generating actionable solutions...</p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResultsRevamped;
