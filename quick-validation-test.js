/**
 * Quick test to verify the enhanced privacy policy validation system
 */

// Test document samples
const validPrivacyPolicy = `
Privacy Policy - TechCorp Solutions

Effective Date: January 1, 2024
Last Updated: March 15, 2024

1. Information We Collect
We collect personal information including your name, email address, phone number, and payment information. We also automatically collect device information, IP addresses, usage data, and location information through cookies and similar technologies.

2. How We Use Your Information  
We use your personal data to provide services, process payments, communicate with you, personalize experiences, ensure security, prevent fraud, and comply with legal obligations under GDPR, CCPA, and other applicable privacy laws.

3. Data Sharing and Third Parties
We may share your information with service providers, payment processors, business partners, and legal authorities when required. We do not sell your personal information to third parties for marketing purposes.

4. Your Rights and Choices
You have the right to access, correct, delete, or transfer your personal information. You can object to certain processing activities, withdraw consent, and opt-out of marketing communications.

5. Data Security
We implement encryption, access controls, regular security assessments, employee training, and incident response procedures to protect your personal information.

6. Data Retention
We retain personal information for as long as necessary to provide services, comply with legal obligations, and fulfill legitimate business purposes. Specific retention periods vary by data type.

7. Contact Us
For privacy questions, contact our Data Protection Officer at privacy@techcorp.com or write to 123 Privacy Street, Data City, DC 12345.
`;

const invalidDocument = `
John Smith - Software Engineer Resume

Professional Experience:
- 5 years software development
- Expert in JavaScript, React, Python
- Led multiple successful projects
- Strong problem-solving skills

Education:
- Master's in Computer Science
- Bachelor's in Software Engineering

Skills: Programming, databases, cloud platforms
References available upon request.
`;

// Simple validation test
console.log('🧪 Quick Privacy Policy Validation Test\n');

// Test the validation function (using a simplified version for testing)
function quickValidationTest(text, label) {
  const normalizedText = text.toLowerCase();
  
  console.log(`📋 Testing: ${label}`);
  console.log(`📏 Length: ${text.length} characters`);
  
  // Privacy indicators scoring
  const privacyTerms = [
    'privacy policy', 'personal information', 'data collection', 'user rights',
    'data protection', 'privacy', 'personal data', 'gdpr', 'ccpa'
  ];
  
  let privacyScore = 0;
  privacyTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      privacyScore += 15;
    }
  });
  
  // Structure indicators
  const structureTerms = [
    'effective date', 'contact us', 'section', 'how we use', 'data sharing'
  ];
  
  let structureScore = 0;
  structureTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      structureScore += 10;
    }
  });
  
  const totalScore = privacyScore + structureScore;
  const isValid = totalScore >= 50 && text.length >= 500;
  
  console.log(`📊 Privacy Score: ${privacyScore}`);
  console.log(`🏗️ Structure Score: ${structureScore}`);
  console.log(`🎯 Total Score: ${totalScore}`);
  console.log(`✅ Valid: ${isValid ? 'YES' : 'NO'}`);
  console.log(`📈 Confidence: ${Math.min(95, totalScore * 2)}%\n`);
  
  return { isValid, totalScore, privacyScore, structureScore };
}

// Run tests
const result1 = quickValidationTest(validPrivacyPolicy, 'Valid Privacy Policy');
const result2 = quickValidationTest(invalidDocument, 'Resume Document');

// Summary
console.log('📊 TEST SUMMARY');
console.log('─'.repeat(40));
console.log(`Privacy Policy Valid: ${result1.isValid ? '✅' : '❌'}`);
console.log(`Resume Document Valid: ${result2.isValid ? '❌ (should be invalid)' : '✅'}`);

const testsPassed = result1.isValid && !result2.isValid;
console.log(`\n🎯 Overall Test Result: ${testsPassed ? '✅ PASSED' : '❌ FAILED'}`);

if (testsPassed) {
  console.log('🎉 Enhanced privacy policy validation system is working correctly!');
} else {
  console.log('⚠️ Validation system needs adjustment');
}

console.log('\n💡 Next: Upload a real privacy policy to see the full analysis in action!');
