// Quick test script to verify Gemini API key functionality
async function testGeminiAPI() {
  const apiKey = 'AIzaSyBEyNqivrte8K4J_pu6bWzsTfics57MNNA';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  console.log('Testing Gemini API key...');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: "Hello! Please respond with 'API is working correctly' to confirm the connection." 
          }] 
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50
        }
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Generated text:', responseText);
      console.log('✅ API key is working correctly!');
      return true;
    } else {
      console.error('❌ Invalid response format');
      return false;
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
}

// Run the test
testGeminiAPI().then(success => {
  if (success) {
    console.log('\n🎉 Gemini API integration is ready!');
  } else {
    console.log('\n❌ There was an issue with the API key. Please check the configuration.');
  }
});
