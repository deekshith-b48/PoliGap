import { useState } from 'react';

function KnowCompliances({ onNavigate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  const compliances = {
    GDPR: {
      title: "GDPR - General Data Protection Regulation",
      region: "European Union",
      year: "2018",
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

  const handleComplianceClick = (complianceKey) => {
    setSelectedCompliance(selectedCompliance === complianceKey ? null : complianceKey);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl rotate-12 opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl -rotate-6 opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-tl from-yellow-400 to-orange-500 rounded-lg rotate-45 opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 w-[90%] max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="mb-6 bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold border-4 border-purple-400 shadow-[4px_4px_0px_0px_#a855f7] hover:shadow-[6px_6px_0px_0px_#a855f7] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            ← BACK TO DASHBOARD
          </button>
          
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 mb-4">
            KNOW YOUR COMPLIANCES
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Understanding regulatory frameworks doesn't have to be complicated. Learn about major compliance requirements in simple, clear language.
          </p>
        </div>

        {/* Compliance Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(compliances).map(([key, compliance]) => (
            <div key={key} className="group">
              <div 
                onClick={() => handleComplianceClick(key)}
                className="cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border-4 border-indigo-400 shadow-[6px_6px_0px_0px_#6366f1] hover:shadow-[8px_8px_0px_0px_#6366f1] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-indigo-300 mb-2">{compliance.title}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {compliance.region}
                      </span>
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Since {compliance.year}
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl">
                    {selectedCompliance === key ? '📖' : '📚'}
                  </div>
                </div>
                
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  {compliance.description}
                </p>
                
                <div className="text-indigo-400 font-bold">
                  {selectedCompliance === key ? '📖 Click to collapse' : '📖 Click to learn more'}
                </div>
              </div>

              {/* Expanded Content */}
              {selectedCompliance === key && (
                <div className="mt-4 bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-3xl border-4 border-purple-400 shadow-[6px_6px_0px_0px_#a855f7] animate-fade-in">
                  
                  {/* Who Needs It Section */}
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                      🎯 Who Needs to Follow This?
                    </h4>
                    <p className="text-gray-200 text-lg leading-relaxed bg-yellow-900/20 p-4 rounded-2xl border-2 border-yellow-600">
                      {compliance.whoNeedsIt}
                    </p>
                  </div>

                  {/* Simple Example */}
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                      💡 Simple Example
                    </h4>
                    <p className="text-gray-200 text-lg leading-relaxed bg-green-900/20 p-4 rounded-2xl border-2 border-green-600">
                      {compliance.simpleExample}
                    </p>
                  </div>

                  {/* Key Requirements */}
                  <div>
                    <h4 className="text-2xl font-bold text-pink-400 mb-4 flex items-center">
                      📋 Key Requirements
                    </h4>
                    <div className="bg-pink-900/20 p-6 rounded-2xl border-2 border-pink-600">
                      <ul className="space-y-3">
                        {compliance.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start text-gray-200 text-base">
                            <span className="text-pink-400 font-bold mr-3 mt-1">•</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="bg-gradient-to-r from-purple-800 to-pink-800 p-8 rounded-3xl border-4 border-purple-400 shadow-[8px_8px_0px_0px_#a855f7]">
          <h3 className="text-3xl font-black text-white mb-4">💡 WHY COMPLIANCE MATTERS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-purple-900/50 p-6 rounded-2xl border-2 border-purple-300">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="text-xl font-bold text-white mb-2">Protect Your Business</h4>
              <p className="text-purple-100">Avoid costly fines and legal issues by following the rules correctly.</p>
            </div>
            <div className="bg-pink-900/50 p-6 rounded-2xl border-2 border-pink-300">
              <div className="text-4xl mb-3">🤝</div>
              <h4 className="text-xl font-bold text-white mb-2">Build Trust</h4>
              <p className="text-pink-100">Customers trust businesses that protect their data and follow regulations.</p>
            </div>
            <div className="bg-indigo-900/50 p-6 rounded-2xl border-2 border-indigo-300">
              <div className="text-4xl mb-3">📈</div>
              <h4 className="text-xl font-bold text-white mb-2">Grow Confidently</h4>
              <p className="text-indigo-100">Compliance opens doors to new markets and business opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowCompliances;
