import { brandOf, categoryOf, highlightsFor } from '../../wireframe/src/data.js';
import { mediaOf, brandColor } from './media.js';

/** Site root ("/" in dev, "/bmk/" on GitHub Pages). Every page lives under it:
 *  /about/, /products/, /brand/nikon/ … and the homepage at the root itself. */
export const BASE = import.meta.env.BASE_URL;
export const HOME = BASE;
export const A = `${BASE}assets/`;

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Page URL: href('/brand/nikon', { sort: 'az' }) → "/bmk/brand/nikon/?sort=az" */
export function href(path, params = {}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    q.set(k, Array.isArray(v) ? v.join(',') : v);
  }
  const qs = q.toString();
  const p = path.replace(/^\/+|\/+$/g, '');
  return `${BASE}${p ? `${p}/` : ''}${qs ? `?${qs}` : ''}`;
}

/** Client-side navigation (History API); main.js renders on 'routechange'. */
export function go(url, { replace = false } = {}) {
  history[replace ? 'replaceState' : 'pushState'](null, '', url);
  dispatchEvent(new Event('routechange'));
}

/** Link attributes for a brand: partner brands open their catalogue page; BMK's
 *  own brands (SEEKEN, TEAM) have no brand page and open their website instead. */
export const brandLink = (b) =>
  b.inHouse ? `href="https://${b.sites[0][0]}" target="_blank" rel="noopener"` : `href="${href(`/brand/${b.id}`)}"`;

export const arrow = (tone = 'orange', cls = 'btn-icon') => `<img src="${A}icons/arrow-${tone}.svg" alt="" class="${cls}" width="16" height="16" />`;
/** Arrow drawn as a mask so CSS can recolour it (brand-colour hovers). */
export const arrowMask = (cls = 'btn-icon') => `<span class="arrow-mask ${cls}" aria-hidden="true"></span>`;
/** Inline CSS variables for a brand's colour. */
export const brandVars = (id) => {
  const s = brandColor(id);
  return `--brand:${s.color};--on:${s.on};`;
};

export const icon = {
  search: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m14 14 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  close: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  chev: `<svg class="facet-chev transition-transform duration-300" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 6.2 2.3 2.3L9.5 3.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  filter: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

// Line glyphs per spec template, drawn in the product stage until photos arrive.
const glyphs = {
  camera: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M8 26c0-4 3-7 7-7h14l6-9h26l6 9h38c4 0 7 3 7 7v40c0 4-3 7-7 7H15c-4 0-7-3-7-7z"/><circle cx="60" cy="46" r="20"/><circle cx="60" cy="46" r="12"/><path d="M92 28h12"/></svg>`,
  lens: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="14" y="16" width="70" height="48" rx="6"/><path d="M84 22h16v36H84M100 26h8v28h-8"/><path d="M30 16v48M44 16v48M62 16v48"/></svg>`,
  instantCamera: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="22" y="6" width="76" height="68" rx="14"/><circle cx="56" cy="40" r="16"/><circle cx="56" cy="40" r="8"/><rect x="78" y="14" width="12" height="9" rx="2"/></svg>`,
  film: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="34" y="6" width="52" height="68" rx="3"/><rect x="40" y="12" width="40" height="44" rx="1"/></svg>`,
  printer: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="30" y="14" width="60" height="58" rx="12"/><path d="M42 14V4h36v10"/><path d="M44 30h32"/></svg>`,
  phone: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="40" y="2" width="40" height="76" rx="8"/><rect x="46" y="10" width="28" height="12" rx="6"/></svg>`,
  watch: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><circle cx="60" cy="40" r="22"/><path d="M48 21 51 4h18l3 17M48 59l3 17h18l3-17M82 36h4v8h-4"/></svg>`,
  generic: `<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="30" y="10" width="60" height="60" rx="8"/></svg>`,
};

/** Product image stage. Shows the photo when there is one (`src`), otherwise
 *  a studio stage with the category glyph. `label` names the shot (Front, Back…). */
export function stage(p, { label = '', ratio = '4 / 3', dark = false, cls = '', src = '', brand = false, eager = false } = {}) {
  const tpl = categoryOf(p).template;
  const alt = `${p.name}${label ? `, ${label}` : ''}`;
  if (src)
    return `<div class="stage stage-photo ${brand ? 'stage-brand' : ''} ${cls}" style="aspect-ratio:${ratio}">
      <img class="stage-img" src="${src}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
    </div>`;
  return `<div class="stage ${dark ? 'stage-dark' : ''} ${brand ? 'stage-brand' : ''} ${cls}" style="aspect-ratio:${ratio}" role="img" aria-label="${esc(alt)} (image to come)">
    ${glyphs[tpl] || glyphs.generic}
    ${label ? `<span class="stage-label">${esc(label)}</span>` : ''}
  </div>`;
}

