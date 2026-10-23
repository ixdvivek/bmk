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
        <div class="flex w-full items-start justify-between gap-4">
          ${b.inHouse ? '<span class="brand-tag">BMK brand</span>' : '<span></span>'}
          ${b.logo ? `<img class="brand-logo" src="${b.logo}" alt="${b.name} logo" width="120" height="44" loading="lazy" />` : `<span class="brand-wordmark" aria-hidden="true">${b.name}</span>`}
        </div>
        <div class="flex w-full flex-col gap-3">
          <h3 class="text-[32px] leading-8 font-semibold">${b.name}</h3>
          <p class="t-body line-clamp-4 text-black/50">${b.description}</p>
          ${b.sites.length ? `<p class="flex flex-wrap gap-x-4 text-sm">${b.sites.map(([d]) => `<a class="underline decoration-black/20 underline-offset-4 hover:decoration-black" href="https://${d}" target="_blank" rel="noopener">${d} ↗</a>`).join('')}</p>` : ''}
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

  // Filtering — a sequenced swap instead of one big Flip:
  //   1. cards that no longer match fade + sink out (in place, so nothing
  //      flashes or stretches across the blue background)
  //   2. layout changes; cards that stay glide to their new slots (Flip)
  //   3. newly matching cards rise in
  const matches = (c, id) => id === 'all' || c.dataset.categories.split(' ').includes(id);
  const isShown = (c) => c.style.display !== 'none';
  let swap;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    filterBar.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const id = btn.dataset.filter;

    swap?.progress(1); // finish any swap in flight before starting the next
    const leaving = cards.filter((c) => isShown(c) && !matches(c, id));
    const staying = cards.filter((c) => isShown(c) && matches(c, id));
    const entering = cards.filter((c) => !isShown(c) && matches(c, id));
    const nothing = staying.length + entering.length === 0;

    const relayout = () => {
      const state = Flip.getState(staying);
      leaving.forEach((c) => (c.style.display = 'none'));
      entering.forEach((c) => (c.style.display = ''));
      empty.classList.toggle('hidden', !nothing);
      track.scrollTo({ left: 0 });
      updateArrows();
      if (reduced) return gsap.set([...entering, ...leaving], { clearProps: 'opacity,visibility,transform' });
      Flip.from(state, { duration: 0.7, ease: 'power3.inOut' });
      gsap.fromTo(entering, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.12 });
      if (nothing) gsap.fromTo(empty, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 });
    };

    if (reduced || !leaving.length) return relayout();
    swap = gsap
      .timeline()
      .to(leaving, { autoAlpha: 0, y: 16, duration: 0.28, ease: 'power2.in', stagger: 0.03 })
      .add(relayout);
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
