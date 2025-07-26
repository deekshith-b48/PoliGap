import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function EnhancedAnalysisResults({ analysis }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  if (!analysis) return null;

  // Enhanced mock data with detailed compliance analysis
  const enhancedAnalysis = {
    ...analysis,
    overallScore: 85,
    riskLevel: 'Medium',
    lastUpdated: new Date().toISOString(),
    frameworkScores: {
      'GDPR': { score: 88, gaps: 3, critical: 1 },
      'HIPAA': { score: 82, gaps: 4, critical: 2 },
      'SOX': { score: 90, gaps: 2, critical: 0 }
    },
    riskCategories: [
      { name: 'Data Protection', score: 85, level: 'Medium', issues: 3 },
      { name: 'Access Controls', score: 92, level: 'Low', issues: 1 },
      { name: 'Incident Response', score: 78, level: 'High', issues: 5 },
      { name: 'Employee Training', score: 88, level: 'Medium', issues: 2 }
    ],
    complianceTimeline: [
      { framework: 'GDPR', deadline: '2024-03-15', status: 'on-track', progress: 85 },
      { framework: 'HIPAA', deadline: '2024-04-01', status: 'delayed', progress: 65 },
      { framework: 'SOX', deadline: '2024-02-28', status: 'completed', progress: 100 }
    ],
    detailedGaps: [
      {
        id: 1,
        title: 'Data Retention Policy Missing',
        framework: 'GDPR',
        severity: 'Critical',
        description: 'No clear data retention periods specified for personal data',
        recommendation: 'Implement clear data retention schedules with automatic deletion',
        effort: 'High',
        timeline: '2-3 weeks'
      },
      {
        id: 2,
        title: 'Breach Notification Procedures',
        framework: 'GDPR',
        severity: 'High',
        description: 'Breach notification process not clearly documented',
        recommendation: 'Develop comprehensive breach response procedures',
        effort: 'Medium',
        timeline: '1-2 weeks'
      },
      {
        id: 3,
        title: 'Employee Access Reviews',
        framework: 'SOX',
        severity: 'Medium',
        description: 'Regular access reviews not documented',
        recommendation: 'Implement quarterly access review process',
        effort: 'Low',
        timeline: '1 week'
      }
    ]
  };

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-700 bg-green-100 border-green-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    
    // In a real app, this would generate and download the report
    console.log(`Exporting analysis report as ${exportFormat.toUpperCase()}`);
  };

  const ScoreChart = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={getScoreColor(score)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</div>
            <div className="text-xs text-gray-600">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Compliance Analysis Report</h2>
            <p className="text-blue-100">
              Analysis completed on {new Date(enhancedAnalysis.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{enhancedAnalysis.overallScore}%</div>
            <div className="text-blue-100">Overall Score</div>
            <div className={`mt-2 px-3 py-1 rounded-full text-sm border ${
              enhancedAnalysis.riskLevel === 'Low' ? 'bg-green-100 text-green-800 border-green-200' :
              enhancedAnalysis.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-red-100 text-red-800 border-red-200'
            }`}>
              {enhancedAnalysis.riskLevel} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-8 px-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'frameworks', label: 'Frameworks', icon: '🛡️' },
            { id: 'gaps', label: 'Gaps & Risks', icon: '⚠️' },
            { id: 'recommendations', label: 'Action Plan', icon: '✅' },
            { id: 'export', label: 'Export', icon: '📤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Compliant Areas</h3>
                    <div className="text-3xl font-bold text-green-600 mt-2">12</div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">Gaps Found</h3>
                    <div className="text-3xl font-bold text-yellow-600 mt-2">9</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Frameworks</h3>
                    <div className="text-3xl font-bold text-blue-600 mt-2">3</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Categories */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enhancedAnalysis.riskCategories.map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(category.level)}`}>
                        {category.level} Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getScoreColor(category.score) === 'text-green-600' ? 'bg-green-500' : 
                              getScoreColor(category.score) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                          {category.score}%
                        </div>
                        <div className="text-xs text-gray-500">{category.issues} issues</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Framework Compliance Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(enhancedAnalysis.frameworkScores).map(([framework, data]) => (
                <div key={framework} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <ScoreChart score={data.score} label={framework} />
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gaps Found:</span>
                      <span className="font-semibold">{data.gaps}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Critical Issues:</span>
                      <span className={`font-semibold ${data.critical > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {data.critical}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Timeline */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Timeline</h4>
              <div className="space-y-4">
                {enhancedAnalysis.complianceTimeline.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.framework}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'on-track' ? 'bg-blue-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">Due: {item.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Identified Gaps and Risks</h3>
            <div className="space-y-4">
              {enhancedAnalysis.detailedGaps.map((gap) => (
                <div key={gap.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{gap.title}</h4>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRiskColor(gap.severity)}`}>
                          {gap.severity}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          {gap.framework}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{gap.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 mt-4">
                    <h5 className="font-semibold text-blue-900 mb-2">💡 Recommendation</h5>
                    <p className="text-blue-800 text-sm mb-3">{gap.recommendation}</p>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-blue-700">
                        <strong>Effort:</strong> {gap.effort}
                      </span>
                      <span className="text-blue-700">
                        <strong>Timeline:</strong> {gap.timeline}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Prioritized Action Plan</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">🎯 Next Steps</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-blue-800">Address critical data retention policy gaps (GDPR)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-blue-800">Implement breach notification procedures</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-blue-800">Establish quarterly access review process</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-4">✅ Quick Wins (1-2 weeks)</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Update privacy policy template</li>
                  <li>• Create employee access review checklist</li>
                  <li>• Document current data flows</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-4">🔧 Medium Term (3-6 weeks)</h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• Implement data retention schedules</li>
                  <li>• Develop breach response procedures</li>
                  <li>• Set up automated compliance monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Export Analysis Report</h3>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Report Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'pdf', label: 'PDF Report', icon: '📄', description: 'Complete analysis with charts' },
                  { value: 'excel', label: 'Excel Spreadsheet', icon: '📊', description: 'Data tables and metrics' },
                  { value: 'json', label: 'JSON Data', icon: '🔗', description: 'Raw data for integrations' }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      exportFormat === format.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <div className="font-semibold text-gray-900">{format.label}</div>
                    <div className="text-sm text-gray-600">{format.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Report Sections</h4>
              <div className="space-y-3">
                {[
                  'Executive Summary',
                  'Compliance Scores by Framework',
                  'Detailed Gap Analysis',
                  'Risk Assessment',
                  'Prioritized Action Plan',
                  'Implementation Timeline'
                ].map((section, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                `Download ${exportFormat.toUpperCase()} Report`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedAnalysisResults;
