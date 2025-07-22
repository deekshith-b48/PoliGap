import RulesBenchmarkingEngine from './rulesBenchmarking.js';
import PolicyDocumentAnalyzer from './complianceAnalyzer.js';
import PolicyContentScanner from './policyContentScanner.js';

// ✅ ADVANCED PRIVACY POLICY VALIDATION WITH CONTENT-BASED HEURISTICS
function validateDocumentType(text, isPdfFile = false) {
  const normalizedText = text.toLowerCase();
  
  // 🔓 ALLOW ALL PDF FILES - PDFs get special handling
  if (isPdfFile) {
    console.log('📄 PDF file detected - applying permissive validation');
    
    // For PDF files, we're more lenient with validation
    // Only reject if it's obviously not a business document
    const obviousNonBusinessPatterns = [
      'curriculum vitae', 'resume', 'cv', 'job application', 'cover letter',
      'dear hiring manager', 'applying for the position', 'professional experience',
      'work history', 'employment history', 'career objective', 'references available',
      'education background', 'bachelor', 'master', 'degree', 'university',
      'seeking a position', 'years of experience', 'skills include'
    ];
    
    let nonBusinessMatches = 0;
    obviousNonBusinessPatterns.forEach(pattern => {
      if (normalizedText.includes(pattern)) {
        nonBusinessMatches++;
      }
    });
    
    // Only reject PDFs if they have multiple obvious non-business indicators
    // OR if they have very strong resume indicators
    const strongResumePatterns = [
      'professional experience', 'work history', 'employment history', 
      'career objective', 'references available', 'seeking a position'
    ];
    
    let strongResumeMatches = 0;
    strongResumePatterns.forEach(pattern => {
      if (normalizedText.includes(pattern)) {
        strongResumeMatches++;
      }
    });
    
    if (nonBusinessMatches >= 3 || strongResumeMatches >= 1) {
      return {
        isValid: false,
        type: 'resume_or_personal',
        confidence: 85,
        reason: `PDF appears to be a resume or personal document rather than a business policy`,
        isPdfFile: true,
        nonBusinessMatches: nonBusinessMatches,
        strongResumeMatches: strongResumeMatches
      };
    }
    
    // For PDF files, accept them with lower thresholds
    return {
      isValid: true,
      type: 'pdf_document',
      subType: 'business_document',
      confidence: 90,
      reason: 'PDF file accepted for analysis',
      isPdfFile: true,
      privacyScore: 0, // Will be calculated in analysis
      structureScore: 0,
      qualityScore: 0,
      textLength: normalizedText.length
    };
  }
  
  // 🚨 STRICT LENGTH VALIDATION for non-PDF files
  if (normalizedText.length < 1000) { // Increased from 500 for comprehensive policies
    return {
      isValid: false,
      type: 'insufficient_content',
      confidence: 95,
      reason: 'Document too short for a comprehensive privacy policy (minimum 1000 characters required)',
      requiredLength: 1000,
      actualLength: normalizedText.length
    };
  }
  
  // 🔍 ESSENTIAL PRIVACY POLICY SECTIONS DETECTION (Must-Have Regex Patterns)
  const mustHaveSections = [
    {
      name: 'Data Collection/Gathering',
      patterns: [
        /data (collection|gathering|usage)/i,
        /information we collect/i,
        /personal (data|information) we (collect|gather|obtain)/i,
        /what (data|information) (do )?we collect/i
      ]
    },
    {
      name: 'User Rights/Individual Rights',
      patterns: [
        /user rights/i,
        /individual rights/i,
        /your rights/i,
        /data subject rights/i,
        /right to (access|delete|correct|portability)/i
      ]
    },
    {
      name: 'Third-Party Sharing/Disclosure',
      patterns: [
        /third[- ]?party (sharing|disclosure)/i,
        /share (your )?(data|information) with/i,
        /disclosure of (personal )?information/i,
        /data sharing/i
      ]
    },
    {
      name: 'Data Retention/Storage',
      patterns: [
        /retention|storage duration/i,
        /how long we (keep|store|retain)/i,
        /data retention/i,
        /retention period/i
      ]
    },
    {
      name: 'Security Measures',
      patterns: [
        /security measures/i,
        /data security/i,
        /protect (your )?(data|information)/i,
        /security of (personal )?information/i
      ]
    },
    {
      name: 'Legal Compliance',
      patterns: [
        /(GDPR|CCPA|legal basis)/i,
        /privacy law/i,
        /regulatory compliance/i,
        /legal (basis|ground)/i
      ]
    }
  ];

  // Check for essential sections
  const essentialFoundSections = [];
  const missingSections = [];
  
  mustHaveSections.forEach(section => {
    const found = section.patterns.some(pattern => pattern.test(text));
    if (found) {
      essentialFoundSections.push(section.name);
    } else {
      missingSections.push(section.name);
    }
  });

  // Calculate section completeness score
  const sectionCompleteness = (essentialFoundSections.length / mustHaveSections.length) * 100;
  
  // 🚨 STRICT SECTION REQUIREMENTS - Must have at least 4/6 essential sections
  if (essentialFoundSections.length < 4) {
    return {
      isValid: false,
      type: 'insufficient_privacy_content',
      confidence: 90,
      reason: `Missing critical privacy policy sections. Found ${essentialFoundSections.length}/6 required sections.`,
      foundSections: essentialFoundSections,
      missingSections: missingSections,
      sectionCompleteness: sectionCompleteness,
      requiredSections: mustHaveSections.length,
      actualSections: essentialFoundSections.length
    };
  }

  // ✅ 1. STRICT PRIVACY POLICY VALIDATION
  const privacyPolicyIndicators = [
    'privacy policy', 'privacy notice', 'data protection policy', 'privacy statement',
    'data privacy policy', 'user privacy', 'information privacy', 'privacy practices'
  ];

  const dataProtectionTerms = [
    'personal data', 'personal information', 'data collection', 'data processing',
    'user data', 'collect information', 'process data', 'handle data',
    'sensitive information', 'personally identifiable information', 'pii'
  ];

  const legalComplianceTerms = [
    'gdpr', 'ccpa', 'hipaa', 'data protection regulation', 'privacy laws',
    'regulatory compliance', 'legal basis', 'lawful basis', 'consent',
    'legitimate interest', 'legal ground', 'california consumer privacy act'
  ];

  const userRightsTerms = [
    'user rights', 'data subject rights', 'your rights', 'individual rights',
    'access your data', 'delete data', 'correct information', 'opt-out', 
    'withdraw consent', 'right to portability', 'right to rectification'
  ];

  const securityTerms = [
    'data security', 'security measures', 'protect information', 'safeguard data',
    'encryption', 'secure transmission', 'data breach', 'unauthorized access',
    'technical safeguards', 'organizational measures'
  ];

  const retentionTerms = [
    'data retention', 'retention period', 'how long we keep', 'storage duration',
    'delete data', 'retention policy', 'data lifecycle', 'storage limitation'
  ];

  // Advanced scoring with weighted importance
  let privacyScore = 0;
  
  // Core privacy policy indicators (highest weight - 30 points each)
  privacyPolicyIndicators.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 30;
    }
  });

  // Data protection terms (high weight - 20 points each)
  dataProtectionTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 20;
    }
  });

  // Legal compliance terms (medium-high weight - 15 points each)
  legalComplianceTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 15;
    }
  });

  // User rights terms (medium weight - 12 points each)
  userRightsTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 12;
    }
  });

  // Security & retention terms (medium weight - 10 points each)
  securityTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 10;
    }
  });

  retentionTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 10;
    }
  });

  // ✅ 2. POLICY STRUCTURE VALIDATION
  const requiredSections = [
    'data collection', 'information we collect', 'what information',
    'how we use', 'data usage', 'purpose of processing',
    'data sharing', 'third parties', 'disclosure',
    'your rights', 'user rights', 'data subject rights',
    'security', 'data protection', 'safeguards',
    'retention', 'how long', 'storage period'
  ];

  let structureScore = 0;
  const structuralFoundSections = [];
  
  requiredSections.forEach(section => {
    if (normalizedText.includes(section)) {
      structureScore += 12;
      structuralFoundSections.push(section);
    }
  });

  // ✅ 3. CONTENT QUALITY INDICATORS
  const qualityIndicators = [
    'effective date', 'last updated', 'contact us', 'questions about',
    'changes to policy', 'policy updates', 'version', 'review date'
  ];

  let qualityScore = 0;
  qualityIndicators.forEach(indicator => {
    if (normalizedText.includes(indicator)) {
      qualityScore += 5;
    }
  });

  // FIRST: Check for STRONG policy indicators - if found, accept immediately
  const strongPolicyIndicators = [
    'privacy policy', 'data protection policy', 'security policy', 'employee handbook',
    'code of conduct', 'compliance policy', 'acceptable use policy', 'terms of service',
    'privacy notice', 'data processing', 'gdpr', 'hipaa', 'regulatory compliance',
    'information governance', 'risk management policy', 'incident response',
    'business continuity', 'disaster recovery', 'organizational policy'
  ];

  for (const indicator of strongPolicyIndicators) {
    if (normalizedText.includes(indicator)) {
      return {
        isValid: true,
        type: 'policy',
        subType: indicator.includes('privacy') ? 'privacy_policy' : 'general_policy',
        confidence: 98,
        reason: `Strong policy indicator found: "${indicator}"`,
        privacyScore: privacyScore,
        structureScore: structureScore,
        foundSections: structuralFoundSections,
        essentialSections: essentialFoundSections,
        sectionCompleteness: sectionCompleteness
      };
    }
  }

  // SECOND: Check for obvious non-policy patterns (only reject if very clear)
  const obviousRejectPatterns = {
    resume: [
      'curriculum vitae', 'professional experience', 'education background',
      'work history', 'employment history', 'career objective', 'references available'
    ],
    personal: [
      'dear hiring manager', 'job application', 'cover letter',
      'applying for the position', 'i am writing to express interest'
    ],
    academic: [
      'research methodology', 'literature review', 'peer reviewed',
      'journal article', 'research hypothesis', 'statistical analysis'
    ],
    marketing: [
      'special offer', 'limited time offer', 'call now', 'buy now',
      'promotional material', 'marketing campaign', 'exclusive deal'
    ],
    financial: [
      'invoice number', 'amount due', 'payment terms', 'balance sheet',
      'income statement', 'financial report', 'quarterly earnings'
    ]
  };

  // Only reject if we find multiple strong indicators of non-policy content
  for (const [type, patterns] of Object.entries(obviousRejectPatterns)) {
    let strongMatches = 0;
    for (const pattern of patterns) {
      if (normalizedText.includes(pattern)) {
        strongMatches++;
      }
    }
    
    // Require at least 2 strong matches to reject
    if (strongMatches >= 2) {
      return {
        isValid: false,
        type: type,
        confidence: Math.min(90, strongMatches * 25),
        reason: `Multiple ${type} indicators found (${strongMatches} matches)`
      };
    }
  }

  // THIRD: Look for policy-related content with flexible scoring
  const policyPatterns = {
    privacy: [
      'privacy', 'personal information', 'data collection', 'data sharing',
      'user data', 'information we collect', 'how we use', 'third parties'
    ],
    security: [
      'security', 'access control', 'information security', 'cybersecurity',
      'security measures', 'data security', 'system security'
    ],
    governance: [
      'policy', 'procedure', 'guidelines', 'standards', 'compliance',
      'governance', 'framework', 'requirements', 'responsibilities'
    ],
    business: [
      'organization', 'company', 'business', 'employee', 'management',
      'corporate', 'operational', 'process', 'implementation'
    ]
  };

  let totalPolicyScore = 0;
  for (const [category, patterns] of Object.entries(policyPatterns)) {
    for (const pattern of patterns) {
      if (normalizedText.includes(pattern)) {
        totalPolicyScore += pattern.length > 10 ? 8 : 5; // Longer patterns get more points
      }
    }
  }

  // Look for structural indicators
  const structuralIndicators = [
    'purpose', 'scope', 'effective date', 'version', 'section',
    'definitions', 'responsibilities', 'procedures', 'enforcement'
  ];
  
  const structuralScore = structuralIndicators.filter(indicator => 
    normalizedText.includes(indicator)
  ).length * 10;

  // ✅ 4. COMPREHENSIVE SCORING SYSTEM
  const finalScore = privacyScore + structureScore + qualityScore + totalPolicyScore + structuralScore;
  
  // Dynamic threshold based on document length and type
  const lengthFactor = Math.min(1.5, normalizedText.length / 3000);
  const baseThreshold = privacyScore > 0 ? 25 : 35; // Lower threshold for documents with privacy indicators
  const adjustedThreshold = baseThreshold * lengthFactor;
  
  // Special validation for privacy policies
  const isPrivacyPolicy = privacyScore >= 25;
  const hasGoodStructure = structureScore >= 30;
  const meetsQualityStandards = qualityScore >= 10;
  
  return {
    isValid: finalScore >= adjustedThreshold,
    type: isPrivacyPolicy ? 'privacy_policy' : (finalScore >= adjustedThreshold ? 'policy' : 'unknown'),
    subType: isPrivacyPolicy ? 'privacy_policy' : 'general_policy',
    confidence: Math.min(98, Math.max(60, finalScore * 1.2)),
    privacyScore: privacyScore,
    structureScore: structureScore,
    qualityScore: qualityScore,
    contentScore: totalPolicyScore,
    structuralScore: structuralScore,
    finalScore: finalScore,
    threshold: adjustedThreshold,
    foundSections: structuralFoundSections,
    essentialSections: essentialFoundSections,
    missingSections: missingSections,
    sectionCompleteness: sectionCompleteness,
    isPrivacyPolicy: isPrivacyPolicy,
    hasGoodStructure: hasGoodStructure,
    meetsQualityStandards: meetsQualityStandards,
    reason: finalScore >= adjustedThreshold ? 
      `Policy content detected (score: ${finalScore}, threshold: ${adjustedThreshold})` :
      `Insufficient policy indicators (score: ${finalScore}, needed: ${adjustedThreshold})`
  };
}
function findLastCompleteJsonEnd(jsonStr) {
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let lastCompleteEnd = -1;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    const prevChar = i > 0 ? jsonStr[i - 1] : '';

    if (char === '"' && prevChar !== '\\') {
      inString = !inString;
    }

    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && bracketCount === 0) {
          lastCompleteEnd = i;
        }
      }
      else if (char === '[') bracketCount++;
      else if (char === ']') {
        bracketCount--;
        if (braceCount === 0 && bracketCount === 0) {
          lastCompleteEnd = i;
        }
      }
    }
  }

  return lastCompleteEnd;
}

