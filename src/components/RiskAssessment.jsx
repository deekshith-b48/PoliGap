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
    securityControls: [],
    riskAppetite: '',
    complianceFrameworks: [],
    budgetRange: '',
    timeline: ''
  });

  const steps = [
    { id: 1, title: 'Organization Info', icon: '🏢', description: 'Basic organization details' },
    { id: 2, title: 'Data & Processes', icon: '💾', description: 'Data handling and business processes' },
    { id: 3, title: 'Security Controls', icon: '🛡️', description: 'Current security measures' },
    { id: 4, title: 'Risk Profile', icon: '📊', description: 'Risk tolerance and compliance needs' }
  ];

  const organizationTypes = [
    { id: 'private-company', name: 'Private Company', description: 'Privately held corporation or LLC' },
    { id: 'public-company', name: 'Public Company', description: 'Publicly traded corporation' },
    { id: 'non-profit', name: 'Non-Profit Organization', description: 'Non-profit or charitable organization' },
    { id: 'government', name: 'Government Agency', description: 'Federal, state, or local government entity' },
    { id: 'healthcare', name: 'Healthcare Provider', description: 'Hospital, clinic, or medical practice' },
    { id: 'financial', name: 'Financial Institution', description: 'Bank, credit union, or financial services' },
    { id: 'educational', name: 'Educational Institution', description: 'School, university, or training organization' },
    { id: 'startup', name: 'Startup', description: 'Early-stage technology company' }
  ];

  const industries = [
    { id: 'technology', name: 'Technology & Software', icon: '💻' },
    { id: 'healthcare', name: 'Healthcare & Life Sciences', icon: '🏥' },
    { id: 'financial', name: 'Financial Services', icon: '🏦' },
    { id: 'manufacturing', name: 'Manufacturing & Industrial', icon: '🏭' },
    { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️' },
    { id: 'education', name: 'Education & Training', icon: '🎓' },
    { id: 'government', name: 'Government & Public Sector', icon: '🏛️' },
    { id: 'energy', name: 'Energy & Utilities', icon: '⚡' },
    { id: 'media', name: 'Media & Entertainment', icon: '🎬' },
    { id: 'transportation', name: 'Transportation & Logistics', icon: '🚛' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏢' },
    { id: 'other', name: 'Other', icon: '📊' }
  ];

  const companySizes = [
    { id: 'micro', name: 'Micro (1-10 employees)', description: 'Small team or startup' },
    { id: 'small', name: 'Small (11-50 employees)', description: 'Small business' },
    { id: 'medium', name: 'Medium (51-200 employees)', description: 'Mid-sized company' },
    { id: 'large', name: 'Large (201-1000 employees)', description: 'Large organization' },
    { id: 'enterprise', name: 'Enterprise (1000+ employees)', description: 'Enterprise corporation' }
  ];

  const dataTypes = [
    { id: 'personal-data', name: 'Personal Data (PII)', description: 'Names, addresses, phone numbers, emails' },
    { id: 'financial-data', name: 'Financial Data', description: 'Payment info, bank details, financial records' },
    { id: 'health-data', name: 'Health Information (PHI)', description: 'Medical records, health data, HIPAA-covered info' },
    { id: 'employee-data', name: 'Employee Data', description: 'HR records, payroll, performance data' },
    { id: 'customer-data', name: 'Customer Data', description: 'Purchase history, preferences, behavior data' },
    { id: 'intellectual-property', name: 'Intellectual Property', description: 'Trade secrets, patents, proprietary information' },
    { id: 'system-data', name: 'System & Log Data', description: 'Application logs, system metrics, security logs' }
  ];

  const businessProcesses = [
    { id: 'data-collection', name: 'Data Collection & Processing', description: 'How you collect and process customer data' },
    { id: 'payment-processing', name: 'Payment Processing', description: 'Handling credit cards and financial transactions' },
    { id: 'user-authentication', name: 'User Authentication', description: 'Login systems and identity verification' },
    { id: 'data-sharing', name: 'Third-party Data Sharing', description: 'Sharing data with vendors, partners, or services' },
    { id: 'cloud-storage', name: 'Cloud Storage & Services', description: 'Using cloud providers for data storage' },
    { id: 'remote-access', name: 'Remote Access', description: 'Employees accessing systems remotely' },
    { id: 'mobile-apps', name: 'Mobile Applications', description: 'Mobile apps that collect or process data' }
  ];

  const securityControls = [
    { id: 'encryption', name: 'Data Encryption', description: 'Encryption at rest and in transit' },
    { id: 'access-control', name: 'Access Controls', description: 'Role-based access and user permissions' },
    { id: 'mfa', name: 'Multi-Factor Authentication', description: 'Two-factor or multi-factor authentication' },
    { id: 'firewalls', name: 'Firewalls & Network Security', description: 'Network perimeter protection' },
    { id: 'endpoint-protection', name: 'Endpoint Protection', description: 'Antivirus, EDR, device management' },
    { id: 'backup-recovery', name: 'Backup & Recovery', description: 'Data backup and disaster recovery plans' },
    { id: 'security-monitoring', name: 'Security Monitoring', description: 'SIEM, logging, and threat detection' },
    { id: 'employee-training', name: 'Security Training', description: 'Regular security awareness training' },
    { id: 'incident-response', name: 'Incident Response Plan', description: 'Documented incident response procedures' }
  ];

  const riskAppetiteOptions = [
    { id: 'conservative', name: 'Conservative', description: 'Minimal risk tolerance, strong security focus' },
    { id: 'moderate', name: 'Moderate', description: 'Balanced approach to risk and business needs' },
    { id: 'aggressive', name: 'Aggressive', description: 'Higher risk tolerance for business growth' }
  ];

  const complianceFrameworks = [
    { id: 'gdpr', name: 'GDPR', description: 'European Union data protection' },
    { id: 'hipaa', name: 'HIPAA', description: 'US healthcare data protection' },
    { id: 'sox', name: 'SOX', description: 'Financial reporting compliance' },
    { id: 'pci-dss', name: 'PCI DSS', description: 'Payment card security' },
    { id: 'iso-27001', name: 'ISO 27001', description: 'Information security management' },
    { id: 'nist', name: 'NIST CSF', description: 'Cybersecurity framework' },
    { id: 'ccpa', name: 'CCPA', description: 'California privacy protection' }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call with form data analysis
      setTimeout(() => {
        const riskScore = calculateRiskScore();
        setAssessment({
          riskScore,
          riskLevel: getRiskLevel(riskScore),
          priorityAreas: generatePriorityAreas(),
          recommendations: generateRecommendations()
        });
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Assessment error:', error);
      setLoading(false);
    }
  };

  const calculateRiskScore = () => {
    let score = 50; // Base score
    
    // Adjust based on organization type
    if (formData.organizationType === 'healthcare') score += 20;
    if (formData.organizationType === 'financial') score += 15;
    if (formData.organizationType === 'public-company') score += 10;
    
    // Adjust based on data types
    if (formData.dataTypes.includes('health-data')) score += 15;
    if (formData.dataTypes.includes('financial-data')) score += 10;
    if (formData.dataTypes.includes('personal-data')) score += 5;
    
    // Reduce based on security controls
    score -= formData.securityControls.length * 3;
    
    return Math.min(Math.max(score, 20), 95);
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'Critical';
    if (score >= 65) return 'High';
    if (score >= 45) return 'Medium';
    return 'Low';
  };

  const generatePriorityAreas = () => {
    const areas = [];
    if (formData.dataTypes.includes('health-data')) areas.push('HIPAA Compliance & PHI Protection');
    if (formData.dataTypes.includes('financial-data')) areas.push('PCI DSS & Financial Data Security');
    if (formData.dataTypes.includes('personal-data')) areas.push('GDPR/CCPA Privacy Compliance');
    if (!formData.securityControls.includes('mfa')) areas.push('Multi-Factor Authentication Implementation');
    if (!formData.securityControls.includes('encryption')) areas.push('Data Encryption at Rest & Transit');
    if (!formData.securityControls.includes('incident-response')) areas.push('Incident Response Planning');
    return areas.slice(0, 5);
  };

  const generateRecommendations = () => {
    return [
      'Implement comprehensive data classification program',
      'Establish regular security awareness training',
      'Deploy advanced threat detection and monitoring',
      'Create detailed incident response procedures',
      'Conduct regular compliance audits and assessments'
    ];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">🏢 Organization Information</h3>
              <p className="text-gray-600">Tell us about your organization to customize the risk assessment</p>
            </div>
            
            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Organization Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizationTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.organizationType === type.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="organizationType"
                      value={type.id}
                      checked={formData.organizationType === type.id}
                      onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                    {formData.organizationType === type.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Industry</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map((industry) => (
                  <label
                    key={industry.id}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.industry === industry.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="industry"
                      value={industry.id}
                      checked={formData.industry === industry.id}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{industry.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{industry.name}</div>
                    </div>
                    {formData.industry === industry.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Company Size</label>
              <div className="space-y-3">
                {companySizes.map((size) => (
                  <label
                    key={size.id}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.companySize === size.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="companySize"
                      value={size.id}
                      checked={formData.companySize === size.id}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{size.name}</div>
                      <div className="text-sm text-gray-600">{size.description}</div>
                    </div>
                    {formData.companySize === size.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">💾 Data Types & Business Processes</h3>
              <p className="text-gray-600">Select the types of data you handle and key business processes</p>
            </div>

            {/* Data Types */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Types of Data You Handle</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypes.map((dataType) => (
                  <label
                    key={dataType.id}
                    className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.dataTypes.includes(dataType.id)
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.dataTypes.includes(dataType.id)}
                      onChange={() => handleMultiSelect('dataTypes', dataType.id)}
                      className="mt-1 mr-3 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{dataType.name}</div>
                      <div className="text-sm text-gray-600">{dataType.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Business Processes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Key Business Processes</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessProcesses.map((process) => (
                  <label
                    key={process.id}
                    className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.businessProcesses.includes(process.id)
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.businessProcesses.includes(process.id)}
                      onChange={() => handleMultiSelect('businessProcesses', process.id)}
                      className="mt-1 mr-3 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{process.name}</div>
                      <div className="text-sm text-gray-600">{process.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">🛡️ Current Security Controls</h3>
              <p className="text-gray-600">Select the security measures you currently have in place</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Existing Security Controls</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityControls.map((control) => (
                  <label
                    key={control.id}
                    className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.securityControls.includes(control.id)
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.securityControls.includes(control.id)}
                      onChange={() => handleMultiSelect('securityControls', control.id)}
                      className="mt-1 mr-3 w-5 h-5 text-green-600 border-2 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{control.name}</div>
                      <div className="text-sm text-gray-600">{control.description}</div>
                    </div>
                    {formData.securityControls.includes(control.id) && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              
              {formData.securityControls.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-green-900">
                      {formData.securityControls.length} security control{formData.securityControls.length !== 1 ? 's' : ''} in place
                    </span>
                  </div>
                  <p className="text-green-800 text-sm">Good security foundation! This will help reduce your overall risk score.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📊 Risk Profile & Compliance</h3>
              <p className="text-gray-600">Define your risk tolerance and compliance requirements</p>
            </div>

            {/* Risk Appetite */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Risk Appetite</label>
              <div className="space-y-3">
                {riskAppetiteOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.riskAppetite === option.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="riskAppetite"
                      value={option.id}
                      checked={formData.riskAppetite === option.id}
                      onChange={(e) => setFormData({...formData, riskAppetite: e.target.value})}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    {formData.riskAppetite === option.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Required Compliance Frameworks</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {complianceFrameworks.map((framework) => (
                  <label
                    key={framework.id}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                      formData.complianceFrameworks.includes(framework.id)
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.complianceFrameworks.includes(framework.id)}
                      onChange={() => handleMultiSelect('complianceFrameworks', framework.id)}
                      className="mr-3 w-5 h-5 text-purple-600 border-2 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{framework.name}</div>
                      <div className="text-xs text-gray-600">{framework.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              {formData.complianceFrameworks.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-purple-900">
                      {formData.complianceFrameworks.length} framework{formData.complianceFrameworks.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <p className="text-purple-800 text-sm">Your assessment will include specific recommendations for these frameworks.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const isStepComplete = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.organizationType && formData.industry && formData.companySize;
      case 2:
        return formData.dataTypes.length > 0 && formData.businessProcesses.length > 0;
      case 3:
        return true; // Security controls are optional
      case 4:
        return formData.riskAppetite && formData.complianceFrameworks.length > 0;
      default:
        return false;
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
              <p className="text-gray-600 mt-1">AI-powered compliance risk evaluation</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {!assessment ? (
          <div className="animate-fadeInUp">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-semibold mb-3 transition-all ${
                        currentStep >= step.id 
                          ? 'bg-gradient-primary text-white shadow-glow' 
                          : isStepComplete(step.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        <span className="text-2xl mb-1">{step.icon}</span>
                        {isStepComplete(step.id) && currentStep > step.id && (
                          <svg className="w-4 h-4 text-white absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${
                          currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Step {step.id}
                        </p>
                        <p className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-xs ${
                          currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-8 rounded-full transition-all ${
                        currentStep > step.id ? 'bg-gradient-primary' : 'bg-gray-200'
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
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                  className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-medium btn-hover focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isStepComplete(currentStep)}
                  className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-medium btn-hover focus-ring disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Generate Assessment'}
                </button>
              )}
            </div>

            {loading && (
              <div className="mt-8 bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-ai-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Analyzing Your Risk Profile</h3>
                  <p className="text-gray-600 mb-4">Our AI is evaluating your organization's compliance risks across multiple frameworks...</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-primary h-3 rounded-full animate-ai-pulse" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment Complete</h2>
              <p className="text-gray-600">Your comprehensive compliance risk profile and recommendations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="text-4xl font-black text-orange-600 mb-2">{assessment.riskScore}</div>
                <div className="text-sm font-semibold text-orange-800">Risk Score</div>
                <div className="text-xs text-orange-700 mt-1">Out of 100</div>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-200">
                <div className="text-xl font-black text-red-600 mb-2">{assessment.riskLevel}</div>
                <div className="text-sm font-semibold text-red-800">Risk Level</div>
                <div className="text-xs text-red-700 mt-1">Overall Rating</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-4xl font-black text-blue-600 mb-2">{assessment.priorityAreas.length}</div>
                <div className="text-sm font-semibold text-blue-800">Priority Areas</div>
                <div className="text-xs text-blue-700 mt-1">For Improvement</div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Priority Focus Areas</h3>
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

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Recommendations</h3>
                <div className="space-y-3">
                  {assessment.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium text-blue-900">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action CTAs */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Address These Risks?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Use our AI-powered tools to analyze your policies and generate compliant documents based on your risk assessment
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => onNavigate('analyzer')}
                    className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold btn-hover focus-ring shadow-glow"
                  >
                    Analyze Current Policies
                  </button>
                  <button 
                    onClick={() => onNavigate('generator')}
                    className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold border border-gray-300 btn-hover focus-ring"
                  >
                    Generate New Policies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default RiskAssessment;
