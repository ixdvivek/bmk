import '../wf.css';
import { renderHeader, renderFooter, closeHeaderPanels, setActiveNav } from './header.js';
import { renderHome, renderAbout, renderFaq, renderContact, wireEnquiryTriggers } from './pages.js';
import { listingContext, renderListing, resetListingUi } from './listing.js';
import { renderProduct } from './product.js';
import { renderScreens } from './screens.js';
import { initNotes, refreshNotes } from './notes.js';
import { openEnquiry } from './enquiry.js';
import { href, toast } from './ui.js';

const view = document.getElementById('view');
let lastPath = null;
let cleanup = null;

function parse() {
  const raw = location.hash.slice(1) || '/';
  const [path, qs = ''] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(qs), parts: path.split('/').filter(Boolean) };
}

function resolve({ path, params, parts }) {
  if (path === '/') return renderScreens();
  if (path === '/home') return renderHome();
  if (path === '/about') return renderAbout(params);
  if (path === '/faq') return renderFaq();
  if (path === '/contact') return renderContact(params);
  if (parts[0] === 'products' && parts.length === 1) return renderListing(listingContext('all', null, params), params);
  if (parts[0] === 'search') return renderListing(listingContext('search', null, params), params);
  if (parts[0] === 'category' || parts[0] === 'brand') {
    const ctx = listingContext(parts[0], parts[1], params);
    return ctx && renderListing(ctx, params);
  }
  if (parts[0] === 'product') return renderProduct(parts[1]);
  return null;
}

function render() {
  const route = parse();
  cleanup?.();
  cleanup = null;
  closeHeaderPanels();
  const samePage = route.path === lastPath;
  if (!samePage) resetListingUi();

  const page = resolve(route) || {
    title: 'Not found',
    html: `<div class="wrap py-24"><h1 class="text-3xl font-semibold">Page not found</h1><p class="mt-3 text-sub">This screen isn’t in the wireframe. <a class="underline" href="#/">Back to the index</a>.</p></div>`,
  };
  const y = scrollY;
  view.innerHTML = page.html;
  cleanup = page.wire?.(view) || null;
  document.title = `${page.title} · BMK wireframe`;
  window.scrollTo(0, samePage ? y : 0);
  lastPath = route.path;
  setActiveNav(route.path);
  refreshNotes();
}

function toolbar() {
  const el = document.getElementById('wf-toolbar');
  el.innerHTML = `
  <div class="fixed bottom-[76px] left-3 z-[65] sm:bottom-4 sm:left-4 flex items-center gap-1 rounded-full border border-line bg-white p-1 text-[13px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]">
    <a href="#/" class="rounded-full px-3 py-1.5 font-semibold hover:bg-wash">Screens</a>
    <button type="button" id="notes-toggle" class="rounded-full px-3 py-1.5 hover:bg-wash" aria-pressed="true">Notes: on</button>
  </div>`;
  const btn = document.getElementById('notes-toggle');
  const set = (on) => {
    document.body.classList.toggle('notes-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = `Notes: ${on ? 'on' : 'off'}`;
    try {
      localStorage.setItem('wf-notes', on ? '1' : '0');
    } catch {}
  };
  let saved = '1';
  try {
    saved = localStorage.getItem('wf-notes') ?? '1';
  } catch {}
  set(saved === '1');
  btn.addEventListener('click', () => set(!document.body.classList.contains('notes-on')));
}

// In-page anchors (#overview etc.) must not trigger the hash router.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-anchor]');
  if (a) {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const act = e.target.closest('[data-screen-action]');
  if (act) {
    e.preventDefault();
    const which = act.dataset.screenAction;
    location.hash = href('/products');
    setTimeout(() => {
      if (innerWidth < 1024 && which === 'mega') return toast('The mega menu is desktop-only; on mobile open the menu');
      document.getElementById(which === 'mega' ? 'mega-toggle' : 'search-toggle')?.click();
    }, 60);
    return;
  }
  if (e.target.closest('[data-enquiry-page]')) openEnquiry();
});

renderHeader();
renderFooter();
wireEnquiryTriggers();
toolbar();
initNotes();
window.addEventListener('hashchange', render);

// Hide the header on scroll down, show it on scroll up (never while a header panel is open).
let lastY = scrollY;
window.addEventListener(
  'scroll',
  () => {
    const y = scrollY;
    const panelOpen = document.querySelector('#mega:not(.hidden), #search-panel:not(.hidden)');
    if (y < 120 || panelOpen) document.body.classList.remove('header-hidden');
    else if (Math.abs(y - lastY) > 6) document.body.classList.toggle('header-hidden', y > lastY);
    lastY = y;
  },
  { passive: true },
);
window.addEventListener('resize', () => {
  clearTimeout(window.__nt);
  window.__nt = setTimeout(refreshNotes, 200);
});
render();
