import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeDocument } from '../lib/gemini';

// Dynamic import for PDF.js to avoid build issues
let pdfjsLib = null;
let pdfWorkerLoaded = false;

// Initialize PDF.js dynamically
const initializePdfJs = async () => {
  if (!pdfjsLib && typeof window !== 'undefined') {
    try {
      pdfjsLib = await import('pdfjs-dist/webpack');
      if (!pdfWorkerLoaded) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        pdfWorkerLoaded = true;
      }
    } catch (error) {
      console.warn('Failed to load PDF.js:', error);
      throw new Error('PDF processing library not available');
    }
  }
  return pdfjsLib;
};

// Advanced NLP Processing Classes
class DocumentStructureAnalyzer {
  constructor() {
    this.sectionPatterns = {
      headers: /^(\d+\.?\s+|[A-Z][A-Z\s]{2,}:?|PURPOSE|SCOPE|DEFINITIONS|RESPONSIBILITIES|PROCEDURES|IMPLEMENTATION|ENFORCEMENT)$/i,
      listItems: /^[\s]*[-•*]\s+|^[\s]*\d+[.)]/,
      tableHeaders: /\|.*\|/,
      footers: /^(Page \d+|Confidential|Copyright|\d{4}|Last Modified)/i
    };
  }

  analyzeStructure(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const structure = {
      sections: [],
      currentSection: null,
      tables: [],
      lists: [],
      metadata: []
    };

    lines.forEach((line, index) => {
      // Remove headers/footers
      if (this.sectionPatterns.footers.test(line)) {
        structure.metadata.push({ type: 'footer', content: line, line: index });
        return;
      }

      // Detect section headers
      if (this.sectionPatterns.headers.test(line) || line.endsWith(':')) {
        structure.currentSection = {
          title: line.replace(/[:.]$/, ''),
          content: [],
          startLine: index,
          type: 'section'
        };
        structure.sections.push(structure.currentSection);
      }
      // Detect lists
      else if (this.sectionPatterns.listItems.test(line)) {
        structure.lists.push({ content: line, line: index, section: structure.currentSection?.title });
        if (structure.currentSection) {
          structure.currentSection.content.push(line);
        }
      }
      // Detect tables
      else if (this.sectionPatterns.tableHeaders.test(line)) {
        structure.tables.push({ content: line, line: index, section: structure.currentSection?.title });
        if (structure.currentSection) {
          structure.currentSection.content.push(line);
        }
      }
      // Regular content
      else if (structure.currentSection) {
        structure.currentSection.content.push(line);
      }
    });

    return structure;
  }
}

class RegulationNER {
  constructor() {
    this.entities = {
      dataTypes: {
        patterns: ['ip address', 'email address', 'phone number', 'device identifier', 'cookies',
                  'location data', 'biometric data', 'financial information', 'health data'],
        weight: 3
      },
      legalClauses: {
        patterns: ['right to erasure', 'right to portability', 'right to access', 'right to rectification',
                  'consent withdrawal', 'legitimate interest', 'data controller', 'data processor'],
        weight: 4
      },
      riskPhrases: {
        patterns: ['residual copies', 'third party sharing', 'data transfer', 'security breach',
                  'unauthorized access', 'data retention', 'cross-border transfer'],
        weight: 3
      },
      complianceTerms: {
        patterns: ['gdpr compliance', 'privacy by design', 'data protection impact', 'lawful basis',
                  'supervisory authority', 'data protection officer', 'privacy notice'],
        weight: 4
      }
    };
  }

  extractEntities(text) {
    const normalizedText = text.toLowerCase();
    const entities = [];
    let totalScore = 0;

    Object.entries(this.entities).forEach(([category, config]) => {
      const categoryEntities = [];

      config.patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matches = [...normalizedText.matchAll(regex)];

        matches.forEach(match => {
          categoryEntities.push({
            text: match[0],
            start: match.index,
            end: match.index + match[0].length,
            confidence: 0.9 + (pattern.length / 100) // Longer patterns get higher confidence
          });
          totalScore += config.weight;
        });
      });

      if (categoryEntities.length > 0) {
        entities.push({
          category,
          entities: categoryEntities,
          count: categoryEntities.length,
          weight: config.weight
        });
      }
    });

    return { entities, totalScore };
  }
}

