// Navbar (homepage pill), mega menu, search overlay, mobile menu, footer, enquiry popup.
import { groups, categoriesIn, brands, inHouseBrands, partnerBrands, products, searchProducts, searchBrands, searchCategories, brandOf, categoryOf } from '../../wireframe/src/data.js';
import { contact } from '../../wireframe/src/content.js';
import { A, esc, href, arrow, icon, brandMark, stage } from './ui.js';
import { mediaOf } from './media.js';

const thumb = (p) => mediaOf(p).card || '';

const countIn = (id) => products.filter((p) => p.category === id).length;
const countBrand = (id) => products.filter((p) => p.brand === id).length;
const HOME = '../';

export function renderChrome() {
  document.getElementById('site-header').innerHTML = `
  <header id="nav" class="fixed top-4 left-1/2 z-50 w-[min(1040px,calc(100%-32px))] -translate-x-1/2 rounded-lg bg-white/80 py-2 pr-2 pl-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-[16px] md:top-6">
    <nav class="flex items-center justify-between gap-4" aria-label="Primary">
      <a href="${HOME}" class="block h-12 w-[92px] shrink-0" aria-label="BMK Group home"><img src="${A}logo/bmk.svg" alt="BMK" width="92" height="48" class="size-full" /></a>
      <ul class="hidden items-center gap-5 text-sm leading-5 text-black lg:flex">
        <li><a class="nav-link" href="${HOME}">Home</a></li>
        <li><a class="nav-link" data-nav="about" href="${href('/about')}">About Us</a></li>
        <li><button type="button" id="mega-toggle" class="nav-link inline-flex items-center gap-1.5" data-nav="catalogue" aria-expanded="false" aria-controls="mega">Brands &amp; Products ${icon.chev}</button></li>
        <li><a class="nav-link" data-nav="faq" href="${href('/faq')}">FAQ</a></li>
        <li><a class="nav-link" data-nav="contact" href="${href('/contact')}">Contact Us</a></li>
      </ul>
      <div class="flex items-center gap-2">
        <button type="button" id="search-toggle" class="icon-btn size-12 hover:bg-ink/5" aria-label="Search products" aria-expanded="false">${icon.search}</button>
        <button type="button" class="btn btn-dark hidden sm:inline-flex" data-enquire>Enquiry ${arrow('orange')}</button>
        <button type="button" id="menu-toggle" class="icon-btn size-12 bg-ink/5 lg:hidden" aria-label="Open menu" aria-expanded="false">
          <span class="relative block h-3 w-5" aria-hidden="true"><span class="absolute top-0 left-0 h-px w-full bg-ink"></span><span class="absolute bottom-0 left-0 h-px w-full bg-ink"></span></span>
        </button>
      </div>
    </nav>
  </header>

  <div id="mega" class="fixed top-[96px] left-1/2 z-40 hidden w-[min(1200px,calc(100%-32px))] -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgba(18,18,18,0.45)] md:top-[104px]" role="region" aria-label="Brands and products">
    <div class="grid grid-cols-12 gap-10 p-10">
      <div class="col-span-8">
        <p class="mb-5 text-xs tracking-[0.14em] text-muted uppercase">Product categories</p>
        <div class="grid grid-cols-3 gap-x-8 gap-y-7">${groups.map((g) => groupBlock(g)).join('')}</div>
      </div>
      <div class="col-span-4 border-l border-line pl-10">
        <p class="mb-4 text-xs tracking-[0.14em] text-muted uppercase">Our brands</p>
        <ul class="grid gap-2">${inHouseBrands
          .map(
            (b) => `<li><a href="${href(`/brand/${b.id}`)}" class="group flex items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-ink">
              ${brandMark(b, { cls: 'h-6' })}<span class="flex items-center gap-2 text-xs text-muted">In-house ${arrow('orange')}</span></a></li>`,
          )
          .join('')}</ul>
        <p class="mt-6 mb-4 text-xs tracking-[0.14em] text-muted uppercase">Partner brands</p>
        <ul class="grid grid-cols-3 gap-2">${partnerBrands
          .map((b) => `<li><a href="${href(`/brand/${b.id}`)}" class="mega-brand" title="${esc(b.name)}">${brandMark(b, { cls: 'h-8 !text-[13px]' })}</a></li>`)
          .join('')}</ul>
      </div>
    </div>
    <div class="flex items-center justify-between gap-6 bg-mist px-10 py-5">
      <p class="text-sm text-muted">Explore the brands associated with and handled by BMK Group.</p>
      <a href="${href('/products')}" class="btn btn-navy">View all products ${arrow('orange')}</a>
    </div>
  </div>

  <div id="search-panel" class="fixed top-[96px] left-1/2 z-40 hidden w-[min(1040px,calc(100%-32px))] -translate-x-1/2 rounded-2xl bg-white p-6 shadow-[0_40px_80px_-30px_rgba(18,18,18,0.45)] md:top-[104px] md:p-8">
    <form id="search-form" role="search" class="flex items-center gap-3 rounded-full border border-ink/15 px-5 py-3 focus-within:border-navy">
      ${icon.search}<input id="search-input" type="search" autocomplete="off" placeholder="Search by product, model or brand" class="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-ink/35" aria-label="Search products" />
      <button type="button" id="search-close" class="icon-btn size-9 hover:bg-ink/5" aria-label="Close search">${icon.close}</button>
    </form>
    <div id="search-suggest" class="pt-6" aria-live="polite"></div>
  </div>

  <div id="drawer" class="fixed inset-0 z-[60] hidden bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="flex h-20 items-center justify-between px-5"><img src="${A}logo/bmk.svg" alt="BMK" class="h-10" />
      <button type="button" class="icon-btn size-12 bg-ink/5" data-drawer-close aria-label="Close menu">${icon.close}</button></div>
    <div class="h-[calc(100svh-5rem-88px)] overflow-y-auto px-5">
      <form role="search" class="mb-4 flex items-center gap-2 rounded-full border border-ink/15 px-4 py-3" data-drawer-search>${icon.search}<input name="q" type="search" placeholder="Search products" class="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search products" /></form>
      <nav class="text-[22px] leading-tight tracking-[-0.02em]" aria-label="Mobile">
        <a class="block border-b border-line py-4" href="${HOME}">Home</a>
        <a class="block border-b border-line py-4" href="${href('/about')}">About Us</a>
        <details class="facet border-b border-line" open>
          <summary class="!py-4 !text-[22px] !font-semibold">Brands &amp; Products ${icon.chev}</summary>
          <div class="grid gap-1 pb-5 text-base">
            ${groups
              .map(
                (g) => `<details class="facet"><summary class="!py-2.5 !text-base !font-medium">${esc(g.name)} ${icon.chev}</summary>
                  <ul class="grid pb-2 pl-3 text-[15px]"><li><a class="block py-1.5 font-medium" href="${href(`/category/${g.id}`)}">All ${esc(g.name)}</a></li>
                  ${categoriesIn(g.id).map((c) => `<li><a class="flex justify-between py-1.5 ${countIn(c.id) ? '' : 'text-ink/40'}" href="${href(`/category/${c.id}`)}">${esc(c.name)}<span class="text-xs text-muted">${countIn(c.id)}</span></a></li>`).join('')}</ul></details>`,
              )
              .join('')}
            <p class="mt-4 mb-2 text-xs tracking-[0.14em] text-muted uppercase">Our brands</p>
            <div class="flex flex-wrap gap-2">${inHouseBrands.map((b) => `<a class="pill" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a>`).join('')}</div>
            <p class="mt-4 mb-2 text-xs tracking-[0.14em] text-muted uppercase">Partner brands</p>
            <div class="flex flex-wrap gap-2">${partnerBrands.map((b) => `<a class="pill" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a>`).join('')}</div>
            <a href="${href('/products')}" class="btn btn-navy mt-5">View all products ${arrow('orange')}</a>
          </div>
        </details>
        <a class="block border-b border-line py-4" href="${href('/faq')}">FAQ</a>
        <a class="block border-b border-line py-4" href="${href('/contact')}">Contact Us</a>
      </nav>
    </div>
    <div class="absolute inset-x-0 bottom-0 border-t border-line bg-white p-5"><button type="button" class="btn btn-dark w-full" data-enquire>Make an enquiry ${arrow('orange')}</button></div>
  </div>`;

  document.getElementById('site-footer').innerHTML = footer();
  wire();
}

