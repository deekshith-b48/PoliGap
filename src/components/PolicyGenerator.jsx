import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { analyzeWithGemini } from '../lib/gemini';

function PolicyGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const industries = [
    'Technology', 'Healthcare', 'Financial Services', 'Education', 
    'Manufacturing', 'Retail', 'Government', 'Non-Profit', 'Other'
  ];

  const policyTypes = [
    'Privacy Policy', 'Data Protection Policy', 'Security Policy',
    'Employee Handbook', 'Code of Conduct', 'IT Policy',
    'Remote Work Policy', 'Incident Response Policy'
  ];

  const generatePolicyPDF = async (policyContent, metadata) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header styling
    doc.setFillColor(30, 58, 138); // Blue header
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(metadata.title, margin, 25);
    
    // Company info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${metadata.companyName} | ${metadata.industry}`, margin, 35);
    
    // Reset color for content
    doc.setTextColor(0, 0, 0);
    let yPosition = 60;
    
    // Document metadata section
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Document Type: ${metadata.policyType}`, margin, yPosition + 5);
    doc.text(`Version: 1.0`, margin, yPosition + 10);
    
    yPosition += 25;
    doc.setTextColor(0, 0, 0);
    
    // Process content
    const lines = policyContent.split('\n');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    for (let line of lines) {
      if (line.trim() === '') {
        yPosition += 5;
        continue;
      }
      
      // Check for headers (lines starting with #)
      if (line.startsWith('# ')) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        const headerText = line.substring(2);
        doc.text(headerText, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Check for subheaders (lines starting with ##)
      if (line.startsWith('## ')) {
        if (yPosition > pageHeight - 35) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 51, 51);
        const subheaderText = line.substring(3);
        doc.text(subheaderText, margin, yPosition);
        yPosition += 12;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Handle bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = line.substring(2);
        const wrappedBullet = doc.splitTextToSize(`• ${bulletText}`, contentWidth - 10);
        
        for (let bulletLine of wrappedBullet) {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 40;
          }
          doc.text(bulletLine, margin + 10, yPosition);
          yPosition += 6;
        }
        continue;
      }
      
      // Regular paragraph text
      const wrappedText = doc.splitTextToSize(line, contentWidth);
      for (let wrappedLine of wrappedText) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 40;
        }
        doc.text(wrappedLine, margin, yPosition);
        yPosition += 6;
      }
      yPosition += 3;
    }
    
    // Footer on each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `${metadata.companyName} - ${metadata.policyType} | Page ${i} of ${totalPages}`,
        margin,
        pageHeight - 10
      );
    }
    
    return doc;
  };

  const handleGenerate = async () => {
    if (!companyName || !industry || !policyType) {
      setError('Please fill in all fields');
      return;
    }

    setGenerating(true);
    setError('');
    setProgress('Initializing AI policy generation...');

    try {
      setProgress('Analyzing company requirements...');
      
      const prompt = `Create a comprehensive ${policyType} for ${companyName}, a company in the ${industry} industry. 

Please structure the policy with:
1. Clear headings using # for main sections and ## for subsections
2. Professional, legally sound language
3. Industry-specific considerations for ${industry}
4. Practical implementation guidelines
5. Compliance requirements where applicable

The policy should be thorough, professional, and ready for corporate use. Include sections like:
- Purpose and Scope
- Definitions
- Policy Statement
- Procedures
- Responsibilities
- Compliance and Enforcement
- Review and Updates

Make it specific to ${companyName} and relevant to the ${industry} industry.`;

      setProgress('Generating comprehensive policy content...');
      
      const policyContent = await analyzeWithGemini(prompt);
      
      if (!policyContent || policyContent.trim() === '') {
        throw new Error('Failed to generate policy content');
      }

      setGeneratedPolicy(policyContent);
      setProgress('Policy generated successfully!');
      
    } catch (error) {
      console.error('Error generating policy:', error);
      setError('Failed to generate policy. Please try again.');
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedPolicy) {
      setError('No policy to download. Please generate a policy first.');
      return;
    }

    try {
      setProgress('Preparing professional PDF document...');
      
      const metadata = {
        title: policyType,
        companyName,
        industry,
        policyType
      };

      const doc = await generatePolicyPDF(generatedPolicy, metadata);
      
      const fileName = `${companyName}_${policyType.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
      
      setProgress('PDF downloaded successfully!');
      setTimeout(() => setProgress(''), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">🏢 AI Policy Generator</h1>
            <p className="text-white/80 text-lg">Generate professional policies with AI-powered precision</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-white/90 font-semibold mb-2">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold mb-2">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-gray-800">Select Industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind} className="bg-gray-800">{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 font-semibold mb-2">Policy Type</label>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-gray-800">Select Policy Type</option>
                {policyTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800">{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                generating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {generating ? '🔄 Generating...' : '🚀 Generate Policy'}
            </button>
          </div>

          {progress && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <p className="text-blue-200 text-center font-medium">{progress}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
              <p className="text-red-200 text-center font-medium">{error}</p>
            </div>
          )}

          {generatedPolicy && (
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-black text-white">GENERATED POLICY PREVIEW</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold border-2 border-green-600">
                    📄 Professional PDF Ready
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    📄 DOWNLOAD PDF
                  </button>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 max-h-96 overflow-y-auto border border-white/20">
                <pre className="text-white/90 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {generatedPolicy}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolicyGenerator;
