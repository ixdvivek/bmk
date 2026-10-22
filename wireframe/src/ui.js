import { brandOf, categoryOf, highlightsFor } from './data.js';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Hash link builder: href('/brand/nikon', { sort: 'az' }) → "#/brand/nikon?sort=az" */
export function href(path, params = {}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    q.set(k, Array.isArray(v) ? v.join(',') : v);
  }
  const qs = q.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

/** Wireframe image placeholder. ratio is a CSS aspect-ratio value. */
export const ph = (label = 'Image', cls = '', ratio = '4 / 3') =>
  `<div class="ph ${cls}" style="aspect-ratio:${ratio}"><span>${esc(label)}</span></div>`;

/** Annotation marker: wrap any element's attributes with this. */
export const note = (text) => `data-note="${esc(text)}"`;
/** What changed in this version, on a section. Shown as a yellow "v2" marker (toggle: Changes). */
export const change = (text) => `data-change="${esc(text)}"`;
export const VERSION = { id: 'v2', date: '22 Oct 2026', source: 'BMK_WEBSITE_INFO_21.10.2026 (client document)' };

const arrow = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const icons = {
  arrow,
  search: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m14 14 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  chevron: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  filter: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

/** Product card — identical in every listing context. */
export function productCard(p, { compact = false } = {}) {
  const b = brandOf(p);
  const c = categoryOf(p);
  const hl = highlightsFor(p);
  const colours = p.colours.length > 1 ? `<span class="text-xs text-faint">${p.colours.length} colours</span>` : '';
  return `
  <article class="card group h-full">
    ${ph(p.images[0] || 'Image', 'rounded-t-lg', '4 / 3')}
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-center justify-between gap-2">
        <span class="eyebrow">${esc(b.name)}</span>${colours}
      </div>
      <div>
        <h3 class="text-[17px] leading-snug font-semibold"><a href="${href(`/product/${p.slug}`)}" class="after:absolute after:inset-0">${esc(p.name)}</a></h3>
        <p class="mt-0.5 text-[13px] text-sub">${esc(c.name)}</p>
      </div>
      ${
        !compact && hl.length
          ? `<dl class="grid gap-1 border-t border-hair pt-3 text-[13px]">${hl
              .map((h) => `<div class="flex items-start gap-2"><dt class="w-[44%] shrink-0 text-faint">${esc(h.label)}</dt><dd class="line-clamp-1">${esc(h.value)}</dd></div>`)
              .join('')}</dl>`
          : !compact
            ? `<p class="line-clamp-2 border-t border-hair pt-3 text-[13px] text-sub">${esc(p.short)}</p>`
            : ''
      }
      <span class="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold">View details ${arrow}</span>
    </div>
  </article>`;
}

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('wf-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wf-toast';
    el.className =
      'fixed bottom-20 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[13px] text-white opacity-0 transition-opacity';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.style.opacity = '0'), 2200);
}