// Helper function to validate JSON structure
function isValidJsonStructure(jsonStr) {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch (e) {
    return false;
  }
}

// Helper function to repair common JSON issues
function repairJsonStructure(jsonStr) {
  let repaired = jsonStr;

  // Fix common truncation issues
  // If ends with incomplete array/object, try to close them
  if (repaired.endsWith(',')) {
    // Remove trailing comma
    repaired = repaired.slice(0, -1);
  }

  // Count unmatched braces and brackets
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    const prevChar = i > 0 ? repaired[i - 1] : '';

    if (char === '"' && prevChar !== '\\') {
      inString = !inString;
    }

    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '[') bracketCount++;
      else if (char === ']') bracketCount--;
    }
  }

  // Close unmatched structures
  while (bracketCount > 0) {
    repaired += ']';
    bracketCount--;
  }

  while (braceCount > 0) {
    repaired += '}';
    braceCount--;
  }

  // If still invalid, try to find and use only the main object
  if (!isValidJsonStructure(repaired)) {
    const mainObjStart = repaired.indexOf('{');
    if (mainObjStart !== -1) {
      const lastCompleteEnd = findLastCompleteJsonEnd(repaired.substring(mainObjStart));
      if (lastCompleteEnd > 0) {
        repaired = repaired.substring(mainObjStart, mainObjStart + lastCompleteEnd + 1);
      }
    }
  }

  return repaired;
}

