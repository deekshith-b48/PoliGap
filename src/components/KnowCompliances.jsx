import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    description: "SOX ensures accurate financial reporting and prevents fraud in publicly traded companies.",
    keyPoints: [
      "Requires accurate financial records and reporting",
      "CEOs and CFOs must personally certify financial statements",
      "Independent auditing of financial controls",
      "Whistleblower protections for employees reporting fraud",
      "Criminal penalties for executives who knowingly certify false statements",
      "Regular testing of internal control systems"
    ],
    whoNeedsIt: "All publicly traded companies in the United States and their subsidiaries.",
    simpleExample: "If your company sells stock to the public, the CEO must personally guarantee that the financial reports are truthful."
  },
  CCPA: {
    title: "CCPA - California Consumer Privacy Act",
    region: "California, United States",
    year: "2020",
    color: "orange",
    icon: "🏖️",
    category: "Privacy",
    description: "California's privacy law that gives residents control over their personal information.",
    keyPoints: [
      "Right to know what personal information is collected",
      "Right to delete personal information held by businesses",
      "Right to opt-out of the sale of personal information",
      "Right to non-discrimination for exercising privacy rights",
      "Applies to businesses with $25M+ revenue or 50,000+ consumers",
      "Fines up to $7,500 per violation"
    ],
  CCPA: {
    title: "CCPA - California Consumer Privacy Act",
    region: "California, United States",
    year: "2020",
    color: "orange",
    icon: "🏖️",
    category: "Privacy",
    description: "California's privacy law that gives residents control over their personal information.",
    keyPoints: [
      "Right to know what personal information is collected",
      "Right to delete personal information held by businesses",
      "Right to opt-out of the sale of personal information",
      "Right to non-discrimination for exercising privacy rights",
      "Applies to businesses with $25M+ revenue or 50,000+ consumers",
      "Fines up to $7,500 per violation"
    ],
    whoNeedsIt: "Businesses that collect data from California residents and meet certain thresholds.",
    simpleExample: "If you live in California, you can ask companies what information they have about you and tell them to delete it."
  },
    whoNeedsIt: "Organizations wanting to demonstrate systematic security management, often required for government contracts.",
    simpleExample: "If you want to bid on government contracts, you might need ISO 27001 to prove you handle information securely."
  },
  COPPA: {
    title: "COPPA - Children's Online Privacy Protection Act",
    region: "United States",
    year: "1998",
    color: "pink",
    icon: "👶",
    category: "Privacy",
    description: "Protects the privacy of children under 13 years old online.",
    keyPoints: [
      "Requires parental consent before collecting children's information",
      "Parents can review what information is collected about their child",
      "Parents must be able to review and delete their child's information",
      "Limits how children's information can be used",
      "Applies to websites and online services directed to children",
      "Fines up to $43,792 per violation"
    ],
    whoNeedsIt: "Websites, apps, and online services that are directed to children under 13 or knowingly collect their information.",
    simpleExample: "If you create a game app for kids, you need permission from parents before collecting any information about the children playing."
  },
  NIST: {
    title: "NIST Cybersecurity Framework",
    region: "United States",
    year: "2014",
    color: "indigo",
    icon: "🛡️",
    category: "Security",
    description: "Framework for improving cybersecurity in critical infrastructure organizations.",
    keyPoints: [
      "Five core functions: Identify, Protect, Detect, Respond, Recover",
      "Risk-based approach to cybersecurity",
      "Flexible framework adaptable to any organization",
      "Helps prioritize cybersecurity activities",
      "Facilitates communication about cybersecurity risk",
      "Voluntary framework with widespread adoption"
    ],
    whoNeedsIt: "Critical infrastructure organizations and any business wanting to improve cybersecurity posture.",
    simpleExample: "If you run a power company or want to improve your cybersecurity, NIST provides a roadmap for protecting against cyber attacks."
  },
  CMMC: {
    title: "CMMC – Cybersecurity Maturity Model Certification",
    region: "United States",
    year: "2023",
    color: "cyan",
    icon: "🔧",
    category: "Security",
    description: "US DoD standard for cybersecurity for defense contractors.",
    keyPoints: [
      "Defines maturity levels (1–5) for cybersecurity capabilities",
      "Requires third-party certification for DoD contracts",
      "Includes practices like access control, incident response",
      "Documented policies and assessed processes are mandatory",
      "Regular recertification every 3 years"
    ],
    whoNeedsIt: "Defense contractors and government-connected suppliers.",
    simpleExample: "A DoD subcontractor must achieve at least Level 2 to bid on certain contracts."
  },
  FISMA: {
    title: "FISMA – Federal Information Security Management Act",
    region: "United States",
    year: "2002",
    color: "gray",
    icon: "🏛️",
    category: "Security",
    description: "US federal law requiring information security standards across government agencies.",
    keyPoints: [
      "Mandates annual risk assessments",
      "Requires centralization via NIST security controls",
      "Reportable incidents to OMB and Congress",
      "Continuous monitoring of information systems",
      "Security training for federal employees"
    ],
    whoNeedsIt: "Federal agencies and contractors handling government data.",
    simpleExample: "A contractor working on a federal data system must implement NIST SP 800-53 controls."
  },
  GLBA: {
    title: "GLBA – Gramm-Leach-Bliley Act",
    region: "United States",
    year: "1999",
    color: "indigo",
    icon: "💼",
    category: "Financial",
    description: "US law protecting consumers' financial information held by financial institutions.",
    keyPoints: [
      "Requires safeguarding consumer financial data",
      "Must disclose privacy practices to customers",
      "Allows consumers to opt-out of data sharing",
      "Requires internal information security programs",
      "Enforced by FTC, FFIEC, and other agencies"
    ],
    whoNeedsIt: "Banks, insurance companies, and financial service providers.",
    simpleExample: "Your bank must tell you how it uses your data and allow you to opt out of sharing."
  },
  PSD2: {
    title: "PSD2 – Payment Services Directive 2",
    region: "European Union",
    year: "2018",
    color: "blue",
    icon: "💶",
    category: "Payment",
    description: "EU regulation for secure payment services and open banking.",
    keyPoints: [
      "Mandates strong customer authentication (SCA)",
      "Enables licensed Payment Service Providers (PSPs)",
      "Requires Open Banking APIs",
      "Customer rights for refunds in unauthorized transactions",
      "Oversight by EU member-state regulators"
    ],
    whoNeedsIt: "Banks and fintechs operating in the EU.",
    simpleExample: "A fintech app in France must implement SCA via SMS or app-based 2FA."
  },
  FCRA: {
    title: "FCRA – Fair Credit Reporting Act",
    region: "United States",
    year: "1970",
    color: "purple",
    icon: "🧾",
    category: "Financial",
    description: "US law governing consumer credit reporting agencies and user rights.",
    keyPoints: [
      "Consumers can access and dispute credit report errors",
      "Requires user consent for credit checks",
      "Data furnishers must ensure accuracy",
      "Limits retention of outdated data",
      "Penalties for misuse of credit info"
    ],
    whoNeedsIt: "Credit bureaus, lenders, landlords, employers.",
    simpleExample: "An employer must get your written permission before pulling your credit report."
  },
  NERC_CIP: {
    title: "NERC CIP – Critical Infrastructure Protection",
    region: "North America",
    year: "2008",
    color: "maroon",
    icon: "⚡",
    category: "Security",
    description: "Standards for the protection of North American bulk power systems.",
    keyPoints: [
      "Physical and cyber security for power grid assets",
      "Personnel reliability programs",
      "Incident reporting to NERC",
      "Access controls for critical cyber systems",
      "Regular audits and compliance monitoring"
    ],
    whoNeedsIt: "Electric utilities and grid operators in the US and Canada.",
    simpleExample: "A power plant implements strict access lists and security monitoring."
  },
  FERPA: {
    title: "FERPA – Family Educational Rights and Privacy Act",
    region: "United States",
    year: "1974",
    color: "yellow",
    icon: "🎓",
    category: "Privacy",
    description: "Protects educational records privacy for US students.",
    keyPoints: [
      "Parents/students can inspect and amend records",
      "Written consent required to share records",
      "Applies to schools receiving federal funding",
      "Annual notification of privacy rights",
      "Safeguards for electronic records"
    ],
    whoNeedsIt: "K–12 and higher-education institutions.",
    simpleExample: "A university can't release your grades without your permission."
  },
  FRTB: {
    title: "FRTB – Fundamental Review of the Trading Book",
    region: "International",
    year: "2019",
    color: "teal",
    icon: "📈",
    category: "Financial",
    description: "Basel III standard for market risk in trading books.",
    keyPoints: [
      "New internal risk models for market risk",
      "Stricter capital requirements",
      "Standardized and internal model approaches",
      "Enhanced reporting and desk-level capital calculation",
      "Approved by Basel Committee members"
    ],
    whoNeedsIt: "Banks and trading firms worldwide.",
    simpleExample: "A bank must hold more capital against its trading-position risk."
  },
  PIPEDA: {
    title: "PIPEDA – Personal Information Protection and Electronic Documents Act",
    region: "Canada",
    year: "2000",
    color: "red",
    icon: "🍁",
    category: "Privacy",
    description: "Canadian federal privacy law for commercial organizations.",
    keyPoints: [
      "Consent required for collecting personal data",
      "Individuals can access and correct their data",
      "Mandatory accountability and safeguards",
      "Limits use and disclosure to purposes identified",
      "Breach notification obligations"
    ],
    whoNeedsIt: "Canadian businesses collecting personal data.",
    simpleExample: "A Canadian e-commerce site must notify you if your data is breached."
  },
  APPI: {
    title: "APPI – Act on the Protection of Personal Information",
    region: "Japan",
    year: "2017",
    color: "pink",
    icon: "🎏",
    category: "Privacy",
    description: "Japanese law governing protection and use of personal data.",
    keyPoints: [
      "Requires purpose specification and consent",
      "Cross-border transfer restrictions",
      "Obligation to appoint a PIPA (data protection officer)",
      "Requires appropriate security safeguards",
      "Strict handling of sensitive personal info"
    ],
    whoNeedsIt: "Businesses handling Japanese personal data.",
    simpleExample: "A SaaS app with Japanese users must get their consent before data transfer."
  },
  LGPD: {
    title: "LGPD – Lei Geral de Proteção de Dados",
    region: "Brazil",
    year: "2020",
    color: "green",
    icon: "🌴",
    category: "Privacy",
    description: "Brazil’s comprehensive data protection law modeled after GDPR.",
    keyPoints: [
      "Consent required before processing personal data",
      "Data subject rights similar to GDPR",
      "Fines up to 2% of revenue in Brazil",
      "Obligation to report data breaches",
      "Data Protection Officer needed for some organizations"
    ],
    whoNeedsIt: "Companies handling Brazilian personal information.",
    simpleExample: "An online store in São Paulo must comply with LGPD when processing customer data."
  },
  SOC_2: {
    title: "SOC 2 – Service Organization Control 2",
    region: "International",
    year: "2011",
    color: "blue",
    icon: "✅",
    category: "Security",
    description: "US-based audit standard for controls at service organizations.",
    keyPoints: [
      "Reports on Trust Service Criteria: security, availability, confidentiality",
      "Conducted by independent auditors",
      "Type II includes ongoing period testing",
      "Common for SaaS and cloud providers",
      "Useful for vendor risk management"
    ],
    whoNeedsIt: "Service providers hosting customer data.",
    simpleExample: "A cloud CRM gets SOC 2 Type II to show it's secure and available."
  },
  SWIFT: {
    title: "SWIFT CSP – Customer Security Programme",
    region: "Global",
    year: "2018",
    color: "yellow",
    icon: "💱",
    category: "Payment",
    description: "Security standards for SWIFT financial messaging environment.",
    keyPoints: [
      "15 mandatory controls for customers",
      "Regular independent assessments",
      "Secure access and user management",
      "Incident response planning",
      "Shared responsibility with SWIFT itself"
    ],
    whoNeedsIt: "Banks and financial institutions using SWIFT.",
    simpleExample: "A bank implementing strong user authentication for SWIFT access."
  },
  MAS_GTS: {
    title: "MAS GTS – Monetary Authority of Singapore Guidelines on Technology Risk",
    region: "Singapore",
    year: "2021",
    color: "magenta",
    icon: "🏦",
    category: "Security",
    description: "Singaporean standards for technology risk management in financial sector.",
    keyPoints: [
      "Robust outsourcing risk management",
      "Maintenance of operational resilience",
      "ICT system security and cyber hygiene",
      "Incident reporting to MAS",
      "Periodic risk and penetration testing"
    ],
    whoNeedsIt: "Banks and financial institutions in Singapore.",
    simpleExample: "A Singapore bank conducts annual pen-tests as per MAS GTS."
  },
  GDPR_CCPA: {
    title: "GDPR vs CCPA Comparison",
    region: "EU vs California",
    year: "2018/2020",
    color: "gradient",
    icon: "⚖️",
    category: "Privacy",
    description: "Comparison between Europe's GDPR and California's CCPA privacy laws.",
    keyPoints: [
      "GDPR has broader scope (all EU residents vs California residents)",
      "Both require consent for data collection",
      "GDPR has higher maximum fines (4% revenue vs $7,500 per violation)",
      "CCPA allows selling data with opt-out, GDPR requires opt-in",
      "Both provide right to access and delete personal data",
      "GDPR requires Data Protection Officers, CCPA does not"
    ],
    whoNeedsIt: "Businesses operating in both EU and California need to comply with both.",
    simpleExample: "If your business serves customers in both Europe and California, you need to follow the stricter rules of both laws."
  }
};

