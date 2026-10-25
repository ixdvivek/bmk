// About › Who we are: a dotted globe that tours BMK's locations and can be
// dragged (mouse or touch). Canvas 2D orthographic projection, GSAP for the
// tour tweens and Draggable + InertiaPlugin for the throw. No WebGL.
//
// Framing (agency reference): a large globe whose centre sits just below the
// frame, so only its upper cap shows. The active location is brought to
// LIFT degrees above the centre, i.e. into the visible band.
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import globe from '../../src/data/globe-dots.json';
import { A, esc } from './ui.js';

gsap.registerPlugin(Draggable, InertiaPlugin);

const RAD = Math.PI / 180;
const LIFT = 26; // degrees above the globe centre where the active location rests
const PHI_MIN = -50;
const PHI_MAX = 55;

// City coordinates (lat, lon). `side` keeps neighbouring tags apart.
const PLACES = [
  { id: 'uae', label: 'Dubai, UAE', lat: 25.2, lon: 55.27 },
  { id: 'india', label: 'Kochi, India', lat: 9.93, lon: 76.27 },
  { id: 'malaysia', label: 'Petaling Jaya, Malaysia', lat: 3.11, lon: 101.61, side: 'left' },
  { id: 'singapore', label: 'Singapore', lat: 1.35, lon: 103.82, side: 'right' },
  { id: 'drc', label: 'Kinshasa, DR Congo', lat: -4.32, lon: 15.31, side: 'left' },
  { id: 'zambia', label: 'Lusaka, Zambia', lat: -15.39, lon: 28.32, side: 'right' },
];

// Unit vectors for the dots, computed once
const pts = (() => {
  const d = globe.dots;
  const out = new Float32Array((d.length / 2) * 3);
  for (let i = 0, j = 0; i < d.length; i += 2, j += 3) {
    const la = d[i] * RAD;
    const lo = d[i + 1] * RAD;
    out[j] = Math.cos(la);
    out[j + 1] = Math.sin(la);
    out[j + 2] = lo;
  }
  return out;
})();
const SPACING = Math.sqrt((4 * Math.PI) / globe.n); // radians between neighbouring dots

export const globeMarkup = () => `
  <div class="globe" data-globe role="img" aria-label="Globe showing BMK Group locations: ${PLACES.map((p) => esc(p.label)).join(', ')}">
    <canvas class="globe-canvas" aria-hidden="true"></canvas>
    <div class="globe-pins" aria-hidden="true">
      ${PLACES.map(
        (p) => `<div class="globe-pin" data-place="${p.id}">
          <span class="globe-dot"></span>
          <span class="globe-tag is-${p.side || 'center'}"><img src="${A}icons/map-pin-orange.svg" alt="" width="12" height="16" />${esc(p.label)}</span>
        </div>`,
      ).join('')}
    </div>
    <p class="globe-hint" aria-hidden="true">Drag to explore</p>
  </div>`;

