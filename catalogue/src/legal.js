// Legal pages (Terms, Privacy, Cookies) and the 404 page.
// No approved legal text yet: the sections below are a layout skeleton with the
// headings these policies usually carry. Every body is marked as placeholder.
import { HOME, esc, href, arrow, crumbs } from './ui.js';

const LEGAL = {
  terms: {
    title: 'Terms & Conditions',
    sub: 'The terms that apply when you use the BMK Group website.',
    sections: ['About these terms', 'Using this website', 'Product information', 'Enquiries', 'Intellectual property', 'Third-party links', 'Limitation of liability', 'Governing law', 'Changes to these terms', 'Contact us'],
  },
  privacy: {
    title: 'Privacy Policy',
    sub: 'How BMK Group collects, uses and protects your personal information.',
    sections: ['Who we are', 'Information we collect', 'How we use your information', 'Sharing your information', 'International transfers', 'How long we keep it', 'Your rights', 'Security', 'Changes to this policy', 'Contact us'],
  },
  cookies: {
    title: 'Cookie Policy',
    sub: 'What cookies this website uses and how you can control them.',
    sections: ['What cookies are', 'Cookies we use', 'Third-party cookies', 'Managing cookies', 'Changes to this policy', 'Contact us'],
  },
};
const ORDER = [['privacy', 'Privacy Policy'], ['cookies', 'Cookie Policy'], ['terms', 'Terms & Conditions']];
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function renderLegal(id) {
  const doc = LEGAL[id];
  if (!doc) return null;
  const sections = doc.sections.map((t, i) => ({ id: slug(t), title: t, n: String(i + 1).padStart(2, '0') }));
  return {
    title: doc.title,
    html: `
    <section class="bg-mist pt-[clamp(128px,11vw,176px)] pb-[clamp(48px,5vw,80px)]">
      <div class="shell">
        ${crumbs([['Home', HOME], [doc.title]])}
        <h1 class="t-display mt-6 max-w-4xl">${esc(doc.title)}</h1>
        <p class="t-body mt-3 max-w-2xl text-ink/80">${esc(doc.sub)}</p>
        <p class="mt-6 text-sm text-muted">Last updated: <span class="legal-tbc">date to be confirmed</span></p>
      </div>
    </section>
    <section class="shell section-y !pt-12">
      <div class="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
        <aside class="h-fit lg:sticky lg:top-32">
          <nav aria-label="On this page" class="legal-toc">
            <p class="mb-3 text-xs tracking-[0.14em] text-muted uppercase">On this page</p>
            <ol>${sections.map((s) => `<li><a data-anchor data-toc href="#${s.id}"><span class="n">${s.n}</span>${esc(s.title)}</a></li>`).join('')}</ol>
          </nav>
          <div class="mt-8 hidden flex-col gap-2 border-t border-line pt-6 lg:flex">
            <p class="mb-1 text-xs tracking-[0.14em] text-muted uppercase">Other policies</p>
            ${ORDER.filter(([k]) => k !== id).map(([k, n]) => `<a class="group inline-flex items-center gap-2 text-[15px] hover:text-navy" href="${href('/' + k)}">${esc(n)} ${arrow('orange')}</a>`).join('')}
          </div>
        </aside>
        <article class="legal max-w-3xl">
          <div class="legal-note" role="note">
            <strong>Placeholder text.</strong> BMK Group’s legal team will supply the final wording. The headings show the expected structure.
          </div>
          ${sections
            .map(
              (s) => `<section id="${s.id}" class="legal-sec" data-section>
                <h2><span class="n">${s.n}</span>${esc(s.title)}</h2>
                ${s.title === 'Contact us'
                  ? `<p>Questions about this ${doc.title === 'Terms & Conditions' ? 'page' : 'policy'} can be sent to <a href="mailto:info@bmkintl.com">info@bmkintl.com</a>, or through our <a href="${href('/contact')}">contact page</a>.</p>`
                  : `<p class="legal-ph"></p><p class="legal-ph w-[92%]"></p><p class="legal-ph w-[70%]"></p>`}
              </section>`,
            )
            .join('')}
        </article>
      </div>
    </section>`,
    wire(root) {
      const links = [...root.querySelectorAll('[data-toc]')];
      const secs = [...root.querySelectorAll('[data-section]')];
      const update = () => {
        const line = innerHeight * 0.35;
        const cur = secs.filter((s) => s.getBoundingClientRect().top < line).pop() || secs[0];
        links.forEach((l) => l.classList.toggle('is-on', l.getAttribute('href') === `#${cur.id}`));
      };
      update();
      addEventListener('scroll', update, { passive: true });
      return () => removeEventListener('scroll', update);
    },
  };
}

