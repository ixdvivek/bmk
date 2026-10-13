import { gsap, ScrollTrigger } from './gsap.js';

/**
 * History timeline.
 * Desktop (≥1024px): the section pins and vertical scroll drives the card
 * row sideways; the orange thumb tracks progress and the card under it
 * becomes "active" (photo / navy state from the Figma 2008 card).
 * Smaller screens: native horizontal swipe with scroll-snap, same thumb.
 * Hovering a card always previews its active state.
 */
export function initTimeline({ reduced }) {
  const section = document.querySelector('.history');
  if (!section) return;
  const viewport = section.querySelector('.history-viewport');
  const track = section.querySelector('.history-track');
  const thumb = section.querySelector('.history-thumb');
  const cards = [...track.children];
  const marks = section.querySelectorAll('.history-mark');

  let scrollActive = 0;
  let hoverActive = -1;
  const paint = () => {
    const i = hoverActive >= 0 ? hoverActive : scrollActive;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
  };
  cards.forEach((c, i) => {
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      hoverActive = i;
      paint();
    });
    c.addEventListener('pointerleave', () => {
      hoverActive = -1;
      paint();
    });
  });

  const thumbRange = () => thumb.parentElement.clientWidth - thumb.offsetWidth;
  const setProgress = (p) => {
    gsap.set(thumb, { x: p * thumbRange() });
    const i = Math.round(p * (cards.length - 1));
    if (i !== scrollActive) {
      scrollActive = i;
      paint();
    }
  };
  paint();

  // Native swipe (mobile/tablet)
  viewport.addEventListener(
    'scroll',
    () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (max > 0) setProgress(viewport.scrollLeft / max);
    },
    { passive: true },
  );

  if (reduced) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    viewport.scrollLeft = 0;
    const distance = () => {
      const cs = getComputedStyle(viewport);
      const inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return Math.max(0, track.scrollWidth - inner);
    };

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 0.9, distance() * 2.2)}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      })
      .to(track, { x: () => -distance(), duration: 1 }, 0)
      .to(marks, { yPercent: (i) => -25 - i * 10, rotate: (i) => (i % 2 ? 6 : -6), duration: 1, stagger: 0 }, 0);

    return () => gsap.set(track, { x: 0 });
  });

  // Cards rise in as the section arrives
  gsap.from(cards, {
    y: 80,
    autoAlpha: 0,
    stagger: 0.08,
    duration: 1.2,
    scrollTrigger: { trigger: track, start: 'top 90%', once: true },
  });
  gsap.from(marks, {
    autoAlpha: 0,
    scale: 0.7,
    stagger: 0.12,
    duration: 2,
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  });

  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(thumb, { x: 0 }));
}
