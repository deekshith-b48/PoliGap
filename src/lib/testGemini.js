import { analyzeDocument } from './gemini';

export async function testGeminiAPI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return { error: 'No API key found in environment variables' };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    console.log('Testing API with URL:', url.replace(apiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello, please respond with 'API is working'" }] }]
      })
    });

    console.log('Test response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test API Error:', errorText);
      return { error: `API Error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    console.log('Test API Success:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Test API Exception:', error);
    return { error: error.message };
  }
}

export async function testDocumentAnalysis() {
  const samplePolicy = `
    Privacy Policy
    
    We collect personal information including names, email addresses, and usage data.
    This information may be shared with third parties for marketing purposes.
    Data is stored indefinitely on our servers.
    Users can contact us to request data deletion.
    
    Contact Information:
    Email: info@company.com
  `;

  try {
    console.log('Testing document analysis...');
    const result = await analyzeDocument(samplePolicy);
    console.log('Analysis test result:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Analysis test failed:', error);
    return { error: error.message };
  }
}
