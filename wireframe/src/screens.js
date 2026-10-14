// Wireframe index: every screen in this round, with what it demonstrates.
import { href, esc, icons } from './ui.js';
import { products, categories, specCount, productBySlug, categoryOf } from './data.js';

const tplName = { camera: 'Camera (client’s 14 fields)', lens: 'Lens', instantCamera: 'Instant camera', film: 'Instant film', printer: 'Photo printer', phone: 'Phone', watch: 'Smart watch' };

const sections = [
  {
    title: 'Company pages',
    items: [
      { label: 'Home (reference)', to: '#/home', desc: 'Mirrors the approved homepage design, only to show the enquiry popups and links in context.' },
      { label: 'About Us', to: '#/about', desc: 'Group profile, companies with addresses and map, and the full timeline.' },
      { label: 'FAQ', to: '#/faq', desc: 'Topics, live search and an accordion. Answers still needed from BMK are marked.' },
      { label: 'Contact Us', to: '#/contact', desc: 'Office selector with map, contact form, and the four enquiry types.' },
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
      { label: 'Mega menu', to: '#/products', action: 'mega', desc: 'Brands & Products menu: category groups, brands, View all products. Hover or click it in the header.' },
      { label: 'Search overlay', to: '#/products', action: 'search', desc: 'Search icon in the header: suggestions as you type, then a full results page.' },
      { label: 'Mobile menu', to: '#/products', desc: 'Resize to a phone width and open the menu: the mega menu becomes nested accordions.' },
    ],
  },
  {
    title: 'Listing (one component, five contexts)',
    items: [
      { label: 'Brand page: Google', to: href('/brand/google'), desc: 'Brand header, banner and categories derived from its products (Mobile Phones, Smart Watches).' },
      { label: 'Brand page: Nikon', to: href('/brand/nikon'), desc: 'Same layout with a different category mix (cameras and lenses).' },
      { label: 'Category: Mirrorless Cameras', to: href('/category/mirrorless-cameras'), desc: 'Category page with sibling categories and a brand filter.' },
      { label: 'Group: Photography', to: href('/category/photography'), desc: 'Group page: category and brand filters within the group.' },
      { label: 'All products', to: href('/products'), desc: 'Full catalogue with both filters, sort and Load more.' },
      { label: 'Empty category: Speakers', to: href('/category/speakers'), desc: 'A category set up before any products are added.' },
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
    items: ['fujifilm-x-t5', 'nikon-z8', 'nikkor-z-70-200mm-f28-vr-s-ii', 'google-pixel-10-pro', 'google-pixel-watch-4', 'instax-mini-instant-film'].map((slug) => {
      const p = productBySlug(slug);
      const extras = { 'google-pixel-watch-4': ' · size variants', 'instax-mini-instant-film': ' · single image, single table', 'fujifilm-x-t5': ' · from the client sheet' };
      return { label: p.name, to: href(`/product/${slug}`), desc: `${tplName[categoryOf(p).template]} template · ${specCount(p)} specs${extras[slug] || ''}` };
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
        <p class="eyebrow">BMK Global website · Phase 1 wireframe</p>
        <h1 class="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">All Phase 1 page templates</h1>
        <p class="mt-4 max-w-3xl text-sub">A clickable black-and-white wireframe of every page template in the Phase 1 scope, with real content: ${products.length} products from 3 brands across ${withProducts} of the 14 client categories. Images are placeholders. No visual theme is applied yet; this is about structure and behaviour.</p>
        <div class="mt-6 grid max-w-3xl gap-3 text-sm sm:grid-cols-2">
          <div class="rounded-lg border border-line bg-white p-4"><p class="font-semibold">Numbered notes</p><p class="mt-1 text-sub">Black dots explain each element. Click one to read it; turn them off with “Notes” at the bottom left.</p></div>
          <div class="rounded-lg border border-line bg-white p-4"><p class="font-semibold">Content conventions</p><p class="mt-1 text-sub">Crossed boxes are images. <span class="tbc">Dashed</span> means content still to be supplied.</p></div>
        </div>
      </div>
    </section>
    <div class="wrap grid gap-12 py-12">
      ${sections
        .map(
          (s) => `<section>
            <h2 class="mb-4 text-lg font-semibold">${esc(s.title)}</h2>
            <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              ${s.items
                .map(
                  (it) => `<li><a href="${it.to || '#/'}" ${it.action ? `data-screen-action="${it.action}"` : ''} ${it.type ? `data-enquiry-type="${it.type}"` : ''} class="card h-full p-5">
                    <span class="flex items-center justify-between gap-3 font-semibold">${esc(it.label)} ${icons.arrow}</span>
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
