import RulesBenchmarkingEngine from './rulesBenchmarking.js';

export async function analyzeDocument(text, config = {}) {
  // Use environment variable or fallback to direct API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBEyNqivrte8K4J_pu6bWzsTfics57MNNA';
  
  // Extract configuration with defaults and ensure proper types
  let selectedFrameworks = config.frameworks;
  const industry = config.industry || 'Technology';
  
  // Ensure selectedFrameworks is always an array
  if (!selectedFrameworks) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  } else if (!Array.isArray(selectedFrameworks)) {
    selectedFrameworks = [selectedFrameworks];
  } else if (selectedFrameworks.length === 0) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  }
  
  console.log('API Key available:', !!apiKey);
  console.log('API Key (first 10 chars):', apiKey?.substring(0, 10));
  console.log('Selected Frameworks (processed):', selectedFrameworks);
  console.log('Industry:', industry);
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please check your API key configuration.');
  }

  // Ensure frameworksArray is definitely an array
  const frameworksArray = Array.isArray(selectedFrameworks) ? selectedFrameworks : [selectedFrameworks].filter(Boolean);

  // Initialize benchmarking engine and perform comprehensive analysis
  const benchmarkingEngine = new RulesBenchmarkingEngine();
  const benchmarkResults = benchmarkingEngine.performComprehensiveBenchmarking(text, frameworksArray, industry);

  console.log('Benchmarking completed. Average score:', benchmarkResults.overallResults.averageScore);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  console.log('Making request to:', url.replace(apiKey, 'HIDDEN_API_KEY'));

  const prompt = `
    You are an expert compliance analyst with rules benchmarking capabilities. First, validate that this is a legitimate policy or official business document, then analyze it against regulatory frameworks.

    DOCUMENT VALIDATION CRITERIA:
    - Must be a policy document (privacy policy, security policy, HR policy, etc.)
    - Official business documents (code of conduct, compliance framework, employee handbook)
    - Regulatory or governance documents
    - NOT personal documents (resumes, cover letters, personal statements)
    - NOT academic papers, research documents, or scholarly articles  
    - NOT marketing materials, brochures, or promotional content
    - NOT invoices, receipts, or financial records
    - NOT fiction, stories, novels, or creative writing

    BENCHMARKING RESULTS:
    - Overall Compliance Score: ${benchmarkResults.overallResults.averageScore}%
    - Industry Benchmark (${industry}): ${benchmarkResults.overallResults.industryBenchmark.average}%
    - Performance Level: ${benchmarkResults.overallResults.benchmarkComparison}
    - Critical Gaps: ${benchmarkResults.overallResults.criticalGaps}
    - High Priority Gaps: ${benchmarkResults.overallResults.highGaps}
    - Total Strengths Identified: ${benchmarkResults.overallResults.totalStrengths}

    FRAMEWORK SCORES:
    ${Object.entries(benchmarkResults.frameworkResults).map(([framework, results]) => 
      `- ${framework} (${results.frameworkFullName}): ${results.overallScore}% - ${results.maturityLevel} maturity`
    ).join('\n    ')}

    TOP PRIORITY RECOMMENDATIONS:
    ${benchmarkResults.prioritizedRecommendations.slice(0, 5).map(rec => 
      `- Priority ${rec.priority}: ${rec.title} (${rec.framework} - ${rec.criticality})`
    ).join('\n    ')}

    If this document is NOT a policy or official business document, respond with:
    {
      "documentValidation": {
        "isValid": false,
        "documentType": "detected_type",
        "reason": "Quirky rejection message explaining why this isn't appropriate"
      }
    }

    If this IS a valid policy document, respond with the full analysis in this exact JSON format:

{
  "documentValidation": {
    "isValid": true,
    "documentType": "policy",
    "reason": ""
  },
  "summary": "Executive summary including benchmarking insights and industry comparison",
  "overallScore": ${benchmarkResults.overallResults.averageScore},
  "industryBenchmark": {
    "userScore": ${benchmarkResults.overallResults.averageScore},
    "industryAverage": ${benchmarkResults.overallResults.industryBenchmark.average},
    "comparison": "${benchmarkResults.overallResults.benchmarkComparison}",
    "industry": "${industry}"
  },
  "benchmarkingResults": {
    "frameworks": ${JSON.stringify(benchmarkResults.frameworkResults, null, 0).replace(/"/g, '\\"')},
    "complianceMatrix": ${JSON.stringify(benchmarkResults.complianceMatrix, null, 0).replace(/"/g, '\\"')},
    "strengths": ${JSON.stringify(benchmarkResults.topStrengths, null, 0).replace(/"/g, '\\"')}
  },
  "totalGaps": ${benchmarkResults.prioritizedRecommendations.length},
  "gaps": [
    ${benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => `{
      "issue": "${rec.title} - ${rec.gaps.join('; ').replace(/"/g, '\\"')}",
      "severity": "${rec.criticality}",
      "framework": "${rec.framework}",
      "currentScore": ${rec.currentScore},
      "targetScore": ${rec.targetScore},
      "businessImpact": "${rec.businessImpact}",
      "timeframe": "${rec.timeframe}",
      "effort": "${rec.estimatedEffort}",
      "remediation": "${rec.recommendations.join('; ').replace(/"/g, '\\"')}"
    }`).join(', ')}
  ],
  "prioritizedActions": ${JSON.stringify(benchmarkResults.prioritizedRecommendations.slice(0, 10), null, 0).replace(/"/g, '\\"')}
}

    Document text analyzed: "${text.substring(0, 2000)}..."
  `;

  console.log('Starting analyzeDocument API request...');
  console.log('Text length:', text.length);
  console.log('Frameworks:', frameworksArray);
  console.log('Industry:', industry);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Read the response body only once
    let responseText;
    let responseData;

    try {
      responseText = await response.text();
    } catch (readError) {
      console.error('Failed to read response body:', readError);
      throw new Error('Failed to read API response');
    }

    if (!response.ok) {
      console.error('API Error Response:', responseText);
      throw new Error(`API request failed: ${response.status} - ${responseText}`);
    }

    try {
      responseData = JSON.parse(responseText);
      console.log('API Response received successfully');
      console.log('Response has candidates:', !!responseData.candidates);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      console.error('Raw response text:', responseText);
      throw new Error(`Invalid JSON response from API: ${jsonError.message}`);
    }

    const data = responseData;

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Clean up the response text - remove markdown formatting if present
    let cleanedResponse = generatedText.trim();
    
    // Remove markdown code blocks if they exist
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }

    console.log('Cleaned response:', cleanedResponse);

    try {
      const result = JSON.parse(cleanedResponse);
      
      // Check for document validation first
      if (result.documentValidation && !result.documentValidation.isValid) {
        throw new Error(`Invalid document type: ${result.documentValidation.reason}`);
      }
      
      // Validate the response structure and ensure benchmarking data is included
      if (!result.summary || !result.gaps || !Array.isArray(result.gaps)) {
        throw new Error('Invalid response structure');
      }
      
      // Ensure totalGaps matches actual gaps length
      result.totalGaps = result.gaps.length;
      
      // Ensure benchmarking results are included
      if (!result.benchmarkingResults) {
        result.benchmarkingResults = benchmarkResults;
      }
      
      // Add industry benchmark if missing
      if (!result.industryBenchmark) {
        result.industryBenchmark = {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        };
      }
      
      return result;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Original response:', generatedText);
      console.error('Cleaned response:', cleanedResponse);
      
      // Return comprehensive fallback with benchmarking results
      return {
        summary: `Rules benchmarking analysis completed. Overall compliance score: ${benchmarkResults.overallResults.averageScore}%. ${benchmarkResults.overallResults.benchmarkComparison} compared to ${industry} industry average of ${benchmarkResults.overallResults.industryBenchmark.average}%.`,
        overallScore: benchmarkResults.overallResults.averageScore,
        industryBenchmark: {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        },
        benchmarkingResults: benchmarkResults,
        totalGaps: benchmarkResults.prioritizedRecommendations.length,
        gaps: benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => ({
          issue: `${rec.framework} compliance: ${rec.title}`,
          severity: rec.criticality,
          framework: rec.framework,
          currentScore: rec.currentScore,
          targetScore: rec.targetScore,
          businessImpact: rec.businessImpact,
          timeframe: rec.timeframe,
          effort: rec.estimatedEffort,
          remediation: rec.recommendations.join('; ')
        })),
        prioritizedActions: benchmarkResults.prioritizedRecommendations.slice(0, 10)
      };
    }
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);

    // Check for specific error types
    if (error.message && error.message.includes('stream already read')) {
      console.error('Response body was consumed multiple times - this should be fixed now');
    }
    if (error.name === 'AbortError') {
      console.error('Request was aborted (likely timeout)');
    }

    // Return benchmarking results even if API completely fails
    return {
      summary: `Automated rules benchmarking completed despite API error. Compliance score: ${benchmarkResults.overallResults.averageScore}%. ${benchmarkResults.overallResults.criticalGaps} critical gaps identified.`,
      overallScore: benchmarkResults.overallResults.averageScore,
      industryBenchmark: {
        userScore: benchmarkResults.overallResults.averageScore,
        industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
        comparison: benchmarkResults.overallResults.benchmarkComparison,
        industry: industry
      },
      benchmarkingResults: benchmarkResults,
      totalGaps: benchmarkResults.prioritizedRecommendations.length,
      gaps: benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => ({
        issue: `${rec.framework}: ${rec.title}`,
        severity: rec.criticality,
        framework: rec.framework,
        currentScore: rec.currentScore,
        targetScore: rec.targetScore,
        businessImpact: rec.businessImpact,
        timeframe: rec.timeframe,
        effort: rec.estimatedEffort,
        remediation: rec.recommendations.join('; ')
      })),
      prioritizedActions: benchmarkResults.prioritizedRecommendations.slice(0, 10),
      error: 'AI analysis failed, but rules benchmarking results available'
    };
  }
}

