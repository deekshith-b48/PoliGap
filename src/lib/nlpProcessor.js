/**
 * Advanced NLP Processor for Policy Document Analysis
 * Provides intelligent text processing, section classification, and compliance scoring
 */

/**
 * Document section types based on common policy structures
 */
export const SECTION_TYPES = {
  INTRODUCTION: 'introduction',
  SCOPE: 'scope',
  DEFINITIONS: 'definitions',
  DATA_COLLECTION: 'data_collection',
  DATA_USAGE: 'data_usage',
  DATA_SHARING: 'data_sharing',
  DATA_RETENTION: 'data_retention',
  USER_RIGHTS: 'user_rights',
  SECURITY: 'security',
  CONSENT: 'consent',
  COOKIES: 'cookies',
  THIRD_PARTY: 'third_party',
  CONTACT: 'contact',
  UPDATES: 'updates',
  COMPLIANCE: 'compliance'
};

/**
 * Keywords and patterns for section classification
 */
const SECTION_PATTERNS = {
  [SECTION_TYPES.INTRODUCTION]: [
    'introduction', 'overview', 'purpose', 'about this policy', 'we are committed'
  ],
  [SECTION_TYPES.SCOPE]: [
    'scope', 'applies to', 'covers', 'this policy applies', 'who this affects'
  ],
  [SECTION_TYPES.DEFINITIONS]: [
    'definitions', 'terms', 'what we mean', 'terminology', 'glossary'
  ],
  [SECTION_TYPES.DATA_COLLECTION]: [
    'collect', 'gathering', 'obtain', 'receive', 'information we collect',
    'data collection', 'personal information', 'what information'
  ],
  [SECTION_TYPES.DATA_USAGE]: [
    'use', 'process', 'utilize', 'how we use', 'purpose of processing',
    'data usage', 'why we use', 'processing purposes'
  ],
  [SECTION_TYPES.DATA_SHARING]: [
    'share', 'disclose', 'transfer', 'third parties', 'sharing information',
    'data sharing', 'disclosure', 'who we share with'
  ],
  [SECTION_TYPES.DATA_RETENTION]: [
    'retention', 'storage', 'keep', 'delete', 'how long', 'retention period',
    'data retention', 'storage period'
  ],
  [SECTION_TYPES.USER_RIGHTS]: [
    'rights', 'access', 'correct', 'delete', 'portability', 'opt-out',
    'your rights', 'user rights', 'data subject rights'
  ],
  [SECTION_TYPES.SECURITY]: [
    'security', 'protect', 'safeguard', 'encryption', 'technical measures',
    'security measures', 'data protection'
  ],
  [SECTION_TYPES.CONSENT]: [
    'consent', 'agree', 'permission', 'opt-in', 'authorization',
    'legal basis', 'lawful basis'
  ],
  [SECTION_TYPES.COOKIES]: [
    'cookies', 'tracking', 'analytics', 'website usage', 'browser',
    'tracking technologies'
  ],
  [SECTION_TYPES.THIRD_PARTY]: [
    'third party', 'partners', 'vendors', 'service providers', 'external',
    'third-party services'
  ],
  [SECTION_TYPES.CONTACT]: [
    'contact', 'reach us', 'questions', 'complaints', 'data protection officer',
    'contact information'
  ],
  [SECTION_TYPES.UPDATES]: [
    'updates', 'changes', 'modifications', 'revisions', 'policy updates'
  ],
  [SECTION_TYPES.COMPLIANCE]: [
    'gdpr', 'ccpa', 'hipaa', 'compliance', 'regulatory', 'legal requirements'
  ]
};

/**
 * Compliance framework patterns and requirements
 */
const COMPLIANCE_PATTERNS = {
  GDPR: {
    patterns: ['gdpr', 'general data protection regulation', 'eu regulation', 'data protection'],
    requirements: [
      'lawful basis for processing',
      'data subject rights',
      'consent mechanisms',
      'data protection officer',
      'privacy by design',
      'data breach notification',
      'right to be forgotten',
      'data portability'
    ]
  },
  CCPA: {
    patterns: ['ccpa', 'california consumer privacy act', 'california privacy'],
    requirements: [
      'right to know',
      'right to delete',
      'right to opt-out',
      'non-discrimination',
      'consumer requests',
      'third party sharing'
    ]
  },
  HIPAA: {
    patterns: ['hipaa', 'health insurance portability', 'protected health information', 'phi'],
    requirements: [
      'minimum necessary standard',
      'patient access rights',
      'administrative safeguards',
      'physical safeguards',
      'technical safeguards',
      'business associate agreements'
    ]
  },
  SOX: {
    patterns: ['sarbanes-oxley', 'sox', 'financial reporting', 'internal controls'],
    requirements: [
      'financial disclosure',
      'internal controls',
      'audit requirements',
      'management assessment',
      'whistleblower protection'
    ]
  }
};

