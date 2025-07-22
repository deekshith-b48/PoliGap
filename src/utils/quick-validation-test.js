// Quick validation test for enhanced privacy policy detection
import { validateDocumentType } from '../lib/gemini.js';

// Test documents
const privacyPolicyTest = `
Privacy Policy

Effective Date: January 1, 2024

1. Information We Collect
We collect personal information when you use our services, including your name, email address, and usage data.

2. How We Use Your Information
We use your personal data to provide our services, improve user experience, and comply with legal obligations.

3. Data Sharing and Third Parties
We may share your information with trusted third-party service providers who assist us in operating our website.

4. Your Rights
You have the right to access, correct, delete, or port your personal data. You may also withdraw consent at any time.

5. Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.

6. Data Retention
We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy.

7. Legal Compliance
This privacy policy complies with GDPR, CCPA, and other applicable privacy laws and regulations.

8. Contact Us
If you have questions about this privacy policy, please contact us at privacy@company.com.
`;

const resumeTest = `
John Smith
Software Developer

Professional Experience:
- Senior Software Engineer at Tech Corp (2020-2024)
- Full-stack developer with expertise in React and Node.js
- Led development team of 5 engineers

Education Background:
- Bachelor's degree in Computer Science
- Master's degree in Software Engineering

Career Objective:
Seeking a challenging role in software development where I can utilize my technical skills and leadership experience.

References available upon request.
`;

console.log('🔍 ENHANCED PRIVACY POLICY VALIDATION TEST\n');

console.log('Testing Privacy Policy Document:');
const privacyResult = validateDocumentType(privacyPolicyTest);
console.log(`✅ Valid: ${privacyResult.isValid}`);
console.log(`📄 Type: ${privacyResult.type}`);
console.log(`🎯 Confidence: ${privacyResult.confidence}%`);
console.log(`📊 Privacy Score: ${privacyResult.privacyScore}`);
console.log(`🏗️ Structure Score: ${privacyResult.structureScore}`);
console.log(`✨ Essential Sections Found: ${privacyResult.essentialSections?.length || 0}/6`);
console.log(`📋 Section Completeness: ${privacyResult.sectionCompleteness?.toFixed(1) || 0}%`);
console.log(`💡 Reason: ${privacyResult.reason}\n`);

console.log('Testing Resume Document:');
const resumeResult = validateDocumentType(resumeTest);
console.log(`❌ Valid: ${resumeResult.isValid}`);
console.log(`📄 Type: ${resumeResult.type}`);
console.log(`🎯 Confidence: ${resumeResult.confidence}%`);
console.log(`💡 Reason: ${resumeResult.reason}\n`);

console.log('🎉 Enhanced Validation System Operational!');
console.log(`✅ Privacy Policy Detection: ${privacyResult.isValid ? 'PASSED' : 'FAILED'}`);
console.log(`❌ Resume Rejection: ${!resumeResult.isValid ? 'PASSED' : 'FAILED'}`);
