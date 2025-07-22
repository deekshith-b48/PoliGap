import { analyzeDocument, analyzeWithGemini } from './gemini.js';

/**
 * Tests the document analysis feature with a sample policy
 * @param {boolean} useLocalBenchmarkOnly - Whether to use only the local benchmarking (no API call)
 * @returns {Promise<Object>} The analysis results
 */
export async function testDocumentAnalysis(useLocalBenchmarkOnly = false) {
  console.log('Starting test document analysis...');
  
  // Sample privacy policy text for testing
  const samplePolicy = `
  PRIVACY POLICY
  
  Last Updated: June 1, 2023
  
  1. INTRODUCTION
  
  Our company ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
  
  2. INFORMATION WE COLLECT
  
  We may collect personal information that you voluntarily provide to us when you:
  - Register on our website
  - Place an order
  - Subscribe to our newsletter
  - Contact customer support
  
  The types of information we may collect include:
  - Name, email address, postal address, phone number
  - Payment information (processed securely through third-party providers)
  - Device information and usage data
  
  3. DATA MINIMIZATION AND RETENTION
  
  We collect only information that is adequate, relevant, and limited to what is necessary for the purposes for which it is processed. We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy.
  
  4. DATA SUBJECT RIGHTS
  
  Under applicable regulations such as GDPR, you have the right to:
  - Access your personal information
  - Correct inaccurate information
  - Request deletion of your information
  - Restrict processing of your information
  - Request data portability
  - Object to processing
  
  To exercise these rights, please contact us at privacy@example.com.
  
  5. LAWFUL BASIS FOR PROCESSING
  
  We process personal information based on one of the following legal grounds:
  - Your consent
  - Fulfillment of a contract with you
  - Compliance with a legal obligation
  - Protection of vital interests
  - Performance of a task in the public interest
  - Legitimate interests pursued by us or a third party
  
  6. SECURITY MEASURES
  
  We have implemented appropriate technical and organizational measures to protect your personal information, including:
  - Encryption of sensitive data
  - Regular security assessments
  - Access controls and authentication
  - Employee training on data protection
  
  7. DATA BREACH NOTIFICATION
  
  In the event of a data breach that poses a risk to your rights and freedoms, we will notify relevant supervisory authorities within 72 hours of becoming aware of the breach, where feasible. We will also notify affected individuals without undue delay.
  
  8. CHILDREN'S PRIVACY
  
  Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children.
  
  9. CHANGES TO THIS POLICY
  
  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date.
  
  10. CONTACT INFORMATION
  
  If you have questions about this Privacy Policy, please contact us at:
  Email: privacy@example.com
  Address: 123 Privacy Street, Data City, 10001
  `;
  
  try {
    // Test with GDPR and HIPAA frameworks
    const result = await analyzeDocument(samplePolicy, {
      frameworks: ['GDPR', 'HIPAA'],
      industry: 'Technology'
    });
    
    console.log('Analysis completed successfully.');
    console.log('Overall score:', result.overallScore);
    console.log('Total gaps identified:', result.totalGaps);
    
    return result;
  } catch (error) {
    console.error('Test document analysis failed:', error);
    throw error;
  }
}

/**
 * Tests the chat feature with Gemini
 * @returns {Promise<string>} The chat response
 */
export async function testChatFeature() {
  console.log('Starting test chat feature...');
  
  try {
    const prompt = "What are the key requirements for GDPR compliance?";
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1000
    });
    
    console.log('Chat response received successfully.');
    
    return result;
  } catch (error) {
    console.error('Test chat feature failed:', error);
    throw error;
  }
}

/**
 * Tests the policy generation feature
 * @returns {Promise<string>} The generated policy
 */
export async function testPolicyGeneration() {
  console.log('Starting test policy generation...');
  
  try {
    const prompt = `Generate a GDPR-compliant privacy policy for a small e-commerce website that collects customer names, emails, 
    and shipping addresses. The company is based in the United States but serves customers in the EU.`;
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.5,
      maxOutputTokens: 4000,
      isPolicyGeneration: true
    });
    
    console.log('Policy generation completed successfully.');
    
    return result;
  } catch (error) {
    console.error('Test policy generation failed:', error);
    throw error;
  }
}