export function initGlobe(root) {
  const el = root.querySelector('[data-globe]');
  if (!el) return null;
  const canvas = el.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const pins = PLACES.map((p) => ({ ...p, el: el.querySelector(`[data-place="${p.id}"]`) }));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  // View: centre longitude (lam) and centre latitude (phi) of the globe
  const view = { lam: PLACES[0].lon, phi: PLACES[0].lat - LIFT };
  let W = 0;
  let H = 0;
  let R = 0;
  let cx = 0;
  let cy = 0;
  let dpr = 1;
  let active = 0;
  let interacting = false;

  const size = () => {
    const r = el.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    R = Math.min(W * 0.74, H * 1.02);
    cx = W / 2;
    cy = H + R * 0.02;
    draw();
  };

  // Orthographic projection around (phi, lam); returns [x, y, z] in screen px / depth
  const project = (cosLat, sinLat, lon, sp, cp, lam) => {
    const d = lon - lam;
    const cd = Math.cos(d);
    return [cx + R * cosLat * Math.sin(d), cy - R * (cp * sinLat - sp * cosLat * cd), sp * sinLat + cp * cosLat * cd];
  };

  const BUCKETS = 7;
  const buckets = Array.from({ length: BUCKETS }, () => []);
  function draw() {
    if (!W) return;
    const sp = Math.sin(view.phi * RAD);
    const cp = Math.cos(view.phi * RAD);
    const lam = view.lam * RAD;
    const base = SPACING * R * 0.29;
    buckets.forEach((b) => (b.length = 0));
    for (let j = 0; j < pts.length; j += 3) {
      const [x, y, z] = project(pts[j], pts[j + 1], pts[j + 2], sp, cp, lam);
      if (z < 0.03 || y < -8 || y > H + 8 || x < -8 || x > W + 8) continue;
      // Front dots are bigger and solid; towards the rim they shrink and fade
      buckets[Math.min(BUCKETS - 1, Math.floor(Math.pow(z, 0.75) * BUCKETS))].push(x, y, base * (0.35 + 0.65 * z));
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    buckets.forEach((b, i) => {
      if (!b.length) return;
      ctx.globalAlpha = 0.08 + (0.74 * (i + 1)) / BUCKETS;
      ctx.beginPath();
      for (let k = 0; k < b.length; k += 3) {
        ctx.moveTo(b[k] + b[k + 2], b[k + 1]);
        ctx.arc(b[k], b[k + 1], b[k + 2], 0, Math.PI * 2);
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Pins and tags follow their projected positions
    pins.forEach((p, i) => {
      const [x, y, z] = project(Math.cos(p.lat * RAD), Math.sin(p.lat * RAD), p.lon * RAD, sp, cp, lam);
      const inside = z > 0.02 && y > 6 && y < H - 6 && x > 6 && x < W - 6;
      const tag = (interacting ? z > 0.72 : i === active) && inside;
      p.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      p.el.style.opacity = inside ? Math.min(1, z * 3).toFixed(2) : '0';
      p.el.classList.toggle('show-tag', tag);
    });
  }

  // ── Tour: rotate to each location in turn, drift slowly while it rests ──
  let tween = null;
  let idle = null;
  const shortest = (from, to) => from + ((((to - from) % 360) + 540) % 360) - 180;
  function goTo(i) {
    active = i;
    const p = PLACES[i];
    tween?.kill();
    tween = gsap
      .timeline({ onUpdate: draw, onComplete: () => goTo((i + 1) % PLACES.length) })
      .to(view, { lam: shortest(view.lam, p.lon), phi: p.lat - LIFT, duration: 2.4, ease: 'power2.inOut', onUpdate: draw })
      .add(() => draw())
      .to(view, { lam: `+=3`, duration: 2.8, ease: 'none', onUpdate: draw });
  }
  const nearest = () => {
    let best = 0;
    let bd = Infinity;
    PLACES.forEach((p, i) => {
      const d = Math.abs(shortest(view.lam, p.lon) - view.lam) + Math.abs(p.lat - LIFT - view.phi);
      if (d < bd) (bd = d), (best = i);
    });
    return best;
  };
  const startTour = (i = nearest()) => !reduced && goTo(i);
  const pauseTour = () => (tween?.kill(), idle?.kill());

  // ── Drag (mouse: spin + tilt; touch: spin only so the page still scrolls) ──
  const proxy = document.createElement('div');
  let lx = 0;
  let ly = 0;
  const onMove = function () {
    view.lam -= ((this.x - lx) / R) * (180 / Math.PI);
    if (!coarse) view.phi = gsap.utils.clamp(PHI_MIN, PHI_MAX, view.phi + ((this.y - ly) / R) * (180 / Math.PI));
    lx = this.x;
    ly = this.y;
    draw();
  };
  const settle = () => {
    idle?.kill();
    idle = gsap.delayedCall(3.5, () => {
      interacting = false;
      startTour();
    });
  };
  const [drag] = Draggable.create(proxy, {
    trigger: el,
    type: coarse ? 'x' : 'x,y',
    inertia: !reduced,
    allowNativeTouchScrolling: true,
    cursor: 'grab',
    activeCursor: 'grabbing',
    onPress() {
      pauseTour();
      interacting = true;
      el.classList.add('is-touched');
      lx = this.x;
      ly = this.y;
      draw();
    },
    onDrag: onMove,
    onThrowUpdate: onMove,
    onRelease() {
      if (!this.tween || !this.tween.isActive()) settle();
    },
    onThrowComplete: settle,
  });

  // Only animate while on screen
  let running = false;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) (running = true), interacting || startTour(active);
    else if (!e.isIntersecting && running) (running = false), pauseTour();
  });
  io.observe(el);
  const ro = new ResizeObserver(size);
  ro.observe(el);
  size();

  return () => {
    pauseTour();
    drag.kill();
    io.disconnect();
    ro.disconnect();
  };
}
