import RulesBenchmarkingEngine from './rulesBenchmarking.js';

export async function analyzeDocument(text, config = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
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
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
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
    You are an expert compliance analyst with rules benchmarking capabilities. Analyze this policy document against regulatory frameworks and provide enhanced gap analysis with benchmarking insights.

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

    IMPORTANT: You MUST respond with ONLY valid JSON in this exact format:

{
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', responseText);

    // Clean up the response text - remove markdown formatting if present
    let cleanedResponse = responseText.trim();
    
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
      console.error('Original response:', responseText);
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

// Simple chat function for AI Expert chat
export async function analyzeWithGemini(prompt, config = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.7,
          topK: config.topK || 20,
          topP: config.topP || 0.8,
          maxOutputTokens: config.maxOutputTokens || 1000,
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}
