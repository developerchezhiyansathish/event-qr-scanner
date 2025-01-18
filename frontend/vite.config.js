import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port for your local development server
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Manual chunking for external dependencies
          if (id.includes('node_modules')) {
            return 'vendor'; // All external dependencies will go into a separate chunk named 'vendor'
          }
        },
      },
    },
  },
});
