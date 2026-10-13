import { gsap, ScrollTrigger, SplitText } from './gsap.js';

/**
 * Declarative scroll reveals, driven by data attributes in the markup:
 *   data-split          heading lines rise out of a mask
 *   data-split-chars    characters rise in sequence (footer tagline)
 *   data-reveal="up"    fade + rise
 *   data-reveal="clip"  image wipes up from the bottom, inner <img> settles from 1.2× scale
 *   data-reveal-group   direct children stagger in
 *   data-parallax-img   image drifts slower than the page
 */
export function initReveals({ reduced }) {
  const all = '[data-split],[data-split-chars],[data-reveal],[data-reveal-group] > *';
  if (reduced) {
    gsap.set(all, { clearProps: 'all', visibility: 'visible' });
    return;
  }

  const onEnter = (el, start = 'top 85%') => ({ trigger: el, start, once: true });

  document.querySelectorAll('[data-split]').forEach((el) => {
    gsap.set(el, { visibility: 'visible' });
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true, // re-split on resize / font load, keeps line breaks right
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 110, stagger: 0.08, duration: 1.2, scrollTrigger: onEnter(el) }),
    });
  });

  document.querySelectorAll('[data-split-chars]').forEach((el) => {
    gsap.set(el, { visibility: 'visible' });
    SplitText.create(el, {
      type: 'words,chars',
      mask: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 120,
          stagger: { each: 0.018, from: 'start' },
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: onEnter(el, 'top 92%'),
        }),
    });
  });

  gsap.utils.toArray('[data-reveal="up"]').forEach((el) => {
    gsap.from(el, { y: 32, autoAlpha: 0, duration: 1.1, scrollTrigger: onEnter(el) });
  });

  gsap.utils.toArray('[data-reveal="clip"]').forEach((el) => {
    const img = el.querySelector('img');
    gsap
      .timeline({ scrollTrigger: onEnter(el, 'top 80%') })
      .set(el, { visibility: 'visible' })
      .fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 12px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.4, ease: 'expo.inOut' })
      .from(img, { scale: 1.25, duration: 1.8, ease: 'expo.out' }, 0.2);
  });

  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, { y: 60, autoAlpha: 0, stagger: 0.12, duration: 1.2, scrollTrigger: onEnter(group, 'top 80%') });
  });

  gsap.utils.toArray('[data-parallax-img]').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  ScrollTrigger.refresh();
}
