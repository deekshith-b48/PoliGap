import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function DashboardAdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [logs, setLogs] = useState([]);

  // Verify admin access
  const isAdmin = user?.email === 'bdeekshith412@gmail.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;

    // Mock data for admin panel
    const mockUsers = [
      {
        id: 1,
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'user',
        company: 'Tech Corp',
        createdAt: new Date('2024-01-15'),
        lastActive: new Date('2024-03-10'),
        totalAnalyses: 12,
        avgScore: 85,
        status: 'active'
      },
      {
        id: 2,
        email: 'jane.smith@healthcare.com',
        name: 'Jane Smith',
        role: 'user',
        company: 'HealthCare Inc',
        createdAt: new Date('2024-02-01'),
        lastActive: new Date('2024-03-12'),
        totalAnalyses: 8,
        avgScore: 78,
        status: 'active'
      },
      {
        id: 3,
        email: 'bdeekshith412@gmail.com',
        name: 'Admin User',
        role: 'admin',
        company: 'PoliGap',
        createdAt: new Date('2024-01-01'),
        lastActive: new Date(),
        totalAnalyses: 45,
        avgScore: 92,
        status: 'active'
      }
    ];

    const mockStats = {
      totalUsers: 127,
      activeUsers: 89,
      totalAnalyses: 1456,
      avgSystemScore: 83,
      storageUsed: '2.3 GB',
      apiCalls: 15432,
      systemUptime: '99.8%',
      pendingReviews: 5
    };

    const mockLogs = [
      {
        id: 1,
        timestamp: new Date(),
        level: 'info',
        message: 'New user registration: jane.smith@company.com',
        source: 'auth'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        level: 'warning',
        message: 'High API usage detected from user ID 15',
        source: 'api'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        level: 'success',
        message: 'System backup completed successfully',
        source: 'system'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        level: 'error',
        message: 'Failed to process document for user ID 23',
        source: 'processor'
      }
    ];

    setUsers(mockUsers);
    setSystemStats(mockStats);
    setLogs(mockLogs);
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">🚫</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'System Analytics', icon: '📊' },
    { id: 'logs', label: 'System Logs', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-orange-100">System management and user administration</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalAnalyses}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-purple-600">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.avgSystemScore}%</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-600">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">
                              {user.name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>Joined: {user.createdAt.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">Last: {user.lastActive.toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{user.totalAnalyses} analyses</div>
                        <div className="text-xs text-gray-500">{user.avgScore}% avg score</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Storage Usage</h3>
            <p className="text-2xl font-bold text-gray-900">{systemStats.storageUsed}</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">API Calls</h3>
            <p className="text-2xl font-bold text-gray-900">{systemStats.apiCalls.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-1">↗ +12% this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">System Uptime</h3>
            <p className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}</p>
            <p className="text-sm text-green-600 mt-1">Excellent performance</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Reviews</h3>
            <p className="text-2xl font-bold text-gray-900">{systemStats.pendingReviews}</p>
            <p className="text-sm text-orange-600 mt-1">Requires attention</p>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <div>
                      <p className="text-sm text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.timestamp.toLocaleString()} • {log.source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Enable maintenance mode to prevent user access</p>
                </div>
                <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                  <p className="text-sm text-gray-600">Automatically backup system data daily</p>
                </div>
                <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send email notifications for system events</p>
                </div>
                <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Clear All Logs
              </button>
              <button className="ml-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Reset System Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdminPanel;
