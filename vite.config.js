import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages serves it under /bmk/).
  base: './',
  plugins: [tailwindcss()],
  server: { host: true },
  // Pages: the site (/), the catalogue designs (/catalogue/) and the wireframe (/wireframe/ = latest, /wireframe/v1/ = previous round)
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        wireframe: resolve(import.meta.dirname, 'wireframe/index.html'),
        wireframeV1: resolve(import.meta.dirname, 'wireframe/v1/index.html'),
        catalogue: resolve(import.meta.dirname, 'catalogue/index.html'),
      },
    },
  },
});
