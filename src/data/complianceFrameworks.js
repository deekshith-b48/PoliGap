// Comprehensive Compliance Frameworks Database

export const complianceFrameworks = {
  GDPR: {
    id: 'gdpr',
    name: 'General Data Protection Regulation (GDPR)',
    shortName: 'GDPR',
    jurisdiction: 'European Union',
    effectiveDate: '2018-05-25',
    category: 'Data Protection',
    icon: '🇪🇺',
    description: 'The EU General Data Protection Regulation is the toughest privacy and security law in the world.',
    
    overview: `The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy in the European Union (EU) and the European Economic Area (EEA). It also addresses the transfer of personal data outside the EU and EEA areas. The GDPR's primary aim is to enhance individuals' control and rights over their personal data and to simplify the regulatory environment for international business by unifying the regulation within the EU.`,
    
    keyPrinciples: [
      'Lawfulness, fairness, and transparency',
      'Purpose limitation',
      'Data minimization',
      'Accuracy',
      'Storage limitation',
      'Integrity and confidentiality',
      'Accountability'
    ],
    
    articles: {
      'Article 5': 'Principles relating to processing of personal data',
      'Article 6': 'Lawfulness of processing',
      'Article 7': 'Conditions for consent',
      'Article 13': 'Information to be provided where personal data are collected from the data subject',
      'Article 17': 'Right to erasure (right to be forgotten)',
      'Article 20': 'Right to data portability',
      'Article 25': 'Data protection by design and by default',
      'Article 33': 'Notification of a personal data breach to the supervisory authority',
      'Article 35': 'Data protection impact assessment'
    },
    
    requirements: [
      'Data Protection Officer (DPO) appointment for certain organizations',
      'Privacy impact assessments for high-risk processing',
      'Breach notification within 72 hours',
      'Clear and affirmative consent mechanisms',
      'Data subject rights implementation',
      'Privacy by design and default',
      'Record of processing activities',
      'International data transfer safeguards'
    ],
    
    penalties: 'Up to €20 million or 4% of annual global turnover, whichever is higher',
    applicability: 'All organizations processing personal data of EU residents',
    
    implementationSteps: [
      'Conduct data audit and mapping',
      'Update privacy policies and notices',
      'Implement consent mechanisms',
      'Establish data subject rights procedures',
      'Set up breach notification processes',
      'Train staff on GDPR requirements',
      'Conduct privacy impact assessments',
      'Implement technical and organizational measures'
    ]
  },

  CCPA: {
    id: 'ccpa',
    name: 'California Consumer Privacy Act',
    shortName: 'CCPA',
    jurisdiction: 'California, USA',
    effectiveDate: '2020-01-01',
    category: 'Data Protection',
    icon: '🇺🇸',
    description: 'California Consumer Privacy Act gives consumers more control over the personal information that businesses collect about them.',
    
    overview: `The California Consumer Privacy Act (CCPA) is a state statute intended to enhance privacy rights and consumer protection for residents of California, United States. The CCPA grants California residents specific rights regarding their personal information and imposes corresponding obligations on businesses.`,
    
    keyPrinciples: [
      'Consumer right to know',
      'Consumer right to delete',
      'Consumer right to opt-out',
      'Consumer right to non-discrimination',
      'Business transparency obligations'
    ],
    
    consumerRights: [
      'Right to know what personal information is collected',
      'Right to know whether personal information is sold or disclosed',
      'Right to say no to the sale of personal information',
      'Right to access personal information',
      'Right to equal service and price'
    ],
    
    requirements: [
      'Provide clear privacy policy',
      'Respond to consumer requests within 45 days',
      'Implement opt-out mechanisms for data sales',
      'Verify consumer identity for data requests',
      'Maintain records of consumer requests',
      'Train employees on CCPA requirements',
      'Implement reasonable security measures',
      'Provide non-discriminatory treatment'
    ],
    
    applicability: 'Businesses that collect personal information of California residents and meet certain thresholds',
    thresholds: [
      'Annual gross revenues over $25 million',
      'Buy, receive, sell, or share personal information of 100,000+ California residents or households',
      'Derive 50% or more of annual revenues from selling personal information'
    ],
    
    penalties: 'Up to $2,500 per violation or $7,500 per intentional violation',
    
    implementationSteps: [
      'Assess CCPA applicability',
      'Update privacy policy',
      'Implement consumer request procedures',
      'Set up opt-out mechanisms',
      'Train staff on CCPA requirements',
      'Establish data inventory and mapping',
      'Implement verification procedures',
      'Monitor and respond to consumer requests'
    ]
  },

  HIPAA: {
    id: 'hipaa',
    name: 'Health Insurance Portability and Accountability Act',
    shortName: 'HIPAA',
    jurisdiction: 'United States',
    effectiveDate: '1996-08-21',
    category: 'Healthcare',
    icon: '🏥',
    description: 'HIPAA provides data privacy and security provisions for safeguarding medical information.',
    
    overview: `The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that required the creation of national standards to protect sensitive patient health information from being disclosed without the patient's consent or knowledge.`,
    
    keyComponents: [
      'Privacy Rule',
      'Security Rule',
      'Enforcement Rule',
      'Breach Notification Rule',
      'Omnibus Rule'
    ],
    
    privacyRule: {
      description: 'Establishes national standards for the protection of certain health information',
      requirements: [
        'Patient rights over their health information',
        'Administrative requirements',
        'Limits and conditions on the uses and disclosures',
        'Individual authorization requirements'
      ]
    },
    
    securityRule: {
      description: 'Establishes national standards for protecting electronic protected health information',
      safeguards: [
        'Administrative Safeguards',
        'Physical Safeguards',
        'Technical Safeguards'
      ]
    },
    
    requirements: [
      'Conduct risk assessments',
      'Implement workforce training',
      'Designate security officer',
      'Establish access controls',
      'Implement audit controls',
      'Ensure data integrity',
      'Implement transmission security',
      'Establish breach notification procedures'
    ],
    
    penalties: 'Up to $1.5 million per incident, with criminal penalties possible',
    applicability: 'Covered entities and business associates handling protected health information',
    
    implementationSteps: [
      'Identify covered entities and business associates',
      'Conduct risk assessment',
      'Develop policies and procedures',
      'Implement administrative safeguards',
      'Implement physical safeguards',
      'Implement technical safeguards',
      'Train workforce',
      'Monitor and audit compliance'
    ]
  },

  SOX: {
    id: 'sox',
    name: 'Sarbanes-Oxley Act',
    shortName: 'SOX',
    jurisdiction: 'United States',
    effectiveDate: '2002-07-30',
    category: 'Financial',
    icon: '📊',
    description: 'SOX establishes requirements for financial reporting and corporate governance.',
    
    overview: `The Sarbanes-Oxley Act of 2002 is a United States federal law that mandates certain practices in financial record keeping and reporting for corporations. The act was created to protect shareholders, employees, and the public from accounting errors and fraudulent financial practices.`,
    
    keySections: [
      'Section 302: Corporate Responsibility',
      'Section 404: Management Assessment of Internal Controls',
      'Section 409: Real Time Issuer Disclosures',
      'Section 802: Criminal Penalties for Document Destruction'
    ],
    
    requirements: [
      'CEO and CFO certification of financial statements',
      'Internal control assessment and reporting',
      'Independent auditor attestation',
      'Audit committee independence',
      'Management disclosure controls',
      'Real-time disclosure of material changes',
      'Code of ethics for senior financial officers',
      'Whistleblower protection'
    ],
    
    penalties: 'Up to $5 million in fines and 20 years imprisonment for executives',
    applicability: 'Public companies registered with the SEC',
    
    implementationSteps: [
      'Establish audit committee',
      'Implement internal controls',
      'Document control procedures',
      'Conduct management assessment',
      'Obtain auditor attestation',
      'Train management and staff',
      'Monitor and test controls',
      'Report on control effectiveness'
    ]
  },

  'ISO 27001': {
    id: 'iso27001',
    name: 'ISO/IEC 27001 Information Security Management',
    shortName: 'ISO 27001',
    jurisdiction: 'International',
    effectiveDate: '2005-10-15',
    category: 'Information Security',
    icon: '🔒',
    description: 'ISO 27001 is the international standard for information security management systems.',
    
    overview: `ISO/IEC 27001 is an international standard that specifies the requirements for establishing, implementing, operating, monitoring, reviewing, maintaining, and improving a documented Information Security Management System (ISMS).`,
    
    domains: [
      'Information security policies',
      'Organization of information security',
      'Human resource security',
      'Asset management',
      'Access control',
      'Cryptography',
      'Physical and environmental security',
      'Operations security',
      'Communications security',
      'System acquisition, development and maintenance',
      'Supplier relationships',
      'Information security incident management',
      'Information security aspects of business continuity management',
      'Compliance'
    ],
    
    requirements: [
      'Establish ISMS scope',
      'Conduct risk assessment',
      'Implement risk treatment plan',
      'Establish security policies',
      'Implement security controls',
      'Monitor and measure performance',
      'Conduct internal audits',
      'Management review and improvement'
    ],
    
    benefits: [
      'Improved security posture',
      'Regulatory compliance',
      'Customer confidence',
      'Risk management',
      'Business continuity',
      'Competitive advantage'
    ],
    
    applicability: 'Any organization seeking to establish an information security management system',
    
    implementationSteps: [
      'Define ISMS scope and boundaries',
      'Conduct information security risk assessment',
      'Develop risk treatment plan',
      'Implement security policies and procedures',
      'Implement technical and organizational controls',
      'Train employees on information security',
      'Monitor and measure ISMS performance',
      'Conduct internal audits and management review'
    ]
  },

  'PCI DSS': {
    id: 'pcidss',
    name: 'Payment Card Industry Data Security Standard',
    shortName: 'PCI DSS',
    jurisdiction: 'Global',
    effectiveDate: '2004-12-15',
    category: 'Payment Security',
    icon: '💳',
    description: 'PCI DSS is a set of security standards designed to ensure that companies that accept, process, store or transmit credit card information maintain a secure environment.',
    
    overview: `The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment.`,
    
    requirements: [
      'Install and maintain a firewall configuration',
      'Do not use vendor-supplied defaults for system passwords',
      'Protect stored cardholder data',
      'Encrypt transmission of cardholder data across open, public networks',
      'Protect all systems against malware',
      'Develop and maintain secure systems and applications',
      'Restrict access to cardholder data by business need to know',
      'Identify and authenticate access to system components',
      'Restrict physical access to cardholder data',
      'Track and monitor all access to network resources and cardholder data',
      'Regularly test security systems and processes',
      'Maintain a policy that addresses information security'
    ],
    
    complianceLevels: [
      'Level 1: 6+ million transactions annually',
      'Level 2: 1-6 million transactions annually',
      'Level 3: 20,000-1 million e-commerce transactions annually',
      'Level 4: Fewer than 20,000 e-commerce transactions annually'
    ],
    
    penalties: 'Fines up to $100,000 per month for non-compliance',
    applicability: 'All entities that store, process, or transmit cardholder data',
    
    implementationSteps: [
      'Determine PCI DSS scope',
      'Implement network security controls',
      'Secure cardholder data storage',
      'Implement access controls',
      'Monitor and test networks',
      'Maintain information security policy',
      'Complete self-assessment or external audit',
      'Remediate any compliance gaps'
    ]
  }
};