/** Mark the current section in the navbar (bold + underline). */
export function setActiveNav(page) {
  const key = ['about', 'faq', 'contact'].includes(page) ? page : ['products', 'search', 'category', 'brand', 'product'].includes(page) ? 'catalogue' : '';
  document.querySelectorAll('#nav [data-nav]').forEach((el) => {
    const on = el.dataset.nav === key;
    el.classList.toggle('font-bold', on);
    if (on) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

function groupBlock(g, wide = false) {
  return `<div><a href="${href(`/category/${g.id}`)}" class="group mb-3 inline-flex items-center gap-2 text-[15px] font-semibold">${esc(g.name)} ${arrow('orange')}</a>
    <ul class="${wide ? 'grid grid-cols-2 gap-x-6' : 'grid'}">${categoriesIn(g.id)
      .map((c) => {
        const n = countIn(c.id);
        return `<li><a href="${href(`/category/${c.id}`)}" class="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 -ml-2 text-sm transition-colors hover:bg-mist ${n ? 'text-ink' : 'text-ink/35'}">${esc(c.name)}<span class="text-xs text-muted">${n}</span></a></li>`;
      })
      .join('')}</ul></div>`;
}

const POPULAR = ['X-T5', 'Nikon Z8', 'NIKKOR', 'instax'];
function suggestions(q) {
  if (!q.trim())
    return `<div class="grid gap-6 sm:grid-cols-2">
      <div><p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">Popular searches</p><div class="flex flex-wrap gap-2">${POPULAR.map((t) => `<a class="pill" href="${href('/search', { q: t })}">${esc(t)}</a>`).join('')}</div></div>
      <div><p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">Browse categories</p><div class="flex flex-wrap gap-2">${groups.map((g) => `<a class="pill" href="${href(`/category/${g.id}`)}">${esc(g.name)}</a>`).join('')}</div></div>
    </div>`;
  const ps = searchProducts(q);
  const bs = searchBrands(q);
  const cs = searchCategories(q);
  if (!ps.length && !bs.length && !cs.length)
    return `<p class="text-muted">No matches for “${esc(q)}”. Try a model name such as <a class="text-ink underline" href="${href('/search', { q: 'X-T5' })}">X-T5</a>, or <a class="text-ink underline" href="${href('/products')}">browse all products</a>.</p>`;
  return `<div class="grid gap-8 md:grid-cols-[2fr_1fr]">
    <div><p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">Products</p>
      <ul class="grid gap-1">${ps
        .slice(0, 5)
        .map(
          (p) => `<li><a href="${href(`/product/${p.slug}`)}" class="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-mist">
            <div class="w-20 shrink-0">${stage(p, { cls: '!rounded-lg', src: thumb(p) })}</div>
            <span class="min-w-0"><span class="block truncate font-semibold">${esc(p.name)}</span><span class="block text-sm text-muted">${esc(brandOf(p).name)} · ${esc(categoryOf(p).name)}</span></span></a></li>`,
        )
        .join('')}</ul>
      ${ps.length ? `<a href="${href('/search', { q })}" class="group mt-4 inline-flex items-center gap-2 text-sm font-semibold">See all ${ps.length} result${ps.length === 1 ? '' : 's'} for “${esc(q)}” ${arrow('orange')}</a>` : ''}
    </div>
    <div class="grid content-start gap-6">
      ${bs.length ? `<div><p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">Brands</p><div class="flex flex-wrap gap-2">${bs.map((b) => `<a class="pill" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a>`).join('')}</div></div>` : ''}
      ${cs.length ? `<div><p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">Categories</p><div class="flex flex-wrap gap-2">${cs.map((c) => `<a class="pill" href="${href(`/category/${c.id}`)}">${esc(c.name)}</a>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}

let closeAll = () => {};
let closeEnquiry = () => {};
export const closePanels = () => (closeAll(), closeEnquiry());

function wire() {
  const megaBtn = document.getElementById('mega-toggle');
  const mega = document.getElementById('mega');
  const sBtn = document.getElementById('search-toggle');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const suggest = document.getElementById('search-suggest');
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menu-toggle');

  const setMega = (o) => {
    mega.classList.toggle('hidden', !o);
    megaBtn.setAttribute('aria-expanded', String(o));
    if (o) setSearch(false);
  };
  const setSearch = (o) => {
    panel.classList.toggle('hidden', !o);
    sBtn.setAttribute('aria-expanded', String(o));
    if (o) {
      setMega(false);
      suggest.innerHTML = suggestions(input.value);
      requestAnimationFrame(() => input.focus());
    }
  };
  const setDrawer = (o) => {
    drawer.classList.toggle('hidden', !o);
    menuBtn.setAttribute('aria-expanded', String(o));
    document.body.classList.toggle('no-scroll', o);
  };
  closeAll = () => (setMega(false), setSearch(false), setDrawer(false));

  let t;
  megaBtn.addEventListener('click', () => setMega(mega.classList.contains('hidden')));
  megaBtn.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && (clearTimeout(t), (t = setTimeout(() => setMega(true), 160))));
  megaBtn.addEventListener('pointerleave', () => clearTimeout(t));
  mega.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && (t = setTimeout(() => setMega(false), 250)));
  mega.addEventListener('pointerenter', () => clearTimeout(t));

  sBtn.addEventListener('click', () => setSearch(panel.classList.contains('hidden')));
  document.getElementById('search-close').addEventListener('click', () => setSearch(false));
  input.addEventListener('input', () => (suggest.innerHTML = suggestions(input.value)));
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) location.hash = href('/search', { q: input.value.trim() });
  });
  menuBtn.addEventListener('click', () => setDrawer(true));
  drawer.querySelectorAll('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => setDrawer(false)));
  drawer.querySelector('[data-drawer-search]').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (q) location.hash = href('/search', { q });
  });

  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeAll());
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#nav, #mega, #search-panel')) (setMega(false), setSearch(false));
  });
  [mega, panel, drawer].forEach((el) => el.addEventListener('click', (e) => e.target.closest('a') && closeAll()));

  // Hide on scroll down, reveal on scroll up (homepage behaviour)
  let lastY = scrollY;
  addEventListener(
    'scroll',
    () => {
      const y = scrollY;
      const open = !mega.classList.contains('hidden') || !panel.classList.contains('hidden');
      if (y < 120 || open) document.body.classList.remove('nav-hidden');
      else if (Math.abs(y - lastY) > 6) document.body.classList.toggle('nav-hidden', y > lastY);
      document.getElementById('nav').classList.toggle('!bg-white/95', y > 40);
      lastY = y;
    },
    { passive: true },
  );
}

