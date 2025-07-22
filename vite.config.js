import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  // Worker configuration for PDF.js local bundling
  worker: {
    format: 'es',
    rollupOptions: {
      external: ['pdfjs-dist']
    }
  },
  define: {
    global: 'globalThis'
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  // Include PDF.js worker in assets
  assetsInclude: ['**/*.pdf'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdfjs-lib': ['pdfjs-dist'],
          'vendor': ['react', 'react-dom']
        }
      }
    },
    // Increase chunk size warning limit for PDF.js
    chunkSizeWarningLimit: 1600
  }
});
