import './styles.css';
import { gsap, ScrollTrigger } from './modules/gsap.js';
import { initSmoothScroll } from './modules/smooth.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initReveals } from './modules/reveals.js';
import { initMap } from './modules/map.js';
import { initBrands } from './modules/brands.js';
import { initTimeline } from './modules/timeline.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Order matters: pinned sections must be created top-to-bottom so the
// ScrollTriggers below them measure the added pin spacing correctly.
const lenis = reduced ? null : initSmoothScroll();
initNav({ lenis });
initHero({ reduced });
initMap({ reduced });
initBrands({ reduced });
initTimeline({ reduced });
initReveals({ reduced });

// Images/fonts change layout after load → re-measure every trigger once.
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());

if (import.meta.env.DEV) window.gsap = gsap;
