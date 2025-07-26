/**
 * Comprehensive validation and performance test for document analysis
 */

import { DocumentParser, validateFile, extractText } from '../lib/documentParser.js';
import EnhancedComplianceAnalyzer from '../lib/enhancedComplianceAnalyzer.js';

class ValidationPerformanceTest {
  constructor() {
    this.results = {
      validationTests: [],
      extractionTests: [],
      analysisTests: [],
      performanceMetrics: {},
      overallScore: 0
    };
  }

  /**
   * Run comprehensive validation tests
   */
  async runValidationTests() {
    console.log('🧪 Running validation tests...');
    
    const tests = [
      {
        name: 'Valid PDF file simulation',
        test: () => {
          const mockFile = new File(['mock content'], 'test.pdf', { type: 'application/pdf' });
          return validateFile(mockFile);
        }
      },
      {
        name: 'Large file rejection',
        test: () => {
          const largeContent = 'x'.repeat(51 * 1024 * 1024); // 51MB
          const mockFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
          try {
            validateFile(mockFile);
            return false; // Should have thrown
          } catch (error) {
            return error.message.includes('exceeds 50MB limit');
          }
        }
      },
      {
        name: 'Empty file rejection',
        test: () => {
          const mockFile = new File([''], 'empty.pdf', { type: 'application/pdf' });
          try {
            validateFile(mockFile);
            return false; // Should have thrown
          } catch (error) {
            return error.message.includes('too small');
          }
        }
      },
      {
        name: 'Invalid extension rejection',
        test: () => {
          const mockFile = new File(['content'], 'test.exe', { type: 'application/octet-stream' });
          try {
            validateFile(mockFile);
            return false; // Should have thrown
          } catch (error) {
            return error.message.includes('Invalid file extension');
          }
        }
      }
    ];

    for (const test of tests) {
      const startTime = Date.now();
      try {
        const result = await test.test();
        const duration = Date.now() - startTime;
        
        this.results.validationTests.push({
          name: test.name,
          passed: !!result,
          duration,
          status: result ? 'PASS' : 'FAIL'
        });
        
        console.log(`✅ ${test.name}: PASS (${duration}ms)`);
      } catch (error) {
        const duration = Date.now() - startTime;
        this.results.validationTests.push({
          name: test.name,
          passed: false,
          duration,
          status: 'ERROR',
          error: error.message
        });
        
        console.log(`❌ ${test.name}: ERROR - ${error.message} (${duration}ms)`);
      }
    }
  }

