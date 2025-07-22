// Advanced Compliance Analysis System
// Implements structured approach for policy document analysis

class PolicyDocumentAnalyzer {
  constructor() {
    this.coreSections = {
      dataCollection: {
        keywords: [
          'data collect', 'information gather', 'personal information', 'device information',
          'cookies', 'tracking', 'analytics', 'third party', 'partners', 'sharing'
        ],
        redFlags: [
          'device-specific information',
          'cookies or similar technologies',
          'shared with third parties',
          'trusted partners',
          'advertising partners'
        ],
        weight: 4
      },
      userRights: {
        keywords: [
          'user rights', 'data rights', 'access', 'deletion', 'opt-out', 'control',
          'review', 'update', 'disable', 'block', 'consent', 'withdraw'
        ],
        redFlags: [
          'services may not work',
          'limited functionality',
          'conditional access',
          'reasonable necessity'
        ],
        weight: 5
      },
      compliance: {
        keywords: [
          'GDPR', 'CCPA', 'HIPAA', 'compliance', 'regulation', 'law', 'article',
          'data transfer', 'cross-border', 'jurisdiction', 'legal basis'
        ],
        redFlags: [
          'processed outside your country',
          'legal requirements',
          'legitimate business purposes',
          'comply with applicable law'
        ],
        weight: 5
      },
      security: {
        keywords: [
          'security', 'encryption', 'protection', 'SSL', 'TLS', 'authentication',
          'breach', 'incident', 'safeguards', 'measures', 'access control'
        ],
        redFlags: [
          'reasonable security',
          'industry standard',
          'best efforts',
          'appropriate measures'
        ],
        weight: 4
      },
      retention: {
        keywords: [
          'retention', 'storage', 'delete', 'removal', 'archive', 'backup',
          'duration', 'period', 'timeline', 'expiration'
        ],
        redFlags: [
          'as long as necessary',
          'for business purposes',
          'indefinitely',
          'until you request deletion'
        ],
        weight: 5
      }
    };

    this.complianceFrameworks = {
      GDPR: {
        articles: {
          'Article 5': 'Data minimization and retention',
          'Article 6': 'Legal basis for processing',
          'Article 7': 'Consent requirements',
          'Article 13': 'Information provision',
          'Article 17': 'Right to erasure',
          'Article 20': 'Right to data portability',
          'Article 25': 'Data protection by design',
          'Article 33': 'Breach notification',
          'Article 35': 'Data protection impact assessment'
        },
        requirements: [
          'explicit consent mechanisms',
          'data retention periods',
          'breach notification procedures',
          'user rights implementation',
          'data transfer safeguards'
        ]
      },
      CCPA: {
        sections: {
          '1798.100': 'Right to know',
          '1798.105': 'Right to delete',
          '1798.110': 'Right to know categories',
          '1798.115': 'Right to know specific information',
          '1798.120': 'Right to opt-out',
          '1798.140': 'Definitions'
        },
        requirements: [
          'consumer rights disclosure',
          'opt-out mechanisms',
          'third-party sharing disclosure',
          'data categories specification',
          'business purpose limitations'
        ]
      },
      HIPAA: {
        safeguards: {
          'Administrative': 'Policies and procedures',
          'Physical': 'Facility and equipment controls',
          'Technical': 'Access control and encryption'
        },
        requirements: [
          'minimum necessary standard',
          'access controls',
          'audit controls',
          'integrity controls',
          'transmission security'
        ]
      }
    };

    this.severityLevels = {
      CRITICAL: { score: 0, description: 'Legal violation, immediate action required' },
      HIGH: { score: 25, description: 'Significant compliance gap, address within 30 days' },
      MEDIUM: { score: 50, description: 'Moderate risk, improvement recommended' },
      LOW: { score: 75, description: 'Best practice enhancement' }
    };
  }

