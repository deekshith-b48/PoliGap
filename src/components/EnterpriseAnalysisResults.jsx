import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Parser } from '@json2csv/plainjs';

function EnterpriseAnalysisResults({ analysis, documentInfo, onExport, onShare }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [selectedClauses, setSelectedClauses] = useState(new Set());
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showClauseDetails, setShowClauseDetails] = useState(null);
  const { user } = useAuth();
  const chartRef = useRef(null);

  if (!analysis) return null;

  // Enhanced mock data with enterprise features
  const enhancedAnalysis = {
    ...analysis,
    documentInfo: documentInfo || {
      name: 'Privacy Policy v2.1.pdf',
      uploadDate: new Date(),
      size: '2.4 MB',
      type: 'PDF Document'
    },
    overallScore: 85,
    riskLevel: 'Medium',
    complianceMatrix: {
      'GDPR': { 
        score: 88, 
        gaps: 3, 
        critical: 1,
        clauses: {
          passed: ['Art. 6 (Lawful basis)', 'Art. 12 (Transparent info)', 'Art. 25 (Data protection by design)'],
          failed: ['Art. 17 (Right to erasure)', 'Art. 33 (Breach notification)'],
          partial: ['Art. 13 (Info when collecting data)']
        }
      },
      'HIPAA': { 
        score: 82, 
        gaps: 4, 
        critical: 2,
        clauses: {
          passed: ['§164.502 (Uses and disclosures)', '§164.514 (De-identification)'],
          failed: ['§164.308 (Administrative safeguards)', '§164.530 (Personnel designations)'],
          partial: ['§164.312 (Technical safeguards)', '§164.316 (Assigned security responsibility)']
        }
      },
      'SOX': { 
        score: 90, 
        gaps: 2, 
        critical: 0,
        clauses: {
          passed: ['§302 (Corporate responsibility)', '§404 (Management assessment)', '§409 (Real time disclosure)'],
          failed: ['§906 (Corporate responsibility for financial reports)'],
          partial: []
        }
      }
    },
    detailedGaps: [
      {
        id: 1,
        framework: 'GDPR',
        article: 'Article 17',
        title: 'Right to Erasure Implementation Missing',
        severity: 'Critical',
        description: 'The policy lacks clear procedures for data subject deletion requests under GDPR Article 17.',
        recommendation: 'Implement automated deletion workflows with verification mechanisms.',
        effort: 'High',
        timeline: '2-3 weeks',
        location: 'Section 4.2, Page 8',
        suggestedClause: 'Upon request, we will delete personal data without undue delay, except where retention is necessary for compliance with legal obligations...'
      },
      {
        id: 2,
        framework: 'GDPR',
        article: 'Article 33',
        title: 'Breach Notification Procedures Incomplete',
        severity: 'High',
        description: 'Current breach response lacks the 72-hour notification requirement specified in GDPR.',
        recommendation: 'Establish clear incident response timeline with automated supervisor authority notification.',
        effort: 'Medium',
        timeline: '1-2 weeks',
        location: 'Section 7.1, Page 15',
        suggestedClause: 'In case of a personal data breach, we will notify the relevant supervisory authority within 72 hours...'
      },
      {
        id: 3,
        framework: 'HIPAA',
        article: '§164.308',
        title: 'Administrative Safeguards Documentation',
        severity: 'High',
        description: 'Missing documentation of assigned security responsibilities and access procedures.',
        recommendation: 'Document security officer roles and create access control procedures.',
        effort: 'Medium',
        timeline: '1-2 weeks',
        location: 'Section 3.4, Page 6',
        suggestedClause: 'A designated security officer is responsible for developing and implementing policies and procedures...'
      }
    ],
    riskAssessment: {
      dataFlow: { score: 78, issues: ['Unclear third-party transfers', 'Missing data mapping'] },
      accessControl: { score: 92, issues: ['Strong authentication requirements'] },
      incidentResponse: { score: 65, issues: ['Missing escalation procedures', 'No automated alerts'] },
      documentation: { score: 88, issues: ['Some outdated references'] }
    },
    benchmarkData: {
      industry: 'Technology',
      averageScore: 78,
      topPercentile: 95,
      yourScore: 85,
      ranking: '78th percentile'
    }
  };

  const filteredGaps = enhancedAnalysis.detailedGaps.filter(gap => 
    filterSeverity === 'all' || gap.severity.toLowerCase() === filterSeverity
  );

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExportToPDF = async () => {
    setIsExporting(true);
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Compliance Analysis Report', 20, 30);
    
    // Document info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Document: ${enhancedAnalysis.documentInfo.name}`, 20, 50);
    pdf.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, 60);
    pdf.text(`Overall Score: ${enhancedAnalysis.overallScore}%`, 20, 70);
    
    // Framework scores table
    const frameworkData = Object.entries(enhancedAnalysis.complianceMatrix).map(([framework, data]) => [
      framework,
      `${data.score}%`,
      data.gaps.toString(),
      data.critical.toString()
    ]);
    
    pdf.autoTable({
      head: [['Framework', 'Score', 'Gaps', 'Critical Issues']],
      body: frameworkData,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Gaps summary
    pdf.setFontSize(16);
    pdf.text('Critical Gaps Identified', 20, pdf.lastAutoTable.finalY + 20);
    
    const gapsData = enhancedAnalysis.detailedGaps.map(gap => [
      gap.framework,
      gap.title,
      gap.severity,
      gap.timeline
    ]);
    
    pdf.autoTable({
      head: [['Framework', 'Issue', 'Severity', 'Timeline']],
      body: gapsData,
      startY: pdf.lastAutoTable.finalY + 30,
      theme: 'grid'
    });
    
    pdf.save(`compliance-analysis-${Date.now()}.pdf`);
    setIsExporting(false);
  };

  const handleExportToCSV = () => {
    const data = enhancedAnalysis.detailedGaps.map(gap => ({
      Framework: gap.framework,
      Article: gap.article,
      Title: gap.title,
      Severity: gap.severity,
      Description: gap.description,
      Recommendation: gap.recommendation,
      Effort: gap.effort,
      Timeline: gap.timeline,
      Location: gap.location
    }));
    
    const parser = new Parser();
    const csv = parser.parse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-gaps-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    switch (exportFormat) {
      case 'pdf':
        await handleExportToPDF();
        break;
      case 'csv':
        handleExportToCSV();
        break;
      case 'json':
        const jsonData = JSON.stringify(enhancedAnalysis, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-analysis-${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
    }
    
    setIsExporting(false);
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={getScoreColor(percentage)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</div>
            {label && <div className="text-xs text-gray-600">{label}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Compliance Analysis Report</h2>
                <p className="text-blue-100">{enhancedAnalysis.documentInfo.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Analysis Date</span>
                <div className="font-semibold">{new Date().toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-blue-200">File Size</span>
                <div className="font-semibold">{enhancedAnalysis.documentInfo.size}</div>
              </div>
              <div>
                <span className="text-blue-200">Frameworks</span>
                <div className="font-semibold">{Object.keys(enhancedAnalysis.complianceMatrix).length}</div>
              </div>
              <div>
                <span className="text-blue-200">Risk Level</span>
                <div className={`font-semibold px-2 py-1 rounded ${
                  enhancedAnalysis.riskLevel === 'Low' ? 'bg-green-500/20' :
                  enhancedAnalysis.riskLevel === 'Medium' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  {enhancedAnalysis.riskLevel}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end space-y-4">
            <CircularProgress percentage={enhancedAnalysis.overallScore} label="Overall Score" />
            <div className="text-center lg:text-right">
              <div className="text-blue-100 text-sm">Industry Benchmark</div>
              <div className="font-semibold">{enhancedAnalysis.benchmarkData.ranking}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-8 px-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Executive Summary', icon: '📊' },
            { id: 'frameworks', label: 'Framework Analysis', icon: '🛡️' },
            { id: 'gaps', label: 'Gap Analysis', icon: '🔍' },
            { id: 'recommendations', label: 'Action Plan', icon: '📋' },
            { id: 'benchmark', label: 'Benchmarking', icon: '📈' },
            { id: 'export', label: 'Export & Share', icon: '📤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Compliant Areas</h3>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {Object.values(enhancedAnalysis.complianceMatrix).reduce((sum, framework) => 
                        sum + framework.clauses.passed.length, 0
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Critical Gaps</h3>
                    <div className="text-3xl font-bold text-red-600 mt-2">
                      {Object.values(enhancedAnalysis.complianceMatrix).reduce((sum, framework) => 
                        sum + framework.critical, 0
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Total Clauses</h3>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      {Object.values(enhancedAnalysis.complianceMatrix).reduce((sum, framework) => 
                        sum + framework.clauses.passed.length + framework.clauses.failed.length + framework.clauses.partial.length, 0
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Frameworks</h3>
                    <div className="text-3xl font-bold text-purple-600 mt-2">
                      {Object.keys(enhancedAnalysis.complianceMatrix).length}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment Matrix */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(enhancedAnalysis.riskAssessment).map(([category, data]) => (
                  <div key={category} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                        data.score >= 90 ? 'low' : data.score >= 75 ? 'medium' : 'high'
                      )}`}>
                        {data.score >= 90 ? 'Low Risk' : data.score >= 75 ? 'Medium Risk' : 'High Risk'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              data.score >= 90 ? 'bg-green-500' : 
                              data.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                        {data.score}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      {data.issues.map((issue, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Framework Compliance Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.entries(enhancedAnalysis.complianceMatrix).map(([framework, data]) => (
                <div key={framework} className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <CircularProgress percentage={data.score} size={100} label={framework} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{data.gaps}</div>
                        <div className="text-gray-600">Total Gaps</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${data.critical > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {data.critical}
                        </div>
                        <div className="text-gray-600">Critical</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Clause Status</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">✓ Passed</span>
                          <span className="font-semibold text-green-600">{data.clauses.passed.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-red-700">✗ Failed</span>
                          <span className="font-semibold text-red-600">{data.clauses.failed.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-yellow-700">⚠ Partial</span>
                          <span className="font-semibold text-yellow-600">{data.clauses.partial.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900">Detailed Gap Analysis</h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by severity:</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredGaps.map((gap) => (
                <div key={gap.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(gap.severity)}`}>
                          {gap.severity}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {gap.framework} - {gap.article}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{gap.title}</h4>
                      <p className="text-gray-700 mb-4">{gap.description}</p>
                      
                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <h5 className="font-semibold text-blue-900 mb-2">💡 Recommended Action</h5>
                        <p className="text-blue-800 text-sm mb-3">{gap.recommendation}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-blue-700">
                            <strong>Effort:</strong> {gap.effort}
                          </span>
                          <span className="text-blue-700">
                            <strong>Timeline:</strong> {gap.timeline}
                          </span>
                          <span className="text-blue-700">
                            <strong>Location:</strong> {gap.location}
                          </span>
                        </div>
                      </div>

                      {gap.suggestedClause && (
                        <div className="bg-green-50 rounded-xl p-4">
                          <h5 className="font-semibold text-green-900 mb-2">📝 Suggested Clause</h5>
                          <p className="text-green-800 text-sm italic">"{gap.suggestedClause}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setShowClauseDetails(gap.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          const newSelected = new Set(selectedClauses);
                          if (newSelected.has(gap.id)) {
                            newSelected.delete(gap.id);
                          } else {
                            newSelected.add(gap.id);
                          }
                          setSelectedClauses(newSelected);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedClauses.has(gap.id)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {selectedClauses.has(gap.id) ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedClauses.size > 0 && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">
                  Bulk Actions ({selectedClauses.size} selected)
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Export Selected
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Create Action Plan
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Schedule Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Prioritized Action Plan</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4">🎯 Immediate Actions (Next 2 Weeks)</h4>
              <div className="space-y-3">
                {enhancedAnalysis.detailedGaps
                  .filter(gap => gap.severity === 'Critical')
                  .map((gap, index) => (
                    <div key={gap.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-blue-800 font-medium">{gap.title}</span>
                        <div className="text-sm text-blue-700">
                          {gap.framework} • {gap.timeline} • {gap.effort} effort
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-4">🔧 Short Term (2-6 weeks)</h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• Implement data retention schedules</li>
                  <li>• Develop breach response procedures</li>
                  <li>• Update privacy policy templates</li>
                  <li>• Set up automated compliance monitoring</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4">🌱 Long Term (6+ weeks)</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Implement comprehensive audit trails</li>
                  <li>• Deploy advanced access controls</li>
                  <li>• Establish regular compliance reviews</li>
                  <li>• Create staff training programs</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Industry Benchmarking</h3>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-6">Your Performance vs Industry Average</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Your Score</span>
                    <span className="font-bold text-blue-600">{enhancedAnalysis.benchmarkData.yourScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ width: `${enhancedAnalysis.benchmarkData.yourScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Industry Average</span>
                    <span className="font-bold text-gray-600">{enhancedAnalysis.benchmarkData.averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gray-400 h-4 rounded-full" 
                      style={{ width: `${enhancedAnalysis.benchmarkData.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Top 10% ({enhancedAnalysis.benchmarkData.industry})</span>
                    <span className="font-bold text-green-600">{enhancedAnalysis.benchmarkData.topPercentile}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{ width: `${enhancedAnalysis.benchmarkData.topPercentile}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h5 className="font-semibold text-blue-900 mb-2">📊 Your Ranking</h5>
                <p className="text-blue-800 text-sm">
                  You scored better than {enhancedAnalysis.benchmarkData.ranking} of companies in the {enhancedAnalysis.benchmarkData.industry} industry.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Export & Share Options</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Export Format</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'pdf', label: 'Executive PDF Report', icon: '📄', description: 'Complete analysis with charts and recommendations' },
                      { value: 'csv', label: 'CSV Data Export', icon: '📊', description: 'Raw data for further analysis' },
                      { value: 'json', label: 'JSON Data', icon: '🔗', description: 'Structured data for integrations' }
                    ].map((format) => (
                      <label key={format.value} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="exportFormat"
                          value={format.value}
                          checked={exportFormat === format.value}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{format.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{format.label}</div>
                              <div className="text-sm text-gray-600">{format.description}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isExporting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Report...
                    </span>
                  ) : (
                    `Export ${exportFormat.toUpperCase()} Report`
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Share Options</h4>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📧</span>
                        <span className="font-medium">Email Report</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💬</span>
                        <span className="font-medium">Send to Slack</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📁</span>
                        <span className="font-medium">Save to Drive</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📈 Report Metrics</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Total Pages:</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charts & Graphs:</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommendations:</span>
                      <span className="font-semibold">{enhancedAnalysis.detailedGaps.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Size:</span>
                      <span className="font-semibold">2.8 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnterpriseAnalysisResults;
