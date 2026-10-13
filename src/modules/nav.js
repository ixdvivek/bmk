import { gsap, ScrollTrigger } from './gsap.js';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initNav({ lenis }) {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');
  const [barTop, barBottom] = toggle.querySelectorAll('.menu-bar');
  const items = menu.querySelectorAll('.menu-item');
  const rule = menu.querySelector('.menu-rule');

  // ── Mobile menu ──────────────────────────────────────────────────────
  // One paused timeline: play() opens, reverse() closes. Each tween carries
  // an easeReverse so the close isn't the open run backwards (which feels
  // sluggish); it's a quick, clean exit at a higher timeScale.
  const menuTl = gsap
    .timeline({ paused: true, defaults: { duration: 0.6, ease: 'expo.out', easeReverse: 'power3.out' } })
    .to(backdrop, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(menu, { height: 'auto', duration: 0.7, ease: 'expo.inOut', easeReverse: 'power3.inOut' }, 0)
    .to(barTop, { y: 5.5, rotate: 45, duration: 0.45, ease: 'power3.inOut', easeReverse: 'power3.inOut' }, 0)
    .to(barBottom, { y: -5.5, rotate: -45, duration: 0.45, ease: 'power3.inOut', easeReverse: 'power3.inOut' }, 0)
    .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 0.18)
    .fromTo(items, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.045 }, 0.22);

  let open = false;
  const setMenu = (next) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    backdrop.classList.toggle('pointer-events-none', !open);
    if (open) {
      lenis?.stop();
      menuTl.timeScale(reducedMotion() ? 100 : 1).play();
      menu.querySelector('a')?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      menuTl.timeScale(reducedMotion() ? 100 : 1.7).reverse();
    }
  };

  toggle.addEventListener('click', () => setMenu(!open));
  backdrop.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));

  // Anchor links: smooth-scroll via Lenis, close the mobile menu first.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -24, duration: 1.4 });
      else target.scrollIntoView();
    });
  });

  // Hide on scroll down, reveal on scroll up; firmer glass once past the hero.
  let hidden = false;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle('bg-white/85', y > 80);
      nav.classList.toggle('shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]', y > 80);
      const shouldHide = self.direction === 1 && y > window.innerHeight * 0.6 && !open;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(nav, { yPercent: hidden ? -160 : 0, duration: 0.6, ease: hidden ? 'power3.in' : 'expo.out', overwrite: true });
      }
    },
  });
}
