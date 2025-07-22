/**
 * ✅ PRIVACY POLICY GAP ANALYZER - TESTING & VALIDATION UTILITIES
 * 
 * This module provides comprehensive testing and benchmarking capabilities
 * for the enhanced privacy policy validation system.
 */

import { testDocumentValidation } from '../lib/gemini.js';

// ✅ 1. PRIVACY POLICY QUALITY BENCHMARKS
export const PRIVACY_POLICY_BENCHMARKS = {
  excellent: {
    minScore: 200,
    requiredSections: [
      'data collection', 'information we collect', 'how we use',
      'data sharing', 'third parties', 'your rights', 'user rights',
      'security', 'retention', 'contact us'
    ],
    description: 'Comprehensive privacy policy with all essential sections'
  },
  good: {
    minScore: 150,
    requiredSections: [
      'data collection', 'how we use', 'data sharing', 'your rights', 'security'
    ],
    description: 'Good privacy policy covering most important areas'
  },
  basic: {
    minScore: 100,
    requiredSections: [
      'data collection', 'how we use', 'privacy'
    ],
    description: 'Basic privacy policy with minimal required content'
  },
  inadequate: {
    minScore: 0,
    requiredSections: [],
    description: 'Insufficient privacy policy content'
  }
};

// ✅ 2. TEST DOCUMENT SAMPLES
export const TEST_DOCUMENTS = {
  validPrivacyPolicy: `
    Privacy Policy
    
    Effective Date: January 1, 2024
    Last Updated: March 15, 2024
    
    1. Information We Collect
    We collect personal information that you provide directly to us, including:
    - Name and contact information
    - Account credentials and preferences
    - Payment and billing information
    - Communications with our support team
    
    We also automatically collect information about your use of our services:
    - Device information and identifiers
    - Usage data and analytics
    - Location information
    - Cookies and tracking technologies
    
    2. How We Use Your Information
    We use your personal information for the following purposes:
    - Providing and improving our services
    - Processing transactions and payments
    - Communicating with you about our services
    - Personalizing your experience
    - Ensuring security and preventing fraud
    - Complying with legal obligations
    
    3. Data Sharing and Third Parties
    We may share your information with:
    - Service providers and business partners
    - Payment processors and financial institutions
    - Legal authorities when required by law
    - Other users with your consent
    
    We do not sell your personal information to third parties.
    
    4. Your Rights and Choices
    You have the following rights regarding your personal information:
    - Access and obtain a copy of your data
    - Correct inaccurate or incomplete information
    - Delete your personal information
    - Object to certain processing activities
    - Data portability and transfer
    - Withdraw consent where applicable
    
    5. Data Security
    We implement appropriate technical and organizational security measures:
    - Encryption of data in transit and at rest
    - Access controls and authentication
    - Regular security assessments
    - Employee training on data protection
    - Incident response procedures
    
    6. Data Retention
    We retain your personal information for as long as necessary to:
    - Provide our services to you
    - Comply with legal obligations
    - Resolve disputes and enforce agreements
    - Fulfill legitimate business purposes
    
    Specific retention periods vary by data type and are outlined in our detailed retention schedule.
    
    7. International Data Transfers
    Your information may be transferred to and processed in countries other than your own.
    We ensure appropriate safeguards are in place for such transfers.
    
    8. Changes to This Policy
    We may update this privacy policy from time to time. We will notify you of material changes.
    
    9. Contact Us
    If you have questions about this privacy policy, please contact us at:
    Email: privacy@example.com
    Address: 123 Privacy Street, Data City, DC 12345
  `,
  
  invalidResume: `
    John Smith
    Software Engineer
    
    Professional Experience:
    - 5 years of software development
    - Expert in Python, JavaScript, React
    - Led multiple successful projects
    
    Education:
    - Bachelor's in Computer Science
    - Master's in Software Engineering
    
    Skills:
    - Programming languages: Python, JavaScript, Java
    - Frameworks: React, Django, Flask
    - Databases: PostgreSQL, MongoDB
    
    References available upon request.
  `,
  
  weakPrivacyPolicy: `
    Privacy Policy
    
    We collect your information when you use our website.
    We use cookies to improve your experience.
    We may share your data with partners.
    Contact us if you have questions.
  `,
  
  marketingDocument: `
    Special Offer - Limited Time Only!
    
    Get 50% off your first purchase!
    
    Our amazing products are now available at incredible prices.
    Don't miss this exclusive deal - buy now and save big!
    
    Call now: 1-800-SPECIAL
    Visit our website for more promotional offers.
    
    Terms and conditions apply. Offer expires soon.
  `
};

// ✅ 3. VALIDATION TEST SUITE
export class PrivacyPolicyValidator {
  constructor() {
    this.testResults = [];
  }

