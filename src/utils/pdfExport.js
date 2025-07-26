import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

class PDFExportUtility {
  constructor() {
    this.colors = {
      primary: [59, 130, 246],      // Blue-500
      secondary: [147, 51, 234],     // Purple-600
      success: [34, 197, 94],        // Green-500
      warning: [245, 158, 11],       // Amber-500
      danger: [239, 68, 68],         // Red-500
      dark: [15, 23, 42],           // Slate-900
      gray: [75, 85, 99],           // Gray-600
      light: [248, 250, 252],       // Gray-50
      white: [255, 255, 255],
      lightGray: [226, 232, 240]    // Slate-200
    };
    
    this.fonts = {
      small: 8,
      normal: 10,
      medium: 12,
      large: 14,
      xlarge: 16,
      xxlarge: 18,
      title: 22
    };
  }

  // Create professional header with branding
  createHeader(doc, title, subtitle, metadata = {}) {
    const pageWidth = doc.internal.pageSize.width;
    
    // Header background gradient effect (simulated with multiple rectangles)
    for (let i = 0; i < 50; i++) {
      const opacity = 1 - (i / 50);
      const grayValue = Math.floor(15 + (opacity * 27)); // From slate-900 to slate-800
      doc.setFillColor(grayValue, grayValue + 8, grayValue + 27);
      doc.rect(0, i, pageWidth, 1, 'F');
    }
    
    // Logo placeholder
    doc.setFillColor(...this.colors.primary);
    doc.roundedRect(20, 15, 35, 35, 4, 4, 'F');
    
    // Logo text
    doc.setTextColor(...this.colors.white);
    doc.setFontSize(this.fonts.large);
    doc.setFont('helvetica', 'bold');
    doc.text('PGA', 30, 38);
    
    // Title
    doc.setFontSize(this.fonts.title);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 65, 25);
    
