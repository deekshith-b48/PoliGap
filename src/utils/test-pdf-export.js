/**
 * Test utility to verify PDF export functionality
 */

export async function testPDFExport() {
  console.log('📄 Testing PDF export functionality...');
  
  try {
    // Import PDF export utility
    const { exportAnalysisResults } = await import('./pdfExport.js');
    
    // Create mock analysis data
    const mockAnalysis = {
      overallScore: 75,
      summary: 'Test analysis summary for PDF export verification',
      gaps: [
        {
          id: 1,
          issue: 'Test gap issue',
          severity: 'medium',
          framework: 'GDPR',
          remediation: 'Test remediation steps'
        }
      ],
      structuredAnalysis: {
        sectionAnalysis: {
          dataCollection: {
            score: 80,
            found: true,
            keywords: ['data', 'collection']
          }
        },
        redFlags: [
          {
            category: 'Test Category',
            severity: 'medium',
            instances: ['test instance']
          }
        ],
        frameworkAnalysis: {
          GDPR: {
            overallScore: 75,
            complianceLevel: 'GOOD'
          }
        }
      },
      documentInfo: {
        fileName: 'test-document.pdf',
        uploadDate: new Date(),
        industry: 'technology'
      }
    };
    
    console.log('1. Testing PDF export with mock data...');
    
    // Test the export function
    try {
      const result = await exportAnalysisResults(mockAnalysis, {
        title: 'Test PDF Export',
        includeCharts: false // Disable charts for simpler test
      });
      
      if (result) {
        console.log('✅ PDF export completed successfully');
        console.log('Result type:', typeof result);
        return { success: true, message: 'PDF export working correctly' };
      } else {
        console.warn('⚠️ PDF export returned no result');
        return { success: false, message: 'PDF export returned empty result' };
      }
      
    } catch (exportError) {
      console.error('❌ PDF export failed:', exportError.message);
      
      // Check if it's specifically the autoTable error
      if (exportError.message.includes('autoTable is not a function')) {
        return { 
          success: false, 
          error: 'autoTable issue persists',
          message: 'The autoTable plugin is still not working correctly'
        };
      } else {
        return { 
          success: false, 
          error: exportError.message,
          message: 'PDF export failed for other reasons'
        };
      }
    }
    
  } catch (importError) {
    console.error('❌ Failed to import PDF export utility:', importError.message);
    return { 
      success: false, 
      error: importError.message,
      message: 'Could not load PDF export utility'
    };
  }
}

// Auto-run test in browser console
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testPDFExport().then(result => {
      if (result.success) {
        console.log('🎉 PDF export test passed!');
      } else {
        console.error('⚠️ PDF export test failed:', result.message);
      }
    }).catch(error => {
      console.error('Test execution failed:', error);
    });
  }, 3000);
}

export default testPDFExport;
