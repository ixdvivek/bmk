// Builds src/data/globe-dots.json: evenly spaced dots on a sphere (Fibonacci
// lattice), kept only where there is land. Run once: `npm run globe-dots`.
// Land: Natural Earth 1:50m via world-atlas (dev dependency only; the site
// ships just the dot list).
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import sharp from 'sharp';

const N = 46000; // points on the whole sphere; ~26% land (no Antarctica) → ~12k dots
const W = 4096;
const H = 2048;

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-50m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);

// Equirectangular land mask as an SVG, rasterised with sharp
const px = ([lon, lat]) => `${(((lon + 180) / 360) * W).toFixed(1)},${(((90 - lat) / 180) * H).toFixed(1)}`;
const ring = (r) => `M${r.map(px).join('L')}Z`;
const polys = land.features.flatMap((f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates));
const d = polys.map((p) => p.map(ring).join('')).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><path d="${d}" fill="#fff" fill-rule="evenodd"/></svg>`;
const { data } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
const isLand = (lat, lon) => {
  const x = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W));
  const y = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H));
  return data[y * W + x] > 127;
};

const out = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  if (lat < -58) continue; // no Antarctica
  let lon = ((i * golden * 180) / Math.PI) % 360;
  if (lon > 180) lon -= 360;
  if (isLand(lat, lon)) out.push(+lat.toFixed(1), +lon.toFixed(1));
}
writeFileSync(new URL('../src/data/globe-dots.json', import.meta.url), JSON.stringify({ n: N, dots: out }));
console.log(`${out.length / 2} land dots`);