    // Subtitle
    doc.setFontSize(this.fonts.medium);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 65, 35);
    
    // Metadata
    if (metadata.date) {
      doc.setFontSize(this.fonts.small);
      doc.setTextColor(203, 213, 225); // Slate-300
      doc.text(`Generated: ${metadata.date}`, 65, 45);
    }
    
    // Status badge
    if (metadata.status) {
      const badgeColor = metadata.status === 'COMPLETE' ? this.colors.success : this.colors.warning;
      doc.setFillColor(...badgeColor);
      doc.roundedRect(pageWidth - 70, 20, 50, 15, 3, 3, 'F');
      doc.setTextColor(...this.colors.white);
      doc.setFontSize(this.fonts.small);
      doc.setFont('helvetica', 'bold');
      doc.text(metadata.status, pageWidth - 60, 30);
    }
    
    // Separator line
    doc.setDrawColor(...this.colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(20, 60, pageWidth - 20, 60);
    
    return 75; // Return Y position after header
  }

  // Create professional footer
  createFooter(doc, pageNum, totalPages, metadata = {}) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer background
    doc.setFillColor(...this.colors.light);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    // Footer separator line
    doc.setDrawColor(...this.colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 25, pageWidth, pageHeight - 25);
    
    // Footer content
    doc.setFontSize(this.fonts.small);
    doc.setTextColor(...this.colors.gray);
    doc.setFont('helvetica', 'normal');
    
    // Left: Company info
    const leftText = metadata.company || 'Policy Gap Analyzer';
    doc.text(leftText, 20, pageHeight - 15);
    doc.text('AI-Powered Compliance Analysis', 20, pageHeight - 8);
    
    // Center: Document info
    if (metadata.confidential) {
      const centerText = 'CONFIDENTIAL DOCUMENT';
      const centerX = (pageWidth - doc.getTextWidth(centerText)) / 2;
      doc.setTextColor(...this.colors.danger);
      doc.setFont('helvetica', 'bold');
      doc.text(centerText, centerX, pageHeight - 12);
    }
    
    // Right: Page numbers
    const pageText = `Page ${pageNum} of ${totalPages}`;
    doc.setTextColor(...this.colors.gray);
    doc.setFont('helvetica', 'normal');
    doc.text(pageText, pageWidth - 20 - doc.getTextWidth(pageText), pageHeight - 15);
    
    // Version info
    if (metadata.version) {
      doc.setFontSize(this.fonts.small - 1);
      doc.text(`v${metadata.version}`, pageWidth - 20 - doc.getTextWidth(`v${metadata.version}`), pageHeight - 8);
    }
  }

  // Add section with background
  addSection(doc, title, content, currentY, options = {}) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Check for page break
    if (currentY > doc.internal.pageSize.height - 80) {
      doc.addPage();
      currentY = 30;
    }
    
    // Section header background
    const headerHeight = 12;
    doc.setFillColor(...(options.headerColor || this.colors.light));
    doc.roundedRect(margin, currentY, contentWidth, headerHeight, 2, 2, 'F');
    
    // Section title
    doc.setFontSize(this.fonts.large);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...(options.titleColor || this.colors.dark));
    doc.text(title, margin + 5, currentY + 8);
    
    currentY += headerHeight + 5;
    
    // Content
    if (content) {
      doc.setFontSize(this.fonts.normal);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...this.colors.gray);
      
      const lines = doc.splitTextToSize(content, contentWidth - 10);
      lines.forEach(line => {
        if (currentY > doc.internal.pageSize.height - 40) {
          doc.addPage();
          currentY = 30;
        }
        doc.text(line, margin + 5, currentY);
        currentY += 5;
      });
    }
    
    return currentY + 10;
  }

  // Create score card
  addScoreCard(doc, scores, currentY) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const cardWidth = (pageWidth - margin * 2 - 15) / 4; // 4 cards with spacing
    
    Object.entries(scores).forEach(([ key, value ], index) => {
      const x = margin + (index * (cardWidth + 5));
      const color = this.getScoreColor(value.score || value);
      
      // Card background
      doc.setFillColor(...color);
      doc.roundedRect(x, currentY, cardWidth, 25, 3, 3, 'F');
      
      // Score value
      doc.setTextColor(...this.colors.white);
      doc.setFontSize(this.fonts.xlarge);
      doc.setFont('helvetica', 'bold');
      const scoreText = typeof value === 'object' ? `${value.score}%` : `${value}`;
      const scoreX = x + (cardWidth - doc.getTextWidth(scoreText)) / 2;
      doc.text(scoreText, scoreX, currentY + 12);
      
      // Label
      doc.setFontSize(this.fonts.small);
      doc.setFont('helvetica', 'normal');
      const labelText = (typeof value === 'object' ? value.label : key).toUpperCase();
      const labelX = x + (cardWidth - doc.getTextWidth(labelText)) / 2;
      doc.text(labelText, labelX, currentY + 20);
    });
    
    return currentY + 35;
  }

  // Create data table with styling
  addStyledTable(doc, headers, data, currentY, options = {}) {
    const tableOptions = {
      head: [headers],
      body: data,
      startY: currentY,
      theme: 'grid',
      headStyles: {
        fillColor: options.headerColor || this.colors.primary,
        textColor: this.colors.white,
        fontSize: this.fonts.normal,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: this.fonts.small,
        textColor: this.colors.gray
      },
      alternateRowStyles: {
        fillColor: this.colors.light
      },
      styles: {
        lineColor: this.colors.lightGray,
        lineWidth: 0.5
      },
      margin: { left: 20, right: 20 },
      ...options.tableStyles
    };
    
    // Check if autoTable is available
    if (typeof doc.autoTable === 'function') {
      doc.autoTable(tableOptions);
      return doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback: create simple table manually
      console.warn('autoTable not available, using basic table fallback');
      return this.createBasicTable(doc, data, columns, options);
    }
  }

  // Fallback method for basic table creation when autoTable is not available
  createBasicTable(doc, data, columns, options = {}) {
    const startY = doc.lastAutoTable?.finalY || 80;
    const rowHeight = 20;
    const colWidth = 50;
    let currentY = startY + 20;

    // Draw headers
    doc.setFontSize(this.fonts.medium);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.dark);

    columns.forEach((col, index) => {
      doc.text(col.title || col.header || col, 20 + (index * colWidth), currentY);
    });

    currentY += rowHeight;

    // Draw data rows
    doc.setFont('helvetica', 'normal');
    data.forEach((row) => {
      columns.forEach((col, index) => {
        const value = Array.isArray(row) ? row[index] : (row[col.dataKey] || row[col.key] || '');
        doc.text(String(value).substring(0, 20), 20 + (index * colWidth), currentY);
      });
      currentY += rowHeight;
    });

    return currentY + 10;
  }

  // Get color based on score
  getScoreColor(score) {
    if (score >= 80) return this.colors.success;
    if (score >= 60) return this.colors.warning;
    if (score >= 40) return this.colors.secondary;
    return this.colors.danger;
  }

  // Export analysis results to professional PDF
  async exportAnalysisResults(analysis, options = {}) {
    const doc = new jsPDF();
    const metadata = {
      company: options.company || 'Your Organization',
      date: new Date().toLocaleDateString(),
      version: '1.0',
      status: 'COMPLETE',
      confidential: true
    };
    
    let currentY = this.createHeader(
      doc, 
      'Compliance Analysis Report', 
      'Comprehensive Policy Gap Assessment',
      metadata
    );
    
    // Executive Summary Section
    currentY = this.addSection(
      doc,
      '📊 Executive Summary',
      analysis.summary,
      currentY,
      { headerColor: this.colors.primary.map(c => Math.floor(c * 0.1)) }
    );
    
    // Score Cards
    const scores = {
      'Overall': { score: analysis.overallScore || 0, label: 'Overall Score' },
      'Critical': { score: (analysis.gaps || []).filter(g => g.severity === 'critical').length, label: 'Critical Issues' },
      'High': { score: (analysis.gaps || []).filter(g => g.severity === 'high').length, label: 'High Priority' },
      'Total': { score: (analysis.gaps || []).length, label: 'Total Gaps' }
    };
    
    currentY = this.addScoreCard(doc, scores, currentY);
    
    // Framework Scores Table
    if (analysis.structuredAnalysis?.frameworkScores) {
      currentY = this.addSection(doc, '⚖️ Framework Compliance Scores', null, currentY);
      
      const frameworkData = Object.entries(analysis.structuredAnalysis.frameworkScores).map(([framework, data]) => [
        framework,
        `${data.score}%`,
        `${data.foundRequirements}/${data.totalRequirements}`,
        data.maturityLevel
      ]);
      
      currentY = this.addStyledTable(
        doc,
        ['Framework', 'Score', 'Requirements', 'Maturity'],
        frameworkData,
        currentY,
        { headerColor: this.colors.secondary }
      );
    }
    
    // Compliance Gaps Section
    if (analysis.gaps && analysis.gaps.length > 0) {
      currentY = this.addSection(doc, '🚨 Identified Compliance Gaps', null, currentY);
      
      const gapsData = analysis.gaps.slice(0, 20).map((gap, index) => [
        `#${index + 1}`,
        gap.framework || 'General',
        gap.severity?.toUpperCase() || 'MEDIUM',
        gap.issue?.substring(0, 60) + (gap.issue?.length > 60 ? '...' : ''),
        gap.timeframe || 'TBD'
      ]);
      
      currentY = this.addStyledTable(
        doc,
        ['#', 'Framework', 'Severity', 'Issue', 'Timeline'],
        gapsData,
        currentY,
        { 
          headerColor: this.colors.danger,
          tableStyles: {
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 25 },
              2: { cellWidth: 20 },
              3: { cellWidth: 80 },
              4: { cellWidth: 25 }
            }
          }
        }
      );
    }
    
    // Red Flags Section
    if (analysis.structuredAnalysis?.redFlags && analysis.structuredAnalysis.redFlags.length > 0) {
      if (currentY > doc.internal.pageSize.height - 100) {
        doc.addPage();
        currentY = 30;
      }
      
      currentY = this.addSection(doc, '🔴 Critical Red Flags', null, currentY);
      
      analysis.structuredAnalysis.redFlags.slice(0, 10).forEach((flag, index) => {
        if (currentY > doc.internal.pageSize.height - 60) {
          doc.addPage();
          currentY = 30;
        }
        
        // Red flag card
        const cardHeight = 25;
        doc.setFillColor(254, 242, 242); // Red-50
        doc.roundedRect(20, currentY, doc.internal.pageSize.width - 40, cardHeight, 2, 2, 'F');
        
        // Flag icon and title
        doc.setFontSize(this.fonts.medium);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.colors.danger);
        doc.text(`🚨 ${flag.category}`, 25, currentY + 8);
        
        // Severity badge
        doc.setFillColor(...this.colors.danger);
        doc.roundedRect(doc.internal.pageSize.width - 70, currentY + 3, 45, 10, 2, 2, 'F');
        doc.setTextColor(...this.colors.white);
        doc.setFontSize(this.fonts.small);
        doc.text(flag.severity, doc.internal.pageSize.width - 65, currentY + 10);
        
        // Recommendation
        doc.setFontSize(this.fonts.small);
        doc.setTextColor(...this.colors.gray);
        doc.setFont('helvetica', 'normal');
        const recText = flag.recommendation?.substring(0, 100) + (flag.recommendation?.length > 100 ? '...' : '');
        doc.text(recText, 25, currentY + 18);
        
        currentY += cardHeight + 5;
      });
    }
    
    // Add page numbers to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      this.createFooter(doc, i, totalPages, metadata);
    }
    
    return doc;
  }

  // Export with charts (using html2canvas for visualization)
  async exportWithCharts(analysis, chartElements = []) {
    const doc = await this.exportAnalysisResults(analysis);
    
    if (chartElements.length > 0) {
      doc.addPage();
      let currentY = 30;
      
      doc.setFontSize(this.fonts.large);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...this.colors.dark);
      doc.text('📈 Visual Analysis Charts', 20, currentY);
      currentY += 20;
      
      for (const element of chartElements) {
        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 170;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (currentY + imgHeight > doc.internal.pageSize.height - 30) {
            doc.addPage();
            currentY = 30;
          }
          
          doc.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 15;
        } catch (error) {
          console.warn('Failed to capture chart:', error);
        }
      }
    }
    
    return doc;
  }
}

export default new PDFExportUtility();
