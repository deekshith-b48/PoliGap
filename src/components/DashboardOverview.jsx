import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineUpload,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineClock
} from 'react-icons/hi';
import {
  MdAnalytics,
  MdSecurity,
  MdTrendingUp,
  MdAssignment
} from 'react-icons/md';

function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    avgComplianceScore: 0,
    criticalGaps: 0,
    lastAnalysis: null
  });

  // Mock data - in real app, this would come from Supabase
  useEffect(() => {
    // Simulate loading recent analyses
    const mockAnalyses = [
      {
        id: 1,
        documentName: 'Privacy Policy v2.1',
        framework: 'GDPR',
        score: 85,
        status: 'completed',
        analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        gaps: 3
      },
      {
        id: 2,
        documentName: 'Terms of Service',
        framework: 'CCPA',
        score: 72,
        status: 'completed',
        analyzedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        gaps: 5
      },
      {
        id: 3,
        documentName: 'Data Processing Agreement',
        framework: 'HIPAA',
        score: 91,
        status: 'completed',
        analyzedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        gaps: 1
      }
    ];

    setRecentAnalyses(mockAnalyses);
    setStats({
      totalAnalyses: mockAnalyses.length,
      avgComplianceScore: Math.round(mockAnalyses.reduce((acc, curr) => acc + curr.score, 0) / mockAnalyses.length),
      criticalGaps: mockAnalyses.reduce((acc, curr) => acc + curr.gaps, 0),
      lastAnalysis: mockAnalyses[0]?.analyzedAt
    });
  }, []);

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Analyze a new policy document',
      icon: HiOutlineUpload,
      action: () => navigate('/analyzer'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Generate Policy',
      description: 'Create a new compliance document',
      icon: HiOutlineSparkles,
      action: () => navigate('/generator'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Risk Assessment',
      description: 'Evaluate organizational risk',
      icon: HiOutlineShieldCheck,
      action: () => navigate('/assessment'),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Learn Frameworks',
      description: 'Explore compliance guides',
      icon: HiOutlineAcademicCap,
      action: () => navigate('/compliances'),
      color: 'from-green-500 to-green-600'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return '✅';
    if (score >= 75) return '⚠️';
    return '❌';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-blue-100">
              {stats.totalAnalyses === 0 
                ? "Ready to start your first compliance analysis?"
                : `You have ${stats.totalAnalyses} analyses completed with an average score of ${stats.avgComplianceScore}%`
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgComplianceScore}%</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(stats.avgComplianceScore)}`}>
              <span className="text-xl">{getScoreIcon(stats.avgComplianceScore)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.criticalGaps}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-orange-600 text-xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Analysis</p>
              <p className="text-sm font-bold text-gray-900">
                {stats.lastAnalysis 
                  ? stats.lastAnalysis.toLocaleDateString()
                  : 'None yet'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">🕒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Analyses</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">���</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-4">
              Upload your first policy document to get started with compliance analysis.
            </p>
            <button
              onClick={() => navigate('/analyzer')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Start Your First Analysis
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Framework
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gaps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm">📄</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {analysis.documentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {analysis.status}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {analysis.framework}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(analysis.score)}`}>
                            {getScoreIcon(analysis.score)} {analysis.score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {analysis.gaps} gaps
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {analysis.analyzedAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
