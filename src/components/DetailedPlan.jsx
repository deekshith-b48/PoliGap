import { useState } from 'react';

function DetailedPlan({ analysis, onClose }) {
  // Create prioritized task list based on severity with safety checks
  const prioritizedTasks = (analysis && analysis.gaps && Array.isArray(analysis.gaps) ? [...analysis.gaps] : [])
    .sort((a, b) => {
      const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return (severityOrder[b.severity?.toLowerCase?.()] || 0) - (severityOrder[a.severity?.toLowerCase?.()] || 0);
    });

  const getTimelineByPriority = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return { time: 'IMMEDIATE (0-7 days)', icon: '🚨', color: 'text-red-400' };
    if (s === 'high') return { time: 'URGENT (7-30 days)', icon: '⚠️', color: 'text-orange-400' };
    if (s === 'medium') return { time: 'MODERATE (30-90 days)', icon: '📋', color: 'text-yellow-400' };
    return { time: 'STANDARD (90-180 days)', icon: '✅', color: 'text-green-400' };
  };

  const getBusinessImpact = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'SEVERE - Potential regulatory penalties, legal liability';
    if (s === 'high') return 'HIGH - Compliance violations, reputation risk';
    if (s === 'medium') return 'MODERATE - Process improvements needed';
    return 'LOW - Best practice enhancement';
  };

  const downloadPlan = () => {
    const planContent = `
DETAILED REMEDIATION PLAN
Generated on: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${analysis.summary}

Total Compliance Gaps: ${analysis.gaps.length}
Critical Issues: ${prioritizedTasks.filter(t => t.severity.toLowerCase() === 'critical').length}
Compliance Score: ${analysis.overallScore || 'N/A'}%

PRIORITIZED ACTION PLAN
${prioritizedTasks.map((task, index) => {
  const timeline = getTimelineByPriority(task.severity);
  const impact = getBusinessImpact(task.severity);
  
  return `
PRIORITY #${index + 1}
Severity: ${task.severity.toUpperCase()}
Timeline: ${timeline.time}
Category: ${task.category}
Issue: ${task.issue}
Business Impact: ${impact}
Recommended Action: ${task.recommendation || 'Review and implement appropriate controls'}

---`;
}).join('')}

IMPLEMENTATION ROADMAP
This plan should be executed in priority order, with critical issues addressed immediately.
Regular monitoring and review should be conducted to ensure ongoing compliance.

For questions or support, contact your compliance team.
    `.trim();

    const blob = new Blob([planContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compliance-Remediation-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl border-4 border-pink-400 shadow-[8px_8px_0px_0px_#ec4899] w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-6 border-b-4 border-pink-400 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">DETAILED REMEDIATION PLAN</h1>
                <p className="text-pink-200">Prioritized action items for compliance improvement</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadPlan}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-black border-2 border-green-300 hover:bg-green-400 transition-all flex items-center"
              >
                <span className="mr-2">📥</span>
                DOWNLOAD TXT
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-3 rounded-xl font-black border-2 border-red-300 hover:bg-red-400 transition-all"
              >
                ✕ CLOSE
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-cyan-800 to-blue-800 p-6 rounded-2xl border-4 border-cyan-400 shadow-[4px_4px_0px_0px_#06b6d4]">
            <h2 className="text-2xl font-black text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              EXECUTIVE SUMMARY
            </h2>
            <p className="text-cyan-100 text-lg leading-relaxed">{analysis.summary}</p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-cyan-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-white">{analysis.gaps.length}</div>
                <div className="text-cyan-200">Total Gaps</div>
              </div>
              <div className="bg-cyan-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-white">
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'critical').length}
                </div>
                <div className="text-cyan-200">Critical Issues</div>
              </div>
              <div className="bg-cyan-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-black text-white">
                  {analysis.overallScore || 'N/A'}%
                </div>
                <div className="text-cyan-200">Compliance Score</div>
              </div>
            </div>
          </div>

          {/* Prioritized Action Plan */}
          <div className="bg-gradient-to-r from-purple-800 to-pink-900 p-6 rounded-2xl border-4 border-pink-400">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              PRIORITIZED ACTION PLAN
            </h2>

            <div className="space-y-6">
              {prioritizedTasks.map((task, index) => {
                const timeline = getTimelineByPriority(task.severity);
                
                return (
                  <div key={index} className="bg-black bg-opacity-40 p-6 rounded-2xl border-2 border-white border-opacity-30">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-black text-white flex items-center">
                        <span className="text-2xl mr-3">{timeline.icon}</span>
                        PRIORITY #{index + 1}
                      </h3>
                      <div className="flex flex-col items-end gap-2">
                        <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                          {task.severity.toUpperCase()} RISK
                        </div>
                        {task.framework && (
                          <div className="bg-white text-black px-3 py-1 rounded-lg font-bold text-xs">
                            {task.framework}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-pink-300 font-bold mb-2 flex items-center">
                            <span className="mr-2">🎯</span>
                            ACTION REQUIRED:
                          </h4>
                          <p className="text-white bg-pink-800 bg-opacity-50 p-3 rounded-lg">
                            {task.remediation}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-yellow-300 font-bold mb-2 flex items-center">
                            <span className="mr-2">⚠️</span>
                            ROOT ISSUE:
                          </h4>
                          <p className="text-white bg-yellow-800 bg-opacity-50 p-3 rounded-lg">
                            {task.issue}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className={`font-bold mb-2 flex items-center ${timeline.color}`}>
                            <span className="mr-2">⏰</span>
                            TIMELINE:
                          </h4>
                          <p className="text-white bg-gray-800 bg-opacity-50 p-3 rounded-lg font-bold">
                            {timeline.time}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-red-300 font-bold mb-2 flex items-center">
                            <span className="mr-2">💼</span>
                            BUSINESS IMPACT:
                          </h4>
                          <p className="text-white bg-red-800 bg-opacity-50 p-3 rounded-lg">
                            {getBusinessImpact(task.severity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="bg-gradient-to-r from-green-800 to-teal-800 p-6 rounded-2xl border-4 border-green-400">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center">
              <span className="text-2xl mr-2">🗺️</span>
              IMPLEMENTATION ROADMAP
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-red-700 p-4 rounded-xl">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="mr-2">🚨</span>
                  IMMEDIATE (0-7 Days)
                </h3>
                <div className="space-y-2">
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'critical').map((task, i) => (
                    <div key={i} className="text-red-100 text-sm bg-red-800 p-2 rounded">
                      • Priority #{prioritizedTasks.indexOf(task) + 1} task
                    </div>
                  ))}
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'critical').length === 0 && (
                    <div className="text-red-100 text-sm">No critical issues identified</div>
                  )}
                </div>
              </div>

              <div className="bg-orange-700 p-4 rounded-xl">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  URGENT (7-30 Days)
                </h3>
                <div className="space-y-2">
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'high').map((task, i) => (
                    <div key={i} className="text-orange-100 text-sm bg-orange-800 p-2 rounded">
                      • Priority #{prioritizedTasks.indexOf(task) + 1} task
                    </div>
                  ))}
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'high').length === 0 && (
                    <div className="text-orange-100 text-sm">Focus on medium priority items</div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-700 p-4 rounded-xl">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="mr-2">📋</span>
                  MODERATE (30-90 Days)
                </h3>
                <div className="space-y-2">
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'medium').map((task, i) => (
                    <div key={i} className="text-yellow-100 text-sm bg-yellow-800 p-2 rounded">
                      • Priority #{prioritizedTasks.indexOf(task) + 1} task
                    </div>
                  ))}
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'medium').length === 0 && (
                    <div className="text-yellow-100 text-sm">Maintain standards</div>
                  )}
                </div>
              </div>

              <div className="bg-green-700 p-4 rounded-xl">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="mr-2">✅</span>
                  STANDARD (90-180 Days)
                </h3>
                <div className="space-y-2">
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'low').map((task, i) => (
                    <div key={i} className="text-green-100 text-sm bg-green-800 p-2 rounded">
                      • Priority #{prioritizedTasks.indexOf(task) + 1} task
                    </div>
                  ))}
                  {prioritizedTasks.filter(t => t.severity.toLowerCase() === 'low').length === 0 && (
                    <div className="text-green-100 text-sm">Ongoing monitoring</div>
                  )}
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
