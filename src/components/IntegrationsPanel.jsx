import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function IntegrationsPanel({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeIntegrations, setActiveIntegrations] = useState({
    slack: false,
    email: true,
    googleDrive: false,
    dropbox: false,
    jira: false,
    teams: false
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    slack: {
      webhook: '',
      channel: '#compliance',
      notifications: ['analysis_complete', 'critical_gaps']
    },
    email: {
      recipients: user?.email ? [user.email] : [],
      frequency: 'immediate',
      types: ['analysis_complete', 'critical_gaps', 'weekly_summary']
    },
    googleDrive: {
      folderId: '',
      autoExport: true,
      format: 'pdf'
    }
  });

  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get real-time notifications in your Slack channels',
      icon: '💬',
      category: 'Communication',
      features: ['Real-time alerts', 'Analysis summaries', 'Critical gap notifications'],
      setupSteps: ['Create Slack webhook', 'Configure channels', 'Set notification preferences']
    },
    {
      id: 'email',
      name: 'Email Notifications',
      description: 'Receive compliance updates via email',
      icon: '📧',
      category: 'Communication',
      features: ['Instant alerts', 'Weekly summaries', 'Custom recipients'],
      setupSteps: ['Add recipient emails', 'Choose notification types', 'Set frequency']
    },
    {
      id: 'googleDrive',
      name: 'Google Drive',
      description: 'Automatically save reports to Google Drive',
      icon: '📁',
      category: 'Storage',
      features: ['Auto-export reports', 'Organized folders', 'Version control'],
      setupSteps: ['Connect Google account', 'Choose folder', 'Configure export settings']
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Sync compliance documents with Dropbox',
      icon: '📦',
      category: 'Storage',
      features: ['Document sync', 'Team sharing', 'Backup storage'],
      setupSteps: ['Connect Dropbox', 'Set sync folder', 'Configure permissions']
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Create tickets for compliance gaps automatically',
      icon: '🎯',
      category: 'Project Management',
      features: ['Auto-create tickets', 'Gap tracking', 'Priority assignment'],
      setupSteps: ['Connect Jira account', 'Configure project', 'Set automation rules']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Share compliance updates in Teams channels',
      icon: '🏢',
      category: 'Communication',
      features: ['Channel notifications', 'Report sharing', 'Team collaboration'],
      setupSteps: ['Install Teams app', 'Configure channels', 'Set permissions']
    }
  ];

  const toggleIntegration = (integrationId) => {
    setActiveIntegrations(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const handleSettingChange = (integration, setting, value) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [setting]: value
      }
    }));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Communication':
        return 'bg-blue-100 text-blue-800';
      case 'Storage':
        return 'bg-green-100 text-green-800';
      case 'Project Management':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                <p className="text-gray-600">Connect PoliGap with your favorite tools and services</p>
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

            {/* Integration Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-600">Active Integrations</h3>
                    <div className="text-2xl font-bold text-blue-900 mt-1">
                      {Object.values(activeIntegrations).filter(Boolean).length}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-green-600">Available</h3>
                    <div className="text-2xl font-bold text-green-900 mt-1">{integrations.length}</div>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-purple-600">Categories</h3>
                    <div className="text-2xl font-bold text-purple-900 mt-1">3</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                    activeIntegrations[integration.id]
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(integration.category)}`}>
                          {integration.category}
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeIntegrations[integration.id]}
                        onChange={() => toggleIntegration(integration.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Features</h4>
                      <ul className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeIntegrations[integration.id] && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 text-sm mb-3">Setup Steps</h4>
                        <ol className="space-y-2">
                          {integration.setupSteps.map((step, index) => (
                            <li key={index} className="flex items-center text-sm text-blue-800">
                              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        
                        {/* Integration-specific settings */}
                        {integration.id === 'email' && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-1">
                                Additional Recipients
                              </label>
                              <input
                                type="email"
                                placeholder="Enter email addresses"
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-1">
                                Notification Frequency
                              </label>
                              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="immediate">Immediate</option>
                                <option value="daily">Daily Digest</option>
                                <option value="weekly">Weekly Summary</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {integration.id === 'slack' && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-1">
                                Webhook URL
                              </label>
                              <input
                                type="url"
                                placeholder="https://hooks.slack.com/services/..."
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-900 mb-1">
                                Channel
                              </label>
                              <input
                                type="text"
                                placeholder="#compliance"
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}

                        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Configure Integration
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Setup */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Setup Recommendation</h3>
                  <p className="text-gray-600 text-sm">Get started with the most popular integration combination</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">Email Notifications</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">Google Drive</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">Slack</span>
              </div>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Setup Recommended Integrations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPanel;
