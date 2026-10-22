// Listing: category, group, all products, search results, and the brand page.
import { products, brands, groups, categories, categoriesIn, byId, groupOf, searchProducts, searchBrands, searchCategories } from '../../wireframe/v1/src/data.js';
import { esc, href, arrow, icon, crumbs, productCard, brandMark, brandVars } from './ui.js';
import { brandStyle, categoryHero } from './media.js';

const PAGE = 9;
let sheetOpen = false;
export const resetListing = () => (sheetOpen = false);
const list = (v) => (v ? v.split(',').filter(Boolean) : []);

export function context(kind, id, params) {
  if (kind === 'all') return { kind, path: '/products' };
  if (kind === 'search') return { kind, path: '/search', q: params.get('q') || '' };
  if (kind === 'brand') {
    const brand = byId(brands, id);
    return brand && { kind, path: `/brand/${id}`, brand };
  }
  const group = byId(groups, id);
  if (group) return { kind: 'group', path: `/category/${id}`, group };
  const cat = byId(categories, id);
  return cat && { kind: 'category', path: `/category/${id}`, cat, group: groupOf(cat) };
}

const baseSet = (ctx) =>
  ({
    brand: () => products.filter((p) => p.brand === ctx.brand.id),
    category: () => products.filter((p) => p.category === ctx.cat.id),
    group: () => products.filter((p) => byId(categories, p.category).group === ctx.group.id),
    search: () => searchProducts(ctx.q),
    all: () => products,
  })[ctx.kind]();