/**
 * Named Entity Recognition patterns
 */
const ENTITY_PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(\+\d{1,3}[- ]?)?\d{10}|\(\d{3}\)\s*\d{3}[- ]?\d{4}/g,
  ADDRESS: /\d+\s+[A-Za-z\s,]+\s+\d{5}(-\d{4})?/g,
  DATE: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\w+\s+\d{1,2},?\s+\d{4}\b/g,
  URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
};

/**
 * Process document text and extract sections
 */
export class NLPProcessor {
  constructor() {
    this.sections = [];
    this.entities = {};
    this.complianceScore = 0;
    this.gaps = [];
  }

  /**
   * Main processing function
   */
  async processDocument(text, fileName = 'document.txt') {
    console.log('Starting NLP processing for:', fileName);
    
    try {
      // Clean and normalize text
      const cleanText = this.cleanText(text);
      
      // Extract sections
      this.sections = this.extractSections(cleanText);
      
      // Perform named entity recognition
      this.entities = this.extractEntities(cleanText);
      
      // Classify document type
      const docType = this.classifyDocument(cleanText);
      
      // Analyze compliance gaps
      const complianceAnalysis = this.analyzeCompliance(cleanText, this.sections);
      
      // Calculate overall score
      const score = this.calculateComplianceScore(complianceAnalysis);
      
      return {
        fileName,
        docType,
        sections: this.sections,
        entities: this.entities,
        complianceAnalysis,
        score,
        gaps: complianceAnalysis.gaps,
        recommendations: this.generateRecommendations(complianceAnalysis),
        processedAt: new Date().toISOString(),
        wordCount: cleanText.split(/\s+/).length,
        sectionCount: this.sections.length
      };
    } catch (error) {
      console.error('NLP processing error:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  /**
   * Clean and normalize text
   */
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\s{2,}/g, ' ') // Remove excessive spaces
      .trim();
  }

  /**
   * Extract document sections using pattern matching
   */
  extractSections(text) {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check if line is a section header
      const sectionType = this.identifySection(line);
      
      if (sectionType) {
        // Save previous section
        if (currentSection) {
          sections.push({
            type: currentSection,
            title: this.extractSectionTitle(currentContent[0] || ''),
            content: currentContent.join('\n').trim(),
            startLine: i - currentContent.length,
            endLine: i - 1,
            wordCount: currentContent.join(' ').split(/\s+/).length
          });
        }
        
        // Start new section
        currentSection = sectionType;
        currentContent = [line];
      } else if (currentSection) {
        currentContent.push(line);
      } else {
        // Content before any identified section
        if (!currentSection) {
          currentSection = SECTION_TYPES.INTRODUCTION;
          currentContent = [line];
        }
      }
    }

    // Add final section
    if (currentSection && currentContent.length > 0) {
      sections.push({
        type: currentSection,
        title: this.extractSectionTitle(currentContent[0] || ''),
        content: currentContent.join('\n').trim(),
        startLine: lines.length - currentContent.length,
        endLine: lines.length - 1,
        wordCount: currentContent.join(' ').split(/\s+/).length
      });
    }

    return sections;
  }

