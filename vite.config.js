import { resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { groups, categories, brands, products } from './wireframe/src/data.js';

// Every page lives at the site root: / (homepage), /about/, /products/,
// /brand/nikon/, /product/nikon-z8/ … The catalogue app (catalogue/index.html)
// renders all of them, so the build writes its shell to each route folder.
// GitHub Pages serves the site under /bmk/; dev and preview use the same paths.
const BASE = process.env.BASE_PATH || '/bmk/';
// Absolute site URL for the share card (social sites need full URLs).
// Vercel: its production domain; otherwise GitHub Pages. Override with SITE_URL.
const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/` : `https://ixdvivek.github.io${BASE}`);

const routes = () => [
  'products',
  'search',
  'about',
  'faq',
  'contact',
  'terms',
  'privacy',
  'cookies',
  ...groups.map((g) => `category/${g.id}`),
  ...categories.map((c) => `category/${c.id}`),
  ...brands.filter((b) => !b.inHouse).map((b) => `brand/${b.id}`), // SEEKEN and TEAM: website links only
  ...products.map((p) => `product/${p.slug}`),
];
const APP = /^\/(products|search|category|brand|product|about|faq|contact|terms|privacy|cookies)(\/|$)/;

function siteRoutes() {
  let outDir;
  // Dev: any app route is served the catalogue shell
  const rewrite = (base) => (req, _res, next) => {
    const url = new URL(req.url, 'http://x');
    const path = url.pathname.startsWith(base) ? `/${url.pathname.slice(base.length)}` : url.pathname;
    if (APP.test(path) && !/\.\w+$/.test(path)) req.url = `${base}catalogue/index.html`;
    next();
  };
  return {
    name: 'bmk-site-routes',
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL.replace(/\/?$/, '/')),
    configureServer(server) {
      server.middlewares.use(rewrite(server.config.base));
    },
    // Build: copy the catalogue shell into every route folder, and use it as the 404 page
    closeBundle() {
      const shell = readFileSync(resolve(outDir, 'catalogue/index.html'), 'utf8');
      for (const r of routes()) {
        mkdirSync(resolve(outDir, r), { recursive: true });
        writeFileSync(resolve(outDir, r, 'index.html'), shell);
      }
      writeFileSync(resolve(outDir, '404.html'), shell);
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? BASE : '/',
  plugins: [tailwindcss(), siteRoutes()],
  server: { host: true },
  // Entry pages: the homepage, the catalogue app (copied to every route folder)
  // and the wireframes (/wireframe/ = latest, /wireframe/v1/ = previous round)
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
}));
