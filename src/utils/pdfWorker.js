// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Get the actual PDF.js version to ensure worker compatibility
    const pdfVersion = pdfjsLib.version || '5.3.93';

    // Try multiple CDN sources for better reliability - using detected version
    const workerSources = [
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.min.js`,
      `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.js`
    ];

    // Set the first worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];
    console.log(`📦 Using PDF.js version ${pdfVersion} with matching worker`);

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