class RelationshipExtractor {
  constructor() {
    this.relationshipPatterns = [
      {
        pattern: /we\s+(collect|gather|obtain|receive)\s+([^.]+?)\s+(from|for)/gi,
        type: 'data_collection',
        weight: 3
      },
      {
        pattern: /we\s+(share|disclose|provide|transfer)\s+([^.]+?)\s+(with|to)\s+([^.]+)/gi,
        type: 'data_sharing',
        weight: 4
      },
      {
        pattern: /we\s+(use|process|analyze)\s+([^.]+?)\s+(to|for)\s+([^.]+)/gi,
        type: 'data_processing',
        weight: 3
      },
      {
        pattern: /we\s+(store|retain|keep)\s+([^.]+?)\s+(for|until)\s+([^.]+)/gi,
        type: 'data_retention',
        weight: 3
      }
    ];
  }

  extractRelationships(text) {
    const relationships = [];
    let totalScore = 0;

    this.relationshipPatterns.forEach(({ pattern, type, weight }) => {
      const matches = [...text.matchAll(pattern)];

      matches.forEach(match => {
        relationships.push({
          type,
          fullMatch: match[0],
          action: match[1],
          object: match[2]?.trim(),
          target: match[4]?.trim(),
          confidence: 0.85,
          riskLevel: this.assessRisk(type, match[0])
        });
        totalScore += weight;
      });
    });

    return { relationships, totalScore };
  }

  assessRisk(type, text) {
    const highRiskTerms = ['third party', 'marketing', 'advertising', 'cross-border', 'indefinitely'];
    const lowRiskTerms = ['security', 'legitimate', 'necessary', 'consent'];

    const normalizedText = text.toLowerCase();

    if (highRiskTerms.some(term => normalizedText.includes(term))) {
      return 'high';
    } else if (lowRiskTerms.some(term => normalizedText.includes(term))) {
      return 'low';
    }
    return 'medium';
  }
}

class ComplianceScorer {
  constructor() {
    this.gdprRequirements = {
      'data_retention_period': { weight: 10, keywords: ['retention period', 'delete', 'how long'] },
      'lawful_basis': { weight: 8, keywords: ['lawful basis', 'legal basis', 'consent', 'legitimate interest'] },
      'data_subject_rights': { weight: 9, keywords: ['right to access', 'right to erasure', 'right to portability'] },
      'data_protection_officer': { weight: 5, keywords: ['dpo', 'data protection officer', 'privacy officer'] },
      'security_measures': { weight: 7, keywords: ['encryption', 'security measures', 'technical safeguards'] },
      'third_party_sharing': { weight: 8, keywords: ['third party', 'share', 'disclose', 'transfer'] },
      'consent_management': { weight: 9, keywords: ['consent', 'withdraw consent', 'opt-out'] }
    };
  }

  calculateComplianceScore(text, entities, relationships) {
    const normalizedText = text.toLowerCase();
    let totalScore = 100; // Start with perfect score
    const violations = [];
    const strengths = [];

    // Check GDPR requirements
    Object.entries(this.gdprRequirements).forEach(([requirement, config]) => {
      const hasRequirement = config.keywords.some(keyword =>
        normalizedText.includes(keyword.toLowerCase())
      );

      if (!hasRequirement) {
        totalScore -= config.weight;
        violations.push({
          requirement,
          severity: config.weight >= 8 ? 'high' : config.weight >= 6 ? 'medium' : 'low',
          suggestion: `Missing ${requirement.replace(/_/g, ' ')} documentation`
        });
      } else {
        strengths.push(requirement.replace(/_/g, ' '));
      }
    });

    // Bonus points for comprehensive documentation
    if (entities.totalScore > 50) totalScore += 5;
    if (relationships.totalScore > 30) totalScore += 5;

    // Risk assessment penalties
    const highRiskRelationships = relationships.relationships.filter(r => r.riskLevel === 'high');
    totalScore -= highRiskRelationships.length * 3;

    return {
      score: Math.max(0, Math.min(100, totalScore)),
      violations,
      strengths,
      riskFactors: highRiskRelationships.length,
      recommendations: this.generateRecommendations(violations)
    };
  }

  generateRecommendations(violations) {
    return violations.map(v => {
      switch (v.requirement) {
        case 'data_retention_period':
          return 'Specify clear data retention periods and deletion procedures (GDPR Art. 5(1)(e))';
        case 'lawful_basis':
          return 'Document the lawful basis for processing personal data (GDPR Art. 6)';
        case 'data_subject_rights':
          return 'Include comprehensive information about data subject rights (GDPR Art. 12-22)';
        default:
          return v.suggestion;
      }
    });
  }
}

