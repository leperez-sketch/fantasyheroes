import { defineConfig } from 'vite';

// base './' so GitHub Pages (project site) and local file-style hosts resolve assets.
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
