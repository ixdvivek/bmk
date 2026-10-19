// Legal pages (Terms, Privacy, Cookies) and the 404 page.
// No approved legal text yet: the sections below are a layout skeleton with the
// headings these policies usually carry. Every body is marked as placeholder.
import { groups } from '../../wireframe/src/data.js';
import { A, esc, href, arrow, icon, crumbs } from './ui.js';

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
        ${crumbs([['Home', '../'], [doc.title]])}
        <span class="chip mt-6 border-line bg-white text-ink">Legal</span>
        <h1 class="t-display mt-4 max-w-4xl">${esc(doc.title)}</h1>
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
    <section class="relative isolate overflow-hidden bg-navy pt-[clamp(160px,14vw,220px)] pb-[clamp(80px,8vw,128px)] text-white">
      <img src="${A}patterns/history-mark-1.svg" alt="" class="absolute -right-24 -bottom-40 -z-10 w-[min(720px,70vw)] opacity-10 brightness-0 invert" />
      <div class="shell">
        <p class="nf-code" aria-hidden="true">404</p>
        <h1 class="t-display mt-2 max-w-3xl">This page isn’t here</h1>
        <p class="t-body mt-4 max-w-xl text-white/75">The link may be old, or the page may have moved. Search the catalogue or pick a place to start.</p>
        <form class="mt-10 flex max-w-xl items-center gap-3 rounded-full border border-white/25 bg-white/10 py-1.5 pr-1.5 pl-5 backdrop-blur focus-within:border-white" role="search" data-nf-search>
          ${icon.search}<input name="q" type="search" placeholder="Search by product, model or brand" class="min-w-0 flex-1 bg-transparent py-2.5 outline-none placeholder:text-white/50" aria-label="Search products" />
          <button class="btn bg-white text-ink hover:bg-accent hover:text-white">Search</button>
        </form>
      </div>
    </section>
    <section class="shell section-y">
      <h2 class="mb-6 text-xs tracking-[0.14em] text-muted uppercase">Start here</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${groups.map((g) => `<a class="nf-tile group" href="${href('/category/' + g.id)}"><span>${esc(g.name)}</span>${arrow('orange')}</a>`).join('')}
      </div>
      <div class="mt-10 flex flex-wrap gap-3">
        <a class="btn btn-navy" href="${href('/products')}">Browse all products ${arrow('orange')}</a>
        <a class="btn btn-outline" href="../">Back to home</a>
        <a class="btn btn-outline" href="${href('/contact')}">Contact us</a>
      </div>
    </section>`,
    wire(root) {
      root.querySelector('[data-nf-search]').addEventListener('submit', (e) => {
        e.preventDefault();
        const q = e.target.q.value.trim();
        location.hash = href('/search', { q }).slice(1);
      });
    },
  };
}
