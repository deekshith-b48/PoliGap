# Testing the Gemini API Integration

This guide provides instructions for testing the Google Gemini AI integration in the PoliGap application.

## Prerequisites

1. A valid Google Gemini API key
2. Node.js installed on your system
3. Project dependencies installed (`npm install`)

## Environment Setup

Before running tests, ensure your Gemini API key is properly configured:

1. Create a `.env` file in the project root if not already present
2. Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

## Available Test Commands

PoliGap includes several test scripts to validate the Gemini AI integration:

| Command | Description |
|---------|-------------|
| `npm run test:gemini` | Run all Gemini API tests |
| `npm run test:analyze` | Test document analysis functionality only |
| `npm run test:chat` | Test the chat feature only |
| `npm run test:policy` | Test policy generation only |
| `npm run test:local` | Test with local benchmarking only (no API call) |

## Test Details

### Document Analysis Test

Tests the document analysis feature using a sample policy document. This verifies:
- Proper API request formatting
- Integration with the rules benchmarking engine
- Response parsing and error handling

### Chat Feature Test

Tests the Gemini chat integration with a compliance-related query. This verifies:
- Basic query handling
- Response formatting
- Error handling for chat queries

### Policy Generation Test

Tests the policy generation feature with enhanced formatting. This verifies:
- Enhanced prompt formatting for policy generation
- Post-processing of generated policies
- Markdown formatting improvements

### Local Benchmarking Test

Tests the rules benchmarking engine without making an API call. This verifies:
- Rule matching logic
- Scoring algorithms
- Recommendation prioritization

## Troubleshooting

Common issues and solutions:

1. **API Key Error**: Ensure your API key is properly configured in the `.env` file.
2. **Network Error**: Check your internet connection and firewall settings.
3. **Rate Limiting**: If you encounter rate limiting errors, wait a few minutes and try again.
4. **Response Parsing Errors**: These indicate a mismatch between expected and actual API responses. Check for API changes or update the parsing logic.

## Extending the Tests

To add new tests or modify existing ones:

1. Edit `src/lib/testGemini.js` to add new test functions
2. Update `testGemini.js` in the root directory to expose new test modes
3. Add new npm scripts in `package.json` for easy access to new tests
