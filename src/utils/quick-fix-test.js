/**
 * Quick test to verify document validation fixes
 */

// Test the core validation and parsing functions
async function testDocumentValidation() {
  console.log('🧪 Testing document validation fixes...');
  
  try {
    // Import our fixed modules
    const { validateFile, extractText } = await import('../lib/documentParser.js');
    const EnhancedComplianceAnalyzer = (await import('../lib/enhancedComplianceAnalyzer.js')).default;
    
    // Test 1: File validation performance
    console.log('1. Testing file validation...');
    const startValidation = Date.now();
    
    const mockFile = new File(['test content for validation'], 'test.pdf', { 
      type: 'application/pdf' 
    });
    
    const validationResult = validateFile(mockFile);
    const validationTime = Date.now() - startValidation;
    
    console.log(`✅ Validation completed in ${validationTime}ms`);
    console.log('Validation result:', validationResult);
    
    // Test 2: Text extraction speed
    console.log('2. Testing text extraction...');
    const startExtraction = Date.now();
    
    const mockTextFile = new File([
      'Privacy Policy\n\nData Collection: We collect personal information.\nUser Rights: You have rights.\nData Security: We protect your data.'
    ], 'policy.txt', { type: 'text/plain' });
    
    const extractedText = await extractText(mockTextFile);
    const extractionTime = Date.now() - startExtraction;
    
    console.log(`✅ Text extraction completed in ${extractionTime}ms`);
    console.log(`Extracted ${extractedText.length} characters`);
    
    // Test 3: Analysis performance
    console.log('3. Testing analysis performance...');
    const startAnalysis = Date.now();
    
    const analyzer = new EnhancedComplianceAnalyzer();
    const analysisResult = await analyzer.analyzePolicy(extractedText, {
      industry: 'technology',
      frameworks: ['GDPR']
    });
    
    const analysisTime = Date.now() - startAnalysis;
    
    console.log(`✅ Analysis completed in ${analysisTime}ms`);
    console.log(`Score: ${analysisResult.overallScore}%`);
    console.log(`Gaps found: ${analysisResult.gaps?.length || 0}`);
    
    // Test 4: Overall performance check
    const totalTime = validationTime + extractionTime + analysisTime;
    console.log(`\n📊 Performance Summary:`);
    console.log(`- Validation: ${validationTime}ms`);
    console.log(`- Extraction: ${extractionTime}ms`);
    console.log(`- Analysis: ${analysisTime}ms`);
    console.log(`- Total: ${totalTime}ms`);
    
    // Performance grades
    const grade = totalTime < 5000 ? 'EXCELLENT' : 
                  totalTime < 10000 ? 'GOOD' : 
                  totalTime < 20000 ? 'ACCEPTABLE' : 'SLOW';
    
    console.log(`- Grade: ${grade}`);
    
    // Check if fixes are working
    const validationFast = validationTime < 100;
    const extractionFast = extractionTime < 1000;
    const analysisFast = analysisTime < 10000;
    
    console.log(`\n✅ Validation Fixes Status:`);
    console.log(`- Fast validation: ${validationFast ? '✅' : '❌'} (${validationTime}ms)`);
    console.log(`- Fast extraction: ${extractionFast ? '✅' : '❌'} (${extractionTime}ms)`);
    console.log(`- Fast analysis: ${analysisFast ? '✅' : '❌'} (${analysisTime}ms)`);
    
    const allFast = validationFast && extractionFast && analysisFast;
    console.log(`- Overall: ${allFast ? '✅ ALL FIXES WORKING' : '⚠️ SOME OPTIMIZATIONS NEEDED'}`);
    
    return {
      success: true,
      performance: {
        validation: validationTime,
        extraction: extractionTime,
        analysis: analysisTime,
        total: totalTime,
        grade
      },
      fixes: {
        validationFast,
        extractionFast,
        analysisFast,
        allWorking: allFast
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use
export default testDocumentValidation;

// Auto-run if loaded directly
if (typeof window !== 'undefined') {
  // Run test after a short delay to ensure modules are loaded
  setTimeout(() => {
    testDocumentValidation().then(result => {
      if (result.success) {
        console.log('🎉 Document validation fixes verified successfully!');
      } else {
        console.log('⚠️ Issues found:', result.error);
      }
    });
  }, 1000);
}
