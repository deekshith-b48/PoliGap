// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Try different worker sources in order of preference
    const workerSources = [
      // CDN sources (most reliable)
      '//mozilla.github.io/pdf.js/build/pdf.worker.js',
      '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      // Disable worker as last resort
      false
    ];

    for (const workerSrc of workerSources) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        
        // Test if the worker configuration works
        if (workerSrc !== false) {
          // Quick test to see if worker can be loaded
          const testData = new Uint8Array([37, 80, 68, 70]); // "%PDF" header
          await pdfjsLib.getDocument({ data: testData }).promise;
        }
        
        console.log(`✅ PDF.js worker configured successfully with: ${workerSrc || 'no worker'}`);
        isWorkerConfigured = true;
        return;
      } catch (error) {
        console.warn(`⚠️ Failed to configure PDF worker with ${workerSrc}:`, error.message);
        continue;
      }
    }
    
    throw new Error('All PDF worker configurations failed');
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    isWorkerConfigured = true; // Mark as configured to avoid infinite retries
    throw error;
  }
};

export const createPdfDocument = async (data, options = {}) => {
  await configurePdfWorker();
  
  const pdfjsLib = await import('pdfjs-dist');
  
  const defaultOptions = {
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    ...options
  };

  if (pdfjsLib.GlobalWorkerOptions.workerSrc === false) {
    defaultOptions.disableWorker = true;
  }

  return pdfjsLib.getDocument({
    data,
    ...defaultOptions
  });
};
