import { useState } from 'react';

function Frameworks({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const frameworks = [
    {
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      category: "privacy",
      region: "EU",
      icon: "🇪🇺",
      color: "blue",
      description: "Comprehensive privacy regulation for EU citizens' personal data protection.",
      keyRequirements: [
        "Data Protection Impact Assessments",
        "Consent Management",
        "Right to Erasure",
        "Data Breach Notifications",
        "Privacy by Design"
      ],
      maxFine: "€20M or 4% of global revenue",
      implementationTime: "3-6 months",
      complexity: "High"
    },
    {
      name: "HIPAA",
      fullName: "Health Insurance Portability and Accountability Act",
      category: "healthcare",
      region: "US",
      icon: "🏥",
      color: "green",
      description: "US healthcare privacy and security regulations for protected health information.",
      keyRequirements: [
        "Administrative Safeguards",
        "Physical Safeguards",
        "Technical Safeguards",
        "Business Associate Agreements",
        "Risk Assessments"
      ],
      maxFine: "$1.5M per incident",
      implementationTime: "4-8 months",
      complexity: "High"
    },
    {
      name: "SOX",
      fullName: "Sarbanes-Oxley Act",
      category: "financial",
      region: "US",
      icon: "📊",
      color: "purple",
      description: "Financial reporting and corporate governance requirements for public companies.",
      keyRequirements: [
        "Internal Controls Documentation",
        "Management Assessment",
        "External Auditor Testing",
        "CEO/CFO Certifications",
        "Whistleblower Protections"
      ],
      maxFine: "$5M and 20 years imprisonment",
      implementationTime: "6-12 months",
      complexity: "Very High"
    },
    {
      name: "PCI DSS",
      fullName: "Payment Card Industry Data Security Standard",
      category: "financial",
      region: "Global",
      icon: "💳",
      color: "orange",
      description: "Security standards for organizations handling credit card information.",
      keyRequirements: [
        "Network Security Controls",
        "Cardholder Data Protection",
        "Vulnerability Management",
        "Access Control Measures",
        "Regular Security Testing"
      ],
      maxFine: "$100K per month",
      implementationTime: "2-4 months",
      complexity: "Medium"
    },
    {
      name: "ISO 27001",
      fullName: "Information Security Management Standard",
      category: "security",
      region: "Global",
      icon: "🔒",
      color: "indigo",
      description: "International standard for information security management systems.",
      keyRequirements: [
        "Information Security Policy",
        "Risk Assessment Process",
        "Security Controls Implementation",
        "Management Review",
        "Continual Improvement"
      ],
      maxFine: "No direct fines (certification)",
      implementationTime: "6-18 months",
      complexity: "High"
    },
    {
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      category: "privacy",
      region: "US (CA)",
      icon: "🏛️",
      color: "red",
      description: "California's comprehensive consumer privacy law for personal information.",
      keyRequirements: [
        "Consumer Rights Notices",
        "Opt-Out Mechanisms",
        "Data Inventory Management",
        "Third-Party Disclosures",
        "Consumer Request Processing"
      ],
      maxFine: "$7,500 per violation",
      implementationTime: "2-4 months",
      complexity: "Medium"
    }
  ];

  const categories = {
    all: { name: "All Frameworks", icon: "🌐" },
    privacy: { name: "Privacy & Data Protection", icon: "🔐" },
    healthcare: { name: "Healthcare", icon: "🏥" },
    financial: { name: "Financial", icon: "💰" },
    security: { name: "Information Security", icon: "🛡️" }
  };

  const filteredFrameworks = selectedCategory === 'all' 
    ? frameworks 
    : frameworks.filter(f => f.category === selectedCategory);

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-none mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-gray-800">POLIGAP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
        <div className="max-w-none mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-6">
            Compliance Frameworks
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Explore our comprehensive support for major compliance frameworks. Get detailed insights, implementation guides, and automated analysis tools.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Frameworks</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">190+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">Updates</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">AI</div>
              <div className="text-sm text-gray-600">Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                  selectedCategory === key
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="py-16 px-4">
        <div className="max-w-none mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredFrameworks.map((framework, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-${framework.color}-100 flex items-center justify-center text-2xl`}>
                      {framework.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {framework.name}
                      </h3>
                      <p className="text-gray-600 font-medium">{framework.fullName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                          📍 {framework.region}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${getComplexityColor(framework.complexity)}`}>
                          {framework.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {framework.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Key Requirements:</h4>
                  <ul className="space-y-2">
                    {framework.keyRequirements.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                    {framework.keyRequirements.length > 3 && (
                      <li className="text-sm text-purple-600 font-medium">
                        +{framework.keyRequirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Max Fine</div>
                    <div className="font-bold text-red-600">{framework.maxFine}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 uppercase font-semibold">Timeline</div>
                    <div className="font-bold text-gray-900">{framework.implementationTime}</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => onNavigate('analyzer')}
                    className="flex-1 bg-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Analyze Now
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need Support for a Custom Framework?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Our AI can adapt to your specific compliance requirements. Contact our team to discuss custom framework implementation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className="bg-white text-purple-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Analysis
            </button>
            <button className="bg-purple-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 transition-colors border border-purple-600">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Frameworks;
