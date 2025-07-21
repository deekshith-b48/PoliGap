import { useState } from 'react';
import DetailedPlan from './DetailedPlan';

function AnalysisResults({ analysis }) {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowDetailedPlan(true);
    }, 2000);
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
    <div className="space-y-8 animate-fadeInUp">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mr-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-gray-600">Comprehensive compliance gap assessment</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {analysis.overallScore && (
              <div className="text-center">
                <div className={`text-3xl font-black ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}%
                </div>
                <div className="text-sm text-gray-600 font-semibold">Overall Score</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900">
                {analysis.totalGaps || analysis.gaps?.length || 0} 
              </div>
              <div className="text-sm text-gray-600 font-semibold">Gaps Found</div>
            </div>
          </div>
        </div>

        {/* Industry Benchmark */}
        {analysis.industryBenchmark && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
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
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Compliance Gaps */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Identified Compliance Gaps</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(analysis.gaps && Array.isArray(analysis.gaps) ? analysis.gaps : []).map((gap, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getSeverityIcon(gap.severity)}</span>
                  <h4 className="font-bold text-gray-900 text-lg">Gap #{index + 1}</h4>
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
              
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold text-gray-900 text-sm">Issue Identified</p>
                  </div>
                  <p className="text-gray-700 text-sm">{gap.issue}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold text-gray-900 text-sm">Recommended Action</p>
                  </div>
                  <p className="text-gray-700 text-sm">{gap.remediation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Detailed Plan */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-soft border border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Detailed Remediation Plan</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get a comprehensive, prioritized action plan with timelines, resource requirements, 
            and business impact analysis to address all identified gaps.
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="bg-gradient-primary text-white text-lg font-semibold px-8 py-4 rounded-2xl btn-hover focus-ring disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
