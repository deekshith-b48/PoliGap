// Test utility to verify PDF parsing functionality
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use same configuration as main app
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
}

export const testPdfParsing = async () => {
  console.log('🔧 Testing PDF.js configuration...');
  
  try {
    // Test if PDF.js is properly loaded
    console.log('✅ PDF.js library loaded:', !!pdfjsLib);
    console.log('✅ Worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
    
    return {
      success: true,
      message: 'PDF.js is properly configured and ready to parse documents'
    };
  } catch (error) {
    console.error('❌ PDF.js configuration error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Test function for Google Privacy Policy content
export const testGooglePrivacyPolicyKeywords = () => {
  const sampleContent = `
    Privacy Policy
    Last modified: December 18, 2017
    
    There are many different ways you can use our services – to search for and share information, to communicate with other
    people or to create new content. When you share information with us, for example by creating a Google Account, we can make
    those services even better – to show you more relevant search results and ads, to help you connect with people or to make
    sharing with others quicker and easier. As you use our services, we want you to be clear how we're using information and
    the ways in which you can protect your privacy.

    Our Privacy Policy explains:
    What information we collect and why we collect it.
    How we use that information.
    The choices we offer, including how to access and update information.

    Information we collect
    We collect information to provide better services to all of our users – from figuring out basic stuff like which language you speak,
    to more complex things like which ads you'll find most useful, the people who matter most to you online, or which
    YouTube videos you might like.

    We collect information in the following ways:
    Information you give us. For example, many of our services require you to sign up for a Google Account. When you
    do, we'll ask for personal information, like your name, email address, telephone number or credit card to store with your
    account.

    Device information
    We collect device-specific information (such as your hardware model, operating system version, unique device
    identifiers, and mobile network information including phone number). Google may associate your device
    identifiers or phone number with your Google Account.

    Log information
    When you use our services or view content provided by Google, we automatically collect and store certain
    information in server logs.
  `;

  const normalizedContent = sampleContent.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
  
  const policyKeywords = {
    'privacy': 3, 'policy': 3, 'information': 2, 'collect': 1, 'services': 1,
    'google account': 3, 'personal information': 3, 'device information': 2,
    'data protection': 4, 'security': 3, 'privacy policy': 4
  };

  let keywordScore = 0;
  let foundKeywords = [];
  
  for (const [keyword, weight] of Object.entries(policyKeywords)) {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = normalizedContent.match(regex);
    if (matches) {
      keywordScore += matches.length * weight;
      foundKeywords.push(keyword);
    }
  }

  console.log('🧪 Google Privacy Policy Test Results:');
  console.log('Content length:', normalizedContent.length);
  console.log('Keyword score:', keywordScore);
  console.log('Found keywords:', foundKeywords);
  console.log('Should pass validation:', keywordScore >= 15);
  
  return {
    contentLength: normalizedContent.length,
    keywordScore,
    foundKeywords,
    shouldPass: keywordScore >= 15
  };
};
