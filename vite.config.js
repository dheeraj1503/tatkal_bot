import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'background') {
    return {
      publicDir: false, // Don't copy public/ into dist/background/
      build: {
        rollupOptions: {
          input: resolve(__dirname, 'src/background/service-worker.js'),
          output: {
            format: 'es',
            entryFileNames: 'service-worker.js',
          },
        },
        outDir: 'dist/background',
        emptyOutDir: true,
      },
    };
  }

  // default: content script (IIFE, fully self-contained)
  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/content/index.jsx'),
        output: {
          format: 'iife',
          name: 'RailAssist',
          entryFileNames: 'content.js',
          assetFileNames: 'content.[ext]',
          inlineDynamicImports: true,
        },
      },
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: true,
    },
  };
});
