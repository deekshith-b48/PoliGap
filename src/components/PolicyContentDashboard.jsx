import { useState } from 'react';

function PolicyContentDashboard({ contentScanResults, onClose }) {
  const [activePolicy, setActivePolicy] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  if (!contentScanResults) {
    return null;
  }

  const { 
    detectedPolicies, 
    complianceReferences, 
    structuredContent, 
    recommendations 
  } = contentScanResults;

  const getPolicyIcon = (policyType) => {
    const icons = {
      privacy: '🔒',
      humanRights: '⚖️',
      termsOfService: '📋',
      acceptableUse: '⚠️',
      cookiePolicy: '🍪',
      dataProcessing: '🔄',
      accessibility: '♿',
      security: '🛡️',
      refund: '💰',
      environmental: '🌱'
    };
    return icons[policyType] || '📄';
  };

  const getPolicyTypeLabel = (policyType) => {
    const labels = {
      privacy: 'Privacy Policy',
      humanRights: 'Human Rights Policy',
      termsOfService: 'Terms of Service',
      acceptableUse: 'Acceptable Use Policy',
      cookiePolicy: 'Cookie Policy',
      dataProcessing: 'Data Processing Agreement',
      accessibility: 'Accessibility Policy',
      security: 'Security Policy',
      refund: 'Refund & Cancellation Policy',
      environmental: 'Environmental Policy'
    };
    return labels[policyType] || policyType;
  };

  const getCompletenessColor = (completeness) => {
    if (completeness >= 80) return 'text-green-600 bg-green-100';
    if (completeness >= 60) return 'text-yellow-600 bg-yellow-100';
    if (completeness >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    if (confidence >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Policy Content Analysis</h1>
                <p className="text-green-100 font-medium">Comprehensive policy document structure and content assessment</p>
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
              { key: 'policies', label: 'Policy Analysis', icon: '📋' },
              { key: 'compliance', label: 'Compliance Refs', icon: '⚖️' },
              { key: 'structure', label: 'Document Structure', icon: '🏗️' },
              { key: 'recommendations', label: 'Recommendations', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white text-green-600 shadow-lg'
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{detectedPolicies.length}</div>
                  <div className="text-blue-100 font-medium">Policies Detected</div>
                  <div className="text-xs text-blue-200 mt-1">Document types identified</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">
                    {Math.round(detectedPolicies.reduce((sum, p) => sum + p.completeness, 0) / (detectedPolicies.length || 1))}%
                  </div>
                  <div className="text-green-100 font-medium">Avg Completeness</div>
                  <div className="text-xs text-green-200 mt-1">Content completeness</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{Object.keys(complianceReferences).length}</div>
                  <div className="text-purple-100 font-medium">Frameworks</div>
                  <div className="text-xs text-purple-200 mt-1">Referenced standards</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                  <div className="text-3xl font-bold mb-1">{recommendations.length}</div>
                  <div className="text-orange-100 font-medium">Recommendations</div>
                  <div className="text-xs text-orange-200 mt-1">Improvement suggestions</div>
                </div>
              </div>

              {/* Policy Overview Grid */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Policy Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {detectedPolicies.map((policy, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getPolicyIcon(policy.type)}</span>
                          <h3 className="font-bold text-gray-900 text-sm">{policy.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getCompletenessColor(policy.completeness)}`}>
                          {policy.completeness}%
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Confidence:</span>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                              <div 
                                className={`h-2 rounded-full ${getConfidenceColor(policy.confidence)}`}
                                style={{ width: `${policy.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-900 font-medium">{policy.confidence}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sections:</span>
                          <span className="text-gray-900 font-medium">
                            {Object.values(policy.sections).filter(s => s.found).length}/{Object.keys(policy.sections).length}
                          </span>
                        </div>
                        
                        {policy.missingElements.length > 0 && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                            Missing: {policy.missingElements.slice(0, 2).join(', ')}
                            {policy.missingElements.length > 2 && ` +${policy.missingElements.length - 2} more`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Policy Analysis Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Detailed Policy Analysis
                </h2>
                
                {/* Policy Selector */}
                <div className="flex space-x-2 mb-6 overflow-x-auto">
                  {detectedPolicies.map((policy, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePolicy(index)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                        activePolicy === index
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getPolicyIcon(policy.type)} {policy.name}
                    </button>
                  ))}
                </div>
                
                {/* Selected Policy Details */}
                {detectedPolicies[activePolicy] && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {detectedPolicies[activePolicy].completeness}%
                          </div>
                          <div className="text-gray-700 font-medium">Completeness</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-1">
                            {detectedPolicies[activePolicy].confidence}%
                          </div>
                          <div className="text-gray-700 font-medium">Detection Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {Object.values(detectedPolicies[activePolicy].sections).filter(s => s.found).length}
                          </div>
                          <div className="text-gray-700 font-medium">Sections Found</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(detectedPolicies[activePolicy].sections).map(([sectionKey, section]) => (
                        <div key={sectionKey} className={`rounded-2xl p-6 border ${
                          section.found ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 capitalize">{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`w-3 h-3 rounded-full ${section.found ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-sm font-medium">{section.confidence}%</span>
                            </div>
                          </div>
                          
                          {section.elements.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Found Elements:</h4>
                              <div className="flex flex-wrap gap-1">
                                {section.elements.slice(0, 5).map((element, idx) => (
                                  <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                    {element}
                                  </span>
                                ))}
                                {section.elements.length > 5 && (
                                  <span className="text-xs text-gray-500">+{section.elements.length - 5} more</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {section.missingElements.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Missing Elements:</h4>
                              <div className="flex flex-wrap gap-1">
                                {section.missingElements.slice(0, 3).map((element, idx) => (
                                  <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                    {element}
                                  </span>
                                ))}
                                {section.missingElements.length > 3 && (
                                  <span className="text-xs text-gray-500">+{section.missingElements.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compliance References Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">⚖️</span>
                  Compliance Framework References
                </h2>
                
                {Object.keys(complianceReferences).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Compliance References Found</h3>
                    <p className="text-gray-600">Add specific framework references to improve compliance documentation.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(complianceReferences).map(([framework, refs]) => (
                      <div key={framework} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                          <span className="text-lg mr-2">
                            {framework === 'GDPR' ? '🇪🇺' : 
                             framework === 'CCPA' ? '🇺🇸' : 
                             framework === 'HIPAA' ? '🏥' : 
                             framework === 'SOX' ? '📊' : '⚖️'}
                          </span>
                          {framework}
                        </h3>
                        
                        <div className="space-y-3">
                          {refs.keywords.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Keywords Found:</h4>
                              <div className="flex flex-wrap gap-1">
                                {refs.keywords.map((keyword, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {refs.articles && refs.articles.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Articles Referenced:</h4>
                              <div className="flex flex-wrap gap-1">
                                {refs.articles.map((article, idx) => (
                                  <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                    {article}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {refs.sections && refs.sections.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Sections Referenced:</h4>
                              <div className="flex flex-wrap gap-1">
                                {refs.sections.map((section, idx) => (
                                  <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                    {section}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Structure Tab */}
          {activeTab === 'structure' && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🏗️</span>
                  Document Structure Analysis
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Metadata */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Document Metadata</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">{structuredContent.version || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective Date:</span>
                        <span className="font-medium">{structuredContent.effectiveDate || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headers Found:</span>
                        <span className="font-medium">{structuredContent.headers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metadata Fields:</span>
                        <span className="font-medium">{Object.keys(structuredContent.metadata).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Headers */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Document Headers</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {structuredContent.headers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No structured headers detected</p>
                      ) : (
                        structuredContent.headers.slice(0, 10).map((header, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <span className="text-gray-400 mr-2">H{header.level || 1}</span>
                            <span className="text-gray-900 truncate">{header.text}</span>
                          </div>
                        ))
                      )}
                      {structuredContent.headers.length > 10 && (
                        <p className="text-gray-500 text-xs">+{structuredContent.headers.length - 10} more headers</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Additional Metadata */}
                {Object.keys(structuredContent.metadata).length > 0 && (
                  <div className="bg-blue-50 rounded-2xl p-6 mt-6">
                    <h3 className="font-bold text-gray-900 mb-4">Additional Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(structuredContent.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
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
                  Content Improvement Recommendations
                </h2>
                
                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Recommendations</h3>
                    <p className="text-gray-600">Your policy content is well-structured and complete.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recommendations.map((rec, index) => (
                      <div key={index} className={`rounded-2xl p-6 border ${
                        rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                        rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                              rec.priority === 'high' ? 'bg-red-500' :
                              rec.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}>
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 capitalize">{rec.type.replace('_', ' ')}</h3>
                              {rec.policy && <p className="text-sm text-gray-600">Related to: {rec.policy}</p>}
                              {rec.framework && <p className="text-sm text-gray-600">Framework: {rec.framework}</p>}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            rec.priority === 'high' ? 'bg-red-500 text-white' :
                            rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-800 mb-4">{rec.message}</p>
                        
                        {rec.missingElements && rec.missingElements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Missing Elements:</h4>
                            <div className="flex flex-wrap gap-2">
                              {rec.missingElements.map((element, idx) => (
                                <span key={idx} className="bg-white px-3 py-1 rounded-lg text-sm border border-gray-200">
                                  {element}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default PolicyContentDashboard;