export function renderNotFound() {
  return {
    title: 'Page not found',
    html: `
    <section class="nf" aria-labelledby="nf-title">
      <h1 id="nf-title" class="sr-only">Page not found (404)</h1>
      <div class="nf-grid" aria-hidden="true"><div class="nf-track" data-nf-track></div></div>
      <div class="nf-actions">
        <a class="btn nf-btn" href="${href('/products')}">Browse all products ${arrow('orange')}</a>
        <a class="btn nf-btn" href="${HOME}">Back to home ${arrow('orange')}</a>
        <a class="btn nf-btn" href="${href('/contact')}">Contact us ${arrow('orange')}</a>
      </div>
    </section>`,
    wire(root) {
      return wireNotFound(root.querySelector('[data-nf-track]'));
    },
  };
}

/* The 404 wall: rows of alternating 4s and 0s that shuffle like a sliding puzzle.
   The whole wall drops one row, then neighbouring rows slide one digit in opposite
   directions, each move with a springy overshoot. The pattern repeats every two
   rows and every two digits, so offsets wrap back silently. */
function wireNotFound(track) {
  const MOVE = 650; // ms per move
  const PAUSE = 450; // ms between moves
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rows = [];
  let ty = 0;
  let tx = [];
  let timer = 0;
  let alive = true;

  const build = () => {
    const wall = track.parentElement;
    const fs = parseFloat(getComputedStyle(wall).fontSize);
    const cell = fs * 0.7;
    const rowH = fs * 0.85;
    const cols = Math.ceil(wall.clientWidth / cell) + 6; // spare digits for sideways moves
    const count = Math.ceil(wall.clientHeight / rowH) + 3; // spare rows above for the drop
    track.innerHTML = Array.from(
      { length: count },
      (_, r) => `<div class="nf-row">${Array.from({ length: cols }, (_, c) => `<span>${(r + c) % 2 ? '0' : '4'}</span>`).join('')}</div>`,
    ).join('');
    // Line up roughly like the Figma frame: a digit straddles the left edge, the top row is cropped.
    track.style.left = `${-cell * 2.6}px`;
    track.style.top = `${-rowH * 2.3}px`;
    rows = [...track.children];
    ty = 0;
    tx = rows.map(() => 0);
    paint(false);
  };

  const paint = (animate) => {
    const t = animate ? `transform ${MOVE}ms var(--nf-ease)` : 'none';
    track.style.transition = t;
    track.style.transform = `translateY(calc(${ty} * var(--nf-row)))`;
    rows.forEach((r, i) => {
      r.style.transition = t;
      r.style.transform = `translateX(calc(${tx[i]} * var(--nf-cell)))`;
    });
  };

  // After a move, fold offsets of two steps back to zero; the wall looks identical.
  const settle = () => {
    let snap = false;
    if (ty >= 2) (ty -= 2), (snap = true);
    tx = tx.map((x) => (Math.abs(x) >= 2 ? ((snap = true), x - Math.sign(x) * 2) : x));
    if (snap) paint(false);
  };

  let vertical = true;
  const step = () => {
    if (!alive) return;
    if (vertical) ty += 1;
    else tx = tx.map((x, i) => x + (i % 2 ? 1 : -1));
    vertical = !vertical;
    paint(true);
    timer = setTimeout(() => {
      settle();
      timer = setTimeout(step, PAUSE);
    }, MOVE + 20);
  };

  build();
  let rw = 0;
  const onResize = () => {
    clearTimeout(rw);
    rw = setTimeout(build, 150);
  };
  addEventListener('resize', onResize);
  if (!still) timer = setTimeout(step, 600);
  return () => {
    alive = false;
    clearTimeout(timer);
    clearTimeout(rw);
    removeEventListener('resize', onResize);
  };
}
