import { useState, useEffect } from 'react';

function ComplianceMonitor({ onNavigate }) {
  const [selectedRegulations, setSelectedRegulations] = useState(['gdpr', 'ccpa']);
  const [alerts, setAlerts] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock regulation data
  const regulations = [
    { 
      id: 'gdpr', 
      name: 'GDPR', 
      fullName: 'General Data Protection Regulation',
      jurisdiction: 'EU',
      status: 'Active',
      riskLevel: 'High',
      lastChange: '2024-12-15'
    },
    { 
      id: 'ccpa', 
      name: 'CCPA', 
      fullName: 'California Consumer Privacy Act',
      jurisdiction: 'California, US',
      status: 'Active',
      riskLevel: 'Medium',
      lastChange: '2024-11-22'
    },
    { 
      id: 'hipaa', 
      name: 'HIPAA', 
      fullName: 'Health Insurance Portability and Accountability Act',
      jurisdiction: 'US',
      status: 'Active',
      riskLevel: 'High',
      lastChange: '2024-10-08'
    },
    { 
      id: 'sox', 
      name: 'SOX', 
      fullName: 'Sarbanes-Oxley Act',
      jurisdiction: 'US',
      status: 'Active',
      riskLevel: 'Medium',
      lastChange: '2024-09-18'
    },
    { 
      id: 'pci', 
      name: 'PCI DSS', 
      fullName: 'Payment Card Industry Data Security Standard',
      jurisdiction: 'Global',
      status: 'Updated',
      riskLevel: 'High',
      lastChange: '2025-01-05'
    }
  ];

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      regulation: 'GDPR',
      type: 'Amendment',
      severity: 'High',
      title: 'New Data Transfer Requirements',
      description: 'Updated requirements for international data transfers now require additional safeguards.',
      date: '2025-01-15',
      impact: 'Review and update data transfer agreements',
      status: 'New'
    },
    {
      id: 2,
      regulation: 'CCPA',
      type: 'Guidance',
      severity: 'Medium',
      title: 'Consumer Rights Clarification',
      description: 'California AG issued new guidance on consumer deletion rights.',
      date: '2025-01-10',
      impact: 'Update privacy policy and deletion procedures',
      status: 'Reviewed'
    },
    {
      id: 3,
      regulation: 'PCI DSS',
      type: 'Update',
      severity: 'High',
      title: 'Version 4.0 Implementation',
      description: 'PCI DSS v4.0 becomes mandatory for all assessments.',
      date: '2025-01-05',
      impact: 'Complete gap analysis and update security controls',
      status: 'Action Required'
    },
    {
      id: 4,
      regulation: 'HIPAA',
      type: 'Enforcement',
      severity: 'Medium',
      title: 'Increased Penalties',
      description: 'HHS announces increased penalties for HIPAA violations.',
      date: '2024-12-28',
      impact: 'Review compliance program and risk assessment',
      status: 'Acknowledged'
    }
  ];

  useEffect(() => {
    // Simulate loading alerts
    setAlerts(mockAlerts);
    setLastUpdate(new Date().toLocaleString());
  }, []);

  const handleRegulationToggle = (regId) => {
    setSelectedRegulations(prev => 
      prev.includes(regId) 
        ? prev.filter(id => id !== regId)
        : [...prev, regId]
    );
  };

  const startMonitoring = async () => {
    setMonitoring(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdate(new Date().toLocaleString());
      setMonitoring(false);
      // Add a new mock alert
      const newAlert = {
        id: Date.now(),
        regulation: 'GDPR',
        type: 'Update',
        severity: 'Medium',
        title: 'Real-time Monitoring Alert',
        description: 'This is a simulated real-time update from the compliance monitoring system.',
        date: new Date().toISOString().split('T')[0],
        impact: 'Review for potential policy updates',
        status: 'New'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'from-red-600 to-red-700 border-red-400';
      case 'Medium': return 'from-yellow-600 to-orange-600 border-yellow-400';
      case 'Low': return 'from-green-600 to-green-700 border-green-400';
      default: return 'from-gray-600 to-gray-700 border-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-red-500 text-white';
      case 'Action Required': return 'bg-orange-500 text-white';
      case 'Reviewed': return 'bg-blue-500 text-white';
      case 'Acknowledged': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-700 p-6 border-b-4 border-yellow-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black border-4 border-yellow-300 hover:bg-yellow-300 transition-all shadow-[4px_4px_0px_0px_#000]"
          >
            ← BACK TO HOME
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black text-white">COMPLIANCE MONITOR</h1>
            <p className="text-yellow-200">Real-time regulation tracking</p>
          </div>
          <div></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Dashboard Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-2xl border-4 border-blue-400 shadow-[4px_4px_0px_0px_#3b82f6]">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-black text-white">{selectedRegulations.length}</div>
              <div className="text-blue-200">Monitored Regulations</div>
            </div>
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-6 rounded-2xl border-4 border-red-400 shadow-[4px_4px_0px_0px_#ef4444]">
              <div className="text-3xl mb-2">🚨</div>
              <div className="text-2xl font-black text-white">{alerts.filter(a => a.status === 'New').length}</div>
              <div className="text-red-200">New Alerts</div>
            </div>
            <div className="bg-gradient-to-br from-orange-800 to-orange-900 p-6 rounded-2xl border-4 border-orange-400 shadow-[4px_4px_0px_0px_#f97316]">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-black text-white">{alerts.filter(a => a.status === 'Action Required').length}</div>
              <div className="text-orange-200">Action Required</div>
            </div>
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-2xl border-4 border-green-400 shadow-[4px_4px_0px_0px_#22c55e]">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-black text-white">{alerts.filter(a => a.status === 'Acknowledged').length}</div>
              <div className="text-green-200">Acknowledged</div>
            </div>
          </div>

          {/* Monitoring Controls */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border-4 border-yellow-400 shadow-[8px_8px_0px_0px_#fbbf24]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">MONITORING CONTROLS</h2>
                  <p className="text-gray-300">Last updated: {lastUpdate}</p>
                </div>
              </div>
              <button
                onClick={startMonitoring}
                disabled={monitoring}
                className="bg-gradient-to-r from-green-400 to-cyan-400 text-black text-lg font-black px-6 py-3 rounded-2xl border-4 border-green-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:bg-gray-600 disabled:text-gray-400 transition-all transform"
              >
                {monitoring ? '🔄 SCANNING...' : '🔍 SCAN NOW'}
              </button>
            </div>

            {/* Regulation Selection */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regulations.map(regulation => (
                <label key={regulation.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedRegulations.includes(regulation.id) ? 'bg-yellow-700 border-yellow-400' : 'bg-gray-700 border-gray-500 hover:border-yellow-400'}`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRegulations.includes(regulation.id)}
                      onChange={() => handleRegulationToggle(regulation.id)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <div className="font-bold text-white">{regulation.name}</div>
                      <div className="text-sm text-gray-300">{regulation.jurisdiction}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    regulation.riskLevel === 'High' ? 'bg-red-500' : 
                    regulation.riskLevel === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-green-500'
                  }`}>
                    {regulation.riskLevel}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-gradient-to-br from-purple-800 to-pink-900 p-8 rounded-3xl border-4 border-purple-400 shadow-[8px_8px_0px_0px_#a855f7]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h2 className="text-3xl font-black text-white">RECENT ALERTS</h2>
            </div>

            <div className="space-y-4">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className={`bg-gradient-to-r ${getSeverityColor(alert.severity)} p-6 rounded-2xl border-4 shadow-[4px_4px_0px_0px_#000]`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-white text-black px-3 py-1 rounded-lg font-bold mr-3">
                        {alert.regulation}
                      </div>
                      <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </div>
                    </div>
                    <div className="text-white text-sm">{alert.date}</div>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">{alert.title}</h3>
                  <p className="text-white mb-3">{alert.description}</p>
                  
                  <div className="bg-black bg-opacity-30 p-3 rounded-xl">
                    <div className="text-white font-bold text-sm mb-1">💡 RECOMMENDED ACTION:</div>
                    <div className="text-white text-sm">{alert.impact}</div>
                  </div>
                </div>
              ))}
            </div>

            {alerts.length === 0 && (
              <div className="text-center py-8 text-purple-200">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl">No alerts at this time. Your compliance monitoring is up to date!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ComplianceMonitor;