export async function analyzeDocument(text, config = {}) {
  // ✅ ENHANCED PRIVACY POLICY VALIDATION SYSTEM
  console.log('🔍 Performing enhanced privacy policy validation...');
  
  // Check if this is a PDF file based on config or text characteristics
  const isPdfFile = config.isPdfFile || config.fileType === 'pdf' || config.source === 'pdf';
  
  const documentValidation = validateDocumentType(text, isPdfFile);
  
  console.log('📊 Privacy Policy Validation Results:', {
    isValid: documentValidation.isValid,
    type: documentValidation.type,
    subType: documentValidation.subType,
    confidence: documentValidation.confidence,
    isPdfFile: documentValidation.isPdfFile,
    isPrivacyPolicy: documentValidation.isPrivacyPolicy,
    hasGoodStructure: documentValidation.hasGoodStructure,
    meetsQualityStandards: documentValidation.meetsQualityStandards,
    textLength: text.length,
    textPreview: text.substring(0, 200) + '...',
    detailedScores: {
      privacy: documentValidation.privacyScore,
      structure: documentValidation.structureScore,
      quality: documentValidation.qualityScore,
      content: documentValidation.contentScore,
      structural: documentValidation.structuralScore,
      final: documentValidation.finalScore,
      threshold: documentValidation.threshold
    },
    foundSections: documentValidation.foundSections
  });
  
  // ❌ STRICT REJECTION for non-policy documents
  if (!documentValidation.isValid && documentValidation.confidence > 85 && 
      ['resume', 'personal', 'academic', 'marketing', 'financial'].includes(documentValidation.type)) {
    console.log('❌ Document rejected - not a policy document:', documentValidation.type);
    return {
      isValidDocument: false,
      documentType: documentValidation.type,
      rejectionReason: `This document appears to be a ${documentValidation.type} rather than a privacy policy or business policy document.`,
      confidence: documentValidation.confidence,
      detectedContent: `Document identified as ${documentValidation.type} content with ${documentValidation.confidence}% confidence`,
      quirkMessage: `❌ Invalid Document Type Detected!\n\nThe uploaded file appears to be a ${documentValidation.type} document. Our Privacy Policy Gap Analyzer requires:\n\n✅ Privacy Policies\n✅ Data Protection Policies\n✅ Privacy Notices\n✅ Terms of Service (with privacy sections)\n✅ Employee Data Handling Policies\n\nPlease upload a complete privacy policy document for accurate gap analysis.`,
      validationDetails: {
        scores: documentValidation,
        expectedSections: [
          'Data Collection Practices',
          'Information Usage & Processing', 
          'User Rights & Controls',
          'Data Sharing & Third Parties',
          'Security Measures',
          'Data Retention Policies'
        ]
      }
    };
  }
  
  // ⚠️ INSUFFICIENT PRIVACY POLICY CONTENT
  if (!documentValidation.isValid && documentValidation.privacyScore < 25) {
    console.log('⚠️ Document lacks sufficient privacy policy content');
    return {
      isValidDocument: false,
      documentType: 'insufficient_privacy_content',
      rejectionReason: 'Document does not contain sufficient privacy policy content for accurate analysis.',
      confidence: 85,
      detectedContent: `Low privacy policy score: ${documentValidation.privacyScore}/100`,
      quirkMessage: `⚠️ Insufficient Privacy Policy Content!\n\nThe uploaded document doesn't contain enough privacy-specific content for reliable analysis.\n\nEnsure your document includes:\n📋 Data collection practices\n📋 Information usage policies\n📋 User rights and controls\n📋 Third-party data sharing\n📋 Security and retention policies\n\nFor best results, upload a complete privacy policy that covers these essential areas.`,
      validationDetails: {
        scores: documentValidation,
        missingElements: [
          'Privacy policy terminology',
          'Data protection language', 
          'User rights sections',
          'Legal compliance references'
        ],
        suggestions: [
          'Ensure document title includes "Privacy Policy"',
          'Include sections on data collection and usage',
          'Add user rights and control information',
          'Reference applicable privacy laws (GDPR, CCPA, etc.)'
        ]
      }
    };
  }
  
  // ✅ DOCUMENT VALIDATION PASSED
  if (documentValidation.isValid) {
    console.log('✅ Privacy Policy validation passed:', {
      type: documentValidation.type,
      subType: documentValidation.subType,
      confidence: documentValidation.confidence,
      isPrivacyPolicy: documentValidation.isPrivacyPolicy,
      foundSections: documentValidation.foundSections?.length || 0
    });
  } else {
    console.log('⚠️ Document validation uncertain, proceeding with limited analysis:', documentValidation.reason);
  }

  // Use environment variable or fallback to direct API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBEyNqivrte8K4J_pu6bWzsTfics57MNNA';
  
  // Extract configuration with defaults and ensure proper types
  let selectedFrameworks = config.frameworks;
  const industry = config.industry || 'Technology';
  
  // Ensure selectedFrameworks is always an array
  if (!selectedFrameworks) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  } else if (!Array.isArray(selectedFrameworks)) {
    selectedFrameworks = [selectedFrameworks];
  } else if (selectedFrameworks.length === 0) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  }
  
  console.log('API Key available:', !!apiKey);
  console.log('API Key (first 10 chars):', apiKey?.substring(0, 10));
  console.log('Selected Frameworks (processed):', selectedFrameworks);
  console.log('Industry:', industry);
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please check your API key configuration.');
  }

  // Ensure frameworksArray is definitely an array
  const frameworksArray = Array.isArray(selectedFrameworks) ? selectedFrameworks : [selectedFrameworks].filter(Boolean);

  // Initialize analysis engines
  const benchmarkingEngine = new RulesBenchmarkingEngine();
  const policyAnalyzer = new PolicyDocumentAnalyzer();
  const contentScanner = new PolicyContentScanner();

  // Perform comprehensive analysis
  const benchmarkResults = benchmarkingEngine.performComprehensiveBenchmarking(text, frameworksArray, industry);
  const structuredAnalysis = policyAnalyzer.analyzePolicy(text);
  const contentScanResults = contentScanner.scanDocument(text);

  console.log('Benchmarking completed. Average score:', benchmarkResults.overallResults.averageScore);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  console.log('Making request to:', url.replace(apiKey, 'HIDDEN_API_KEY'));

  const prompt = `
You are an expert privacy policy compliance analyst with specialized knowledge in data protection regulations.

DOCUMENT VALIDATION STATUS:
✅ Document Type: ${documentValidation.type} (${documentValidation.subType || 'general'})
✅ Privacy Policy Score: ${documentValidation.privacyScore || 0}/100
✅ Structure Quality: ${documentValidation.structureScore || 0}/100  
✅ Content Completeness: ${documentValidation.qualityScore || 0}/100
✅ Found Sections: ${documentValidation.foundSections?.join(', ') || 'None detected'}
✅ Validation Confidence: ${documentValidation.confidence}%

SPECIALIZED PRIVACY POLICY ANALYSIS INSTRUCTIONS:
This document has been validated as a ${documentValidation.isPrivacyPolicy ? 'PRIVACY POLICY' : 'GENERAL POLICY'} document.
Focus on privacy-specific compliance requirements and data protection standards.

CONTEXT-AWARE GAP DETECTION - Analyze for these ESSENTIAL privacy policy elements:

🔍 DATA COLLECTION ANALYSIS:
- Types of personal data collected (PII, behavioral, technical)
- Collection methods and sources (direct, automatic, third-party)
- Legal basis for collection (consent, legitimate interest, contractual)
- Data minimization principles compliance

🔍 DATA USAGE & PROCESSING:
- Purposes of data processing clearly defined
- Processing activities aligned with stated purposes  
- Automated decision-making and profiling disclosures
- Data processing transparency and lawfulness

🔍 USER RIGHTS & CONTROLS:
- Right to access personal data
- Right to rectification/correction
- Right to erasure (right to be forgotten)
- Right to data portability
- Right to object to processing
- Opt-out mechanisms and consent withdrawal

🔍 DATA SHARING & THIRD PARTIES:
- Third-party data sharing practices
- Categories of recipients disclosed
- International data transfers and safeguards
- Vendor/processor agreements and controls
- Data sale/monetization practices

🔍 SECURITY & PROTECTION:
- Technical and organizational security measures
- Data breach notification procedures
- Access controls and authorization
- Encryption and data protection standards
- Incident response and remediation

🔍 RETENTION & DELETION:
- Data retention periods specified
- Deletion procedures and timelines
- Storage limitation principles
- Archive and backup data handling
- End-of-life data destruction

COMPREHENSIVE BENCHMARKING ANALYSIS:
- Overall Compliance Score: ${benchmarkResults.overallResults.averageScore}%
- Industry Benchmark (${industry}): ${benchmarkResults.overallResults.industryBenchmark.average}%
- Performance Level: ${benchmarkResults.overallResults.benchmarkComparison}
- Critical Privacy Gaps: ${benchmarkResults.overallResults.criticalGaps}
- High Priority Issues: ${benchmarkResults.overallResults.highGaps}
- Privacy Strengths Identified: ${benchmarkResults.overallResults.totalStrengths}

DETAILED FRAMEWORK ANALYSIS:
${Object.entries(benchmarkResults.frameworkResults).map(([framework, results]) => 
  `- ${framework} (${results.frameworkFullName}): ${results.overallScore}% - ${results.maturityLevel} maturity level`
).join('\n    ')}

STRUCTURED ANALYSIS INSIGHTS:
- Privacy Red Flags: ${structuredAnalysis.redFlags.length}
- Framework Compliance: ${Object.entries(structuredAnalysis.frameworkScores).map(([f, s]) => `${f}: ${s.score}%`).join(', ')}
- Critical Violations: ${structuredAnalysis.redFlags.filter(f => f.severity === 'CRITICAL').length}
- High Priority Issues: ${structuredAnalysis.redFlags.filter(f => f.severity === 'HIGH').length}

CONTENT SCAN RESULTS:
- Document Classification: ${contentScanResults.documentType}
- Privacy Policies Detected: ${contentScanResults.detectedPolicies.length}
- Content Completeness: ${contentScanResults.completenessScore}%
- Compliance References: ${Object.keys(contentScanResults.complianceReferences).join(', ')}
- Missing Critical Elements: ${contentScanResults.missingElements.length}

PRIORITY PRIVACY RECOMMENDATIONS:
${benchmarkResults.prioritizedRecommendations.slice(0, 5).map(rec => 
  `- Priority ${rec.priority}: ${rec.title} (${rec.framework} - ${rec.criticality} impact)`
).join('\n    ')}

MANDATORY: You MUST respond with ONLY valid JSON in this exact format:

For VALID privacy policy documents:
{
  "isValidDocument": true,
  "documentType": "privacy_policy",
  "documentCategory": "privacy|data_protection|terms_privacy|employee_privacy",
  "summary": "Executive summary focusing on privacy compliance status, critical gaps, and regulatory alignment",
  "overallScore": ${benchmarkResults.overallResults.averageScore},
  "confidence": 98,
  "privacyPolicyValidation": {
    "isPrivacyPolicy": ${documentValidation.isPrivacyPolicy || false},
    "privacyScore": ${documentValidation.privacyScore || 0},
    "structureQuality": ${documentValidation.structureScore || 0},
    "foundSections": ${JSON.stringify(documentValidation.foundSections || [])},
    "missingCriticalSections": ["List sections not found but required"],
    "complianceReadiness": "High|Medium|Low"
  },
  "industryBenchmark": {
    "userScore": ${benchmarkResults.overallResults.averageScore},
    "industryAverage": ${benchmarkResults.overallResults.industryBenchmark.average},
    "comparison": "${benchmarkResults.overallResults.benchmarkComparison}",
    "industry": "${industry}",
    "percentileRanking": 75,
    "privacySpecificRanking": 80
  },
  "frameworks": [
    {
      "name": "Framework Name (focus on GDPR, CCPA, PIPEDA for privacy)",
      "score": 85,
      "maturityLevel": "Intermediate|Basic|Advanced|Inadequate",
      "status": "Compliant|Non-Compliant|Partially Compliant",
      "gaps": ["Privacy-specific gaps identified"],
      "strengths": ["Privacy protection strengths"],
      "recommendations": ["Actionable privacy improvements"],
      "criticalIssues": 2,
      "riskLevel": "High|Medium|Low",
      "privacySpecificFindings": ["Data protection specific issues"]
    }
  ],
  "criticalIssues": [
    {
      "title": "Privacy-focused issue title",
      "description": "Detailed privacy compliance description",
      "impact": "High|Medium|Low", 
      "framework": "GDPR|CCPA|PIPEDA|Privacy Law",
      "recommendation": "Specific privacy action required",
      "urgency": "Immediate|Short-term|Long-term",
      "riskScore": 85,
      "dataProtectionRisk": "High|Medium|Low",
      "userRightsImpact": "Significant|Moderate|Minor"
    }
  ],
  "recommendations": [
    {
      "title": "Privacy-specific recommendation",
      "description": "Implementation guidance for privacy compliance",
      "priority": "Critical|High|Medium|Low",
      "framework": "Related privacy framework",
      "timeframe": "Immediate|Short-term|Long-term", 
      "effort": "High|Medium|Low",
      "businessImpact": "Privacy and data protection business impact",
      "privacyBenefit": "Specific privacy protection improvement"
    }
  ],
  "essentialSectionsAnalysis": {
    "dataCollection": {
      "present": true,
      "quality": "High|Medium|Low",
      "gaps": ["Specific collection gaps"],
      "score": 85
    },
    "dataUsage": {
      "present": true,
      "quality": "High|Medium|Low", 
      "gaps": ["Usage and processing gaps"],
      "score": 75
    },
    "userRights": {
      "present": false,
      "quality": "High|Medium|Low",
      "gaps": ["Missing or incomplete user rights"],
      "score": 60
    },
    "dataSharing": {
      "present": true,
      "quality": "High|Medium|Low",
      "gaps": ["Third-party sharing gaps"],
      "score": 70
    },
    "security": {
      "present": true,
      "quality": "High|Medium|Low",
      "gaps": ["Security measure gaps"],
      "score": 80
    },
    "retention": {
      "present": false,
      "quality": "Low",
      "gaps": ["Missing retention policies"],
      "score": 40
    }
  },
  "complianceGaps": ${structuredAnalysis.gaps.length},
  "strengthsIdentified": ${benchmarkResults.overallResults.totalStrengths},
  "nextSteps": ["Immediate privacy-focused action items"],
  "privacyPolicyRecommendations": [
    "Add explicit data retention periods",
    "Clarify user rights and exercise procedures", 
    "Enhance third-party data sharing disclosures",
    "Improve data collection transparency"
  ]
}

Document text to analyze (first 3000 characters): "${text.substring(0, 3000)}..."

PRIORITY: Provide comprehensive privacy policy compliance analysis with focus on data protection requirements and user privacy rights.
  `;

  console.log('Starting analyzeDocument API request...');
  console.log('Text length:', text.length);
  console.log('Frameworks:', frameworksArray);
  console.log('Industry:', industry);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 4000, // Increased from 1500 to prevent truncation
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    // Clone the response immediately after fetch, before accessing any properties
    const responseClone = response.clone();

    // Check response status BEFORE reading the body
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Read the response body only once
    let responseText;
    let responseData;

    try {
      responseText = await response.text();
    } catch (readError) {
      console.error('Failed to read response body:', readError);
      // Try reading from the cloned response as fallback
      try {
        responseText = await responseClone.text();
      } catch (cloneError) {
        console.error('Failed to read cloned response body:', cloneError);
        throw new Error('Failed to read API response');
      }
    }

    if (!response.ok) {
      console.error('API Error Response:', responseText);
      throw new Error(`API request failed: ${response.status} - ${responseText}`);
    }

    try {
      responseData = JSON.parse(responseText);
      console.log('API Response received successfully');
      console.log('Response has candidates:', !!responseData.candidates);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      console.error('Raw response text:', responseText);
      throw new Error(`Invalid JSON response from API: ${jsonError.message}`);
    }

    const data = responseData;

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Enhanced JSON cleaning and validation
    let cleanedResponse = generatedText.trim();

    console.log('Original response length:', cleanedResponse.length);

    // Remove markdown code blocks if they exist
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }

    // Check for truncated JSON and attempt to fix it
    if (!cleanedResponse.endsWith('}')) {
      console.warn('Response appears to be truncated, attempting to fix...');

      // Try to find the last complete object/array and truncate there
      const lastCompleteEnd = findLastCompleteJsonEnd(cleanedResponse);
      if (lastCompleteEnd > 0) {
        cleanedResponse = cleanedResponse.substring(0, lastCompleteEnd + 1);
        console.log('Truncated response to last complete JSON structure');
      }
    }

    // Validate JSON structure before parsing
    if (!isValidJsonStructure(cleanedResponse)) {
      console.warn('Invalid JSON structure detected, attempting to repair...');
      cleanedResponse = repairJsonStructure(cleanedResponse);
    }

    console.log('Cleaned response length:', cleanedResponse.length);
    console.log('Cleaned response preview:', cleanedResponse.substring(0, 500) + '...');

    // Final validation before parsing
    if (!cleanedResponse.trim()) {
      throw new Error('Empty response after cleaning');
    }

    try {
      const result = JSON.parse(cleanedResponse);

      console.log('Parsed JSON successfully:', {
        hasSummary: !!result.summary,
        hasGaps: !!result.gaps,
        gapsIsArray: Array.isArray(result.gaps),
        gapsLength: result.gaps ? result.gaps.length : 0,
        hasOverallScore: !!result.overallScore,
        resultKeys: Object.keys(result)
      });

            console.log('JSON parsing successful!');
      console.log('Response validation result keys:', Object.keys(result));

      // Note: Accepting all documents for analysis regardless of AI validation
      if (result.isValidDocument === false) {
        console.log('🔍 AI validation would reject document, but overriding to accept:', result.documentType);
        // Continue with analysis instead of rejecting
      }

      // Enhanced validation for valid policy documents
      const validationResult = {
        isValidDocument: true,
        documentType: result.documentType || 'policy',
        documentCategory: result.documentCategory || 'general',
        confidence: result.confidence || 95
      };

      // More flexible validation - create valid structure if missing
      if (!result.summary) {
        result.summary = `Compliance analysis completed. Overall score: ${benchmarkResults.overallResults.averageScore}%. ${benchmarkResults.overallResults.benchmarkComparison} compared to industry average.`;
      }

      if (!result.gaps || !Array.isArray(result.gaps)) {
        result.gaps = benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => ({
          issue: `${rec.framework || 'Compliance'}: ${rec.title}`,
          severity: rec.criticality || 'medium',
          framework: rec.framework || 'General',
          currentScore: rec.currentScore || 0,
          targetScore: rec.targetScore || 100,
          businessImpact: rec.businessImpact || 'Process improvement needed',
          timeframe: rec.timeframe || '30-90 days',
          effort: rec.estimatedEffort || 'Medium',
          remediation: rec.recommendations ? rec.recommendations.join('; ') : 'Review and implement appropriate controls'
        }));
      }

      // Ensure totalGaps matches actual gaps length
      result.totalGaps = result.gaps.length;

      // Ensure benchmarking results are included
      if (!result.benchmarkingResults) {
        result.benchmarkingResults = benchmarkResults;
      }

      // Add industry benchmark if missing
      if (!result.industryBenchmark) {
        result.industryBenchmark = {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        };
      }

      // Ensure overallScore is present and use structured analysis score
      if (!result.overallScore) {
        result.overallScore = structuredAnalysis.overallScore || benchmarkResults.overallResults.averageScore;
      }

      // Add comprehensive analysis data
      if (!result.structuredAnalysis) {
        result.structuredAnalysis = {
          redFlags: structuredAnalysis.redFlags,
          frameworkScores: structuredAnalysis.frameworkScores,
          sectionAnalysis: structuredAnalysis.sectionAnalysis,
          prioritizedActions: structuredAnalysis.prioritizedActions
        };
      }

      // Add content scan results
      if (!result.contentScanResults) {
        result.contentScanResults = {
          detectedPolicies: contentScanResults.detectedPolicies,
          complianceReferences: contentScanResults.complianceReferences,
          structuredContent: contentScanResults.structuredContent,
          recommendations: contentScanResults.recommendations
        };
      }

      console.log('Final validated result:', {
        totalGaps: result.totalGaps,
        overallScore: result.overallScore,
        hasValidStructure: true,
        documentValidation: validationResult
      });

      // Merge validation result with analysis result
      return {
        ...result,
        ...validationResult
      };
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError.message);
      console.error('Parse error details:', {
        message: parseError.message,
        position: parseError.message.match(/position (\d+)/)?.[1],
        line: parseError.message.match(/line (\d+)/)?.[1],
        column: parseError.message.match(/column (\d+)/)?.[1]
      });
      console.error('Original response length:', generatedText.length);
      console.error('Cleaned response length:', cleanedResponse.length);
      console.error('Response truncated:', !generatedText.trim().endsWith('}'));
      console.error('Response preview (first 500 chars):', cleanedResponse.substring(0, 500));
      console.error('Response end (last 500 chars):', cleanedResponse.substring(Math.max(0, cleanedResponse.length - 500)));

      // Try one more repair attempt
      const finalRepair = repairJsonStructure(cleanedResponse);
      try {
        console.log('Attempting final JSON repair...');
        const result = JSON.parse(finalRepair);
        console.log('JSON repair successful!');

        // More flexible validation and fallback for repaired result
        console.log('Repair attempt - parsed result keys:', Object.keys(result));

        // Create valid structure with enhanced fallbacks
        if (!result.summary) {
          result.summary = structuredAnalysis.summary || `Comprehensive compliance analysis completed. Overall score: ${structuredAnalysis.overallScore}%. ${structuredAnalysis.redFlags.length} compliance gaps identified requiring attention.`;
        }

        if (!result.gaps || !Array.isArray(result.gaps)) {
          result.gaps = structuredAnalysis.gaps.slice(0, 8).map(gap => ({
            issue: gap.issue,
            severity: gap.severity,
            framework: gap.framework,
            currentScore: structuredAnalysis.overallScore,
            targetScore: 100,
            businessImpact: gap.remediation || 'Compliance improvement needed',
            timeframe: gap.severity === 'critical' ? '0-7 days' : gap.severity === 'high' ? '7-30 days' : '30-90 days',
            effort: gap.severity === 'critical' ? 'High' : gap.severity === 'high' ? 'Medium-High' : 'Medium',
            remediation: gap.remediation
          }));
        }

        result.totalGaps = result.gaps.length;
        if (!result.benchmarkingResults) {
          result.benchmarkingResults = benchmarkResults;
        }
        if (!result.industryBenchmark) {
          result.industryBenchmark = {
            userScore: benchmarkResults.overallResults.averageScore,
            industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
            comparison: benchmarkResults.overallResults.benchmarkComparison,
            industry: industry
          };
        }
        if (!result.overallScore) {
          result.overallScore = benchmarkResults.overallResults.averageScore;
        }

        console.log('Repaired result validated successfully');
        return result;
      } catch (repairError) {
        console.error('JSON repair also failed:', repairError);
        console.error('Original parse error:', parseError.message);
        console.error('Repair parse error:', repairError.message);
      }
      
      // Return comprehensive fallback with structured analysis
      return {
        summary: structuredAnalysis.summary || `Comprehensive compliance analysis completed. Overall score: ${structuredAnalysis.overallScore}%. ${structuredAnalysis.redFlags.length} compliance gaps identified across multiple frameworks.`,
        overallScore: structuredAnalysis.overallScore,
        industryBenchmark: {
          userScore: structuredAnalysis.overallScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        },
        benchmarkingResults: benchmarkResults,
        structuredAnalysis: {
          redFlags: structuredAnalysis.redFlags,
          frameworkScores: structuredAnalysis.frameworkScores,
          sectionAnalysis: structuredAnalysis.sectionAnalysis
        },
        contentScanResults: {
          detectedPolicies: contentScanResults.detectedPolicies,
          complianceReferences: contentScanResults.complianceReferences,
          structuredContent: contentScanResults.structuredContent,
          recommendations: contentScanResults.recommendations
        },
        totalGaps: structuredAnalysis.gaps.length,
        gaps: structuredAnalysis.gaps.slice(0, 8).map(gap => ({
          issue: gap.issue,
          severity: gap.severity,
          framework: gap.framework,
          currentScore: structuredAnalysis.overallScore,
          targetScore: 100,
          businessImpact: gap.remediation,
          timeframe: gap.severity === 'critical' ? '0-7 days' : gap.severity === 'high' ? '7-30 days' : '30-90 days',
          effort: gap.severity === 'critical' ? 'High' : gap.severity === 'high' ? 'Medium-High' : 'Medium',
          remediation: gap.remediation
        })),
        prioritizedActions: structuredAnalysis.prioritizedActions || benchmarkResults.prioritizedRecommendations.slice(0, 10)
      };
    }
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);

    // Check for specific error types
    if (error.message && error.message.includes('stream already read')) {
      console.error('Response body was consumed multiple times - this should be fixed now');
    }
    if (error.name === 'AbortError') {
      console.error('Request was aborted (likely timeout)');
    }

    // Return benchmarking results even if API completely fails
    return {
      summary: `Automated rules benchmarking completed despite API error. Compliance score: ${benchmarkResults.overallResults.averageScore}%. ${benchmarkResults.overallResults.criticalGaps} critical gaps identified.`,
      overallScore: benchmarkResults.overallResults.averageScore,
      industryBenchmark: {
        userScore: benchmarkResults.overallResults.averageScore,
        industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
        comparison: benchmarkResults.overallResults.benchmarkComparison,
        industry: industry
      },
      benchmarkingResults: benchmarkResults,
      totalGaps: benchmarkResults.prioritizedRecommendations.length,
      gaps: benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => ({
        issue: `${rec.framework}: ${rec.title}`,
        severity: rec.criticality,
        framework: rec.framework,
        currentScore: rec.currentScore,
        targetScore: rec.targetScore,
        businessImpact: rec.businessImpact,
        timeframe: rec.timeframe,
        effort: rec.estimatedEffort,
        remediation: rec.recommendations.join('; ')
      })),
      prioritizedActions: benchmarkResults.prioritizedRecommendations.slice(0, 10),
      error: 'AI analysis failed, but rules benchmarking results available'
    };
  }
}

