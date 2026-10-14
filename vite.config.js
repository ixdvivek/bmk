import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages serves it under /bmk/).
  base: './',
  plugins: [tailwindcss()],
  server: { host: true },
  // Two pages: the site (/) and the wireframe (/wireframe/)
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        wireframe: resolve(import.meta.dirname, 'wireframe/index.html'),
      },
    },
  },
});
