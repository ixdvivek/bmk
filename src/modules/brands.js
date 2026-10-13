import { gsap, Flip } from './gsap.js';
import { brands, brandFilters } from '../data/brands.js';

/**
 * Our Brands: category chips filter the cards (animated with GSAP Flip),
 * arrows page the native scroll-snap carousel.
 */
export function initBrands({ reduced }) {
  const track = document.querySelector('[data-brand-track]');
  const filterBar = document.querySelector('[data-brand-filters]');
  const empty = document.querySelector('[data-brand-empty]');
  const prev = document.querySelector('[data-brands-prev]');
  const next = document.querySelector('[data-brands-next]');
  if (!track) return;

  // Render
  track.innerHTML = brands
    .map(
      (b) => `
    <li class="brand-card" data-categories="${b.categories.join(' ')}">
      <div class="brand-inner">
        <img class="brand-logo" src="${b.logo}" alt="${b.name} logo" width="120" height="44" loading="lazy" />
        <div class="flex w-full flex-col gap-3">
          <h3 class="text-[32px] leading-8 font-semibold">${b.name}</h3>
          <p class="t-body text-black/50">${b.description}</p>
          <a href="${b.href}" class="brand-cta">${b.name} Products
            <img src="assets/icons/arrow-orange.svg" alt="" class="btn-icon" width="16" height="16" />
          </a>
        </div>
      </div>
    </li>`,
    )
    .join('');

  filterBar.innerHTML = brandFilters
    .map(
      (f, i) => `
    <button type="button" class="chip border-white/30 text-white transition-colors duration-300 hover:border-white aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-black"
      data-filter="${f.id}" aria-pressed="${i === 0}">${f.label}</button>`,
    )
    .join('');

  const cards = [...track.children];

  // Filtering
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    filterBar.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const id = btn.dataset.filter;

    const state = Flip.getState(cards);
    let shown = 0;
    cards.forEach((c) => {
      const match = id === 'all' || c.dataset.categories.split(' ').includes(id);
      c.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    empty.classList.toggle('hidden', shown > 0);
    track.scrollTo({ left: 0 });

    if (reduced) return updateArrows();
    Flip.from(state, {
      duration: 0.7,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4 }),
      onComplete: updateArrows,
    });
    if (shown === 0) gsap.fromTo(empty, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 });
  });

  // Carousel arrows
  const step = () => {
    const first = cards.find((c) => c.style.display !== 'none');
    return first ? first.offsetWidth + 24 : track.clientWidth;
  };
  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' }));
  track.addEventListener('scroll', updateArrows, { passive: true });
  new ResizeObserver(updateArrows).observe(track);

  // Entrance
  if (!reduced) {
    gsap.from(cards, {
      y: 60,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1.2,
      scrollTrigger: { trigger: track, start: 'top 85%', once: true },
    });
  }
}
