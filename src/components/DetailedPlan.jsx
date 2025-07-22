import { useState } from 'react';

function DetailedPlan({ analysis, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [checkedTasks, setCheckedTasks] = useState(new Set());

  // Create prioritized task list based on severity with safety checks
  const prioritizedTasks = (analysis && analysis.gaps && Array.isArray(analysis.gaps) ? [...analysis.gaps] : [])
    .sort((a, b) => {
      const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return (severityOrder[b.severity?.toLowerCase?.()] || 0) - (severityOrder[a.severity?.toLowerCase?.()] || 0);
    });

  const toggleTaskCheck = (taskIndex) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(taskIndex)) {
      newChecked.delete(taskIndex);
    } else {
      newChecked.add(taskIndex);
    }
    setCheckedTasks(newChecked);
  };

  const getTimelineByPriority = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return { 
      time: '0-7 days', 
      label: 'IMMEDIATE', 
      icon: '🚨', 
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200' 
    };
    if (s === 'high') return { 
      time: '7-30 days', 
      label: 'URGENT', 
      icon: '⚠️', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200' 
    };
    if (s === 'medium') return { 
      time: '30-90 days', 
      label: 'MODERATE', 
      icon: '📋', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200' 
    };
    return { 
      time: '90-180 days', 
      label: 'STANDARD', 
      icon: '✅', 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200' 
    };
  };

  const getSeverityStyle = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return 'bg-red-100 text-red-800 border border-red-200';
    if (s === 'high') return 'bg-orange-100 text-orange-800 border border-orange-200';
    if (s === 'medium') return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-green-100 text-green-800 border border-green-200';
  };

  const getBusinessImpact = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'critical') return {
      text: 'Severe regulatory penalties, legal liability, immediate business risk',
      icon: '💥',
      color: 'text-red-600'
    };
    if (s === 'high') return {
      text: 'Compliance violations, reputation damage, operational disruption',
      icon: '⚡',
      color: 'text-orange-600'
    };
    if (s === 'medium') return {
      text: 'Process inefficiencies, moderate compliance gaps',
      icon: '📊',
      color: 'text-yellow-600'
    };
    return {
      text: 'Best practice enhancement, minimal business impact',
      icon: '✨',
      color: 'text-green-600'
    };
  };

  const downloadPlan = () => {
    const planContent = `
DETAILED REMEDIATION PLAN
Generated: ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

═══════════════════════════════════════════════════════════════
EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

${analysis.summary || 'Comprehensive compliance gap analysis completed.'}

Key Metrics:
• Total Compliance Gaps: ${analysis.gaps?.length || 0}
• Critical Issues: ${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length}
• High Priority Issues: ${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high').length}
• Current Compliance Score: ${analysis.overallScore || 'N/A'}%
• Estimated Completion Time: ${prioritizedTasks.length > 0 ? '30-180 days' : 'N/A'}

═══════════════════════════════════════════════════════════════
PRIORITIZED ACTION PLAN
═══════════════════════════════════════════════════════════════

${prioritizedTasks.map((task, index) => {
  const timeline = getTimelineByPriority(task.severity || 'low');
  const impact = getBusinessImpact(task.severity || 'low');
  
  return `
TASK #${index + 1} | ${task.severity?.toUpperCase() || 'MEDIUM'} PRIORITY
───────────────────────────────────────────────────────────────
Timeline: ${timeline.label} (${timeline.time})
Category: ${task.category || 'General Compliance'}
Framework: ${task.framework || 'N/A'}

Issue Identified:
${task.issue || 'No specific issue description provided'}

Recommended Action:
${task.remediation || task.recommendation || 'Review and implement appropriate controls'}

Business Impact:
${impact.text}

Implementation Steps:
1. Assess current state and gather requirements
2. Develop implementation plan and timeline  
3. Execute remediation activities
4. Test and validate improvements
5. Monitor ongoing compliance

───────────────────────────────────────────────────────────────
`;
}).join('')}

═══════════════════════════════════════════════════════════════
IMPLEMENTATION TIMELINE
═══════════════════════════════════════════════════════════════

Phase 1 - IMMEDIATE (0-7 days):
${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length > 0 
  ? prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical')
      .map((_, i) => `• Address critical issue #${prioritizedTasks.indexOf(_) + 1}`).join('\n')
  : '• No critical issues requiring immediate attention'}

