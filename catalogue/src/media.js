// Photography and brand styling for the catalogue. Kept apart from the shared
// catalogue data (wireframe/src/data.js) so the wireframe stays image-free.
// Anything missing here falls back to the studio stage with a category glyph.
const M = '../assets/catalogue/';

/** Brand accent drives the brand page (tabs, card stages, hover CTA) and the
 *  "More from {brand}" strip. On hover a product card's CTA fills with `color`.
 *  `on` is the label colour on top of it: black or white, picked per brand in
 *  the admin (dev handoff: "Brand accent colour" + "Label on accent" fields)
 *  for the best contrast — e.g. black on Nikon yellow, white on Samsung blue. */
export const brandStyle = {
  nikon: { color: '#ffec33', on: '#121212', hero: `${M}heroes/brand-nikon.webp` },
  fujifilm: { color: '#e60012', on: '#ffffff' },
  samsung: { color: '#1428a0', on: '#ffffff' },
  lg: { color: '#a50034', on: '#ffffff' },
  sujata: { color: '#6d6e71', on: '#ffffff' },
};
export const brandColor = (id) => brandStyle[id] || { color: '#1f487d', on: '#ffffff' };

/** Hero photography per category (falls back to its group, then to no image). */
export const categoryHero = {
  'mirrorless-dslr-cameras': `${M}heroes/category-mirrorless-cameras.webp`,
  imaging: `${M}heroes/category-mirrorless-cameras.webp`,
};

/** Product photography.
 *  card  – the listing photo
 *  brand – the brand-colour shot used on brand surfaces (cut-out or pre-coloured)
 *  shots – gallery images by shot name (matches product.images)
 *  features – one image per overview feature, in order */
const P = `${M}products/`;
export const productMedia = {
  'nikon-zf': { card: `${P}nikon-zf.webp`, brand: `${P}nikon-zf--brand.webp` },
  'nikon-z8': {
    card: `${P}nikon-z8.webp`,
    brand: `${P}nikon-z8--brand.webp`,
    shots: { Front: `${P}nikon-z8--front.webp`, Back: `${P}nikon-z8--back.webp`, Top: `${P}nikon-z8--top.webp`, Side: `${P}nikon-z8--side.webp` },
    features: [1, 2, 3, 4].map((i) => `${M}features/nikon-z8-${i}.webp`),
  },
  'fujifilm-x-t5': { card: `${P}fujifilm-x-t5.webp` },
  'fujifilm-x-h2s': { card: `${P}fujifilm-x-h2s.webp` },
  'nikkor-z-50mm-f12-s': { card: `${P}nikkor-z-50mm-f12-s.webp`, brand: `${P}nikkor-z-50mm-f12-s.webp` },
  'nikkor-z-70-200mm-f28-vr-s-ii': { card: `${P}nikkor-z-70-200mm-f28-vr-s-ii.webp`, brand: `${P}nikkor-z-70-200mm-f28-vr-s-ii.webp` },
};
export const mediaOf = (p) => productMedia[p.slug] || {};

/** Swatch colours for colour names used in the catalogue. */
const swatches = { black: '#000100', silver: '#d9d9d9', white: '#ffffff', grey: '#8a8f99', gray: '#8a8f99', blue: '#3b5ba5', green: '#5d7a5a', pink: '#f2b8c6', red: '#c8102e', beige: '#d8c8b0', brown: '#6b4f3a', obsidian: '#1d1d1f', porcelain: '#ece8e1', hazel: '#8d8a73' };
export const swatch = (name, i = 0) => {
  const k = String(name).toLowerCase();
  const hit = Object.keys(swatches).find((s) => k.includes(s));
  return hit ? swatches[hit] : `hsl(215 ${10 + i * 8}% ${85 - i * 15}%)`;
};
