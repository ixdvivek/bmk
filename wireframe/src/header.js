import { groups, categoriesIn, brands, products, searchProducts, searchBrands, searchCategories, brandOf, categoryOf } from './data.js';
import { esc, href, icons, ph, note, toast } from './ui.js';
import { refreshNotes } from './notes.js';
import { openEnquiry } from './enquiry.js';

const countIn = (catId) => products.filter((p) => p.category === catId).length;
const countBrand = (id) => products.filter((p) => p.brand === id).length;

// ── Header markup ────────────────────────────────────────────────────────────
export function renderHeader() {
  const root = document.getElementById('site-header');
  root.innerHTML = `
  <header class="sticky top-0 z-50 border-b border-line bg-white">
    <div class="wrap flex h-16 items-center gap-6">
      <a href="#/home" class="ph h-9 w-24 shrink-0 rounded text-[10px]" aria-label="BMK Group home" style="aspect-ratio:auto"><span>Logo</span></a>
      <nav class="hidden flex-1 items-center gap-1 text-sm lg:flex" aria-label="Primary">
        <a href="#/home" data-nav="/home" class="rounded-full px-3 py-2 hover:bg-wash aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:underline-offset-8">Home</a>
        <a href="#/about" data-nav="/about" class="rounded-full px-3 py-2 hover:bg-wash aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:underline-offset-8">About Us</a>
        <button type="button" id="mega-toggle" aria-expanded="false" aria-controls="mega" class="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-semibold hover:bg-wash aria-expanded:bg-wash" ${note('Mega menu: opens on hover (with a short delay so passing the cursor over it does not flicker) and on click/keyboard. Three areas, per the homepage feedback doc: product categories, brands, and View all products.')}>
          Brands &amp; Products ${icons.chevron}
        </button>
        <a href="#/faq" data-nav="/faq" class="rounded-full px-3 py-2 hover:bg-wash aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:underline-offset-8">FAQ</a>
        <a href="#/contact" data-nav="/contact" class="rounded-full px-3 py-2 hover:bg-wash aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:underline-offset-8">Contact Us</a>
      </nav>
      <div class="ml-auto flex items-center gap-2">
        <button type="button" id="search-toggle" class="grid size-10 place-items-center rounded-full hover:bg-wash" aria-label="Search products" aria-expanded="false" ${note('Search: available on every page. Opens an overlay with instant suggestions as you type.')}>${icons.search}</button>
        <button type="button" data-enquiry class="btn btn-primary btn-sm hidden sm:inline-flex">Enquiry</button>
        <button type="button" id="drawer-toggle" class="grid size-10 place-items-center rounded-full hover:bg-wash lg:hidden" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
      </div>
    </div>
    <div id="mega" class="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]" role="region" aria-label="Brands and products">${megaMenu()}</div>
    <div id="search-panel" class="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)]">${searchPanel()}</div>
  </header>
  <div id="drawer" class="fixed inset-0 z-[70] hidden lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">${drawer()}</div>`;
  wireHeader();
}

function megaMenu() {
  const photo = groups[0];
  const rest = groups.slice(1);
  const catLink = (c) => {
    const n = countIn(c.id);
    return `<li><a href="${href(`/category/${c.id}`)}" class="flex items-baseline justify-between gap-3 rounded px-2 py-1.5 text-sm hover:bg-wash ${n ? '' : 'text-faint'}">${esc(c.name)}<span class="text-xs text-faint">${n}</span></a></li>`;
  };
  const groupHead = (g) =>
    `<a href="${href(`/category/${g.id}`)}" class="mb-2 flex items-center gap-1.5 px-2 text-[13px] font-semibold tracking-wide uppercase hover:underline">${esc(g.name)} ${icons.arrow}</a>`;
  return `
  <div class="wrap grid grid-cols-12 gap-8 py-8">
    <div class="col-span-8" ${note('Categories use the four-group structure. Group headings open a group listing (all its categories); each category opens its own listing. Counts come from live product data; empty categories stay visible but muted.')}>
      <p class="eyebrow mb-4 px-2">Product categories</p>
      <div class="grid grid-cols-3 gap-x-6">
        <div class="col-span-2">${groupHead(photo)}<ul class="grid grid-cols-2 gap-x-4">${categoriesIn(photo.id).map(catLink).join('')}</ul></div>
        <div class="flex flex-col gap-6">${rest.map((g) => `<div>${groupHead(g)}<ul>${categoriesIn(g.id).map(catLink).join('')}</ul></div>`).join('')}</div>
      </div>
    </div>
    <div class="col-span-4 border-l border-hair pl-8" ${note('Brands: logo tiles link straight to each brand page. Grows as a scrollable grid when more brands are added.')}>
      <p class="eyebrow mb-4">Brands</p>
      <ul class="grid grid-cols-2 gap-3">
        ${brands
          .map(
            (b) => `<li><a href="${href(`/brand/${b.id}`)}" class="flex flex-col gap-2 rounded-lg border border-line p-3 hover:border-ink">
              ${ph(`${b.name} logo`, 'rounded', '3 / 1')}
              <span class="flex items-baseline justify-between text-sm font-medium">${esc(b.name)}<span class="text-xs text-faint">${countBrand(b.id)}</span></span></a></li>`,
          )
          .join('')}
      </ul>
    </div>
  </div>
  <div class="border-t border-hair">
    <div class="wrap flex items-center justify-between py-4">
      <p class="text-sm text-sub">Browse the full BMK catalogue across all brands and categories.</p>
      <a href="${href('/products')}" class="btn btn-ghost btn-sm" ${note('View all products: the catalogue with both brand and category filters free.')}>View all products (${products.length}) ${icons.arrow}</a>
    </div>
  </div>`;
}

