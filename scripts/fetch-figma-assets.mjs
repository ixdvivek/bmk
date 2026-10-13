// Downloads every design asset listed in figma-assets.json into public/assets.
// Run from the repo root on a machine that can reach figma.com:  npm run assets
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { assets } = JSON.parse(await readFile(resolve(root, 'scripts/figma-assets.json'), 'utf8'));

let ok = 0;
const failed = [];
await Promise.all(
  Object.entries(assets).map(async ([path, url]) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
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
