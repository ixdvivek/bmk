import '../catalogue.css';
import { renderChrome, closePanels, openEnquiry, setActiveNav } from './chrome.js';
import { renderAbout, renderFaq, renderContact } from './pages.js';
import { renderLegal, renderNotFound } from './legal.js';
import { context, renderListing, resetListing } from './listing.js';
import { renderProduct } from './product.js';
import { BASE, href, go } from './ui.js';
import { resetFooterTagline } from './chrome.js';

const view = document.getElementById('view');
let lastPath = null;
let cleanup = null;

/** "/bmk/brand/nikon/" → "/brand/nikon" (the site root is BASE). */
const currentPath = () => `/${location.pathname.slice(BASE.length).replace(/^\/+|\/+$/g, '').replace(/(^|\/)index\.html$/, '')}`;

function route() {
  const path = currentPath();
  const params = new URLSearchParams(location.search);
  const parts = path.split('/').filter(Boolean);
  let page = null;
  if (parts[0] === 'products') page = renderListing(context('all', null, params), params);
  else if (parts[0] === 'search') page = renderListing(context('search', null, params), params);
  else if (parts[0] === 'category' || parts[0] === 'brand') {
    const ctx = context(parts[0], parts[1], params);
    page = ctx && renderListing(ctx, params);
  } else if (parts[0] === 'product') page = renderProduct(parts[1]);
  else if (parts[0] === 'about') page = renderAbout(params);
  else if (parts[0] === 'faq') page = renderFaq();
  else if (parts[0] === 'contact') page = renderContact(params);
  else if (['terms', 'privacy', 'cookies'].includes(parts[0])) page = renderLegal(parts[0]);
  page ||= renderNotFound();
  return { path, page };
}

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const FADE = 200; // ms out; the fade-in is a touch longer and eases out
let token = 0;

/** Sections fade up as they scroll into view (not the hero). A scroll check
 *  rather than an IntersectionObserver, so sections skipped by an anchor jump
 *  are revealed too. */
let pending = [];
const checkReveals = () => {
  if (!pending.length) return;
  const edge = innerHeight * 0.86;
  pending = pending.filter((s) => (s.getBoundingClientRect().top < edge ? (s.classList.add('is-in'), false) : true));
};
let ticking = false;
addEventListener('scroll', () => ticking || ((ticking = true), requestAnimationFrame(() => ((ticking = false), checkReveals()))), { passive: true });
function wireReveals() {
  pending = [];
  if (reduced()) return;
  pending = [...view.querySelectorAll(':scope > section, :scope > div > section')].filter(
    (s, i) => i > 0 && !s.classList.contains('photo-hero') && s.getBoundingClientRect().top > innerHeight * 0.92,
  );
  pending.forEach((s) => s.classList.add('reveal'));
}

/** Route change: page content and footer fade out, swap while hidden (scroll
 *  reset included, so no jump is ever visible), then fade back in. The navbar
 *  stays put. Same-page updates (filters, sort) swap in place. */
const EASE_OUT = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const EASE_IN = 'cubic-bezier(0.55, 0, 0.75, 0.4)';
const fadeTargets = () => [view, document.getElementById('site-footer')];
async function render() {
  const path = currentPath();
  const same = path === lastPath;
  const mine = ++token;
  const animate = lastPath !== null && !same && !reduced();
  if (animate) {
    fadeTargets().forEach((el) => el.getAnimations().forEach((x) => x.cancel()));
    await Promise.all(fadeTargets().map((el) => el.animate({ opacity: [1, 0] }, { duration: FADE, easing: EASE_IN, fill: 'forwards' }).finished.catch(() => {})));
    if (mine !== token) return;
  }
  swap();
  if (animate) {
    // Hold at 0 until the new page has laid out and painted once, so the
    // fade-in starts on a ready frame instead of skipping its first part.
    fadeTargets().forEach((el) => (el.getAnimations().forEach((x) => x.cancel()), (el.style.opacity = '0')));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (mine !== token) return;
    fadeTargets().forEach((el) => {
      el.style.opacity = '';
      el.animate({ opacity: [0, 1] }, { duration: 380, easing: EASE_OUT });
    });
  }
}

function swap() {
  const { path, page } = route();
  cleanup?.();
  cleanup = null;
  closePanels();
  const same = path === lastPath;
  document.body.dataset.page = path.split('/')[1] || 'products';
  setActiveNav(document.body.dataset.page);
  if (!same) resetListing();
  const y = scrollY;
  view.innerHTML = page.html;
  cleanup = page.wire?.(view) || null;
  document.title = `${page.title} — BMK Group`;
  scrollTo({ top: same ? y : 0, behavior: 'instant' });
  lastPath = path;
  if (!same) (wireReveals(), resetFooterTagline());
}

/** Links to other pages of this app navigate client-side (instant, with the
 *  fade); the homepage, the wireframes and other sites load normally. */
const APP = /^(products|search|category|brand|product|about|faq|contact|terms|privacy|cookies)(\/|$)/;
const isAppLink = (a) => {
  if (a.target || a.hasAttribute('download') || a.origin !== location.origin) return false;
  if (!a.pathname.startsWith(BASE)) return false;
  return APP.test(a.pathname.slice(BASE.length));
};

document.addEventListener('click', (e) => {
  // In-page anchors must not trigger the router
  const a = e.target.closest('a[data-anchor]');
  if (a) {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const link = e.target.closest('a[href]');
  if (link && !e.defaultPrevented && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) && isAppLink(link)) {
    e.preventDefault();
    if (link.pathname + link.search !== location.pathname + location.search) go(link.href);
    else if (link.hash) document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const enq = e.target.closest('[data-enquire]');
  if (enq) {
    closePanels();
    openEnquiry({ type: enq.dataset.enquire || '' });
  }
});

// Old links (/catalogue/#/about?x=1) move to their new address (/about/?x=1)
const legacy = location.hash.startsWith('#/') ? location.hash.slice(1) : null;
if (legacy || /^\/catalogue$/.test(currentPath())) {
  const [p, qs = ''] = (legacy || '/products').split('?');
  history.replaceState(null, '', href(p) + (qs ? `?${qs}` : ''));
}

renderChrome();
addEventListener('popstate', render);
addEventListener('routechange', render);
render();
