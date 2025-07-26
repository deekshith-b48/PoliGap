import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalDocuments: 3892,
    totalAnalyses: 5634,
    activeUsers: 234,
    systemHealth: 98.5,
    avgProcessingTime: 2.3,
    errorRate: 0.2,
    storageUsed: 78.5
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'document_upload', user: 'john.doe@company.com', timestamp: '2 minutes ago', details: 'Privacy Policy v2.1' },
    { id: 2, type: 'analysis_complete', user: 'jane.smith@corp.com', timestamp: '5 minutes ago', details: 'GDPR compliance check' },
    { id: 3, type: 'user_signup', user: 'alex.wilson@startup.io', timestamp: '12 minutes ago', details: 'New user registration' },
    { id: 4, type: 'error', user: 'system', timestamp: '15 minutes ago', details: 'PDF parsing timeout' },
    { id: 5, type: 'integration', user: 'admin', timestamp: '1 hour ago', details: 'Slack webhook configured' }
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { level: 'info', message: 'Document analysis completed successfully', timestamp: '2024-01-15 14:30:25', service: 'gemini-api' },
    { level: 'warning', message: 'Rate limit approaching for user tier', timestamp: '2024-01-15 14:28:15', service: 'auth-service' },
    { level: 'error', message: 'PDF parsing failed: corrupted file', timestamp: '2024-01-15 14:25:10', service: 'document-processor' },
    { level: 'info', message: 'New user registration completed', timestamp: '2024-01-15 14:22:05', service: 'auth-service' },
    { level: 'success', message: 'Daily backup completed successfully', timestamp: '2024-01-15 14:00:00', service: 'backup-service' }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'document_upload':
        return '📄';
      case 'analysis_complete':
        return '✅';
      case 'user_signup':
        return '👤';
      case 'error':
        return '❌';
      case 'integration':
        return '🔗';
      default:
        return '📊';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-700 bg-red-100';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100';
      case 'success':
        return 'text-green-700 bg-green-100';
      case 'info':
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  // Check if user has admin privileges (in a real app, this would be properly validated)
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';

  if (!isOpen || !isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-gray-600">System monitoring and user management</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'users', label: 'Users', icon: '👥' },
                  { id: 'documents', label: 'Documents', icon: '📄' },
                  { id: 'system', label: 'System', icon: '⚙️' },
                  { id: 'logs', label: 'Logs', icon: '📋' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-blue-600">Total Users</h3>
                        <div className="text-2xl font-bold text-blue-900 mt-1">{stats.totalUsers.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+12%</span>
                      <span className="text-blue-600 ml-1">from last month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-green-600">Documents</h3>
                        <div className="text-2xl font-bold text-green-900 mt-1">{stats.totalDocuments.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+24%</span>
                      <span className="text-green-600 ml-1">from last month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-purple-600">Analyses</h3>
                        <div className="text-2xl font-bold text-purple-900 mt-1">{stats.totalAnalyses.toLocaleString()}</div>
                      </div>
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+35%</span>
                      <span className="text-purple-600 ml-1">from last month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-orange-600">System Health</h3>
                        <div className="text-2xl font-bold text-orange-900 mt-1">{stats.systemHealth}%</div>
                      </div>
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">Excellent</span>
                      <span className="text-orange-600 ml-1">performance</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Processing Time</span>
                        <span className="font-semibold text-gray-900">{stats.avgProcessingTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Error Rate</span>
                        <span className="font-semibold text-red-600">{stats.errorRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Storage Used</span>
                        <span className="font-semibold text-gray-900">{stats.storageUsed}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Users (24h)</span>
                        <span className="font-semibold text-green-600">{stats.activeUsers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <span className="text-xl">{getActivityIcon(activity.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">{activity.details}</p>
                            <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">System Logs</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Levels</option>
                      <option>Error</option>
                      <option>Warning</option>
                      <option>Info</option>
                      <option>Success</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Services</option>
                      <option>Auth Service</option>
                      <option>Document Processor</option>
                      <option>Gemini API</option>
                      <option>Backup Service</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm">
                  <div className="space-y-2">
                    {systemLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-gray-300 text-xs">[{log.service}]</span>
                        <span className="text-white">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab content as needed */}
            {activeTab === 'users' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-600">User management interface would be implemented here</p>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Management</h3>
                <p className="text-gray-600">Document management interface would be implemented here</p>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">System Configuration</h3>
                <p className="text-gray-600">System configuration interface would be implemented here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
