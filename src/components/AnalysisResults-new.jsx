import { useState } from 'react';
import DetailedPlan from './DetailedPlan';

function AnalysisResults({ analysis }) {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);

  return (
    <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border-4 border-gray-600 shadow-[8px_8px_0px_0px_#6b7280] space-y-6">
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl border-4 border-purple-300 shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">ANALYSIS RESULTS</h1>
              <p className="text-purple-100">Comprehensive compliance gap assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-black text-white">
                {analysis.totalGaps || analysis.gaps.length} 
              </div>
              <div className="text-purple-200 text-sm font-bold">GAPS IDENTIFIED</div>
            </div>
            {analysis.overallScore && (
              <div className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold border-2 border-purple-300">
                OVERALL SCORE: {analysis.overallScore}%
              </div>
            )}
            {analysis.industryBenchmark && (
              <div className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold border-2 border-cyan-300">
                {analysis.industryBenchmark.comparison.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-2xl border-4 border-blue-400 shadow-[4px_4px_0px_0px_#1d4ed8]">
        <h2 className="text-xl font-black text-white mb-3 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          EXECUTIVE SUMMARY
        </h2>
        <p className="text-blue-100 text-lg leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Gaps Section - 2x2 Grid Layout */}
      <h3 className="text-2xl font-black text-yellow-400 mb-6 flex items-center">
        <span className="text-2xl mr-2">🚨</span>
        IDENTIFIED COMPLIANCE GAPS
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {analysis.gaps.map((gap, index) => {
          const getSeverityStyle = (severity) => {
            const s = severity.toLowerCase();
            if (s === 'critical') return 'from-red-600 to-red-700 border-red-400';
            if (s === 'high') return 'from-orange-600 to-red-600 border-orange-400';
            if (s === 'medium') return 'from-yellow-600 to-orange-600 border-yellow-400';
            return 'from-green-600 to-green-700 border-green-400';
          };

          const getSeverityEmoji = (severity) => {
            const s = severity.toLowerCase();
            if (s === 'critical') return '🚨';
            if (s === 'high') return '⚠️';
            if (s === 'medium') return '📋';
            return '✅';
          };

          return (
            <div key={index} className={`bg-gradient-to-r ${getSeverityStyle(gap.severity)} p-6 rounded-2xl border-4 shadow-[4px_4px_0px_0px_#000] h-full`}>
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-white font-black text-lg flex items-center">
                  <span className="text-2xl mr-2">{getSeverityEmoji(gap.severity)}</span>
                  GAP #{index + 1}
                </h4>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-black text-white px-3 py-1 rounded-lg font-bold text-sm">
                    {gap.severity.toUpperCase()}
                  </div>
                  {gap.framework && (
                    <div className="bg-white text-black px-3 py-1 rounded-lg font-bold text-xs">
                      {gap.framework}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-black bg-opacity-40 p-4 rounded-xl border-2 border-white border-opacity-30">
                  <p className="text-white font-bold mb-2 flex items-center">
                    <span className="text-lg mr-2">🎯</span>
                    ACTION REQUIRED:
                  </p>
                  <p className="text-white text-sm">{gap.remediation}</p>
                </div>
                
                <div className="bg-black bg-opacity-40 p-4 rounded-xl border-2 border-white border-opacity-30">
                  <p className="text-white font-bold mb-2 flex items-center">
                    <span className="text-lg mr-2">⚠️</span>
                    ROOT ISSUE:
                  </p>
                  <p className="text-white text-sm">{gap.issue}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Plan Button */}
      <div className="w-full text-center">
        <div className="w-full bg-gradient-to-r from-green-700 to-emerald-800 p-6 rounded-2xl border-4 border-green-400 shadow-[4px_4px_0px_0px_#16a34a]">
          <h3 className="text-xl font-black text-white mb-4 flex items-center justify-center">
            <span className="text-2xl mr-2">📋</span>
            DETAILED REMEDIATION PLANNING
          </h3>
          <button
            onClick={() => setShowDetailedPlan(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-black px-8 py-4 rounded-2xl border-4 border-blue-300 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform"
          >
            🚀 GENERATE PLAN
          </button>
          <p className="text-green-100 text-sm mt-3">
            Get a detailed, prioritized action plan with timelines and business impact analysis
          </p>
        </div>
      </div>

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
