import { useState } from 'react';
import { 
  HiOutlineX, 
  HiOutlineDownload, 
  HiOutlineClipboard,
  HiOutlineExternalLink,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
  HiOutlineGlobe
} from 'react-icons/hi';
import { generateFrameworkReport } from '../data/complianceFrameworks';

function FrameworkDetailsPopup({ framework, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadStatus, setDownloadStatus] = useState('');

  if (!isOpen || !framework) return null;

  const handleDownload = () => {
    setDownloadStatus('Generating report...');
    
    try {
      const report = generateFrameworkReport(framework.id.toUpperCase());
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${framework.shortName}_Compliance_Framework_Guide.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadStatus('Downloaded successfully!');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (error) {
      setDownloadStatus('Download failed');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const report = generateFrameworkReport(framework.id.toUpperCase());
      await navigator.clipboard.writeText(report);
      setDownloadStatus('Copied to clipboard!');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (error) {
      setDownloadStatus('Copy failed');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: HiOutlineDocumentText },
    { key: 'requirements', label: 'Requirements', icon: HiOutlineShield },
    { key: 'implementation', label: 'Implementation', icon: HiOutlineClipboard }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 text-2xl">
                {framework.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{framework.shortName}</h2>
                <p className="text-blue-100">{framework.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {downloadStatus && (
                <div className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm">
                  {downloadStatus}
                </div>
              )}
              <button
                onClick={handleCopyToClipboard}
                className="bg-white/20 backdrop-blur-xl text-white p-2 rounded-xl hover:bg-white/30 transition-all"
                title="Copy to clipboard"
              >
                <HiOutlineClipboard className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/20 backdrop-blur-xl text-white p-2 rounded-xl hover:bg-white/30 transition-all"
                title="Download as TXT"
              >
                <HiOutlineDownload className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 backdrop-blur-xl text-white p-2 rounded-xl hover:bg-white/30 transition-all"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Framework Metadata */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center">
                <HiOutlineGlobe className="w-4 h-4 text-blue-200 mr-2" />
                <span className="text-blue-200 text-sm">Jurisdiction</span>
              </div>
              <div className="text-white font-medium">{framework.jurisdiction}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center">
                <HiOutlineCalendar className="w-4 h-4 text-blue-200 mr-2" />
                <span className="text-blue-200 text-sm">Effective Date</span>
              </div>
              <div className="text-white font-medium">{framework.effectiveDate}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center">
                <HiOutlineShield className="w-4 h-4 text-blue-200 mr-2" />
                <span className="text-blue-200 text-sm">Category</span>
              </div>
              <div className="text-white font-medium">{framework.category}</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{framework.description}</p>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{framework.overview}</p>
              </div>

              {/* Key Principles */}
              {framework.keyPrinciples && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Principles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {framework.keyPrinciples.map((principle, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-900 font-medium">{principle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles/Sections */}
              {framework.articles && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Articles & Sections</h3>
                  <div className="space-y-3">
                    {Object.entries(framework.articles).map(([article, description]) => (
                      <div key={article} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{article}</h4>
                        <p className="text-gray-700 text-sm">{description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penalties */}
              {framework.penalties && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-3">⚠️ Penalties for Non-Compliance</h3>
                  <p className="text-red-800 font-medium">{framework.penalties}</p>
                </div>
              )}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Compliance Requirements</h3>
                
                {framework.requirements && (
                  <div className="space-y-4">
                    {framework.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{requirement}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Applicability */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-3">📋 Applicability</h3>
                <p className="text-blue-800">{framework.applicability}</p>
                
                {/* Thresholds for CCPA */}
                {framework.thresholds && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Applicability Thresholds:</h4>
                    <ul className="text-blue-800 space-y-1">
                      {framework.thresholds.map((threshold, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {threshold}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Implementation Tab */}
          {activeTab === 'implementation' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Implementation Roadmap</h3>
                
                {framework.implementationSteps && (
                  <div className="space-y-4">
                    {framework.implementationSteps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <p className="text-gray-800 font-medium">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Benefits (for ISO 27001) */}
              {framework.benefits && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4">✅ Implementation Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {framework.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-800 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Implementation Info */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-3">💡 Implementation Tips</h3>
                <div className="text-purple-800 space-y-2">
                  <p>• Start with a comprehensive risk assessment and gap analysis</p>
                  <p>• Engage stakeholders early in the implementation process</p>
                  <p>• Consider phased implementation for complex requirements</p>
                  <p>• Invest in staff training and awareness programs</p>
                  <p>• Regularly monitor and review compliance status</p>
                  <p>• Document all processes and maintain audit trails</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Generated by Policy Gap Analyzer • {new Date().toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                <HiOutlineClipboard className="w-4 h-4 mr-2" />
                Copy Report
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <HiOutlineDownload className="w-4 h-4 mr-2" />
                Download TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrameworkDetailsPopup;
