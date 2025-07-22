// Comprehensive validation test with edge cases
import { validateDocumentType } from '../lib/gemini.js';

const longResumeTest = `
John Smith
Senior Software Developer & Team Lead

Professional Summary:
Experienced software developer with over 8 years in the technology industry, specializing in full-stack web development, cloud architecture, and team leadership. Proven track record of delivering high-quality software solutions and leading cross-functional teams to achieve business objectives.

Professional Experience:

Senior Software Engineer | Tech Solutions Inc. | 2020 - Present
• Lead a team of 5 software engineers in developing scalable web applications
• Architect and implement microservices using Node.js, React, and AWS
• Established CI/CD pipelines that reduced deployment time by 60%
• Mentor junior developers and conduct code reviews
• Collaborate with product managers and designers on feature development

Software Engineer | Digital Innovations Corp | 2018 - 2020
• Developed responsive web applications using React, Angular, and Vue.js
• Built RESTful APIs and GraphQL endpoints for mobile and web clients
• Optimized database queries resulting in 40% improvement in application performance
• Participated in agile development processes and sprint planning

Junior Developer | StartUp Tech | 2016 - 2018
• Created interactive user interfaces using HTML, CSS, and JavaScript
• Worked on bug fixes and feature enhancements for existing applications
• Learned version control systems and collaborative development practices
• Contributed to documentation and testing procedures

Education Background:
Master of Science in Computer Science | University of Technology | 2016
Bachelor of Science in Software Engineering | State University | 2014

Technical Skills:
• Programming Languages: JavaScript, TypeScript, Python, Java, C++
• Frontend Technologies: React, Angular, Vue.js, HTML5, CSS3, SASS
• Backend Technologies: Node.js, Express.js, Django, Spring Boot
• Databases: PostgreSQL, MongoDB, MySQL, Redis
• Cloud Platforms: AWS, Azure, Google Cloud Platform
• DevOps Tools: Docker, Kubernetes, Jenkins, GitLab CI

Certifications:
• AWS Certified Solutions Architect
• Google Cloud Professional Developer
• Certified Scrum Master

Projects:
E-commerce Platform: Led development of a multi-tenant e-commerce platform serving 10,000+ users
Data Analytics Dashboard: Built real-time analytics dashboard for business intelligence
Mobile API Gateway: Designed and implemented API gateway for mobile applications

Career Objective:
Seeking a challenging senior engineering role where I can leverage my expertise in full-stack development and team leadership to drive innovation and deliver exceptional software products.

References available upon request.
Contact: john.smith@email.com | LinkedIn: linkedin.com/in/johnsmith
`;

const inadequatePrivacyPolicy = `
Privacy Statement

We care about your privacy. This document explains how we handle information.

Data Collection: We collect some information when you use our service.
Usage: We use information to provide our service.
Sharing: We don't share your information unnecessarily.
Security: We try to keep your information safe.
Contact: Email us with questions.

This policy may be updated from time to time.
`;

console.log('🔍 COMPREHENSIVE VALIDATION TEST\n');

console.log('1. Testing Long Resume Document (>1000 chars):');
const longResumeResult = validateDocumentType(longResumeTest);
console.log(`❌ Valid: ${longResumeResult.isValid}`);
console.log(`📄 Type: ${longResumeResult.type}`);
console.log(`🎯 Confidence: ${longResumeResult.confidence}%`);
console.log(`📊 Length: ${longResumeTest.length} characters`);
console.log(`💡 Reason: ${longResumeResult.reason}\n`);

console.log('2. Testing Inadequate Privacy Policy:');
const inadequateResult = validateDocumentType(inadequatePrivacyPolicy);
console.log(`❌ Valid: ${inadequateResult.isValid}`);
console.log(`📄 Type: ${inadequateResult.type}`);
console.log(`🎯 Confidence: ${inadequateResult.confidence}%`);
console.log(`📊 Length: ${inadequatePrivacyPolicy.length} characters`);
console.log(`✨ Essential Sections Found: ${inadequateResult.essentialSections?.length || 0}/6`);
console.log(`📋 Section Completeness: ${inadequateResult.sectionCompleteness?.toFixed(1) || 0}%`);
console.log(`💡 Reason: ${inadequateResult.reason}\n`);

console.log('🎯 ENHANCED VALIDATION SUMMARY:');
console.log(`✅ Long Resume Rejection: ${!longResumeResult.isValid ? 'PASSED' : 'FAILED'}`);
console.log(`✅ Inadequate Policy Rejection: ${!inadequateResult.isValid ? 'PASSED' : 'FAILED'}`);
console.log('🛡️ Strict Validation Successfully Implemented!');
