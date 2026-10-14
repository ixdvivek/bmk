// One listing component for every catalogue context:
//   all products · group · category · brand · search results
// Only the header and which filter is locked change between contexts.
import { products, brands, groups, categories, categoriesIn, byId, groupOf, searchProducts, searchBrands, searchCategories } from './data.js';
import { esc, href, icons, ph, note, productCard } from './ui.js';

const PAGE = 8;
let sheetOpen = false;

const list = (v) => (v ? v.split(',').filter(Boolean) : []);

/** Resolve the context from the route. Returns null for unknown slugs. */
export function listingContext(kind, id, params) {
  if (kind === 'all') return { kind, path: '/products' };
  if (kind === 'search') return { kind, path: '/search', q: params.get('q') || '' };
  if (kind === 'brand') {
    const brand = byId(brands, id);
    return brand && { kind, path: `/brand/${id}`, brand };
  }
  if (kind === 'category') {
    const group = byId(groups, id);
    if (group) return { kind: 'group', path: `/category/${id}`, group };
    const cat = byId(categories, id);
    return cat && { kind: 'category', path: `/category/${id}`, cat, group: groupOf(cat) };
  }
  return null;
}

function baseSet(ctx) {
  switch (ctx.kind) {
    case 'brand':
      return products.filter((p) => p.brand === ctx.brand.id);
    case 'category':
      return products.filter((p) => p.category === ctx.cat.id);
    case 'group':
      return products.filter((p) => byId(categories, p.category).group === ctx.group.id);
    case 'search':
      return searchProducts(ctx.q);
    default:
      return products;
  }
}

