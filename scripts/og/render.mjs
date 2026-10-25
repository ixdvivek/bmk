// Renders the social share card (Open Graph / X) to public/og-image.jpg.
// Run: `npm run og`. Needs Playwright with Chromium (project or global install).
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const { chromium } = await import('playwright').catch(() => createRequire(import.meta.url)('playwright'));
const root = resolve(import.meta.dirname, '../..');
const types = { '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const file = resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://x').pathname)}`);
    if (!file.startsWith(root)) throw new Error('outside');
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${port}/scripts/og/card.html`);
await page.waitForSelector('body[data-ready]');
await page.screenshot({ path: resolve(root, 'public/og-image.jpg'), type: 'jpeg', quality: 90 });
await browser.close();
server.close();
console.log('public/og-image.jpg');
