// Product detail. Spec sheet comes from the category's template (see wireframe/src/data.js).
import { products, templates, productBySlug, brandOf, categoryOf, groupOf, fieldLabel, shortValue } from '../../wireframe/src/data.js';

/** Template groups → filled rows; empty fields/groups dropped; unknown fields kept under "Other". */
function specGroups(p) {
  const used = new Set();
  const out = (templates[categoryOf(p).template] || [])
    .map((g) => ({ group: g.group, rows: g.fields.filter(([k]) => p.specs[k] != null && p.specs[k] !== '').map(([k, label]) => (used.add(k), { key: k, label, value: p.specs[k] })) }))
    .filter((g) => g.rows.length);
  const extra = Object.keys(p.specs).filter((k) => !used.has(k));
  if (extra.length) out.push({ group: out.length ? 'Other' : 'Specifications', rows: extra.map((k) => ({ key: k, label: k, value: p.specs[k] })) });
  return out;
}
import { HOME, esc, href, arrow, icon, crumbs, productCard, brandMark, stage, brandVars } from './ui.js';
import { mediaOf } from './media.js';
import { openEnquiry } from './chrome.js';

function valueHtml(v) {
  if (Array.isArray(v)) return `<ul class="grid gap-1.5">${v.map((x) => `<li class="flex gap-2.5"><span class="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>${esc(x)}</li>`).join('')}</ul>`;
  if (v && typeof v === 'object')
    return `<dl class="grid gap-1.5">${Object.entries(v).map(([k, x]) => `<div class="flex gap-4"><dt class="w-14 shrink-0 text-muted">${esc(k)}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl>`;
  return esc(v);
}

export function renderProduct(slug) {
  const p = productBySlug(slug);
  if (!p) return null;
  const b = brandOf(p);
  const c = categoryOf(p);
  const g = groupOf(c);
  const gs = specGroups(p);
  const fields = gs.reduce((n, x) => n + x.rows.length, 0);
  const many = gs.length >= 3;
  const st = { img: 0 };
  const fromBrand = products.filter((x) => x.brand === p.brand && x.slug !== p.slug).slice(0, 4);
  const inCat = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const hl = c.card.filter((k) => p.specs[k] != null);
  const tileVal = (k) => {
    const v = p.specs[k];
    return shortValue(v);
  };
  const m = mediaOf(p);
  const srcOf = (i) => m.shots?.[p.images[i]] || (i === 0 ? m.card : '');
  // Photo when we have it; otherwise the labelled studio stage
  const view = (i, o = {}) => stage(p, { label: p.images[i], src: srcOf(i), ...o });
  const rows = (rs) => rs.map((r) => `<div class="spec-row"><dt class="text-[15px] text-muted">${esc(r.label)}</dt><dd class="text-[15px]" data-spec="${r.key}">${valueHtml(r.value)}</dd></div>`).join('');

  const html = `
  <section class="pt-[clamp(120px,10vw,152px)]">
    <div class="shell">${crumbs([['Home', HOME], ['Brands & Products', href('/products')], [g.name, href(`/category/${g.id}`)], [c.name, href(`/category/${c.id}`)], [p.name]])}</div>
    <div class="shell mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <button type="button" class="block w-full cursor-zoom-in" data-lightbox aria-label="Open full-screen gallery"><div data-main>${view(0, { cls: '!rounded-3xl', eager: true })}</div></button>
        ${
          p.images.length > 1
            ? `<ul class="mt-3 grid grid-cols-6 gap-2" aria-label="Images">${p.images.map((im, i) => `<li><button type="button" data-thumb="${i}" aria-label="Show ${esc(im)}" class="block w-full rounded-xl ring-2 ring-offset-2 transition ${i ? 'ring-transparent hover:ring-line' : 'ring-navy'}">${stage(p, { ratio: '1 / 1', src: srcOf(i), cls: '!rounded-xl [&_svg]:!w-[58%]' })}</button></li>`).join('')}</ul>`
            : ''
        }
      </div>

      <div class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-3">
          <a href="${href(`/brand/${b.id}`)}" class="rounded-lg border border-line px-3 py-2 transition-colors hover:border-ink" aria-label="${esc(b.name)}">${brandMark(b, { cls: 'h-7' })}</a>
          <a href="${href(`/category/${c.id}`)}" class="chip border-line text-ink transition-colors hover:border-ink">${esc(c.name)}</a>
        </div>
        <div>
          <h1 class="text-[clamp(2.25rem,1.5rem+2vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.035em]">${esc(p.name)}</h1>
          <p class="mt-3 text-sm text-muted">Model ${esc(p.model)}${p.modelNo ? ` · ${esc(p.modelNo)}` : ''}</p>
        </div>
        <p class="text-lg leading-relaxed text-ink/80">${esc(p.short)}</p>
        ${
          hl.length
            ? `<div class="grid gap-2 sm:grid-cols-3">${hl.map((k) => `<div class="tile"><p class="text-xs text-muted">${esc(fieldLabel(c.template, k))}</p><p class="mt-1.5 text-[15px] leading-snug font-semibold" data-tile="${k}">${esc(tileVal(k))}</p></div>`).join('')}</div>`
            : ''
        }
        <div class="flex flex-wrap gap-3 border-t border-line pt-7" id="cta">
          <button type="button" class="btn btn-navy" data-enquire-product>Enquire about this product ${arrow('orange')}</button>
          <a href="#specifications" data-anchor class="btn border border-ink/20 text-ink hover:border-ink">View specifications</a>
        </div>
      </div>
    </div>
  </section>

  <div id="pdp-bar" class="sticky top-0 z-30 mt-16 border-y border-line bg-white/90 backdrop-blur-lg transition-[top] duration-500">
    <div class="shell flex h-16 items-center gap-6">
      <p class="hidden max-w-[30ch] truncate font-semibold md:block">${esc(p.name)}</p>
      <nav class="-mx-1 flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Product sections">
        ${['Overview', 'Specifications', 'More'].map((s) => `<a href="#${s.toLowerCase()}" data-anchor data-sec="${s.toLowerCase()}" class="sec-link">${s === 'More' ? 'Related' : s}</a>`).join('')}
      </nav>
      <button type="button" class="btn btn-navy hidden !py-2.5 sm:inline-flex" data-enquire-product>Enquire ${arrow('orange')}</button>
    </div>
  </div>

  <section id="overview" class="shell section-y scroll-mt-24" data-section>
    <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div><h2 class="t-display">About the ${esc(p.model)}</h2></div>
      <div class="t-body grid content-start gap-5 text-[17px] leading-[1.65] text-ink/80">${p.overview.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
    </div>
    ${
      p.features?.length
        ? `<ul class="mt-14 grid gap-4 rounded-3xl bg-mist p-4 sm:grid-cols-2 ${p.features.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}">${p.features
            .map((f, i) => `<li class="enquiry !items-start !text-left"><div class="w-full">${stage(p, { ratio: '16 / 10', cls: '!rounded-xl', src: m.features?.[i] || '' })}</div><div class="px-1 pt-3"><p class="text-lg font-semibold tracking-[-0.01em]">${esc(f.title)}</p><p class="mt-1.5 text-sm text-muted">${esc(f.text)}</p></div></li>`)
            .join('')}</ul>`
        : ''
    }
  </section>

  <section id="specifications" class="scroll-mt-24 bg-mist section-y" data-section>
    <div class="shell">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div><h2 class="t-display">Technical details</h2><p class="t-body mt-2 text-muted">${fields} specifications${many ? ` in ${gs.length} groups` : ''}</p></div>
        ${many ? `<div class="flex gap-2"><button type="button" class="pill" data-expand="1">${icon.plus} Expand all</button><button type="button" class="pill" data-expand="0">Collapse all</button></div>` : ''}
      </div>
      ${
        many
          ? `<div class="grid gap-10 lg:grid-cols-[240px_1fr]">
              <nav class="hidden lg:block" aria-label="Specification groups"><ul class="sticky top-40 grid gap-1">${gs.map((x, i) => `<li><a href="#sg-${i}" data-anchor class="flex items-center justify-between rounded-lg px-4 py-2.5 text-[15px] text-muted transition-colors hover:bg-white hover:text-ink">${esc(x.group)}<span class="text-xs">${x.rows.length}</span></a></li>`).join('')}</ul></nav>
              <div class="grid gap-3">${gs.map((x, i) => `<details id="sg-${i}" class="spec-group scroll-mt-40" open><summary>${esc(x.group)}${icon.chev}</summary><dl class="px-6 pb-2">${rows(x.rows)}</dl></details>`).join('')}</div>
            </div>`
          : `<dl class="spec-group px-6 py-2 [&>.spec-row:first-child]:border-t-0">${gs.map((x) => rows(x.rows)).join('')}</dl>`
      }
      <p class="mt-5 text-xs text-muted">Specifications are provided by the manufacturer and may vary by region.</p>
    </div>
  </section>

  <section id="more" class="scroll-mt-24" data-section>
    <div class="on-brand section-y" style="${brandVars(b.id)}background:var(--brand);color:var(--on)">${strip(`More from ${b.name}`, fromBrand, href(`/brand/${b.id}`), true, `No other ${b.name} products yet.`, ['View all products', href('/products')], true)}</div>
    <div class="section-y">${strip(`More in ${c.name}`, inCat, href(`/category/${c.id}`), false, `No other ${c.name.toLowerCase()} yet.`, [`Browse ${g.name}`, href(`/category/${g.id}`)])}</div>
  </section>

  <div id="mobile-cta" class="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-line bg-white/95 p-3 backdrop-blur transition-transform duration-500 sm:hidden">
    <button type="button" class="btn btn-navy w-full" data-enquire-product>Enquire about this product ${arrow('orange')}</button>
  </div>`;

  return {
    title: p.name,
    html,
    wire(root) {
      const main = root.querySelector('[data-main]');
      const setImg = (i) => {
        st.img = i;
        main.innerHTML = view(i, { cls: '!rounded-3xl' });
        root.querySelectorAll('[data-thumb]').forEach((t) => {
          const on = +t.dataset.thumb === i;
          t.classList.toggle('ring-navy', on);
          t.classList.toggle('ring-transparent', !on);
        });
      };
      root.querySelectorAll('[data-thumb]').forEach((t) => t.addEventListener('click', () => setImg(+t.dataset.thumb)));
      root.querySelector('[data-lightbox]').addEventListener('click', () => lightbox(p, st, view, setImg));
      root.querySelectorAll('[data-enquire-product]').forEach((x) => x.addEventListener('click', () => openEnquiry({ product: p })));
      root.querySelectorAll('[data-expand]').forEach((x) => x.addEventListener('click', () => root.querySelectorAll('.spec-group').forEach((d) => (d.open = x.dataset.expand === '1'))));
      if (matchMedia('(max-width: 1023px)').matches && many) root.querySelectorAll('details.spec-group').forEach((d, i) => (d.open = i === 0));

      // Sticky bar sits below the navbar when it is showing
      const bar = root.querySelector('#pdp-bar');
      const syncBar = () => (bar.style.top = document.body.classList.contains('nav-hidden') ? '0px' : `${document.getElementById('nav').getBoundingClientRect().bottom + 8}px`);
      const mo = new MutationObserver(syncBar);
      mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      syncBar();

      const links = root.querySelectorAll('[data-sec]');
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => e.isIntersecting && links.forEach((l) => {
          const on = l.dataset.sec === e.target.id;
          l.classList.toggle('is-on', on);
        })),
        { rootMargin: '-45% 0px -50% 0px' },
      );
      root.querySelectorAll('[data-section]').forEach((s) => io.observe(s));
      const cta = root.querySelector('#mobile-cta');
      const io2 = new IntersectionObserver(([e]) => cta.classList.toggle('translate-y-full', e.isIntersecting || e.boundingClientRect.top > 0));
      io2.observe(root.querySelector('#cta'));
      return () => (io.disconnect(), io2.disconnect(), mo.disconnect());
    },
  };
}

function strip(title, list, more, dark, emptyText, emptyLink, brand = false) {
  const head = `<div class="mb-10 flex items-end justify-between gap-6"><h2 class="t-display">${esc(title)}</h2>${list.length ? `<a class="group hidden items-center gap-2 text-sm font-semibold sm:inline-flex" href="${more}">View all ${arrow(dark ? 'orange' : 'orange')}</a>` : ''}</div>`;
  if (!list.length)
    return `<div class="shell">${head}<div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl ${dark ? 'bg-white/10' : 'bg-mist'} p-8"><p class="t-body ${dark ? 'text-white/80' : 'text-muted'}">${esc(emptyText)}</p><a class="btn ${dark ? 'btn-outline-light' : 'btn-dark'}" href="${emptyLink[1]}">${esc(emptyLink[0])} ${arrow(dark ? 'white' : 'orange')}</a></div></div>`;
  return `<div class="shell">${head}
    <ul class="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      ${list.map((x, i) => `<li class="w-[78%] shrink-0 snap-start text-ink sm:w-auto">${productCard(x, i, { brand })}</li>`).join('')}
    </ul></div>`;
}

function lightbox(p, st, view, setImg) {
  const host = document.getElementById('overlays');
  let i = st.img;
  host.innerHTML = `
  <div class="fixed inset-0 z-[85] flex flex-col bg-ink/95 text-white" role="dialog" aria-modal="true" aria-label="${esc(p.name)} gallery">
    <div class="flex items-center justify-between p-5"><p class="text-sm"><span data-count></span> · ${esc(p.name)}</p><button type="button" data-x class="icon-btn bg-white/10 hover:bg-white/20" aria-label="Close gallery">${icon.close}</button></div>
    <div class="relative flex flex-1 items-center justify-center px-4 sm:px-20"><div class="w-full max-w-5xl" data-img></div>
      ${p.images.length > 1 ? `<button type="button" data-step="-1" class="icon-btn absolute left-3 size-12 bg-white/10 hover:bg-white/20 sm:left-6" aria-label="Previous image"><span class="rotate-180">${arrow('white')}</span></button><button type="button" data-step="1" class="icon-btn absolute right-3 size-12 bg-white/10 hover:bg-white/20 sm:right-6" aria-label="Next image">${arrow('white')}</button>` : ''}
    </div>
    <div class="flex justify-center gap-2 p-5">${p.images.map((_, k) => `<button type="button" data-k="${k}" class="h-1.5 w-8 rounded-full bg-white/25 transition-colors" aria-label="Image ${k + 1}"></button>`).join('')}</div>
  </div>`;
  const draw = () => {
    host.querySelector('[data-img]').innerHTML = view(i, { cls: '!rounded-2xl' });
    host.querySelector('[data-count]').textContent = `${i + 1} / ${p.images.length}`;
    host.querySelectorAll('[data-k]').forEach((d) => d.classList.toggle('!bg-accent', +d.dataset.k === i));
  };
  const close = () => (setImg(i), (host.innerHTML = ''), document.body.classList.remove('no-scroll'), removeEventListener('keydown', key));
  const step = (d) => ((i = (i + d + p.images.length) % p.images.length), draw());
  const key = (e) => (e.key === 'Escape' ? close() : e.key === 'ArrowRight' ? step(1) : e.key === 'ArrowLeft' ? step(-1) : 0);
  document.body.classList.add('no-scroll');
  addEventListener('keydown', key);
  host.querySelector('[data-x]').addEventListener('click', close);
  host.querySelectorAll('[data-step]').forEach((x) => x.addEventListener('click', () => step(+x.dataset.step)));
  host.querySelectorAll('[data-k]').forEach((x) => x.addEventListener('click', () => ((i = +x.dataset.k), draw())));
  draw();
}