// Enhanced function for AI Expert chat and policy generation with improved formatting
export async function analyzeWithGemini(prompt, config = {}) {
  // Use environment variable or fallback to direct API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBEyNqivrte8K4J_pu6bWzsTfics57MNNA';

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please check your API key configuration.');
  }

  const {
    temperature = 0.7,
    maxOutputTokens = 4000,
    topP = 0.8,
    topK = 40,
    enhancedFormatting = false,
    isPolicyGeneration = false
  } = config;

  // Enhanced prompt for better policy generation with README-style formatting
  const enhancedPrompt = isPolicyGeneration ? `
${prompt}

IMPORTANT FORMATTING GUIDELINES:
- Use clear markdown headers (# for main sections, ## for subsections, ### for sub-subsections)
- Use bullet points (-) for lists and numbered lists (1., 2., 3.) where appropriate
- Use **bold** for important terms, policies, and requirements
- Use *italics* for emphasis and definitions
- Use \`code blocks\` for specific references, dates, or technical terms
- Structure content with clear paragraphs and proper spacing
- Include relevant legal disclaimers and compliance notes
- Ensure professional, clear, and actionable language
- Use proper section breaks and logical flow
- Include specific implementation guidance where applicable
- Format compliance requirements as clear bullet points
- Use consistent terminology throughout
- Include version control and effective date information

Ensure the output is well-structured for both digital reading and PDF generation.
` : prompt;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature,
          topK,
          topP,
          maxOutputTokens,
          candidateCount: 1,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    // Clone the response immediately after fetch, before accessing any properties
    const responseClone = response.clone();

    // Check response status BEFORE reading the body
    console.log('Chat API response status:', response.status);
    console.log('Chat API response ok:', response.ok);

    // Read the response body only once
    let responseText;
    let responseData;

    try {
      responseText = await response.text();
    } catch (readError) {
      console.error('Failed to read response body:', readError);
      // Try reading from the cloned response as fallback
      try {
        responseText = await responseClone.text();
      } catch (cloneError) {
        console.error('Failed to read cloned response body:', cloneError);
        throw new Error('Failed to read API response');
      }
    }

    if (!response.ok) {
      console.error('Chat API Error Response:', responseText);
      throw new Error(`API request failed: ${response.status} - ${responseText}`);
    }

    try {
      responseData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      console.error('Raw response text:', responseText);
      throw new Error(`Invalid JSON response from API: ${jsonError.message}`);
    }

    if (!responseData.candidates || !responseData.candidates[0] || !responseData.candidates[0].content) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid API response format');
    }

    const generatedText = responseData.candidates[0].content.parts[0].text.trim();

    // Post-process for better formatting if this is policy generation
    if (isPolicyGeneration || enhancedFormatting) {
      return postProcessPolicyText(generatedText);
    }

    return generatedText;
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    // Provide more user-friendly error messages
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
}