function footer() {
  return `
  <footer class="mt-0 bg-black text-white">
    <div class="shell grid gap-10 py-20 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <div class="flex flex-col gap-5">
        <img src="${A}logo/bmk-white.svg" alt="BMK Group" width="92" height="48" class="h-12 w-[92px]" />
        <p class="text-[15px] leading-[25px] text-white/40">Global technology distribution, trusted partnerships and a commitment to innovation.</p>
      </div>
      <nav class="flex flex-col gap-5 text-[15px]" aria-label="Quick links"><p class="leading-5 font-bold">Quick links</p>
        <ul class="flex flex-col gap-1.5 leading-6">
          <li><a class="footer-link" href="${HOME}">Home</a></li><li><a class="footer-link" href="${href('/about')}">About Us</a></li>
          <li><a class="footer-link" href="${href('/products')}">Brands &amp; Products</a></li><li><a class="footer-link" href="${href('/faq')}">FAQ</a></li><li><a class="footer-link" href="${href('/contact')}">Contact Us</a></li>
        </ul></nav>
      <nav class="flex flex-col gap-5 text-[15px]" aria-label="Categories"><p class="leading-5 font-bold">Categories</p>
        <ul class="flex flex-col gap-1.5 leading-6">${groups.map((g) => `<li><a class="footer-link" href="${href(`/category/${g.id}`)}">${esc(g.name)}</a></li>`).join('')}</ul></nav>
      <div class="flex flex-col gap-5 text-[15px]"><p class="leading-5 font-bold">CONTACT</p>
        <address class="flex flex-col gap-1.5 leading-6 not-italic">
          <p class="flex gap-2"><img src="${A}icons/location.svg" alt="" class="size-6 shrink-0" width="24" height="24" /><span>${esc(contact.company)}<br />${esc(contact.address)}</span></p>
          <a class="footer-link flex gap-2" href="tel:${contact.phone.replace(/\s/g, '')}"><img src="${A}icons/call.svg" alt="" class="size-6 shrink-0" width="24" height="24" />${esc(contact.phone)}</a>
          <a class="footer-link flex gap-2" href="mailto:${contact.email}"><img src="${A}icons/email.svg" alt="" class="size-6 shrink-0" width="24" height="24" />${esc(contact.email)}</a>
        </address>
        <ul class="flex gap-6 pl-8">${['facebook', 'instagram', 'linkedin', 'x'].map((s) => `<li><a href="#" class="social" aria-label="${s}"><img src="${A}icons/${s}.svg" alt="" width="20" height="20" /></a></li>`).join('')}</ul>
      </div>
    </div>
    <div class="bg-gradient-to-b from-black to-navy to-90% py-12"><p class="px-2 text-center text-[clamp(2.5rem,6vw,6rem)] leading-[1.25] font-bold tracking-[-1px] lg:whitespace-nowrap">Built on trust. Driven by innovation.</p></div>
    <div class="bg-navy"><div class="shell flex flex-col gap-4 py-10 text-[13px] leading-5 text-white/40 md:h-32 md:flex-row md:items-center md:justify-between md:py-0">
      <p>© BMK Group. All Rights Reserved. Website made by <a href="https://phitany.com/" target="_blank" rel="noopener" class="underline decoration-white/30 underline-offset-4 hover:text-white">Phitany</a></p>
      <ul class="flex flex-wrap gap-5">${[['/privacy', 'Privacy Policy'], ['/cookies', 'Cookie Policy'], ['/terms', 'Terms &amp; Conditions']].map(([p, n]) => `<li><a class="hover:text-white" href="${href(p)}">${n}</a></li>`).join('')}</ul>
    </div></div>
  </footer>`;
}

