// Simple test runner for Gemini API

import { analyzeDocument, analyzeWithGemini } from './src/lib/gemini.js';

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

3. DATA SUBJECT RIGHTS

Under applicable regulations such as GDPR, you have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Restrict processing of your information
- Request data portability
- Object to processing

4. SECURITY MEASURES

We have implemented appropriate technical and organizational measures to protect your personal information.
`;

// Parse command line arguments
const args = process.argv.slice(2);
const testMode = args[0] || 'all';

async function testDocumentAnalysis() {
  console.log('Testing document analysis...');
  
  try {
    const result = await analyzeDocument(samplePolicy, {
      frameworks: ['GDPR', 'HIPAA'],
      industry: 'Technology'
    });
    
    console.log('Analysis completed successfully');
    console.log('Overall score:', result.overallScore);
    console.log('Total gaps identified:', result.totalGaps);
    
    return result;
  } catch (error) {
    console.error('Document analysis test failed:', error);
    throw error;
  }
}

async function testChatFeature() {
  console.log('Testing chat feature...');
  
  try {
    const prompt = "What are the key requirements for GDPR compliance?";
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1000
    });
    
    console.log('Chat response received successfully');
    console.log('Response length:', result.length, 'characters');
    
    return result;
  } catch (error) {
    console.error('Chat test failed:', error);
    throw error;
  }
}

async function testPolicyGeneration() {
  console.log('Testing policy generation...');
  
  try {
    const prompt = `Generate a GDPR-compliant privacy policy for a small e-commerce website that collects customer names, emails, 
    and shipping addresses. The company is based in the United States but serves customers in the EU.`;
    
    const result = await analyzeWithGemini(prompt, {
      temperature: 0.5,
      maxOutputTokens: 4000,
      isPolicyGeneration: true
    });
    
    console.log('Policy generation completed successfully');
    console.log('Policy length:', result.length, 'characters');
    
    return result;
  } catch (error) {
    console.error('Policy generation test failed:', error);
    throw error;
  }
}

async function main() {
  console.log('PoliGap Gemini API Test Runner');
  console.log('============================\n');
  
  try {
    switch(testMode.toLowerCase()) {
      case 'all':
        console.log('Running all tests...\n');
        
        console.log('\n--- Testing Document Analysis ---');
        await testDocumentAnalysis();
        console.log('✅ Document analysis test passed');
        
        console.log('\n--- Testing Chat Feature ---');
        await testChatFeature();
        console.log('✅ Chat feature test passed');
        
        console.log('\n--- Testing Policy Generation ---');
        await testPolicyGeneration();
        console.log('✅ Policy generation test passed');
        break;
        
      case 'analyze':
      case 'analysis':
        console.log('Running document analysis test only...\n');
        await testDocumentAnalysis();
        break;
        
      case 'chat':
        console.log('Running chat feature test only...\n');
        await testChatFeature();
        break;
        
      case 'policy':
      case 'generate':
        console.log('Running policy generation test only...\n');
        await testPolicyGeneration();
        break;
        
      default:
        console.log(`Unknown test mode: ${testMode}`);
        console.log('Available modes: all, analyze, chat, policy');
        process.exit(1);
    }
    
    console.log('\n✅ Tests completed successfully');
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
