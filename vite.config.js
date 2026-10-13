import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages serves it under /bmk/).
  base: './',
  plugins: [tailwindcss()],
  server: { host: true },
});
