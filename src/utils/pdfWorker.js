// PDF.js worker configuration utility
let isWorkerConfigured = false;

export const configurePdfWorker = async () => {
  if (isWorkerConfigured) {
    return;
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');

    // Create an inline worker that runs PDF.js in main thread
    // This avoids external CDN dependencies and network issues
    const workerCode = `
      // Minimal PDF.js worker stub - forces main thread execution
      self.addEventListener('message', function(e) {
        // Return error to force fallback to main thread
        self.postMessage({
          sourceName: e.data.sourceName,
          targetName: e.data.targetName,
          data: { error: 'Use main thread' }
        });
      });
    `;

    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    console.log('✅ PDF.js configured with inline worker (main thread execution)');

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
    verbosity: 0, // Reduce logging
    cMapPacked: true,
    standardFontDataUrl: null, // Don't load external fonts
    ...options
  };

  return pdfjsLib.getDocument(defaultOptions);
};
