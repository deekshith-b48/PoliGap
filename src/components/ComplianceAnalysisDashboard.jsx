import { useState } from 'react';
import PolicyContentDashboard from './PolicyContentDashboard';

function ComplianceAnalysisDashboard({ analysisResults, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFramework, setActiveFramework] = useState('GDPR');
  const [showContentDashboard, setShowContentDashboard] = useState(false);

  if (!analysisResults) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No analysis results available</p>
      </div>
    );
  }

  const { structuredAnalysis, gaps, overallScore, summary, contentScanResults } = analysisResults;
  const { redFlags = [], frameworkScores = {}, sectionAnalysis = {} } = structuredAnalysis || {};

  const severityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const severityBgColors = {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-green-50 border-green-200'
  };

  const redFlagsByCategory = (redFlags || []).reduce((acc, flag) => {
    if (!acc[flag.category]) acc[flag.category] = [];
    acc[flag.category].push(flag);
    return acc;
  }, {});

  const getSectionIcon = (sectionName) => {
    const icons = {
      dataCollection: '🔍',
      userRights: '👤',
      compliance: '⚖️',
      security: '🔒',
      retention: '📅'
    };
    return icons[sectionName] || '📋';
  };

  const getSectionName = (sectionName) => {
    const names = {
      dataCollection: 'Data Collection Practices',
      userRights: 'User Rights & Controls',
      compliance: 'Regulatory Compliance',
      security: 'Security Measures',
      retention: 'Data Retention'
    };
    return names[sectionName] || sectionName;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Compliance Analysis</h1>
                <p className="text-blue-100 font-medium">Comprehensive policy document assessment with structured analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-xl text-white p-2.5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-2">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'redflags', label: 'Red Flags', icon: '🚨' },
              { key: 'sections', label: 'Section Analysis', icon: '📋' },
              { key: 'frameworks', label: 'Framework Scores', icon: '⚖️' },
              { key: 'recommendations', label: 'Recommendations', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{overallScore}%</div>
                  <div className="text-blue-100 font-medium">Overall Score</div>
                  <div className="text-xs text-blue-200 mt-1">Compliance Rating</div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{redFlags.filter(f => f.severity === 'CRITICAL').length}</div>
                  <div className="text-red-100 font-medium">Critical Issues</div>
                  <div className="text-xs text-red-200 mt-1">Immediate attention</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{redFlags.filter(f => f.severity === 'HIGH').length}</div>
                  <div className="text-orange-100 font-medium">High Priority</div>
                  <div className="text-xs text-orange-200 mt-1">Address within 30 days</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{redFlags.length}</div>
                  <div className="text-green-100 font-medium">Total Gaps</div>
                  <div className="text-xs text-green-200 mt-1">Identified issues</div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Executive Summary
                  </h2>
                  {contentScanResults && (
                    <button
                      onClick={() => setShowContentDashboard(true)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-2xl font-semibold text-sm hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                    >
                      <span className="mr-2">📋</span>
                      View Content Analysis
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{summary}</p>

                {contentScanResults && (
                  <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">Content Scan Summary:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Policies Detected:</span>
                        <div className="font-bold text-blue-900">{contentScanResults.detectedPolicies?.length || 0}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Content Score:</span>
                        <div className="font-bold text-blue-900">{contentScanResults.completenessScore || 0}%</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Frameworks:</span>
                        <div className="font-bold text-blue-900">{Object.keys(contentScanResults.complianceReferences || {}).length}</div>
                      </div>
                      <div>
                        <span className="text-blue-600">Suggestions:</span>
                        <div className="font-bold text-blue-900">{contentScanResults.recommendations?.length || 0}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Framework Overview */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚖️</span>
                  Framework Compliance Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(frameworkScores || {}).map(([framework, data]) => (
                    <div key={framework} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">{framework}</h3>
                        <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                          data.score >= 80 ? 'bg-green-100 text-green-700' :
                          data.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {data.score}%
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Requirements Met:</span>
                          <span className="font-medium">{data.foundRequirements}/{data.totalRequirements}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maturity Level:</span>
                          <span className="font-medium">{data.maturityLevel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Red Flags Tab */}
          {activeTab === 'redflags' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🚨</span>
                  Compliance Red Flags Detected
                </h2>
                
                {Object.entries(redFlagsByCategory || {}).map(([category, flags]) => (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{category}</h3>
                    <div className="space-y-4">
                      {flags.map((flag, index) => (
                        <div key={index} className={`${severityBgColors[flag.severity.toLowerCase()]} rounded-2xl p-6 border`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 ${severityColors[flag.severity.toLowerCase()]} rounded-full mr-3 mt-1`}></div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{flag.category}</h4>
                                <p className="text-sm text-gray-600">{flag.article}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${severityColors[flag.severity.toLowerCase()]}`}>
                              {flag.severity}
                            </span>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4 mb-4">
                            <h5 className="font-semibold text-gray-800 mb-2">🎯 Detected Pattern:</h5>
                            <p className="text-gray-700 text-sm font-mono bg-gray-100 p-2 rounded">"{flag.pattern}"</p>
                          </div>
                          <div className="bg-white/60 rounded-xl p-4">
                            <h5 className="font-semibold text-gray-800 mb-2">💡 Recommended Action:</h5>
                            <p className="text-gray-700 text-sm">{flag.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {redFlags.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Critical Red Flags Detected</h3>
                    <p className="text-gray-600">Your policy document shows good compliance practices.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section Analysis Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Section-by-Section Analysis
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(sectionAnalysis || {}).map(([sectionKey, section]) => (
                    <div key={sectionKey} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getSectionIcon(sectionKey)}</span>
                          <h3 className="font-bold text-gray-900">{getSectionName(sectionKey)}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            section.score >= 80 ? 'bg-green-500' :
                            section.score >= 60 ? 'bg-yellow-500' :
                            section.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-bold text-gray-900">{section.score}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">📊 Analysis Results</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Keywords Found:</span>
                              <span className="font-medium ml-2">{section.keywords.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Red Flags:</span>
                              <span className="font-medium ml-2">{section.redFlags.length}</span>
                            </div>
                          </div>
                        </div>
                        
                        {section.redFlags.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">🚨 Red Flags in Section</h4>
                            <div className="space-y-1">
                              {section.redFlags.map((flag, idx) => (
                                <div key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  {flag}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {section.gaps.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">🎯 Identified Gaps</h4>
                            <div className="space-y-1">
                              {section.gaps.map((gap, idx) => (
                                <div key={idx} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                  {gap}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Framework Scores Tab */}
          {activeTab === 'frameworks' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚖️</span>
                  Framework Compliance Scores
                </h2>
                
                {/* Framework Selector */}
                <div className="flex space-x-2 mb-6">
                  {Object.keys(frameworkScores).map(framework => (
                    <button
                      key={framework}
                      onClick={() => setActiveFramework(framework)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        activeFramework === framework
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {framework}
                    </button>
                  ))}
                </div>
                
                {/* Framework Details */}
                {frameworkScores[activeFramework] && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {frameworkScores[activeFramework].score}%
                          </div>
                          <div className="text-gray-700 font-medium">Compliance Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-1">
                            {frameworkScores[activeFramework].foundRequirements}/{frameworkScores[activeFramework].totalRequirements}
                          </div>
                          <div className="text-gray-700 font-medium">Requirements Met</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {frameworkScores[activeFramework].maturityLevel}
                          </div>
                          <div className="text-gray-700 font-medium">Maturity Level</div>
                        </div>
                      </div>
                    </div>
                    
                    {frameworkScores[activeFramework].missingElements.length > 0 && (
                      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                        <h3 className="font-bold text-red-900 mb-4">Missing Requirements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {frameworkScores[activeFramework].missingElements.map((element, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-3 border border-red-200">
                              <div className="text-red-800 font-medium text-sm">{element}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  Prioritized Recommendations
                </h2>
                
                <div className="space-y-6">
                  {gaps.slice(0, 10).map((gap, index) => (
                    <div key={index} className={`${severityBgColors[gap.severity]} rounded-2xl p-6 border`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{gap.issue}</h3>
                            <p className="text-sm text-gray-600">{gap.framework} Framework</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${severityColors[gap.severity]}`}>
                          {gap.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="bg-white/60 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">🎯 Recommended Action:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{gap.remediation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Policy Content Dashboard */}
      {showContentDashboard && contentScanResults && (
        <PolicyContentDashboard
          contentScanResults={contentScanResults}
          onClose={() => setShowContentDashboard(false)}
        />
      )}
    </div>
  );
}

export default ComplianceAnalysisDashboard;