Phase 2 - URGENT (7-30 days):
${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high').length > 0
  ? prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high')
      .map((_, i) => `• Implement high priority task #${prioritizedTasks.indexOf(_) + 1}`).join('\n')
  : '• Focus on medium priority improvements'}

Phase 3 - MODERATE (30-90 days):
${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'medium').length > 0
  ? prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'medium')
      .map((_, i) => `• Complete medium priority task #${prioritizedTasks.indexOf(_) + 1}`).join('\n')
  : '• Maintain current standards'}

Phase 4 - STANDARD (90-180 days):
${prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'low').length > 0
  ? prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'low')
      .map((_, i) => `• Enhance low priority area #${prioritizedTasks.indexOf(_) + 1}`).join('\n')
  : '• Ongoing monitoring and optimization'}

═══════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════

1. Review this plan with your compliance team
2. Assign responsible parties for each task
3. Set up regular progress review meetings
4. Implement monitoring and tracking systems
5. Schedule follow-up assessments

For questions or support, contact your compliance team.

Generated by PoliGap Compliance Analysis System
    `.trim();

    const blob = new Blob([planContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Remediation-Plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Detailed Remediation Plan</h1>
                <p className="text-blue-100 text-sm">Comprehensive action plan for compliance improvement</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-white text-sm">
                <div className="font-semibold">{prioritizedTasks.length} Tasks</div>
                <div className="text-blue-200">
                  {prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length} Critical
                </div>
              </div>
              <button
                onClick={downloadPlan}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all flex items-center border border-white border-opacity-20"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Plan
              </button>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-opacity-30 transition-all border border-white border-opacity-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6 bg-white bg-opacity-10 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'tasks', label: 'Action Items', icon: '✓' },
              { id: 'timeline', label: 'Timeline', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-900">{prioritizedTasks.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">�</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Critical</p>
                      <p className="text-2xl font-bold text-red-900">
                        {prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🚨</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">High Priority</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">⚠️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Compliance Score</p>
                      <p className="text-2xl font-bold text-green-900">{analysis.overallScore || '--'}%</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📈</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Executive Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.summary || 'A comprehensive compliance gap analysis has been conducted. This plan outlines the prioritized action items required to address identified gaps and improve overall compliance posture.'}
                </p>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Priority Distribution
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { severity: 'critical', label: 'Critical', count: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length, color: 'red' },
                    { severity: 'high', label: 'High', count: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high').length, color: 'orange' },
                    { severity: 'medium', label: 'Medium', count: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'medium').length, color: 'yellow' },
                    { severity: 'low', label: 'Low', count: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'low').length, color: 'green' }
                  ].map((item) => (
                    <div key={item.severity} className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-${item.color}-100 flex items-center justify-center border-4 border-${item.color}-200 mb-2`}>
                        <span className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</span>
                      </div>
                      <p className={`font-medium text-${item.color}-700`}>{item.label}</p>
                      <p className="text-gray-500 text-sm">
                        {prioritizedTasks.length > 0 ? Math.round((item.count / prioritizedTasks.length) * 100) : 0}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">✓</span>
                  Action Items ({prioritizedTasks.length})
                </h2>
                <div className="text-sm text-gray-600">
                  {checkedTasks.size} of {prioritizedTasks.length} completed
                </div>
              </div>
              
              <div className="space-y-4">
                {prioritizedTasks.map((task, index) => {
                  const timeline = getTimelineByPriority(task.severity || 'low');
                  const impact = getBusinessImpact(task.severity || 'low');
                  const isChecked = checkedTasks.has(index);
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white rounded-xl border-2 shadow-sm transition-all ${
                        isChecked ? 'border-green-200 bg-green-50' : timeline.borderColor
                      } ${isChecked ? 'opacity-75' : ''}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleTaskCheck(index)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-4 transition-all ${
                                isChecked 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isChecked && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <div>
                              <h3 className={`text-lg font-semibold flex items-center ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                <span className="text-xl mr-2">{timeline.icon}</span>
                                Task #{index + 1}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityStyle(task.severity || 'low')}`}>
                                  {(task.severity || 'Low').toUpperCase()}
                                </span>
                                {task.framework && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {task.framework}
                                  </span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${timeline.bgColor} ${timeline.color}`}>
                                  {timeline.label} ({timeline.time})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h4 className="text-red-800 font-semibold mb-2 flex items-center">
                                <span className="mr-2">🎯</span>
                                Issue Identified
                              </h4>
                              <p className="text-red-700 text-sm">
                                {task.issue || 'No specific issue description provided'}
                              </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="text-blue-800 font-semibold mb-2 flex items-center">
                                <span className="mr-2">💡</span>
                                Recommended Action
                              </h4>
                              <p className="text-blue-700 text-sm">
                                {task.remediation || task.recommendation || 'Review and implement appropriate controls'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className={`border rounded-lg p-4 ${timeline.bgColor} ${timeline.borderColor}`}>
                              <h4 className={`font-semibold mb-2 flex items-center ${timeline.color}`}>
                                <span className="mr-2">⏰</span>
                                Timeline & Priority
                              </h4>
                              <p className={`text-sm ${timeline.color}`}>
                                <strong>{timeline.label}:</strong> Complete within {timeline.time}
                              </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <h4 className={`font-semibold mb-2 flex items-center ${impact.color}`}>
                                <span className="mr-2">{impact.icon}</span>
                                Business Impact
                              </h4>
                              <p className="text-gray-700 text-sm">
                                {impact.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">�</span>
                Implementation Timeline
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    phase: 'IMMEDIATE',
                    period: '0-7 days',
                    color: 'red',
                    icon: '🚨',
                    tasks: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical')
                  },
                  {
                    phase: 'URGENT',
                    period: '7-30 days',
                    color: 'orange',
                    icon: '⚠️',
                    tasks: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high')
                  },
                  {
                    phase: 'MODERATE',
                    period: '30-90 days',
                    color: 'yellow',
                    icon: '📋',
                    tasks: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'medium')
                  },
                  {
                    phase: 'STANDARD',
                    period: '90-180 days',
                    color: 'green',
                    icon: '✅',
                    tasks: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'low')
                  }
                ].map((phase, phaseIndex) => (
                  <div key={phaseIndex} className={`bg-${phase.color}-50 border-2 border-${phase.color}-200 rounded-xl p-6`}>
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 bg-${phase.color}-500 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-white text-xl">{phase.icon}</span>
                      </div>
                      <h3 className={`font-bold text-${phase.color}-800`}>{phase.phase}</h3>
                      <p className={`text-${phase.color}-600 text-sm`}>{phase.period}</p>
                    </div>

                    <div className="space-y-2">
                      {phase.tasks.length > 0 ? (
                        phase.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className={`bg-${phase.color}-100 border border-${phase.color}-300 p-3 rounded-lg`}>
                            <div className={`font-medium text-${phase.color}-800 text-sm`}>
                              Task #{prioritizedTasks.indexOf(task) + 1}
                            </div>
                            <p className={`text-${phase.color}-700 text-xs mt-1`}>
                              {task.category || 'General Compliance'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className={`bg-${phase.color}-100 border border-${phase.color}-300 p-3 rounded-lg`}>
                          <p className={`text-${phase.color}-600 text-sm text-center`}>
                            No tasks in this phase
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <div className={`text-2xl font-bold text-${phase.color}-700`}>
                        {phase.tasks.length}
                      </div>
                      <div className={`text-${phase.color}-600 text-xs`}>
                        {phase.tasks.length === 1 ? 'Task' : 'Tasks'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Progress */}
              <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Progress</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Phase 1: Immediate Actions', completed: checkedTasks.size, total: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'critical').length, color: 'red' },
                    { label: 'Phase 2: Urgent Items', completed: 0, total: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'high').length, color: 'orange' },
                    { label: 'Phase 3: Moderate Priority', completed: 0, total: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'medium').length, color: 'yellow' },
                    { label: 'Phase 4: Standard Items', completed: 0, total: prioritizedTasks.filter(t => t.severity?.toLowerCase() === 'low').length, color: 'green' }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{phase.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${phase.color}-500 h-2 rounded-full transition-all`}
                            style={{ width: `${phase.total > 0 ? (phase.completed / phase.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {phase.completed}/{phase.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DetailedPlan;
