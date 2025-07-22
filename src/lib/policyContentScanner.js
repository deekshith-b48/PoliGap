// Content-Focused Policy Document Scanner
// Extracts critical compliance content without complex NLP

class PolicyContentScanner {
  constructor() {
    this.policyTypes = {
      privacy: {
        name: 'Privacy Policy',
        keywords: ['privacy policy', 'data protection', 'personal information', 'data collection'],
        sections: {
          introduction: {
            keywords: ['purpose', 'scope', 'introduction', 'overview'],
            required: ['purpose of policy', 'data controller information']
          },
          dataCollection: {
            keywords: ['information collected', 'data collection', 'personal data', 'what we collect'],
            required: ['types of data collected', 'collection methods', 'cookies and tracking']
          },
          dataUsage: {
            keywords: ['how data is used', 'purpose of processing', 'data processing'],
            required: ['processing purposes', 'legal basis', 'automated decision making']
          },
          dataSharing: {
            keywords: ['data sharing', 'third parties', 'disclosure', 'recipients'],
            required: ['third party sharing', 'international transfers', 'service providers']
          },
          userRights: {
            keywords: ['user rights', 'your rights', 'data subject rights', 'privacy rights'],
            required: ['access rights', 'deletion rights', 'correction rights', 'opt-out']
          },
          security: {
            keywords: ['data security', 'security measures', 'protection', 'safeguards'],
            required: ['encryption', 'access controls', 'incident response']
          },
          retention: {
            keywords: ['data retention', 'storage period', 'how long', 'retention period'],
            required: ['retention periods', 'deletion timelines', 'archival policies']
          },
          updates: {
            keywords: ['policy updates', 'changes', 'modifications', 'amendments'],
            required: ['notification process', 'effective date', 'version control']
          },
          contact: {
            keywords: ['contact', 'privacy officer', 'data protection officer', 'questions'],
            required: ['contact information', 'complaint process', 'regulatory authority']
          }
        }
      },
      humanRights: {
        name: 'Human Rights Policy',
        keywords: ['human rights', 'ethical practices', 'labor standards', 'worker rights'],
        sections: {
          commitment: {
            keywords: ['commitment', 'statement', 'principles', 'values'],
            required: ['human rights commitment', 'scope of application']
          },
          nonDiscrimination: {
            keywords: ['non-discrimination', 'inclusion', 'diversity', 'equal opportunity'],
            required: ['anti-discrimination measures', 'inclusion practices']
          },
          laborPractices: {
            keywords: ['labor practices', 'working conditions', 'employment', 'wages'],
            required: ['fair wages', 'working hours', 'child labor prohibition', 'forced labor']
          },
          workplaceSafety: {
            keywords: ['workplace safety', 'safe working conditions', 'health and safety'],
            required: ['safety measures', 'health protocols', 'incident reporting']
          },
          freedom: {
            keywords: ['freedom of association', 'collective bargaining', 'unionization'],
            required: ['association rights', 'collective bargaining rights']
          },
          sourcing: {
            keywords: ['ethical sourcing', 'supply chain', 'conflict minerals', 'responsible sourcing'],
            required: ['supplier standards', 'due diligence', 'conflict minerals']
          },
          whistleblower: {
            keywords: ['whistleblower', 'reporting', 'grievance', 'complaints'],
            required: ['reporting mechanisms', 'protection measures', 'investigation process']
          }
        }
      },
      termsOfService: {
        name: 'Terms of Service',
        keywords: ['terms of service', 'terms and conditions', 'user agreement', 'service agreement'],
        sections: {
          acceptance: {
            keywords: ['acceptance', 'agreement', 'binding', 'consent'],
            required: ['acceptance mechanism', 'binding nature', 'capacity requirements']
          },
          userResponsibilities: {
            keywords: ['user responsibilities', 'prohibited activities', 'restrictions', 'obligations'],
            required: ['prohibited uses', 'user conduct', 'compliance obligations']
          },
          intellectualProperty: {
            keywords: ['intellectual property', 'copyright', 'trademark', 'proprietary rights'],
            required: ['ownership rights', 'usage permissions', 'infringement policy']
          },
          liability: {
            keywords: ['limitation of liability', 'disclaimers', 'warranties', 'damages'],
            required: ['liability limitations', 'warranty disclaimers', 'indemnification']
          },
          termination: {
            keywords: ['termination', 'suspension', 'account closure', 'breach'],
            required: ['termination conditions', 'effect of termination', 'data handling']
          },
          disputes: {
            keywords: ['dispute resolution', 'governing law', 'arbitration', 'jurisdiction'],
            required: ['governing law', 'dispute process', 'jurisdiction']
          }
        }
      },
      acceptableUse: {
        name: 'Acceptable Use Policy',
        keywords: ['acceptable use', 'usage policy', 'prohibited activities', 'user conduct'],
        sections: {
          prohibitedActivities: {
            keywords: ['prohibited', 'forbidden', 'not allowed', 'restrictions'],
            required: ['illegal activities', 'harmful content', 'system abuse']
          },
          contentRestrictions: {
            keywords: ['content restrictions', 'content guidelines', 'prohibited content'],
            required: ['content standards', 'intellectual property', 'harmful content']
          },
          consequences: {
            keywords: ['consequences', 'violations', 'enforcement', 'penalties'],
            required: ['violation consequences', 'enforcement procedures', 'appeal process']
          }
        }
      },
      cookiePolicy: {
        name: 'Cookie Policy',
        keywords: ['cookie policy', 'tracking technologies', 'cookies', 'web beacons'],
        sections: {
          cookieTypes: {
            keywords: ['types of cookies', 'cookie categories', 'session cookies', 'persistent cookies'],
            required: ['cookie classifications', 'third-party cookies', 'cookie duration']
          },
          purpose: {
            keywords: ['purpose of cookies', 'why we use cookies', 'cookie functions'],
            required: ['functionality cookies', 'analytics cookies', 'advertising cookies']
          },
          consent: {
            keywords: ['cookie consent', 'opt-out', 'cookie settings', 'preferences'],
            required: ['consent mechanism', 'opt-out options', 'preference management']
          }
        }
      },
      dataProcessing: {
        name: 'Data Processing Agreement',
        keywords: ['data processing agreement', 'DPA', 'controller', 'processor'],
        sections: {
          roles: {
            keywords: ['data controller', 'data processor', 'roles', 'responsibilities'],
            required: ['controller obligations', 'processor obligations', 'role definitions']
          },
          processingDetails: {
            keywords: ['processing details', 'data categories', 'processing purposes'],
            required: ['data categories', 'processing purposes', 'data subjects']
          },
          security: {
            keywords: ['security measures', 'technical safeguards', 'organizational measures'],
            required: ['technical measures', 'organizational measures', 'incident response']
          },
          subprocessors: {
            keywords: ['subprocessors', 'third parties', 'sub-contractors'],
            required: ['subprocessor list', 'authorization process', 'liability']
          },
          breaches: {
            keywords: ['data breach', 'security incident', 'notification'],
            required: ['breach notification', 'timeline requirements', 'assistance obligations']
          }
        }
      },
      accessibility: {
        name: 'Accessibility Policy',
        keywords: ['accessibility', 'WCAG', 'disability', 'assistive technology'],
        sections: {
          commitment: {
            keywords: ['accessibility commitment', 'inclusive design', 'accessibility standards'],
            required: ['WCAG compliance', 'accessibility goals', 'implementation timeline']
          },
          features: {
            keywords: ['accessibility features', 'assistive technology', 'accommodations'],
            required: ['supported technologies', 'accessibility features', 'alternative formats']
          },
          feedback: {
            keywords: ['accessibility feedback', 'complaints', 'suggestions'],
            required: ['feedback mechanism', 'contact information', 'response timeline']
          }
        }
      },
      security: {
        name: 'Security Policy',
        keywords: ['security policy', 'information security', 'cybersecurity', 'data protection'],
        sections: {
          infrastructure: {
            keywords: ['infrastructure security', 'network security', 'system security'],
            required: ['security controls', 'access management', 'monitoring systems']
          },
          incident: {
            keywords: ['incident response', 'security incident', 'breach response'],
            required: ['incident procedures', 'response team', 'notification process']
          },
          training: {
            keywords: ['security training', 'employee training', 'awareness'],
            required: ['training programs', 'awareness initiatives', 'compliance requirements']
          },
          testing: {
            keywords: ['penetration testing', 'security testing', 'vulnerability assessment'],
            required: ['testing procedures', 'audit schedules', 'remediation process']
          }
        }
      },
      refund: {
        name: 'Refund & Cancellation Policy',
        keywords: ['refund policy', 'cancellation', 'return policy', 'money back'],
        sections: {
          eligibility: {
            keywords: ['refund eligibility', 'qualifying conditions', 'requirements'],
            required: ['eligibility criteria', 'time limits', 'conditions']
          },
          process: {
            keywords: ['refund process', 'how to request', 'procedure'],
            required: ['request procedure', 'required information', 'processing time']
          },
          cancellation: {
            keywords: ['cancellation terms', 'subscription cancellation', 'termination'],
            required: ['cancellation procedure', 'notice requirements', 'effective date']
          }
        }
      },
      environmental: {
        name: 'Environmental Policy',
        keywords: ['environmental policy', 'sustainability', 'carbon footprint', 'green practices'],
        sections: {
          carbonFootprint: {
            keywords: ['carbon footprint', 'emissions reduction', 'climate change'],
            required: ['emission goals', 'reduction strategies', 'measurement methods']
          },
          wasteManagement: {
            keywords: ['waste management', 'e-waste', 'recycling', 'disposal'],
            required: ['waste reduction', 'recycling programs', 'disposal methods']
          },
          greenPractices: {
            keywords: ['green practices', 'sustainable operations', 'renewable energy'],
            required: ['green hosting', 'energy efficiency', 'sustainable sourcing']
          }
        }
      }
    };

    this.complianceFrameworks = {
      GDPR: {
        articles: ['Article 5', 'Article 6', 'Article 7', 'Article 13', 'Article 17', 'Article 20', 'Article 25', 'Article 32', 'Article 33', 'Article 35'],
        keywords: ['GDPR', 'General Data Protection Regulation', 'data protection', 'EU regulation']
      },
      CCPA: {
        sections: ['1798.100', '1798.105', '1798.110', '1798.115', '1798.120', '1798.140'],
        keywords: ['CCPA', 'California Consumer Privacy Act', 'consumer rights', 'personal information']
      },
      HIPAA: {
        safeguards: ['Administrative', 'Physical', 'Technical'],
        keywords: ['HIPAA', 'Health Insurance Portability', 'protected health information', 'PHI']
      },
      SOX: {
        sections: ['Section 302', 'Section 404', 'Section 409', 'Section 802'],
        keywords: ['Sarbanes-Oxley', 'SOX', 'financial reporting', 'internal controls']
      },
      'PCI DSS': {
        requirements: ['Requirement 1', 'Requirement 2', 'Requirement 3', 'Requirement 4'],
        keywords: ['PCI DSS', 'Payment Card Industry', 'cardholder data', 'payment security']
      }
    };

    this.structuredPatterns = {
      headers: {
        markdown: /^#{1,6}\s+(.+)$/gm,
        html: /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi,
        structured: /^## (.+) ##$/gm
      },
      metadata: {
        yaml: /^@(\w+):\s*(.+)$/gm,
        json: /"(\w+)":\s*"([^"]+)"/g,
        structured: /@(\w+):\s*(.+)/g
      },
      sections: {
        id: /#([a-z-]+)/g,
        numbered: /^(\d+\.)\s+(.+)$/gm,
        lettered: /^([a-z]\.)\s+(.+)$/gm
      }
    };
  }

  // Main scanning method
  scanDocument(text, options = {}) {
    const results = {
      timestamp: new Date().toISOString(),
      documentType: this.detectDocumentType(text),
      detectedPolicies: [],
      structuredContent: this.extractStructuredContent(text),
      complianceReferences: this.findComplianceReferences(text),
      completenessScore: 0,
      missingElements: [],
      recommendations: []
    };

    // Detect and analyze each policy type
    Object.entries(this.policyTypes).forEach(([key, policy]) => {
      const detection = this.detectPolicyType(text, policy);
      if (detection.detected) {
        const analysis = this.analyzePolicyContent(text, policy);
        results.detectedPolicies.push({
          type: key,
          name: policy.name,
          confidence: detection.confidence,
          sections: analysis.sections,
          completeness: analysis.completeness,
          missingElements: analysis.missingElements
        });
      }
    });

    // Calculate overall scores
    results.completenessScore = this.calculateCompleteness(results.detectedPolicies);
    results.missingElements = this.identifyMissingElements(results.detectedPolicies);
    results.recommendations = this.generateRecommendations(results);

    return results;
  }

  // Detect document type (PDF, DOC, TXT, etc.)
  detectDocumentType(text) {
    // Check for common document markers
    if (text.includes('%PDF-')) return 'PDF';
    if (text.includes('<?xml') && text.includes('word/')) return 'DOCX';
    if (text.includes('Microsoft Office Word')) return 'DOC';
    if (text.match(/^#{1,6}\s+/m)) return 'Markdown';
    if (text.includes('<html') || text.includes('<!DOCTYPE')) return 'HTML';
    return 'Text';
  }

  // Detect specific policy types
  detectPolicyType(text, policy) {
    const normalizedText = text.toLowerCase();
    let score = 0;
    let matchedKeywords = [];

    policy.keywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += 1;
        matchedKeywords.push(keyword);
      }
    });

    const confidence = Math.min(100, (score / policy.keywords.length) * 100);
    
    return {
      detected: confidence > 25, // Threshold for detection
      confidence: Math.round(confidence),
      matchedKeywords
    };
  }

  // Analyze policy content for completeness
  analyzePolicyContent(text, policy) {
    const normalizedText = text.toLowerCase();
    const analysis = {
      sections: {},
      completeness: 0,
      missingElements: []
    };

    let totalSections = 0;
    let foundSections = 0;

    Object.entries(policy.sections).forEach(([sectionKey, section]) => {
      totalSections++;
      const sectionAnalysis = {
        found: false,
        confidence: 0,
        elements: [],
        missingElements: []
      };

      // Check for section keywords
      let sectionScore = 0;
      section.keywords.forEach(keyword => {
        if (normalizedText.includes(keyword.toLowerCase())) {
          sectionScore++;
          sectionAnalysis.elements.push(keyword);
        }
      });

      // Check for required elements
      section.required.forEach(element => {
        const elementFound = this.findElementInText(normalizedText, element);
        if (elementFound) {
          sectionAnalysis.elements.push(element);
        } else {
          sectionAnalysis.missingElements.push(element);
        }
      });

      sectionAnalysis.confidence = Math.round((sectionScore / section.keywords.length) * 100);
      sectionAnalysis.found = sectionAnalysis.confidence > 30;

      if (sectionAnalysis.found) {
        foundSections++;
      }

      analysis.sections[sectionKey] = sectionAnalysis;
    });

    analysis.completeness = Math.round((foundSections / totalSections) * 100);
    
    // Collect all missing elements
    Object.values(analysis.sections).forEach(section => {
      analysis.missingElements.push(...section.missingElements);
    });

    return analysis;
  }

  // Find specific elements in text
  findElementInText(text, element) {
    const elementVariations = this.generateElementVariations(element);
    return elementVariations.some(variation => 
      text.includes(variation.toLowerCase())
    );
  }

  // Generate variations of element names
  generateElementVariations(element) {
    const variations = [element];
    
    // Add common variations
    variations.push(element.replace(/\s+/g, ''));
    variations.push(element.replace(/\s+/g, '-'));
    variations.push(element.replace(/\s+/g, '_'));
    
    // Add plural/singular variations
    if (element.endsWith('s')) {
      variations.push(element.slice(0, -1));
    } else {
      variations.push(element + 's');
    }

    return variations;
  }

  // Extract structured content (headers, metadata, sections)
  extractStructuredContent(text) {
    const structured = {
      headers: [],
      metadata: {},
      sections: [],
      version: null,
      effectiveDate: null
    };

    // Extract headers
    Object.entries(this.structuredPatterns.headers).forEach(([type, pattern]) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        structured.headers.push({
          type,
          text: match[1],
          level: type === 'markdown' ? match[0].split('#').length - 1 : 1
        });
      });
    });

    // Extract metadata
    Object.entries(this.structuredPatterns.metadata).forEach(([type, pattern]) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        structured.metadata[match[1]] = match[2];
      });
    });

    // Extract version and effective date
    const versionMatch = text.match(/version[:\s]+([0-9.]+)/i);
    if (versionMatch) structured.version = versionMatch[1];

    const dateMatch = text.match(/effective[:\s]+date[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    if (dateMatch) structured.effectiveDate = dateMatch[1];

    return structured;
  }

  // Find compliance framework references
  findComplianceReferences(text) {
    const references = {};
    const normalizedText = text.toLowerCase();

    Object.entries(this.complianceFrameworks).forEach(([framework, config]) => {
      const frameworkRefs = {
        mentioned: false,
        articles: [],
        sections: [],
        keywords: []
      };

      // Check for framework keywords
      config.keywords.forEach(keyword => {
        if (normalizedText.includes(keyword.toLowerCase())) {
          frameworkRefs.mentioned = true;
          frameworkRefs.keywords.push(keyword);
        }
      });

      // Check for specific articles/sections
      if (config.articles) {
        config.articles.forEach(article => {
          if (normalizedText.includes(article.toLowerCase())) {
            frameworkRefs.articles.push(article);
          }
        });
      }

      if (config.sections) {
        config.sections.forEach(section => {
          if (normalizedText.includes(section.toLowerCase())) {
            frameworkRefs.sections.push(section);
          }
        });
      }

      if (frameworkRefs.mentioned || frameworkRefs.articles.length > 0 || frameworkRefs.sections.length > 0) {
        references[framework] = frameworkRefs;
      }
    });

    return references;
  }

  // Calculate overall completeness score
  calculateCompleteness(detectedPolicies) {
    if (detectedPolicies.length === 0) return 0;

    const totalCompleteness = detectedPolicies.reduce((sum, policy) => 
      sum + policy.completeness, 0
    );

    return Math.round(totalCompleteness / detectedPolicies.length);
  }

  // Identify missing elements across all policies
  identifyMissingElements(detectedPolicies) {
    const allMissing = [];
    
    detectedPolicies.forEach(policy => {
      policy.missingElements.forEach(element => {
        if (!allMissing.includes(element)) {
          allMissing.push(element);
        }
      });
    });

    return allMissing;
  }

  // Generate recommendations based on analysis
  generateRecommendations(results) {
    const recommendations = [];

    // Policy-specific recommendations
    results.detectedPolicies.forEach(policy => {
      if (policy.completeness < 70) {
        recommendations.push({
          type: 'policy_improvement',
          priority: policy.completeness < 40 ? 'high' : 'medium',
          policy: policy.name,
          message: `${policy.name} is ${policy.completeness}% complete. Consider adding missing elements.`,
          missingElements: policy.missingElements
        });
      }
    });

    // Compliance framework recommendations
    Object.entries(results.complianceReferences).forEach(([framework, refs]) => {
      if (refs.articles && refs.articles.length < 3) {
        recommendations.push({
          type: 'compliance_reference',
          priority: 'medium',
          framework,
          message: `Consider adding more specific ${framework} article references for better compliance documentation.`
        });
      }
    });

    // Structured content recommendations
    if (!results.structuredContent.version) {
      recommendations.push({
        type: 'metadata',
        priority: 'low',
        message: 'Add version information to improve document tracking and version control.'
      });
    }

    if (!results.structuredContent.effectiveDate) {
      recommendations.push({
        type: 'metadata',
        priority: 'medium',
        message: 'Add effective date to clarify when the policy takes effect.'
      });
    }

    return recommendations;
  }

  // Generate summary report
  generateSummaryReport(scanResults) {
    const report = {
      documentSummary: {
        type: scanResults.documentType,
        policiesDetected: scanResults.detectedPolicies.length,
        overallCompleteness: scanResults.completenessScore,
        complianceFrameworks: Object.keys(scanResults.complianceReferences).length
      },
      policyBreakdown: scanResults.detectedPolicies.map(policy => ({
        name: policy.name,
        completeness: policy.completeness,
        confidence: policy.confidence,
        sectionsFound: Object.keys(policy.sections).filter(key => 
          policy.sections[key].found
        ).length,
        totalSections: Object.keys(policy.sections).length
      })),
      complianceGaps: scanResults.missingElements.map(element => ({
        element,
        recommendation: `Add ${element} section or clause to improve compliance`
      })),
      recommendations: scanResults.recommendations.filter(rec => 
        rec.priority === 'high' || rec.priority === 'medium'
      ),
      nextSteps: this.generateNextSteps(scanResults)
    };

    return report;
  }

  // Generate next steps
  generateNextSteps(scanResults) {
    const steps = [];

    if (scanResults.completenessScore < 60) {
      steps.push('1. Address missing policy sections identified in the analysis');
    }

    if (Object.keys(scanResults.complianceReferences).length < 2) {
      steps.push('2. Add specific compliance framework references (GDPR, CCPA, etc.)');
    }

    if (!scanResults.structuredContent.version || !scanResults.structuredContent.effectiveDate) {
      steps.push('3. Add document metadata (version, effective date, last updated)');
    }

    steps.push('4. Review and update policy content based on recommendations');
    steps.push('5. Implement structured formatting for better machine readability');

    return steps;
  }
}

export default PolicyContentScanner;
