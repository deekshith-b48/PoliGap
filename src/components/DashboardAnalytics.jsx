import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function DashboardAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    scoreHistory: [],
    frameworkBreakdown: [],
    gapTrends: [],
    complianceMetrics: {
      totalDocuments: 0,
      averageScore: 0,
      improvementRate: 0,
      timeToCompletion: 0
    }
  });

  // Mock analytics data
  useEffect(() => {
    const mockData = {
      scoreHistory: [
        { date: '2024-01-01', score: 65 },
        { date: '2024-01-15', score: 72 },
        { date: '2024-02-01', score: 78 },
        { date: '2024-02-15', score: 85 },
        { date: '2024-03-01', score: 88 },
        { date: '2024-03-15', score: 91 }
      ],
      frameworkBreakdown: [
        { framework: 'GDPR', count: 12, avgScore: 85 },
        { framework: 'HIPAA', count: 8, avgScore: 78 },
        { framework: 'SOX', count: 5, avgScore: 92 },
        { framework: 'CCPA', count: 7, avgScore: 81 }
      ],
      gapTrends: [
        { category: 'Data Processing', gaps: 15, severity: 'high' },
        { category: 'Consent Management', gaps: 8, severity: 'medium' },
        { category: 'Data Retention', gaps: 12, severity: 'high' },
        { category: 'Security Measures', gaps: 5, severity: 'low' },
        { category: 'User Rights', gaps: 10, severity: 'medium' }
      ],
      complianceMetrics: {
        totalDocuments: 32,
        averageScore: 84,
        improvementRate: 15.2,
        timeToCompletion: 2.3
      }
    };
    setAnalyticsData(mockData);
  }, [timeRange]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFrameworkColor = (framework) => {
    const colors = {
      'GDPR': 'bg-blue-500',
      'HIPAA': 'bg-green-500',
      'SOX': 'bg-purple-500',
      'CCPA': 'bg-orange-500'
    };
    return colors[framework] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your compliance performance and trends</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.complianceMetrics.totalDocuments}</p>
              <p className="text-sm text-green-600 mt-1">↗ +12% this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.complianceMetrics.averageScore}%</p>
              <p className="text-sm text-green-600 mt-1">↗ +{analyticsData.complianceMetrics.improvementRate}% improvement</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Analysis Time</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.complianceMetrics.timeToCompletion}h</p>
              <p className="text-sm text-green-600 mt-1">↘ 23% faster</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 text-xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Gaps</p>
              <p className="text-3xl font-bold text-gray-900">
                {analyticsData.gapTrends.reduce((acc, curr) => acc + curr.gaps, 0)}
              </p>
              <p className="text-sm text-red-600 mt-1">↗ Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score History Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Score Trend</h3>
        <div className="space-y-4">
          {analyticsData.scoreHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString()}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${entry.score}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">{entry.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Breakdown and Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Framework Performance */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Framework Performance</h3>
          <div className="space-y-4">
            {analyticsData.frameworkBreakdown.map((framework, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getFrameworkColor(framework.framework)}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{framework.framework}</div>
                    <div className="text-sm text-gray-600">{framework.count} documents</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{framework.avgScore}%</div>
                  <div className="text-sm text-gray-600">avg score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Gap Categories</h3>
          <div className="space-y-4">
            {analyticsData.gapTrends
              .sort((a, b) => b.gaps - a.gaps)
              .slice(0, 5)
              .map((gap, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{gap.category}</span>
                      <span className="text-sm text-gray-600">{gap.gaps} gaps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          gap.severity === 'high' ? 'bg-red-500' :
                          gap.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(gap.gaps / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                    {gap.severity}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600">🎯</span>
              </div>
              <h4 className="font-medium text-gray-900">Priority Focus</h4>
            </div>
            <p className="text-sm text-gray-600">
              Focus on Data Processing gaps - they represent 30% of your compliance risks.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
              <h4 className="font-medium text-gray-900">Improvement Trend</h4>
            </div>
            <p className="text-sm text-gray-600">
              Your GDPR compliance improved by 15% this month. Keep up the good work!
            </p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🔄</span>
              </div>
              <h4 className="font-medium text-gray-900">Next Review</h4>
            </div>
            <p className="text-sm text-gray-600">
              Schedule quarterly reviews for SOX compliance to maintain high scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;