  /**
   * Test text extraction performance
   */
  async runExtractionTests() {
    console.log('📄 Running extraction tests...');
    
    const tests = [
      {
        name: 'Text file extraction',
        test: async () => {
          const content = this.generateMockPolicyText(1000);
          const mockFile = new File([content], 'test.txt', { type: 'text/plain' });
          const result = await extractText(mockFile);
          return result && result.length > 500;
        }
      },
      {
        name: 'PDF extraction with fallback',
        test: async () => {
          const mockFile = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
          const result = await extractText(mockFile);
          return result && result.length > 100; // Should get mock content
        }
      },
      {
        name: 'Large text handling',
        test: async () => {
          const content = this.generateMockPolicyText(50000);
          const mockFile = new File([content], 'large.txt', { type: 'text/plain' });
          const result = await extractText(mockFile);
          return result && result.length > 10000;
        }
      }
    ];

    for (const test of tests) {
      const startTime = Date.now();
      try {
        const result = await Promise.race([
          test.test(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
        
        const duration = Date.now() - startTime;
        
        this.results.extractionTests.push({
          name: test.name,
          passed: !!result,
          duration,
          status: result ? 'PASS' : 'FAIL'
        });
        
        console.log(`✅ ${test.name}: PASS (${duration}ms)`);
      } catch (error) {
        const duration = Date.now() - startTime;
        this.results.extractionTests.push({
          name: test.name,
          passed: false,
          duration,
          status: error.message === 'Timeout' ? 'TIMEOUT' : 'ERROR',
          error: error.message
        });
        
        console.log(`❌ ${test.name}: ${error.message} (${duration}ms)`);
      }
    }
  }

  /**
   * Test analysis performance
   */
  async runAnalysisTests() {
    console.log('🤖 Running analysis tests...');
    
    const analyzer = new EnhancedComplianceAnalyzer();
    const mockText = this.generateMockPolicyText(5000);
    
    const tests = [
      {
        name: 'Basic policy analysis',
        test: async () => {
          const result = await analyzer.analyzePolicy(mockText, {
            industry: 'technology',
            frameworks: ['GDPR', 'CCPA']
          });
          return result && result.overallScore !== undefined && result.gaps;
        }
      },
      {
        name: 'Large document analysis',
        test: async () => {
          const largeText = this.generateMockPolicyText(50000);
          const result = await analyzer.analyzePolicy(largeText, {
            industry: 'financial',
            frameworks: ['SOX', 'PCI DSS']
          });
          return result && result.overallScore !== undefined;
        }
      },
      {
        name: 'Multi-framework analysis',
        test: async () => {
          const result = await analyzer.analyzePolicy(mockText, {
            industry: 'healthcare',
            frameworks: ['HIPAA', 'GDPR', 'SOX', 'ISO 27001']
          });
          return result && result.structuredAnalysis && result.structuredAnalysis.frameworkAnalysis;
        }
      }
    ];

    for (const test of tests) {
      const startTime = Date.now();
      try {
        const result = await Promise.race([
          test.test(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
        ]);
        
        const duration = Date.now() - startTime;
        
        this.results.analysisTests.push({
          name: test.name,
          passed: !!result,
          duration,
          status: result ? 'PASS' : 'FAIL',
          performance: {
            fast: duration < 10000,
            acceptable: duration < 20000,
            slow: duration >= 20000
          }
        });
        
        const perfLabel = duration < 10000 ? '🚀 FAST' : duration < 20000 ? '⚡ OK' : '🐌 SLOW';
        console.log(`✅ ${test.name}: PASS ${perfLabel} (${duration}ms)`);
      } catch (error) {
        const duration = Date.now() - startTime;
        this.results.analysisTests.push({
          name: test.name,
          passed: false,
          duration,
          status: error.message === 'Timeout' ? 'TIMEOUT' : 'ERROR',
          error: error.message
        });
        
        console.log(`❌ ${test.name}: ${error.message} (${duration}ms)`);
      }
    }
  }

  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics() {
    const allTests = [
      ...this.results.validationTests,
      ...this.results.extractionTests,
      ...this.results.analysisTests
    ];

    const passed = allTests.filter(t => t.passed).length;
    const total = allTests.length;
    const avgDuration = allTests.reduce((sum, t) => sum + t.duration, 0) / total;
    
    const validationAvg = this.results.validationTests.reduce((sum, t) => sum + t.duration, 0) / this.results.validationTests.length;
    const extractionAvg = this.results.extractionTests.reduce((sum, t) => sum + t.duration, 0) / this.results.extractionTests.length;
    const analysisAvg = this.results.analysisTests.reduce((sum, t) => sum + t.duration, 0) / this.results.analysisTests.length;

    this.results.performanceMetrics = {
      totalTests: total,
      passedTests: passed,
      successRate: Math.round((passed / total) * 100),
      averageDuration: Math.round(avgDuration),
      validationAverage: Math.round(validationAvg),
      extractionAverage: Math.round(extractionAvg),
      analysisAverage: Math.round(analysisAvg),
      overallGrade: this.calculateGrade(passed, total, avgDuration)
    };

    this.results.overallScore = this.results.performanceMetrics.successRate;
  }

  /**
   * Calculate overall grade
   */
  calculateGrade(passed, total, avgDuration) {
    const successRate = (passed / total) * 100;
    const speedBonus = avgDuration < 5000 ? 10 : avgDuration < 10000 ? 5 : 0;
    const score = successRate + speedBonus;

    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    return 'D';
  }

  /**
   * Generate mock policy text
   */
  generateMockPolicyText(minLength = 1000) {
    const sections = [
      'Data Collection: We collect personal information including name, email, and usage data.',
      'Data Usage: Information is used for service provision and analytics.',
      'User Rights: You have the right to access, rectify, and delete your data.',
      'Data Sharing: We may share data with trusted partners and service providers.',
      'Data Security: We implement encryption and security measures to protect your data.',
      'Data Retention: Data is retained for legitimate business purposes.',
      'International Transfers: Data may be transferred internationally with appropriate safeguards.',
      'Legal Basis: Processing is based on consent and legitimate interests.',
      'Cookies: We use cookies for analytics and personalization.',
      'Contact Information: Contact us at privacy@company.com for questions.'
    ];

    let text = '';
    while (text.length < minLength) {
      text += sections[Math.floor(Math.random() * sections.length)] + ' ';
    }
    
    return text.trim();
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        overallScore: this.results.overallScore,
        grade: this.results.performanceMetrics.overallGrade,
        totalTests: this.results.performanceMetrics.totalTests,
        passedTests: this.results.performanceMetrics.passedTests,
        averageSpeed: this.results.performanceMetrics.averageDuration
      },
      details: this.results,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    const failedTests = [
      ...this.results.validationTests,
      ...this.results.extractionTests,
      ...this.results.analysisTests
    ].filter(t => !t.passed);

    if (failedTests.length > 0) {
      recommendations.push('Address failing tests to improve system reliability');
    }

    if (this.results.performanceMetrics.analysisAverage > 15000) {
      recommendations.push('Consider optimizing analysis algorithms for better performance');
    }

    if (this.results.performanceMetrics.extractionAverage > 5000) {
      recommendations.push('Optimize text extraction process for faster document processing');
    }

    if (this.results.performanceMetrics.successRate < 90) {
      recommendations.push('Improve error handling and fallback mechanisms');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is performing well - maintain current optimization levels');
    }

    return recommendations;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting comprehensive validation and performance tests...');
    
    try {
      await this.runValidationTests();
      await this.runExtractionTests();
      await this.runAnalysisTests();
      
      this.calculatePerformanceMetrics();
      
      const report = this.generateReport();
      
      console.log('\n📊 Test Results Summary:');
      console.log(`Overall Score: ${report.summary.overallScore}% (${report.summary.grade})`);
      console.log(`Tests Passed: ${report.summary.passedTests}/${report.summary.totalTests}`);
      console.log(`Average Speed: ${report.summary.averageSpeed}ms`);
      
      if (report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.forEach(rec => console.log(`  • ${rec}`));
      }
      
      return report;
      
    } catch (error) {
      console.error('Test execution failed:', error);
      throw error;
    }
  }
}

// Export for use in tests
export default ValidationPerformanceTest;

// Run tests if called directly
if (typeof window !== 'undefined' && window.location.search.includes('run-tests')) {
  const tester = new ValidationPerformanceTest();
  tester.runAllTests().then(report => {
    console.log('Full test report:', report);
  }).catch(error => {
    console.error('Test failed:', error);
  });
}