// Enhanced function for AI Expert chat and policy generation with improved formatting
export async function analyzeWithGemini(prompt, config = {}) {
  // Use environment variable or fallback to direct API key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBEyNqivrte8K4J_pu6bWzsTfics57MNNA';

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please check your API key configuration.');
  }

  const {
    temperature = 0.7,
    maxOutputTokens = 4000,
    topP = 0.8,
    topK = 40,
    enhancedFormatting = false,
    isPolicyGeneration = false
  } = config;

  // Enhanced prompt for better policy generation with README-style formatting
  const enhancedPrompt = isPolicyGeneration ? `
${prompt}

IMPORTANT FORMATTING GUIDELINES:
- Use clear markdown headers (# for main sections, ## for subsections, ### for sub-subsections)
- Use bullet points (-) for lists and numbered lists (1., 2., 3.) where appropriate
- Use **bold** for important terms, policies, and requirements
- Use *italics* for emphasis and definitions
- Use \`code blocks\` for specific references, dates, or technical terms
- Structure content with clear paragraphs and proper spacing
- Include relevant legal disclaimers and compliance notes
- Ensure professional, clear, and actionable language
- Use proper section breaks and logical flow
- Include specific implementation guidance where applicable
- Format compliance requirements as clear bullet points
- Use consistent terminology throughout
- Include version control and effective date information

Ensure the output is well-structured for both digital reading and PDF generation.
` : prompt;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature,
          topK,
          topP,
          maxOutputTokens,
          candidateCount: 1,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    console.log('Chat API response status:', response.status);
    console.log('Chat API response ok:', response.ok);

    // Read the response body only once
    let responseText;
    let responseData;

    try {
      responseText = await response.text();
    } catch (readError) {
      console.error('Failed to read response body:', readError);
      throw new Error('Failed to read API response');
    }

    if (!response.ok) {
      console.error('Chat API Error Response:', responseText);
      throw new Error(`API request failed: ${response.status} - ${responseText}`);
    }

    try {
      responseData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      console.error('Raw response text:', responseText);
      throw new Error(`Invalid JSON response from API: ${jsonError.message}`);
    }

    if (!responseData.candidates || !responseData.candidates[0] || !responseData.candidates[0].content) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid API response format');
    }

    const generatedText = responseData.candidates[0].content.parts[0].text.trim();

    // Post-process for better formatting if this is policy generation
    if (isPolicyGeneration || enhancedFormatting) {
      return postProcessPolicyText(generatedText);
    }

    return generatedText;
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    // Provide more user-friendly error messages
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
}

