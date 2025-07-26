// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Try multiple CDN sources for better reliability
    const workerSources = [
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
    ];

    // Set the first worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

    console.log('✅ PDF.js configured with CDN worker source');
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
    ...options
  };

  return pdfjsLib.getDocument(defaultOptions);
};
