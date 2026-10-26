// Homepage: the Brands & Products dropdown and the enquiry popup, shared with
// every other page (markup and popup come from catalogue/src/chrome.js).
import { megaMarkup, catalogueMenuMarkup, openEnquiry } from '../../catalogue/src/chrome.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Show (CSS entry animation) or fade out, then hide. */
function show(el, on) {
  el.getAnimations().forEach((a) => a.cancel());
  if (on) return el.classList.remove('hidden');
  if (el.classList.contains('hidden')) return;
  if (reduced()) return el.classList.add('hidden');
  el.animate({ opacity: [1, 0], transform: ['none', 'translateY(-8px)'] }, { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)' }).onfinish = () =>
    el.classList.add('hidden');
}

export function initOverlays({ lenis }) {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // ── Brands & Products dropdown (desktop; the mobile menu links to the page) ──
  const btn = document.getElementById('mega-toggle');
  document.body.insertAdjacentHTML('beforeend', megaMarkup());
  const mega = document.getElementById('mega');
  mega.setAttribute('data-lenis-prevent', '');
  const place = () => (mega.style.top = `${nav.getBoundingClientRect().bottom + 16}px`); // sits under the (taller-offset) homepage navbar
  const setMega = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      place();
      document.dispatchEvent(new CustomEvent('bmk:panel', { detail: 'mega' }));
    }
    show(mega, open);
  };
  let t;
  btn.addEventListener('click', () => setMega(mega.classList.contains('hidden')));
  btn.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && (clearTimeout(t), (t = setTimeout(() => setMega(true), 160))));
  btn.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && (clearTimeout(t), (t = setTimeout(() => mega.matches(':hover') || setMega(false), 250))));
  mega.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && (t = setTimeout(() => setMega(false), 250)));
  mega.addEventListener('pointerenter', () => clearTimeout(t));
  document.addEventListener('bmk:panel', (e) => e.detail !== 'mega' && setMega(false));
  document.addEventListener('click', (e) => !mega.classList.contains('hidden') && !e.target.closest('#mega, #mega-toggle') && setMega(false));
  addEventListener('keydown', (e) => e.key === 'Escape' && !mega.classList.contains('hidden') && setMega(false));
  // Close when the navbar slides away on scroll
  addEventListener('scroll', () => !mega.classList.contains('hidden') && nav.getBoundingClientRect().bottom < 0 && setMega(false), { passive: true });

  // ── Mobile menu: Brands & Products expands into categories and brands ──
  const item = document.querySelector('[data-catalogue-menu]');
  if (item) {
    item.innerHTML = catalogueMenuMarkup();
    const top = item.querySelector(':scope > details');
    top.classList.remove('border-b', 'border-line');
    const sum = top.querySelector(':scope > summary');
    sum.classList.remove('!py-4', '!font-semibold');
    sum.classList.add('!py-2.5', '!font-normal');
    // Long list: the menu scrolls inside itself
    const list = item.closest('ul');
    list.classList.add('max-h-[calc(100svh-120px)]', 'overflow-y-auto', 'overscroll-contain');
    list.setAttribute('data-lenis-prevent', '');
  }

  // ── Enquiry popup (same as every other page) ──
  const host = document.createElement('div');
  host.id = 'overlays';
  document.body.append(host);
  // Pause smooth scrolling while the popup is open
  new MutationObserver(() => (host.children.length ? lenis?.stop() : lenis?.start())).observe(host, { childList: true });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-enquire]');
    if (!b) return;
    e.preventDefault();
    setMega(false);
    openEnquiry({ type: b.dataset.enquire || '' });
  });
}
