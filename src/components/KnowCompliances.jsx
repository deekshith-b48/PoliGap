import { useState } from 'react';

function KnowCompliances({ onNavigate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  const compliances = {
    GDPR: {
      title: "GDPR - General Data Protection Regulation",
      region: "European Union",
      year: "2018",
      color: "blue",
      icon: "🇪🇺",
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
      description: "HIPAA protects sensitive patient health information in the United States healthcare system.",
      keyPoints: [
        "Protects all medical records and health information",
        "Patients have the right to access their own health records",
        "Healthcare providers must get permission to share patient data",
        "Requires safeguards for electronic health information",
        "Violations can result in fines from $100 to $50,000 per incident",
        "All healthcare employees must receive HIPAA training"
      ],
      whoNeedsIt: "Hospitals, doctors, health insurance companies, and any business that handles health information.",
      simpleExample: "When you visit your doctor, they can't share your medical information with anyone else without your written permission."
    },
    SOX: {
      title: "SOX - Sarbanes-Oxley Act",
      region: "United States",
      year: "2002",
      color: "purple",
      icon: "📊",
      description: "SOX requires public companies to maintain accurate financial records and implement strong internal controls.",
      keyPoints: [
        "CEOs and CFOs must personally certify financial statements",
        "Companies must maintain detailed documentation of financial processes",
        "External auditors must test and verify internal controls",
        "Whistleblower protections for reporting financial fraud",
        "Criminal penalties for executives who knowingly certify false statements",
        "Annual assessment of internal controls over financial reporting"
      ],
      whoNeedsIt: "All publicly traded companies in the United States and their subsidiaries.",
      simpleExample: "If your company sells stock on the stock market, you must follow strict rules to prove your financial reports are accurate and honest."
    },
    PCI_DSS: {
      title: "PCI DSS - Payment Card Industry Data Security Standard",
      region: "Global",
      year: "2004",
      color: "red",
      icon: "💳",
      description: "PCI DSS ensures secure handling of credit card information by businesses that accept card payments.",
      keyPoints: [
        "Install and maintain firewalls to protect cardholder data",
        "Never use default passwords on systems",
        "Encrypt stored cardholder data",
        "Limit access to cardholder data on a need-to-know basis",
        "Regularly test security systems and processes",
        "Maintain a policy that addresses information security"
      ],
      whoNeedsIt: "Any business that accepts, processes, stores, or transmits credit card information.",
      simpleExample: "If your restaurant accepts credit cards, you must follow special security rules to protect customers' card numbers from hackers."
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-indigo-600 border-blue-200',
      green: 'from-green-500 to-emerald-600 border-green-200',
      purple: 'from-purple-500 to-violet-600 border-purple-200',
      red: 'from-red-500 to-rose-600 border-red-200'
    };
    return colorMap[color] || colorMap.blue;
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
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
              <p className="text-gray-600 mt-1">Learn about major compliance frameworks</p>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {!selectedCompliance ? (
          <div className="animate-fadeInUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Understanding Compliance Frameworks
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore major regulatory frameworks that govern how organizations handle data, 
                maintain security, and ensure compliance across different industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(compliances).map(([key, compliance]) => (
                <div
                  key={key}
                  onClick={() => setSelectedCompliance(key)}
                  className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 card-hover cursor-pointer group"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(compliance.color)} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{compliance.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {compliance.title.split(' - ')[0]}
                      </h3>
                      <p className="text-gray-600">{compliance.region} • {compliance.year}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {compliances[selectedCompliance].title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {compliances[selectedCompliance].region} • {compliances[selectedCompliance].year}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {compliances[selectedCompliance].description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {compliances[selectedCompliance].keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start bg-gray-50 rounded-2xl p-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Who Needs This?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {compliances[selectedCompliance].whoNeedsIt}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Simple Example</h3>
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <p className="text-blue-800 leading-relaxed">
                        {compliances[selectedCompliance].simpleExample}
                      </p>
                    </div>
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
