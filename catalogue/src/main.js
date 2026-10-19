import '../catalogue.css';
import { renderChrome, closePanels, openEnquiry, setActiveNav } from './chrome.js';
import { renderAbout, renderFaq, renderContact } from './pages.js';
import { context, renderListing, resetListing } from './listing.js';
import { renderProduct } from './product.js';

const view = document.getElementById('view');
let lastPath = null;
let cleanup = null;

function route() {
  const raw = location.hash.slice(1) || '/products';
  const [path, qs = ''] = raw.split('?');
  const params = new URLSearchParams(qs);
  const parts = path.split('/').filter(Boolean);
  let page = null;
  if (parts[0] === 'products' || !parts.length) page = renderListing(context('all', null, params), params);
  else if (parts[0] === 'search') page = renderListing(context('search', null, params), params);
  else if (parts[0] === 'category' || parts[0] === 'brand') {
    const ctx = context(parts[0], parts[1], params);
    page = ctx && renderListing(ctx, params);
  } else if (parts[0] === 'product') page = renderProduct(parts[1]);
  else if (parts[0] === 'about') page = renderAbout(params);
  else if (parts[0] === 'faq') page = renderFaq();
  else if (parts[0] === 'contact') page = renderContact(params);
  return { path, page };
}

function render() {
  const { path, page } = route();
  cleanup?.();
  cleanup = null;
  closePanels();
  const same = path === lastPath;
  document.body.dataset.page = path.split('/')[1] || 'products';
  setActiveNav(document.body.dataset.page);
  if (!same) resetListing();
  const y = scrollY;
  view.innerHTML = page
    ? page.html
    : `<section class="shell section-y pt-40"><h1 class="t-display">Page not found</h1><a class="btn btn-navy mt-8" href="#/products">Browse all products</a></section>`;
  cleanup = page?.wire?.(view) || null;
  document.title = `${page?.title || 'Not found'} — BMK Group`;
  scrollTo(0, same ? y : 0);
  lastPath = path;
}

// In-page anchors must not trigger the router
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-anchor]');
  if (a) {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const enq = e.target.closest('[data-enquire]');
  if (enq) {
    closePanels();
    openEnquiry({ type: enq.dataset.enquire || '' });
  }
});

renderChrome();
addEventListener('hashchange', render);
render();