function DocumentUpload({ onUpload, uploading, progress, error }) {
  const [file, setFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showInvalidFilePopup, setShowInvalidFilePopup] = useState(false);
  const [invalidFileReason, setInvalidFileReason] = useState('');
  const [isValidatingFile, setIsValidatingFile] = useState(false);
  const [validationDetails, setValidationDetails] = useState(null);

  const availableFrameworks = [
    { id: 'GDPR', name: 'GDPR (General Data Protection Regulation)', region: 'EU', icon: '🇪🇺' },
    { id: 'HIPAA', name: 'HIPAA (Health Insurance Portability)', region: 'US', icon: '🏥' },
    { id: 'SOX', name: 'SOX (Sarbanes-Oxley Act)', region: 'US', icon: '📊' },
    { id: 'CCPA', name: 'CCPA (California Consumer Privacy Act)', region: 'California', icon: '🌴' },
    { id: 'PCI_DSS', name: 'PCI DSS (Payment Card Industry)', region: 'Global', icon: '💳' },
    { id: 'ISO_27001', name: 'ISO 27001 (Information Security Management)', region: 'International', icon: '🔒' },
    { id: 'FERPA', name: 'FERPA (Family Educational Rights)', region: 'US', icon: '🎓' },
    { id: 'GLBA', name: 'GLBA (Gramm-Leach-Bliley Act)', region: 'US', icon: '🏦' },
    { id: 'COPPA', name: 'COPPA (Children\'s Online Privacy)', region: 'US', icon: '👶' },
    { id: 'NIST_CSF', name: 'NIST Cybersecurity Framework', region: 'US', icon: '🛡️' },
    { id: 'CAN_SPAM', name: 'CAN-SPAM Act', region: 'US', icon: '📧' },
    { id: 'FISMA', name: 'FISMA (Federal Information Security)', region: 'US', icon: '🏛️' }
  ];

  const industries = [
    { id: 'technology', name: 'Technology', icon: '💻', description: 'Software, SaaS, IT services, and tech startups' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Hospitals, medical devices, health services' },
    { id: 'financial', name: 'Financial Services', icon: '🏦', description: 'Banks, insurance, investment firms' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Production, industrial, automotive' },
    { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️', description: 'Online stores, consumer goods, retail chains' },
    { id: 'education', name: 'Education', icon: '🎓', description: 'Schools, universities, educational platforms' },
    { id: 'government', name: 'Government', icon: '🏛️', description: 'Public sector, agencies, municipalities' },
    { id: 'energy', name: 'Energy & Utilities', icon: '⚡', description: 'Power, oil & gas, renewable energy' }
  ];

  // Text cleaning and noise reduction
  const cleanExtractedText = (text) => {
    return text
      // Remove page headers/footers
      .replace(/Page \d+ of \d+/gi, '')
      .replace(/Confidential[^\n]*/gi, '')
      .replace(/Copyright[^\n]*/gi, '')
      .replace(/Last Modified[^\n]*/gi, '')
      // Remove excessive whitespace
      .replace(/\s{3,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      // Fix common OCR errors
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  };

  // Extract text content from different file types
  const extractTextContent = async (file) => {
    const fileType = file.type;

    try {
      if (fileType === 'application/pdf') {
        return await extractPDFText(file);
      } else if (fileType.includes('text/') ||
                 fileType.includes('application/msword') ||
                 fileType.includes('application/vnd.openxmlformats-officedocument')) {
        return await extractTextFromFile(file);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Unable to extract text from file');
    }
  };

  // Robust PDF text extraction with multiple fallback methods
  const extractPDFText = async (file) => {
    // Try multiple extraction methods for maximum compatibility
    const methods = [
      () => extractPDFWithPdfJs(file),
      () => extractPDFAsText(file),
      () => extractPDFWithBasicParsing(file)
    ];

    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`Trying PDF extraction method ${i + 1}...`);
        const result = await methods[i]();
        if (result && result.length > 50) {
          console.log(`PDF extraction method ${i + 1} successful: ${result.length} characters`);
          return result;
        }
      } catch (error) {
        console.warn(`PDF extraction method ${i + 1} failed:`, error.message);
        if (i === methods.length - 1) {
          throw new Error(`All PDF extraction methods failed. Last error: ${error.message}`);
        }
      }
    }

    throw new Error('Unable to extract text from PDF using any method');
  };

  // Method 1: PDF.js extraction (most reliable)
  const extractPDFWithPdfJs = async (file) => {
    const pdfLib = await initializePdfJs();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reject(new Error('PDF.js processing timeout'));
      }, 15000);

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;

          const loadingTask = pdfLib.getDocument({
            data: arrayBuffer,
            disableFontFace: true,
            useSystemFonts: true,
            verbosity: 0 // Reduce console output
          });

          const pdf = await loadingTask.promise;
          let fullText = '';
          let successfulPages = 0;

          const maxPages = Math.min(pdf.numPages, 5); // Process up to 5 pages

          for (let i = 1; i <= maxPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();

              if (textContent && textContent.items) {
                const pageText = textContent.items
                  .map(item => item.str || '')
                  .filter(str => str.trim().length > 0)
                  .join(' ');

                if (pageText.length > 0) {
                  fullText += pageText + '\n';
                  successfulPages++;

                  // Stop if we have enough content for validation
                  if (fullText.length > 3000) break;
                }
              }
            } catch (pageError) {
              console.warn(`Page ${i} extraction failed:`, pageError.message);
            }
          }

          clearTimeout(timeoutId);

          if (fullText.trim().length < 50) {
            reject(new Error('PDF contains insufficient text content'));
          } else {
            // Apply text cleaning
            const cleanedText = cleanExtractedText(fullText);
            resolve(cleanedText);
          }

        } catch (error) {
          clearTimeout(timeoutId);
          reject(new Error(`PDF.js extraction failed: ${error.message}`));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read PDF file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Method 2: Try reading PDF as text (works for some simple PDFs)
  const extractPDFAsText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reject(new Error('Text extraction timeout'));
      }, 5000);

      reader.onload = (e) => {
        clearTimeout(timeoutId);
        try {
          const content = e.target.result;

          // Try to extract readable text from PDF content
          let extractedText = '';

          // Look for text patterns in PDF
          const textPatterns = [
            /BT[\s\S]*?ET/g, // PDF text objects
            /\([^)]*\)/g,    // Text in parentheses
            /\[[^\]]*\]/g,   // Text in brackets
          ];

          for (const pattern of textPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              extractedText += matches.join(' ');
            }
          }

          // Clean up extracted text
          extractedText = extractedText
            .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

          if (extractedText.length > 50) {
            resolve(extractedText);
          } else {
            reject(new Error('No readable text found in PDF'));
          }
        } catch (error) {
          reject(new Error(`Text extraction failed: ${error.message}`));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read PDF as text'));
      };

      reader.readAsText(file, 'utf-8');
    });
  };

  // Method 3: Basic PDF parsing (last resort)
  const extractPDFWithBasicParsing = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;

          // Very basic PDF text extraction
          let text = '';
          const lines = content.split('\n');

          for (const line of lines) {
            // Look for common policy-related words
            const cleanLine = line.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
            if (cleanLine.length > 3 && (
              cleanLine.toLowerCase().includes('policy') ||
              cleanLine.toLowerCase().includes('privacy') ||
              cleanLine.toLowerCase().includes('security') ||
              cleanLine.toLowerCase().includes('information') ||
              cleanLine.toLowerCase().includes('data')
            )) {
              text += cleanLine + ' ';
            }
          }

          if (text.length > 50) {
            resolve(text.trim());
          } else {
            reject(new Error('No policy-related text found'));
          }
        } catch (error) {
          reject(new Error(`Basic parsing failed: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file for basic parsing'));
      reader.readAsText(file);
    });
  };

  // Fast text extraction from regular files
  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('File reading timeout'));
      }, 5000); // 5 second timeout

      const reader = new FileReader();
      reader.onload = (e) => {
        clearTimeout(timeoutId);
        try {
          const content = e.target.result;
          // Limit content to first 5000 characters for faster processing
          resolve(content.substring(0, 5000));
        } catch (error) {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  };

  // Enhanced content validation for specific policy document types
  const validateFileContent = async (file) => {
    try {
      const content = await extractTextContent(file);
      const cleanedContent = cleanExtractedText(content);
      const normalizedContent = cleanedContent.toLowerCase();

      console.log(`🧠 Advanced NLP Analysis: ${normalizedContent.length} characters`);

      // Initialize NLP processors
      const structureAnalyzer = new DocumentStructureAnalyzer();
      const nerProcessor = new RegulationNER();
      const relationshipExtractor = new RelationshipExtractor();
      const complianceScorer = new ComplianceScorer();

      // Quick length check - now just warn but don't reject
      if (normalizedContent.length < 200) {
        console.warn('Document is quite short, but proceeding with analysis');
      }

      // 1. Document Structure Analysis
      const documentStructure = structureAnalyzer.analyzeStructure(cleanedContent);
      console.log(`📊 Structure Analysis: ${documentStructure.sections.length} sections, ${documentStructure.lists.length} lists`);

      // 2. Named Entity Recognition
      const entityAnalysis = nerProcessor.extractEntities(normalizedContent);
      console.log(`🏷️ NER Analysis: ${entityAnalysis.entities.length} entity types, score: ${entityAnalysis.totalScore}`);

      // 3. Relationship Extraction
      const relationshipAnalysis = relationshipExtractor.extractRelationships(normalizedContent);
      console.log(`🔗 Relationship Analysis: ${relationshipAnalysis.relationships.length} relationships, score: ${relationshipAnalysis.totalScore}`);

      // Comprehensive policy keywords categorized by document type
      const policyCategories = {
        // Privacy Policies & Data Protection Procedures
        privacyDataProtection: {
          keywords: ['privacy policy', 'data protection', 'personal information', 'personal data',
                   'data collection', 'data processing', 'consent', 'gdpr', 'ccpa', 'privacy notice',
                   'data subject', 'controller', 'processor', 'privacy rights', 'data retention'],
          weight: 4
        },

        // Security Policies & Information Governance
        securityGovernance: {
          keywords: ['security policy', 'information security', 'cybersecurity', 'security controls',
                   'access control', 'authentication', 'authorization', 'encryption', 'vulnerability',
                   'threat', 'security incident', 'security breach', 'iso 27001', 'nist'],
          weight: 4
        },

        // Employee Handbooks & Code of Conduct
        employeeConduct: {
          keywords: ['employee handbook', 'code of conduct', 'workplace policy', 'employee rights',
                   'employment policy', 'workplace behavior', 'harassment', 'discrimination',
                   'disciplinary action', 'workplace ethics', 'employee responsibilities'],
          weight: 3
        },

        // Compliance Procedures & Regulatory Policies
        complianceRegulatory: {
          keywords: ['compliance policy', 'regulatory compliance', 'audit', 'compliance framework',
                   'regulatory requirements', 'sox', 'hipaa', 'pci dss', 'compliance monitoring',
                   'regulatory reporting', 'compliance officer', 'regulatory authority'],
          weight: 4
        },

        // Risk Management & Incident Response Plans
        riskIncident: {
          keywords: ['risk management', 'incident response', 'business continuity', 'disaster recovery',
                   'risk assessment', 'risk mitigation', 'incident handling', 'emergency response',
                   'crisis management', 'risk register', 'incident report'],
          weight: 3
        },

        // IT Policies & Acceptable Use Guidelines
        itAcceptableUse: {
          keywords: ['it policy', 'acceptable use', 'technology policy', 'computer use policy',
                   'internet policy', 'email policy', 'software policy', 'network security',
                   'system administration', 'user access', 'password policy'],
          weight: 3
        },

        // General policy terms
        general: {
          keywords: ['policy', 'procedure', 'guideline', 'standard', 'protocol', 'framework',
                   'governance', 'compliance', 'requirement', 'regulation', 'implementation',
                   'monitoring', 'review', 'approval', 'effective date', 'version control'],
          weight: 2
        }
      };

      let totalScore = 0;
      let foundKeywords = [];
      let detectedCategories = [];

      // Analyze content for each category
      for (const [categoryName, category] of Object.entries(policyCategories)) {
        let categoryScore = 0;
        let categoryKeywords = [];

        for (const keyword of category.keywords) {
          if (normalizedContent.includes(keyword)) {
            const count = (normalizedContent.match(new RegExp(keyword, 'g')) || []).length;
            const keywordScore = count * category.weight * (keyword.length > 10 ? 1.5 : 1);
            categoryScore += keywordScore;
            categoryKeywords.push(keyword);
            foundKeywords.push(keyword);
          }
        }

        if (categoryScore > 0) {
          totalScore += categoryScore;
          detectedCategories.push({
            category: categoryName,
            score: categoryScore,
            keywords: categoryKeywords
          });
        }
      }

      // Quick rejection for obvious non-policy content
      const nonPolicyTerms = [
        'invoice', 'receipt', 'bill', 'purchase order', 'financial statement',
        'menu', 'recipe', 'cookbook', 'story', 'novel', 'fiction', 'movie',
        'game', 'entertainment', 'music', 'sports', 'news article', 'blog'
      ];

      for (const term of nonPolicyTerms) {
        if (normalizedContent.includes(term)) {
          return {
            isValid: false,
            reason: `This appears to be a ${term} document rather than a policy document.`,
            details: { contentLength: normalizedContent.length, keywordScore: totalScore, foundKeywords }
          };
        }
      }

      // Early success for strong policy indicators
      const strongIndicators = [
        'privacy policy', 'security policy', 'employee handbook', 'code of conduct',
        'compliance policy', 'data protection policy', 'acceptable use policy'
      ];

      for (const indicator of strongIndicators) {
        if (normalizedContent.includes(indicator)) {
          return {
            isValid: true,
            reason: '',
            details: {
              contentLength: normalizedContent.length,
              keywordScore: totalScore,
              foundKeywords: foundKeywords.slice(0, 15),
              detectedCategories,
              confidence: Math.min(100, totalScore * 2),
              primaryType: indicator
            }
          };
        }
      }

      // Determine minimum score based on content length
      let minimumScore = normalizedContent.length > 2000 ? 20 : 15;
      if (normalizedContent.length < 1000) minimumScore = 10;

      // 4. Compliance Scoring
      const complianceAnalysis = complianceScorer.calculateComplianceScore(
        normalizedContent,
        entityAnalysis,
        relationshipAnalysis
      );
      console.log(`⚖️ Compliance Score: ${complianceAnalysis.score}%, ${complianceAnalysis.violations.length} violations`);

      // Advanced scoring with NLP metrics
      const structureScore = documentStructure.sections.length * 5 + documentStructure.lists.length * 2;
      const nlpScore = entityAnalysis.totalScore + relationshipAnalysis.totalScore;
      const combinedScore = totalScore + structureScore + (nlpScore * 0.5);

      // Dynamic threshold based on document complexity
      if (documentStructure.sections.length > 5) minimumScore -= 5; // Well-structured docs get bonus
      if (entityAnalysis.totalScore > 20) minimumScore -= 5; // High entity content gets bonus

      console.log(`📊 Advanced Analysis: Combined=${Math.round(combinedScore)}, Required=${minimumScore}, Compliance=${complianceAnalysis.score}%`);

      if (combinedScore < minimumScore && complianceAnalysis.score < 60) {
        return {
          isValid: false,
          reason: `Advanced NLP analysis insufficient. Score: ${Math.round(combinedScore)}/${minimumScore}, Compliance: ${complianceAnalysis.score}%. Found: ${foundKeywords.slice(0, 8).join(', ') || 'none'}.`,
          details: {
            contentLength: normalizedContent.length,
            keywordScore: totalScore,
            nlpScore: Math.round(nlpScore),
            structureScore: structureScore,
            combinedScore: Math.round(combinedScore),
            foundKeywords: foundKeywords.slice(0, 15),
            detectedCategories,
            documentStructure: {
              sections: documentStructure.sections.length,
              lists: documentStructure.lists.length,
              tables: documentStructure.tables.length
            },
            entityAnalysis: {
              totalEntities: entityAnalysis.entities.length,
              score: entityAnalysis.totalScore
            },
            relationshipAnalysis: {
              totalRelationships: relationshipAnalysis.relationships.length,
              highRiskCount: relationshipAnalysis.relationships.filter(r => r.riskLevel === 'high').length
            },
            complianceAnalysis,
            suggestion: 'Upload comprehensive policy documents with clear structure, entity definitions, and compliance requirements.'
          }
        };
      }

      return {
        isValid: true,
        reason: '',
        details: {
          contentLength: normalizedContent.length,
          keywordScore: totalScore,
          nlpScore: Math.round(nlpScore),
          structureScore: structureScore,
          combinedScore: Math.round(combinedScore),
          foundKeywords: foundKeywords.slice(0, 15),
          detectedCategories,
          documentStructure: {
            sections: documentStructure.sections.length,
            lists: documentStructure.lists.length,
            tables: documentStructure.tables.length,
            sectionTitles: documentStructure.sections.map(s => s.title).slice(0, 8)
          },
          entityAnalysis: {
            totalEntities: entityAnalysis.entities.length,
            score: entityAnalysis.totalScore,
            categories: entityAnalysis.entities.map(e => ({ category: e.category, count: e.count }))
          },
          relationshipAnalysis: {
            totalRelationships: relationshipAnalysis.relationships.length,
            highRiskCount: relationshipAnalysis.relationships.filter(r => r.riskLevel === 'high').length,
            types: [...new Set(relationshipAnalysis.relationships.map(r => r.type))]
          },
          complianceAnalysis,
          confidence: Math.min(100, Math.round((combinedScore / minimumScore) * 60 + complianceAnalysis.score * 0.4)),
          primaryType: detectedCategories.length > 0 ? detectedCategories[0].category : 'general policy',
          analysisTimestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Content validation error:', error);
      return {
        isValid: false,
        reason: `Error analyzing document: ${error.message}. Please ensure the file is a readable policy document.`
      };
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = async (selectedFile) => {
    setIsValidatingFile(true);

    // Check file type first
    const allowedTypes = ['application/pdf', 'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain'];

    if (!allowedTypes.includes(selectedFile.type)) {
      setInvalidFileReason('Invalid file type. Please upload PDF, Word document (.doc/.docx), or text file.');
      setShowInvalidFilePopup(true);
      setIsValidatingFile(false);
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setInvalidFileReason('File too large. Please upload a file smaller than 10MB.');
      setShowInvalidFilePopup(true);
      setIsValidatingFile(false);
      return;
    }

    // Validate content for policy documents
    try {
      const validation = await validateFileContent(selectedFile);

      if (!validation.isValid) {
        setInvalidFileReason(validation.reason);
        setValidationDetails(validation.details);
        setShowInvalidFilePopup(true);
        setIsValidatingFile(false);
        return;
      }

      // Store validation details for successful validation
      setValidationDetails(validation.details);
      setFile(selectedFile);
    } catch (error) {
      console.error('File validation error:', error);
      setInvalidFileReason(`Error validating file: ${error.message}. Please ensure the file is readable and try again.`);
      setValidationDetails(null);
      setShowInvalidFilePopup(true);
    }

    setIsValidatingFile(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => {
      const currentFrameworks = Array.isArray(prev) ? prev : [];
      return currentFrameworks.includes(frameworkId) 
        ? currentFrameworks.filter(id => id !== frameworkId)
        : [...currentFrameworks, frameworkId];
    });
  };

  const handleIndustryChange = (industryId) => {
    setSelectedIndustry(industryId);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if (!selectedIndustry) {
      alert('Please select your industry sector');
      return;
    }

    const frameworksToUse = Array.isArray(selectedFrameworks) ? selectedFrameworks : [];
    if (frameworksToUse.length === 0) {
      alert('Please select at least one regulatory framework');
      return;
    }

    try {
      await onUpload({
        file,
        industry: selectedIndustry,
        frameworks: frameworksToUse
      });
      
      // Reset form
      setFile(null);
      setSelectedIndustry('');
      setSelectedFrameworks([]);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
          <p className="text-gray-600">Select your policy document for analysis</p>
        </div>
      </div>
      
      {/* File Upload Area */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Policy Document
        </label>
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : file 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isValidatingFile}
          />
          
          {isValidatingFile ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">⚡ Fast Document Analysis</p>
                <p className="text-sm text-gray-600">Processing content in seconds...</p>
                <p className="text-xs text-blue-600 mt-1">Optimized for speed • Smart policy detection</p>
              </div>
            </div>
          ) : file ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{Math.round(file.size / 1024)} KB • Policy Document Validated ✓</p>
                {validationDetails && (
                  <div className="text-xs text-green-600 mt-1 space-y-1">
                    <div>
                      🧠 NLP Analysis: {validationDetails.confidence}% confidence • {validationDetails.foundKeywords?.length || 0} keywords
                    </div>
                    {validationDetails.combinedScore && (
                      <div>
                        📊 Combined Score: {validationDetails.combinedScore} • ⚖️ Compliance: {validationDetails.complianceAnalysis?.score || 0}%
                      </div>
                    )}
                    {validationDetails.primaryType && (
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded">
                        {validationDetails.primaryType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Drop your policy document here or click to browse</p>
                <p className="text-sm text-gray-600">PDF, Word, or text files • Policy documents only</p>
                <p className="text-xs text-gray-500 mt-1">We validate that uploaded files are policy-related documents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Industry Selection - Professional Card Grid */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Industry Sector
        </label>
        <p className="text-sm text-gray-600 mb-4">Select your organization's primary industry</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className={`flex items-start p-4 border rounded-2xl cursor-pointer transition-all ${
                selectedIndustry === industry.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="industry"
                value={industry.id}
                checked={selectedIndustry === industry.id}
                onChange={() => handleIndustryChange(industry.id)}
                className="sr-only"
              />
              <div className="flex-shrink-0 mr-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedIndustry === industry.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <span className="text-xl">{industry.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold mb-1 ${
                  selectedIndustry === industry.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {industry.name}
                </h4>
                <p className={`text-sm ${
                  selectedIndustry === industry.id ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {industry.description}
                </p>
              </div>
              {selectedIndustry === industry.id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Regulatory Frameworks - Consistent Styling */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Regulatory Frameworks
        </label>
        <p className="text-sm text-gray-600 mb-4">Select frameworks to benchmark against (choose multiple)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
          {availableFrameworks.map((framework) => (
            <label 
              key={framework.id} 
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                selectedFrameworks.includes(framework.id) 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(framework.id)}
                onChange={() => handleFrameworkChange(framework.id)}
                className="mr-4 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <div className="flex-shrink-0 mr-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedFrameworks.includes(framework.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}>
                  <span className="text-sm">{framework.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold block ${
                  selectedFrameworks.includes(framework.id) ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {framework.name}
                </span>
                <span className={`text-sm ${
                  selectedFrameworks.includes(framework.id) ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {framework.region}
                </span>
              </div>
              {selectedFrameworks.includes(framework.id) && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          ))}
        </div>
        
        {/* Selected Frameworks Summary */}
        {selectedFrameworks.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-blue-900">
                {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFrameworks.map((frameworkId) => {
                const framework = availableFrameworks.find(f => f.id === frameworkId);
                return (
                  <span
                    key={frameworkId}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-xl"
                  >
                    {framework?.icon} {frameworkId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !file || !selectedIndustry || selectedFrameworks.length === 0}
        className="w-full bg-gradient-primary text-white text-lg font-semibold px-8 py-4 rounded-2xl btn-hover focus-ring disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {uploading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Document...
          </div>
        ) : (
          'Analyze Policy'
        )}
      </button>

      {/* Progress Indicator */}
      {progress && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-full mr-3 animate-ai-pulse"></div>
            <p className="text-blue-800 font-medium">{progress}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-red-500 rounded-full mr-3 mt-0.5"></div>
            <div>
              <p className="text-red-800 font-medium">Analysis Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invalid File Popup */}
      {showInvalidFilePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl animate-fadeInUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">❌ Document Analysis Failed</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{invalidFileReason}</p>

              {validationDetails && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 text-left">
                  <h4 className="font-semibold text-gray-700 mb-2">📊 Analysis Results:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Content Length:</span>
                      <span className="ml-2 font-medium">{validationDetails.contentLength} chars</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Policy Score:</span>
                      <span className="ml-2 font-medium">{validationDetails.keywordScore || 0}</span>
                    </div>
                    {validationDetails.keywordScore !== undefined && (
                      <div>
                        <span className="text-gray-600">Keyword Score:</span>
                        <span className="ml-2 font-medium">{validationDetails.keywordScore}</span>
                      </div>
                    )}
                    {validationDetails.nlpScore !== undefined && (
                      <div>
                        <span className="text-gray-600">NLP Score:</span>
                        <span className="ml-2 font-medium">{validationDetails.nlpScore}</span>
                      </div>
                    )}
                    {validationDetails.structureScore !== undefined && (
                      <div>
                        <span className="text-gray-600">Structure Score:</span>
                        <span className="ml-2 font-medium">{validationDetails.structureScore}</span>
                      </div>
                    )}
                    {validationDetails.combinedScore !== undefined && (
                      <div>
                        <span className="text-gray-600">Combined Score:</span>
                        <span className="ml-2 font-medium text-blue-600">{validationDetails.combinedScore}</span>
                      </div>
                    )}
                    {validationDetails.documentStructure && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Document Structure:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            📄 {validationDetails.documentStructure.sections} sections
                          </span>
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            📋 {validationDetails.documentStructure.lists} lists
                          </span>
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            📊 {validationDetails.documentStructure.tables} tables
                          </span>
                        </div>
                      </div>
                    )}
                    {validationDetails.entityAnalysis && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Entity Analysis:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            🏷️ {validationDetails.entityAnalysis.totalEntities} entities
                          </span>
                          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            📈 Score: {validationDetails.entityAnalysis.score}
                          </span>
                        </div>
                      </div>
                    )}
                    {validationDetails.relationshipAnalysis && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Relationship Analysis:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                            🔗 {validationDetails.relationshipAnalysis.totalRelationships} relationships
                          </span>
                          {validationDetails.relationshipAnalysis.highRiskCount > 0 && (
                            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                              ⚠️ {validationDetails.relationshipAnalysis.highRiskCount} high-risk
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {validationDetails.complianceAnalysis && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Compliance Analysis:</span>
                        <div className="mt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              ⚖️ Score: {validationDetails.complianceAnalysis.score}%
                            </span>
                            <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                              ⚠️ {validationDetails.complianceAnalysis.violations?.length || 0} violations
                            </span>
                          </div>
                          {validationDetails.complianceAnalysis.strengths?.length > 0 && (
                            <div className="text-xs text-green-600">
                              ✅ Strengths: {validationDetails.complianceAnalysis.strengths.slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {validationDetails.foundKeywords && validationDetails.foundKeywords.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Found Keywords:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {validationDetails.foundKeywords.slice(0, 8).map((keyword, index) => (
                            <span key={index} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {validationDetails.suggestion && (
                      <div className="col-span-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-xs">
                          💡 <strong>Suggestion:</strong> {validationDetails.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Expected Policy Documents:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Privacy Policies & Data Protection Procedures</li>
                  <li>• Security Policies & Information Governance</li>
                  <li>• Employee Handbooks & Code of Conduct</li>
                  <li>• Compliance Procedures & Regulatory Policies</li>
                  <li>• Risk Management & Incident Response Plans</li>
                  <li>• IT Policies & Acceptable Use Guidelines</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowInvalidFilePopup(false);
                    setValidationDetails(null);
                  }}
                  className="flex-1 bg-gradient-primary text-white px-6 py-3 rounded-2xl font-semibold btn-hover focus-ring transition-all"
                >
                  Try Another File
                </button>
                <button
                  onClick={() => {
                    setShowInvalidFilePopup(false);
                    setValidationDetails(null);
                    // Clear the file input
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 focus-ring transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
