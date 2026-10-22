// Company pages (v2): Home, About Us, FAQ, Contact Us, Notes.
// Content: the client document of 21 Oct 2026 (see content.js).
// Yellow "v2" markers (change(...)) say what changed since wireframe v1.
import { brands, groups, inHouseBrands, partnerBrands, products } from './data.js';
import { intro, mission, vision, values, contact, countries, entities, entitiesIn, regions, milestones, conflicts, gaps, enquiryTypes, faqTopics, faqs, YEARS, FOUNDED } from './content.js';
import { esc, href, icons, ph, note, change } from './ui.js';
import { openEnquiry } from './enquiry.js';

const crumb = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((it, i) => (i < items.length - 1 ? `<a href="${it[1]}">${esc(it[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page" class="text-ink">${esc(it[0])}</span>`))
    .join('')}</nav>`;

const pageHead = (title, sub, items, extra = '') => `
  <section class="border-b border-line bg-wash">
    <div class="wrap py-8 sm:py-10">
      ${crumb(items)}
      <h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">${esc(title)}</h1>
      ${sub ? `<p class="mt-2 max-w-2xl text-sub">${esc(sub)}</p>` : ''}
      ${extra}
    </div>
  </section>`;

const tbc = (label = 'to be confirmed') => `<span class="tbc">${esc(label)}</span>`;
const countryOf = (e) => countries.find((c) => c.id === e.country);
const tag = (t) => `<span class="inline-flex rounded-full border border-line px-2 py-0.5 text-[11px] font-medium tracking-wide text-sub uppercase">${esc(t)}</span>`;

/** Turn domains, emails and the head-office number in client copy into links. */
const linkify = (text) =>
  esc(text)
    .replace(/\b([a-z0-9-]+\.(?:com|co\.in|co))\b(?![\w@])/g, '<a class="underline underline-offset-4" href="https://$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\b(info@bmkintl\.com)\b/g, '<a class="underline underline-offset-4" href="mailto:$1">$1</a>')
    .replace(/(\+971 4 232 4747)/g, '<a class="underline underline-offset-4" href="tel:+97142324747">$1</a>');

/** World map placeholder with one pin per country. */
function worldMap(active, { buttons = true } = {}) {
  return `<div class="ph relative rounded-xl" style="aspect-ratio:1200/620"><span>World map</span>
    ${countries
      .map((c) => {
        const el = buttons ? 'button type="button"' : 'span';
        return `<${el} data-pin="${c.id}" class="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5" style="left:${c.x}%;top:${c.y}%" ${buttons ? `aria-label="${esc(c.name)}"` : ''}>
          <span class="block size-3 shrink-0 rounded-full border-2 border-white ${c.id === active ? 'scale-150 bg-ink' : 'bg-sub'} transition-transform" data-dot></span>
          <span class="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-normal text-ink normal-case shadow sm:block">${esc(c.short)}</span></${buttons ? 'button' : 'span'}>`;
      })
      .join('')}
  </div>`;
}

function enquiryCards() {
  return `<ul class="grid gap-4 sm:grid-cols-2">
    ${enquiryTypes
      .map(
        (t) => `<li class="flex flex-col items-center gap-3 rounded-xl border border-line p-6 text-center">
          ${ph('Image', 'w-full rounded-lg', '16 / 7')}
          <p class="mt-2 text-lg font-semibold">${esc(t.title)}</p>
          <p class="text-sm text-sub">${esc(t.text)}</p>
          <button type="button" class="btn btn-primary btn-sm mt-1" data-enquiry-type="${esc(t.type)}">${esc(t.type)} ${icons.arrow}</button>
        </li>`,
      )
      .join('')}
  </ul>`;
}

/** Brand card: logo placeholder, name, the client's description, links. */
const brandCard = (b, { big = false } = {}) => {
  const n = products.filter((p) => p.brand === b.id).length;
  return `<li class="h-full" data-brand-card data-groups="${b.groups.join(' ')}">
    <div class="flex h-full flex-col gap-3 rounded-xl border border-line p-5 ${big ? 'sm:p-6' : ''}">
      ${ph(`${b.name} logo`, 'rounded-lg', big ? '5 / 2' : '3 / 1')}
      <div class="flex items-center justify-between gap-2"><p class="font-semibold">${esc(b.name)}</p>${b.inHouse ? tag('In-house') : ''}</div>
      <p class="line-clamp-3 text-sm text-sub">${esc(b.intro)}</p>
      <div class="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm font-semibold">
        <a class="inline-flex items-center gap-1.5 underline-offset-4 hover:underline" href="${href(`/brand/${b.id}`)}">${n ? `View ${n} product${n === 1 ? '' : 's'}` : 'View brand'} ${icons.arrow}</a>
        ${(b.sites || []).map(([d]) => `<a class="underline-offset-4 hover:underline" href="https://${d}" target="_blank" rel="noopener">${esc(d)} ↗</a>`).join('')}
      </div>
    </div>
  </li>`;
};

/** Contact rows for an entity. */
const contactList = (e) => `
  <dl class="grid gap-1.5 text-sm">
    <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Address</dt><dd>${esc(e.address)}</dd></div>
    <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Phone</dt><dd>${e.phone ? `<a class="underline" href="tel:${esc(e.phone.replace(/\s/g, ''))}">${esc(e.phone)}</a>` : tbc()}</dd></div>
    <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Email</dt><dd>${e.email ? `<a class="underline" href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : tbc()}</dd></div>
    ${e.products ? `<div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Brands</dt><dd>${esc(e.products)}</dd></div>` : ''}
  </dl>`;

/** After render, honour ?section=id by scrolling to it. */
function scrollToSection(params) {
  const id = params.get('section');
  if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
}

/** Horizontal milestone cards (homepage + About), as in the Figma designs. */
function timeline({ full = false } = {}) {
  return `<ol class="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:mx-0 sm:px-0">
    ${milestones
      .map(
        (m) => `<li class="flex w-64 shrink-0 snap-start flex-col gap-3 rounded-xl border border-line p-5 ${full ? 'sm:w-72' : ''}">
          <span class="ph size-12 rounded-lg" style="aspect-ratio:1"><span>Icon</span></span>
          <p class="mt-6 text-3xl font-semibold tracking-tight">${esc(m.year)}</p>
          <p class="font-medium leading-snug">${esc(m.title)}</p>
          ${
            full
              ? `<ul class="grid gap-2 text-sm text-sub">${m.points.map((t) => `<li class="flex gap-2"><span aria-hidden="true">–</span><span>${esc(t)}</span></li>`).join('')}</ul>`
              : `<p class="line-clamp-3 text-sm text-sub">${esc(m.points[0])}</p>`
          }
        </li>`,
      )
      .join('')}
  </ol>
  <div class="mt-3 h-1 rounded-full bg-hair"><div class="h-1 w-1/4 rounded-full bg-ink"></div></div>`;
}

// ── Home ─────────────────────────────────────────────────────────────────────
export function renderHome() {
  const block = (id, eyebrow, title, body, attrs = '') => `<section id="${id}" class="wrap scroll-mt-24 py-12" ${attrs}>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2 class="mt-1 mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">${title}</h2>${body}</section>`;
  const presenceCard = (c) => `
    <p class="eyebrow">${esc(c.region)}</p>
    <p class="mt-1 text-xl font-semibold">${esc(c.name)}</p>
    <ul class="mt-4 grid gap-3">
      ${entitiesIn(c.id)
        .map(
          (e) => `<li class="rounded-lg border border-line p-3">
            <div class="flex flex-wrap items-center justify-between gap-2"><p class="font-semibold">${esc(e.name)}</p>${tag(e.kind)}</div>
            <p class="mt-1 text-xs text-sub">${esc(e.city)}</p>
          </li>`,
        )
        .join('')}
    </ul>
    <a class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline" href="${href('/about', { section: c.id })}">View details ${icons.arrow}</a>`;

  return {
    title: 'Home',
    html: `
    <div class="border-b border-dashed border-faint bg-wash">
      <p class="wrap py-3 text-sm text-sub" ${change('In v1 this page only mirrored the approved homepage. In v2 it shows the homepage content changes from the client document; the layout still follows the approved design.')}><strong class="text-ink">Homepage content update.</strong> Same layout as the approved homepage design; content from the client document of 21 Oct.</p>
    </div>
    <section class="wrap pt-8">
      <div class="ph flex items-end rounded-xl p-6 text-left normal-case sm:p-10" style="aspect-ratio:auto;min-height:420px">
        <div class="relative grid max-w-xl gap-4 rounded-lg bg-white/90 p-6 tracking-normal text-ink">
          <p class="eyebrow">Global technology distribution</p>
          <p class="text-3xl leading-tight font-semibold sm:text-4xl">Connecting markets with the technology of tomorrow.</p>
          <p class="text-sm text-sub">BMK Group brings global technology brands closer to businesses through trusted sourcing, international distribution and a forward-looking approach to product development.</p>
          <div class="flex flex-wrap gap-3"><a class="btn btn-primary btn-sm" href="${href('/products')}">Explore Our Products</a><a class="btn btn-ghost btn-sm" href="#enquiry" data-anchor>Partner With Us</a></div>
        </div>
        <div class="absolute right-6 bottom-6 hidden rounded-lg bg-white p-4 text-left tracking-normal text-ink normal-case shadow sm:block" ${change(`“25 Years” becomes “${YEARS} Years”: BMK started in ${FOUNDED}.`)}>
          <p class="text-4xl font-semibold">${YEARS}</p><p class="text-xs text-sub">Years of Experience &amp; Trust</p>
        </div>
      </div>
      <p class="mt-2 text-xs text-faint">Hero: scroll-driven background video (see built homepage). Headline and intro unchanged.</p>
    </section>

    ${block(
      'about-bmk',
      'About BMK Group',
      esc(intro.heading),
      `<div class="grid gap-8 md:grid-cols-2">${ph('Image', 'rounded-xl', '520 / 504')}<div class="grid content-start gap-4 text-sub" ${change('New copy from the client document, shortened for the homepage: founded in 2002 as Island Valley Electronics LLC; six markets. Replaces the “UAE-incorporated… 2004… 2010” text.')}>${intro.short.map((p) => `<p>${esc(p)}</p>`).join('')}<a class="btn btn-ghost btn-sm w-fit" href="${href('/about')}">Discover Our Story</a></div></div>`,
    )}

    ${block(
      'presence',
      'BMK Group Presence',
      'Six countries, eight companies',
      `<p class="-mt-3 mb-6 max-w-2xl text-sub">BMK Group operates through distinct registered companies and business entities across multiple countries and regions. Select a country to see its companies.</p>
      <div class="grid gap-6 lg:grid-cols-[1fr_360px]" ${change('One pin per country (6), not per company. London, Kuala Lumpur and the old company names are gone; Petaling Jaya, Kochi, Lusaka and Kinshasa are new. The card lists every company in the selected country (UAE and India have two each).')} ${note('Map pins and the country list are the same control: pick a country to see its companies. “View details” opens that country on About Us.')}>
        <div class="grid gap-3">${worldMap('uae')}
          <div class="flex flex-wrap gap-2" role="tablist" aria-label="Countries">${countries.map((c) => `<button type="button" class="chip" data-country="${c.id}" aria-pressed="${c.id === 'uae'}">${esc(c.short)} <span class="count">${entitiesIn(c.id).length}</span></button>`).join('')}</div>
        </div>
        <div class="h-fit rounded-xl border border-line p-5" data-presence-card>${presenceCard(countries[0])}</div>
      </div>`,
    )}

    ${block(
      'brands',
      'Our Brands',
      'BMK’s own brands and the partners we distribute',
      `<div class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter brands" ${change('Filters follow the six new category groups (was Cameras & Imaging / Mobile Accessories / Smart Watches / Other).')}>
        <button type="button" class="chip" data-brand-filter="" aria-pressed="true">All</button>
        ${groups.map((g) => `<button type="button" class="chip" data-brand-filter="${g.id}" aria-pressed="false">${esc(g.name)}</button>`).join('')}
      </div>
      <p class="eyebrow mb-3">In-house brands</p>
      <ul class="grid gap-4 md:grid-cols-2" ${change('New: BMK’s own brands, SEEKEN and TEAM Appliances, shown first with the client’s descriptions and links to their own websites.')}>${inHouseBrands.map((b) => brandCard(b, { big: true })).join('')}</ul>
      <p class="eyebrow mt-10 mb-3">Partner brands</p>
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" ${change('12 partner brands with the client’s descriptions (v1 showed Nikon, Sony, Canon and Leica with placeholder text). Leica removed. Logos are placeholders until BMK sends them.')} ${note('Carousel on the built homepage; shown as a grid here. Brand cards link to the brand’s product listing.')}>${partnerBrands.map((b) => brandCard(b)).join('')}</ul>
      <p data-brands-empty class="hidden rounded-xl border border-dashed border-line p-6 text-sub">No brands in this group yet.</p>`,
    )}

    ${block(
      'journey',
      'Our Journey',
      'From global trade to new possibilities.',
      `<div ${change('Eight milestones from the client document: 2002, 2004, 2010, 2013, 2018, 2022, 2023 and Present. The v1 years (2005, 2008, 2012, 2015 London, 2018 MENA) are gone.')}>${timeline()}</div>
      <a class="btn btn-ghost btn-sm mt-6" href="${href('/about', { section: 'journey' })}">Discover About Us</a>`,
    )}

    <section id="enquiry" class="wrap scroll-mt-24 py-12" ${note('Four enquiry CTAs. Each opens the enquiry popup with its type already selected. Unchanged in v2.')}>
      <h2 class="text-center text-2xl font-semibold tracking-tight">Let's do business together</h2>
      <p class="mx-auto mt-2 mb-8 max-w-xl text-center text-sub">Have a business enquiry? Select the enquiry type below and get in touch with the relevant BMK Group team.</p>
      ${enquiryCards()}
    </section>`,
    wire(root) {
      const select = (id) => {
        root.querySelectorAll('[data-country]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.country === id)));
        root.querySelectorAll('[data-pin]').forEach((p) => {
          const on = p.dataset.pin === id;
          p.querySelector('[data-dot]').classList.toggle('scale-150', on);
          p.querySelector('[data-dot]').classList.toggle('bg-ink', on);
          p.querySelector('[data-dot]').classList.toggle('bg-sub', !on);
        });
        root.querySelector('[data-presence-card]').innerHTML = presenceCard(countries.find((c) => c.id === id));
      };
      root.querySelectorAll('[data-country], [data-pin]').forEach((b) => b.addEventListener('click', () => select(b.dataset.country || b.dataset.pin)));
      root.querySelectorAll('[data-brand-filter]').forEach((b) =>
        b.addEventListener('click', () => {
          const g = b.dataset.brandFilter;
          root.querySelectorAll('[data-brand-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          let shown = 0;
          root.querySelectorAll('[data-brand-card]').forEach((c) => {
            const ok = !g || c.dataset.groups.split(' ').includes(g);
            c.classList.toggle('hidden', !ok);
            if (ok) shown++;
          });
          root.querySelector('[data-brands-empty]').classList.toggle('hidden', shown > 0);
        }),
      );
    },
  };
}

// ── About Us ─────────────────────────────────────────────────────────────────
// Structure follows the About Us frame in Figma (agency edits of 21–22 Oct):
// who-we-are with a region map and stats, large company cards with a city image
// and a details panel, horizontal timeline cards, four enquiry cards.
export function renderAbout(params) {
  const countryCard = (c, i) => {
    const flip = i % 2 === 1;
    const list = entitiesIn(c.id);
    return `
    <article id="${c.id}" class="scroll-mt-24 overflow-hidden rounded-2xl border border-line" data-country-card
      ${i === 0 ? note('One card per country: a city image with the city name, and a details panel listing every BMK company there (address, phone, email, map, “Contact this office”). Image side alternates down the page; on mobile the image stacks on top. Each country and each company has its own anchor.') : ''}
      ${i === 0 ? change('Cards are per country, with one or more companies inside (v1 and the Figma frame had one card per company, all four placeholders). UAE and India hold two companies each; Bhome Appliances is marked as a retail showroom.') : ''}>
      <div class="grid lg:grid-cols-[1fr_1.05fr]">
        <div class="relative ${flip ? 'lg:order-2' : ''}">
          ${ph(`${c.city} — city image`, 'h-full min-h-[260px]', 'auto')}
          <span class="ph absolute top-5 left-5 size-12 rounded-full bg-white" style="aspect-ratio:1"><span>Icon</span></span>
          <p class="absolute bottom-5 left-5 rounded bg-white/90 px-3 py-1 text-3xl font-semibold tracking-tight">${esc(c.city.split(',')[0])}</p>
        </div>
        <div class="grid content-start gap-5 bg-white p-6 sm:p-8 ${flip ? 'lg:order-1' : ''}">
          <div><p class="eyebrow">${esc(c.region)}</p><h3 class="mt-1 text-2xl font-semibold tracking-tight">${esc(c.name)}</h3></div>
          ${list
            .map(
              (e) => `<section id="${e.id}" class="scroll-mt-24 grid gap-3 border-t border-hair pt-5 first-of-type:border-t-0 first-of-type:pt-0">
                <div class="flex flex-wrap items-center gap-2"><p class="text-lg font-semibold">${esc(e.name)}</p>${tag(e.kind)}</div>
                <p class="text-sm text-sub">${esc(e.role)}</p>
                ${e.mandate ? `<p class="text-sm"><span class="text-faint">Authorized mandate:</span> ${esc(e.mandate)}</p>` : ''}
                ${contactList(e)}
                <a class="inline-flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline" href="${href('/contact', { office: e.id })}">${e.retail ? 'Visit the showroom' : 'Contact this office'} ${icons.arrow}</a>
              </section>`,
            )
            .join('')}
          <div class="ph rounded-lg" style="aspect-ratio:16/7" ${i === 0 ? note('Google Maps embed with a pin for each company in the country.') : ''}><span>Map · ${list.length} location${list.length === 1 ? '' : 's'} · ${esc(c.city)}</span></div>
        </div>
      </div>
    </article>`;
  };

  return {
    title: 'About Us',
    html: `
    ${pageHead('About BMK Group', 'Who we are, what we stand for, where we operate and how we got here.', [['Home', '#/home'], ['About Us']],
      `<nav class="mt-6 flex flex-wrap gap-2" aria-label="On this page" ${note('In-page navigation; sticks to the top as you scroll on the built site. The homepage “Discover” links land on these sections.')} ${change('New sections in the list: Mission & values, and Our brands.')}>
        ${[['who-we-are', 'Who we are'], ['mission', 'Mission & values'], ['companies', 'Our companies'], ['our-brands', 'Our brands'], ['journey', 'Our journey']].map(([id, l]) => `<a class="chip" href="#${id}" data-anchor>${l}</a>`).join('')}
      </nav>`)}

    <section id="who-we-are" class="wrap grid scroll-mt-24 items-center gap-10 py-14 lg:grid-cols-[440px_1fr] lg:gap-16">
      <div class="grid content-start gap-4">
        <p class="eyebrow">Who we are</p>
        <h2 class="text-3xl leading-tight font-semibold tracking-tight">${esc(intro.heading)}</h2>
        <div class="grid gap-4 text-sub" ${change('New About text from the client document (founded 2002 as Island Valley Electronics LLC; partner brands; SEEKEN and TEAM; six markets). Replaces the v1 copy.')}>${intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <a class="btn btn-primary btn-sm mt-2 w-fit" href="#our-brands" data-anchor>Explore our brands ${icons.arrow}</a>
      </div>
      <div class="relative" ${note('Region map (3D illustration in the design) with a flag per region, and two stats.')} ${change(`Regions: ${regions.join(', ')} (the Figma frame had Europe, MENA and Southeast Asia). Stats: ${entities.length} group companies and ${countries.length} countries (was 4 and 4).`)}>
        <div class="ph relative rounded-xl" style="aspect-ratio:4/3"><span>Region map</span>
          ${[['Middle East', 48, 36], ['South Asia', 62, 48], ['Southeast Asia', 66, 64], ['Africa', 30, 62]].map(([r, x, y]) => `<span class="absolute rounded bg-white px-2 py-1 whitespace-nowrap text-[11px] font-semibold tracking-normal text-ink normal-case shadow" style="left:${x}%;top:${y}%">⚑ ${r}</span>`).join('')}
        </div>
        <div class="relative z-10 mx-auto -mt-16 grid w-[min(100%,560px)] grid-cols-2 gap-2 rounded-2xl border border-line bg-white p-2">
          <div class="rounded-xl border border-line p-5"><p class="text-sm text-sub">Group companies</p><p class="mt-3 text-5xl font-semibold">${entities.length}</p></div>
          <div class="rounded-xl border border-line p-5"><p class="text-sm text-sub">Countries</p><p class="mt-3 text-5xl font-semibold">${countries.length}</p></div>
        </div>
      </div>
    </section>

    <section id="mission" class="scroll-mt-24 border-t border-line bg-wash py-14" ${change('New section: Mission, Vision and the four Core Values, verbatim from the client document.')}>
      <div class="wrap grid gap-10">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-line bg-white p-6"><p class="eyebrow">Our mission</p><p class="mt-3 text-xl leading-snug font-medium">${esc(mission)}</p></div>
          <div class="rounded-xl border border-line bg-white p-6"><p class="eyebrow">Our vision</p><p class="mt-3 text-xl leading-snug font-medium">${esc(vision)}</p></div>
        </div>
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">Core values</h2>
          <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${values.map((v) => `<li class="rounded-xl border border-line bg-white p-5"><span class="ph size-10 rounded-lg" style="aspect-ratio:1"><span>Icon</span></span><p class="mt-4 font-semibold">${esc(v.name)}</p><p class="mt-1 text-sm text-sub">${esc(v.text)}</p></li>`).join('')}</ul>
        </div>
      </div>
    </section>

    <section id="companies" class="scroll-mt-24 border-y border-line py-14">
      <div class="wrap">
        <p class="eyebrow">Group presence</p>
        <h2 class="mt-1 text-3xl font-semibold tracking-tight">Our companies</h2>
        <p class="mt-2 max-w-2xl text-sub">BMK Group operates an integrated network of corporate entities, retail outlets, and distribution hubs across six core markets.</p>
        <div class="mt-6 flex flex-wrap gap-2" ${change('Country shortcuts: six countries, eight companies.')}>${countries.map((c) => `<a class="chip" href="#${c.id}" data-anchor>${esc(c.short)} <span class="count">${entitiesIn(c.id).length}</span></a>`).join('')}</div>
        <div class="mt-10 grid gap-10">${countries.map(countryCard).join('')}</div>
      </div>
    </section>

    <section id="our-brands" class="wrap scroll-mt-24 py-14" ${change('New section: BMK’s in-house brands with links to their websites, then the partner brands. Descriptions from the client document.')}>
      <p class="eyebrow">Our brands</p>
      <h2 class="mt-1 text-3xl font-semibold tracking-tight">Built by BMK, and distributed by BMK</h2>
      <p class="mt-2 max-w-2xl text-sub">BMK Group develops and markets its own technology and home living brands, and is an official distributor and channel partner for premier global names.</p>
      <ul class="mt-8 grid gap-4 md:grid-cols-2">${inHouseBrands.map((b) => brandCard(b, { big: true })).join('')}</ul>
      <p class="eyebrow mt-10 mb-3">Partner brands</p>
      <ul class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6" ${note('Logo strip: each logo links to the brand page.')}>${partnerBrands.map((b) => `<li><a class="flex flex-col gap-2 rounded-lg border border-line p-3 hover:border-ink" href="${href(`/brand/${b.id}`)}">${ph(`${b.name} logo`, 'rounded', '3 / 1')}<span class="text-center text-xs font-medium">${esc(b.name)}</span></a></li>`).join('')}</ul>
    </section>

    <section id="journey" class="wrap scroll-mt-24 border-t border-line py-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div><p class="eyebrow">Our journey</p><h2 class="mt-1 text-3xl font-semibold tracking-tight">From global trade to new possibilities.</h2></div>
      </div>
      <div class="mt-8" ${note('Horizontal milestone cards, as on the homepage, with the full text per milestone here. Scrolls sideways; the bar shows progress.')} ${change('Eight milestones from the client document (2002 → Present), each with every point from the document. Layout follows the Figma frame: horizontal cards instead of v1’s vertical timeline.')}>${timeline({ full: true })}</div>
    </section>

    <section class="wrap py-12" ${change('Follows the Figma About frame: the four enquiry cards (v1 had a single “Work with BMK” bar).')}>
      <h2 class="text-center text-2xl font-semibold tracking-tight">Work with BMK</h2>
      <p class="mx-auto mt-2 mb-8 max-w-xl text-center text-sub">Distribution, dealership, retail supply or something else.</p>
      ${enquiryCards()}
    </section>`,
    wire() {
      scrollToSection(params);
    },
  };
}

// ── Notes for BMK (unlisted: #/notes) ────────────────────────────────────────
export function renderNotes() {
  return {
    title: 'Notes for BMK',
    html: `
    ${pageHead('Notes for BMK', 'Content questions raised while building wireframe v2. Not part of the website.', [['Home', '#/home'], ['Notes']])}
    <section class="wrap grid max-w-4xl gap-12 py-12">
      <div>
        <h2 class="text-xl font-semibold">To confirm</h2>
        <p class="mt-1 text-sm text-sub">Decisions made for v2 that BMK should confirm.</p>
        <ol class="mt-5 grid gap-3">${conflicts.map((c, i) => `<li class="flex gap-4 rounded-lg border border-line p-4 text-sm"><span class="font-semibold">${i + 1}</span><span>${esc(c)}</span></li>`).join('')}</ol>
      </div>
      <div>
        <h2 class="text-xl font-semibold">Content still to be supplied</h2>
        <p class="mt-1 text-sm text-sub">Shown in the wireframe as <span class="tbc">to be confirmed</span> or as image placeholders.</p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">${gaps
          .map((g) => `<div class="rounded-lg border border-line p-4"><p class="font-semibold">${esc(g.area)}</p><ul class="mt-2 grid gap-1.5 text-sm text-sub">${g.items.map((x) => `<li class="flex gap-2"><span aria-hidden="true">–</span>${esc(x)}</li>`).join('')}</ul></div>`)
          .join('')}</div>
      </div>
    </section>`,
  };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function renderFaq() {
  const item = (f) => `
    <details class="group border-b border-line" data-faq data-topic="${f.topic}" data-text="${esc([f.q, ...f.a, ...(f.list || [])].join(' ').toLowerCase())}">
      <summary class="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-medium">
        <span>${esc(f.q)}</span><span class="mt-1 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">${icons.close.replace('m5 5 10 10M15 5 5 15', 'M10 4v12M4 10h12')}</span>
      </summary>
      <div class="grid max-w-3xl gap-3 pb-5 text-sub">
        ${f.a.map((p) => `<p>${linkify(p)}</p>`).join('')}
        ${f.list ? `<ul class="grid gap-2">${f.list.map((x) => `<li class="flex gap-2"><span aria-hidden="true">–</span><span>${linkify(x)}</span></li>`).join('')}</ul>` : ''}
      </div>
    </details>`;

  return {
    title: 'FAQ',
    html: `
    ${pageHead('Frequently asked questions', 'Answers to common questions about BMK Group, our brands and partnering with us.', [['Home', '#/home'], ['FAQ']],
      `<div class="mt-6 grid max-w-xl gap-1">
        <label class="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5" ${note('Search filters the questions as you type (question and answer text).')}>
          ${icons.search}<input data-faq-search type="search" placeholder="Search questions" class="min-w-0 flex-1 bg-transparent outline-none" aria-label="Search questions" />
        </label>
      </div>`)}
    <section class="wrap py-10">
      <div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="Topics" ${note('Topics filter the list. Admin can add, edit, delete and reorder FAQs and topics (per the scope).')} ${change('Topics regrouped around the client’s questions: About BMK Group, Brands & distribution, Where to buy, Partnerships.')}>
        <button type="button" class="chip" data-faq-topic="" aria-pressed="true">All <span class="count">${faqs.length}</span></button>
        ${faqTopics.map((t) => `<button type="button" class="chip" data-faq-topic="${t.id}" aria-pressed="false">${esc(t.name)} <span class="count">${faqs.filter((f) => f.topic === t.id).length}</span></button>`).join('')}
      </div>
      <div class="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div ${change('The client’s 8 questions and answers, verbatim, replace v1’s 13 draft questions (including the five whose answers were still to be supplied). Website addresses, the email and the phone number in answers are links.')}>
          ${faqTopics
            .map(
              (t) => `<section data-faq-group="${t.id}" class="mb-10 last:mb-0">
                <h2 class="eyebrow mb-1">${esc(t.name)}</h2>
                ${faqs.filter((f) => f.topic === t.id).map(item).join('')}
              </section>`,
            )
            .join('')}
          <div data-faq-empty class="hidden rounded-xl border border-dashed border-line p-8"><p class="font-semibold">No questions match your search</p><p class="mt-1 text-sub">Try other words, or ask us directly.</p></div>
        </div>
        <aside class="h-fit rounded-xl bg-wash p-6 lg:sticky lg:top-[calc(var(--hdr)+24px)] transition-[top] duration-300" ${note('Help box: routes to Contact or the enquiry popup when the answer isn’t here.')}>
          <p class="text-lg font-semibold">Still have a question?</p>
          <p class="mt-2 text-sm text-sub">Our team will get back to you.</p>
          <div class="mt-4 grid gap-2"><button type="button" class="btn btn-primary btn-sm" data-enquiry-type="General Enquiry">Send an enquiry</button><a class="btn btn-ghost btn-sm" href="${href('/contact')}">Contact us</a></div>
        </aside>
      </div>
    </section>`,
    wire(root) {
      const input = root.querySelector('[data-faq-search]');
      let topic = '';
      const apply = () => {
        const q = input.value.trim().toLowerCase();
        let shown = 0;
        root.querySelectorAll('[data-faq]').forEach((d) => {
          const ok = (!topic || d.dataset.topic === topic) && (!q || q.split(/\s+/).every((t) => d.dataset.text.includes(t)));
          d.classList.toggle('hidden', !ok);
          if (ok) shown++;
          if (q && ok) d.open = true;
        });
        root.querySelectorAll('[data-faq-group]').forEach((g) => g.classList.toggle('hidden', !g.querySelector('[data-faq]:not(.hidden)')));
        root.querySelector('[data-faq-empty]').classList.toggle('hidden', shown > 0);
      };
      input.addEventListener('input', apply);
      root.querySelectorAll('[data-faq-topic]').forEach((b) =>
        b.addEventListener('click', () => {
          topic = b.dataset.faqTopic;
          root.querySelectorAll('[data-faq-topic]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          apply();
        }),
      );
    },
  };
}

// ── Contact Us ───────────────────────────────────────────────────────────────
export function renderContact(params) {
  const fromOffice = entities.find((e) => e.id === params.get('office'));
  let country = fromOffice?.country || countries.find((c) => c.id === params.get('country'))?.id || 'uae';
  const panel = (cid) => {
    const c = countries.find((x) => x.id === cid);
    return `<p class="eyebrow">${esc(c.region)}</p><p class="mt-1 text-xl font-semibold">${esc(c.name)}</p>
      <ul class="mt-4 grid gap-4">
        ${entitiesIn(cid)
          .map(
            (e) => `<li class="grid gap-4 rounded-xl border p-5 sm:grid-cols-[1fr_1fr] ${fromOffice?.id === e.id ? 'border-ink' : 'border-line'}" data-entity="${e.id}">
              <div class="grid content-start gap-2">
                <div class="flex flex-wrap items-center gap-2"><p class="font-semibold">${esc(e.name)}</p>${tag(e.kind)}</div>
                ${e.mandate ? `<p class="text-sm text-sub">${esc(e.mandate)}</p>` : ''}
                ${contactList(e)}
                <span class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">Get directions ${icons.arrow}</span>
              </div>
              <div class="ph rounded-lg" style="aspect-ratio:4/3"><span>Google Map · ${esc(e.city)}</span></div>
            </li>`,
          )
          .join('')}
      </ul>`;
  };

  return {
    title: 'Contact Us',
    html: `
    ${pageHead('Contact Us', 'Reach the right BMK Group company, or send us a message.', [['Home', '#/home'], ['Contact Us']])}
    <section class="wrap pt-10">
      <div class="flex flex-col gap-4 rounded-xl bg-wash p-5 sm:flex-row sm:items-center sm:justify-between" ${change(`New: head-office strip with the main phone and email (+971 4 232 4747, ${contact.email}). Only the head office has a phone and email so far; the others show “to be confirmed”.`)}>
        <div><p class="eyebrow">Head office</p><p class="mt-1 font-semibold">${esc(contact.company)} · Jebel Ali Free Zone, Dubai</p></div>
        <div class="flex flex-wrap gap-2"><a class="btn btn-ghost btn-sm" href="tel:${contact.phone.replace(/\s/g, '')}">${esc(contact.phone)}</a><a class="btn btn-ghost btn-sm" href="mailto:${contact.email}">${esc(contact.email)}</a></div>
      </div>
    </section>
    <section class="wrap grid gap-10 py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      <div>
        <h2 class="text-xl font-semibold">Our offices</h2>
        <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Countries" ${note('Country selector. Each tab lists every BMK company in that country, with its own details and map. “Contact this office” on About Us opens the right country and highlights the company.')} ${change('One tab per country (6) instead of per company (4). UAE shows BMK GULF FZE and Island Valley Electronics; India shows BMK International and the Bhome Appliances showroom. Zambia and DR Congo show the official distribution mandate.')}>
          ${countries.map((c) => `<button type="button" role="tab" class="chip" data-tab="${c.id}" aria-pressed="${c.id === country}" aria-selected="${c.id === country}">${esc(c.short)} <span class="count">${entitiesIn(c.id).length}</span></button>`).join('')}
        </div>
        <div class="mt-5" data-panel>${panel(country)}</div>
      </div>
      <div class="h-fit rounded-xl border border-line p-6" data-contact-form-wrap ${note('Contact form with the fields listed in the scope: name, email, phone, subject or enquiry type, message. Submissions go to Enquiry Management.')}>
        <h2 class="text-xl font-semibold">Send us a message</h2>
        <form class="mt-5 grid gap-4" data-contact-form>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Full name</span><input required class="rounded-lg border border-line px-3 py-2.5" /></label>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-1.5 text-sm"><span class="font-medium">Email</span><input type="email" required class="rounded-lg border border-line px-3 py-2.5" /></label>
            <label class="grid gap-1.5 text-sm"><span class="font-medium">Phone</span><input type="tel" class="rounded-lg border border-line px-3 py-2.5" /></label>
          </div>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Subject</span>
            <select class="rounded-lg border border-line px-3 py-2.5">${enquiryTypes.map((t) => `<option>${esc(t.type)}</option>`).join('')}</select>
          </label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Message</span><textarea rows="5" required class="rounded-lg border border-line px-3 py-2.5"></textarea></label>
          <button class="btn btn-primary w-full">Send message</button>
          <p class="text-center text-xs text-faint">Wireframe: nothing is sent.</p>
        </form>
      </div>
    </section>
    <section class="wrap pb-6" ${note('Business enquiries: the same four types as the homepage, each opening the enquiry popup with its type selected. Unchanged in v2.')}>
      <h2 class="mb-5 text-xl font-semibold">Business enquiries</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${enquiryTypes.map((t) => `<li><button type="button" class="card h-full w-full p-5 text-left" data-enquiry-type="${esc(t.type)}"><span class="flex items-center justify-between gap-3 font-semibold">${esc(t.type)} ${icons.arrow}</span><span class="mt-1.5 block text-sm text-sub">${esc(t.text)}</span></button></li>`).join('')}
      </ul>
    </section>`,
    wire(root) {
      root.querySelectorAll('[data-tab]').forEach((b) =>
        b.addEventListener('click', () => {
          country = b.dataset.tab;
          root.querySelectorAll('[data-tab]').forEach((x) => {
            x.setAttribute('aria-pressed', String(x === b));
            x.setAttribute('aria-selected', String(x === b));
          });
          root.querySelector('[data-panel]').innerHTML = panel(country);
        }),
      );
      if (fromOffice) requestAnimationFrame(() => root.querySelector(`[data-entity="${fromOffice.id}"]`)?.scrollIntoView({ block: 'center' }));
      root.querySelector('[data-contact-form]').addEventListener('submit', (ev) => {
        ev.preventDefault();
        root.querySelector('[data-contact-form-wrap]').innerHTML = `<div class="grid justify-items-center gap-3 py-16 text-center"><div class="grid size-12 place-items-center rounded-full border-2 border-ink text-xl">✓</div><p class="font-semibold">Thanks, your message has been sent</p><p class="text-sm text-sub">We’ll reply by email. (Success state.)</p></div>`;
      });
    },
  };
}

/** Global: any [data-enquiry-type] opens the popup with that type ("" = none selected). */
export function wireEnquiryTriggers() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-enquiry-type]');
    if (!t) return;
    e.preventDefault();
    openEnquiry({ type: t.dataset.enquiryType });
  });
}