export function renderListing(ctx, params) {
  const selB = ctx.kind === 'brand' ? [] : list(params.get('brand'));
  const selC = ctx.kind === 'category' ? [] : list(params.get('cat'));
  const sort = params.get('sort') === 'az' ? 'az' : 'latest';
  const pages = Math.max(1, parseInt(params.get('page') || '1', 10));
  const keep = { q: ctx.q, brand: selB, cat: selC, sort: sort === 'latest' ? '' : sort };
  const url = (o = {}) => href(ctx.path, { ...keep, ...o });

  const base = baseSet(ctx);
  const byB = (p) => !selB.length || selB.includes(p.brand);
  const byC = (p) => !selC.length || selC.includes(p.category);
  const results = base.filter((p) => byB(p) && byC(p)).sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name) : b.released.localeCompare(a.released)));
  const shown = results.slice(0, pages * PAGE);

  const brandOpts = brands.map((b) => ({ id: b.id, name: b.name, n: base.filter((p) => p.brand === b.id && byC(p)).length })).filter((o) => o.n || selB.includes(o.id));
  const catScope = ctx.kind === 'group' ? categoriesIn(ctx.group.id) : categories;
  const catOpts = catScope.map((c) => ({ ...c, n: base.filter((p) => p.category === c.id && byB(p)).length })).filter((o) => o.n || selC.includes(o.id));

  const isEmpty = base.length === 0;
  const showCat = ctx.kind !== 'category' && ctx.kind !== 'brand';
  const showBrand = ctx.kind !== 'brand';
  const sidebar = !isEmpty && (showCat || showBrand);
  const active = selB.length + (ctx.kind === 'brand' ? 0 : selC.length);
  const toggle = (key, id) => {
    const cur = key === 'brand' ? selB : selC;
    return url({ [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id], page: '' });
  };
  const check = (on, label, n, to) =>
    `<a class="check" href="${to}" role="checkbox" aria-checked="${on}"><span class="check-box">${on ? icon.check : ''}</span>${esc(label)}<span class="check-count">${n}</span></a>`;

  const facets = `
    ${
      showCat
        ? `<details class="facet border-b border-line" open><summary>Category ${icon.chev}</summary><div class="pb-4">
            ${(ctx.kind === 'group' ? [{ g: null, opts: catOpts }] : groups.map((g) => ({ g, opts: catOpts.filter((o) => o.group === g.id) })).filter((x) => x.opts.length))
              .map(({ g, opts }) => `${g ? `<p class="mt-3 mb-1 px-2 text-[11px] tracking-[0.14em] text-muted uppercase first:mt-0">${esc(g.name)}</p>` : ''}${opts.map((o) => check(selC.includes(o.id), o.name, o.n, toggle('cat', o.id))).join('')}`)
              .join('')}</div></details>`
        : ''
    }
    ${showBrand ? `<details class="facet" open><summary>Brand ${icon.chev}</summary><div class="pb-4">${brandOpts.map((o) => check(selB.includes(o.id), o.name, o.n, toggle('brand', o.id))).join('')}</div></details>` : ''}`;

  const chips = [
    ...selC.map((id) => ({ label: byId(categories, id)?.name, to: toggle('cat', id) })),
    ...selB.map((id) => ({ label: byId(brands, id)?.name, to: toggle('brand', id) })),
  ];
  const activeChips =
    chips.length && ctx.kind !== 'brand'
      ? `<div class="mb-6 flex flex-wrap items-center gap-2">${chips.map((c) => `<a class="pill is-on" href="${c.to}" aria-label="Remove ${esc(c.label)}">${esc(c.label)} ${icon.close}</a>`).join('')}
          <a class="ml-1 text-sm underline underline-offset-4" href="${url({ brand: [], cat: [], page: '' })}">Clear all</a></div>`
      : '';

  const sortSel = `<label class="select"><span class="sr-only">Sort by</span><select data-sort aria-label="Sort by">
      <option value="latest" ${sort === 'latest' ? 'selected' : ''}>Sort: Latest</option><option value="az" ${sort === 'az' ? 'selected' : ''}>Sort: A–Z</option></select></label>`;

  const grid = results.length
    ? `<ul class="grid gap-5 sm:grid-cols-2 ${sidebar ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}">${shown.map((p, i) => `<li>${productCard(p, i, { brand: ctx.kind === 'brand' })}</li>`).join('')}</ul>
      ${
        results.length > shown.length
          ? `<div class="mt-14 grid justify-items-center gap-4"><p class="text-sm text-muted">Showing ${shown.length} of ${results.length} products</p>
              <div class="h-1 w-56 overflow-hidden rounded-full bg-line"><div class="h-full bg-accent" style="width:${(shown.length / results.length) * 100}%"></div></div>
              <a class="btn btn-navy" href="${url({ page: pages + 1 })}">Load more ${arrow('orange')}</a></div>`
          : ''
      }`
    : empty(ctx, base, url);

  const html = `
  ${ctx.kind === 'brand' ? brandHero(ctx, base, selC, url) : pageHero(ctx, base)}
  <section class="shell section-y !pt-12">
    ${
      sidebar
        ? `<div class="mb-6 flex items-center justify-between gap-3 lg:hidden"><button type="button" class="pill" data-open-sheet>${icon.filter} Filters${active ? ` <span class="grid size-5 place-items-center rounded-full bg-navy text-[11px] text-white">${active}</span>` : ''}</button>${sortSel}</div>`
        : ''
    }
    <div class="flex gap-12">
      ${sidebar ? `<aside class="hidden w-[272px] shrink-0 lg:block" aria-label="Filters"><div class="sticky top-48"><p class="pb-2 text-xs tracking-[0.14em] text-muted uppercase">Filter by</p>${facets}</div></aside>` : ''}
      <div class="min-w-0 flex-1">
        ${isEmpty ? '' : `<div class="mb-6 flex items-center justify-between gap-4"><p class="text-[15px] text-muted"><strong class="font-semibold text-ink">${results.length}</strong> product${results.length === 1 ? '' : 's'}</p><div class="${sidebar ? 'hidden lg:block' : ''}">${sortSel}</div></div>`}
        ${activeChips}
        ${grid}
      </div>
    </div>
  </section>
  ${
    sidebar
      ? `<div id="sheet" class="fixed inset-0 z-[70] ${sheetOpen ? '' : 'hidden'} lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" data-close-sheet></div>
          <div class="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-3xl bg-white">
            <div class="flex items-center justify-between px-5 pt-5 pb-2"><p class="text-lg font-semibold">Filters</p><a class="text-sm underline underline-offset-4" href="${url({ brand: [], cat: [], page: '' })}">Clear all</a></div>
            <div class="overflow-y-auto px-5">${facets}</div>
            <div class="border-t border-line p-4"><button type="button" class="btn btn-navy w-full" data-close-sheet>Show ${results.length} product${results.length === 1 ? '' : 's'}</button></div>
          </div></div>`
      : ''
  }`;

  return {
    title: { all: 'All products', group: ctx.group?.name, category: ctx.cat?.name, brand: ctx.brand?.name, search: `Search: ${ctx.q}` }[ctx.kind],
    html,
    wire(root) {
      root.querySelectorAll('[data-sort]').forEach((s) => s.addEventListener('change', () => (location.hash = url({ sort: s.value === 'latest' ? '' : s.value, page: '' }))));
      const sheet = root.querySelector('#sheet');
      const setSheet = (o) => {
        sheetOpen = o;
        sheet?.classList.toggle('hidden', !o);
        document.body.classList.toggle('no-scroll', o);
      };
      root.querySelector('[data-open-sheet]')?.addEventListener('click', () => setSheet(true));
      root.querySelectorAll('[data-close-sheet]').forEach((el) => el.addEventListener('click', () => setSheet(false)));
      if (sheetOpen && sheet) document.body.classList.add('no-scroll');
      const off = wirePillbar(root);
      root.querySelector('[data-inline-search]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = e.target.q.value.trim();
        if (q) location.hash = href('/search', { q });
      });
      return off;
    },
  };
}

