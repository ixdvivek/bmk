// Downloads every design asset listed in figma-assets.json.
// Run from the repo root on a machine that can reach figma.com:  npm run assets
//
// Entries are either  "path": "url"            → saved as-is (icons, logos, SVGs)
//                 or  "path": { url, webp }    → photo, resized + encoded to WebP
//   webp.maxWidth  downscale so width ≤ maxWidth
//   webp.minSide   downscale so the shorter side is still ≥ minSide (for cover-cropped cards)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { assets } = JSON.parse(await readFile(resolve(root, 'scripts/figma-assets.json'), 'utf8'));

async function toWebp(buf, { maxWidth, minSide, quality = 80 }) {
  let img = sharp(buf);
  const { width, height } = await img.metadata();
  if (maxWidth && width > maxWidth) img = img.resize({ width: maxWidth });
  if (minSide && Math.min(width, height) > minSide) {
    img = width < height ? img.resize({ width: minSide }) : img.resize({ height: minSide });
  }
  return img.webp({ quality, effort: 6 }).toBuffer();
}

let ok = 0;
const failed = [];
await Promise.all(
  Object.entries(assets).map(async ([path, entry]) => {
    const { url, webp } = typeof entry === 'string' ? { url: entry } : entry;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let buf = Buffer.from(await res.arrayBuffer());
      if (webp) buf = await toWebp(buf, webp);
      const out = resolve(root, path);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, buf);
      ok++;
      console.log(`✓ ${path} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failed.push(path);
      console.error(`✗ ${path}: ${err.message}`);
    }
  }),
);

console.log(`\n${ok} downloaded, ${failed.length} failed.`);
if (failed.length) {
  console.log('Expired links? Ask Claude to refresh scripts/figma-assets.json from the Figma file.');
  process.exitCode = 1;
}
