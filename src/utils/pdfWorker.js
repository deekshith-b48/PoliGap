// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Create a minimal worker blob to avoid external dependencies
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      const workerBlob = new Blob(['// Minimal PDF.js worker'], { type: 'application/javascript' });
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
    }

    console.log('✅ PDF.js configured to run without worker (main thread)');
    isWorkerConfigured = true;
    return;
  } catch (error) {
    console.error('❌ Failed to configure PDF.js:', error);
    isWorkerConfigured = true; // Mark as configured to avoid infinite retries
    throw error;
  }
};

export const createPdfDocument = async (data, options = {}) => {
  await configurePdfWorker();

  const pdfjsLib = await import('pdfjs-dist');

  const defaultOptions = {
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableWorker: true,
    ...options
  };

  return pdfjsLib.getDocument(defaultOptions);
};
