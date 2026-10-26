// Homepage search: the same panel as the other pages (popular searches and
// categories, live product / brand / category matches), opening under the
// navbar. Results link to the site's pages; Enter opens the search page.
import { groups, searchProducts, searchBrands, searchCategories, brandOf, categoryOf } from '../../wireframe/src/data.js';
import { mediaOf } from '../../catalogue/src/media.js';

const BASE = import.meta.env.BASE_URL;
const POPULAR = ['X-T5', 'Nikon Z8', 'NIKKOR', 'instax'];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const url = (path, q) => `${BASE}${path}/${q ? `?q=${encodeURIComponent(q)}` : ''}`;
const brandUrl = (b) => (b.inHouse ? `href="https://${b.sites[0][0]}" target="_blank" rel="noopener"` : `href="${url(`brand/${b.id}`)}"`);
const ICON = {
  search: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m14 14 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  close: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
const label = (t) => `<p class="mb-3 text-xs tracking-[0.14em] text-black/50 uppercase">${t}</p>`;

function suggestions(q) {
  if (!q.trim())
    return `<div class="grid gap-6 sm:grid-cols-2">
      <div>${label('Popular searches')}<div class="flex flex-wrap gap-2">${POPULAR.map((t) => `<a class="search-pill" href="${url('search', t)}">${esc(t)}</a>`).join('')}</div></div>
      <div>${label('Browse categories')}<div class="flex flex-wrap gap-2">${groups.map((g) => `<a class="search-pill" href="${url(`category/${g.id}`)}">${esc(g.name)}</a>`).join('')}</div></div>
    </div>`;
  const ps = searchProducts(q);
  const bs = searchBrands(q);
  const cs = searchCategories(q);
  if (!ps.length && !bs.length && !cs.length)
    return `<p class="text-black/60">No matches for “${esc(q)}”. Try a model name such as <a class="text-black underline" href="${url('search', 'X-T5')}">X-T5</a>, or <a class="text-black underline" href="${url('products')}">browse all products</a>.</p>`;
  return `<div class="grid gap-8 md:grid-cols-[2fr_1fr]">
    <div>${label('Products')}
      <ul class="grid gap-1">${ps
        .slice(0, 5)
        .map((p) => {
          const img = mediaOf(p).card;
          return `<li><a href="${url(`product/${p.slug}`)}" class="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-mist">
            <span class="grid aspect-[3/2] w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-mist">${img ? `<img src="${img}" alt="" class="size-full object-cover" loading="lazy" />` : ''}</span>
            <span class="min-w-0"><span class="block truncate font-semibold">${esc(p.name)}</span><span class="block text-sm text-black/50">${esc(brandOf(p).name)} · ${esc(categoryOf(p).name)}</span></span></a></li>`;
        })
        .join('')}</ul>
      ${ps.length ? `<a href="${url('search', q)}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold">See all ${ps.length} result${ps.length === 1 ? '' : 's'} for “${esc(q)}” <img src="assets/icons/arrow-orange.svg" alt="" width="16" height="16" /></a>` : ''}
    </div>
    <div class="grid content-start gap-6">
      ${bs.length ? `<div>${label('Brands')}<div class="flex flex-wrap gap-2">${bs.map((b) => `<a class="search-pill" ${brandUrl(b)}>${esc(b.name)}</a>`).join('')}</div></div>` : ''}
      ${cs.length ? `<div>${label('Categories')}<div class="flex flex-wrap gap-2">${cs.map((c) => `<a class="search-pill" href="${url(`category/${c.id}`)}">${esc(c.name)}</a>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}

export function initSearch() {
  const nav = document.getElementById('nav');
  const toggles = document.querySelectorAll('[data-search-toggle]');
  if (!nav || !toggles.length) return;

  const panel = document.createElement('div');
  panel.id = 'search-panel';
  panel.className = 'search-panel';
  panel.hidden = true;
  panel.setAttribute('data-lenis-prevent', '');
  panel.innerHTML = `
    <form role="search" class="flex items-center gap-3 rounded-full border border-black/15 px-5 py-3 transition-colors focus-within:border-navy">
      ${ICON.search}<input type="search" autocomplete="off" placeholder="Search by product, model or brand" class="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-black/35" aria-label="Search products" />
      <button type="button" class="icon-btn size-9 hover:bg-black/5" data-search-close aria-label="Close search">${ICON.close}</button>
    </form>
    <div class="max-h-[60svh] overflow-y-auto pt-6" aria-live="polite" data-search-suggest></div>`;
  document.body.append(panel);
  const input = panel.querySelector('input');
  const suggest = panel.querySelector('[data-search-suggest]');

  const set = (open) => {
    toggles.forEach((t) => t.setAttribute('aria-expanded', String(open)));
    if (open === !panel.hidden) return;
    panel.getAnimations().forEach((a) => a.cancel());
    if (open) {
      document.dispatchEvent(new CustomEvent('bmk:panel', { detail: 'search' }));
      panel.hidden = false;
      suggest.innerHTML = suggestions(input.value);
      requestAnimationFrame(() => input.focus());
    } else if (matchMedia('(prefers-reduced-motion: reduce)').matches) panel.hidden = true;
    else panel.animate({ opacity: [1, 0], transform: ['none', 'translateY(-8px)'] }, { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () => (panel.hidden = true);
  };

  toggles.forEach((t) =>
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('menu-toggle')?.getAttribute('aria-expanded') === 'true' && document.getElementById('menu-toggle').click();
      set(panel.hidden);
    }),
  );
  panel.querySelector('[data-search-close]').addEventListener('click', () => set(false));
  input.addEventListener('input', () => (suggest.innerHTML = suggestions(input.value)));
  panel.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) location.href = url('search', input.value.trim());
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && set(false));
  document.addEventListener('bmk:panel', (e) => e.detail !== 'search' && set(false));
  document.addEventListener('click', (e) => !panel.hidden && !e.target.closest('#search-panel, #nav') && set(false));
}
