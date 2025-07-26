import { useState } from 'react';

function PrivacyPolicyModal({ isOpen, onClose, onAccept }) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'collection', title: 'Data Collection', icon: '📊' },
    { id: 'usage', title: 'Data Usage', icon: '🔄' },
    { id: 'sharing', title: 'Data Sharing', icon: '🤝' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'contact', title: 'Contact', icon: '📞' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-gray-600">Last updated: January 15, 2024</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Navigation */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{section.icon}</span>
                        <span className="font-medium text-sm">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="prose prose-gray max-w-none">
                  {activeSection === 'overview' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to PoliGap</h3>
                      <p className="text-gray-700 mb-4">
                        At PoliGap, we are committed to protecting your privacy and ensuring the security of your data. 
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
                        AI-powered compliance analysis platform.
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2">🔒 Key Privacy Commitments</h4>
                        <ul className="space-y-2 text-blue-800 text-sm">
                          <li>• We never sell your personal data to third parties</li>
                          <li>• Your documents are encrypted both in transit and at rest</li>
                          <li>• You maintain full control over your data</li>
                          <li>• We comply with GDPR, CCPA, and other privacy regulations</li>
                          <li>• Data is processed only for compliance analysis purposes</li>
                        </ul>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-3">What This Policy Covers</h4>
                      <ul className="space-y-2 text-gray-700 mb-6">
                        <li>• Information we collect and why</li>
                        <li>• How we use and protect your data</li>
                        <li>• Your rights regarding your personal information</li>
                        <li>• How to contact us with privacy questions</li>
                      </ul>

                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-800 text-sm">
                          <strong>Privacy by Design:</strong> Our platform is built with privacy as a core principle, 
                          ensuring your sensitive compliance data remains secure and confidential.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'collection' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Collection</h3>
                      
                      <h4 className="font-semibold text-gray-900 mb-3">Information You Provide</h4>
                      <ul className="space-y-2 text-gray-700 mb-6">
                        <li>• <strong>Account Information:</strong> Name, email address, company details</li>
                        <li>• <strong>Policy Documents:</strong> Files you upload for compliance analysis</li>
                        <li>• <strong>Profile Data:</strong> Industry, role, compliance frameworks of interest</li>
                        <li>• <strong>Communication:</strong> Messages, feedback, and support requests</li>
                      </ul>

                      <h4 className="font-semibold text-gray-900 mb-3">Automatically Collected Information</h4>
                      <ul className="space-y-2 text-gray-700 mb-6">
                        <li>• <strong>Usage Analytics:</strong> How you interact with our platform</li>
                        <li>• <strong>Technical Data:</strong> IP address, browser type, device information</li>
                        <li>• <strong>Performance Metrics:</strong> Analysis completion times, error rates</li>
                        <li>• <strong>Security Logs:</strong> Login attempts, access patterns</li>
                      </ul>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Document Processing</h4>
                        <p className="text-yellow-800 text-sm">
                          Documents uploaded for analysis are processed by our AI systems to identify compliance gaps. 
                          We do not read or store document content beyond what's necessary for analysis. All documents 
                          are automatically deleted after 30 days unless saved to your account.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'usage' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Data</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">🎯 Primary Purposes</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Perform AI-powered compliance analysis on your documents</li>
                            <li>• Generate compliance reports and recommendations</li>
                            <li>• Provide personalized compliance insights</li>
                            <li>• Maintain your account and analysis history</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">📈 Service Improvement</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Improve our AI analysis accuracy</li>
                            <li>• Develop new compliance frameworks</li>
                            <li>• Enhance user experience and platform performance</li>
                            <li>• Conduct security and fraud prevention</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">📧 Communication</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Send analysis completion notifications</li>
                            <li>• Provide customer support</li>
                            <li>• Share important platform updates</li>
                            <li>• Deliver compliance insights and best practices</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                        <h4 className="font-semibold text-blue-900 mb-2">🤖 AI Processing</h4>
                        <p className="text-blue-800 text-sm">
                          Our AI systems analyze document structure, language patterns, and compliance requirements. 
                          We use aggregated, anonymized data to improve our models but never share identifiable information.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'sharing' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h3>
                      
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-red-900 mb-2">🚫 We Never Sell Your Data</h4>
                        <p className="text-red-800 text-sm">
                          PoliGap does not sell, rent, or trade your personal information to third parties for marketing purposes.
                        </p>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-3">Limited Sharing Scenarios</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-800">🔧 Service Providers</h5>
                          <p className="text-gray-700 text-sm">
                            Trusted third-party services that help us operate our platform (cloud hosting, 
                            email delivery, payment processing) under strict data protection agreements.
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800">⚖️ Legal Requirements</h5>
                          <p className="text-gray-700 text-sm">
                            When required by law, court order, or government regulation, we may disclose 
                            information to protect our rights or comply with legal processes.
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800">🛡️ Security & Safety</h5>
                          <p className="text-gray-700 text-sm">
                            To protect the security of our platform and prevent fraud, abuse, or harmful activities.
                          </p>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800">🏢 Business Transfers</h5>
                          <p className="text-gray-700 text-sm">
                            In the event of a merger, acquisition, or business transfer, your information 
                            may be transferred with the same privacy protections.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'security' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Measures</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <h4 className="font-semibold text-green-900 mb-2">🔐 Encryption</h4>
                          <ul className="text-green-800 text-sm space-y-1">
                            <li>• TLS 1.3 for data in transit</li>
                            <li>• AES-256 for data at rest</li>
                            <li>• End-to-end encryption</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">🏗️ Infrastructure</h4>
                          <ul className="text-blue-800 text-sm space-y-1">
                            <li>• SOC 2 certified cloud providers</li>
                            <li>• Multi-factor authentication</li>
                            <li>• Regular security audits</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                          <h4 className="font-semibold text-purple-900 mb-2">👥 Access Control</h4>
                          <ul className="text-purple-800 text-sm space-y-1">
                            <li>• Role-based permissions</li>
                            <li>• Principle of least privilege</li>
                            <li>• Access logging and monitoring</li>
                          </ul>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                          <h4 className="font-semibold text-orange-900 mb-2">🔄 Data Lifecycle</h4>
                          <ul className="text-orange-800 text-sm space-y-1">
                            <li>• Automatic data deletion</li>
                            <li>• Secure backup procedures</li>
                            <li>• Data retention policies</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">🛡️ Security Incident Response</h4>
                        <p className="text-gray-700 text-sm">
                          In the unlikely event of a security incident, we have procedures in place to 
                          contain the incident, assess the impact, and notify affected users within 72 hours 
                          as required by applicable data protection laws.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'rights' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">👁️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Access</h4>
                            <p className="text-gray-700 text-sm">Request a copy of all personal data we hold about you.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">✏️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                            <p className="text-gray-700 text-sm">Correct any inaccurate or incomplete personal information.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🗑️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                            <p className="text-gray-700 text-sm">Request deletion of your personal data ("right to be forgotten").</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📦</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Data Portability</h4>
                            <p className="text-gray-700 text-sm">Export your data in a machine-readable format.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">⏸️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Restrict Processing</h4>
                            <p className="text-gray-700 text-sm">Limit how we process your personal information.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🚫</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Right to Object</h4>
                            <p className="text-gray-700 text-sm">Object to processing based on legitimate interests or direct marketing.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">📧 How to Exercise Your Rights</h4>
                        <p className="text-blue-800 text-sm mb-3">
                          To exercise any of these rights, please contact us at privacy@poligap.com or use 
                          the data management tools in your account settings.
                        </p>
                        <p className="text-blue-800 text-sm">
                          We will respond to your request within 30 days and may ask for identity verification 
                          to protect your privacy.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'contact' && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-900 mb-3">📧 Privacy Officer</h4>
                          <div className="space-y-2 text-blue-800 text-sm">
                            <p><strong>Email:</strong> privacy@poligap.com</p>
                            <p><strong>Response Time:</strong> Within 72 hours</p>
                            <p><strong>Languages:</strong> English, Spanish, French</p>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <h4 className="font-semibold text-green-900 mb-3">🏢 Company Address</h4>
                          <div className="space-y-1 text-green-800 text-sm">
                            <p>PoliGap Technologies Inc.</p>
                            <p>123 Compliance Street</p>
                            <p>San Francisco, CA 94102</p>
                            <p>United States</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">🇪🇺 EU Representative</h4>
                          <p className="text-gray-700 text-sm">
                            For users in the European Union, our EU representative can be contacted at:
                            eu-privacy@poligap.com
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">⚖️ Supervisory Authority</h4>
                          <p className="text-gray-700 text-sm">
                            If you're not satisfied with our response to your privacy concerns, you have the right 
                            to lodge a complaint with your local data protection authority.
                          </p>
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6">
                        <h4 className="font-semibold text-purple-900 mb-2">🔄 Policy Updates</h4>
                        <p className="text-purple-800 text-sm">
                          We may update this Privacy Policy periodically. We'll notify you of significant changes 
                          via email or through our platform. The "Last updated" date at the top indicates when 
                          the policy was last modified.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>GDPR & CCPA Compliant</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {onAccept && (
                  <button
                    onClick={onAccept}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Accept & Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyModal;