export function renderListing(ctx, params) {
  const selB = ctx.kind === 'brand' ? [] : list(params.get('brand'));
  const selC = ctx.kind === 'category' ? [] : list(params.get('cat'));
  const sort = params.get('sort') === 'az' ? 'az' : 'latest';
  const pages = Math.max(1, parseInt(params.get('page') || '1', 10));
  const keep = { q: ctx.q, brand: selB, cat: selC, sort: sort === 'latest' ? '' : sort };
  const url = (over = {}) => href(ctx.path, { ...keep, ...over });

  const base = baseSet(ctx);
  const byB = (p) => !selB.length || selB.includes(p.brand);
  const byC = (p) => !selC.length || selC.includes(p.category);
  const results = base.filter((p) => byB(p) && byC(p));
  results.sort((a, b) => (sort === 'az' ? a.name.localeCompare(b.name) : b.released.localeCompare(a.released)));
  const shown = results.slice(0, pages * PAGE);

  // Facet options with counts (each facet counts against the other's selection)
  const brandOpts = brands
    .map((b) => ({ id: b.id, name: b.name, n: base.filter((p) => p.brand === b.id && byC(p)).length }))
    .filter((o) => o.n || selB.includes(o.id));
  const catScope = ctx.kind === 'group' ? categoriesIn(ctx.group.id) : categories;
  const catOpts = catScope
    .map((c) => ({ ...c, n: base.filter((p) => p.category === c.id && byB(p)).length }))
    .filter((o) => o.n || selC.includes(o.id));

  const showCatFacet = ctx.kind !== 'category' && ctx.kind !== 'brand';
  const showBrandFacet = ctx.kind !== 'brand';
  const isEmpty = base.length === 0; // nothing to filter or sort: hide those controls
  const hasSidebar = !isEmpty && (showCatFacet || showBrandFacet);
  const activeCount = selB.length + (ctx.kind === 'brand' ? 0 : selC.length);

  const toggleUrl = (key, id) => {
    const cur = key === 'brand' ? selB : selC;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    return url({ [key]: next, page: '' });
  };

  const facets = `
    ${
      showCatFacet
        ? `<fieldset class="border-b border-hair pb-5" ${note('Category filter. Grouped by the four category groups; only categories with matching products are listed, with live counts. Multi-select.')}>
            <legend class="mb-3 text-sm font-semibold">Category</legend>
            ${groupBlocks(catOpts, ctx.kind === 'group')
              .map(
                ({ g, opts }) => `${g ? `<p class="eyebrow mt-3 mb-1 first:mt-0">${esc(g.name)}</p>` : ''}${opts
                  .map(
                    (o) => `<a class="check" href="${toggleUrl('cat', o.id)}" role="checkbox" aria-checked="${selC.includes(o.id)}">
                      <input type="checkbox" tabindex="-1" ${selC.includes(o.id) ? 'checked' : ''} aria-hidden="true" /> ${esc(o.name)} <span class="count">${o.n}</span></a>`,
                  )
                  .join('')}`,
              )
              .join('') || '<p class="text-sm text-faint">No categories</p>'}
          </fieldset>`
        : ''
    }
    ${
      showBrandFacet
        ? `<fieldset class="pt-5 first:pt-0" ${note('Brand filter: brands with matching products, with live counts. Multi-select. Brand and category are the only filters in the Phase 1 scope.')}>
            <legend class="mb-3 text-sm font-semibold">Brand</legend>
            ${brandOpts
              .map(
                (o) => `<a class="check" href="${toggleUrl('brand', o.id)}" role="checkbox" aria-checked="${selB.includes(o.id)}">
                  <input type="checkbox" tabindex="-1" ${selB.includes(o.id) ? 'checked' : ''} aria-hidden="true" /> ${esc(o.name)} <span class="count">${o.n}</span></a>`,
              )
              .join('') || '<p class="text-sm text-faint">No brands</p>'}
          </fieldset>`
        : ''
    }`;

  const chips = [
    ...selC.map((id) => ({ label: byId(categories, id)?.name, url: toggleUrl('cat', id) })),
    ...selB.map((id) => ({ label: byId(brands, id)?.name, url: toggleUrl('brand', id) })),
  ];
  const activeChips =
    chips.length && ctx.kind !== 'brand'
      ? `<div class="flex flex-wrap items-center gap-2" ${note('Active filters as removable chips, plus Clear all. Filters, sort and paging live in the URL, so a filtered view can be bookmarked or shared.')}>
          ${chips.map((c) => `<a class="chip is-on" href="${c.url}" aria-label="Remove filter ${esc(c.label)}">${esc(c.label)} ${icons.close.replace(/18/g, '12')}</a>`).join('')}
          <a class="text-[13px] underline underline-offset-4" href="${url({ brand: [], cat: [], page: '' })}">Clear all</a>
        </div>`
      : '';

  const sortSel = `
    <label class="flex items-center gap-2 text-sm" ${note('Sort: Latest (by release date) or A–Z, per the scope.')}>
      <span class="hidden text-sub sm:inline">Sort by</span>
      <select data-sort class="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
        <option value="latest" ${sort === 'latest' ? 'selected' : ''}>Latest</option>
        <option value="az" ${sort === 'az' ? 'selected' : ''}>A–Z</option>
      </select>
    </label>`;

  const grid = results.length
    ? `<ul class="grid gap-4 sm:grid-cols-2 ${hasSidebar ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}" ${note('Product cards are identical in every listing: image, brand, name, category, three highlight specs and View details. Highlights are chosen per category in the admin, so no extra copy has to be written per product.')}>
        ${shown.map((p) => `<li>${productCard(p)}</li>`).join('')}
      </ul>
      ${
        results.length > shown.length
          ? `<div class="mt-10 grid justify-items-center gap-3" ${note('Load more instead of numbered pages: keeps people in flow and works the same on mobile. The loaded count stays in the URL.')}>
              <p class="text-sm text-sub">Showing ${shown.length} of ${results.length}</p>
              <div class="h-1 w-48 overflow-hidden rounded-full bg-hair"><div class="h-full bg-ink" style="width:${(shown.length / results.length) * 100}%"></div></div>
              <a class="btn btn-ghost" href="${url({ page: pages + 1 })}" data-keep-scroll>Load more</a>
            </div>`
          : results.length > PAGE
            ? `<p class="mt-10 text-center text-sm text-sub">Showing all ${results.length} products</p>`
            : ''
      }`
    : emptyState(ctx, base, url);

  const mobileBar = hasSidebar
    ? `<div class="flex items-center justify-between gap-3 lg:hidden">
        <button type="button" class="chip" data-open-sheet ${note('Mobile: filters move into a bottom sheet; sort stays visible next to it.')}>${icons.filter} Filters${activeCount ? ` (${activeCount})` : ''}</button>
        ${sortSel}
      </div>`
    : '';

  const html = `
  ${header(ctx, base, selC, url)}
  <section class="wrap mt-8">
    ${mobileBar}
    <div class="mt-4 flex gap-10 lg:mt-0">
      ${hasSidebar ? `<aside class="hidden w-64 shrink-0 lg:block" aria-label="Filters"><div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">${facets}</div></aside>` : ''}
      <div class="min-w-0 flex-1">
        ${
          isEmpty
            ? ''
            : `<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-sub"><strong class="text-ink">${results.length}</strong> product${results.length === 1 ? '' : 's'}</p>
          <div class="${hasSidebar ? 'hidden lg:block' : ''}">${sortSel}</div>
        </div>`
        }
        ${activeChips ? `<div class="mb-5">${activeChips}</div>` : ''}
        ${grid}
      </div>
    </div>
  </section>
  ${
    hasSidebar
      ? `<div id="filter-sheet" class="fixed inset-0 z-[75] ${sheetOpen ? '' : 'hidden'} lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div class="scrim" data-close-sheet></div>
          <div class="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col rounded-t-2xl bg-white">
            <div class="flex items-center justify-between border-b border-line px-5 py-4"><p class="font-semibold">Filters</p>
              <a class="text-sm underline" href="${url({ brand: [], cat: [], page: '' })}">Clear all</a></div>
            <div class="overflow-y-auto px-5 py-4">${facets}</div>
            <div class="border-t border-line p-4"><button type="button" class="btn btn-primary w-full" data-close-sheet>Show ${results.length} product${results.length === 1 ? '' : 's'}</button></div>
          </div>
        </div>`
      : ''
  }`;

  return {
    html,
    wire(root) {
      root.querySelectorAll('[data-sort]').forEach((s) =>
        s.addEventListener('change', () => (location.hash = url({ sort: s.value === 'latest' ? '' : s.value, page: '' }))),
      );
      const sheet = root.querySelector('#filter-sheet');
      root.querySelector('[data-open-sheet]')?.addEventListener('click', () => {
        sheetOpen = true;
        sheet.classList.remove('hidden');
        document.body.classList.add('no-scroll');
      });
      root.querySelectorAll('[data-close-sheet]').forEach((el) =>
        el.addEventListener('click', () => {
          sheetOpen = false;
          sheet.classList.add('hidden');
          document.body.classList.remove('no-scroll');
        }),
      );
      if (sheetOpen && sheet) document.body.classList.add('no-scroll');
      root.querySelector('[data-inline-search]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = e.target.q.value.trim();
        if (q) location.hash = href('/search', { q });
      });
    },
    // Filter/sort changes keep the scroll position; context changes reset it.
    keepScroll: true,
    title: titleFor(ctx),
  };
}

export function resetListingUi() {
  sheetOpen = false;
}

function groupBlocks(opts, single) {
  if (single) return [{ g: null, opts }];
  return groups.map((g) => ({ g, opts: opts.filter((o) => o.group === g.id) })).filter((b) => b.opts.length);
}

function titleFor(ctx) {
  return { all: 'All products', group: ctx.group?.name, category: ctx.cat?.name, brand: ctx.brand?.name, search: `Search: ${ctx.q}` }[ctx.kind];
}

const crumb = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((it, i) => (i < items.length - 1 ? `<a href="${it[1]}">${esc(it[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page" class="text-ink">${esc(it[0])}</span>`))
    .join('')}</nav>`;

function header(ctx, base, selC, url) {
  if (ctx.kind === 'brand') return brandHeader(ctx, base, selC, url);
  const home = ['Home', '#/home'];
  const prods = ['Products', href('/products')];
  let crumbs;
  let title;
  let sub;
  let extra = '';
  if (ctx.kind === 'all') {
    crumbs = [home, ['Products']];
    title = 'All products';
    sub = `The full BMK catalogue across ${brands.length} brands and ${groups.length} category groups.`;
  } else if (ctx.kind === 'group' || ctx.kind === 'category') {
    const g = ctx.group;
    crumbs = ctx.kind === 'group' ? [home, prods, [g.name]] : [home, prods, [g.name, href(`/category/${g.id}`)], [ctx.cat.name]];
    title = ctx.kind === 'group' ? g.name : ctx.cat.name;
    sub =
      ctx.kind === 'group'
        ? `All ${g.name.toLowerCase()} products, across ${categoriesIn(g.id).length} categor${categoriesIn(g.id).length === 1 ? 'y' : 'ies'}.`
        : `${base.length} product${base.length === 1 ? '' : 's'} in ${g.name}.`;
    const sibs = categoriesIn(g.id);
    if (sibs.length > 1)
      extra = `<div class="mt-6" ${note('Category navigation within the group: these are links to sibling category pages (not filters), so each category keeps its own URL for SEO. Scrolls sideways on mobile.')}><nav class="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" aria-label="${esc(g.name)} categories">
        <ul class="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          <li><a class="chip ${ctx.kind === 'group' ? 'is-on' : ''}" href="${href(`/category/${g.id}`)}">All ${esc(g.name)}</a></li>
          ${sibs
            .map((c) => {
              const n = products.filter((p) => p.category === c.id).length;
              return `<li><a class="chip ${ctx.cat?.id === c.id ? 'is-on' : ''} ${n ? '' : 'text-faint'}" href="${href(`/category/${c.id}`)}">${esc(c.name)} <span class="count">${n}</span></a></li>`;
            })
            .join('')}
        </ul></nav></div>`;
  } else {
    crumbs = [home, ['Search results']];
    title = ctx.q ? `Results for “${ctx.q}”` : 'Search';
    const bs = searchBrands(ctx.q);
    const cs = searchCategories(ctx.q);
    sub = '';
    extra = `
      <form data-inline-search role="search" class="mt-5 flex max-w-xl items-center gap-2 rounded-full border border-line px-4 py-2" ${note('Search results page reuses the listing component, so results can be refined by brand and category and sorted like any listing.')}>
        ${icons.search}<input name="q" type="search" value="${esc(ctx.q)}" class="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search products" />
        <button class="btn btn-primary btn-sm">Search</button>
      </form>
      ${
        bs.length || cs.length
          ? `<div class="mt-4 flex flex-wrap items-center gap-2 text-sm" ${note('Brand and category matches are offered as shortcuts above the product results.')}><span class="text-sub">Also matching:</span>
              ${bs.map((b) => `<a class="chip" href="${href(`/brand/${b.id}`)}">Brand: ${esc(b.name)}</a>`).join('')}
              ${cs.map((c) => `<a class="chip" href="${href(`/category/${c.id}`)}">Category: ${esc(c.name)}</a>`).join('')}</div>`
          : ''
      }`;
  }
  return `
  <section class="border-b border-line bg-wash">
    <div class="wrap py-8 sm:py-10">
      ${crumb(crumbs)}
      <h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">${esc(title)}</h1>
      ${sub ? `<p class="mt-2 max-w-2xl text-sub">${esc(sub)}</p>` : ''}
      ${extra}
    </div>
  </section>`;
}

function brandHeader(ctx, base, selC, url) {
  const b = ctx.brand;
  const cats = categories.filter((c) => base.some((p) => p.category === c.id));
  const tabs = `
    <div ${note('Brand categories are derived from the brand’s own products (e.g. Google: Mobile Phones and Smart Watches), so this always reflects real data. Tapping one filters the list below. The homepage brand chips use the same data.')}><nav class="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" aria-label="${esc(b.name)} categories">
      <ul class="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <li><a class="chip ${selC.length ? '' : 'is-on'}" href="${url({ cat: [], page: '' })}" data-keep-scroll>All <span class="count">${base.length}</span></a></li>
        ${cats
          .map((c) => {
            const n = base.filter((p) => p.category === c.id).length;
            const on = selC.length === 1 && selC[0] === c.id;
            return `<li><a class="chip ${on ? 'is-on' : ''}" href="${url({ cat: on ? [] : [c.id], page: '' })}" data-keep-scroll>${esc(c.name)} <span class="count">${n}</span></a></li>`;
          })
          .join('')}
      </ul>
    </nav></div>`;
  return `
  <section class="border-b border-line">
    <div class="wrap pt-6">
      ${crumb([['Home', '#/home'], ['Brands & Products', href('/products')], [b.name]])}
    </div>
    <div class="wrap mt-5">
      <div ${note('Brand banner (admin-managed image per brand, per the scope). Wide on desktop, cropped taller on mobile.')}>${ph(`${b.name} brand banner`, 'rounded-xl', 'var(--banner-ratio, 4 / 1)')}</div>
    </div>
    <div class="wrap grid gap-6 py-8 md:grid-cols-[auto_1fr] md:items-start md:gap-10">
      <div class="w-36 md:w-44" ${note('Brand logo.')}>${ph(`${b.name} logo`, 'rounded-lg border border-line', '3 / 2')}</div>
      <div class="grid gap-4">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">${esc(b.name)}</h1>
          <p class="mt-2 max-w-3xl text-sub" ${note('Brand introduction: short admin-managed copy.')}>${esc(b.intro)}</p>
        </div>
        <p class="text-sm text-sub"><strong class="text-ink">${base.length}</strong> products · <strong class="text-ink">${cats.length}</strong> categor${cats.length === 1 ? 'y' : 'ies'}</p>
        ${tabs}
      </div>
    </div>
  </section>
  <style>@media (max-width: 639px){:root{--banner-ratio: 16 / 9}}</style>`;
}

function emptyState(ctx, base, url) {
  if (ctx.kind === 'search') {
    return `<div class="grid justify-items-start gap-4 rounded-xl border border-dashed border-line p-8" ${note('No results: suggest how to search and give routes back into the catalogue instead of a dead end.')}>
      <p class="text-lg font-semibold">No products match “${esc(ctx.q)}”</p>
      <p class="text-sub">Check the spelling, or search by model name (e.g. “X-T5”) or brand.</p>
      <div class="flex flex-wrap gap-2">${['X-T5', 'Pixel', 'NIKKOR', 'instax'].map((t) => `<a class="chip" href="${href('/search', { q: t })}">${t}</a>`).join('')}</div>
      <a class="btn btn-ghost btn-sm" href="${href('/products')}">Browse all products</a>
    </div>`;
  }
  if (!base.length) {
    const name = ctx.cat?.name || ctx.group?.name || ctx.brand?.name || 'this section';
    const alt = ctx.group ? categoriesIn(ctx.group.id).filter((c) => products.some((p) => p.category === c.id)) : [];
    return `<div class="grid justify-items-start gap-4 rounded-xl border border-dashed border-line p-8" ${note('Empty category: categories can exist before products are added (all 14 from the client sheet are set up). Show a helpful empty state, not an error.')}>
      <p class="text-lg font-semibold">No products in ${esc(name)} yet</p>
      <p class="text-sub">New products are added regularly. Meanwhile, explore related categories or send us an enquiry.</p>
      ${alt.length ? `<div class="flex flex-wrap gap-2">${alt.map((c) => `<a class="chip" href="${href(`/category/${c.id}`)}">${esc(c.name)}</a>`).join('')}</div>` : ''}
      <div class="flex flex-wrap gap-2"><a class="btn btn-ghost btn-sm" href="${href('/products')}">Browse all products</a><button type="button" class="btn btn-primary btn-sm" data-enquiry-page>Make an enquiry</button></div>
    </div>`;
  }
  return `<div class="grid justify-items-start gap-4 rounded-xl border border-dashed border-line p-8">
    <p class="text-lg font-semibold">No products match these filters</p>
    <a class="btn btn-ghost btn-sm" href="${url({ brand: [], cat: [], page: '' })}">Clear filters</a>
  </div>`;
}
