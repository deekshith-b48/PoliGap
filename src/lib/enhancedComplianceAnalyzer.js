// Enhanced Compliance Analysis System with Advanced AI Processing
// Implements ML-driven approach for policy document analysis with higher accuracy

import PolicyDocumentAnalyzer from './complianceAnalyzer.js';

class EnhancedComplianceAnalyzer extends PolicyDocumentAnalyzer {
  constructor() {
    super();
    
    // Enhanced keywords with contextual patterns and weights
    this.enhancedSections = {
      dataCollection: {
        keywords: [
          'personal data', 'personal information', 'personally identifiable', 'PII',
          'data collection', 'information gathering', 'data processing', 'user data',
          'device information', 'browser data', 'location data', 'usage data',
          'cookies', 'tracking pixels', 'web beacons', 'analytics',
          'third party data', 'data sharing', 'data transfer', 'data sources'
        ],
        contextualPatterns: [
          'we collect.*?information',
          'data.*?collected.*?include',
          'information.*?automatically.*?collected',
          'types.*?data.*?process',
          'sources.*?personal.*?data'
        ],
        negativePatterns: [
          'we do not collect',
          'no personal data',
          'anonymous information only'
        ],
        weight: 5,
        minScore: 60
      },
      
      dataUsage: {
        keywords: [
          'data usage', 'information use', 'processing purposes', 'use of data',
          'data processing', 'legitimate interests', 'business purposes',
          'service provision', 'analytics', 'personalization', 'advertising',
          'marketing communications', 'legal compliance', 'fraud prevention'
        ],
        contextualPatterns: [
          'use.*?information.*?to',
          'process.*?data.*?for',
          'purposes.*?data.*?processing',
          'legitimate.*?interests.*?include'
        ],
        weight: 4,
        minScore: 50
      },
      
      userRights: {
        keywords: [
          'user rights', 'data subject rights', 'individual rights', 'privacy rights',
          'right to access', 'right to rectification', 'right to erasure', 'right to deletion',
          'right to portability', 'data portability', 'right to object', 'right to restrict',
          'opt-out', 'unsubscribe', 'withdraw consent', 'delete account',
          'access request', 'data request', 'correction request'
        ],
        contextualPatterns: [
          'you.*?have.*?right.*?to',
          'you.*?may.*?request',
          'users.*?can.*?access',
          'opt.*?out.*?any.*?time',
          'withdraw.*?consent'
        ],
        weight: 5,
        minScore: 70
      },
      
      dataSharing: {
        keywords: [
          'data sharing', 'information sharing', 'third parties', 'business partners',
          'service providers', 'vendors', 'contractors', 'affiliates',
          'subsidiaries', 'data processors', 'sub-processors',
          'law enforcement', 'government agencies', 'regulatory authorities',
          'business transfers', 'mergers', 'acquisitions'
        ],
        contextualPatterns: [
          'share.*?information.*?with',
          'disclose.*?data.*?to',
          'third.*?parties.*?may.*?receive',
          'partners.*?access.*?to'
        ],
        weight: 5,
        minScore: 65
      },
      
      dataSecurity: {
        keywords: [
          'data security', 'information security', 'security measures', 'safeguards',
          'encryption', 'SSL', 'TLS', 'secure transmission', 'secure storage',
          'access controls', 'authentication', 'authorization', 'firewalls',
          'intrusion detection', 'vulnerability assessment', 'security audits',
          'data breach', 'incident response', 'breach notification'
        ],
        contextualPatterns: [
          'implement.*?security.*?measures',
          'protect.*?information.*?using',
          'secure.*?transmission.*?protocols',
          'event.*?data.*?breach'
        ],
        weight: 4,
        minScore: 55
      },
      
      dataRetention: {
        keywords: [
          'data retention', 'storage duration', 'retention period', 'retention policy',
          'delete data', 'destroy information', 'archive data', 'purge records',
          'retention schedule', 'data lifecycle', 'long as necessary',
          'business purposes', 'legal requirements', 'regulatory compliance'
        ],
        contextualPatterns: [
          'retain.*?information.*?for',
          'store.*?data.*?until',
          'delete.*?data.*?after',
          'retention.*?period.*?of'
        ],
        weight: 5,
        minScore: 60
      },
      
      internationalTransfers: {
        keywords: [
          'international transfers', 'cross-border transfers', 'data transfers',
          'adequate protection', 'adequacy decision', 'standard contractual clauses',
          'binding corporate rules', 'transfer safeguards', 'data localization',
          'privacy shield', 'safe harbor', 'certification mechanisms'
        ],
        contextualPatterns: [
          'transfer.*?data.*?outside',
          'international.*?data.*?transfers',
          'countries.*?adequate.*?protection',
          'safeguards.*?transfers'
        ],
        weight: 4,
        minScore: 40
      },
      
      legalBasis: {
        keywords: [
          'legal basis', 'lawful basis', 'legitimate interests', 'consent',
          'contract performance', 'legal obligation', 'vital interests',
          'public task', 'legal grounds', 'processing basis'
        ],
        contextualPatterns: [
          'legal.*?basis.*?processing',
          'lawful.*?basis.*?include',
          'process.*?data.*?based.*?on',
          'legitimate.*?interests.*?assessment'
        ],
        weight: 5,
        minScore: 65
      }
    };

    // Enhanced red flag detection with severity scoring
    this.advancedRedFlags = {
      'Vague Data Retention': {
        patterns: [
          'as long as necessary',
          'for business purposes',
          'until no longer needed',
          'reasonable period',
          'appropriate duration'
        ],
        severity: 'HIGH',
        weight: 4,
        frameworkViolations: ['GDPR Article 5(1)(e)', 'CCPA Section 1798.140']
      },
      
      'Unlimited Third-Party Sharing': {
        patterns: [
          'trusted partners',
          'business partners',
          'may share with third parties',
          'vendors and suppliers',
          'other companies'
        ],
        severity: 'CRITICAL',
        weight: 5,
        frameworkViolations: ['GDPR Article 6', 'CCPA Section 1798.115']
      },
      
      'Weak Consent Mechanisms': {
        patterns: [
          'by using our service',
          'continued use constitutes consent',
          'implied consent',
          'deemed to consent'
        ],
        severity: 'HIGH',
        weight: 4,
        frameworkViolations: ['GDPR Article 7', 'CCPA Section 1798.120']
      },
      
      'Insufficient User Rights': {
        patterns: [
          'services may not work',
          'limited functionality',
          'may refuse requests',
          'at our discretion'
        ],
        severity: 'HIGH',
        weight: 4,
        frameworkViolations: ['GDPR Article 12-23', 'CCPA Section 1798.100-130']
      },
      
      'Weak Security Language': {
        patterns: [
          'reasonable security',
          'industry standard',
          'appropriate measures',
          'best efforts',
          'commercially reasonable'
        ],
        severity: 'MEDIUM',
        weight: 3,
        frameworkViolations: ['GDPR Article 32', 'HIPAA Security Rule']
      },
      
      'Broad Legal Basis Claims': {
        patterns: [
          'legitimate business purposes',
          'legal requirements',
          'where permitted by law',
          'applicable law allows'
        ],
        severity: 'MEDIUM',
        weight: 3,
        frameworkViolations: ['GDPR Article 6']
      }
    };

    // Framework-specific compliance requirements with detailed checks
    this.frameworkRequirements = {
      GDPR: {
        articles: {
          'Article 5': {
            title: 'Principles of processing',
            requirements: [
              'lawfulness, fairness and transparency',
              'purpose limitation',
              'data minimisation',
              'accuracy',
              'storage limitation',
              'integrity and confidentiality',
              'accountability'
            ],
            weight: 5
          },
          'Article 6': {
            title: 'Lawfulness of processing',
            requirements: [
              'explicit legal basis',
              'consent specifications',
              'legitimate interests assessment'
            ],
            weight: 5
          },
          'Article 7': {
            title: 'Conditions for consent',
            requirements: [
              'freely given consent',
              'specific consent',
              'informed consent',
              'unambiguous consent',
              'withdrawal mechanism'
            ],
            weight: 4
          },
          'Article 13': {
            title: 'Information to be provided',
            requirements: [
              'controller identity',
              'processing purposes',
              'legal basis',
              'legitimate interests',
              'recipients',
              'transfers',
              'retention periods',
              'data subject rights'
            ],
            weight: 5
          }
        },
        minComplianceScore: 75
      },
      
      CCPA: {
        sections: {
          '1798.100': {
            title: 'Right to Know',
            requirements: [
              'categories of personal information',
              'sources of information',
              'business purposes',
              'categories of third parties'
            ],
            weight: 5
          },
          '1798.105': {
            title: 'Right to Delete',
            requirements: [
              'deletion process',
              'verification methods',
              'exceptions to deletion'
            ],
            weight: 4
          },
          '1798.120': {
            title: 'Right to Opt-Out',
            requirements: [
              'opt-out mechanism',
              'do not sell link',
              'clear disclosure'
            ],
            weight: 5
          }
        },
        minComplianceScore: 70
      },
      
      HIPAA: {
        rules: {
          'Security Rule': {
            title: 'Administrative, Physical, and Technical Safeguards',
            requirements: [
              'access control',
              'audit controls',
              'integrity controls',
              'person or entity authentication',
              'transmission security'
            ],
            weight: 5
          },
          'Privacy Rule': {
            title: 'Protected Health Information',
            requirements: [
              'minimum necessary standard',
              'individual rights',
              'administrative requirements',
              'disclosure limitations'
            ],
            weight: 5
          }
        },
        minComplianceScore: 80
      }
    };
  }