// ── Enquiry popup ────────────────────────────────────────────────────────────
const TYPES = ['Distribution Enquiry', 'Dealership Enquiry', 'Retail Sales Enquiry', 'General Enquiry'];
export function openEnquiry({ product = null, type = '' } = {}) {
  const host = document.getElementById('overlays');
  host.innerHTML = `
  <div class="fixed inset-0 z-[80] grid place-items-end sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="enq-title">
    <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" data-close></div>
    <div class="relative max-h-[94svh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 sm:max-w-xl sm:rounded-3xl sm:p-8">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div><span class="chip border-line text-ink">Business enquiry</span><h2 id="enq-title" class="mt-4 text-[28px] leading-tight tracking-[-0.04em]">${product ? 'Enquire about this product' : 'Let’s do business together'}</h2></div>
        <button type="button" data-close class="icon-btn shrink-0 bg-ink/5" aria-label="Close">${icon.close}</button>
      </div>
      <form class="grid gap-4" data-form>
        ${product ? `<div class="flex items-center gap-4 rounded-2xl bg-mist p-3"><div class="w-20 shrink-0">${stage(product, { cls: '!rounded-lg', src: thumb(product) })}</div><div class="min-w-0"><p class="text-xs text-muted">${esc(brandOf(product).name)} · ${esc(categoryOf(product).name)}</p><p class="truncate font-semibold">${esc(product.name)}</p></div></div>` : `<label class="grid gap-1.5 text-sm"><span class="font-medium">Enquiry type</span><select required class="field">${['', ...TYPES].map((t) => `<option value="${t}" ${t ? (t === type ? 'selected' : '') : `disabled ${type ? '' : 'selected'}`}>${t || 'Select a type'}</option>`).join('')}</select></label>`}
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Full name</span><input required class="field" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Company</span><input class="field" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Email</span><input type="email" required class="field" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Phone</span><input type="tel" class="field" /></label>
        </div>
        <label class="grid gap-1.5 text-sm"><span class="font-medium">Country</span><input class="field" /></label>
        <label class="grid gap-1.5 text-sm"><span class="font-medium">Message</span><textarea rows="3" class="field">${product ? `I'd like more information about the ${esc(product.name)}.` : ''}</textarea></label>
        <button class="btn btn-navy mt-1 w-full">Send enquiry ${arrow('orange')}</button>
      </form>
    </div>
  </div>`;
  document.body.classList.add('no-scroll');
  const close = () => {
    host.innerHTML = '';
    document.body.classList.remove('no-scroll');
    removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  addEventListener('keydown', onKey);
  closeEnquiry = close;
  host.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  host.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.outerHTML = `<div class="grid justify-items-center gap-3 py-10 text-center"><div class="grid size-14 place-items-center rounded-full bg-navy"><svg width="24" height="24" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2.5 6.2 2.3 2.3L9.5 3.8" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><p class="text-xl font-semibold">Thank you</p><p class="max-w-sm text-muted">We’ve received your enquiry. The relevant BMK Group team will get back to you by email.</p><button type="button" class="btn btn-dark mt-3" data-done>Close</button></div>`;
    host.querySelector('[data-done]').addEventListener('click', close);
  });
}
