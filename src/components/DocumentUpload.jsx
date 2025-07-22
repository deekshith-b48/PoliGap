import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeDocument } from '../lib/gemini';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up PDF.js with local worker - no more CDN or CORS issues!
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
console.log('PDF.js configured with local worker');

function DocumentUpload({ onUpload, uploading, progress, error }) {
  const [file, setFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showInvalidFilePopup, setShowInvalidFilePopup] = useState(false);
  const [invalidFileReason, setInvalidFileReason] = useState('');
  const [isValidatingFile, setIsValidatingFile] = useState(false);
  const [validationDetails, setValidationDetails] = useState(null);
  
  // Multi-step processing states
  const [processingStep, setProcessingStep] = useState(null); // 'extracting', 'validating', 'analyzing', 'complete'
  const [extractedContent, setExtractedContent] = useState(null);
  const [extractionProgress, setExtractionProgress] = useState('');
  const [extractionDetails, setExtractionDetails] = useState(null);

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

  // Extract text content from different file types - Enhanced with better error handling
  const extractTextContent = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      // Check file size first (limit to 10MB for better performance)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Please upload files smaller than 10MB for optimal performance.');
      }

      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await extractPDFText(file);
      } else if (fileType.includes('text/') ||
                 fileType.includes('application/msword') ||
                 fileType.includes('application/vnd.openxmlformats-officedocument') ||
                 fileName.endsWith('.txt') || 
                 fileName.endsWith('.doc') ||
                 fileName.endsWith('.docx')) {
        return await extractTextFromFile(file);
      } else {
        throw new Error(`Unsupported file type: ${fileType || 'unknown'}. Please upload PDF, Word, or text files.`);
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('timeout')) {
        throw new Error('File processing timeout. Please try a smaller file or a different format.');
      } else if (error.message.includes('PDF')) {
        throw new Error('Unable to process PDF. Please ensure it\'s not password-protected and contains readable text.');
      } else {
        throw new Error(error.message || 'Unable to extract text from file');
      }
    }
  };

  // Simple but robust PDF text extraction
  const extractPDFText = async (file) => {
    console.log('Starting PDF text extraction...');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(new Error('PDF processing timeout'));
      }, 20000); // Reduced timeout

      reader.onload = async (e) => {
        try {
          clearTimeout(timeoutId);
          const arrayBuffer = e.target.result;

          console.log('Loading PDF document...');

          // Create loading task with basic configuration
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            verbosity: 0,
            disableFontFace: true,
            useSystemFonts: false
          });

          const pdf = await loadingTask.promise;
          console.log(`PDF loaded successfully: ${pdf.numPages} pages`);
          
          let allText = '';
          const maxPages = Math.min(pdf.numPages, 2); // Process first 2 pages only

          for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            try {
              console.log(`Processing page ${pageNum}...`);
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              
              const pageText = textContent.items
                .map(item => item.str || '')
                .join(' ')
                .trim();

              if (pageText.length > 5) {
                allText += pageText + '\n';
                console.log(`Page ${pageNum}: extracted ${pageText.length} characters`);
              }

              // Early exit if we have enough content
              if (allText.length > 1500) {
                console.log('Early exit: sufficient content extracted');
                break;
              }
            } catch (pageError) {
              console.warn(`Error on page ${pageNum}:`, pageError.message);
              // Continue with other pages
            }
          }

          // Clean up
          try {
            if (pdf && pdf.destroy) {
              pdf.destroy();
            }
          } catch (cleanupError) {
            console.warn('Cleanup error:', cleanupError);
          }

          if (allText.trim().length < 30) {
            reject(new Error('PDF contains no readable text or is image-based'));
          } else {
            const finalText = allText.trim();
            console.log(`Successfully extracted ${finalText.length} characters from PDF`);
            resolve(finalText);
          }

        } catch (error) {
          clearTimeout(timeoutId);
          console.error('PDF extraction error:', error);
          
          // Provide user-friendly error messages
          let errorMessage = 'PDF processing failed';
          if (error.message.includes('Invalid PDF')) {
            errorMessage = 'Invalid or corrupted PDF file';
          } else if (error.message.includes('password') || error.message.includes('encrypted')) {
            errorMessage = 'PDF is password-protected or encrypted';
          } else if (error.message.includes('worker')) {
            errorMessage = 'PDF worker loading failed - please try refreshing the page';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'PDF processing timeout - try a smaller file';
          }
          
          reject(new Error(errorMessage));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read PDF file'));
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(new Error('PDF reading was cancelled'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Enhanced text extraction from regular files
  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // Longer timeout for text files as they're usually quick
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timeout. Please try a smaller file.'));
      }, 8000);
      
      reader.onload = (e) => {
        try {
          clearTimeout(timeoutId);
          const content = e.target.result;
          
          if (!content || content.trim().length === 0) {
            reject(new Error('File appears to be empty or contains no readable text.'));
            return;
          }
          
          // Limit content to first 8000 characters for better processing
          // but ensure we get enough content for validation
          const processedContent = content.substring(0, 8000);
          
          console.log(`Extracted ${processedContent.length} characters from text file`);
          resolve(processedContent);
          
        } catch (error) {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to process file content: ${error.message}`));
        }
      };
      
      reader.onerror = (error) => {
        clearTimeout(timeoutId);
        console.error('FileReader error:', error);
        reject(new Error('Failed to read file. The file may be corrupted or in an unsupported format.'));
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(new Error('File reading was cancelled due to timeout.'));
      };
      
      reader.readAsText(file, 'UTF-8');
    });
  };

  // ==============================================
  // MULTI-STEP PROCESSING FUNCTIONS
  // ==============================================

  // STEP 1: Extract text content only
  const performTextExtraction = async (file) => {
    setProcessingStep('extracting');
    setExtractionProgress('🔍 Starting text extraction...');
    
    try {
      console.log(`STEP 1: Extracting text from ${file.name} (${Math.round(file.size / 1024)}KB)`);
      
      const startTime = Date.now();
      const content = await extractTextContent(file);
      const extractionTime = Date.now() - startTime;
      
      const details = {
        fileName: file.name,
        fileSize: Math.round(file.size / 1024),
        contentLength: content.length,
        extractionTime: extractionTime,
        fileType: file.type || 'unknown',
        wordsCount: content.split(/\s+/).length,
        linesCount: content.split('\n').length
      };
      
      console.log(`STEP 1 Complete: Extracted ${content.length} characters in ${extractionTime}ms`);
      
      setExtractedContent(content);
      setExtractionDetails(details);
      setExtractionProgress(`✅ Text extracted: ${content.length} characters (${details.wordsCount} words)`);
      setProcessingStep('extracted');
      
      return { content, details };
      
    } catch (error) {
      console.error('STEP 1 Failed:', error);
      setExtractionProgress(`❌ Extraction failed: ${error.message}`);
      throw error;
    }
  };

  // STEP 2: Validate content only (separated from file operations)
  const performContentValidation = async (content, fileDetails) => {
    setProcessingStep('validating');
    setExtractionProgress('🔍 Validating document content...');
    
    try {
      console.log(`STEP 2: Validating content (${content.length} characters)`);
      
      const startTime = Date.now();
      const validation = await validateExtractedContent(content, fileDetails);
      const validationTime = Date.now() - startTime;
      
      console.log(`STEP 2 Complete: Validation completed in ${validationTime}ms - ${validation.isValid ? 'VALID' : 'INVALID'}`);
      
      if (!validation.isValid) {
        setExtractionProgress(`❌ Validation failed: ${validation.reason}`);
        setValidationDetails(validation.details);
        setInvalidFileReason(validation.reason);
        setShowInvalidFilePopup(true);
        setProcessingStep(null);
        return validation;
      }
      
      setExtractionProgress(`✅ Document validated: ${validation.details.documentType} (Score: ${validation.details.keywordScore})`);
      setProcessingStep('validated');
      
      return validation;
      
    } catch (error) {
      console.error('STEP 2 Failed:', error);
      setExtractionProgress(`❌ Validation failed: ${error.message}`);
      throw error;
    }
  };

  // STEP 3: Perform AI analysis
  const performAIAnalysis = async (content, industry, frameworks) => {
    setProcessingStep('analyzing');
    setExtractionProgress('🤖 Starting AI analysis...');
    
    try {
      console.log(`STEP 3: AI analysis starting`);
      
      const startTime = Date.now();
      const results = await analyzeDocument(content, {
        industry: industry,
        frameworks: frameworks
      });
      const analysisTime = Date.now() - startTime;
      
      console.log(`STEP 3 Complete: AI analysis completed in ${analysisTime}ms`);
      
      setExtractionProgress(`✅ Analysis complete: ${results.totalGaps} gaps identified`);
      setProcessingStep('complete');
      
      return results;
      
    } catch (error) {
      console.error('STEP 3 Failed:', error);
      setExtractionProgress(`❌ AI analysis failed: ${error.message}`);
      throw error;
    }
  };

  // Content validation function (works on extracted content, not file)
  const validateExtractedContent = async (content, fileDetails) => {
    const normalizedContent = content.toLowerCase();

    // Quick length check with more reasonable minimum
    if (normalizedContent.length < 200) {
      return {
        isValid: false,
        reason: 'Document too short - Policy documents should contain substantial content (minimum 200 characters).',
        details: { 
          contentLength: normalizedContent.length, 
          keywordScore: 0, 
          foundKeywords: [],
          documentType: 'insufficient_content'
        }
      };
    }

    // Enhanced keyword detection for policy documents and official documents
    const quickPolicyKeywords = [
      'policy', 'privacy', 'security', 'compliance', 'procedure', 'regulation',
      'gdpr', 'hipaa', 'data protection', 'information', 'personal information',
      'google', 'collect', 'use', 'share', 'cookies', 'services', 'terms of service',
      'code of conduct', 'governance', 'framework', 'standard', 'guideline',
      'sox', 'pci dss', 'iso 27001', 'ccpa', 'ferpa', 'glba', 'audit',
      'risk management', 'incident response', 'business continuity', 'disaster recovery',
      'employee handbook', 'hr policy', 'it policy', 'security policy'
    ];

    // Enhanced detection for inappropriate documents  
    const quickNonPolicyKeywords = ['invoice', 'receipt', 'menu', 'recipe', 'story', 'novel', 'fiction'];
    const resumeKeywords = ['resume', 'curriculum vitae', 'cv', 'experience:', 'education:', 'skills:', 'achievements:', 'references:', 'objective:', 'career summary', 'work experience', 'professional experience', 'employment history', 'phone:', 'email:', 'address:', 'linkedin', 'github', 'portfolio', 'bachelor', 'master', 'degree', 'university', 'college', 'gpa', 'intern', 'internship', 'volunteer', 'certification', 'award'];
    const personalDocKeywords = ['dear hiring manager', 'cover letter', 'application for', 'i am writing to', 'personal statement', 'autobiography', 'diary', 'journal', 'letter to', 'birth certificate', 'passport', 'driver license', 'social security'];
    const academicKeywords = ['abstract', 'introduction', 'methodology', 'results', 'conclusion', 'bibliography', 'references cited', 'thesis', 'dissertation', 'research paper', 'literature review', 'hypothesis', 'experiment', 'data analysis'];
    const marketingKeywords = ['brochure', 'flyer', 'advertisement', 'promotional', 'marketing campaign', 'product catalog', 'price list', 'sales pitch', 'marketing strategy'];

    let policyScore = 0;
    let foundKeywords = [];
    let resumeScore = 0;
    let personalScore = 0;
    let academicScore = 0;
    let marketingScore = 0;

    // Check for resume/CV content
    for (const keyword of resumeKeywords) {
      if (normalizedContent.includes(keyword)) {
        resumeScore += 2;
        if (resumeScore >= 8) {
          return {
            isValid: false,
            reason: "Looks like you've uploaded your resume! While we're sure you're amazing, we're here to analyze policy documents. We hope that your resume would also be something we could speak about :-)",
            details: { 
              contentLength: normalizedContent.length, 
              keywordScore: policyScore, 
              foundKeywords: [],
              documentType: 'resume'
            }
          };
        }
      }
    }

    // Check for personal documents
    for (const keyword of personalDocKeywords) {
      if (normalizedContent.includes(keyword)) {
        personalScore += 2;
        if (personalScore >= 6) {
          return {
            isValid: false,
            reason: "This seems to be a personal document! While your personal story matters, we're specialized in policy analysis. Maybe save the personal touch for after we help you with compliance? :-)",
            details: { 
              contentLength: normalizedContent.length, 
              keywordScore: policyScore, 
              foundKeywords: [],
              documentType: 'personal'
            }
          };
        }
      }
    }

    // Check for academic documents
    for (const keyword of academicKeywords) {
      if (normalizedContent.includes(keyword)) {
        academicScore += 2;
        if (academicScore >= 8) {
          return {
            isValid: false,
            reason: "This appears to be an academic/research document! While we appreciate scholarly work, we're focused on policy compliance analysis. Perhaps your research could inform better policies? :-)",
            details: { 
              contentLength: normalizedContent.length, 
              keywordScore: policyScore, 
              foundKeywords: [],
              documentType: 'academic'
            }
          };
        }
      }
    }

    // Check for marketing documents
    for (const keyword of marketingKeywords) {
      if (normalizedContent.includes(keyword)) {
        marketingScore += 2;
        if (marketingScore >= 6) {
          return {
            isValid: false,
            reason: "This looks like marketing material! While your product might be fantastic, we're here to analyze policies, not promote them. Marketing compliance policies, however, are totally our thing! :-)",
            details: { 
              contentLength: normalizedContent.length, 
              keywordScore: policyScore, 
              foundKeywords: [],
              documentType: 'marketing'
            }
          };
        }
      }
    }

    // Fast string matching for policy content
    for (const keyword of quickPolicyKeywords) {
      if (normalizedContent.includes(keyword)) {
        policyScore += (keyword.length > 8) ? 3 : 2;
        foundKeywords.push(keyword);

        // Early success - if we find strong indicators, accept quickly
        if (policyScore >= 12 && (normalizedContent.includes('privacy policy') || 
            normalizedContent.includes('data protection') || 
            normalizedContent.includes('code of conduct') ||
            normalizedContent.includes('compliance'))) {
          return {
            isValid: true,
            reason: '',
            details: {
              contentLength: normalizedContent.length,
              keywordScore: policyScore,
              foundKeywords,
              confidence: Math.min(100, policyScore * 8),
              documentType: 'policy'
            }
          };
        }
      }
    }

    // Quick rejection for obvious non-policy content with quirky messages
    for (const keyword of quickNonPolicyKeywords) {
      if (normalizedContent.includes(keyword)) {
        const quirkMessages = {
          'invoice': "This appears to be an invoice! While we appreciate good bookkeeping, we're here for policy analysis. Maybe after we help with compliance, we can discuss payment policies? :-)",
          'receipt': "That's a receipt! While we love transparency in transactions, we specialize in policy transparency. How about uploading a financial policy instead? :-)",
          'menu': "Looks like a menu! While we're hungry for good policies, food menus aren't our appetite. Perhaps a workplace dining policy? :-)",
          'recipe': "That's a recipe! While we appreciate good ingredients, we're cooking up policy analysis. Maybe a food safety policy would be more our flavor? :-)",
          'story': "This seems to be a story! While we love a good narrative, we're more into policy plots. Corporate storytelling policies are totally our genre though! :-)",
          'novel': "That appears to be a novel! While we admire creativity, we're novelists of compliance. How about a creative writing policy for your workplace? :-)",
          'fiction': "This looks like fiction! While imagination is wonderful, we deal in policy reality. Though fictional scenarios in risk assessments are quite real to us! :-)"
        };
        
        return {
          isValid: false,
          reason: quirkMessages[keyword] || `This appears to be a ${keyword} document rather than a policy document. We're specialists in policy analysis - let's stick to what we do best! :-)`,
          details: { 
            contentLength: normalizedContent.length, 
            keywordScore: policyScore, 
            foundKeywords,
            documentType: keyword 
          }
        };
      }
    }

    // Enhanced final validation with better messaging
    if (policyScore < 10) {
      // Check if it might be a legitimate business document that's just not a policy
      const businessKeywords = ['contract', 'agreement', 'terms', 'conditions', 'legal', 'compliance', 'governance'];
      let businessScore = 0;
      
      for (const keyword of businessKeywords) {
        if (normalizedContent.includes(keyword)) {
          businessScore += 2;
        }
      }
      
      if (businessScore >= 4) {
        return {
          isValid: false,
          reason: "This appears to be a business document but not quite a policy document. We're looking for specific policies like privacy policies, security policies, HR policies, etc. Close, but not quite there yet! :-)",
          details: {
            contentLength: normalizedContent.length,
            keywordScore: policyScore,
            foundKeywords,
            suggestion: 'Try uploading documents with terms like: privacy policy, security policy, code of conduct, compliance framework, employee handbook, etc.',
            documentType: 'business_document'
          }
        };
      }

      return {
        isValid: false,
        reason: `Document doesn't contain enough policy-related content. Found: ${foundKeywords.join(', ') || 'none'}. We're quite picky about policies - it's what makes us good at what we do! :-)`,
        details: {
          contentLength: normalizedContent.length,
          keywordScore: policyScore,
          foundKeywords,
          suggestion: 'Upload documents containing terms like: policy, privacy, security, compliance, procedure, governance, framework, etc.',
          documentType: 'unknown'
        }
      };
    }

    return {
      isValid: true,
      reason: '',
      details: {
        contentLength: normalizedContent.length,
        keywordScore: policyScore,
        foundKeywords,
        confidence: Math.min(100, policyScore * 10),
        documentType: 'policy'
      }
    };
  };

  // ==============================================
  // ORIGINAL VALIDATION FUNCTION (NOW DEPRECATED)
  // ==============================================

  // Enhanced content validation with better error handling
  const validateFileContent = async (file) => {
    try {
      console.log(`Starting validation for file: ${file.name} (${Math.round(file.size / 1024)}KB)`);
      
      const content = await extractTextContent(file);
      const normalizedContent = content.toLowerCase();

      console.log(`Extracted ${content.length} characters for validation`);

      // Quick length check with more reasonable minimum
      if (normalizedContent.length < 200) {
        return {
          isValid: false,
          reason: 'Document too short - Policy documents should contain substantial content (minimum 200 characters).',
          details: { 
            contentLength: normalizedContent.length, 
            keywordScore: 0, 
            foundKeywords: [],
            documentType: 'insufficient_content'
          }
        };
      }

      // Enhanced keyword detection for policy documents and official documents
      const quickPolicyKeywords = [
        'policy', 'privacy', 'security', 'compliance', 'procedure', 'regulation',
        'gdpr', 'hipaa', 'data protection', 'information', 'personal information',
        'google', 'collect', 'use', 'share', 'cookies', 'services', 'terms of service',
        'code of conduct', 'governance', 'framework', 'standard', 'guideline',
        'sox', 'pci dss', 'iso 27001', 'ccpa', 'ferpa', 'glba', 'audit',
        'risk management', 'incident response', 'business continuity', 'disaster recovery',
        'employee handbook', 'hr policy', 'it policy', 'security policy'
      ];

      // Enhanced detection for inappropriate documents
      const quickNonPolicyKeywords = [
        'invoice', 'receipt', 'menu', 'recipe', 'story', 'novel', 'fiction'
      ];

      // Resume and CV detection keywords
      const resumeKeywords = [
        'resume', 'curriculum vitae', 'cv', 'experience:', 'education:', 
        'skills:', 'achievements:', 'references:', 'objective:', 'career summary',
        'work experience', 'professional experience', 'employment history',
        'phone:', 'email:', 'address:', 'linkedin', 'github', 'portfolio',
        'bachelor', 'master', 'degree', 'university', 'college', 'gpa',
        'intern', 'internship', 'volunteer', 'certification', 'award'
      ];

      // Personal document keywords
      const personalDocKeywords = [
        'dear hiring manager', 'cover letter', 'application for', 'i am writing to',
        'personal statement', 'autobiography', 'diary', 'journal', 'letter to',
        'birth certificate', 'passport', 'driver license', 'social security'
      ];

      // Academic/research document keywords  
      const academicKeywords = [
        'abstract', 'introduction', 'methodology', 'results', 'conclusion',
        'bibliography', 'references cited', 'thesis', 'dissertation', 'research paper',
        'literature review', 'hypothesis', 'experiment', 'data analysis'
      ];

      // Marketing/sales document keywords
      const marketingKeywords = [
        'brochure', 'flyer', 'advertisement', 'promotional', 'marketing campaign',
        'product catalog', 'price list', 'sales pitch', 'marketing strategy'
      ];

      let policyScore = 0;
      let foundKeywords = [];
      let resumeScore = 0;
      let personalScore = 0;
      let academicScore = 0;
      let marketingScore = 0;

      // Check for resume/CV content
      for (const keyword of resumeKeywords) {
        if (normalizedContent.includes(keyword)) {
          resumeScore += 2;
          if (resumeScore >= 8) {
            return {
              isValid: false,
              reason: "Looks like you've uploaded your resume! While we're sure you're amazing, we're here to analyze policy documents. We hope that your resume would also be something we could speak about :-)",
              details: { 
                contentLength: normalizedContent.length, 
                keywordScore: policyScore, 
                foundKeywords: [],
                documentType: 'resume'
              }
            };
          }
        }
      }

      // Check for personal documents
      for (const keyword of personalDocKeywords) {
        if (normalizedContent.includes(keyword)) {
          personalScore += 2;
          if (personalScore >= 6) {
            return {
              isValid: false,
              reason: "This seems to be a personal document! While your personal story matters, we're specialized in policy analysis. Maybe save the personal touch for after we help you with compliance? :-)",
              details: { 
                contentLength: normalizedContent.length, 
                keywordScore: policyScore, 
                foundKeywords: [],
                documentType: 'personal'
              }
            };
          }
        }
      }

      // Check for academic documents
      for (const keyword of academicKeywords) {
        if (normalizedContent.includes(keyword)) {
          academicScore += 2;
          if (academicScore >= 8) {
            return {
              isValid: false,
              reason: "This appears to be an academic/research document! While we appreciate scholarly work, we're focused on policy compliance analysis. Perhaps your research could inform better policies? :-)",
              details: { 
                contentLength: normalizedContent.length, 
                keywordScore: policyScore, 
                foundKeywords: [],
                documentType: 'academic'
              }
            };
          }
        }
      }

      // Check for marketing documents
      for (const keyword of marketingKeywords) {
        if (normalizedContent.includes(keyword)) {
          marketingScore += 2;
          if (marketingScore >= 6) {
            return {
              isValid: false,
              reason: "This looks like marketing material! While your product might be fantastic, we're here to analyze policies, not promote them. Marketing compliance policies, however, are totally our thing! :-)",
              details: { 
                contentLength: normalizedContent.length, 
                keywordScore: policyScore, 
                foundKeywords: [],
                documentType: 'marketing'
              }
            };
          }
        }
      }

      // Fast string matching for policy content
      for (const keyword of quickPolicyKeywords) {
        if (normalizedContent.includes(keyword)) {
          policyScore += (keyword.length > 8) ? 3 : 2; // Longer keywords get higher weight
          foundKeywords.push(keyword);

          // Early success - if we find strong indicators, accept quickly
          if (policyScore >= 12 && (normalizedContent.includes('privacy policy') || 
              normalizedContent.includes('data protection') || 
              normalizedContent.includes('code of conduct') ||
              normalizedContent.includes('compliance'))) {
            return {
              isValid: true,
              reason: '',
              details: {
                contentLength: normalizedContent.length,
                keywordScore: policyScore,
                foundKeywords,
                confidence: Math.min(100, policyScore * 8),
                documentType: 'policy'
              }
            };
          }
        }
      }

      // Quick rejection for obvious non-policy content with quirky messages
      for (const keyword of quickNonPolicyKeywords) {
        if (normalizedContent.includes(keyword)) {
          const quirkMessages = {
            'invoice': "This appears to be an invoice! While we appreciate good bookkeeping, we're here for policy analysis. Maybe after we help with compliance, we can discuss payment policies? :-)",
            'receipt': "That's a receipt! While we love transparency in transactions, we specialize in policy transparency. How about uploading a financial policy instead? :-)",
            'menu': "Looks like a menu! While we're hungry for good policies, food menus aren't our appetite. Perhaps a workplace dining policy? :-)",
            'recipe': "That's a recipe! While we appreciate good ingredients, we're cooking up policy analysis. Maybe a food safety policy would be more our flavor? :-)",
            'story': "This seems to be a story! While we love a good narrative, we're more into policy plots. Corporate storytelling policies are totally our genre though! :-)",
            'novel': "That appears to be a novel! While we admire creativity, we're novelists of compliance. How about a creative writing policy for your workplace? :-)",
            'fiction': "This looks like fiction! While imagination is wonderful, we deal in policy reality. Though fictional scenarios in risk assessments are quite real to us! :-)"
          };
          
          return {
            isValid: false,
            reason: quirkMessages[keyword] || `This appears to be a ${keyword} document rather than a policy document. We're specialists in policy analysis - let's stick to what we do best! :-)`,
            details: { 
              contentLength: normalizedContent.length, 
              keywordScore: policyScore, 
              foundKeywords,
              documentType: keyword 
            }
          };
        }
      }

      // Enhanced final validation with better messaging
      if (policyScore < 10) {
        // Check if it might be a legitimate business document that's just not a policy
        const businessKeywords = ['contract', 'agreement', 'terms', 'conditions', 'legal', 'compliance', 'governance'];
        let businessScore = 0;
        
        for (const keyword of businessKeywords) {
          if (normalizedContent.includes(keyword)) {
            businessScore += 2;
          }
        }
        
        if (businessScore >= 4) {
          return {
            isValid: false,
            reason: "This appears to be a business document but not quite a policy document. We're looking for specific policies like privacy policies, security policies, HR policies, etc. Close, but not quite there yet! :-)",
            details: {
              contentLength: normalizedContent.length,
              keywordScore: policyScore,
              foundKeywords,
              suggestion: 'Try uploading documents with terms like: privacy policy, security policy, code of conduct, compliance framework, employee handbook, etc.',
              documentType: 'business_document'
            }
          };
        }

        return {
          isValid: false,
          reason: `Document doesn't contain enough policy-related content. Found: ${foundKeywords.join(', ') || 'none'}. We're quite picky about policies - it's what makes us good at what we do! :-)`,
          details: {
            contentLength: normalizedContent.length,
            keywordScore: policyScore,
            foundKeywords,
            suggestion: 'Upload documents containing terms like: policy, privacy, security, compliance, procedure, governance, framework, etc.',
            documentType: 'unknown'
          }
        };
      }

      return {
        isValid: true,
        reason: '',
        details: {
          contentLength: normalizedContent.length,
          keywordScore: policyScore,
          foundKeywords,
          confidence: Math.min(100, policyScore * 10),
          documentType: 'policy'
        }
      };
    } catch (error) {
      console.error('Content validation error:', error);
      
      // Provide specific error messages based on the error type
      let userMessage = 'Error analyzing document';
      let documentType = 'error';
      
      if (error.message.includes('timeout')) {
        userMessage = 'File processing took too long. Please try a smaller file or different format.';
        documentType = 'timeout_error';
      } else if (error.message.includes('PDF')) {
        userMessage = 'Unable to process PDF file. Please ensure it\'s not password-protected and contains readable text.';
        documentType = 'pdf_error';
      } else if (error.message.includes('too large')) {
        userMessage = 'File is too large. Please upload files smaller than 10MB.';
        documentType = 'size_error';
      } else if (error.message.includes('Unsupported file type')) {
        userMessage = 'Unsupported file format. Please upload PDF, Word (.docx), or text (.txt) files.';
        documentType = 'format_error';
      } else {
        userMessage = `Unable to process file: ${error.message}`;
      }
      
      return {
        isValid: false,
        reason: userMessage,
        details: {
          contentLength: 0,
          keywordScore: 0,
          foundKeywords: [],
          documentType: documentType,
          originalError: error.message
        }
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
      console.log('🚀 Starting multi-step document processing...');
      
      // STEP 1: Extract text content
      const extractionResult = await performTextExtraction(file);
      
      // STEP 2: Validate content
      const validationResult = await performContentValidation(extractionResult.content, extractionResult.details);
      
      if (!validationResult.isValid) {
        // Validation failed - error already shown by performContentValidation
        return;
      }
      
      // STEP 3: Perform AI analysis
      const analysisResult = await performAIAnalysis(extractionResult.content, selectedIndustry, frameworksToUse);
      
      // Pass results to parent component
      await onUpload({
        file,
        industry: selectedIndustry,
        frameworks: frameworksToUse,
        extractionDetails: extractionResult.details,
        analysisResults: analysisResult
      });
      
      // Reset form
      setFile(null);
      setSelectedIndustry('');
      setSelectedFrameworks([]);
      setProcessingStep(null);
      setExtractedContent(null);
      setExtractionDetails(null);
      setExtractionProgress('');
      
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
                  <div className="text-xs text-green-600 mt-1">
                    Analysis Score: {validationDetails.confidence}% • Found {validationDetails.foundKeywords?.length || 0} policy terms
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

      {/* Multi-Step Progress Indicator */}
      {(processingStep || extractionProgress) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-blue-500 rounded-full mr-3 mt-0.5 animate-ai-pulse"></div>
            <div className="flex-1">
              <p className="text-blue-800 font-medium">{extractionProgress}</p>
              
              {/* Step Progress Indicators */}
              <div className="mt-3 flex space-x-2">
                <div className={`px-2 py-1 rounded text-xs ${
                  processingStep === 'extracting' || processingStep === 'extracted' || processingStep === 'validating' || processingStep === 'validated' || processingStep === 'analyzing' || processingStep === 'complete'
                    ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {processingStep === 'extracting' ? '🔄' : '✅'} Step 1: Extract
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  processingStep === 'validating' || processingStep === 'validated' || processingStep === 'analyzing' || processingStep === 'complete'
                    ? 'bg-green-100 text-green-700' : processingStep === 'extracted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {processingStep === 'validating' ? '🔄' : processingStep === 'validated' || processingStep === 'analyzing' || processingStep === 'complete' ? '✅' : '⏳'} Step 2: Validate
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  processingStep === 'analyzing' || processingStep === 'complete'
                    ? 'bg-green-100 text-green-700' : processingStep === 'validated' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {processingStep === 'analyzing' ? '🔄' : processingStep === 'complete' ? '✅' : '⏳'} Step 3: Analyze
                </div>
              </div>

              {/* Extraction Details */}
              {extractionDetails && (
                <div className="mt-3 text-xs text-blue-600 bg-blue-25 border border-blue-100 rounded p-2">
                  <strong>Extraction Details:</strong> {extractionDetails.fileSize}KB file • {extractionDetails.wordsCount} words • {extractionDetails.linesCount} lines • {extractionDetails.extractionTime}ms
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legacy Progress Indicator */}
      {progress && !processingStep && (
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
                    {validationDetails.documentType && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Detected Document Type:</span>
                        <span className="ml-2 font-medium capitalize text-red-600">{validationDetails.documentType.replace('_', ' ')}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Content Length:</span>
                      <span className="ml-2 font-medium">{validationDetails.contentLength} chars</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Policy Score:</span>
                      <span className="ml-2 font-medium">{validationDetails.keywordScore || 0}</span>
                    </div>
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
