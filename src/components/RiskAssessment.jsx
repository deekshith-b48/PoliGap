import { useState } from 'react';
import { analyzeDocument } from '../lib/gemini';

function RiskAssessment({ onNavigate }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationType: '',
    industry: '',
    companySize: '',
    jurisdictions: [],
    dataTypes: [],
    businessProcesses: [],
    existingControls: '',
    riskAppetite: ''
  });

  const steps = [
    { id: 1, title: 'Organization Info', icon: '🏢' },
    { id: 2, title: 'Data & Processes', icon: '💾' },
    { id: 3, title: 'Security Controls', icon: '🛡️' },
    { id: 4, title: 'Risk Profile', icon: '📊' }
  ];

  const organizationTypes = [
    'Private Company', 'Public Company', 'Non-Profit', 'Government Agency',
    'Healthcare Provider', 'Financial Institution', 'Educational Institution'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Financial Services', 'Manufacturing',
    'Retail', 'Education', 'Government', 'Energy', 'Other'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)', 
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setAssessment({
          riskScore: 75,
          riskLevel: 'Medium-High',
          priorityAreas: [
            'Data Protection Compliance',
            'Access Control Management',
            'Incident Response Planning'
          ]
        });
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Assessment error:', error);
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Organization Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Organization Type</label>
              <select
                value={formData.organizationType}
                onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select organization type...</option>
                {organizationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select industry...</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Company Size</label>
              <select
                value={formData.companySize}
                onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select company size...</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Data Types & Business Processes</h3>
            <div className="text-center py-12 text-gray-600">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <p>Data type and process selection interface would be implemented here</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Current Security Controls</h3>
            <div className="text-center py-12 text-gray-600">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <p>Security controls assessment interface would be implemented here</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Appetite & Compliance Requirements</h3>
            <div className="text-center py-12 text-gray-600">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p>Risk profile and compliance requirements interface would be implemented here</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus-ring rounded-lg px-3 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
              <p className="text-gray-600 mt-1">Comprehensive compliance risk evaluation</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {!assessment ? (
          <div className="animate-fadeInUp">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-semibold ${
                      currentStep >= step.id 
                        ? 'bg-gradient-primary text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-semibold ${
                        currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        Step {step.id}
                      </p>
                      <p className={`text-xs ${
                        currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-6 ${
                        currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="bg-gradient-primary text-white px-6 py-3 rounded-2xl font-medium btn-hover focus-ring"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-primary text-white px-6 py-3 rounded-2xl font-medium btn-hover focus-ring disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Generate Assessment'}
                </button>
              )}
            </div>

            {loading && (
              <div className="mt-8 bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-ai-pulse">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Risk Profile</h3>
                  <p className="text-gray-600">Evaluating your organization's compliance risks...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment Complete</h2>
              <p className="text-gray-600">Your organization's compliance risk profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="text-3xl font-black text-orange-600 mb-2">{assessment.riskScore}</div>
                <div className="text-sm font-semibold text-orange-800">Risk Score</div>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-200">
                <div className="text-lg font-black text-red-600 mb-2">{assessment.riskLevel}</div>
                <div className="text-sm font-semibold text-red-800">Risk Level</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-lg font-black text-blue-600 mb-2">{assessment.priorityAreas.length}</div>
                <div className="text-sm font-semibold text-blue-800">Priority Areas</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Priority Focus Areas</h3>
              <div className="space-y-3">
                {assessment.priorityAreas.map((area, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default RiskAssessment;