const POPULAR = ['X-T5', 'Pixel', 'NIKKOR', 'instax'];

function searchPanel() {
  return `
  <div class="wrap py-6">
    <form id="search-form" role="search" class="flex items-center gap-3 border-b-2 border-ink pb-3">
      ${icons.search}
      <input id="search-input" name="q" type="search" autocomplete="off" placeholder="Search by product, model or brand" class="min-w-0 flex-1 bg-transparent text-xl outline-none placeholder:text-faint" aria-label="Search products" aria-controls="search-suggest" />
      <button type="button" id="search-close" class="grid size-9 place-items-center rounded-full hover:bg-wash" aria-label="Close search">${icons.close}</button>
    </form>
    <div id="search-suggest" class="pt-5" aria-live="polite"></div>
  </div>`;
}

function suggestions(q) {
  if (!q.trim()) {
    return `
    <div class="grid gap-6 sm:grid-cols-[1fr_2fr]" ${note('Empty state: popular searches (admin-managed) and the category groups, so the panel is useful before typing.')}>
      <div>
        <p class="eyebrow mb-3">Popular searches</p>
        <div class="flex flex-wrap gap-2">${POPULAR.map((t) => `<a class="chip" href="${href('/search', { q: t })}">${esc(t)}</a>`).join('')}</div>
      </div>
      <div>
        <p class="eyebrow mb-3">Browse categories</p>
        <div class="flex flex-wrap gap-2">${groups.map((g) => `<a class="chip" href="${href(`/category/${g.id}`)}">${esc(g.name)}</a>`).join('')}</div>
      </div>
    </div>`;
  }
  const ps = searchProducts(q);
  const bs = searchBrands(q);
  const cs = searchCategories(q);
  if (!ps.length && !bs.length && !cs.length) {
    return `<p class="text-sub">No matches for “${esc(q)}”. Try a model name such as <a class="underline" href="${href('/search', { q: 'X-T5' })}">X-T5</a>, or <a class="underline" href="${href('/products')}">browse all products</a>.</p>`;
  }
  return `
  <div class="grid gap-8 md:grid-cols-[2fr_1fr]">
    <div ${note('Product suggestions: top 5 matches on product name, model or brand. Matching ignores punctuation, so “xt5” finds X-T5.')}>
      <p class="eyebrow mb-3">Products</p>
      <ul class="grid gap-1">
        ${ps
          .slice(0, 5)
          .map(
            (p) => `<li><a href="${href(`/product/${p.slug}`)}" class="flex items-center gap-3 rounded-lg p-2 hover:bg-wash">
              <div class="w-16 shrink-0">${ph('', 'rounded', '4 / 3')}</div>
              <span class="min-w-0"><span class="block truncate text-sm font-medium">${esc(p.name)}</span><span class="block text-xs text-sub">${esc(brandOf(p).name)} · ${esc(categoryOf(p).name)}</span></span></a></li>`,
          )
          .join('') || '<li class="text-sm text-sub">No products match.</li>'}
      </ul>
      ${ps.length ? `<a href="${href('/search', { q })}" class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">See all ${ps.length} result${ps.length === 1 ? '' : 's'} for “${esc(q)}” ${icons.arrow}</a>` : ''}
    </div>
    <div class="grid content-start gap-6">
      ${bs.length ? `<div><p class="eyebrow mb-3">Brands</p><div class="flex flex-wrap gap-2">${bs.map((b) => `<a class="chip" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a>`).join('')}</div></div>` : ''}
      ${cs.length ? `<div><p class="eyebrow mb-3">Categories</p><div class="flex flex-wrap gap-2">${cs.map((c) => `<a class="chip" href="${href(`/category/${c.id}`)}">${esc(c.name)}</a>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}

function drawer() {
  return `
  <div class="scrim" data-drawer-close></div>
  <div class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white">
    <div class="flex h-16 items-center justify-between border-b border-line px-4">
      <span class="eyebrow">Menu</span>
      <button type="button" class="grid size-10 place-items-center rounded-full hover:bg-wash" data-drawer-close aria-label="Close menu">${icons.close}</button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-4">
      <form role="search" class="mb-4 flex items-center gap-2 rounded-full border border-line px-4 py-2.5" data-drawer-search>
        ${icons.search}<input name="q" type="search" placeholder="Search products" class="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search products" />
      </form>
      <nav class="text-[17px]" aria-label="Mobile">
        <a href="#/home" class="block border-b border-hair py-3">Home</a>
        <a href="#/about" class="block border-b border-hair py-3">About Us</a>
        <details class="border-b border-hair" open ${note('Mobile: the mega menu becomes nested accordions inside the menu drawer: category groups, then brands, then View all products.')}>
          <summary class="flex cursor-pointer list-none items-center justify-between py-3 font-semibold">Brands &amp; Products ${icons.chevron}</summary>
          <div class="pb-3 pl-3">
            ${groups
              .map(
                (g) => `<details class="border-t border-hair first:border-t-0">
                  <summary class="flex cursor-pointer list-none items-center justify-between py-2.5 text-[15px]">${esc(g.name)} ${icons.chevron}</summary>
                  <ul class="pb-2 pl-3 text-[15px]">
                    <li><a class="block py-1.5 font-medium" href="${href(`/category/${g.id}`)}">All ${esc(g.name)}</a></li>
                    ${categoriesIn(g.id).map((c) => `<li><a class="flex justify-between py-1.5 ${countIn(c.id) ? '' : 'text-faint'}" href="${href(`/category/${c.id}`)}">${esc(c.name)}<span class="text-xs text-faint">${countIn(c.id)}</span></a></li>`).join('')}
                  </ul></details>`,
              )
              .join('')}
            <p class="eyebrow mt-4 mb-2">Brands</p>
            <div class="flex flex-wrap gap-2">${brands.map((b) => `<a class="chip" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a>`).join('')}</div>
            <a href="${href('/products')}" class="btn btn-ghost btn-sm mt-4 w-full">View all products (${products.length})</a>
          </div>
        </details>
        <a href="#/faq" class="block border-b border-hair py-3">FAQ</a>
        <a href="#/contact" class="block border-b border-hair py-3">Contact Us</a>
      </nav>
    </div>
    <div class="border-t border-line p-4"><button type="button" data-enquiry class="btn btn-primary w-full">Make an enquiry</button></div>
  </div>`;
}

// ── Behaviour ────────────────────────────────────────────────────────────────
let closeAll = () => {};
export const closeHeaderPanels = () => closeAll();

function wireHeader() {
  const megaBtn = document.getElementById('mega-toggle');
  const mega = document.getElementById('mega');
  const searchBtn = document.getElementById('search-toggle');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const suggest = document.getElementById('search-suggest');
  const drawerBtn = document.getElementById('drawer-toggle');
  const drawerEl = document.getElementById('drawer');

  const setMega = (open) => {
    mega.classList.toggle('hidden', !open);
    megaBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      setSearch(false);
      refreshNotes();
    }
  };
  const setSearch = (open) => {
    panel.classList.toggle('hidden', !open);
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      setMega(false);
      suggest.innerHTML = suggestions(input.value);
      requestAnimationFrame(() => input.focus());
      refreshNotes();
    }
  };
  const setDrawer = (open) => {
    drawerEl.classList.toggle('hidden', !open);
    drawerBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) refreshNotes();
  };
  closeAll = () => {
    setMega(false);
    setSearch(false);
    setDrawer(false);
  };

  // Mega menu: click toggles; hover opens after a short intent delay
  let hoverT;
  megaBtn.addEventListener('click', () => setMega(mega.classList.contains('hidden')));
  megaBtn.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(hoverT);
    hoverT = setTimeout(() => setMega(true), 160);
  });
  megaBtn.addEventListener('pointerleave', () => clearTimeout(hoverT));
  mega.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    hoverT = setTimeout(() => setMega(false), 250);
  });
  mega.addEventListener('pointerenter', () => clearTimeout(hoverT));

  searchBtn.addEventListener('click', () => setSearch(panel.classList.contains('hidden')));
  document.getElementById('search-close').addEventListener('click', () => setSearch(false));
  input.addEventListener('input', () => {
    suggest.innerHTML = suggestions(input.value);
    refreshNotes();
  });
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) location.hash = href('/search', { q: input.value.trim() });
  });

  drawerBtn.addEventListener('click', () => setDrawer(true));
  drawerEl.querySelectorAll('[data-drawer-close]').forEach((el) => el.addEventListener('click', () => setDrawer(false)));
  drawerEl.querySelector('[data-drawer-search]').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (q) location.hash = href('/search', { q });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('header')) {
      setMega(false);
      setSearch(false);
    }
  });

  // Any navigation inside the header closes its panels
  document.getElementById('site-header').addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    closeAll();
  });
  document.querySelectorAll('[data-enquiry]').forEach((b) => b.addEventListener('click', () => (closeAll(), openEnquiry())));
}