/** Category pill bar: stick under the navbar (or to the very top when the navbar
 *  has scrolled away) and switch on its dark backdrop once it is stuck. */
export function wirePillbar(root) {
  const bar = root.querySelector('.pillbar');
  if (!bar) return null;
  const mark = bar.previousElementSibling; // in-flow marker: the bar's resting spot is 106px above its bottom
  const nav = document.getElementById('nav');
  let top = 0;
  const sync = () => {
    top = document.body.classList.contains('nav-hidden') ? 0 : nav.offsetTop + nav.offsetHeight + 8; // layout box, not mid-transition
    bar.style.top = `${top}px`;
    // Judge by the resting position so the navbar's slide (which animates `top`) can't fool it
    bar.classList.toggle('is-stuck', mark.getBoundingClientRect().bottom - 106 < top);
  };
  const mo = new MutationObserver(() => requestAnimationFrame(sync));
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  sync();
  return () => (mo.disconnect(), removeEventListener('scroll', sync), removeEventListener('resize', sync));
}

/** Pills that live at the bottom of a photo hero and stick on scroll. */
export const pillbar = (label, items, vars = '') => `
  <div class="h-0" aria-hidden="true"></div>
  <div class="pillbar -mt-[106px]" style="${vars}">
    <div class="pillbar-inner">
      <nav class="shell" aria-label="${esc(label)}">
        <ul class="-mx-5 flex w-auto gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">${items}</ul>
      </nav>
    </div>
  </div>`;

