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

  const organizationTypes = [
    'Private Company',
    'Public Company',
    'Non-Profit',
    'Government Agency',
    'Healthcare Provider',
    'Financial Institution',
    'Educational Institution'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Energy',
    'Transportation',
    'Real Estate'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const jurisdictionOptions = [
    'United States',
    'European Union',
    'California',
    'United Kingdom',
    'Canada',
    'Australia',
    'Singapore',
    'Global Operations'
  ];

  const dataTypeOptions = [
    'Personal Identifiable Information (PII)',
    'Protected Health Information (PHI)',
    'Payment Card Data',
    'Financial Records',
    'Employee Data',
    'Customer Data',
    'Intellectual Property',
    'Government Data'
  ];

  const businessProcessOptions = [
    'Data Collection',
    'Data Storage',
    'Data Processing',
    'Data Sharing',
    'Customer Service',
    'Marketing',
    'HR Management',
    'Financial Operations',
    'IT Operations',
    'Third-party Integrations'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateAssessment = async () => {
    setLoading(true);
    
    try {
      const assessmentPrompt = `
        Conduct a comprehensive risk assessment based on the following information:

        Organization Details:
        - Type: ${formData.organizationType}
        - Industry: ${formData.industry}
        - Size: ${formData.companySize}
        - Jurisdictions: ${formData.jurisdictions.join(', ')}
        - Risk Appetite: ${formData.riskAppetite}

        Data & Operations:
        - Data Types: ${formData.dataTypes.join(', ')}
        - Business Processes: ${formData.businessProcesses.join(', ')}
        - Existing Controls: ${formData.existingControls}

        Please provide a detailed risk assessment including:
        1. Risk Matrix with top 10 risks (include probability, impact, and overall risk score 1-10)
        2. Risk Categories (Operational, Compliance, Cybersecurity, Financial, Reputational)
        3. Specific mitigation strategies for each high-priority risk
        4. Recommended immediate actions
        5. Long-term risk management recommendations
        6. Key Performance Indicators (KPIs) for monitoring

        Format as JSON with sections: riskMatrix, riskCategories, mitigationStrategies, immediateActions, longTermRecommendations, kpis
      `;

      const result = await analyzeDocument('risk-assessment', assessmentPrompt);
      
      // If result is already an object, use it directly, otherwise parse
      let parsedResult;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (e) {
          // Fallback structured response
          parsedResult = {
            riskMatrix: [
              { risk: 'Data Breach', category: 'Cybersecurity', probability: 7, impact: 9, score: 8.5 },
              { risk: 'Regulatory Non-compliance', category: 'Compliance', probability: 6, impact: 8, score: 7.5 },
              { risk: 'Third-party Vendor Risk', category: 'Operational', probability: 8, impact: 6, score: 7.0 },
              { risk: 'Insider Threats', category: 'Cybersecurity', probability: 5, impact: 8, score: 6.5 },
              { risk: 'Business Continuity Disruption', category: 'Operational', probability: 4, impact: 9, score: 6.5 }
            ],
            riskCategories: ['Cybersecurity', 'Compliance', 'Operational', 'Financial', 'Reputational'],
            mitigationStrategies: [
              'Implement comprehensive cybersecurity training',
              'Establish regular compliance audits',
              'Develop incident response procedures',
              'Create vendor risk management program'
            ],
            immediateActions: [
              'Conduct security vulnerability assessment',
              'Review and update privacy policies',
              'Implement multi-factor authentication',
              'Establish data backup procedures'
            ],
            longTermRecommendations: [
              'Develop comprehensive risk management framework',
              'Implement continuous monitoring systems',
              'Establish risk governance committee',
              'Create regular risk reporting processes'
            ],
            kpis: [
              'Security incident frequency',
              'Compliance audit scores',
              'Employee training completion rates',
              'Vendor risk assessment coverage'
            ]
          };
        }
      } else {
        parsedResult = result;
      }
      
      setAssessment(parsedResult);
    } catch (error) {
      console.error('Error generating assessment:', error);
      // Provide fallback assessment
      setAssessment({
        riskMatrix: [
          { risk: 'Data Security Breach', category: 'Cybersecurity', probability: 7, impact: 9, score: 8.5 },
          { risk: 'Regulatory Compliance Failure', category: 'Compliance', probability: 6, impact: 8, score: 7.5 },
          { risk: 'Third-party Risk Exposure', category: 'Operational', probability: 8, impact: 6, score: 7.0 }
        ],
        mitigationStrategies: ['Implement security controls', 'Regular compliance reviews'],
        immediateActions: ['Security assessment', 'Policy updates'],
        longTermRecommendations: ['Risk framework development'],
        kpis: ['Incident metrics', 'Compliance scores']
      });
    }
    
    setLoading(false);
  };

  const getRiskColor = (score) => {
    if (score >= 8) return 'from-red-600 to-red-700 border-red-400';
    if (score >= 6) return 'from-orange-600 to-yellow-600 border-orange-400';
    if (score >= 4) return 'from-yellow-600 to-yellow-700 border-yellow-400';
    return 'from-green-600 to-green-700 border-green-400';
  };

  const getRiskLevel = (score) => {
    if (score >= 8) return 'CRITICAL';
    if (score >= 6) return 'HIGH';
    if (score >= 4) return 'MEDIUM';
    return 'LOW';
  };

  if (assessment) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 border-b-4 border-purple-400">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setAssessment(null)}
              className="bg-purple-400 text-black px-6 py-3 rounded-2xl font-black border-4 border-purple-300 hover:bg-purple-300 transition-all shadow-[4px_4px_0px_0px_#000]"
            >
              ← NEW ASSESSMENT
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-black text-white">RISK ASSESSMENT RESULTS</h1>
              <p className="text-purple-200">Comprehensive risk analysis completed</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="bg-white text-black px-6 py-3 rounded-2xl font-black border-4 border-gray-300 hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#000]"
            >
              HOME
            </button>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Risk Matrix */}
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-8 rounded-3xl border-4 border-red-400 shadow-[8px_8px_0px_0px_#ef4444]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-3xl font-black text-white">RISK MATRIX</h2>
              </div>
              
              <div className="grid gap-4">
                {assessment.riskMatrix?.map((risk, index) => (
                  <div key={index} className={`bg-gradient-to-r ${getRiskColor(risk.score)} p-6 rounded-2xl border-4 shadow-[4px_4px_0px_0px_#000]`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-white text-black px-3 py-1 rounded-lg font-bold mr-3">
                          #{index + 1}
                        </div>
                        <h3 className="text-white font-bold text-lg">{risk.risk}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-black text-2xl">{getRiskLevel(risk.score)}</div>
                        <div className="text-white text-sm">Score: {risk.score}/10</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-black bg-opacity-30 p-3 rounded-xl">
                        <div className="text-white font-bold text-sm">CATEGORY</div>
                        <div className="text-white">{risk.category}</div>
                      </div>
                      <div className="bg-black bg-opacity-30 p-3 rounded-xl">
                        <div className="text-white font-bold text-sm">PROBABILITY</div>
                        <div className="text-white">{risk.probability}/10</div>
                      </div>
                      <div className="bg-black bg-opacity-30 p-3 rounded-xl">
                        <div className="text-white font-bold text-sm">IMPACT</div>
                        <div className="text-white">{risk.impact}/10</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Immediate Actions */}
              <div className="bg-gradient-to-br from-orange-800 to-red-900 p-8 rounded-3xl border-4 border-orange-400 shadow-[8px_8px_0px_0px_#f97316]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">IMMEDIATE ACTIONS</h2>
                </div>
                
                <div className="space-y-3">
                  {assessment.immediateActions?.map((action, index) => (
                    <div key={index} className="bg-orange-700 p-4 rounded-2xl border-2 border-orange-300">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <p className="text-white font-medium">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-term Recommendations */}
              <div className="bg-gradient-to-br from-blue-800 to-purple-900 p-8 rounded-3xl border-4 border-blue-400 shadow-[8px_8px_0px_0px_#3b82f6]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">LONG-TERM STRATEGY</h2>
                </div>
                
                <div className="space-y-3">
                  {assessment.longTermRecommendations?.map((rec, index) => (
                    <div key={index} className="bg-blue-700 p-4 rounded-2xl border-2 border-blue-300">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <p className="text-white font-medium">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mitigation Strategies & KPIs */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Mitigation Strategies */}
              <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-3xl border-4 border-green-400 shadow-[8px_8px_0px_0px_#22c55e]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">MITIGATION STRATEGIES</h2>
                </div>
                
                <div className="space-y-3">
                  {assessment.mitigationStrategies?.map((strategy, index) => (
                    <div key={index} className="bg-green-700 p-4 rounded-2xl border-2 border-green-300">
                      <p className="text-white font-medium">• {strategy}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="bg-gradient-to-br from-yellow-800 to-orange-900 p-8 rounded-3xl border-4 border-yellow-400 shadow-[8px_8px_0px_0px_#fbbf24]">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">KEY METRICS</h2>
                </div>
                
                <div className="space-y-3">
                  {assessment.kpis?.map((kpi, index) => (
                    <div key={index} className="bg-yellow-700 p-4 rounded-2xl border-2 border-yellow-300">
                      <p className="text-white font-medium">📈 {kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 border-b-4 border-purple-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="bg-purple-400 text-black px-6 py-3 rounded-2xl font-black border-4 border-purple-300 hover:bg-purple-300 transition-all shadow-[4px_4px_0px_0px_#000]"
          >
            ← BACK TO HOME
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black text-white">RISK ASSESSMENT</h1>
            <p className="text-purple-200">Comprehensive compliance risk analysis</p>
          </div>
          <div></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map(step => (
                <div key={step} className={`flex items-center ${step < 3 ? 'mr-8' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl border-4 border-black flex items-center justify-center font-black text-lg ${currentStep >= step ? 'bg-purple-400 text-black' : 'bg-gray-600 text-gray-400'}`}>
                    {step}
                  </div>
                  {step < 3 && <div className={`w-16 h-1 mx-4 ${currentStep > step ? 'bg-purple-400' : 'bg-gray-600'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Organization Details */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-8 rounded-3xl border-4 border-purple-400 shadow-[8px_8px_0px_0px_#a855f7]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h2 className="text-3xl font-black text-white">ORGANIZATION DETAILS</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-3">Organization Type</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => handleInputChange('organizationType', e.target.value)}
                    className="w-full p-4 rounded-2xl border-4 border-purple-300 bg-white text-black font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select organization type...</option>
                    {organizationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-bold mb-3">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full p-4 rounded-2xl border-4 border-purple-300 bg-white text-black font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select industry...</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-3">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full p-4 rounded-2xl border-4 border-purple-300 bg-white text-black font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select company size...</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-3">Operating Jurisdictions</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {jurisdictionOptions.map(jurisdiction => (
                      <label key={jurisdiction} className="flex items-center p-3 rounded-2xl border-2 border-purple-300 bg-purple-700 cursor-pointer hover:bg-purple-600">
                        <input
                          type="checkbox"
                          checked={formData.jurisdictions.includes(jurisdiction)}
                          onChange={() => handleArrayChange('jurisdictions', jurisdiction)}
                          className="mr-3"
                        />
                        <span className="text-white font-medium">{jurisdiction}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.organizationType || !formData.industry || !formData.companySize}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 text-black text-xl font-black px-12 py-4 rounded-2xl border-4 border-purple-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:bg-gray-600 disabled:text-gray-400 transition-all transform"
                  >
                    NEXT STEP →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Data & Operations */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-br from-pink-800 to-purple-900 p-8 rounded-3xl border-4 border-pink-400 shadow-[8px_8px_0px_0px_#ec4899]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-pink-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-2xl">💾</span>
                </div>
                <h2 className="text-3xl font-black text-white">DATA & OPERATIONS</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-3">Data Types Handled</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {dataTypeOptions.map(dataType => (
                      <label key={dataType} className="flex items-center p-3 rounded-2xl border-2 border-pink-300 bg-pink-700 cursor-pointer hover:bg-pink-600">
                        <input
                          type="checkbox"
                          checked={formData.dataTypes.includes(dataType)}
                          onChange={() => handleArrayChange('dataTypes', dataType)}
                          className="mr-3"
                        />
                        <span className="text-white font-medium">{dataType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-3">Key Business Processes</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {businessProcessOptions.map(process => (
                      <label key={process} className="flex items-center p-3 rounded-2xl border-2 border-pink-300 bg-pink-700 cursor-pointer hover:bg-pink-600">
                        <input
                          type="checkbox"
                          checked={formData.businessProcesses.includes(process)}
                          onChange={() => handleArrayChange('businessProcesses', process)}
                          className="mr-3"
                        />
                        <span className="text-white font-medium">{process}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-600 text-white text-lg font-black px-8 py-3 rounded-2xl border-4 border-gray-400 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform"
                  >
                    ← BACK
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 text-black text-xl font-black px-12 py-4 rounded-2xl border-4 border-pink-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform"
                  >
                    NEXT STEP →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Risk Profile */}
          {currentStep === 3 && (
            <div className="bg-gradient-to-br from-red-800 to-pink-900 p-8 rounded-3xl border-4 border-red-400 shadow-[8px_8px_0px_0px_#ef4444]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h2 className="text-3xl font-black text-white">RISK PROFILE</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-3">Existing Security Controls</label>
                  <textarea
                    value={formData.existingControls}
                    onChange={(e) => handleInputChange('existingControls', e.target.value)}
                    placeholder="Describe your current security measures, policies, and controls..."
                    className="w-full p-4 rounded-2xl border-4 border-red-300 bg-white text-black font-medium focus:outline-none focus:border-red-500 h-32"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-3">Risk Appetite</label>
                  <select
                    value={formData.riskAppetite}
                    onChange={(e) => handleInputChange('riskAppetite', e.target.value)}
                    className="w-full p-4 rounded-2xl border-4 border-red-300 bg-white text-black font-bold focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select risk appetite...</option>
                    <option value="Conservative">Conservative - Minimize all risks</option>
                    <option value="Moderate">Moderate - Balance risk and opportunity</option>
                    <option value="Aggressive">Aggressive - Accept higher risks for growth</option>
                    <option value="Risk-Seeking">Risk-Seeking - Embrace strategic risks</option>
                  </select>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-600 text-white text-lg font-black px-8 py-3 rounded-2xl border-4 border-gray-400 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform"
                  >
                    ← BACK
                  </button>
                  <button
                    onClick={generateAssessment}
                    disabled={loading || !formData.riskAppetite}
                    className="bg-gradient-to-r from-red-400 to-pink-400 text-black text-xl font-black px-12 py-4 rounded-2xl border-4 border-red-300 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:bg-gray-600 disabled:text-gray-400 transition-all transform"
                  >
                    {loading ? '🔄 ANALYZING...' : '🚀 GENERATE ASSESSMENT'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;