const getColorClasses = (color) => {
  const colorMap = {
    blue: "from-blue-500 to-cyan-600 border-blue-200",
    green: "from-green-500 to-emerald-600 border-green-200",
    purple: "from-purple-500 to-violet-600 border-purple-200",
    orange: "from-orange-500 to-amber-600 border-orange-200",
    red: "from-red-500 to-rose-600 border-red-200",
    teal: "from-teal-500 to-cyan-600 border-teal-200",
    pink: "from-pink-500 to-rose-600 border-pink-200",
    indigo: "from-indigo-500 to-blue-600 border-indigo-200",
    cyan: "from-cyan-500 to-blue-500 border-cyan-200",
    gray: "from-gray-500 to-slate-600 border-gray-200",
    maroon: "from-red-700 to-red-900 border-red-200",
    yellow: "from-yellow-500 to-amber-600 border-yellow-200",
    magenta: "from-pink-600 to-purple-600 border-pink-200",
    gradient: "from-purple-500 via-blue-500 to-green-500 border-purple-200"
  };
  return colorMap[color] || colorMap.blue;
};

const getCategoryIcon = (category) => {
  const categoryIcons = {
    Privacy: '🔐',
    Healthcare: '🏥',
    Financial: '💰',
    Payment: '💳',
    Security: '🛡️'
  };
  return categoryIcons[category] || '📋';
};