// ── Heroes ───────────────────────────────────────────────────────────────────
function pageHero(ctx, base) {
  const home = ['Home', '../'];
  const prods = ['Brands & Products', href('/products')];
  let trail;
  let eyebrow;
  let title;
  let sub;
  let extra = '';
  if (ctx.kind === 'all') {
    trail = [home, ['Brands & Products']];
    eyebrow = 'Catalogue';
    title = 'All products';
    sub = `The full BMK Group catalogue across ${brands.length} brands and ${groups.length} categories.`;
    extra = `<div class="mt-8 flex flex-wrap gap-2">${groups.map((g) => `<a class="pill" href="${href(`/category/${g.id}`)}">${esc(g.name)}</a>`).join('')}</div>`;
  } else if (ctx.kind === 'search') {
    trail = [home, ['Search']];
    eyebrow = 'Search results';
    title = ctx.q ? `“${ctx.q}”` : 'Search';
    sub = `${base.length} product${base.length === 1 ? '' : 's'} found.`;
    const bs = searchBrands(ctx.q);
    const cs = searchCategories(ctx.q);
    extra = `<form data-inline-search role="search" class="mt-8 flex max-w-2xl items-center gap-3 rounded-full border border-ink/15 bg-white py-1.5 pr-1.5 pl-5 focus-within:border-navy">
        ${icon.search}<input name="q" type="search" value="${esc(ctx.q)}" class="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search products" /><button class="btn btn-dark !py-3">Search</button></form>
      ${bs.length || cs.length ? `<div class="mt-5 flex flex-wrap items-center gap-2 text-sm"><span class="text-muted">Also matching</span>${bs.map((b) => `<a class="pill" href="${href(`/brand/${b.id}`)}">Brand · ${esc(b.name)}</a>`).join('')}${cs.map((c) => `<a class="pill" href="${href(`/category/${c.id}`)}">Category · ${esc(c.name)}</a>`).join('')}</div>` : ''}`;
  } else {
    const g = ctx.group;
    trail = ctx.kind === 'group' ? [home, prods, [g.name]] : [home, prods, [g.name, href(`/category/${g.id}`)], [ctx.cat.name]];
    eyebrow = ctx.kind === 'group' ? 'Category' : g.name;
    title = ctx.kind === 'group' ? g.name : ctx.cat.name;
    sub = ctx.kind === 'group' ? `Every ${g.name.toLowerCase()} product BMK Group handles, across ${categoriesIn(g.id).length} categories.` : `${base.length} product${base.length === 1 ? '' : 's'} from the brands BMK Group handles.`;
    const img = categoryHero[ctx.cat?.id] || categoryHero[g.id];
    // Empty categories are left out of the pills (the current one always shows)
    const sibs = categoriesIn(g.id)
      .map((c) => ({ c, n: products.filter((p) => p.category === c.id).length }))
      .filter(({ c, n }) => n || ctx.cat?.id === c.id);
    const pills = sibs.length
      ? pillbar(
          `${g.name} categories`,
          `<li><a class="pill-dark ${ctx.kind === 'group' ? 'is-on' : ''}" href="${href(`/category/${g.id}`)}">All ${esc(g.name)}</a></li>
          ${sibs.map(({ c, n }) => `<li><a class="pill-dark ${ctx.cat?.id === c.id ? 'is-on' : ''}" href="${href(`/category/${c.id}`)}">${esc(c.name)} <span class="n">${n}</span></a></li>`).join('')}`,
        )
      : '';
    return `
  <section class="photo-hero pt-[clamp(128px,11vw,176px)] ${pills ? 'pb-[138px]' : 'pb-[clamp(40px,4.5vw,64px)]'}" style="--hero-overlay:linear-gradient(180deg,rgb(0 0 0/.5) 0%,rgb(0 0 0/.85) 100%)">
    ${img ? `<img class="photo-hero-img" src="${img}" alt="" fetchpriority="high" />` : ''}
    <div class="shell">
      ${crumbs(trail, true)}
      <span class="pill-dark mt-6">${esc(eyebrow)}</span>
      <h1 class="t-display mt-4 max-w-4xl">${esc(title)}</h1>
      <p class="t-body mt-2 max-w-2xl text-mist">${esc(sub)}</p>
    </div>
  </section>
  ${pills}`;
  }
  return `
  <section class="bg-mist pt-[clamp(128px,11vw,168px)] pb-[clamp(40px,4.5vw,64px)]">
    <div class="shell">
      ${crumbs(trail)}
      <span class="chip mt-8 border-line bg-white text-ink">${esc(eyebrow)}</span>
      <h1 class="t-display mt-5 max-w-4xl">${esc(title)}</h1>
      <p class="t-body mt-3 max-w-2xl text-ink/80">${esc(sub)}</p>
      ${extra}
    </div>
  </section>`;
}