  // Core section analysis
  analyzeSections(text) {
    const results = {};
    const normalizedText = text.toLowerCase();

    Object.entries(this.coreSections).forEach(([sectionName, config]) => {
      const sectionAnalysis = {
        found: false,
        keywords: [],
        redFlags: [],
        content: [],
        score: 0,
        gaps: []
      };

      // Find keywords
      config.keywords.forEach(keyword => {
        if (normalizedText.includes(keyword.toLowerCase())) {
          sectionAnalysis.keywords.push(keyword);
          sectionAnalysis.found = true;
        }
      });

      // Detect red flags
      config.redFlags.forEach(redFlag => {
        if (normalizedText.includes(redFlag.toLowerCase())) {
          sectionAnalysis.redFlags.push(redFlag);
        }
      });

      // Extract relevant content paragraphs
      const sentences = text.split(/[.!?]+/);
      sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        if (config.keywords.some(keyword => lowerSentence.includes(keyword.toLowerCase()))) {
          sectionAnalysis.content.push(sentence.trim());
        }
      });

      // Calculate section score
      sectionAnalysis.score = this.calculateSectionScore(sectionAnalysis, config);
      
      // Identify gaps
      sectionAnalysis.gaps = this.identifySectionGaps(sectionAnalysis, sectionName);

      results[sectionName] = sectionAnalysis;
    });

    return results;
  }

  // Red flag detection system
  detectRedFlags(text) {
    const redFlags = [];
    const normalizedText = text.toLowerCase();

    const criticalRedFlags = {
      'Missing Data Retention Periods': [
        'as long as necessary',
        'for business purposes',
        'until no longer needed',
        'indefinitely'
      ],
      'Broad Third-Party Sharing': [
        'trusted partners',
        'service providers',
        'business partners',
        'third parties'
      ],
      'Conditional User Controls': [
        'services may not work',
        'limited functionality',
        'certain features unavailable',
        'restricted access'
      ],
      'Vague Legal Basis': [
        'legitimate business purposes',
        'reasonable necessity',
        'appropriate circumstances',
        'where permitted by law'
      ],
      'Insufficient Security Details': [
        'industry standard security',
        'appropriate security measures',
        'reasonable security',
        'best efforts'
      ]
    };

    Object.entries(criticalRedFlags).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        if (normalizedText.includes(pattern)) {
          redFlags.push({
            category,
            pattern,
            severity: this.getRedFlagSeverity(category),
            article: this.getRelatedArticle(category),
            recommendation: this.getRedFlagRecommendation(category)
          });
        }
      });
    });

    return redFlags;
  }

  // Enhanced compliance scoring
  calculateComplianceScore(sectionAnalysis, redFlags, text) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const frameworkScores = {};

    // Calculate section-based scores
    Object.entries(sectionAnalysis).forEach(([section, analysis]) => {
      const sectionWeight = this.coreSections[section].weight;
      totalScore += analysis.score * sectionWeight;
      maxPossibleScore += 100 * sectionWeight;
    });

    // Apply red flag penalties
    redFlags.forEach(redFlag => {
      const penalty = this.getRedFlagPenalty(redFlag.severity);
      totalScore -= penalty;
    });

    // Calculate framework-specific scores
    Object.keys(this.complianceFrameworks).forEach(framework => {
      frameworkScores[framework] = this.calculateFrameworkScore(text, framework);
    });

    const overallScore = Math.max(0, Math.min(100, (totalScore / maxPossibleScore) * 100));

    return {
      overallScore: Math.round(overallScore),
      sectionScores: sectionAnalysis,
      frameworkScores,
      redFlagPenalties: redFlags.length,
      recommendations: this.generateRecommendations(sectionAnalysis, redFlags)
    };
  }

  // Framework-specific analysis
  calculateFrameworkScore(text, framework) {
    const config = this.complianceFrameworks[framework];
    const normalizedText = text.toLowerCase();
    let foundRequirements = 0;
    const missingElements = [];

    if (framework === 'GDPR') {
      config.requirements.forEach(requirement => {
        if (this.checkGDPRRequirement(normalizedText, requirement)) {
          foundRequirements++;
        } else {
          missingElements.push(requirement);
        }
      });
    } else if (framework === 'CCPA') {
      config.requirements.forEach(requirement => {
        if (this.checkCCPARequirement(normalizedText, requirement)) {
          foundRequirements++;
        } else {
          missingElements.push(requirement);
        }
      });
    } else if (framework === 'HIPAA') {
      config.requirements.forEach(requirement => {
        if (this.checkHIPAARequirement(normalizedText, requirement)) {
          foundRequirements++;
        } else {
          missingElements.push(requirement);
        }
      });
    }

    const score = (foundRequirements / config.requirements.length) * 100;
    
    return {
      score: Math.round(score),
      foundRequirements,
      totalRequirements: config.requirements.length,
      missingElements,
      maturityLevel: this.getMaturityLevel(score)
    };
  }

  // Generate detailed recommendations
  generateRecommendations(sectionAnalysis, redFlags) {
    const recommendations = [];

    // Section-based recommendations
    Object.entries(sectionAnalysis).forEach(([section, analysis]) => {
      if (analysis.score < 70) {
        recommendations.push({
          type: 'section',
          section,
          priority: analysis.score < 30 ? 'HIGH' : 'MEDIUM',
          issue: `${section} section needs improvement`,
          recommendation: this.getSectionRecommendation(section, analysis),
          impact: 'Compliance gap identified'
        });
      }
    });

    // Red flag recommendations
    redFlags.forEach(redFlag => {
      recommendations.push({
        type: 'redFlag',
        section: redFlag.category,
        priority: redFlag.severity,
        issue: redFlag.category,
        recommendation: redFlag.recommendation,
        impact: 'Potential regulatory violation'
      });
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Helper methods
  calculateSectionScore(analysis, config) {
    let score = 0;
    
    if (analysis.found) {
      score += 40; // Base score for section presence
      score += Math.min(30, analysis.keywords.length * 5); // Keyword coverage
      score -= analysis.redFlags.length * 15; // Red flag penalties
      score += Math.min(30, analysis.content.length * 2); // Content richness
    }

    return Math.max(0, Math.min(100, score));
  }

  identifySectionGaps(analysis, sectionName) {
    const gaps = [];
    
    if (!analysis.found) {
      gaps.push(`${sectionName} section missing or inadequately addressed`);
    }
    
    if (analysis.redFlags.length > 0) {
      gaps.push(`Contains ${analysis.redFlags.length} compliance red flags`);
    }
    
    if (analysis.keywords.length < 3) {
      gaps.push(`Insufficient detail in ${sectionName} section`);
    }

    return gaps;
  }

  getRedFlagSeverity(category) {
    const severityMap = {
      'Missing Data Retention Periods': 'CRITICAL',
      'Broad Third-Party Sharing': 'HIGH',
      'Conditional User Controls': 'HIGH',
      'Vague Legal Basis': 'MEDIUM',
      'Insufficient Security Details': 'MEDIUM'
    };
    return severityMap[category] || 'LOW';
  }

  getRelatedArticle(category) {
    const articleMap = {
      'Missing Data Retention Periods': 'GDPR Article 5(1)(e)',
      'Broad Third-Party Sharing': 'CCPA §1798.140(t)',
      'Conditional User Controls': 'GDPR Article 7',
      'Vague Legal Basis': 'GDPR Article 6',
      'Insufficient Security Details': 'GDPR Article 32'
    };
    return articleMap[category] || 'General Compliance';
  }

  getRedFlagRecommendation(category) {
    const recommendationMap = {
      'Missing Data Retention Periods': 'Add specific retention timelines (e.g., "Personal data is deleted within 30 days of account termination")',
      'Broad Third-Party Sharing': 'Provide exhaustive list of third parties and specific sharing purposes',
      'Conditional User Controls': 'Implement granular consent options without functional restrictions',
      'Vague Legal Basis': 'Specify exact legal basis for each data processing activity',
      'Insufficient Security Details': 'Detail specific security measures, encryption standards, and breach protocols'
    };
    return recommendationMap[category] || 'Review and clarify language to meet regulatory requirements';
  }

  getRedFlagPenalty(severity) {
    const penaltyMap = {
      'CRITICAL': 25,
      'HIGH': 15,
      'MEDIUM': 10,
      'LOW': 5
    };
    return penaltyMap[severity] || 5;
  }

  getSectionRecommendation(section, analysis) {
    const recommendationMap = {
      dataCollection: 'Add detailed data collection practices, specify data types, and list all third-party sharing arrangements',
      userRights: 'Implement comprehensive user rights section with clear opt-out mechanisms and data access procedures',
      compliance: 'Reference specific regulatory frameworks (GDPR, CCPA, HIPAA) and compliance measures',
      security: 'Detail security measures including encryption standards, access controls, and breach notification procedures',
      retention: 'Specify exact data retention periods for different data categories'
    };
    return recommendationMap[section] || 'Review section for compliance gaps and improve clarity';
  }

  checkGDPRRequirement(text, requirement) {
    const requirementPatterns = {
      'explicit consent mechanisms': ['explicit consent', 'opt-in', 'consent mechanism', 'withdraw consent'],
      'data retention periods': ['retention period', 'delete data', 'data retention', 'storage duration'],
      'breach notification procedures': ['breach notification', 'data breach', 'incident response', 'notify authorities'],
      'user rights implementation': ['right to access', 'right to rectification', 'right to erasure', 'data portability'],
      'data transfer safeguards': ['adequate protection', 'standard contractual clauses', 'transfer safeguards']
    };

    const patterns = requirementPatterns[requirement] || [];
    return patterns.some(pattern => text.includes(pattern));
  }

  checkCCPARequirement(text, requirement) {
    const requirementPatterns = {
      'consumer rights disclosure': ['consumer rights', 'right to know', 'right to delete', 'right to opt-out'],
      'opt-out mechanisms': ['opt-out', 'do not sell', 'opt out of sale', 'stop selling'],
      'third-party sharing disclosure': ['third party', 'business partners', 'sharing information', 'disclosed to'],
      'data categories specification': ['categories of information', 'types of data', 'personal information categories'],
      'business purpose limitations': ['business purpose', 'commercial purpose', 'legitimate business need']
    };

    const patterns = requirementPatterns[requirement] || [];
    return patterns.some(pattern => text.includes(pattern));
  }

  checkHIPAARequirement(text, requirement) {
    const requirementPatterns = {
      'minimum necessary standard': ['minimum necessary', 'need to know', 'limited access'],
      'access controls': ['access control', 'user authentication', 'authorized access'],
      'audit controls': ['audit log', 'access monitoring', 'audit trail'],
      'integrity controls': ['data integrity', 'data modification', 'unauthorized changes'],
      'transmission security': ['transmission security', 'encrypt transmission', 'secure transmission']
    };

    const patterns = requirementPatterns[requirement] || [];
    return patterns.some(pattern => text.includes(pattern));
  }

  getMaturityLevel(score) {
    if (score >= 90) return 'Advanced';
    if (score >= 70) return 'Intermediate';
    if (score >= 50) return 'Basic';
    return 'Inadequate';
  }

  // Main analysis method
  analyzePolicy(text) {
    console.log('Starting comprehensive policy analysis...');
    
    // Perform section analysis
    const sectionAnalysis = this.analyzeSections(text);
    
    // Detect red flags
    const redFlags = this.detectRedFlags(text);
    
    // Calculate compliance scores
    const scoringResults = this.calculateComplianceScore(sectionAnalysis, redFlags, text);
    
    // Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      overallScore: scoringResults.overallScore,
      sectionAnalysis,
      redFlags,
      frameworkScores: scoringResults.frameworkScores,
      recommendations: scoringResults.recommendations,
      summary: this.generateExecutiveSummary(scoringResults, redFlags),
      gaps: this.generateGapsList(sectionAnalysis, redFlags),
      prioritizedActions: this.generatePrioritizedActions(scoringResults.recommendations)
    };

    console.log('Policy analysis completed:', {
      score: report.overallScore,
      redFlags: redFlags.length,
      recommendations: report.recommendations.length
    });

    return report;
  }

  generateExecutiveSummary(scoringResults, redFlags) {
    const criticalGaps = redFlags.filter(flag => flag.severity === 'CRITICAL').length;
    const highGaps = redFlags.filter(flag => flag.severity === 'HIGH').length;
    
    return `Compliance analysis completed with overall score of ${scoringResults.overallScore}%. 
    Identified ${redFlags.length} compliance gaps including ${criticalGaps} critical and ${highGaps} high-priority issues. 
    ${criticalGaps > 0 ? 'Immediate action required for critical violations.' : 'No critical violations detected.'} 
    Framework analysis shows ${Object.keys(scoringResults.frameworkScores).map(f => 
      `${f}: ${scoringResults.frameworkScores[f].score}%`
    ).join(', ')}.`;
  }

  generateGapsList(sectionAnalysis, redFlags) {
    const gaps = [];
    
    // Add section gaps
    Object.entries(sectionAnalysis).forEach(([section, analysis]) => {
      analysis.gaps.forEach(gap => {
        gaps.push({
          issue: gap,
          severity: analysis.score < 30 ? 'high' : analysis.score < 70 ? 'medium' : 'low',
          framework: 'General',
          remediation: this.getSectionRecommendation(section, analysis)
        });
      });
    });
    
    // Add red flag gaps
    redFlags.forEach(redFlag => {
      gaps.push({
        issue: redFlag.category,
        severity: redFlag.severity.toLowerCase(),
        framework: redFlag.article.includes('GDPR') ? 'GDPR' : 
                  redFlag.article.includes('CCPA') ? 'CCPA' : 'General',
        remediation: redFlag.recommendation
      });
    });
    
    return gaps;
  }

  generatePrioritizedActions(recommendations) {
    return recommendations.map((rec, index) => ({
      priority: index + 1,
      title: rec.issue,
      framework: rec.section,
      criticality: rec.priority.toLowerCase(),
      recommendations: [rec.recommendation],
      businessImpact: rec.impact,
      timeframe: rec.priority === 'CRITICAL' ? '0-7 days' : 
                rec.priority === 'HIGH' ? '7-30 days' : 
                rec.priority === 'MEDIUM' ? '30-90 days' : '90-180 days',
      estimatedEffort: rec.priority === 'CRITICAL' ? 'High' : 
                      rec.priority === 'HIGH' ? 'Medium-High' : 'Medium'
    }));
  }
}

export default PolicyDocumentAnalyzer;
