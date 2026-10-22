// Wireframe index: every screen in this round, with what it demonstrates.
import { href, esc, icons, VERSION } from './ui.js';
import { products, categories, brands, specCount, productBySlug, templateOf } from './data.js';
import { changelog } from './content.js';

const tplName = { camera: 'Camera (client’s 14 fields)', lens: 'Lens', instantCamera: 'Instant camera', film: 'Instant film', printer: 'Photo printer', phone: 'Phone', watch: 'Smart watch' };

const sections = [
  {
    title: 'Company pages',
    items: [
      { label: 'Home', to: '#/home', desc: 'v2: the homepage content updates: 24 years, new About copy, presence by country, in-house and partner brands, new timeline.', v2: true },
      { label: 'About Us', to: '#/about', desc: 'v2: new copy, mission & values, a card per country with all eight companies, our brands, and the 8-milestone journey.', v2: true },
      { label: 'FAQ', to: '#/faq', desc: 'v2: the client’s 8 questions and answers, with topics and live search.', v2: true },
      { label: 'Contact Us', to: '#/contact', desc: 'v2: head-office strip and a tab per country listing every company, plus the form and enquiry types.', v2: true },
    ],
  },
  {
    title: 'Enquiry popups',
    items: [
      { label: 'Distribution Enquiry', type: 'Distribution Enquiry', desc: 'Opens the popup with the type selected, as from the homepage, footer or Contact.' },
      { label: 'Dealership Enquiry', type: 'Dealership Enquiry', desc: 'Same popup, Dealership selected.' },
      { label: 'Retail Sales Enquiry', type: 'Retail Sales Enquiry', desc: 'Same popup, Retail Sales selected.' },
      { label: 'Product enquiry', to: href('/product/nikon-z8'), desc: 'On any product page, “Enquire about this product” carries the product into the popup.' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Mega menu', to: '#/products', action: 'mega', desc: 'v2: six category groups and 14 brands (in-house first). Hover or click Brands & Products in the header.', v2: true },
      { label: 'Search overlay', to: '#/products', action: 'search', desc: 'Search icon in the header: suggestions as you type, then a full results page.' },
      { label: 'Mobile menu', to: '#/products', desc: 'Resize to a phone width and open the menu: the mega menu becomes nested accordions.' },
    ],
  },
  {
    title: 'Listing (one component, five contexts)',
    items: [
      { label: 'In-house brand: SEEKEN', to: href('/brand/seeken'), desc: 'v2: in-house label and links to the brand’s own websites. No products listed yet.', v2: true },
      { label: 'Brand page: Nikon', to: href('/brand/nikon'), desc: 'Brand header, banner and the categories derived from its products.' },
      { label: 'Category: Mirrorless & DSLR Cameras', to: href('/category/mirrorless-dslr-cameras'), desc: 'v2 category names and the client’s description under the title.', v2: true },
      { label: 'Group: Digital Imaging & Photography', to: href('/category/imaging'), desc: 'Group page: category and brand filters within the group.' },
      { label: 'All products', to: href('/products'), desc: 'Full catalogue with both filters, sort and Load more.' },
      { label: 'Empty category: Food Preparation', to: href('/category/food-preparation'), desc: 'A category set up before any products are added (most of the new hierarchy for now).' },
    ],
  },
  {
    title: 'Search results',
    items: [
      { label: 'Search “nikon”', to: href('/search', { q: 'nikon' }), desc: 'Results plus brand shortcut, refinable by category.' },
      { label: 'Search “xt5”', to: href('/search', { q: 'xt5' }), desc: 'Punctuation-insensitive: finds the X-T5.' },
      { label: 'No results: “drone”', to: href('/search', { q: 'drone' }), desc: 'No-results state with routes back into the catalogue.' },
    ],
  },
  {
    title: 'Product details (one universal layout)',
    items: ['fujifilm-x-t5', 'nikon-z8', 'nikkor-z-70-200mm-f28-vr-s-ii', 'instax-mini-12', 'instax-mini-link-3', 'instax-mini-instant-film'].map((slug) => {
      const p = productBySlug(slug);
      const extras = { 'instax-mini-link-3': ' · own template inside Instant Cameras & Film', 'instax-mini-instant-film': ' · single image, single table', 'fujifilm-x-t5': ' · from the client sheet' };
      return { label: p.name, to: href(`/product/${slug}`), desc: `${tplName[templateOf(p)]} template · ${specCount(p)} specs${extras[slug] || ''}` };
    }),
  },
];

export function renderScreens() {
  const withProducts = categories.filter((c) => products.some((p) => p.category === c.id)).length;
  return {
    title: 'Wireframe index',
    html: `
    <section class="border-b border-line bg-wash">
      <div class="wrap py-10 sm:py-14">
        <p class="eyebrow">BMK Global website · Phase 1 wireframe · ${VERSION.id} (${VERSION.date})</p>
        <h1 class="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">All Phase 1 page templates</h1>
        <p class="mt-4 max-w-3xl text-sub">A clickable black-and-white wireframe of every page template in the Phase 1 scope, with real content: ${products.length} products in ${withProducts} of the ${categories.length} categories, and ${brands.length} brands. Version 2 brings in the client’s company information of 21 Oct 2026. Images are placeholders. No visual theme is applied yet; this is about structure and behaviour.</p>
        <div class="mt-6 grid max-w-3xl gap-3 text-sm sm:grid-cols-2">
          <div class="rounded-lg border border-line bg-white p-4"><p class="font-semibold">Numbered notes</p><p class="mt-1 text-sub">Black dots explain each element. Click one to read it; turn them off with “Notes” at the bottom left.</p></div>
          <div class="rounded-lg border border-[#f0c419] bg-[#fff8d6] p-4"><p class="font-semibold">What changed in v2</p><p class="mt-1 text-sub">Yellow “v2” tags mark sections that changed since v1, with a note on what changed. Turn them off with “Changes”. v1 is still available from the version switch.</p></div>
          <div class="rounded-lg border border-line bg-white p-4"><p class="font-semibold">Content conventions</p><p class="mt-1 text-sub">Crossed boxes are images. <span class="tbc">Dashed</span> means content still to be supplied.</p></div>
        </div>
      </div>
    </section>
    <div class="wrap grid gap-12 py-12">
      <section id="changes" class="rounded-xl border border-[#f0c419] bg-[#fff8d6] p-6">
        <h2 class="text-lg font-semibold">What changed in ${VERSION.id}</h2>
        <p class="mt-1 text-sm text-sub">Source: ${esc(VERSION.source)}. Open questions are on the <a class="underline" href="#/notes">notes page</a>.</p>
        <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${changelog.map((c) => `<div><p class="font-semibold">${esc(c.area)}</p><ul class="mt-2 grid gap-1.5 text-sm">${c.items.map((x) => `<li class="flex gap-2"><span aria-hidden="true">–</span><span>${esc(x)}</span></li>`).join('')}</ul></div>`).join('')}</div>
      </section>
      ${sections
        .map(
          (s) => `<section>
            <h2 class="mb-4 text-lg font-semibold">${esc(s.title)}</h2>
            <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              ${s.items
                .map(
                  (it) => `<li><a href="${it.to || '#/'}" ${it.action ? `data-screen-action="${it.action}"` : ''} ${it.type ? `data-enquiry-type="${it.type}"` : ''} class="card h-full p-5">
                    <span class="flex items-center justify-between gap-3 font-semibold"><span>${esc(it.label)}${it.v2 ? ' <span class="ml-1 rounded-full bg-[#ffd43b] px-1.5 py-0.5 text-[10px] font-bold align-middle">v2</span>' : ''}</span> ${icons.arrow}</span>
                    <span class="mt-1.5 block text-sm text-sub">${esc(it.desc)}</span></a></li>`,
                )
                .join('')}
            </ul>
          </section>`,
        )
        .join('')}
    </div>`,
  };
}