// Main test runner
export async function runAllTests() {
  console.log('Running all Gemini API tests...');
  
  try {
    console.log('\n--- Testing Document Analysis ---');
    const analysisResult = await testDocumentAnalysis();
    console.log('Document analysis test passed ✅');
    
    console.log('\n--- Testing Chat Feature ---');
    const chatResult = await testChatFeature();
    console.log('Chat feature test passed ✅');
    
    console.log('\n--- Testing Policy Generation ---');
    const policyResult = await testPolicyGeneration();
    console.log('Policy generation test passed ✅');
    
    return {
      analysisResult,
      chatResult,
      policyResult
    };
  } catch (error) {
    console.error('One or more tests failed:', error);
    throw error;
  }
}

export default {
  testDocumentAnalysis,
  testChatFeature,
  testPolicyGeneration,
  runAllTests
};
      const originalFetch = global.fetch;
      global.fetch = () => 
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({
            candidates: [{
              content: {
                parts: [{
                  text: JSON.stringify({
                    documentValidation: { isValid: true, documentType: "policy" },
                    summary: "This is a mock API response",
                    overallScore: 75,
                    gaps: []
                  })
                }]
              }
            }]
          }))
        });
    }
    
    // Test with GDPR and HIPAA frameworks
    const result = await analyzeDocument(samplePolicy, {
      frameworks: ['GDPR', 'HIPAA'],
      industry: 'Technology'
    });
    
    console.log('Analysis completed successfully.');
    console.log('Overall score:', result.overallScore);
    console.log('Total gaps identified:', result.totalGaps);
    
    return result;
  } catch (error) {
    console.error('Test document analysis failed:', error);
    throw error;
  } finally {
    if (useLocalBenchmarkOnly && global.fetch && originalFetch) {
      global.fetch = originalFetch;
    }
  }
}

/**
 * Tests the chat feature with Gemini
 * @returns {Promise<string>} The chat response
 */
export async function testChatFeature() {
  console.log('Starting test chat feature...');
  
  try {
    const prompt = "What are the key requirements for GDPR compliance?";
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1000
    });
    
    console.log('Chat response received successfully.');
    
    return result;
  } catch (error) {
    console.error('Test chat feature failed:', error);
    throw error;
  }
}

/**
 * Tests the policy generation feature
 * @returns {Promise<string>} The generated policy
 */
export async function testPolicyGeneration() {
  console.log('Starting test policy generation...');
  
  try {
    const prompt = `Generate a GDPR-compliant privacy policy for a small e-commerce website that collects customer names, emails, 
    and shipping addresses. The company is based in the United States but serves customers in the EU.`;
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.5,
      maxOutputTokens: 4000,
      isPolicyGeneration: true
    });
    
    console.log('Policy generation completed successfully.');
    
    return result;
  } catch (error) {
    console.error('Test policy generation failed:', error);
    throw error;
  }
}

// Main test runner
export async function runAllTests() {
  console.log('Running all Gemini API tests...');
  
  try {
    console.log('\n--- Testing Document Analysis ---');
    const analysisResult = await testDocumentAnalysis();
    console.log('Document analysis test passed ✅');
    
    console.log('\n--- Testing Chat Feature ---');
    const chatResult = await testChatFeature();
    console.log('Chat feature test passed ✅');
    
    console.log('\n--- Testing Policy Generation ---');
    const policyResult = await testPolicyGeneration();
    console.log('Policy generation test passed ✅');
    
    return {
      analysisResult,
      chatResult,
      policyResult
    };
  } catch (error) {
    console.error('One or more tests failed:', error);
    throw error;
  }
}

// Execute tests directly if this module is run directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests()
    .then(() => console.log('All tests completed successfully'))
    .catch(error => console.error('Test suite failed:', error));
}

export default {
  testDocumentAnalysis,
  testChatFeature,
  testPolicyGeneration,
  runAllTests
};
