import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { analyzeWithGemini } from '../lib/gemini';

function PolicyGenerator({ onNavigate }) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [viewMode, setViewMode] = useState('formatted'); // formatted or raw

  const industries = [
    'Technology & Software', 'Healthcare & Life Sciences', 'Financial Services & Banking',
    'Education & Research', 'Manufacturing & Industrial', 'Retail & E-commerce',
    'Government & Public Sector', 'Non-Profit & NGO', 'Consulting & Professional Services',
    'Real Estate & Construction', 'Transportation & Logistics', 'Energy & Utilities',
    'Media & Entertainment', 'Telecommunications', 'Agriculture & Food', 'Other'
  ];

  const companySizes = [
    { value: 'startup', label: 'Startup (1-10 employees)', icon: '🚀' },
    { value: 'small', label: 'Small Business (11-50 employees)', icon: '🏢' },
    { value: 'medium', label: 'Medium Enterprise (51-250 employees)', icon: '🏬' },
    { value: 'large', label: 'Large Enterprise (251-1000 employees)', icon: '🏭' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)', icon: '🌆' }
  ];

  const jurisdictions = [
    'United States (Federal)', 'European Union (GDPR)', 'United Kingdom', 'Canada',
    'Australia', 'Singapore', 'India', 'Japan', 'Brazil', 'Mexico', 'Other'
  ];

  const policyTypes = [
    { id: 'privacy', name: 'Privacy Policy', icon: '🔒', description: 'Data collection and user privacy' },
    { id: 'security', name: 'Security Policy', icon: '🛡️', description: 'Information security measures' },
    { id: 'employee', name: 'Employee Handbook', icon: '👥', description: 'Workplace policies and procedures' },
    { id: 'conduct', name: 'Code of Conduct', icon: '📋', description: 'Ethical guidelines and behavior' },
    { id: 'it', name: 'IT Policy', icon: '💻', description: 'Technology usage and guidelines' },
    { id: 'remote', name: 'Remote Work Policy', icon: '🏠', description: 'Telework guidelines and expectations' },
    { id: 'incident', name: 'Incident Response Policy', icon: '🚨', description: 'Emergency response procedures' },
    { id: 'data', name: 'Data Protection Policy', icon: '📊', description: 'Data handling and protection' }
  ];

  const formatPolicyContent = (content) => {
    // Enhanced formatting for README-style display
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h3>')
      .replace(/^\*\* (.*$)/gim, '<div class="font-semibold text-gray-800 mb-2">$1</div>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/^(?!<[h|l|d])(.+$)/gim, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');
  };

  const generatePolicyPDF = async (policyContent, metadata) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 0;

    // Professional header with modern design
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Modern logo placeholder
    doc.setFillColor(59, 130, 246); // Blue-500
    doc.roundedRect(margin, 15, 30, 30, 3, 3, 'F');

    // Logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PG', margin + 10, 35);

    // Title section
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(metadata.title, margin + 40, 25);

    // Subtitle with company info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(metadata.companyName, margin + 40, 35);

    // Metadata line
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225); // Slate-300
    const metadataText = `${metadata.industry} • ${metadata.companySize} • ${metadata.jurisdiction || 'Global'} • Generated: ${metadata.generatedDate}`;
    doc.text(metadataText, margin + 40, 45);

    // Status badge
    doc.setFillColor(34, 197, 94); // Green-500
    doc.roundedRect(pageWidth - margin - 60, 20, 50, 15, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('GENERATED', pageWidth - margin - 55, 30);

    currentY = 80;

    // Table of Contents generation
    const tocItems = [];
    const tocRegex = /^#{1,3}\s+(.+)$/gm;
    let match;
    while ((match = tocRegex.exec(policyContent)) !== null) {
      const level = match[0].indexOf(' ') - 1;
      tocItems.push({ title: match[1], level, page: 1 }); // Simplified for demo
    }

    if (tocItems.length > 0) {
      // Table of Contents section
      doc.setFillColor(248, 250, 252); // Gray-50
      doc.rect(margin, currentY, contentWidth, 8, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Table of Contents', margin + 5, currentY + 6);
      currentY += 15;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      tocItems.slice(0, 8).forEach((item, index) => {
        const indent = item.level * 10;
        doc.text(`${' '.repeat(indent/2)}• ${item.title}`, margin + 5 + indent, currentY);
        currentY += 5;
      });
      currentY += 10;
    }

    // Process content with advanced markdown formatting
    const processedLines = [];
    const lines = policyContent.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('# ')) {
        processedLines.push({ type: 'h1', text: trimmedLine.substring(2), style: { fontSize: 18, font: 'bold', color: [15, 23, 42], spaceBefore: 15, spaceAfter: 8 } });
      } else if (trimmedLine.startsWith('## ')) {
        processedLines.push({ type: 'h2', text: trimmedLine.substring(3), style: { fontSize: 14, font: 'bold', color: [30, 58, 138], spaceBefore: 12, spaceAfter: 6 } });
      } else if (trimmedLine.startsWith('### ')) {
        processedLines.push({ type: 'h3', text: trimmedLine.substring(4), style: { fontSize: 12, font: 'bold', color: [55, 65, 81], spaceBefore: 8, spaceAfter: 4 } });
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        processedLines.push({ type: 'bullet', text: trimmedLine.substring(2), style: { fontSize: 10, font: 'normal', color: [75, 85, 99], indent: 10, spaceBefore: 2, spaceAfter: 2 } });
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        processedLines.push({ type: 'numbered', text: trimmedLine, style: { fontSize: 10, font: 'normal', color: [75, 85, 99], indent: 10, spaceBefore: 2, spaceAfter: 2 } });
      } else if (trimmedLine.length > 0) {
        // Process bold and italic text
        let processedText = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1');

        const isBold = /\*\*(.*?)\*\*/.test(trimmedLine);
        processedLines.push({
          type: 'paragraph',
          text: processedText,
          style: {
            fontSize: 10,
            font: isBold ? 'bold' : 'normal',
            color: [75, 85, 99],
            spaceBefore: 3,
            spaceAfter: 3
          }
        });
      } else {
        processedLines.push({ type: 'space', style: { spaceBefore: 3 } });
      }
    });

    // Render processed content
    processedLines.forEach((item, index) => {
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = margin;
      }

      if (item.style) {
        currentY += item.style.spaceBefore || 0;

        if (item.type !== 'space') {
          doc.setFontSize(item.style.fontSize);
          doc.setFont('helvetica', item.style.font);
          doc.setTextColor(...(item.style.color || [0, 0, 0]));

          const x = margin + (item.style.indent || 0);
          const maxWidth = contentWidth - (item.style.indent || 0);

          if (item.type === 'bullet') {
            doc.text('•', x - 5, currentY);
          }

          if (item.text) {
            const textLines = doc.splitTextToSize(item.text, maxWidth);
            textLines.forEach((textLine, lineIndex) => {
              if (currentY > pageHeight - 40) {
                doc.addPage();
                currentY = margin;
              }
              doc.text(textLine, x, currentY);
              if (lineIndex < textLines.length - 1) currentY += 5;
            });
          }

          currentY += item.style.spaceAfter || 0;
        }
      }
    });

    // Professional footer with modern styling
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer background with gradient effect (simulated)
      doc.setFillColor(248, 250, 252);
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

      // Footer line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(0, pageHeight - 25, pageWidth, pageHeight - 25);

      // Footer content
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');

      // Left: Company and document info
      doc.text(`${metadata.companyName} • ${metadata.title}`, margin, pageHeight - 15);
      doc.text(`Generated by PoliGap AI • Confidential Document`, margin, pageHeight - 8);

      // Center: Version and date
      const centerText = `Version 1.0 • ${metadata.generatedDate}`;
      const centerX = (pageWidth - doc.getTextWidth(centerText)) / 2;
      doc.text(centerText, centerX, pageHeight - 15);

      // Right: Page numbers
      const pageText = `Page ${i} of ${totalPages}`;
      doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), pageHeight - 15);

      // Document status
      if (i === 1) {
        doc.setFontSize(7);
        doc.setTextColor(34, 197, 94);
        doc.text('DRAFT - FOR REVIEW', pageWidth - margin - 40, pageHeight - 8);
      }
    }

    return doc;
  };

  const handleGenerate = async () => {
    if (!companyName || !industry || !policyType) {
      setError('Please fill in all required fields');
      return;
    }

    // Prevent duplicate calls if already generating
    if (generating) {
      return;
    }

    setGenerating(true);
    setError('');
    setProgress('Initializing AI policy generation...');
    
    try {
      setProgress('Analyzing industry requirements...');
      
      const selectedPolicy = policyTypes.find(p => p.id === policyType);
      const prompt = `Generate a comprehensive ${selectedPolicy.name} for ${companyName}, a ${companySize || 'medium-sized'} ${industry} company${jurisdiction ? ` operating in ${jurisdiction}` : ''}.

      Requirements:
      - Professional, legally compliant, and industry-specific content
      - Use clear markdown formatting with headers (# ## ###), bullet points, and emphasis
      - Include sections: Purpose, Scope, Policy Details, Compliance Requirements, Implementation, and Enforcement
      - Target length: 1200-1800 words
      - Consider ${companySize || 'medium'} company size implications
      ${additionalRequirements ? `- Additional requirements: ${additionalRequirements}` : ''}

      Format the response in clear markdown structure suitable for both digital viewing and PDF generation.`;

      setProgress('Generating policy content with AI...');

      const response = await analyzeWithGemini(prompt, {
        temperature: 0.7,
        maxOutputTokens: 4000,
        topP: 0.8,
        topK: 40,
        enhancedFormatting: true,
        isPolicyGeneration: true
      });

      setProgress('Formatting and finalizing document...');
      
      setGeneratedPolicy(response);
      setProgress('');
      
    } catch (err) {
      console.error('Generation error:', err);

      let userFriendlyMessage = 'Failed to generate policy';

      if (err.message) {
        if (err.message.includes('stream already read')) {
          userFriendlyMessage = 'Network error occurred. Please try again.';
        } else if (err.message.includes('API request failed')) {
          userFriendlyMessage = 'Unable to connect to AI service. Please check your connection and try again.';
        } else if (err.message.includes('Invalid JSON')) {
          userFriendlyMessage = 'Received invalid response from AI service. Please try again.';
        } else if (err.message.includes('API key')) {
          userFriendlyMessage = 'AI service configuration error. Please contact support.';
        } else {
          userFriendlyMessage = err.message;
        }
      }

      setError(userFriendlyMessage);
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedPolicy) return;
    
    try {
      const selectedPolicy = policyTypes.find(p => p.id === policyType);
      const metadata = {
        title: selectedPolicy.name,
        companyName,
        industry,
        companySize: companySizes.find(s => s.value === companySize)?.label || 'Not specified',
        jurisdiction: jurisdiction || 'Not specified',
        generatedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      const doc = await generatePolicyPDF(generatedPolicy, metadata);
      doc.save(`${companyName}_${selectedPolicy.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors focus-ring rounded-lg px-3 py-2 self-start"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">AI Policy Generator</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Create professional policies in minutes with AI</p>
            </div>

            <div className="w-24 lg:w-32 hidden lg:block"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Form Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 mb-8 animate-fadeInUp">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Policy Configuration</h2>
              <p className="text-gray-600 text-sm lg:text-base">Provide details to generate your custom policy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Industry *
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select industry...</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Company Size *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {companySizes.map((size) => (
                  <label
                    key={size.value}
                    className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                      companySize === size.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="companySize"
                      value={size.value}
                      checked={companySize === size.value}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg mr-3">{size.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{size.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Jurisdiction/Region
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select jurisdiction...</option>
                {jurisdictions.map((jur) => (
                  <option key={jur} value={jur}>{jur}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Additional Requirements (Optional)
            </label>
            <textarea
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Specify any additional compliance requirements, industry standards, or specific clauses needed..."
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-2xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            />
          </div>

          {/* Policy Type Selection */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Policy Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policyTypes.map((policy) => (
                <label
                  key={policy.id}
                  className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                    policyType === policy.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="policyType"
                    value={policy.id}
                    checked={policyType === policy.id}
                    onChange={(e) => setPolicyType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{policy.icon}</span>
                      <span className="font-semibold text-gray-900">{policy.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{policy.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8">
            <button
              onClick={handleGenerate}
              disabled={generating || !companyName || !industry || !policyType || !companySize}
              className="w-full bg-gradient-primary text-white text-base lg:text-lg font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-2xl btn-hover focus-ring disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {generating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Policy...
                </div>
              ) : (
                '🚀 Generate AI Policy'
              )}
            </button>
            {(!companyName || !industry || !policyType || !companySize) && (
              <p className="text-amber-600 text-sm mt-2 text-center">
                Please fill in all required fields to generate policy
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          {progress && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-blue-500 rounded-full mr-3 animate-ai-pulse"></div>
                <p className="text-blue-800 font-medium">{progress}</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-red-500 rounded-full mr-3 mt-0.5"></div>
                <div>
                  <p className="text-red-800 font-medium">Generation Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generated Policy Display */}
        {generatedPolicy && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-200 animate-fadeInUp">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Generated Policy</h3>
                  <p className="text-gray-600 text-sm lg:text-base">Review and download your custom policy</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('formatted')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      viewMode === 'formatted'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📄 Formatted
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      viewMode === 'raw'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🔤 Raw Text
                  </button>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-semibold btn-hover focus-ring text-sm lg:text-base"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden">
              {viewMode === 'formatted' ? (
                <div className="p-6 lg:p-8 max-h-[600px] overflow-y-auto prose prose-gray max-w-none">
                  <div
                    className="policy-content"
                    dangerouslySetInnerHTML={{ __html: formatPolicyContent(generatedPolicy) }}
                  />
                </div>
              ) : (
                <div className="p-6 lg:p-8 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-mono">
                    {generatedPolicy}
                  </pre>
                </div>
              )}
            </div>

            {/* Policy Metadata */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-blue-900">Company:</span>
                  <p className="text-blue-800">{companyName}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-900">Industry:</span>
                  <p className="text-blue-800">{industry}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-900">Size:</span>
                  <p className="text-blue-800">{companySizes.find(s => s.value === companySize)?.label || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-900">Generated:</span>
                  <p className="text-blue-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default PolicyGenerator;
