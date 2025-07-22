#!/usr/bin/env node

/**
 * 🧪 PRIVACY POLICY VALIDATION SYSTEM TEST SCRIPT
 * 
 * This script tests the enhanced privacy policy validation system
 * to ensure accurate document classification and analysis.
 */

import { testDocumentValidation } from '../src/lib/gemini.js';

// Test Documents
const TEST_DOCUMENTS = {
  validPrivacyPolicy: `
    Privacy Policy - DataCorp Solutions
    
    Effective Date: January 1, 2024
    Last Updated: March 15, 2024
    
    1. Information We Collect
    We collect personal information that you provide directly to us, including your name, 
    email address, phone number, and other contact information. We also collect personal 
    data automatically through your use of our services, including device information, 
    IP addresses, usage data, and location information.
    
    2. How We Use Your Information
    We use your personal information to provide and improve our services, process 
    transactions, communicate with you, personalize your experience, ensure security, 
    prevent fraud, and comply with legal obligations under GDPR and CCPA.
    
    3. Data Sharing and Third Parties
    We may share your information with service providers, business partners, payment 
    processors, and legal authorities when required by law. We do not sell your 
    personal information to third parties for their direct marketing purposes.
    
    4. Your Rights and Choices
    Under data protection laws, you have the right to access, correct, delete, or 
    transfer your personal information. You can also object to certain processing 
    activities and withdraw consent where applicable.
    
    5. Data Security and Protection
    We implement appropriate technical and organizational security measures to protect 
    your personal information, including encryption, access controls, regular security 
    assessments, and employee training on data protection.
    
    6. Data Retention
    We retain your personal information for as long as necessary to provide our services, 
    comply with legal obligations, resolve disputes, and fulfill legitimate business 
    purposes. Specific retention periods vary by data type.
    
    7. Contact Us
    If you have questions about this privacy policy, please contact our Data Protection 
    Officer at privacy@datacorp.com or write to us at 123 Privacy Street, Data City, DC 12345.
  `,
  
  invalidResume: `
    John Smith
    Software Engineer | 5 Years Experience
    
    Professional Experience:
    Senior Software Developer at TechCorp (2020-2024)
    - Led development of web applications using React and Node.js
    - Managed team of 5 junior developers
    - Implemented agile development methodologies
    
    Software Engineer at StartupXYZ (2018-2020)
    - Developed mobile applications using React Native
    - Built RESTful APIs using Python and Django
    - Collaborated with product team on feature specifications
    
    Education:
    Master of Science in Computer Science - University of Technology (2018)
    Bachelor of Science in Software Engineering - State University (2016)
    
    Skills:
    Programming Languages: JavaScript, Python, Java, TypeScript
    Frameworks: React, Node.js, Django, Flask, React Native
    Databases: PostgreSQL, MongoDB, Redis
    Tools: Git, Docker, AWS, Jenkins, Jira
    
    Certifications:
    - AWS Certified Solutions Architect
    - Certified Scrum Master
    
    References available upon request.
  `,
  
  weakPrivacyPolicy: `
    Privacy Policy
    
    We collect information when you use our website.
    We use cookies to improve your experience.
    We may share data with partners.
    Contact us if you have questions at info@example.com.
  `,
  
  marketingDocument: `
    SPECIAL LIMITED TIME OFFER!
    
    Get 50% OFF Your First Purchase!
    
    Don't miss this incredible opportunity to save big on our amazing products!
    Our exclusive deals are available for a limited time only.
    
    ⭐ Premium Quality Products
    ⭐ Fast Shipping Worldwide  
    ⭐ 30-Day Money Back Guarantee
    ⭐ 24/7 Customer Support
    
    ACT NOW - This offer expires soon!
    
    Call 1-800-SPECIAL or visit our website for more promotional offers.
    Use code SAVE50 at checkout.
    
    Terms and conditions apply. Offer cannot be combined with other promotions.
  `
};

// Test Runner Class
class ValidationTestRunner {
  constructor() {
    this.results = [];
    this.startTime = null;
  }

  runTests() {
    console.log('🚀 Starting Privacy Policy Validation System Tests\n');
    console.log('='.repeat(80));
    
    this.startTime = Date.now();
    
    // Test Cases
    const testCases = [
      {
        name: 'Valid Comprehensive Privacy Policy',
        document: TEST_DOCUMENTS.validPrivacyPolicy,
        expectedValid: true,
        expectedType: 'privacy_policy',
        expectedMinScore: 150
      },
      {
        name: 'Invalid Resume Document',
        document: TEST_DOCUMENTS.invalidResume,
        expectedValid: false,
        expectedType: 'resume',
        expectedMaxScore: 50
      },
      {
        name: 'Weak Privacy Policy (Edge Case)',
        document: TEST_DOCUMENTS.weakPrivacyPolicy,
        expectedValid: false, // Should fail due to insufficient content
        expectedType: 'insufficient_content',
        expectedMaxScore: 30
      },
      {
        name: 'Marketing Document',
        document: TEST_DOCUMENTS.marketingDocument,
        expectedValid: false,
        expectedType: 'marketing',
        expectedMaxScore: 25
      }
    ];

    // Run each test
    testCases.forEach((testCase, index) => {
      this.runSingleTest(testCase, index + 1);
    });

    // Generate report
    this.generateReport();
  }