/** Brand mark: the client's logo where we have it, otherwise a clean wordmark. */
// Brand logos in their original colours (Figma: UI Design › brands section).
const logos = Object.fromEntries(['seeken', 'nikon', 'canon', 'fujifilm', 'sony', 'samsung', 'lg', 'sandisk', 'prestige', 'sujata', 'voltas', 'symphony', 'sharp'].map((id) => [id, `brands/${id}.svg`]));
logos['team-appliances'] = 'brands/team.svg';
export function brandMark(b, { light = false, cls = 'h-7' } = {}) {
  if (logos[b.id]) return `<img src="${A}${logos[b.id]}" alt="${esc(b.name)}" class="${cls} w-auto max-w-[150px] object-contain ${light ? 'brightness-0 invert' : ''}" />`;
  return `<span class="${cls} inline-flex items-center text-[22px] leading-none font-bold tracking-[-0.03em] ${light ? 'text-white' : 'text-ink'}">${esc(b.name)}</span>`;
}

/** Card spec rows: a value may use as many lines as its label wraps to, and is
 *  truncated (…) after that. A one-line label keeps a one-line value. */
export function fitSpecRows(root = document) {
  root.querySelectorAll('[data-spec-row]').forEach((row) => {
    const dt = row.firstElementChild;
    const dd = dt.nextElementSibling;
    const lh = parseFloat(getComputedStyle(dt).lineHeight) || dt.offsetHeight;
    const lines = Math.max(1, Math.round(dt.offsetHeight / lh));
    dd.style.webkitLineClamp = dd.style.lineClamp = String(lines);
  });
}

/** Product card — identical in every listing. On brand surfaces (`brand: true`)
 *  it uses the brand-colour shot and the brand-colour hover. */
export function productCard(p, i = 0, { brand = false } = {}) {
  const b = brandOf(p);
  const c = categoryOf(p);
  const hl = highlightsFor(p);
  const m = mediaOf(p);
  const src = brand ? m.brand || m.card : m.card;
  return `
  <article class="pcard group rise ${brand ? 'pcard-brand' : ''}" style="--i:${i % 8};${brand ? brandVars(b.id) : ''}">
    ${stage(p, { src, brand })}
    <div class="flex flex-1 flex-col gap-4 px-4 pt-5 pb-4">
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">${esc(b.name)}</span>
        ${p.colours.length > 1 ? `<span class="flex items-center gap-1" aria-label="${p.colours.length} colours">${p.colours.slice(0, 4).map((_, k) => `<span class="size-2.5 rounded-full border border-ink/15" style="background:hsl(215 ${10 + k * 8}% ${85 - k * 18}%)"></span>`).join('')}${p.colours.length > 4 ? `<span class="text-[11px] text-muted">+${p.colours.length - 4}</span>` : ''}</span>` : ''}
      </div>
      <div>
        <h3 class="text-xl leading-snug font-semibold tracking-[-0.01em]"><a href="${href(`/product/${p.slug}`)}" class="after:absolute after:inset-0">${esc(p.name)}</a></h3>
        <p class="mt-1 text-sm text-muted">${esc(c.name)}</p>
      </div>
      ${
        hl.length
          ? `<dl class="grid gap-1.5 text-[13px]">${hl.map((h) => `<div class="flex items-start gap-3" data-spec-row><dt class="w-[42%] shrink-0 text-muted">${esc(h.label)}</dt><dd class="line-clamp-1 min-w-0 font-medium">${esc(h.value)}</dd></div>`).join('')}</dl>`
          : `<p class="line-clamp-2 text-sm text-muted">${esc(p.short)}</p>`
      }
      <span class="brand-cta">View details ${arrowMask()}</span>
    </div>
  </article>`;
}

export const crumbs = (items, light = false) =>
  `<nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] ${light ? 'text-white/60' : 'text-muted'}">${items
    .map((it, i) =>
      i < items.length - 1
        ? `<a href="${it[1]}" class="transition-colors ${light ? 'hover:text-white' : 'hover:text-ink'}">${esc(it[0])}</a><span aria-hidden="true">/</span>`
        : `<span aria-current="page" class="${light ? 'text-white' : 'text-ink'}">${esc(it[0])}</span>`,
    )
    .join('')}</nav>`;