// ── Footer ───────────────────────────────────────────────────────────────────
// Structure follows the approved design footer + the homepage feedback
// (business enquiry links for the four types, each opening its popup).
export function renderFooter() {
  const link = (to, label) => `<li><a class="hover:text-ink hover:underline" href="${to}">${label}</a></li>`;
  document.getElementById('site-footer').innerHTML = `
  <footer class="mt-24 border-t border-line bg-wash text-sm">
    <div class="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
      <div class="grid content-start gap-3 lg:col-span-1">${ph('Logo', 'h-10 w-24 rounded', 'auto')}<p class="text-sub">Global technology distribution, trusted partnerships and a commitment to innovation.</p>
        <ul class="mt-2 flex gap-3" aria-label="Social media">${['Facebook', 'Instagram', 'LinkedIn', 'X'].map((n) => `<li><span class="ph grid size-8 rounded-full text-[8px]" style="aspect-ratio:1" aria-label="${n}"></span></li>`).join('')}</ul></div>
      <div><p class="mb-3 font-semibold">Quick links</p><ul class="grid gap-1.5 text-sub">
        ${link('#/home', 'Home')}${link('#/about', 'About Us')}${link(href('/products'), 'Brands &amp; Products')}${link('#/faq', 'FAQ')}${link('#/contact', 'Contact Us')}</ul></div>
      <div><p class="mb-3 font-semibold">Categories</p><ul class="grid gap-1.5 text-sub">${groups.map((g) => link(href(`/category/${g.id}`), esc(g.name))).join('')}</ul></div>
      <div ${note('Business enquiry links for the four types, per the homepage feedback. Each opens the enquiry popup with its type selected.')}><p class="mb-3 font-semibold">Business enquiries</p><ul class="grid gap-1.5 text-sub">
        ${['Distribution Enquiry', 'Dealership Enquiry', 'Retail Sales Enquiry', 'General Enquiry'].map((t) => `<li><button type="button" class="text-left hover:text-ink hover:underline" data-enquiry-type="${t}">${t.replace(' Enquiry', '') === 'General' ? 'General Enquiry' : t.replace(' Enquiry', '')}</button></li>`).join('')}</ul></div>
      <div><p class="mb-3 font-semibold">Contact</p><address class="grid gap-1.5 text-sub not-italic"><span>BMK GULF FZE<br />Warehouse # RA08LB07, P.O. Box 261752, Jebel Ali Free Zone, Dubai, UAE</span><a class="hover:underline" href="tel:+97148870211">+971 4 887 0211</a><a class="hover:underline" href="mailto:info@bmkintl.com">info@bmkintl.com</a></address></div>
    </div>
    <div class="border-t border-line">
      <div class="wrap flex flex-col gap-3 py-5 text-xs text-faint md:flex-row md:items-center md:justify-between">
        <p>© BMK Group. All Rights Reserved. Website made by <span class="underline">Phitany</span></p>
        <ul class="flex flex-wrap gap-4">${['Privacy Policy', 'Cookie Policy', 'Terms &amp; Conditions'].map((l) => `<li><a href="#" data-stub class="hover:underline">${l}</a></li>`).join('')}</ul>
      </div>
    </div>
  </footer>`;
  document.getElementById('site-footer').addEventListener('click', (e) => {
    if (e.target.closest('[data-stub]')) {
      e.preventDefault();
      toast('Legal pages are not part of the Phase 1 page templates');
    }
  });
}

/** Mark the current top-level page in the header nav. */
export function setActiveNav(path) {
  const top = path === '/' ? '' : `/${path.split('/')[1]}`;
  const productish = ['/products', '/category', '/brand', '/product', '/search'].includes(top);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === top) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.getElementById('mega-toggle')?.classList.toggle('underline', productish);
  document.getElementById('mega-toggle')?.classList.toggle('underline-offset-8', productish);
}