  /**
   * Identify section type based on content
   */
  identifySection(text) {
    const lowerText = text.toLowerCase();
    
    // Check for explicit section headers
    for (const [sectionType, patterns] of Object.entries(SECTION_PATTERNS)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          return sectionType;
        }
      }
    }

    return null;
  }

  /**
   * Extract clean section title
   */
  extractSectionTitle(text) {
    return text
      .replace(/^\d+\.?\s*/, '') // Remove numbering
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract named entities from text
   */
  extractEntities(text) {
    const entities = {};

    for (const [entityType, pattern] of Object.entries(ENTITY_PATTERNS)) {
      const matches = text.match(pattern);
      if (matches) {
        entities[entityType] = [...new Set(matches)]; // Remove duplicates
      }
    }

    return entities;
  }

  /**
   * Classify document type
   */
  classifyDocument(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('privacy policy') || lowerText.includes('privacy notice')) {
      return 'privacy_policy';
    } else if (lowerText.includes('terms of service') || lowerText.includes('terms of use')) {
      return 'terms_of_service';
    } else if (lowerText.includes('cookie policy') || lowerText.includes('cookie notice')) {
      return 'cookie_policy';
    } else if (lowerText.includes('data processing agreement') || lowerText.includes('dpa')) {
      return 'data_processing_agreement';
    } else if (lowerText.includes('security policy')) {
      return 'security_policy';
    }
    
    return 'general_policy';
  }

  /**
   * Analyze compliance against frameworks
   */
  analyzeCompliance(text, sections) {
    const lowerText = text.toLowerCase();
    const analysis = {
      frameworks: {},
      overallScore: 0,
      gaps: [],
      strengths: []
    };

    // Analyze each compliance framework
    for (const [framework, config] of Object.entries(COMPLIANCE_PATTERNS)) {
      const frameworkAnalysis = this.analyzeFramework(lowerText, sections, framework, config);
      analysis.frameworks[framework] = frameworkAnalysis;
    }

    // Calculate overall score
    const frameworkScores = Object.values(analysis.frameworks).map(f => f.score);
    analysis.overallScore = frameworkScores.length > 0 
      ? Math.round(frameworkScores.reduce((a, b) => a + b, 0) / frameworkScores.length)
      : 0;

    // Collect gaps and strengths
    for (const framework of Object.values(analysis.frameworks)) {
      analysis.gaps.push(...framework.gaps);
      analysis.strengths.push(...framework.strengths);
    }

    return analysis;
  }

  /**
   * Analyze specific compliance framework
   */
  analyzeFramework(text, sections, frameworkName, config) {
    const analysis = {
      framework: frameworkName,
      score: 0,
      coverage: 0,
      gaps: [],
      strengths: [],
      requirements: {
        found: [],
        missing: []
      }
    };

    // Check if framework is mentioned
    const frameworkMentioned = config.patterns.some(pattern => text.includes(pattern));
    
    if (frameworkMentioned) {
      analysis.strengths.push(`${frameworkName} framework explicitly mentioned`);
    }

    // Check requirement coverage
    for (const requirement of config.requirements) {
      const found = this.checkRequirement(text, sections, requirement);
      
      if (found) {
        analysis.requirements.found.push(requirement);
        analysis.strengths.push(`${requirement} addressed`);
      } else {
        analysis.requirements.missing.push(requirement);
        analysis.gaps.push({
          framework: frameworkName,
          requirement,
          severity: this.getGapSeverity(requirement),
          suggestion: this.getRequirementSuggestion(requirement)
        });
      }
    }

    // Calculate scores
    analysis.coverage = (analysis.requirements.found.length / config.requirements.length) * 100;
    analysis.score = Math.round(analysis.coverage * (frameworkMentioned ? 1.1 : 1.0)); // Bonus for explicit mention

    return analysis;
  }

  /**
   * Check if requirement is addressed in document
   */
  checkRequirement(text, sections, requirement) {
    const keywords = this.getRequirementKeywords(requirement);
    
    return keywords.some(keyword => 
      text.includes(keyword.toLowerCase()) ||
      sections.some(section => 
        section.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  /**
   * Get keywords for requirement checking
   */
  getRequirementKeywords(requirement) {
    const keywordMap = {
      'lawful basis for processing': ['lawful basis', 'legal basis', 'legitimate interest', 'consent'],
      'data subject rights': ['access', 'rectification', 'erasure', 'portability', 'object', 'rights'],
      'consent mechanisms': ['consent', 'opt-in', 'agree', 'permission', 'authorization'],
      'data protection officer': ['data protection officer', 'dpo', 'privacy officer'],
      'privacy by design': ['privacy by design', 'data protection by design', 'privacy by default'],
      'data breach notification': ['breach notification', 'security incident', 'data breach'],
      'right to be forgotten': ['right to erasure', 'right to be forgotten', 'delete'],
      'data portability': ['data portability', 'export data', 'transfer data'],
      'right to know': ['right to know', 'disclosure', 'what information'],
      'right to delete': ['right to delete', 'deletion request', 'remove data'],
      'right to opt-out': ['opt-out', 'do not sell', 'opt out of sale'],
      'non-discrimination': ['non-discrimination', 'equal treatment', 'no penalty'],
      'minimum necessary standard': ['minimum necessary', 'least privilege', 'need to know'],
      'administrative safeguards': ['administrative safeguards', 'policies', 'procedures'],
      'physical safeguards': ['physical safeguards', 'facility access', 'workstation security'],
      'technical safeguards': ['technical safeguards', 'encryption', 'access controls'],
      'financial disclosure': ['financial disclosure', 'transparency', 'reporting'],
      'internal controls': ['internal controls', 'control framework', 'compliance controls']
    };

    return keywordMap[requirement] || [requirement];
  }

  /**
   * Get gap severity level
   */
  getGapSeverity(requirement) {
    const criticalRequirements = [
      'consent mechanisms',
      'data subject rights',
      'security measures',
      'breach notification'
    ];

    const highRequirements = [
      'lawful basis for processing',
      'data retention',
      'third party sharing'
    ];

    if (criticalRequirements.some(r => requirement.includes(r))) {
      return 'critical';
    } else if (highRequirements.some(r => requirement.includes(r))) {
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Get suggestion for missing requirement
   */
  getRequirementSuggestion(requirement) {
    const suggestions = {
      'lawful basis for processing': 'Add a section explaining the legal basis for processing personal data',
      'data subject rights': 'Include a comprehensive section on user rights and how to exercise them',
      'consent mechanisms': 'Implement clear consent mechanisms with opt-in/opt-out options',
      'data protection officer': 'Designate and provide contact information for a Data Protection Officer',
      'data breach notification': 'Add procedures for data breach notification and response',
      'right to be forgotten': 'Include information about data deletion and the right to be forgotten',
      'security measures': 'Detail the technical and organizational security measures in place'
    };

    return suggestions[requirement] || `Address the requirement for ${requirement}`;
  }

  /**
   * Calculate overall compliance score
   */
  calculateComplianceScore(analysis) {
    const weights = {
      sectionCoverage: 0.3,
      frameworkCompliance: 0.4,
      entityPresence: 0.1,
      structureQuality: 0.2
    };

    let score = 0;

    // Section coverage score
    const expectedSections = Object.keys(SECTION_TYPES).length;
    const actualSections = this.sections.length;
    const sectionScore = Math.min((actualSections / expectedSections) * 100, 100);
    score += sectionScore * weights.sectionCoverage;

    // Framework compliance score
    score += analysis.overallScore * weights.frameworkCompliance;

    // Entity presence score (bonus for having contact info, etc.)
    const entityScore = Object.keys(this.entities).length * 20;
    score += Math.min(entityScore, 100) * weights.entityPresence;

    // Structure quality score
    const structureScore = this.calculateStructureScore();
    score += structureScore * weights.structureQuality;

    return Math.round(Math.min(score, 100));
  }

  /**
   * Calculate document structure quality score
   */
  calculateStructureScore() {
    let score = 0;

    // Check for logical section ordering
    const sectionOrder = this.sections.map(s => s.type);
    if (sectionOrder[0] === SECTION_TYPES.INTRODUCTION) score += 25;
    if (sectionOrder.includes(SECTION_TYPES.CONTACT)) score += 25;
    if (sectionOrder.includes(SECTION_TYPES.UPDATES)) score += 25;

    // Check for balanced section lengths
    const avgWordCount = this.sections.reduce((sum, s) => sum + s.wordCount, 0) / this.sections.length;
    const balanceScore = this.sections.filter(s => 
      s.wordCount >= avgWordCount * 0.5 && s.wordCount <= avgWordCount * 2
    ).length / this.sections.length * 25;
    
    score += balanceScore;

    return Math.min(score, 100);
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // Framework-specific recommendations
    for (const [framework, frameworkAnalysis] of Object.entries(analysis.frameworks)) {
      if (frameworkAnalysis.score < 80) {
        recommendations.push({
          type: 'compliance',
          priority: 'high',
          framework,
          title: `Improve ${framework} Compliance`,
          description: `Your ${framework} compliance score is ${frameworkAnalysis.score}%. Consider addressing the missing requirements.`,
          actions: frameworkAnalysis.requirements.missing.slice(0, 3).map(req => 
            `Add section covering ${req}`
          )
        });
      }
    }

    // Section coverage recommendations
    const missingSections = Object.values(SECTION_TYPES).filter(type =>
      !this.sections.some(section => section.type === type)
    );

    if (missingSections.length > 0) {
      recommendations.push({
        type: 'structure',
        priority: 'medium',
        title: 'Add Missing Sections',
        description: `Consider adding ${missingSections.length} missing sections to improve coverage.`,
        actions: missingSections.slice(0, 5).map(section => 
          `Add ${section.replace('_', ' ')} section`
        )
      });
    }

    // Contact information recommendations
    if (!this.entities.EMAIL && !this.entities.PHONE) {
      recommendations.push({
        type: 'contact',
        priority: 'high',
        title: 'Add Contact Information',
        description: 'Include clear contact information for privacy inquiries and data subject requests.',
        actions: [
          'Add email address for privacy inquiries',
          'Include physical address if required',
          'Provide phone number for urgent matters'
        ]
      });
    }

    return recommendations.slice(0, 10); // Limit to top 10 recommendations
  }
}

// Export singleton instance
export const nlpProcessor = new NLPProcessor();
