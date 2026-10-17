// Listing: category, group, all products, search results, and the brand page.
import { products, brands, groups, categories, categoriesIn, byId, groupOf, searchProducts, searchBrands, searchCategories } from '../../wireframe/src/data.js';
import { esc, href, arrow, icon, crumbs, productCard, brandMark, stage } from './ui.js';

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
    ? `<ul class="grid gap-5 sm:grid-cols-2 ${sidebar ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}">${shown.map((p, i) => `<li>${productCard(p, i)}</li>`).join('')}</ul>
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
      ${sidebar ? `<aside class="hidden w-[272px] shrink-0 lg:block" aria-label="Filters"><div class="sticky top-32"><p class="pb-2 text-xs tracking-[0.14em] text-muted uppercase">Filter by</p>${facets}</div></aside>` : ''}
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
      root.querySelector('[data-inline-search]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = e.target.q.value.trim();
        if (q) location.hash = href('/search', { q });
      });
    },
  };
}

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
    const sibs = categoriesIn(g.id);
    if (sibs.length > 1)
      extra = `<nav class="-mx-5 mt-8 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0" aria-label="${esc(g.name)} categories"><ul class="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <li><a class="pill ${ctx.kind === 'group' ? 'is-on' : ''}" href="${href(`/category/${g.id}`)}">All ${esc(g.name)}</a></li>
        ${sibs.map((c) => {
          const n = products.filter((p) => p.category === c.id).length;
          return `<li><a class="pill ${ctx.cat?.id === c.id ? 'is-on' : ''} ${n ? '' : 'pill-muted'}" href="${href(`/category/${c.id}`)}">${esc(c.name)} <span class="n">${n}</span></a></li>`;
        }).join('')}</ul></nav>`;
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
  const feature = [...base].sort((x, y) => y.released.localeCompare(x.released))[0];
  return `
  <section class="bg-navy pt-[clamp(128px,11vw,168px)] pb-[clamp(48px,5vw,80px)] text-white">
    <div class="shell">
      ${crumbs([['Home', '../'], ['Brands & Products', href('/products')], [b.name]], true)}
      <div class="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div class="flex flex-col items-start gap-6">
          <div class="rounded-xl bg-white px-6 py-5">${brandMark(b, { cls: 'h-9' })}</div>
          <h1 class="t-display">${esc(b.name)}</h1>
          <p class="t-body max-w-xl text-white/80">${esc(b.intro)}</p>
          <dl class="flex gap-10">
            <div><dt class="text-xs tracking-[0.14em] text-white/60 uppercase">Products</dt><dd class="mt-1 text-4xl font-semibold">${base.length}</dd></div>
            <div><dt class="text-xs tracking-[0.14em] text-white/60 uppercase">Categories</dt><dd class="mt-1 text-4xl font-semibold">${cats.length}</dd></div>
          </dl>
        </div>
        <div class="relative">
          ${feature ? stage(feature, { ratio: '16 / 11', dark: true, cls: '!rounded-2xl' }) : ''}
          <p class="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs text-white/80 backdrop-blur">Brand banner image</p>
        </div>
      </div>
      <nav class="-mx-5 mt-12 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0" aria-label="${esc(b.name)} categories">
        <ul class="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          <li><a class="pill-light ${selC.length ? '' : 'is-on'}" href="${url({ cat: [], page: '' })}">All <span class="n">${base.length}</span></a></li>
          ${cats.map((c) => {
            const on = selC.length === 1 && selC[0] === c.id;
            return `<li><a class="pill-light ${on ? 'is-on' : ''}" href="${url({ cat: on ? [] : [c.id], page: '' })}">${esc(c.name)} <span class="n">${base.filter((p) => p.category === c.id).length}</span></a></li>`;
          }).join('')}
        </ul>
      </nav>
    </div>
  </section>`;
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
