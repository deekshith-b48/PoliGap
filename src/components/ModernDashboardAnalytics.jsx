import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlineCalendar,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineDownload
} from 'react-icons/hi';
import {
  MdAnalytics,
  MdInsights,
  MdSecurity,
  MdSpeed,
  MdTrendingUp
} from 'react-icons/md';

function ModernDashboardAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    overviewMetrics: {},
    complianceScores: [],
    frameworkPerformance: [],
    riskAssessment: [],
    aiRecommendations: [],
    trends: {}
  });

  // Enhanced mock analytics data with AI insights
  useEffect(() => {
    const generateDynamicData = () => {
      const now = new Date();
      const timeRangeMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      
      const days = timeRangeMap[timeRange];
      
      // Generate dynamic score history
      const scoreHistory = Array.from({ length: Math.min(days, 30) }, (_, index) => {
        const date = new Date(now - (days - index) * 24 * 60 * 60 * 1000);
        const baseScore = 75 + Math.sin(index * 0.3) * 10 + Math.random() * 5;
        return {
          date: date.toISOString().split('T')[0],
          score: Math.round(Math.max(60, Math.min(95, baseScore))),
          analyses: Math.floor(Math.random() * 5) + 1,
          improvements: Math.floor(Math.random() * 3)
        };
      });

      // Generate framework performance with realistic variations
      const frameworks = ['GDPR', 'HIPAA', 'SOX', 'CCPA', 'ISO 27001'];
      const frameworkData = frameworks.map(framework => {
        const baseScore = 70 + Math.random() * 25;
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const change = Math.random() * 10;
        
        return {
          framework,
          score: Math.round(baseScore),
          change: trend === 'up' ? `+${change.toFixed(1)}%` : `-${change.toFixed(1)}%`,
          trend,
          totalAnalyses: Math.floor(Math.random() * 20) + 5,
          criticalGaps: Math.floor(Math.random() * 8),
          lastAnalysis: new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000),
          color: {
            'GDPR': 'blue',
            'HIPAA': 'green',
            'SOX': 'purple',
            'CCPA': 'yellow',
            'ISO 27001': 'indigo'
          }[framework]
        };
      });

      // AI-generated recommendations based on performance
      const aiRecommendations = [
        {
          id: 1,
          type: 'critical',
          title: 'Data Processing Agreement Gaps Detected',
          description: 'AI analysis shows 3 critical gaps in your GDPR data processing documentation that could impact compliance scores.',
          impact: 'High',
          effort: 'Medium',
          timeToImplement: '2-3 days',
          confidence: 92,
          actions: [
            'Update third-party processor agreements',
            'Add data retention schedules',
            'Implement consent withdrawal procedures'
          ],
          frameworks: ['GDPR'],
          priority: 1
        },
        {
          id: 2,
          type: 'optimization',
          title: 'HIPAA Security Controls Enhancement',
          description: 'Your HIPAA compliance can be improved by 15% with enhanced access controls and audit logging.',
          impact: 'Medium',
          effort: 'Low',
          timeToImplement: '1-2 days',
          confidence: 87,
          actions: [
            'Implement role-based access controls',
            'Enable comprehensive audit logging',
            'Update workforce training materials'
          ],
          frameworks: ['HIPAA'],
          priority: 2
        },
        {
          id: 3,
          type: 'insight',
          title: 'Cross-Framework Policy Optimization',
          description: 'AI detected opportunities to create unified policies that address multiple compliance frameworks simultaneously.',
          impact: 'Medium',
          effort: 'High',
          timeToImplement: '1-2 weeks',
          confidence: 85,
          actions: [
            'Develop unified privacy policy',
            'Create cross-framework incident response plan',
            'Establish unified data governance framework'
          ],
          frameworks: ['GDPR', 'CCPA', 'HIPAA'],
          priority: 3
        },
        {
          id: 4,
          type: 'trend',
          title: 'Emerging Compliance Requirements',
          description: 'AI monitoring detects new regulatory developments that may affect your compliance posture in the next 6 months.',
          impact: 'Low',
          effort: 'Low',
          timeToImplement: 'Ongoing',
          confidence: 78,
          actions: [
            'Monitor EU AI Act developments',
            'Track state-level privacy legislation',
            'Prepare for cookie banner updates'
          ],
          frameworks: ['GDPR', 'CCPA'],
          priority: 4
        }
      ];

      return {
        overviewMetrics: {
          totalAnalyses: scoreHistory.reduce((sum, day) => sum + day.analyses, 0),
          averageScore: Math.round(scoreHistory.reduce((sum, day) => sum + day.score, 0) / scoreHistory.length),
          improvementRate: 12.5,
          criticalIssues: Math.floor(Math.random() * 5) + 1,
          timeToResolution: 2.3,
          complianceRating: 'Good'
        },
        complianceScores: scoreHistory,
        frameworkPerformance: frameworkData,
        riskAssessment: [
          { category: 'Data Processing', risk: 'Medium', impact: 'High', likelihood: 'Medium', score: 6 },
          { category: 'Access Controls', risk: 'Low', impact: 'Medium', likelihood: 'Low', score: 3 },
          { category: 'Incident Response', risk: 'High', impact: 'High', likelihood: 'Medium', score: 8 },
          { category: 'Third-Party Management', risk: 'Medium', impact: 'High', likelihood: 'Low', score: 5 },
          { category: 'Data Retention', risk: 'Low', impact: 'Low', likelihood: 'High', score: 4 }
        ],
        aiRecommendations,
        trends: {
          weeklyGrowth: 8.5,
          monthlyImprovement: 15.2,
          criticalIssuesReduced: 67,
          automationIncrease: 23
        }
      };
    };

    setAnalyticsData(generateDynamicData());
  }, [timeRange]);

  const getRecommendationIcon = (type) => {
    const icons = {
      'critical': HiOutlineExclamation,
      'optimization': HiOutlineTrendingUp,
      'insight': HiOutlineLightBulb,
      'trend': MdTrendingUp
    };
    return icons[type] || HiOutlineLightBulb;
  };

  const getRecommendationColor = (type) => {
    const colors = {
      'critical': 'border-red-200 bg-red-50 text-red-800',
      'optimization': 'border-blue-200 bg-blue-50 text-blue-800',
      'insight': 'border-yellow-200 bg-yellow-50 text-yellow-800',
      'trend': 'border-purple-200 bg-purple-50 text-purple-800'
    };
    return colors[type] || 'border-gray-200 bg-gray-50 text-gray-800';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'text-green-700 bg-green-100',
      'Medium': 'text-yellow-700 bg-yellow-100',
      'High': 'text-red-700 bg-red-100'
    };
    return colors[risk] || 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="space-y-8">
      {/* Header with Enhanced Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <MdAnalytics className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">AI-powered insights and compliance performance analysis</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>

          {/* Metric Filter */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All Metrics</option>
            <option value="compliance">Compliance Only</option>
            <option value="security">Security Only</option>
            <option value="performance">Performance Only</option>
          </select>

          {/* Refresh Button */}
          <button className="p-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all hover:scale-105">
            <HiOutlineRefresh className="w-5 h-5" />
          </button>

          {/* Export Button */}
          <button className="p-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all hover:scale-105">
            <HiOutlineDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <HiOutlineChartBar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold flex items-center">
              <HiOutlineTrendingUp className="w-4 h-4 mr-1" />
              +{analyticsData.trends.weeklyGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overviewMetrics.totalAnalyses}</h3>
          <p className="text-gray-600 text-sm">Total Analyses</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <MdSpeed className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold flex items-center">
              <HiOutlineTrendingUp className="w-4 h-4 mr-1" />
              +{analyticsData.trends.monthlyImprovement}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overviewMetrics.averageScore}%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <MdSecurity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold flex items-center">
              <HiOutlineTrendingDown className="w-4 h-4 mr-1" />
              -{analyticsData.trends.criticalIssuesReduced}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overviewMetrics.criticalIssues}</h3>
          <p className="text-gray-600 text-sm">Critical Issues</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <HiOutlineCalendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-blue-600 text-sm font-semibold">
              {analyticsData.overviewMetrics.complianceRating}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overviewMetrics.timeToResolution}h</h3>
          <p className="text-gray-600 text-sm">Avg. Resolution Time</p>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <MdInsights className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
            <p className="text-gray-600">Intelligent insights to improve your compliance posture</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsData.aiRecommendations.map((recommendation) => {
            const IconComponent = getRecommendationIcon(recommendation.type);
            return (
              <div
                key={recommendation.id}
                className={`bg-white rounded-2xl p-6 border-2 ${getRecommendationColor(recommendation.type)} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {recommendation.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Confidence</div>
                    <div className="text-lg font-bold">{recommendation.confidence}%</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{recommendation.title}</h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{recommendation.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Impact</div>
                    <div className="text-sm font-semibold">{recommendation.impact}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Effort</div>
                    <div className="text-sm font-semibold">{recommendation.effort}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Timeline</div>
                    <div className="text-sm font-semibold">{recommendation.timeToImplement}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Frameworks Affected</div>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.frameworks.map((framework, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm">
                  View Details & Actions
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Framework Performance & Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Framework Performance */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <HiOutlineChartBar className="w-6 h-6 mr-3 text-blue-600" />
              Framework Performance
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.frameworkPerformance.map((framework, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full bg-${framework.color}-500`}></div>
                  <div>
                    <div className="font-semibold text-gray-900">{framework.framework}</div>
                    <div className="text-sm text-gray-600">{framework.totalAnalyses} analyses</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">{framework.score}%</div>
                  <div className={`text-sm flex items-center ${
                    framework.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {framework.trend === 'up' ? (
                      <HiOutlineTrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <HiOutlineTrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {framework.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <MdSecurity className="w-6 h-6 mr-3 text-red-600" />
              Risk Assessment
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData.riskAssessment.map((risk, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{risk.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.risk)}`}>
                      {risk.risk} Risk
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        risk.score <= 3 ? 'bg-green-500' :
                        risk.score <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(risk.score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-gray-900">{risk.score}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernDashboardAnalytics;
