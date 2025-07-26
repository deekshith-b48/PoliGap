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
    include: ['pdfjs-dist']
  },
  worker: {
    format: 'es'
  },
  assetsInclude: ['**/*.worker.js']
});