// Post-process policy text for better formatting and accuracy
const postProcessPolicyText = (text) => {
  return text
    // Ensure proper header formatting
    .replace(/^([A-Z][A-Z\s]+)$/gm, '# $1')
    .replace(/^([0-9]+\.)\s*([A-Z][A-Za-z\s]+)$/gm, '## $1 $2')
    .replace(/^([a-z]\))\s*([A-Za-z\s]+)$/gm, '### $1 $2')

    // Ensure proper list formatting
    .replace(/^([\s]*)•([\s]*)/gm, '$1- ')
    .replace(/^([\s]*)([ivx]+\.)([\s]*)/gim, '$1$2 ')

    // Bold important terms
    .replace(/\b(MUST|SHALL|REQUIRED|MANDATORY|PROHIBITED|FORBIDDEN|CRITICAL|ESSENTIAL)\b/g, '**$1**')
    .replace(/\b(Policy|Procedure|Guidelines?|Standards?|Compliance|Violation|Enforcement)\b/g, '**$1**')

    // Italicize definitions and emphasis
    .replace(/\b(defined as|means|refers to|includes)\b/g, '*$1*')

    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')

    // Clean up extra spaces
    .replace(/[ \t]+/g, ' ')
    .replace(/^[ \t]+|[ \t]+$/gm, '')

    // Ensure sections are properly formatted
    .replace(/^(Purpose|Scope|Policy|Procedure|Implementation|Compliance|Enforcement|Definitions|Background|Responsibilities|Violations|Review|Effective Date):/gim, '## $1')

    // Format dates and versions consistently
    .replace(/Version[\s]*([0-9\.]+)/gi, '**Version $1**')
    .replace(/Effective[\s]+Date[\s]*:?[\s]*([^\n]+)/gi, '**Effective Date:** $1')
    .replace(/Last[\s]+Updated[\s]*:?[\s]*([^\n]+)/gi, '**Last Updated:** $1')

    .trim();
};

// Export the validation function for testing
export { validateDocumentType };

// Helper function to test document validation
export function testDocumentValidation(text) {
  const result = validateDocumentType(text);
  console.log('🔍 Document Validation Test Results:');
  console.log('Text length:', text.length);
  console.log('Text preview:', text.substring(0, 300) + '...');
  console.log('Validation result:', result);
  return result;
}
