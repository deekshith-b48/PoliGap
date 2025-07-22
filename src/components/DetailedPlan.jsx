import { useState, useMemo } from 'react';

function DetailedPlan({ analysis, onClose }) {
  const [activeTimeframe, setActiveTimeframe] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced data processing with improved accuracy
  const processedData = useMemo(() => {
    if (!analysis || !analysis.gaps || !Array.isArray(analysis.gaps)) {
      return {
        prioritizedTasks: [],
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        averageScore: 0,
        industryComparison: 'Unknown'
      };
    }

    const prioritizedTasks = [...analysis.gaps]
      .sort((a, b) => {
        const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return (severityOrder[b.severity?.toLowerCase?.()] || 0) - (severityOrder[a.severity?.toLowerCase?.()] || 0);
      });

    const criticalCount = prioritizedTasks.filter(t => t.severity?.toLowerCase?.() === 'critical').length;
    const highCount = prioritizedTasks.filter(t => t.severity?.toLowerCase?.() === 'high').length;
    const mediumCount = prioritizedTasks.filter(t => t.severity?.toLowerCase?.() === 'medium').length;
    const lowCount = prioritizedTasks.filter(t => t.severity?.toLowerCase?.() === 'low').length;

    const averageScore = analysis.overallScore || 
                        analysis.industryBenchmark?.userScore || 
                        (analysis.benchmarkingResults?.overallResults?.averageScore) || 0;

    const industryComparison = analysis.industryBenchmark?.comparison || 
                              analysis.benchmarkingResults?.overallResults?.benchmarkComparison || 
                              'Industry Average';

    return {
      prioritizedTasks,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      averageScore,
      industryComparison
    };
  }, [analysis]);

  const getTimelineByPriority = (severity) => {
    const s = severity?.toLowerCase?.() || 'low';
    if (s === 'critical') return { 
      time: 'IMMEDIATE', 
      timeframe: '0-7 days', 
      icon: '🚨', 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    };
    if (s === 'high') return { 
      time: 'URGENT', 
      timeframe: '7-30 days', 
      icon: '⚠️', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    };
    if (s === 'medium') return { 
      time: 'MODERATE', 
      timeframe: '30-90 days', 
      icon: '📋', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    };
    return { 
      time: 'STANDARD', 
      timeframe: '90-180 days', 
      icon: '✅', 
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };

  const getBusinessImpact = (severity) => {
    const s = severity?.toLowerCase?.() || 'low';
    if (s === 'critical') return {
      impact: 'SEVERE RISK',
      description: 'Potential regulatory penalties, legal liability, immediate business disruption',
      riskLevel: 'High'
    };
    if (s === 'high') return {
      impact: 'HIGH RISK',
      description: 'Compliance violations, reputation damage, audit findings',
      riskLevel: 'Medium-High'
    };
    if (s === 'medium') return {
      impact: 'MODERATE RISK',
      description: 'Process improvements needed, efficiency gaps identified',
      riskLevel: 'Medium'
    };
    return {
      impact: 'LOW RISK',
      description: 'Best practice enhancement, optimization opportunity',
      riskLevel: 'Low'
    };
  };

  const getEstimatedEffort = (severity) => {
    const s = severity?.toLowerCase?.() || 'low';
    if (s === 'critical') return { effort: 'High', hours: '40-80 hours', resources: 'Cross-functional team' };
    if (s === 'high') return { effort: 'Medium-High', hours: '20-40 hours', resources: 'Specialized team' };
    if (s === 'medium') return { effort: 'Medium', hours: '10-20 hours', resources: 'Internal team' };
    return { effort: 'Low', hours: '5-10 hours', resources: 'Individual contributor' };
  };

  const downloadPlan = () => {
    const planContent = `
DETAILED REMEDIATION PLAN
Generated: ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

═══════════════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
${analysis?.summary || 'Comprehensive compliance analysis completed.'}

KEY METRICS:
• Total Compliance Gaps: ${processedData.prioritizedTasks.length}
• Critical Issues: ${processedData.criticalCount}
• High Priority Issues: ${processedData.highCount}
• Current Compliance Score: ${processedData.averageScore}%
• Industry Comparison: ${processedData.industryComparison}
• Risk Assessment: ${processedData.criticalCount > 0 ? 'High Risk' : processedData.highCount > 0 ? 'Medium Risk' : 'Low Risk'}

═══════════════════════════════════════════════════════════════════════════════

🎯 PRIORITIZED ACTION PLAN

${processedData.prioritizedTasks.map((task, index) => {
  const timeline = getTimelineByPriority(task.severity);
  const impact = getBusinessImpact(task.severity);
  const effort = getEstimatedEffort(task.severity);
  
  return `
PRIORITY #${index + 1} | ${task.severity?.toUpperCase?.()} SEVERITY
${timeline.icon} Timeline: ${timeline.time} (${timeline.timeframe})
🎯 Framework: ${task.framework || 'General Compliance'}
💼 Business Impact: ${impact.impact}
⚡ Estimated Effort: ${effort.effort} (${effort.hours})
👥 Resources Required: ${effort.resources}

ISSUE DESCRIPTION:
${task.issue || 'Compliance gap identified requiring attention.'}

RECOMMENDED ACTION:
${task.remediation || 'Review current controls and implement appropriate measures.'}

BUSINESS JUSTIFICATION:
${impact.description}

─────────────────────────────────────────────────────────────────────────────`;
}).join('')}

═══════════════════════════════════════════════════════════════════════════════

🗺️ IMPLEMENTATION ROADMAP

PHASE 1: IMMEDIATE (0-7 Days) - Critical Issues
${processedData.criticalCount > 0 ? 
  processedData.prioritizedTasks
    .filter(t => t.severity?.toLowerCase?.() === 'critical')
    .map((_, i) => `• Execute Priority #${processedData.prioritizedTasks.indexOf(_) + 1} action item`)
    .join('\n') : 
  '• No critical issues identified - proceed to urgent items'}

PHASE 2: URGENT (7-30 Days) - High Priority
${processedData.highCount > 0 ? 
  processedData.prioritizedTasks
    .filter(t => t.severity?.toLowerCase?.() === 'high')
    .map((_, i) => `• Complete Priority #${processedData.prioritizedTasks.indexOf(_) + 1} remediation`)
    .join('\n') : 
  '• Focus on medium priority improvements'}

PHASE 3: MODERATE (30-90 Days) - Medium Priority
${processedData.mediumCount > 0 ? 
  processedData.prioritizedTasks
    .filter(t => t.severity?.toLowerCase?.() === 'medium')
    .map((_, i) => `• Implement Priority #${processedData.prioritizedTasks.indexOf(_) + 1} enhancement`)
    .join('\n') : 
  '• Maintain current compliance standards'}

PHASE 4: STANDARD (90-180 Days) - Low Priority
${processedData.lowCount > 0 ? 
  processedData.prioritizedTasks
    .filter(t => t.severity?.toLowerCase?.() === 'low')
    .map((_, i) => `• Address Priority #${processedData.prioritizedTasks.indexOf(_) + 1} optimization`)
    .join('\n') : 
  '• Continue ongoing monitoring and maintenance'}

═══════════════════════════════════════════════════════════════════════════════

MONITORING & REVIEW
• Weekly progress reviews for critical and high priority items
• Monthly compliance scorecard updates
• Quarterly full assessment and roadmap revision
• Annual comprehensive compliance audit

For questions or support, contact your compliance team.
Generated by PoliGap AI Compliance Platform
    `.trim();

    const blob = new Blob([planContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compliance-Remediation-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTasks = useMemo(() => {
    if (activeTimeframe === 'all') return processedData.prioritizedTasks;
    return processedData.prioritizedTasks.filter(task => 
      task.severity?.toLowerCase?.() === activeTimeframe
    );
  }, [processedData.prioritizedTasks, activeTimeframe]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Detailed Remediation Plan</h1>
                <p className="text-blue-100 font-medium">Prioritized action items for compliance excellence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm"
              >
                <span className="mr-2">🔍</span>
                Filters
              </button>
              <button
                onClick={downloadPlan}
                className="bg-white/20 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm"
              >
                <span className="mr-2">📥</span>
                Export Plan
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 backdrop-blur-xl text-white p-2.5 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-2 animate-slideDown">
              {[
                { key: 'all', label: 'All Items', count: processedData.prioritizedTasks.length },
                { key: 'critical', label: 'Critical', count: processedData.criticalCount },
                { key: 'high', label: 'High', count: processedData.highCount },
                { key: 'medium', label: 'Medium', count: processedData.mediumCount },
                { key: 'low', label: 'Low', count: processedData.lowCount }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveTimeframe(filter.key)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTimeframe === filter.key
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          
          {/* Executive Summary */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-lg">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {analysis?.summary || 'Comprehensive compliance analysis has been completed, identifying key areas for improvement and providing actionable recommendations.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="text-3xl font-bold mb-1">{processedData.criticalCount}</div>
                <div className="text-red-100 font-medium">Critical Issues</div>
                <div className="text-xs text-red-200 mt-1">Immediate attention required</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="text-3xl font-bold mb-1">{processedData.highCount}</div>
                <div className="text-orange-100 font-medium">High Priority</div>
                <div className="text-xs text-orange-200 mt-1">Address within 30 days</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="text-3xl font-bold mb-1">{processedData.averageScore}%</div>
                <div className="text-blue-100 font-medium">Compliance Score</div>
                <div className="text-xs text-blue-200 mt-1">{processedData.industryComparison}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="text-3xl font-bold mb-1">{processedData.prioritizedTasks.length}</div>
                <div className="text-green-100 font-medium">Total Gaps</div>
                <div className="text-xs text-green-200 mt-1">Identified for improvement</div>
              </div>
            </div>
          </div>

          {/* Prioritized Action Plan */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-lg">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Prioritized Action Plan</h2>
              <div className="ml-auto text-sm text-gray-500">
                Showing {filteredTasks.length} of {processedData.prioritizedTasks.length} items
              </div>
            </div>

            <div className="space-y-6">
              {filteredTasks.map((task, index) => {
                const timeline = getTimelineByPriority(task.severity);
                const impact = getBusinessImpact(task.severity);
                const effort = getEstimatedEffort(task.severity);
                
                return (
                  <div key={index} className={`${timeline.bgColor} rounded-3xl p-6 border ${timeline.borderColor} shadow-sm hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{timeline.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Priority #{processedData.prioritizedTasks.indexOf(task) + 1}
                          </h3>
                          <p className="text-sm text-gray-600">{task.framework || 'General Compliance'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-xl font-semibold text-xs text-white ${
                          task.severity?.toLowerCase?.() === 'critical' ? 'bg-red-500' :
                          task.severity?.toLowerCase?.() === 'high' ? 'bg-orange-500' :
                          task.severity?.toLowerCase?.() === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}>
                          {task.severity?.toUpperCase?.()} SEVERITY
                        </div>
                        <div className="text-xs text-gray-500 bg-white/60 backdrop-blur-xl px-2 py-1 rounded-lg">
                          {timeline.timeframe}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="mr-2 text-blue-500">🎯</span>
                            Issue Description
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {task.issue || 'Compliance gap identified requiring attention and resolution.'}
                          </p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <span className="mr-2 text-green-500">✅</span>
                            Recommended Action
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {task.remediation || 'Review current controls and implement appropriate compliance measures.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2 text-orange-500">💼</span>
                            Business Impact
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Risk Level:</span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                impact.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                impact.riskLevel === 'Medium-High' ? 'bg-orange-100 text-orange-700' :
                                impact.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {impact.riskLevel}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{impact.description}</p>
                          </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/50">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="mr-2 text-purple-500">⚡</span>
                            Implementation Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Effort Level:</span>
                              <span className="text-xs font-semibold text-gray-800">{effort.effort}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Time Required:</span>
                              <span className="text-xs font-semibold text-gray-800">{effort.hours}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-600">Resources:</span>
                              <span className="text-xs font-semibold text-gray-800">{effort.resources}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-lg">🗺️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Implementation Roadmap</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  phase: 'IMMEDIATE', 
                  timeframe: '0-7 Days', 
                  severity: 'critical', 
                  icon: '🚨', 
                  color: 'from-red-500 to-red-600',
                  count: processedData.criticalCount
                },
                { 
                  phase: 'URGENT', 
                  timeframe: '7-30 Days', 
                  severity: 'high', 
                  icon: '⚠️', 
                  color: 'from-orange-500 to-orange-600',
                  count: processedData.highCount
                },
                { 
                  phase: 'MODERATE', 
                  timeframe: '30-90 Days', 
                  severity: 'medium', 
                  icon: '📋', 
                  color: 'from-yellow-500 to-yellow-600',
                  count: processedData.mediumCount
                },
                { 
                  phase: 'STANDARD', 
                  timeframe: '90-180 Days', 
                  severity: 'low', 
                  icon: '✅', 
                  color: 'from-green-500 to-green-600',
                  count: processedData.lowCount
                }
              ].map((phase, index) => (
                <div key={index} className={`bg-gradient-to-r ${phase.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{phase.icon}</span>
                    <div className="text-2xl font-bold">{phase.count}</div>
                  </div>
                  <h3 className="font-bold mb-1">{phase.phase}</h3>
                  <p className="text-sm opacity-90 mb-3">{phase.timeframe}</p>
                  <div className="space-y-1">
                    {processedData.prioritizedTasks
                      .filter(t => t.severity?.toLowerCase?.() === phase.severity)
                      .slice(0, 3)
                      .map((task, i) => (
                        <div key={i} className="text-xs bg-white/20 backdrop-blur-xl p-2 rounded-lg">
                          Priority #{processedData.prioritizedTasks.indexOf(task) + 1}
                        </div>
                      ))
                    }
                    {phase.count === 0 && (
                      <div className="text-xs bg-white/20 backdrop-blur-xl p-2 rounded-lg">
                        No items in this phase
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Timeline */}
            <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
              <h3 className="font-bold text-gray-900 mb-4">Recommended Execution Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    <strong>Week 1:</strong> Address all critical issues immediately - {processedData.criticalCount} items
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    <strong>Weeks 2-4:</strong> Complete high priority remediation - {processedData.highCount} items
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    <strong>Months 2-3:</strong> Implement medium priority improvements - {processedData.mediumCount} items
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">
                    <strong>Months 4-6:</strong> Address low priority optimizations - {processedData.lowCount} items
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DetailedPlan;
