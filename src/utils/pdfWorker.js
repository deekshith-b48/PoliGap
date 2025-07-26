// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Simply disable worker by default for better compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = false;

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
