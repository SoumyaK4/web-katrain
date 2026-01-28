import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notFound: path.resolve(__dirname, '404.html'),
      },
      output: {  
      manualChunks: {  
        vendor: ['react', 'react-dom'],  
        tfjs: ['@tensorflow/tfjs', '@tensorflow/tfjs-backend-wasm', '@tensorflow/tfjs-backend-webgpu'],  
        ui: ['zustand', 'react-icons']  
      }  
      }  
    },
    chunkSizeWarningLimit: 1000 
  },
  resolve: {
    alias: {
      'use-sync-external-store/shim/with-selector.js': path.resolve(
        __dirname,
        'src/shims/useSyncExternalStoreWithSelector.ts'
      ),
    },
  },
  server: {
    headers: {
      // Required for SharedArrayBuffer (enables threaded WASM backend when available).
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      // PWA headers  
      'Cache-Control': 'public, max-age=31536000',  
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cache-Control': 'public, max-age=31536000', 
    },
  },
});