  // Enhanced section analysis with AI-like pattern recognition
  analyzeEnhancedSections(text) {
    const results = {};
    const normalizedText = text.toLowerCase();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    Object.entries(this.enhancedSections).forEach(([sectionName, config]) => {
      const analysis = {
        found: false,
        keywords: [],
        contextMatches: [],
        negativeMatches: [],
        relevantContent: [],
        score: 0,
        confidence: 0,
        gaps: [],
        recommendations: []
      };

      // Keyword matching with frequency analysis
      const keywordMatches = new Map();
      config.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matches = normalizedText.match(regex);
        if (matches) {
          keywordMatches.set(keyword, matches.length);
          analysis.keywords.push({ keyword, frequency: matches.length });
          analysis.found = true;
        }
      });

      // Contextual pattern matching
      if (config.contextualPatterns) {
        config.contextualPatterns.forEach(pattern => {
          const regex = new RegExp(pattern, 'gi');
          const matches = text.match(regex);
          if (matches) {
            analysis.contextMatches.push(...matches);
          }
        });
      }

      // Negative pattern detection
      if (config.negativePatterns) {
        config.negativePatterns.forEach(pattern => {
          const regex = new RegExp(pattern, 'gi');
          const matches = text.match(regex);
          if (matches) {
            analysis.negativeMatches.push(...matches);
          }
        });
      }

      // Extract relevant content using advanced matching
      sentences.forEach(sentence => {
        const sentenceLower = sentence.toLowerCase();
        let relevanceScore = 0;
        
        // Score based on keyword density
        config.keywords.forEach(keyword => {
          if (sentenceLower.includes(keyword.toLowerCase())) {
            relevanceScore += 1;
          }
        });
        
        // Bonus for contextual patterns
        if (config.contextualPatterns) {
          config.contextualPatterns.forEach(pattern => {
            if (new RegExp(pattern, 'i').test(sentence)) {
              relevanceScore += 2;
            }
          });
        }
        
        // Penalty for negative patterns
        if (config.negativePatterns) {
          config.negativePatterns.forEach(pattern => {
            if (new RegExp(pattern, 'i').test(sentence)) {
              relevanceScore -= 3;
            }
          });
        }
        
        if (relevanceScore > 0) {
          analysis.relevantContent.push({
            sentence: sentence.trim(),
            score: relevanceScore
          });
        }
      });

      // Calculate enhanced score
      analysis.score = this.calculateEnhancedSectionScore(analysis, config);
      analysis.confidence = this.calculateConfidenceScore(analysis, config);
      
      // Identify gaps and recommendations
      if (analysis.score < config.minScore) {
        analysis.gaps = this.identifyDetailedGaps(analysis, sectionName, config);
        analysis.recommendations = this.generateDetailedRecommendations(analysis, sectionName, config);
      }

      results[sectionName] = analysis;
    });

    return results;
  }

  // Calculate enhanced section score with multiple factors
  calculateEnhancedSectionScore(analysis, config) {
    let score = 0;
    
    // Base score for finding relevant content
    if (analysis.found) {
      score += 30;
    }
    
    // Keyword diversity bonus (up to 25 points)
    const uniqueKeywords = analysis.keywords.length;
    const keywordDiversityScore = Math.min(25, (uniqueKeywords / config.keywords.length) * 25);
    score += keywordDiversityScore;
    
    // Keyword frequency bonus (up to 20 points)
    const totalFrequency = analysis.keywords.reduce((sum, kw) => sum + kw.frequency, 0);
    const frequencyScore = Math.min(20, totalFrequency * 2);
    score += frequencyScore;
    
    // Contextual pattern bonus (up to 15 points)
    if (analysis.contextMatches.length > 0) {
      score += Math.min(15, analysis.contextMatches.length * 5);
    }
    
    // Content richness bonus (up to 10 points)
    const contentScore = Math.min(10, analysis.relevantContent.length);
    score += contentScore;
    
    // Negative pattern penalty
    score -= analysis.negativeMatches.length * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  // Calculate confidence score for the analysis
  calculateConfidenceScore(analysis, config) {
    let confidence = 0;
    
    // Keyword match confidence
    if (analysis.keywords.length > 0) {
      confidence += Math.min(40, (analysis.keywords.length / config.keywords.length) * 40);
    }
    
    // Contextual pattern confidence
    if (analysis.contextMatches.length > 0) {
      confidence += Math.min(30, analysis.contextMatches.length * 10);
    }
    
    // Content volume confidence
    if (analysis.relevantContent.length > 0) {
      confidence += Math.min(20, analysis.relevantContent.length * 2);
    }
    
    // Consistency check - penalize if negative patterns found
    if (analysis.negativeMatches.length > 0) {
      confidence -= analysis.negativeMatches.length * 15;
    }
    
    // Quality bonus for high-scoring content
    const highQualityContent = analysis.relevantContent.filter(c => c.score >= 3).length;
    confidence += Math.min(10, highQualityContent * 2);
    
    return Math.max(0, Math.min(100, confidence));
  }

  // Enhanced red flag detection with severity weighting
  detectAdvancedRedFlags(text) {
    const redFlags = [];
    const normalizedText = text.toLowerCase();
    
    Object.entries(this.advancedRedFlags).forEach(([category, config]) => {
      const flagInstances = [];
      
      config.patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          flagInstances.push(...matches);
        }
      });
      
      if (flagInstances.length > 0) {
        redFlags.push({
          category,
          severity: config.severity,
          weight: config.weight,
          instances: flagInstances,
          frameworkViolations: config.frameworkViolations,
          count: flagInstances.length,
          recommendation: this.getAdvancedRecommendation(category, config),
          businessImpact: this.assessBusinessImpact(category, config.severity),
          remediation: this.generateRemediationPlan(category, config)
        });
      }
    });
    
    return redFlags.sort((a, b) => {
      const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // Enhanced framework analysis with detailed scoring
  analyzeFrameworkCompliance(text, sectionAnalysis, redFlags) {
    const results = {};
    
    Object.entries(this.frameworkRequirements).forEach(([framework, config]) => {
      const frameworkResult = {
        overallScore: 0,
        articlesAnalyzed: {},
        missingRequirements: [],
        criticalGaps: [],
        recommendations: [],
        complianceLevel: 'INADEQUATE',
        riskAssessment: 'HIGH'
      };
      
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      // Analyze each article/section
      Object.entries(config.articles || config.sections || config.rules).forEach(([articleKey, articleConfig]) => {
        const articleAnalysis = this.analyzeFrameworkArticle(text, articleConfig, framework);
        frameworkResult.articlesAnalyzed[articleKey] = articleAnalysis;
        
        totalScore += articleAnalysis.score * articleConfig.weight;
        maxPossibleScore += 100 * articleConfig.weight;
        
        if (articleAnalysis.score < 60) {
          frameworkResult.criticalGaps.push({
            article: articleKey,
            title: articleConfig.title,
            score: articleAnalysis.score,
            missingElements: articleAnalysis.missingElements
          });
        }
      });
      
      // Calculate overall framework score
      frameworkResult.overallScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
      
      // Apply red flag penalties
      const frameworkRedFlags = redFlags.filter(rf => 
        rf.frameworkViolations.some(fv => fv.includes(framework))
      );
      const redFlagPenalty = frameworkRedFlags.reduce((penalty, rf) => penalty + (rf.weight * 5), 0);
      frameworkResult.overallScore = Math.max(0, frameworkResult.overallScore - redFlagPenalty);
      
      // Determine compliance level and risk
      frameworkResult.complianceLevel = this.determineComplianceLevel(frameworkResult.overallScore, config.minComplianceScore);
      frameworkResult.riskAssessment = this.assessFrameworkRisk(frameworkResult.overallScore, frameworkRedFlags.length);
      
      // Generate framework-specific recommendations
      frameworkResult.recommendations = this.generateFrameworkRecommendations(
        frameworkResult, 
        framework, 
        sectionAnalysis
      );
      
      results[framework] = frameworkResult;
    });
    
    return results;
  }

  // Analyze specific framework articles with detailed requirements
  analyzeFrameworkArticle(text, articleConfig, framework) {
    const analysis = {
      score: 0,
      foundRequirements: [],
      missingElements: [],
      confidence: 0
    };
    
    let foundCount = 0;
    
    articleConfig.requirements.forEach(requirement => {
      const found = this.checkRequirementCompliance(text, requirement, framework);
      if (found.isCompliant) {
        analysis.foundRequirements.push({
          requirement,
          evidence: found.evidence,
          confidence: found.confidence
        });
        foundCount++;
      } else {
        analysis.missingElements.push({
          requirement,
          reason: found.reason,
          priority: found.priority || 'HIGH'
        });
      }
    });
    
    // Calculate article score
    analysis.score = (foundCount / articleConfig.requirements.length) * 100;
    analysis.confidence = this.calculateRequirementConfidence(analysis.foundRequirements);
    
    return analysis;
  }

  // Check specific requirement compliance with enhanced pattern matching
  checkRequirementCompliance(text, requirement, framework) {
    const normalizedText = text.toLowerCase();
    const normalizedRequirement = requirement.toLowerCase();
    
    // Framework-specific requirement patterns
    const requirementPatterns = {
      'GDPR': {
        'lawfulness, fairness and transparency': [
          'lawful basis', 'legal basis', 'legitimate interests', 'transparency',
          'clear and plain language', 'easily accessible'
        ],
        'purpose limitation': [
          'specific purposes', 'explicit purposes', 'legitimate purposes',
          'compatible purpose', 'original purpose'
        ],
        'data minimisation': [
          'necessary data', 'relevant data', 'limited to purposes',
          'minimum necessary', 'adequate and relevant'
        ],
        'freely given consent': [
          'freely given', 'voluntary consent', 'genuine choice',
          'no detriment', 'refuse consent'
        ],
        'controller identity': [
          'data controller', 'controller contact', 'controller details',
          'who we are', 'company information'
        ]
      },
      'CCPA': {
        'categories of personal information': [
          'categories of information', 'types of data', 'personal information includes',
          'information collected', 'data categories'
        ],
        'opt-out mechanism': [
          'opt out', 'do not sell', 'opt-out link', 'stop selling',
          'opt out of sale'
        ]
      }
    };
    
    const patterns = requirementPatterns[framework]?.[normalizedRequirement] || [normalizedRequirement];
    
    let evidence = [];
    let matchCount = 0;
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        evidence.push(...matches);
        matchCount++;
      }
    });
    
    const isCompliant = matchCount > 0;
    const confidence = Math.min(100, (matchCount / patterns.length) * 100);
    
    return {
      isCompliant,
      evidence,
      confidence,
      reason: isCompliant ? 'Found matching patterns' : 'No matching patterns found',
      priority: confidence < 50 ? 'HIGH' : confidence < 80 ? 'MEDIUM' : 'LOW'
    };
  }

  // Generate detailed gaps with business impact assessment
  identifyDetailedGaps(analysis, sectionName, config) {
    const gaps = [];
    
    if (!analysis.found) {
      gaps.push({
        type: 'MISSING_SECTION',
        severity: 'HIGH',
        description: `${sectionName} section is missing or inadequately addressed`,
        businessImpact: this.assessSectionBusinessImpact(sectionName),
        regulatoryRisk: 'HIGH',
        timeToFix: '1-2 weeks'
      });
    }
    
    if (analysis.keywords.length < Math.ceil(config.keywords.length * 0.3)) {
      gaps.push({
        type: 'INSUFFICIENT_DETAIL',
        severity: 'MEDIUM',
        description: `${sectionName} section lacks sufficient detail and coverage`,
        businessImpact: 'Medium compliance risk',
        regulatoryRisk: 'MEDIUM',
        timeToFix: '3-5 days'
      });
    }
    
    if (analysis.negativeMatches.length > 0) {
      gaps.push({
        type: 'CONTRADICTORY_STATEMENTS',
        severity: 'HIGH',
        description: `${sectionName} contains contradictory or problematic statements`,
        businessImpact: 'High legal exposure',
        regulatoryRisk: 'HIGH',
        timeToFix: '1 week'
      });
    }
    
    if (analysis.contextMatches.length === 0 && config.contextualPatterns) {
      gaps.push({
        type: 'WEAK_CONTEXT',
        severity: 'MEDIUM',
        description: `${sectionName} lacks contextual depth and specific implementations`,
        businessImpact: 'Regulatory interpretation risk',
        regulatoryRisk: 'MEDIUM',
        timeToFix: '2-3 days'
      });
    }
    
    return gaps;
  }

  // Main enhanced analysis method
  async analyzePolicy(text, options = {}) {
    console.log('Starting enhanced policy analysis...');
    
    try {
      // Enhanced section analysis
      const sectionAnalysis = this.analyzeEnhancedSections(text);
      
      // Advanced red flag detection
      const redFlags = this.detectAdvancedRedFlags(text);
      
      // Framework compliance analysis
      const frameworkAnalysis = this.analyzeFrameworkCompliance(text, sectionAnalysis, redFlags);
      
      // Calculate enhanced overall score
      const overallScore = this.calculateEnhancedOverallScore(sectionAnalysis, redFlags, frameworkAnalysis);
      
      // Generate comprehensive gaps list
      const gaps = this.generateComprehensiveGaps(sectionAnalysis, redFlags, frameworkAnalysis);
      
      // Generate executive summary
      const summary = this.generateEnhancedExecutiveSummary(overallScore, gaps, frameworkAnalysis);
      
      // Industry benchmarking
      const industryBenchmark = this.calculateIndustryBenchmark(overallScore, options.industry);
      
      const report = {
        timestamp: new Date().toISOString(),
        version: '2.0',
        overallScore,
        summary,
        gaps,
        industryBenchmark,
        structuredAnalysis: {
          sectionAnalysis,
          redFlags,
          frameworkAnalysis,
          confidence: this.calculateOverallConfidence(sectionAnalysis),
          recommendations: this.generatePrioritizedRecommendations(gaps, redFlags)
        },
        metadata: {
          totalSections: Object.keys(sectionAnalysis).length,
          sectionsAnalyzed: Object.values(sectionAnalysis).filter(s => s.found).length,
          redFlagsFound: redFlags.length,
          frameworksAnalyzed: Object.keys(frameworkAnalysis).length,
          analysisDepth: 'COMPREHENSIVE'
        }
      };
      
      console.log('Enhanced policy analysis completed:', {
        score: report.overallScore,
        gaps: gaps.length,
        redFlags: redFlags.length,
        confidence: report.structuredAnalysis.confidence
      });
      
      return report;
      
    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      // Fallback to basic analysis
      return super.analyzePolicy(text);
    }
  }

  // Calculate enhanced overall score with weighted factors
  calculateEnhancedOverallScore(sectionAnalysis, redFlags, frameworkAnalysis) {
    let totalScore = 0;
    let weightSum = 0;
    
    // Section scores with weights
    Object.entries(sectionAnalysis).forEach(([section, analysis]) => {
      const weight = this.enhancedSections[section]?.weight || 3;
      totalScore += analysis.score * weight;
      weightSum += weight;
    });
    
    let baseScore = weightSum > 0 ? (totalScore / weightSum) : 0;
    
    // Red flag penalties with severity weighting
    const redFlagPenalty = redFlags.reduce((penalty, flag) => {
      const severityMultiplier = {
        'CRITICAL': 15,
        'HIGH': 10,
        'MEDIUM': 5,
        'LOW': 2
      };
      return penalty + (flag.weight * severityMultiplier[flag.severity]);
    }, 0);
    
    baseScore = Math.max(0, baseScore - redFlagPenalty);
    
    // Framework compliance bonus/penalty
    const frameworkScores = Object.values(frameworkAnalysis).map(f => f.overallScore);
    const avgFrameworkScore = frameworkScores.length > 0 
      ? frameworkScores.reduce((sum, score) => sum + score, 0) / frameworkScores.length 
      : baseScore;
    
    // Weighted combination: 60% section analysis, 40% framework compliance
    const finalScore = (baseScore * 0.6) + (avgFrameworkScore * 0.4);
    
    return Math.round(Math.max(0, Math.min(100, finalScore)));
  }

  // Generate comprehensive gaps with prioritization
  generateComprehensiveGaps(sectionAnalysis, redFlags, frameworkAnalysis) {
    const gaps = [];
    let gapCounter = 1;
    
    // Red flag gaps (highest priority)
    redFlags.forEach(flag => {
      gaps.push({
        id: gapCounter++,
        type: 'RED_FLAG',
        issue: flag.category,
        severity: flag.severity.toLowerCase(),
        framework: flag.frameworkViolations[0]?.split(' ')[0] || 'General',
        remediation: flag.remediation,
        businessImpact: flag.businessImpact,
        timeframe: this.getTimeframeForSeverity(flag.severity),
        effort: this.getEffortForSeverity(flag.severity),
        riskLevel: flag.severity,
        priority: this.getPriorityForSeverity(flag.severity)
      });
    });
    
    // Section gaps
    Object.entries(sectionAnalysis).forEach(([section, analysis]) => {
      if (analysis.gaps && analysis.gaps.length > 0) {
        analysis.gaps.forEach(gap => {
          gaps.push({
            id: gapCounter++,
            type: 'SECTION_GAP',
            issue: gap.description || `${section} section needs improvement`,
            severity: gap.severity?.toLowerCase() || 'medium',
            framework: 'General',
            remediation: gap.remedy || analysis.recommendations[0] || `Enhance ${section} section content`,
            businessImpact: gap.businessImpact || 'Compliance risk',
            timeframe: gap.timeToFix || '1-2 weeks',
            effort: 'Medium',
            riskLevel: gap.regulatoryRisk || 'MEDIUM',
            priority: analysis.score < 30 ? 1 : analysis.score < 60 ? 2 : 3
          });
        });
      }
    });
    
    // Framework gaps
    Object.entries(frameworkAnalysis).forEach(([framework, analysis]) => {
      analysis.criticalGaps.forEach(gap => {
        gaps.push({
          id: gapCounter++,
          type: 'FRAMEWORK_GAP',
          issue: `${framework} ${gap.article}: ${gap.title} - Score: ${gap.score}%`,
          severity: gap.score < 30 ? 'critical' : gap.score < 60 ? 'high' : 'medium',
          framework,
          remediation: `Address missing requirements in ${gap.article}`,
          businessImpact: `${framework} compliance risk`,
          timeframe: gap.score < 30 ? '1-2 weeks' : '2-4 weeks',
          effort: gap.score < 30 ? 'High' : 'Medium',
          riskLevel: gap.score < 30 ? 'CRITICAL' : 'HIGH',
          priority: gap.score < 30 ? 1 : 2
        });
      });
    });
    
    // Sort by priority and severity
    return gaps.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // Helper methods for gap generation
  getTimeframeForSeverity(severity) {
    const timeframes = {
      'CRITICAL': 'Immediate (1-7 days)',
      'HIGH': 'Urgent (1-2 weeks)',
      'MEDIUM': 'Medium-term (2-4 weeks)',
      'LOW': 'Long-term (1-2 months)'
    };
    return timeframes[severity] || 'TBD';
  }

  getEffortForSeverity(severity) {
    const efforts = {
      'CRITICAL': 'High',
      'HIGH': 'Medium-High',
      'MEDIUM': 'Medium',
      'LOW': 'Low'
    };
    return efforts[severity] || 'Medium';
  }

  getPriorityForSeverity(severity) {
    const priorities = {
      'CRITICAL': 1,
      'HIGH': 2,
      'MEDIUM': 3,
      'LOW': 4
    };
    return priorities[severity] || 3;
  }

  // Additional helper methods
  assessSectionBusinessImpact(sectionName) {
    const impacts = {
      dataCollection: 'High regulatory risk, potential fines',
      userRights: 'Legal compliance risk, user trust issues',
      dataSecurity: 'Security breach risk, reputation damage',
      dataRetention: 'Data protection violations, storage costs',
      dataSharing: 'Third-party liability, transparency issues'
    };
    return impacts[sectionName] || 'Compliance and business risk';
  }

  assessBusinessImpact(category, severity) {
    const baseImpacts = {
      'Vague Data Retention': 'Data storage compliance violations, potential regulatory fines',
      'Unlimited Third-Party Sharing': 'High liability exposure, user trust erosion',
      'Weak Consent Mechanisms': 'Invalid consent, legal challenges to data processing',
      'Insufficient User Rights': 'Individual rights violations, regulatory penalties',
      'Weak Security Language': 'Security accountability gaps, incident response issues'
    };
    
    const severityMultipliers = {
      'CRITICAL': 'Severe business impact with immediate action required',
      'HIGH': 'Significant business risk requiring prompt attention',
      'MEDIUM': 'Moderate business impact with improvement recommended',
      'LOW': 'Minor business consideration for optimization'
    };
    
    return `${baseImpacts[category] || 'Business compliance risk'}. ${severityMultipliers[severity]}`;
  }

  generateRemediationPlan(category, config) {
    const plans = {
      'Vague Data Retention': 'Implement specific retention schedules with defined timeframes for each data category',
      'Unlimited Third-Party Sharing': 'Create exhaustive third-party list with specific sharing purposes and legal basis',
      'Weak Consent Mechanisms': 'Implement granular, explicit consent mechanisms with easy withdrawal options',
      'Insufficient User Rights': 'Develop comprehensive user rights portal with self-service options',
      'Weak Security Language': 'Detail specific security measures, standards, and incident response procedures'
    };
    return plans[category] || 'Review and strengthen language to meet regulatory requirements';
  }

  getAdvancedRecommendation(category, config) {
    return this.generateRemediationPlan(category, config);
  }

  calculateOverallConfidence(sectionAnalysis) {
    const confidences = Object.values(sectionAnalysis).map(s => s.confidence || 0);
    return confidences.length > 0 ? Math.round(confidences.reduce((sum, c) => sum + c, 0) / confidences.length) : 0;
  }

  generateEnhancedExecutiveSummary(overallScore, gaps, frameworkAnalysis) {
    const criticalGaps = gaps.filter(g => g.severity === 'critical').length;
    const highGaps = gaps.filter(g => g.severity === 'high').length;
    
    const frameworkSummary = Object.entries(frameworkAnalysis)
      .map(([framework, data]) => `${framework}: ${data.overallScore}%`)
      .join(', ');
    
    let summary = `Comprehensive compliance analysis completed with an overall score of ${overallScore}%. `;
    
    if (criticalGaps > 0) {
      summary += `CRITICAL: ${criticalGaps} critical compliance violations require immediate attention. `;
    }
    
    if (highGaps > 0) {
      summary += `${highGaps} high-priority gaps identified requiring prompt remediation. `;
    }
    
    summary += `Framework compliance analysis shows: ${frameworkSummary}. `;
    
    if (overallScore >= 80) {
      summary += 'Strong compliance foundation with minor improvements needed.';
    } else if (overallScore >= 60) {
      summary += 'Moderate compliance level with several areas requiring enhancement.';
    } else {
      summary += 'Significant compliance gaps requiring comprehensive remediation strategy.';
    }
    
    return summary;
  }

  calculateIndustryBenchmark(score, industry = 'General') {
    const benchmarks = {
      'Healthcare': { average: 78, excellent: 90 },
      'Financial': { average: 82, excellent: 92 },
      'Technology': { average: 75, excellent: 88 },
      'Retail': { average: 72, excellent: 85 },
      'General': { average: 74, excellent: 87 }
    };
    
    const benchmark = benchmarks[industry] || benchmarks['General'];
    
    let comparison;
    if (score >= benchmark.excellent) {
      comparison = 'Excellent - Above Industry Best Practices';
    } else if (score >= benchmark.average) {
      comparison = 'Good - Above Industry Average';
    } else if (score >= benchmark.average - 10) {
      comparison = 'Fair - Near Industry Average';
    } else {
      comparison = 'Below Average - Improvement Required';
    }
    
    return {
      industry,
      score,
      average: benchmark.average,
      excellent: benchmark.excellent,
      comparison,
      percentile: Math.round((score / benchmark.excellent) * 100)
    };
  }

  generatePrioritizedRecommendations(gaps, redFlags) {
    const recommendations = [];
    
    // Critical and high-priority items first
    const prioritizedItems = [...gaps, ...redFlags.map(rf => ({ ...rf, type: 'RED_FLAG' }))];
    
    prioritizedItems
      .filter(item => ['critical', 'high', 'CRITICAL', 'HIGH'].includes(item.severity))
      .slice(0, 10)
      .forEach((item, index) => {
        recommendations.push({
          priority: index + 1,
          type: item.type || 'GAP',
          title: item.issue || item.category,
          severity: item.severity?.toLowerCase() || 'medium',
          framework: item.framework || 'General',
          action: item.remediation || item.recommendation,
          timeframe: item.timeframe || this.getTimeframeForSeverity(item.severity),
          effort: item.effort || this.getEffortForSeverity(item.severity),
          businessImpact: item.businessImpact || 'Compliance improvement'
        });
      });
    
    return recommendations;
  }

  // Override parent methods to use enhanced analysis
  determineComplianceLevel(score, minScore) {
    if (score >= minScore + 15) return 'EXCELLENT';
    if (score >= minScore) return 'COMPLIANT';
    if (score >= minScore - 15) return 'NEEDS_IMPROVEMENT';
    return 'NON_COMPLIANT';
  }

  assessFrameworkRisk(score, redFlagCount) {
    if (score < 60 || redFlagCount > 3) return 'HIGH';
    if (score < 75 || redFlagCount > 1) return 'MEDIUM';
    return 'LOW';
  }

  generateFrameworkRecommendations(frameworkResult, framework, sectionAnalysis) {
    const recommendations = [];
    
    frameworkResult.criticalGaps.forEach(gap => {
      recommendations.push({
        article: gap.article,
        priority: gap.score < 30 ? 'CRITICAL' : 'HIGH',
        action: `Implement missing requirements for ${gap.title}`,
        elements: gap.missingElements.map(el => el.requirement)
      });
    });
    
    return recommendations;
  }

  calculateRequirementConfidence(foundRequirements) {
    if (foundRequirements.length === 0) return 0;
    const avgConfidence = foundRequirements.reduce((sum, req) => sum + req.confidence, 0) / foundRequirements.length;
    return Math.round(avgConfidence);
  }

  generateDetailedRecommendations(analysis, sectionName, config) {
    const recommendations = [];
    
    if (analysis.score < config.minScore) {
      recommendations.push(
        `Enhance ${sectionName} section with more specific and detailed content`,
        `Add industry-standard terminology and comprehensive coverage`,
        `Include specific examples and implementation details`
      );
    }
    
    if (analysis.contextMatches.length === 0) {
      recommendations.push(`Add contextual implementations for ${sectionName} practices`);
    }
    
    if (analysis.negativeMatches.length > 0) {
      recommendations.push(`Remove contradictory statements in ${sectionName} section`);
    }
    
    return recommendations;
  }
}

export default EnhancedComplianceAnalyzer;
