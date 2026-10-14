// Universal product details page. Everything below the summary is driven by the
// product's category template, so a 6-field film pack and a 21-field phone use
// the same layout without any per-product design work.
import { products, templates, productBySlug, brandOf, categoryOf, groupOf, fieldLabel, shortValue } from './data.js';
import { esc, href, icons, ph, note, productCard } from './ui.js';
import { openEnquiry } from './enquiry.js';

/** Spec groups for a product: template order, empty fields and groups dropped,
 *  and any filled field the template doesn't know lands in "Other" so nothing is lost. */
export function specGroups(p) {
  const tpl = templates[categoryOf(p).template] || [];
  const used = new Set();
  const out = tpl
    .map((g) => ({
      group: g.group,
      rows: g.fields.filter(([k]) => p.specs[k] != null && p.specs[k] !== '').map(([k, label]) => (used.add(k), { key: k, label, value: p.specs[k] })),
    }))
    .filter((g) => g.rows.length);
  const extra = Object.keys(p.specs).filter((k) => !used.has(k));
  if (extra.length) out.push({ group: out.length ? 'Other' : 'Specifications', rows: extra.map((k) => ({ key: k, label: k, value: p.specs[k] })) });
  return out;
}

function valueHtml(v, variant) {
  if (Array.isArray(v)) return `<ul class="grid gap-1">${v.map((x) => `<li class="flex gap-2"><span aria-hidden="true" class="text-faint">–</span>${esc(x)}</li>`).join('')}</ul>`;
  if (v && typeof v === 'object')
    return `<dl class="grid gap-1">${Object.entries(v)
      .map(([k, x]) => `<div class="flex gap-3 ${variant && variant !== k ? 'text-faint' : ''}"><dt class="w-16 shrink-0 text-sub">${esc(k)}</dt><dd>${esc(x)}</dd></div>`)
      .join('')}</dl>`;
  return esc(v);
}