export const getFrameworksByCategory = () => {
  const categories = {};
  Object.values(complianceFrameworks).forEach(framework => {
    if (!categories[framework.category]) {
      categories[framework.category] = [];
    }
    categories[framework.category].push(framework);
  });
  return categories;
};

export const searchFrameworks = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.values(complianceFrameworks).filter(framework =>
    framework.name.toLowerCase().includes(searchTerm) ||
    framework.shortName.toLowerCase().includes(searchTerm) ||
    framework.description.toLowerCase().includes(searchTerm) ||
    framework.category.toLowerCase().includes(searchTerm)
  );
};

export const generateFrameworkReport = (frameworkId) => {
  const framework = complianceFrameworks[frameworkId];
  if (!framework) return null;

  const report = `
${framework.name} (${framework.shortName})
${'='.repeat(framework.name.length + framework.shortName.length + 3)}

BASIC INFORMATION
-----------------
Jurisdiction: ${framework.jurisdiction}
Effective Date: ${framework.effectiveDate}
Category: ${framework.category}

OVERVIEW
--------
${framework.overview}

${framework.keyPrinciples ? `KEY PRINCIPLES
--------------
${framework.keyPrinciples.map(principle => `• ${principle}`).join('\n')}` : ''}

${framework.articles ? `KEY ARTICLES/SECTIONS
---------------------
${Object.entries(framework.articles).map(([key, value]) => `${key}: ${value}`).join('\n')}` : ''}

${framework.requirements ? `REQUIREMENTS
------------
${framework.requirements.map(req => `• ${req}`).join('\n')}` : ''}

${framework.penalties ? `PENALTIES
---------
${framework.penalties}` : ''}

APPLICABILITY
-------------
${framework.applicability}

${framework.implementationSteps ? `IMPLEMENTATION STEPS
--------------------
${framework.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}` : ''}

Generated on: ${new Date().toLocaleDateString()}
Source: Policy Gap Analyzer - Compliance Framework Database
  `;

  return report.trim();
};
