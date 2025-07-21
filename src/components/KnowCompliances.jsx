import { useState } from 'react';

function KnowCompliances({ onNavigate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  const compliances = {
    GDPR: {
      title: "GDPR - General Data Protection Regulation",
      region: "European Union",
      year: "2018",
      color: "blue",
      icon: "🇪🇺",
      category: "Privacy",
      description: "The GDPR is Europe's privacy law that protects how companies handle personal data of EU citizens.",
      keyPoints: [
        "Applies to any company that processes EU citizens' personal data",
        "Requires explicit consent before collecting personal information",
        "Gives people the right to see, correct, or delete their data",
        "Companies must report data breaches within 72 hours",
        "Fines can be up to 4% of global annual revenue or €20 million",
        "Must appoint a Data Protection Officer (DPO) for high-risk processing"
      ],
      whoNeedsIt: "Any business that collects data from EU residents, regardless of where the business is located.",
      simpleExample: "If you run an online store and someone from Germany buys from you, you need to follow GDPR rules for their personal information."
    },
    HIPAA: {
      title: "HIPAA - Health Insurance Portability and Accountability Act",
      region: "United States",
      year: "1996",
      color: "green",
      icon: "🏥",
      category: "Healthcare",
      description: "HIPAA protects sensitive patient health information in the United States healthcare system.",
      keyPoints: [
        "Protects all medical records and health information",
        "Patients have the right to access their own health records",
        "Healthcare providers must get patient consent before sharing information",
        "Requires secure storage and transmission of health data",
        "Staff must be trained on privacy and security procedures",
        "Penalties range from $100 to $50,000 per violation"
      ],
      whoNeedsIt: "Hospitals, doctors, health insurance companies, and any business that handles health information.",
      simpleExample: "When you visit a doctor, they can't share your medical information with anyone else without your written permission."
    },
    SOX: {
      title: "SOX - Sarbanes-Oxley Act",
      region: "United States",
      year: "2002",
      color: "purple",
      icon: "📊",
      category: "Financial",
      description: "SOX ensures that public companies provide accurate financial information to investors and the public.",
      keyPoints: [
        "CEOs and CFOs must personally certify financial reports are accurate",
        "Companies must have strong internal controls over financial reporting",
        "External auditors must be independent from the company",
        "Whistleblower protections for employees reporting fraud",
        "Severe criminal penalties for executives who knowingly certify false financials",
        "Regular testing and documentation of financial controls required"
      ],
      whoNeedsIt: "All publicly traded companies in the US and their subsidiaries.",
      simpleExample: "If you own stock in a company, SOX helps ensure the financial reports you see are truthful and accurate."
    },
    CCPA: {
      title: "CCPA - California Consumer Privacy Act",
      region: "California, USA",
      year: "2020",
      color: "orange",
      icon: "🌴",
      category: "Privacy",
      description: "CCPA gives California residents control over how businesses collect and use their personal information.",
      keyPoints: [
        "California residents can know what personal info is collected about them",
        "Right to delete personal information held by businesses",
        "Right to opt-out of the sale of personal information",
        "Right to non-discriminatory treatment when exercising privacy rights",
        "Businesses must provide clear privacy notices",
        "Fines up to $7,500 per intentional violation"
      ],
      whoNeedsIt: "Businesses that serve California residents and meet certain size/revenue thresholds.",
      simpleExample: "If you live in California, you can ask companies what information they have about you and tell them to delete it."
    },
    PCI_DSS: {
      title: "PCI DSS - Payment Card Industry Data Security Standard",
      region: "Global",
      year: "2004",
      color: "red",
      icon: "💳",
      category: "Payment",
      description: "PCI DSS ensures that companies that accept credit cards protect cardholder data from theft and fraud.",
      keyPoints: [
        "Secure storage of cardholder data with encryption",
        "Regular security testing and monitoring of networks",
        "Strong access controls - only authorized people can access card data",
        "Regular software updates and security patches",
        "Maintain secure networks with firewalls",
        "Four compliance levels based on transaction volume"
      ],
      whoNeedsIt: "Any business that accepts, processes, stores, or transmits credit card information.",
      simpleExample: "When you buy something online with a credit card, PCI DSS ensures the store keeps your card number safe from hackers."
    },
    ISO_27001: {
      title: "ISO 27001 - Information Security Management",
      region: "International",
      year: "2005",
      color: "indigo",
      icon: "🔒",
      category: "Security",
      description: "ISO 27001 is an international standard that helps organizations manage and protect their information assets.",
      keyPoints: [
        "Systematic approach to managing sensitive company and customer information",
        "Risk assessment and management processes for information security",
        "Regular security audits and continuous improvement",
        "Employee training and awareness programs",
        "Incident response and business continuity planning",
        "Certification available through accredited bodies"
      ],
      whoNeedsIt: "Any organization that wants to demonstrate strong information security practices, especially those handling sensitive data.",
      simpleExample: "A company uses ISO 27001 to show clients that they take data security seriously and have proper systems to protect information."
    },
    FERPA: {
      title: "FERPA - Family Educational Rights and Privacy Act",
      region: "United States",
      year: "1974",
      color: "teal",
      icon: "🎓",
      category: "Education",
      description: "FERPA protects the privacy of student education records and gives parents/students rights over their educational information.",
      keyPoints: [
        "Protects student education records from unauthorized disclosure",
        "Parents have rights to access and request changes to records",
        "Students gain these rights when they turn 18 or enter college",
        "Schools must get written permission before sharing records",
        "Directory information can be shared unless parents opt out",
        "Violations can result in loss of federal education funding"
      ],
      whoNeedsIt: "Schools, universities, and educational institutions that receive federal funding.",
      simpleExample: "Your child's school can't share their grades or disciplinary records with others without your written permission."
    },
    GLBA: {
      title: "GLBA - Gramm-Leach-Bliley Act",
      region: "United States",
      year: "1999",
      color: "pink",
      icon: "🏦",
      category: "Financial",
      description: "GLBA requires financial institutions to protect customers' personal financial information and explain their information-sharing practices.",
      keyPoints: [
        "Financial institutions must safeguard customer information",
        "Must provide clear privacy notices explaining data practices",
        "Customers can opt out of information sharing with third parties",
        "Regular security assessments and employee training required",
        "Covers banks, credit unions, insurance companies, and investment firms",
        "Penalties include fines and regulatory sanctions"
      ],
      whoNeedsIt: "Banks, credit unions, insurance companies, investment firms, and other financial service providers.",
      simpleExample: "When you open a bank account, GLBA ensures the bank protects your financial information and tells you how they use it."
    },
    COPPA: {
      title: "COPPA - Children's Online Privacy Protection Act",
      region: "United States",
      year: "1998",
      color: "yellow",
      icon: "👶",
      category: "Privacy",
      description: "COPPA protects the privacy of children under 13 by regulating how websites and online services collect their information.",
      keyPoints: [
        "Requires parental consent before collecting data from children under 13",
        "Parents must be able to review and delete their child's information",
        "Websites must provide clear privacy policies about children's data",
        "Limits on marketing to children and data sharing",
        "Safe harbor provisions for following approved guidelines",
        "FTC can impose fines up to $43,792 per violation"
      ],
      whoNeedsIt: "Websites, apps, and online services that are directed at children or knowingly collect data from children under 13.",
      simpleExample: "A kids' game app must get permission from parents before collecting any information about children playing the game."
    },
    NIST_CSF: {
      title: "NIST Cybersecurity Framework",
      region: "United States",
      year: "2014",
      color: "gray",
      icon: "🛡️",
      category: "Security",
      description: "NIST CSF provides a flexible framework for organizations to manage and improve their cybersecurity posture.",
      keyPoints: [
        "Five core functions: Identify, Protect, Detect, Respond, Recover",
        "Voluntary framework that can be adapted to any organization",
        "Risk-based approach to cybersecurity management",
        "Promotes communication between technical and business teams",
        "Regular updates to address evolving cyber threats",
        "Widely adopted across government and private sectors"
      ],
      whoNeedsIt: "Any organization looking to improve their cybersecurity practices, especially critical infrastructure providers.",
      simpleExample: "A power company uses NIST CSF to create a plan for protecting their systems from cyber attacks and recovering if something goes wrong."
    },
    CAN_SPAM: {
      title: "CAN-SPAM Act",
      region: "United States",
      year: "2003",
      color: "cyan",
      icon: "📧",
      category: "Marketing",
      description: "CAN-SPAM establishes rules for commercial email and gives recipients the right to stop unwanted emails.",
      keyPoints: [
        "Don't use false or misleading header information or subject lines",
        "Identify the message as an advertisement if it's promotional",
        "Tell recipients where you're located with a valid physical address",
        "Provide a clear and easy way to opt out of future emails",
        "Honor opt-out requests promptly (within 10 business days)",
        "Monitor what others do on your behalf for email marketing"
      ],
      whoNeedsIt: "Any business that sends commercial emails or marketing messages to customers.",
      simpleExample: "When a store sends you promotional emails, CAN-SPAM ensures they include an unsubscribe link and honor your request to stop."
    },
    FISMA: {
      title: "FISMA - Federal Information Security Management Act",
      region: "United States",
      year: "2002",
      color: "emerald",
      icon: "🏛️",
      category: "Government",
      description: "FISMA requires federal agencies and contractors to secure their information systems and data.",
      keyPoints: [
        "Mandatory for federal agencies and government contractors",
        "Risk-based approach to information security",
        "Annual security assessments and continuous monitoring",
        "Incident reporting requirements to appropriate authorities",
        "Security controls based on NIST standards",
        "Certification and accreditation of information systems"
      ],
      whoNeedsIt: "Federal agencies, government contractors, and organizations that handle federal information.",
      simpleExample: "A company working on a government contract must follow FISMA rules to protect any government data they handle."
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-indigo-600 border-blue-200',
      green: 'from-green-500 to-emerald-600 border-green-200',
      purple: 'from-purple-500 to-violet-600 border-purple-200',
      red: 'from-red-500 to-rose-600 border-red-200',
      orange: 'from-orange-500 to-amber-600 border-orange-200',
      indigo: 'from-indigo-500 to-purple-600 border-indigo-200',
      teal: 'from-teal-500 to-cyan-600 border-teal-200',
      pink: 'from-pink-500 to-rose-600 border-pink-200',
      yellow: 'from-yellow-500 to-orange-600 border-yellow-200',
      gray: 'from-gray-500 to-slate-600 border-gray-200',
      cyan: 'from-cyan-500 to-blue-600 border-cyan-200',
      emerald: 'from-emerald-500 to-teal-600 border-emerald-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'Privacy': '🔐',
      'Healthcare': '🏥',
      'Financial': '💰',
      'Security': '🛡️',
      'Payment': '💳',
      'Education': '📚',
      'Marketing': '📧',
      'Government': '🏛️'
    };
    return categoryIcons[category] || '📋';
  };

  const filteredCompliances = Object.entries(compliances).filter(([key, compliance]) => {
    const matchesSearch = !searchTerm || 
      compliance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compliance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compliance.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = filterRegion === 'all' || 
      compliance.region.toLowerCase().includes(filterRegion.toLowerCase());
    
    return matchesSearch && matchesRegion;
  });

  const regions = ['all', 'United States', 'European Union', 'International', 'Global'];
  const categories = [...new Set(Object.values(compliances).map(c => c.category))];

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
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
              <p className="text-gray-600 mt-1">Comprehensive compliance framework guide</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {!selectedCompliance ? (
          <div className="animate-fadeInUp">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Master Compliance Frameworks
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Navigate the complex world of regulatory compliance with our comprehensive guide to 12+ major frameworks. 
                From GDPR to HIPAA, SOX to ISO 27001 - understand what matters for your industry.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center space-x-12 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600">12+</div>
                  <div className="text-sm text-gray-600 font-semibold">Frameworks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">8</div>
                  <div className="text-sm text-gray-600 font-semibold">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-600">50+</div>
                  <div className="text-sm text-gray-600 font-semibold">Years Combined</div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-200 mb-12">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search frameworks, categories, or descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center px-4 py-3 bg-gray-100 rounded-2xl">
                    <span className="text-sm font-medium text-gray-700">
                      {filteredCompliances.length} frameworks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map(category => (
                <div
                  key={category}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 shadow-soft"
                >
                  <span className="text-lg mr-2">{getCategoryIcon(category)}</span>
                  {category}
                </div>
              ))}
            </div>

            {/* Frameworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompliances.map(([key, compliance]) => (
                <div
                  key={key}
                  onClick={() => setSelectedCompliance(key)}
                  className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 card-hover cursor-pointer group"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(compliance.color)} rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{compliance.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {compliance.title.split(' - ')[0]}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                          {compliance.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{compliance.region} • {compliance.year}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    {compliance.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Learn More</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompliances.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No frameworks found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <button
              onClick={() => setSelectedCompliance(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 focus-ring rounded-lg px-3 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Overview</span>
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
              <div className="flex items-center mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(compliances[selectedCompliance].color)} rounded-2xl flex items-center justify-center mr-6`}>
                  <span className="text-3xl">{compliances[selectedCompliance].icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {compliances[selectedCompliance].title}
                    </h1>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-2xl text-sm font-semibold">
                      {compliances[selectedCompliance].category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg">
                    {compliances[selectedCompliance].region} • {compliances[selectedCompliance].year}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {compliances[selectedCompliance].description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compliances[selectedCompliance].keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start bg-gray-50 rounded-2xl p-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Who Needs This?</h3>
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <p className="text-blue-900 leading-relaxed font-medium">
                        {compliances[selectedCompliance].whoNeedsIt}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Simple Example</h3>
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <p className="text-green-900 leading-relaxed font-medium">
                        {compliances[selectedCompliance].simpleExample}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to ensure compliance?</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Use our AI-powered tools to analyze your current policies against {compliances[selectedCompliance].title.split(' - ')[0]} requirements
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => onNavigate('analyzer')}
                      className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold btn-hover focus-ring shadow-glow"
                    >
                      Analyze My Policies
                    </button>
                    <button 
                      onClick={() => onNavigate('generator')}
                      className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold border border-gray-300 btn-hover focus-ring"
                    >
                      Generate New Policy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default KnowCompliances;
