// Test script for document validation
import { testDocumentValidation } from './src/lib/gemini.js';

// Test with sample policy text
const samplePolicyText = `
PRIVACY POLICY

This Privacy Policy describes how we collect, use, and share information about you when you use our services.

INFORMATION WE COLLECT
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

DATA SHARING
We may share your information with third parties in certain circumstances as described in this policy.

SECURITY
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

USER RIGHTS
You have certain rights regarding your personal information, including the right to access, update, or delete your information.

CONTACT INFORMATION
If you have any questions about this Privacy Policy, please contact our privacy team.
`;

// Test with sample non-policy text (resume)
const sampleResumeText = `
John Smith
Software Engineer

WORK EXPERIENCE
Senior Software Engineer at Tech Company (2020-2023)
- Developed web applications using React and Node.js
- Led a team of 5 developers
- Responsible for code reviews and mentoring junior developers

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)
Graduated with honors

SKILLS
- JavaScript, Python, Java
- React, Node.js, Express
- Database: MongoDB, PostgreSQL
- Cloud: AWS, Docker, Kubernetes
`;

console.log('🧪 Testing Document Validation...\n');

console.log('1️⃣ Testing Policy Document:');
const policyResult = testDocumentValidation(samplePolicyText);

console.log('\n2️⃣ Testing Resume Document:');
const resumeResult = testDocumentValidation(sampleResumeText);

console.log('\n📊 Summary:');
console.log('Policy document accepted:', policyResult.isValid);
console.log('Resume document rejected:', !resumeResult.isValid);