function brandHero(ctx, base, selC, url) {
  const b = ctx.brand;
  const cats = categories.filter((c) => base.some((p) => p.category === c.id));
  const img = brandStyle[b.id]?.hero;
  const tabs = pillbar(
    `${b.name} categories`,
    `<li><a class="pill-dark is-brand ${selC.length ? '' : 'is-on'}" href="${url({ cat: [], page: '' })}">All <span class="n">${base.length}</span></a></li>
    ${cats.map((c) => {
      const on = selC.length === 1 && selC[0] === c.id;
      return `<li><a class="pill-dark is-brand ${on ? 'is-on' : ''}" href="${url({ cat: on ? [] : [c.id], page: '' })}">${esc(c.name)} <span class="n">${base.filter((p) => p.category === c.id).length}</span></a></li>`;
    }).join('')}`,
    brandVars(b.id),
  );
  return `
  <section class="photo-hero pt-[clamp(128px,11vw,176px)] pb-[146px]" style="--hero-overlay:linear-gradient(90deg,rgb(0 0 0/.55) 0%,rgb(0 0 0/.15) 55%,rgb(0 0 0/0) 100%)">
    ${img ? `<img class="photo-hero-img object-[70%_top]" src="${img}" alt="" fetchpriority="high" />` : ''}
    <div class="shell">
      ${crumbs([['Home', '../'], ['Brands & Products', href('/products')], [b.name]], true)}
      <div class="mt-10 flex max-w-xl flex-col items-start gap-6">
        <div class="rounded-xl bg-white px-4 py-4">${brandMark(b, { cls: 'h-[42px]' })}</div>
        <h1 class="t-display">${esc(b.name)}</h1>
        <p class="t-body text-white/75">${esc(b.intro)}</p>
        <dl class="flex gap-12">
          <div><dt class="text-[11px] tracking-[0.14em] text-white/60 uppercase">Products</dt><dd class="mt-1 text-[32px] leading-10 tracking-[-0.02em]">${base.length}</dd></div>
          <div><dt class="text-[11px] tracking-[0.14em] text-white/60 uppercase">Categories</dt><dd class="mt-1 text-[32px] leading-10 tracking-[-0.02em]">${cats.length}</dd></div>
        </dl>
      </div>
    </div>
  </section>
  ${tabs}`;
}

function empty(ctx, base, url) {
  const box = (title, body, actions) =>
    `<div class="rounded-2xl bg-mist p-10 sm:p-14"><p class="text-[28px] leading-tight tracking-[-0.04em]">${title}</p><p class="t-body mt-3 max-w-xl text-muted">${body}</p><div class="mt-8 flex flex-wrap gap-3">${actions}</div></div>`;
  if (ctx.kind === 'search')
    return box(
      `No products match “${esc(ctx.q)}”`,
      'Check the spelling, or search by model name or brand.',
      `${['X-T5', 'Pixel', 'NIKKOR', 'instax'].map((t) => `<a class="pill" href="${href('/search', { q: t })}">${t}</a>`).join('')}<a class="btn btn-navy" href="${href('/products')}">Browse all products ${arrow('orange')}</a>`,
    );
  if (!base.length) {
    const name = ctx.cat?.name || ctx.group?.name || ctx.brand?.name;
    const alt = ctx.group ? categoriesIn(ctx.group.id).filter((c) => products.some((p) => p.category === c.id)) : [];
    return box(
      `New ${esc(name.toLowerCase())} are on the way`,
      'Products for this category are being added. Explore related categories, or ask our team what’s available.',
      `${alt.map((c) => `<a class="pill" href="${href(`/category/${c.id}`)}">${esc(c.name)}</a>`).join('')}<button type="button" class="btn btn-navy" data-enquire>Make an enquiry ${arrow('orange')}</button>`,
    );
  }
  return box('No products match these filters', 'Try removing a filter.', `<a class="btn btn-dark" href="${url({ brand: [], cat: [], page: '' })}">Clear filters</a>`);
}