  runSingleTest(testCase, testNumber) {
    console.log(`\n📋 Test ${testNumber}: ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const result = testDocumentValidation(testCase.document);
      
      // Validate results
      const validationPassed = result.isValid === testCase.expectedValid;
      let scorePassed = true;
      
      if (testCase.expectedMinScore && result.finalScore < testCase.expectedMinScore) {
        scorePassed = false;
      }
      if (testCase.expectedMaxScore && result.finalScore > testCase.expectedMaxScore) {
        scorePassed = false;
      }
      
      const overallPassed = validationPassed && scorePassed;
      
      // Log results
      console.log(`📊 Expected Valid: ${testCase.expectedValid}`);
      console.log(`📊 Actual Valid: ${result.isValid}`);
      console.log(`📈 Final Score: ${result.finalScore || 0}`);
      console.log(`🎯 Validation Test: ${validationPassed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`🎯 Score Test: ${scorePassed ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`🏆 Overall Result: ${overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
      
      // Detailed breakdown for valid privacy policies
      if (result.isValid && result.isPrivacyPolicy) {
        console.log(`🔒 Privacy Policy Detected: Yes`);
        console.log(`📊 Privacy Score: ${result.privacyScore || 0}`);
        console.log(`🏗️ Structure Score: ${result.structureScore || 0}`);
        console.log(`⭐ Quality Score: ${result.qualityScore || 0}`);
        console.log(`🔍 Found Sections: ${result.foundSections?.length || 0}`);
        if (result.foundSections?.length > 0) {
          console.log(`📋 Sections: ${result.foundSections.join(', ')}`);
        }
      }
      
      // Store result
      this.results.push({
        testName: testCase.name,
        passed: overallPassed,
        validationPassed,
        scorePassed,
        expected: {
          valid: testCase.expectedValid,
          type: testCase.expectedType
        },
        actual: {
          valid: result.isValid,
          type: result.type,
          score: result.finalScore,
          confidence: result.confidence
        },
        details: result
      });
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      this.results.push({
        testName: testCase.name,
        passed: false,
        error: error.message
      });
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 PRIVACY POLICY VALIDATION TEST REPORT');
    console.log('='.repeat(80));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`📈 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`🎯 Success Rate: ${successRate}%`);
    console.log(`⏱️ Total Duration: ${duration}ms`);
    console.log(`⚡ Average per Test: ${(duration / totalTests).toFixed(2)}ms`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests Details:');
      this.results
        .filter(r => !r.passed)
        .forEach(test => {
          console.log(`  • ${test.testName}`);
          if (test.error) {
            console.log(`    Error: ${test.error}`);
          } else {
            console.log(`    Expected: Valid=${test.expected.valid}, Type=${test.expected.type}`);
            console.log(`    Actual: Valid=${test.actual.valid}, Type=${test.actual.type}, Score=${test.actual.score}`);
          }
        });
    }
    
    // Performance Assessment
    console.log('\n🚀 Performance Assessment:');
    if (duration < 1000) {
      console.log('✅ Excellent - Very fast validation');
    } else if (duration < 3000) {
      console.log('✅ Good - Acceptable validation speed');
    } else {
      console.log('⚠️ Slow - Consider optimization');
    }
    
    // Quality Assessment  
    console.log('\n🎯 Quality Assessment:');
    if (successRate >= 95) {
      console.log('✅ Excellent - High accuracy validation system');
    } else if (successRate >= 85) {
      console.log('✅ Good - Reliable validation system');
    } else if (successRate >= 70) {
      console.log('⚠️ Fair - Some improvements needed');
    } else {
      console.log('❌ Poor - Significant improvements required');
    }
    
    console.log('\n🎉 Privacy Policy Validation System Test Complete!');
    console.log('='.repeat(80));
  }
}

// Performance Test
function runPerformanceTest() {
  console.log('\n⚡ PERFORMANCE TEST');
  console.log('─'.repeat(30));
  
  const testDoc = TEST_DOCUMENTS.validPrivacyPolicy;
  const iterations = 50;
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    testDocumentValidation(testDoc);
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`📊 Iterations: ${iterations}`);
  console.log(`⏱️ Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`📈 Average Time: ${avgTime.toFixed(2)}ms per validation`);
  console.log(`🚀 Throughput: ${(1000 / avgTime).toFixed(0)} validations/second`);
  
  return {
    iterations,
    totalTime,
    avgTime,
    throughput: 1000 / avgTime
  };
}

// Main Execution
function main() {
  console.log('🔒 PRIVACY POLICY GAP ANALYZER - VALIDATION SYSTEM TESTING');
  console.log('Built with enhanced validation logic and strict content requirements');
  console.log(`Testing started at: ${new Date().toISOString()}\n`);
  
  // Run validation tests
  const testRunner = new ValidationTestRunner();
  testRunner.runTests();
  
  // Run performance test
  runPerformanceTest();
  
  console.log('\n💡 To use the validation system in your application:');
  console.log('   import { testDocumentValidation } from "./src/lib/gemini.js";');
  console.log('   const result = testDocumentValidation(documentText);');
  
  return testRunner.results;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { main, ValidationTestRunner, runPerformanceTest };
} else {
  // Run if called directly
  main();
}