// Post-process policy text for better formatting and accuracy
const postProcessPolicyText = (text) => {
  return text
    // Ensure proper header formatting
    .replace(/^([A-Z][A-Z\s]+)$/gm, '# $1')
    .replace(/^([0-9]+\.)\s*([A-Z][A-Za-z\s]+)$/gm, '## $1 $2')
    .replace(/^([a-z]\))\s*([A-Za-z\s]+)$/gm, '### $1 $2')

    // Ensure proper list formatting
    .replace(/^([\s]*)•([\s]*)/gm, '$1- ')
    .replace(/^([\s]*)([ivx]+\.)([\s]*)/gim, '$1$2 ')

    // Bold important terms
    .replace(/\b(MUST|SHALL|REQUIRED|MANDATORY|PROHIBITED|FORBIDDEN|CRITICAL|ESSENTIAL)\b/g, '**$1**')
    .replace(/\b(Policy|Procedure|Guidelines?|Standards?|Compliance|Violation|Enforcement)\b/g, '**$1**')

    // Italicize definitions and emphasis
    .replace(/\b(defined as|means|refers to|includes)\b/g, '*$1*')

    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')

    // Clean up extra spaces
    .replace(/[ \t]+/g, ' ')
    .replace(/^[ \t]+|[ \t]+$/gm, '')

    // Ensure sections are properly formatted
    .replace(/^(Purpose|Scope|Policy|Procedure|Implementation|Compliance|Enforcement|Definitions|Background|Responsibilities|Violations|Review|Effective Date):/gim, '## $1')

    // Format dates and versions consistently
    .replace(/Version[\s]*([0-9\.]+)/gi, '**Version $1**')
    .replace(/Effective[\s]+Date[\s]*:?[\s]*([^\n]+)/gi, '**Effective Date:** $1')
    .replace(/Last[\s]+Updated[\s]*:?[\s]*([^\n]+)/gi, '**Last Updated:** $1')

    .trim();
};