const regions = ['all', 'United States', 'European Union', 'International', 'Global'];

const KnowCompliances = ({ onNavigate }) => {
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  const filteredCompliances = useMemo(() => {
    return Object.entries(compliances).filter(([key, compliance]) => {
      const matchesSearch = !searchTerm ||
        compliance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compliance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compliance.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion = filterRegion === 'all' ||
        compliance.region.toLowerCase().includes(filterRegion.toLowerCase());

      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, filterRegion]);

  const categories = useMemo(() => {
    return [...new Set(Object.values(compliances).map((compliance) => compliance.category))];
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-3 group"
                aria-label="Go to home"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Compliance Frameworks</h1>
                  <p className="text-xs text-gray-500">Learn about major regulations</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/analyzer"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm"
                aria-label="Try Analyzer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Try Analyzer
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Know Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Compliance</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Understanding compliance frameworks made simple. Learn about major regulations,
            their requirements, and how they apply to your business.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search frameworks, regulations, or requirements..."
                  className="w-full bg-white/80 border border-gray-200/50 rounded-2xl px-4 py-3 pl-12 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                  aria-label="Search frameworks, regulations, or requirements"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Region Filter */}
            <div className="lg:w-64">
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full bg-white/80 border border-gray-200/50 rounded-2xl px-4 py-3 text-gray-900 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                aria-label="Filter by region"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200/50">
            <span className="text-sm font-medium text-gray-600 mr-2">Categories:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className="px-3 py-1 bg-gray-100/80 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-xl text-xs font-medium transition-colors"
                aria-label={`Filter by ${category} category`}
              >
                {getCategoryIcon(category)} {category}
              </button>
            ))}
          </div>
        </div>

        {/* Compliance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCompliances.map(([key, compliance]) => (
            <div
              key={key}
              onClick={() => setSelectedCompliance(key)}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              role="button"
              tabIndex="0"
              aria-label={`View details about ${compliance.title}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(compliance.color)} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-lg" aria-hidden="true">{compliance.icon}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{compliance.year}</div>
                  <div className="text-xs text-gray-400">{compliance.region}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {compliance.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {compliance.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-700">
                  {getCategoryIcon(compliance.category)} {compliance.category}
                </span>
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCompliances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No frameworks found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedCompliance && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(compliances[selectedCompliance].color)} rounded-3xl flex items-center justify-center text-white shadow-lg`}>
                      <span className="text-2xl" aria-hidden="true">{compliances[selectedCompliance].icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{compliances[selectedCompliance].title}</h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{compliances[selectedCompliance].region} • {compliances[selectedCompliance].year}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                          {getCategoryIcon(compliances[selectedCompliance].category)} {compliances[selectedCompliance].category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCompliance(null)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What is it?</h3>
                  <p className="text-gray-700 leading-relaxed">{compliances[selectedCompliance].description}</p>
                </div>

                {/* Simple Example */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Simple Example</h3>
                  <p className="text-blue-800 leading-relaxed">{compliances[selectedCompliance].simpleExample}</p>
                </div>

                {/* Who Needs It */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">👥 Who needs to follow this?</h3>
                  <p className="text-gray-700 leading-relaxed">{compliances[selectedCompliance].whoNeedsIt}</p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔑 Key Requirements</h3>
                  <div className="space-y-3">
                    {compliances[selectedCompliance].keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedCompliance(null);
                      onNavigate('analyzer');
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Analyze My Policies Against This Framework
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCompliance(null);
                      onNavigate('generator');
                    }}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Generate New Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(KnowCompliances);
