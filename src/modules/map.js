import { gsap, ScrollTrigger } from './gsap.js';
import mapData from '../data/map-dots.json';
import { locations, defaultLocation } from '../data/locations.js';

/**
 * Group presence map.
 *
 * The 7,664 dots come straight from the Figma layer coordinates
 * (src/data/map-dots.json, 1200×620 frame space) and are drawn on a canvas:
 * far lighter than 7k DOM/SVG nodes and it lets every dot react to the cursor.
 * Pins are real <button>s laid over the canvas at % positions so they stay
 * aligned at any width and are keyboard/screen-reader accessible.
 */
const INK = [0, 0, 0];
const NAVY = [31, 72, 125];
const HOVER_RADIUS = 70; // frame units
const HOVER_SCALE = 1.9;

export function initMap({ reduced }) {
  const root = document.querySelector('[data-map]');
  if (!root) return;
  const canvas = root.querySelector('.map-canvas');
  const pinLayer = root.querySelector('.map-pins');
  const card = document.querySelector('[data-location-card]');
  const ctx = canvas.getContext('2d');

  const { w: FW, h: FH, r: R, dots } = mapData;
  const count = dots.length / 2;

  // ── Canvas rendering ────────────────────────────────────────────────
  let scale = 1;
  let dpr = 1;
  const view = { reveal: reduced ? 1 : 0, mx: -9999, my: -9999, hover: 0 };
  let raf = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    scale = rect.width / FW;
    draw();
  };

  const draw = () => {
    raf = 0;
    const s = scale * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(s, 0, 0, s, 0, 0);

    // Reveal is a soft wave sweeping west → east.
    const front = view.reveal * (FW + 240) - 120;
    const hoverOn = view.hover > 0.01;
    const buckets = [[], [], [], [], [], []]; // quantised alpha, batched fills
    const hovered = [];

    for (let i = 0; i < count; i++) {
      const x = dots[i * 2];
      const y = dots[i * 2 + 1];
      const a = Math.min(1, Math.max(0, (front - x + (y % 37)) / 120));
      if (a <= 0) continue;
      if (hoverOn) {
        const dx = x - view.mx;
        const dy = y - view.my;
        const d2 = dx * dx + dy * dy;
        if (d2 < HOVER_RADIUS * HOVER_RADIUS) {
          hovered.push(x, y, a, 1 - Math.sqrt(d2) / HOVER_RADIUS);
          continue;
        }
      }
      buckets[Math.round(a * 5)].push(x, y);
    }

    ctx.fillStyle = `rgb(${INK})`;
    buckets.forEach((pts, b) => {
      if (!b || !pts.length) return;
      ctx.globalAlpha = b / 5;
      ctx.beginPath();
      for (let j = 0; j < pts.length; j += 2) {
        ctx.moveTo(pts[j] + R, pts[j + 1]);
        ctx.arc(pts[j], pts[j + 1], R, 0, Math.PI * 2);
      }
      ctx.fill();
    });

    for (let j = 0; j < hovered.length; j += 4) {
      const t = hovered[j + 3] * view.hover;
      const e = t * t * (3 - 2 * t); // smoothstep
      const c = INK.map((v, k) => Math.round(v + (NAVY[k] - v) * e));
      ctx.globalAlpha = hovered[j + 2];
      ctx.fillStyle = `rgb(${c})`;
      ctx.beginPath();
      ctx.arc(hovered[j], hovered[j + 1], R * (1 + (HOVER_SCALE - 1) * e), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  const requestDraw = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  new ResizeObserver(resize).observe(canvas);

  // Cursor-reactive dots (fine pointers only)
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    const hoverTo = gsap.quickTo(view, 'hover', { duration: 0.5, ease: 'power2.out', onUpdate: requestDraw });
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      view.mx = (e.clientX - rect.left) / scale;
      view.my = (e.clientY - rect.top) / scale;
      hoverTo(1);
      requestDraw();
    });
    canvas.parentElement.addEventListener('pointerleave', () => hoverTo(0));
  }

  // ── Pins ────────────────────────────────────────────────────────────
  const pins = locations.map((loc, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pin group absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full';
    btn.style.left = `${loc.x}%`;
    btn.style.top = `${loc.y}%`;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `${loc.name}: ${loc.companies.length} compan${loc.companies.length === 1 ? 'y' : 'ies'}`);
    btn.innerHTML = `
      <span class="pin-ring"></span>
      <span class="pin-dot"></span>
      <span class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-1 rounded-full bg-ink px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">${loc.short}</span>`;
    btn.addEventListener('click', () => select(i));
    pinLayer.appendChild(btn);
    return btn;
  });

  // ── Location card ───────────────────────────────────────────────────
  const el = {
    icon: card.querySelector('.loc-icon'),
    body: card.querySelector('.loc-body'),
    entity: card.querySelector('.loc-entity'),
    city: card.querySelector('.loc-city'),
    list: card.querySelector('.loc-list'),
    link: card.querySelector('.loc-link'),
  };
  let current = -1;

  const fill = (loc) => {
    el.entity.textContent = loc.name;
    el.city.textContent = loc.region;
    el.list.innerHTML = loc.companies
      .map(
        (c) => `<li class="flex flex-col gap-0.5 rounded-lg bg-fog px-4 py-3">
          <span class="text-[15px] leading-5 font-semibold text-black">${c.name}</span>
          <span class="text-[13px] leading-5 text-black/50">${c.kind} · ${c.city}</span></li>`,
      )
      .join('');
    el.link.href = loc.href;
    el.icon.innerHTML = loc.icon
      ? `<img src="${loc.icon}" alt="" width="64" height="64" class="size-16" />`
      : `<span class="grid size-16 place-items-center rounded-full bg-fog"><span class="size-3 rounded-full bg-accent"></span></span>`;
  };

  // ── Desktop popover placement ───────────────────────────────────────
  // xl+: the card opens right next to the selected pin: to its right when it
  // fits in the viewport, otherwise to its left, vertically centred on the pin.
  // It is then nudged so no part of it falls outside the visible viewport
  // (below the fixed navbar and above the bottom edge). Below xl the card stays
  // in the normal flow under the map.
  const section = root.closest('section');
  const desktop = matchMedia('(min-width: 1280px)');
  const GAP = 28; // clear of the pin's ring
  const EDGE = 24; // breathing room from the viewport edges
  const nav = document.querySelector('header .nav-bar, header nav, header');

  const place = () => {
    if (current < 0) return;
    if (!desktop.matches) {
      card.style.left = card.style.top = card.style.transformOrigin = '';
      return;
    }
    const s = section.getBoundingClientRect();
    const p = pins[current].getBoundingClientRect();
    const px = p.left + p.width / 2; // viewport coords
    const py = p.top + p.height / 2;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const navBottom = Math.max(0, nav ? nav.getBoundingClientRect().bottom : 0);

    // Horizontal: right of the pin if it fits, else left, else clamp.
    let side = 'right';
    let x = px + GAP;
    if (x + w > vw - EDGE) {
      side = 'left';
      x = px - GAP - w;
    }
    x = gsap.utils.clamp(EDGE, vw - w - EDGE, x);

    // Vertical: centred on the pin, kept inside the visible viewport and the section.
    const top = Math.max(EDGE, navBottom + 12, s.top + EDGE);
    const bottom = Math.min(vh - EDGE, s.bottom - EDGE);
    let y = py - h / 2;
    y = bottom - top >= h ? gsap.utils.clamp(top, bottom - h, y) : top;

    card.style.left = `${Math.round(x - s.left)}px`;
    card.style.top = `${Math.round(y - s.top)}px`;
    card.dataset.side = side;
    // Grow out of the pin's side of the card
    card.style.transformOrigin = `${side === 'right' ? '0%' : '100%'} ${gsap.utils.clamp(0, 100, ((py - y) / h) * 100)}%`;
  };
  new ResizeObserver(place).observe(section);
  desktop.addEventListener('change', place);

  function select(i, { animate = true } = {}) {
    i = (i + locations.length) % locations.length;
    if (i === current) return;
    const dir = i > current ? 1 : -1;
    current = i;
    pins.forEach((p, k) => p.setAttribute('aria-pressed', String(k === i)));

    if (!animate || reduced) {
      fill(locations[i]);
      place();
      return;
    }

    if (desktop.matches) {
      // Card tucks away, jumps to the new pin, then pulls up beside it.
      gsap.killTweensOf(card);
      gsap
        .timeline()
        .to(card, { autoAlpha: 0, y: 10, scale: 0.97, duration: 0.2, ease: 'power2.in' })
        .add(() => {
          fill(locations[i]);
          place();
        })
        .fromTo(card, { autoAlpha: 0, y: 28, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, ease: 'expo.out' });
      return;
    }

    // Mobile: unchanged, content slides within the card.
    const parts = [el.icon, el.body];
    gsap
      .timeline()
      .to(parts, { x: -16 * dir, autoAlpha: 0, duration: 0.22, ease: 'power2.in', stagger: 0.03 })
      .add(() => fill(locations[i]))
      .fromTo(parts, { x: 16 * dir }, { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05 });
  }

  card.querySelector('[data-loc-prev]').addEventListener('click', () => select(current - 1));
  card.querySelector('[data-loc-next]').addEventListener('click', () => select(current + 1));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') select(current - 1);
    if (e.key === 'ArrowRight') select(current + 1);
  });

  select(locations.findIndex((l) => l.id === defaultLocation), { animate: false });

  // ── Entrance ────────────────────────────────────────────────────────
  if (reduced) return;
  gsap.set(pins, { scale: 0, autoAlpha: 0 });
  gsap.set(card, { y: 40, autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: root,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap
        .timeline()
        .to(view, { reveal: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: requestDraw })
        .to(pins, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(3)', stagger: 0.12 }, 1.1)
        .add(place, 1.2)
        .to(card, { y: 0, autoAlpha: 1, duration: 1.1 }, 1.3);
    },
  });
}
