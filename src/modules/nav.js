import { gsap, ScrollTrigger } from './gsap.js';

export function initNav({ lenis }) {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const bars = toggle.querySelectorAll('.menu-bar');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    menu.classList.toggle('hidden', !open);
    bars[0].style.transform = open ? 'translateY(5.5px) rotate(45deg)' : '';
    bars[1].style.transform = open ? 'translateY(-5.5px) rotate(-45deg)' : '';
    if (open) gsap.from(menu.querySelectorAll('li'), { y: 12, autoAlpha: 0, stagger: 0.04, duration: 0.6 });
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

  // Anchor links: smooth-scroll via Lenis, close the mobile menu.
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
      const shouldHide = self.direction === 1 && y > window.innerHeight * 0.6 && toggle.getAttribute('aria-expanded') !== 'true';
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(nav, { yPercent: hidden ? -160 : 0, duration: 0.6, ease: hidden ? 'power3.in' : 'expo.out', overwrite: true });
      }
    },
  });
}
