import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

// Lenis smoothing makes the scrubbed video feel continuous instead of
// stepping with each wheel notch. It is driven by GSAP's ticker so Lenis
// and ScrollTrigger always read the same scroll position.
export function initSmoothScroll() {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    prevent: (node) => node.hasAttribute?.('data-lenis-prevent-wheel') && node.scrollWidth > node.clientWidth,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