export function renderProduct(slug) {
  const p = productBySlug(slug);
  if (!p) return null;
  const b = brandOf(p);
  const c = categoryOf(p);
  const g = groupOf(c);
  const groupsList = specGroups(p);
  const fieldCount = groupsList.reduce((n, x) => n + x.rows.length, 0);
  const manyGroups = groupsList.length >= 3;
  const state = { img: 0, colour: p.colours[0] || '', variant: p.variants?.[0] || '' };

  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const fromBrand = products.filter((x) => x.brand === p.brand && x.slug !== p.slug && !related.includes(x)).slice(0, 4);

  const hl = c.card.filter((k) => p.specs[k] != null);
  const tile = (k) => {
    const v = p.specs[k];
    const val = v && typeof v === 'object' && !Array.isArray(v) ? v[state.variant] ?? shortValue(v) : shortValue(v);
    return `<div class="rounded-lg border border-line p-3"><p class="text-xs text-faint">${esc(fieldLabel(c.template, k))}</p><p class="mt-1 text-sm leading-snug font-semibold" data-tile="${k}">${esc(val)}</p></div>`;
  };

  const specRows = (rows) =>
    `<dl class="divide-y divide-hair">${rows
      .map(
        (r) => `<div class="grid gap-1 py-3 sm:grid-cols-[minmax(160px,34%)_1fr] sm:gap-6"><dt class="text-sm text-sub">${esc(r.label)}</dt><dd class="text-sm" data-spec="${r.key}">${valueHtml(r.value, state.variant)}</dd></div>`,
      )
      .join('')}</dl>`;

  const specs = manyGroups
    ? `<div class="grid gap-10 lg:grid-cols-[220px_1fr]">
        <nav class="hidden lg:block" aria-label="Specification groups" ${note('Group index: appears when a product has 3+ spec groups. Sticky, so long spec sheets stay navigable.')}>
          <ul class="sticky top-36 grid gap-1 text-sm">${groupsList.map((x, i) => `<li><a class="block rounded px-3 py-1.5 text-sub hover:bg-wash hover:text-ink" href="#spec-${i}" data-anchor>${esc(x.group)} <span class="text-faint">${x.rows.length}</span></a></li>`).join('')}</ul>
        </nav>
        <div class="grid gap-3">
          ${groupsList
            .map(
              (x, i) => `<details id="spec-${i}" class="group rounded-lg border border-line" open>
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold">${esc(x.group)}<span class="flex items-center gap-3 text-xs font-normal text-faint">${x.rows.length} spec${x.rows.length === 1 ? '' : 's'}<span class="transition-transform group-open:rotate-180">${icons.chevron}</span></span></summary>
                <div class="border-t border-hair px-5">${specRows(x.rows)}</div>
              </details>`,
            )
            .join('')}
        </div>
      </div>`
    : `<div class="rounded-lg border border-line px-5" ${note('Short spec sheets (one or two groups) render as a single table without the group index or accordions, so a 6-field product doesn’t look empty.')}>${groupsList.map((x) => specRows(x.rows)).join('')}</div>`;

  const imgLabel = (i) => `${p.images[i]}${state.colour && p.colours.length > 1 ? ` · ${state.colour}` : ''}`;

  const html = `
  <div class="wrap pt-6">
    <nav class="crumbs" aria-label="Breadcrumb" ${note('Breadcrumb: Home / Products / Group / Category / Product. Brand is linked from the summary, so the trail stays one fixed shape for every product.')}>
      <a href="#/">Home</a><span aria-hidden="true">/</span><a href="${href('/products')}">Products</a><span aria-hidden="true">/</span>
      <a href="${href(`/category/${g.id}`)}">${esc(g.name)}</a><span aria-hidden="true">/</span><a href="${href(`/category/${c.id}`)}">${esc(c.name)}</a><span aria-hidden="true">/</span>
      <span aria-current="page" class="text-ink">${esc(p.name)}</span>
    </nav>
  </div>

  <section class="wrap mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14" id="summary">
    <div ${note(`Gallery: main image, thumbnails and full-screen view. Image count varies per product (this one has ${p.images.length}); with one image the thumbnails hide. Colour selection swaps the image set.`)}>
      <button type="button" class="block w-full cursor-zoom-in" data-open-lightbox aria-label="Open full-screen gallery">
        <div data-main-img>${ph(imgLabel(0), 'rounded-xl', '4 / 3')}</div>
      </button>
      ${
        p.images.length > 1
          ? `<ul class="mt-3 grid grid-cols-6 gap-2" data-thumbs>${p.images
              .map(
                (im, i) => `<li><button type="button" data-thumb="${i}" aria-label="Show ${esc(im)}" class="block w-full rounded-lg border-2 ${i === 0 ? 'border-ink' : 'border-transparent'}">${ph('', 'rounded-md', '1 / 1')}</button></li>`,
              )
              .join('')}</ul>`
          : ''
      }
    </div>

    <div class="grid content-start gap-6">
      <div class="flex items-center gap-3">
        <a href="${href(`/brand/${b.id}`)}" class="w-24" aria-label="${esc(b.name)} brand page">${ph(`${b.name}`, 'rounded border border-line', '3 / 1')}</a>
        <a href="${href(`/category/${c.id}`)}" class="text-sm text-sub hover:text-ink hover:underline">${esc(c.name)}</a>
      </div>
      <div>
        <h1 class="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">${esc(p.name)}</h1>
        <p class="mt-2 text-sm text-sub" ${note('Model name and model number. Model numbers are not in the client sheet yet; dashed boxes mark content still to be supplied.')}>Model: ${esc(p.model)} · Model no.: ${p.modelNo ? esc(p.modelNo) : '<span class="tbc">to be supplied</span>'}</p>
      </div>
      <p class="text-[17px] leading-relaxed" ${note('Short description: one or two lines (draft copy here; Phitany to write from the brand material).')}>${esc(p.short)}</p>

      ${
        p.variants
          ? `<div ${note('Variant selector (only when a product has variants, e.g. watch case sizes). Switches the size-specific values in the highlights and specification table.')}>
              <p class="mb-2 text-sm"><span class="text-sub">Size:</span> <strong data-variant-label>${esc(state.variant)}</strong></p>
              <div class="flex flex-wrap gap-2">${p.variants.map((v, i) => `<button type="button" class="chip" data-variant="${esc(v)}" aria-pressed="${i === 0}">${esc(v)}</button>`).join('')}</div>
            </div>`
          : ''
      }
      ${
        p.colours.length
          ? `<div ${note('Colours from the client sheet’s COLORS column. In the build each colour can carry its own image set. Hidden when a product has no colour options.')}>
              <p class="mb-2 text-sm"><span class="text-sub">Colour:</span> <strong data-colour-label>${esc(state.colour)}</strong></p>
              <div class="flex flex-wrap gap-2">${p.colours
                .map(
                  (col, i) => `<button type="button" class="chip" data-colour="${esc(col)}" aria-pressed="${i === 0}"><span class="size-3.5 rounded-full border border-line" style="background:hsl(0 0% ${88 - i * 14}%)"></span>${esc(col)}</button>`,
                )
                .join('')}</div>
            </div>`
          : ''
      }
      ${
        hl.length
          ? `<div ${note('Key highlights: the same per-category fields used on product cards, so listing and detail page always agree.')}>
              <p class="mb-2 text-sm font-semibold">Key highlights</p>
              <div class="grid gap-2 sm:grid-cols-3">${hl.map(tile).join('')}</div>
            </div>`
          : ''
      }
      <div class="flex flex-wrap gap-3 border-t border-hair pt-6" id="cta">
        <button type="button" class="btn btn-primary" data-enquire ${note('Primary action is an enquiry (there is no checkout). Opens the enquiry popup pre-filled with this product.')}>Enquire about this product ${icons.arrow}</button>
        <a href="#specifications" class="btn btn-ghost" data-anchor>View specifications</a>
      </div>
      <p class="text-sm text-sub">More from <a class="font-medium text-ink underline underline-offset-4" href="${href(`/brand/${b.id}`)}">${esc(b.name)}</a> · <a class="underline underline-offset-4" href="${href(`/category/${c.id}`)}">All ${esc(c.name.toLowerCase())}</a></p>
    </div>
  </section>

  <div id="pdp-nav" class="sticky top-16 z-40 mt-14 border-y border-line bg-white/95 backdrop-blur" ${note('Sticky section bar: jump links with the active section highlighted, plus the enquiry button, always within reach on long pages.')}>
    <div class="wrap flex h-14 items-center gap-6">
      <p class="hidden max-w-[28ch] truncate text-sm font-semibold md:block">${esc(p.name)}</p>
      <nav class="-mx-1 flex flex-1 gap-1 overflow-x-auto text-sm [scrollbar-width:none]" aria-label="Product sections">
        ${['Overview', 'Specifications', related.length || fromBrand.length ? 'Related' : null]
          .filter(Boolean)
          .map((s) => `<a href="#${s.toLowerCase()}" data-anchor data-section-link="${s.toLowerCase()}" class="rounded-full px-3 py-1.5 whitespace-nowrap text-sub hover:text-ink">${s}</a>`)
          .join('')}
      </nav>
      <button type="button" class="btn btn-primary btn-sm hidden sm:inline-flex" data-enquire>Enquire</button>
    </div>
  </div>

  <section id="overview" class="wrap scroll-mt-36 py-14" data-section>
    <h2 class="text-2xl font-semibold tracking-tight">Overview</h2>
    <div class="mt-5 grid max-w-[72ch] gap-4 text-[16px] leading-relaxed text-sub" ${note('Detailed description: rich text from the admin.')}>${p.overview.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
    ${
      p.features?.length
        ? `<ul class="mt-10 grid gap-4 sm:grid-cols-2 ${p.features.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}" ${note('Feature blocks are optional per product (image + title + text). Products without them simply skip this row; try the Nikon Zf.')}>${p.features
            .map((f) => `<li class="rounded-lg border border-line">${ph('Feature image', 'rounded-t-lg', '16 / 10')}<div class="p-4"><p class="font-semibold">${esc(f.title)}</p><p class="mt-1 text-sm text-sub">${esc(f.text)}</p></div></li>`)
            .join('')}</ul>`
        : ''
    }
  </section>

  <section id="specifications" class="scroll-mt-36 border-t border-line bg-wash py-14" data-section>
    <div class="wrap">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">Specifications</h2>
          <p class="mt-1 text-sm text-sub" ${note(`Universal spec layout. Fields and groups come from the category’s spec template (this product: “${c.template}” template, ${fieldCount} filled fields in ${groupsList.length} group${groupsList.length === 1 ? '' : 's'}). Empty fields and groups are hidden automatically; values can be text, lists, or per-variant values. New product types only need a new template, never a new page design.`)}>${fieldCount} specifications${manyGroups ? ` in ${groupsList.length} groups` : ''}</p>
        </div>
        ${manyGroups ? `<div class="flex gap-2"><button type="button" class="chip" data-expand="1">Expand all</button><button type="button" class="chip" data-expand="0">Collapse all</button></div>` : ''}
      </div>
      <div class="rounded-xl bg-white p-4 sm:p-6">${specs}</div>
      <p class="mt-4 text-xs text-faint">Specifications are provided by the manufacturer and may vary by region.</p>
    </div>
  </section>

  ${
    related.length || fromBrand.length
      ? `<section id="related" class="wrap scroll-mt-36 py-14" data-section ${note('Related products: same category first, then more from the same brand. Rows hide when empty. Scroll sideways on mobile.')}>
          ${related.length ? relatedRow(`More in ${c.name}`, related, href(`/category/${c.id}`)) : ''}
          ${fromBrand.length ? relatedRow(`More from ${b.name}`, fromBrand, href(`/brand/${b.id}`)) : ''}
        </section>`
      : ''
  }

  <div id="mobile-cta" class="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-line bg-white p-3 transition-transform sm:hidden" ${note('Mobile: a sticky enquiry bar appears once the main button scrolls out of view.')}>
    <button type="button" class="btn btn-primary w-full" data-enquire>Enquire about this product</button>
  </div>`;

  return {
    html,
    title: p.name,
    wire(root) {
      const main = root.querySelector('[data-main-img]');
      const setImg = (i) => {
        state.img = i;
        main.innerHTML = ph(imgLabel(i), 'rounded-xl', '4 / 3');
        root.querySelectorAll('[data-thumb]').forEach((t) => {
          t.classList.toggle('border-ink', +t.dataset.thumb === i);
          t.classList.toggle('border-transparent', +t.dataset.thumb !== i);
        });
      };
      root.querySelectorAll('[data-thumb]').forEach((t) => t.addEventListener('click', () => setImg(+t.dataset.thumb)));
      root.querySelector('[data-open-lightbox]').addEventListener('click', () => lightbox(p, state, imgLabel, setImg));

      root.querySelectorAll('[data-colour]').forEach((btn) =>
        btn.addEventListener('click', () => {
          state.colour = btn.dataset.colour;
          root.querySelectorAll('[data-colour]').forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
          root.querySelector('[data-colour-label]').textContent = state.colour;
          setImg(state.img);
        }),
      );
      root.querySelectorAll('[data-variant]').forEach((btn) =>
        btn.addEventListener('click', () => {
          state.variant = btn.dataset.variant;
          root.querySelectorAll('[data-variant]').forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
          root.querySelector('[data-variant-label]').textContent = state.variant;
          root.querySelectorAll('[data-tile]').forEach((el) => {
            const v = p.specs[el.dataset.tile];
            if (v && typeof v === 'object' && !Array.isArray(v)) el.textContent = v[state.variant];
          });
          root.querySelectorAll('[data-spec]').forEach((el) => {
            const v = p.specs[el.dataset.spec];
            if (v && typeof v === 'object' && !Array.isArray(v)) el.innerHTML = valueHtml(v, state.variant);
          });
        }),
      );

      root.querySelectorAll('[data-enquire]').forEach((b) => b.addEventListener('click', () => openEnquiry({ product: p })));
      root.querySelectorAll('[data-expand]').forEach((b) =>
        b.addEventListener('click', () => root.querySelectorAll('#specifications details').forEach((d) => (d.open = b.dataset.expand === '1'))),
      );
      // On small screens spec groups start collapsed (accordion); desktop shows all open
      if (matchMedia('(max-width: 1023px)').matches && manyGroups) {
        root.querySelectorAll('#specifications details').forEach((d, i) => (d.open = i === 0));
      }

      // Active section in the sticky bar
      const links = root.querySelectorAll('[data-section-link]');
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((l) => {
              const on = l.dataset.sectionLink === e.target.id;
              l.classList.toggle('bg-ink', on);
              l.classList.toggle('text-white', on);
              l.classList.toggle('text-sub', !on);
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      root.querySelectorAll('[data-section]').forEach((s) => io.observe(s));

      // Mobile sticky CTA once the main CTA is out of view
      const bar = root.querySelector('#mobile-cta');
      const io2 = new IntersectionObserver(([e]) => bar.classList.toggle('translate-y-full', e.isIntersecting || e.boundingClientRect.top > 0), { threshold: 0 });
      io2.observe(root.querySelector('#cta'));

      return () => {
        io.disconnect();
        io2.disconnect();
      };
    },
  };
}

function relatedRow(title, list, more) {
  return `<div class="mb-12 last:mb-0">
    <div class="mb-5 flex items-end justify-between gap-4"><h2 class="text-2xl font-semibold tracking-tight">${esc(title)}</h2><a class="text-sm font-semibold underline-offset-4 hover:underline" href="${more}">View all</a></div>
    <ul class="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      ${list.map((x) => `<li class="w-[75%] shrink-0 snap-start sm:w-auto">${productCard(x)}</li>`).join('')}
    </ul>
  </div>`;
}

function lightbox(p, state, imgLabel, setImg) {
  const host = document.getElementById('overlays');
  let i = state.img;
  const draw = () => {
    host.querySelector('[data-lb-img]').innerHTML = ph(imgLabel(i), 'rounded-lg', '4 / 3');
    host.querySelector('[data-lb-count]').textContent = `${i + 1} / ${p.images.length}`;
    host.querySelectorAll('[data-lb-thumb]').forEach((t) => t.classList.toggle('border-white', +t.dataset.lbThumb === i));
  };
  host.innerHTML = `
  <div class="fixed inset-0 z-[85] flex flex-col bg-ink/95 text-white" role="dialog" aria-modal="true" aria-label="${esc(p.name)} gallery">
    <div class="flex items-center justify-between p-4"><p class="text-sm"><span data-lb-count></span> · ${esc(p.name)}</p>
      <button type="button" data-lb-close class="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close gallery">${icons.close}</button></div>
    <div class="relative flex flex-1 items-center justify-center px-4 sm:px-16">
      <div class="w-full max-w-5xl" data-lb-img></div>
      ${p.images.length > 1 ? `<button type="button" data-lb-step="-1" class="absolute left-2 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-4" aria-label="Previous image"><span class="rotate-180">${icons.arrow}</span></button>
      <button type="button" data-lb-step="1" class="absolute right-2 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-4" aria-label="Next image">${icons.arrow}</button>` : ''}
    </div>
    <div class="flex justify-center gap-2 overflow-x-auto p-4">${p.images.map((_, k) => `<button type="button" data-lb-thumb="${k}" class="w-14 shrink-0 rounded border-2 border-transparent" aria-label="Image ${k + 1}">${ph('', 'rounded-sm', '1 / 1')}</button>`).join('')}</div>
  </div>`;
  document.body.classList.add('no-scroll');
  const close = () => {
    setImg(i);
    host.innerHTML = '';
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
  };
  const step = (d) => {
    i = (i + d + p.images.length) % p.images.length;
    draw();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };
  document.addEventListener('keydown', onKey);
  host.querySelector('[data-lb-close]').addEventListener('click', close);
  host.querySelectorAll('[data-lb-step]').forEach((b) => b.addEventListener('click', () => step(+b.dataset.lbStep)));
  host.querySelectorAll('[data-lb-thumb]').forEach((b) => b.addEventListener('click', () => ((i = +b.dataset.lbThumb), draw())));
  draw();
}
