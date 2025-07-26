import { useState } from 'react';
import { FiDownload, FiShare2, FiMail, FiSave, FiFileText, FiDatabase, FiCode, FiRefreshCw, FiCheck } from 'react-icons/fi';
import PDFExportUtility from '../utils/pdfExport';

function ExportSharePanel({ analysis, isOpen, onClose }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [exportedFormat, setExportedFormat] = useState('');

  const exportFormats = [
    {
      id: 'pdf',
      title: '📄 Executive PDF Report',
      description: 'Complete analysis with charts and recommendations',
      icon: FiFileText,
      color: 'from-red-500 to-red-600',
      format: 'PDF'
    },
    {
      id: 'csv',
      title: '📊 CSV Data Export',
      description: 'Raw data for further analysis',
      icon: FiDatabase,
      color: 'from-green-500 to-green-600',
      format: 'CSV'
    },
    {
      id: 'json',
      title: '🔗 JSON Data',
      description: 'Structured data for integrations',
      icon: FiCode,
      color: 'from-blue-500 to-blue-600',
      format: 'JSON'
    }
  ];

  const shareOptions = [
    {
      id: 'email',
      title: '📧 Email Report',
      description: 'Send via email',
      icon: FiMail,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'slack',
      title: '💬 Send to Slack',
      description: 'Share with team',
      icon: FiShare2,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'drive',
      title: '📁 Save to Drive',
      description: 'Save to cloud storage',
      icon: FiSave,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const simulateProgress = (callback) => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          callback();
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportStatus('Generating Report...');
    setExportedFormat(format.format);

    simulateProgress(async () => {
      try {
        if (format.id === 'pdf') {
          const doc = await PDFExportUtility.exportAnalysisResults(analysis, {
            company: 'Your Organization',
            includeCharts: true
          });
          doc.save(`compliance-analysis-${Date.now()}.pdf`);
        } else if (format.id === 'csv') {
          exportToCSV();
        } else if (format.id === 'json') {
          exportToJSON();
        }
        
        setExportStatus('Export Complete!');
        setTimeout(() => {
          setIsExporting(false);
          setExportStatus('');
          setExportProgress(0);
        }, 2000);
      } catch (error) {
        console.error('Export failed:', error);
        setExportStatus('Export Failed');
        setTimeout(() => {
          setIsExporting(false);
          setExportStatus('');
          setExportProgress(0);
        }, 2000);
      }
    });
  };

  const handleShare = async (option) => {
    setIsExporting(true);
    setExportStatus(`Preparing to ${option.title.toLowerCase()}...`);

    simulateProgress(() => {
      if (option.id === 'email') {
        // Open email client with pre-filled content
        const subject = encodeURIComponent('Compliance Analysis Report');
        const body = encodeURIComponent(`Please find the compliance analysis report attached.\n\nOverall Score: ${analysis.overallScore}%\nTotal Gaps: ${analysis.gaps?.length || 0}\n\nGenerated on: ${new Date().toLocaleDateString()}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      } else if (option.id === 'slack') {
        // In a real app, this would integrate with Slack API
        navigator.clipboard.writeText(`Compliance Analysis Complete!\nScore: ${analysis.overallScore}%\nGaps Found: ${analysis.gaps?.length || 0}\nGenerated: ${new Date().toLocaleDateString()}`);
        alert('Report summary copied to clipboard! Paste it in Slack.');
      } else if (option.id === 'drive') {
        // In a real app, this would integrate with Google Drive API
        alert('Google Drive integration would be implemented here.');
      }
      
      setExportStatus('Shared Successfully!');
      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('');
        setExportProgress(0);
      }, 2000);
    });
  };

  const exportToCSV = () => {
    const headers = ['Gap #', 'Severity', 'Framework', 'Issue', 'Remediation', 'Timeline', 'Business Impact'];
    const gaps = analysis.gaps || [];
    const rows = gaps.map((gap, index) => [
      index + 1,
      gap.severity || 'Unknown',
      gap.framework || 'General',
      gap.issue || '',
      gap.remediation || '',
      gap.timeframe || 'TBD',
      gap.businessImpact || 'To be assessed'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-analysis-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        totalGaps: analysis.gaps?.length || 0,
        overallScore: analysis.overallScore,
        exportDate: new Date().toISOString(),
        documentInfo: analysis.documentInfo || {}
      },
      summary: analysis.summary,
      gaps: analysis.gaps || [],
      structuredAnalysis: analysis.structuredAnalysis,
      recommendations: analysis.recommendations || []
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4">
                <FiShare2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Export & Share Options</h2>
                <p className="text-blue-100">Download reports or share your analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-xl text-white p-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Export Progress */}
          {isExporting && (
            <div className="mb-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiRefreshCw className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                  <span className="font-semibold text-blue-900">{exportStatus}</span>
                </div>
                {exportedFormat && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {exportedFormat}
                  </span>
                )}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <div className="text-blue-700 text-sm mt-2">
                {exportProgress < 100 ? `${Math.round(exportProgress)}% complete` : 'Finalizing...'}
              </div>
            </div>
          )}

          {/* Export Formats */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiDownload className="w-5 h-5 mr-3" />
              Export Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => handleExport(format)}
                    disabled={isExporting}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${format.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{format.title}</h4>
                    <p className="text-gray-600 text-sm">{format.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Share Options */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiShare2 className="w-5 h-5 mr-3" />
              Share Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleShare(option)}
                    disabled={isExporting}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{option.title}</h4>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExport(exportFormats[0])}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Quick PDF Export
              </button>
              <button
                onClick={() => handleShare(shareOptions[0])}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <FiMail className="w-4 h-4 mr-2" />
                Email Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportSharePanel;
