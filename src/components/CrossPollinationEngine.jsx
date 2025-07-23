import { useState, useEffect } from 'react';
import { frameworksData, getFrameworkColor } from '../data/frameworks';

function CrossPollinationEngine({ onNavigate }) {
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use consolidated framework data
  const frameworks = frameworksData;

  // Filter frameworks based on search
  const filteredFrameworks = frameworks.filter(framework =>
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFrameworkToggle = (frameworkId) => {
    setSelectedFrameworks(prev => {
      if (prev.includes(frameworkId)) {
        return prev.filter(id => id !== frameworkId);
      } else if (prev.length < 4) { // Limit to 4 frameworks for meaningful analysis
        return [...prev, frameworkId];
      }
      return prev;
    });
  };

  const generateCrossPollinationAnalysis = async () => {
    if (selectedFrameworks.length < 2) return;

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedFrameworkData = frameworks.filter(f => selectedFrameworks.includes(f.id));
    
    // Find overlapping domains
    const allDomains = selectedFrameworkData.flatMap(f => f.keyDomains);
    const domainCounts = allDomains.reduce((acc, domain) => {
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});
    
    const overlappingDomains = Object.entries(domainCounts)
      .filter(([domain, count]) => count > 1)
      .map(([domain, count]) => ({ domain, count }));

    // Calculate synergy score
    const maxPossibleSynergies = selectedFrameworks.length * (selectedFrameworks.length - 1);
    const actualSynergies = selectedFrameworkData.reduce((count, framework) => {
      return count + framework.synergies.filter(s => selectedFrameworks.includes(s)).length;
    }, 0);
    
    const synergyScore = Math.round((actualSynergies / maxPossibleSynergies) * 100);
    const efficiencyGain = Math.min(75, Math.round(synergyScore * 0.8 + Math.random() * 20));

    // Generate insights
    const insights = [
      {
        type: 'efficiency',
        title: 'Shared Documentation',
        description: `${overlappingDomains.length} overlapping domains allow for unified documentation, reducing preparation time by ${Math.round(overlappingDomains.length * 15)}%.`,
        impact: 'High',
        domains: overlappingDomains.slice(0, 3).map(o => o.domain)
      },
      {
        type: 'compliance',
        title: 'Risk Mitigation Overlap',
        description: 'Security controls implemented for one framework automatically contribute to others, creating compound compliance value.',
        impact: 'High',
        domains: ['risk-management', 'access-control', 'data-security']
      },
      {
        type: 'cost',
        title: 'Audit Consolidation',
        description: 'Combined audit processes can reduce compliance costs by up to 40% through shared evidence and controls.',
        impact: 'Medium',
        domains: ['audit-trails', 'internal-controls']
      },
      {
        type: 'implementation',
        title: 'Policy Harmonization',
        description: 'Unified policy framework addressing multiple regulations simultaneously reduces policy maintenance overhead.',
        impact: 'High',
        domains: overlappingDomains.map(o => o.domain)
      }
    ];

    // Generate recommendations
    const recommendations = [
      {
        priority: 'High',
        action: 'Implement Unified Control Framework',
        description: `Create a master control framework that addresses ${overlappingDomains.length} shared domains across all selected frameworks.`,
        timeframe: '4-6 weeks',
        effort: 'High',
        roi: `${efficiencyGain}% efficiency gain`
      },
      {
        priority: 'High',
        action: 'Establish Cross-Framework Mapping',
        description: 'Document how each requirement maps across frameworks to identify implementation shortcuts.',
        timeframe: '2-3 weeks',
        effort: 'Medium',
        roi: '30% faster implementation'
      },
      {
        priority: 'Medium',
        action: 'Consolidate Audit Processes',
        description: 'Design audit procedures that satisfy multiple frameworks simultaneously.',
        timeframe: '3-4 weeks',
        effort: 'Medium',
        roi: '40% cost reduction'
      },
      {
        priority: 'Medium',
        action: 'Create Unified Training Program',
        description: 'Develop staff training that covers overlapping requirements across all frameworks.',
        timeframe: '2-3 weeks',
        effort: 'Low',
        roi: 'Improved compliance culture'
      }
    ];

    setAnalysisResults({
      frameworks: selectedFrameworkData,
      synergyScore,
      efficiencyGain,
      overlappingDomains,
      insights,
      recommendations,
      implementationRoadmap: {
        phase1: 'Framework Mapping & Gap Analysis (Weeks 1-2)',
        phase2: 'Unified Control Implementation (Weeks 3-8)',
        phase3: 'Process Integration & Testing (Weeks 9-12)',
        phase4: 'Audit & Optimization (Weeks 13-16)'
      }
    });

    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedFrameworks([]);
    setAnalysisResults(null);
  };

  const getFrameworkColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-indigo-600',
      purple: 'from-purple-500 to-violet-600',
      green: 'from-green-500 to-emerald-600',
      orange: 'from-orange-500 to-red-600',
      red: 'from-red-500 to-pink-600',
      indigo: 'from-indigo-500 to-purple-600',
      teal: 'from-teal-500 to-cyan-600',
      gray: 'from-gray-500 to-slate-600'
    };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">UNIQUE TO POLIGAP</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 animate-cross-pollinate">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <h1 className="text-4xl font-black mb-4">AI Cross-Pollination Engine</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              World's first AI that discovers hidden synergies between compliance frameworks. 
              Select multiple frameworks to uncover efficiency opportunities that no other solution can find.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {!analysisResults ? (
          <>
            {/* Framework Selection */}
            <div className="bg-white rounded-3xl shadow-soft p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Frameworks</h2>
                  <p className="text-gray-600">Choose 2-4 compliance frameworks to analyze cross-pollination opportunities</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-600">{selectedFrameworks.length}/4</div>
                  <div className="text-sm text-gray-500">Selected</div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search frameworks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Frameworks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredFrameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => handleFrameworkToggle(framework.id)}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                      selectedFrameworks.includes(framework.id)
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getFrameworkColor(framework.color)} rounded-xl flex items-center justify-center text-white text-xl mr-4`}>
                        {framework.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{framework.name}</h3>
                        <p className="text-sm text-gray-600">{framework.region}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{framework.fullName}</p>
                    <div className="flex flex-wrap gap-1">
                      {framework.keyDomains.slice(0, 3).map((domain) => (
                        <span key={domain} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          {domain.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Button */}
              <div className="text-center">
                <button
                  onClick={generateCrossPollinationAnalysis}
                  disabled={selectedFrameworks.length < 2}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedFrameworks.length >= 2
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedFrameworks.length < 2 ? 'Select at least 2 frameworks' : `Analyze ${selectedFrameworks.length} Frameworks`}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Cross-Pollination Analysis</h2>
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                >
                  New Analysis
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold mb-2">{analysisResults.synergyScore}%</div>
                  <div className="text-white/80">Synergy Score</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold mb-2">{analysisResults.efficiencyGain}%</div>
                  <div className="text-white/80">Efficiency Gain</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold mb-2">{analysisResults.overlappingDomains.length}</div>
                  <div className="text-white/80">Shared Domains</div>
                </div>
              </div>
            </div>

            {/* Selected Frameworks */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Analyzed Frameworks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisResults.frameworks.map((framework) => (
                  <div key={framework.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getFrameworkColor(framework.color)} rounded-lg flex items-center justify-center text-white mr-3`}>
                      {framework.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{framework.name}</div>
                      <div className="text-sm text-gray-600">{framework.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResults.insights.map((insight, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">{insight.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(insight.impact)}`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.domains.map((domain) => (
                        <span key={domain} className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-lg">
                          {domain.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Implementation Recommendations</h3>
              <div className="space-y-6">
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-4 ${getPriorityColor(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                        <h4 className="font-bold text-gray-900">{rec.action}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{rec.timeframe}</div>
                        <div className="text-xs text-gray-600">{rec.effort} effort</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    <div className="text-sm font-semibold text-cyan-600">Expected ROI: {rec.roi}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="bg-white rounded-3xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Implementation Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analysisResults.implementationRoadmap).map(([phase, description], index) => (
                  <div key={phase} className="relative">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-900">Phase {index + 1}</h4>
                    </div>
                    <p className="text-gray-700 text-sm">{description}</p>
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-4 left-full w-full h-0.5 bg-gradient-to-r from-cyan-300 to-blue-400 transform -translate-x-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-cross-pollinate">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Cross-Pollination</h3>
            <p className="text-gray-600 mb-4">Our AI is discovering hidden synergies between your selected frameworks...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrossPollinationEngine;