  // Test document validation accuracy
  runValidationTests() {
    console.log('🧪 Running Privacy Policy Validation Test Suite...\n');
    
    const tests = [
      {
        name: 'Valid Privacy Policy',
        document: TEST_DOCUMENTS.validPrivacyPolicy,
        expectedValid: true,
        expectedType: 'privacy_policy'
      },
      {
        name: 'Invalid Resume Document',
        document: TEST_DOCUMENTS.invalidResume,
        expectedValid: false,
        expectedType: 'resume'
      },
      {
        name: 'Weak Privacy Policy',
        document: TEST_DOCUMENTS.weakPrivacyPolicy,
        expectedValid: true,
        expectedType: 'privacy_policy'
      },
      {
        name: 'Marketing Document',
        document: TEST_DOCUMENTS.marketingDocument,
        expectedValid: false,
        expectedType: 'marketing'
      }
    ];

    tests.forEach((test, index) => {
      console.log(`\n📋 Test ${index + 1}: ${test.name}`);
      console.log('─'.repeat(50));
      
      const result = testDocumentValidation(test.document);
      const passed = result.isValid === test.expectedValid;
      
      console.log(`✅ Expected Valid: ${test.expectedValid}`);
      console.log(`📊 Actual Valid: ${result.isValid}`);
      console.log(`🎯 Test Result: ${passed ? 'PASSED' : 'FAILED'}`);
      
      if (result.isValid) {
        console.log(`📈 Privacy Score: ${result.privacyScore || 0}`);
        console.log(`🏗️ Structure Score: ${result.structureScore || 0}`);
        console.log(`⭐ Quality Score: ${result.qualityScore || 0}`);
        console.log(`🔍 Found Sections: ${result.foundSections?.length || 0}`);
      }
      
      this.testResults.push({
        testName: test.name,
        passed: passed,
        expected: test.expectedValid,
        actual: result.isValid,
        details: result
      });
    });

    return this.generateTestReport();
  }

  // Generate comprehensive test report
  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('📊 PRIVACY POLICY VALIDATION TEST REPORT');
    console.log('='.repeat(60));
    console.log(`📈 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`🎯 Success Rate: ${successRate}%`);
    console.log('='.repeat(60));

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(test => {
          console.log(`  • ${test.testName}: Expected ${test.expected}, got ${test.actual}`);
        });
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: parseFloat(successRate),
      results: this.testResults
    };
  }

  // Benchmark privacy policy quality
  benchmarkPolicyQuality(text) {
    console.log('\n🏆 Privacy Policy Quality Benchmark Analysis');
    console.log('─'.repeat(50));
    
    const validation = testDocumentValidation(text);
    
    let qualityLevel = 'inadequate';
    let benchmark = PRIVACY_POLICY_BENCHMARKS.inadequate;
    
    // Determine quality level based on scores
    if (validation.finalScore >= PRIVACY_POLICY_BENCHMARKS.excellent.minScore) {
      qualityLevel = 'excellent';
      benchmark = PRIVACY_POLICY_BENCHMARKS.excellent;
    } else if (validation.finalScore >= PRIVACY_POLICY_BENCHMARKS.good.minScore) {
      qualityLevel = 'good';
      benchmark = PRIVACY_POLICY_BENCHMARKS.good;
    } else if (validation.finalScore >= PRIVACY_POLICY_BENCHMARKS.basic.minScore) {
      qualityLevel = 'basic';
      benchmark = PRIVACY_POLICY_BENCHMARKS.basic;
    }

    console.log(`🎯 Quality Level: ${qualityLevel.toUpperCase()}`);
    console.log(`📊 Total Score: ${validation.finalScore}/${PRIVACY_POLICY_BENCHMARKS.excellent.minScore}`);
    console.log(`📝 Description: ${benchmark.description}`);
    
    // Check section coverage
    const foundSections = validation.foundSections || [];
    const requiredSections = benchmark.requiredSections;
    const sectionCoverage = requiredSections.filter(section => 
      foundSections.some(found => found.includes(section))
    );
    
    console.log(`\n📋 Section Coverage: ${sectionCoverage.length}/${requiredSections.length}`);
    console.log(`✅ Found Sections: ${foundSections.join(', ')}`);
    
    if (sectionCoverage.length < requiredSections.length) {
      const missingSections = requiredSections.filter(section => 
        !foundSections.some(found => found.includes(section))
      );
      console.log(`❌ Missing Sections: ${missingSections.join(', ')}`);
    }

    return {
      qualityLevel,
      totalScore: validation.finalScore,
      maxScore: PRIVACY_POLICY_BENCHMARKS.excellent.minScore,
      sectionCoverage: {
        found: sectionCoverage.length,
        required: requiredSections.length,
        missing: requiredSections.filter(section => 
          !foundSections.some(found => found.includes(section))
        )
      },
      validation
    };
  }
}

// ✅ 4. QUICK TEST FUNCTIONS
export function quickValidationTest() {
  console.log('🚀 Quick Privacy Policy Validation Test\n');
  
  const validator = new PrivacyPolicyValidator();
  return validator.runValidationTests();
}

export function testPrivacyPolicyQuality(text) {
  const validator = new PrivacyPolicyValidator();
  return validator.benchmarkPolicyQuality(text);
}

// ✅ 5. PERFORMANCE TESTING
export function performanceTest() {
  console.log('⚡ Privacy Policy Validation Performance Test\n');
  
  const startTime = performance.now();
  const testDoc = TEST_DOCUMENTS.validPrivacyPolicy;
  
  // Run multiple validations to test performance
  for (let i = 0; i < 100; i++) {
    testDocumentValidation(testDoc);
  }
  
  const endTime = performance.now();
  const avgTime = (endTime - startTime) / 100;
  
  console.log(`📊 Average validation time: ${avgTime.toFixed(2)}ms`);
  console.log(`🚀 Validations per second: ${(1000 / avgTime).toFixed(0)}`);
  
  return {
    averageTime: avgTime,
    validationsPerSecond: 1000 / avgTime
  };
}

// Export main test function
export default PrivacyPolicyValidator;
