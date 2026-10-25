// About Us, FAQ and Contact Us — homepage styles, wireframe structure and copy.
import { intro, mission, vision, values, contact, countries, entities, entitiesIn, regions, milestones, enquiryTypes, faqTopics, faqs } from '../../wireframe/src/content.js';
import { inHouseBrands, partnerBrands, products } from '../../wireframe/src/data.js';
import { countryVisual } from '../../src/data/locations.js';
import { milestoneVisual } from '../../src/data/milestones.js';
import mapData from '../../src/data/map-dots.json';
import { A, esc, href, arrow, icon, crumbs, brandMark } from './ui.js';
import { pillbar, wirePillbar } from './listing.js';

// Line icons that take the text colour
const ico = {
  pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3.5l1.8 4.4-2.2 1.4a11 11 0 0 0 6.1 6.1l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

// City icons, photos and pins (shared with the homepage presence map)
const visual = (c) => {
  const v = countryVisual[c.id] || {};
  return { ...v, icon: v.icon && `../${v.icon}`, photo: v.photo && `../${v.photo}` };
};
const tbc = (label = 'To be confirmed') => `<span class="text-muted/70 italic">${label}</span>`;

/** Contact rows for a company (address, phone, email). */
const contactRows = (e, light = false) => `
  <dl class="grid gap-2.5 text-[15px] leading-6">
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Address">${ico.pin}</dt><dd>${esc(e.address)}</dd></div>
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Phone">${ico.phone}</dt><dd>${e.phone ? `<a class="hover:text-accent" href="tel:${esc(e.phone.replace(/\s/g, ''))}">${esc(e.phone)}</a>` : tbc()}</dd></div>
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Email">${ico.mail}</dt><dd>${e.email ? `<a class="hover:text-accent" href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : tbc()}</dd></div>
  </dl>`;

const kindTag = (e) => `<span class="co-tag ${e.retail ? 'is-retail' : ''}">${esc(e.kind)}</span>`;

/** Domains, the email and the head-office number in client copy become links. */
const linkify = (text) =>
  esc(text)
    .replace(/\b([a-z0-9-]+\.(?:com|co\.in|co))\b(?![\w@])/g, '<a href="https://$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\b(info@bmkintl\.com)\b/g, '<a href="mailto:$1">$1</a>')
    .replace(/(\+971 4 232 4747)/g, '<a href="tel:+97142324747">$1</a>');

/** Google Map stand-in (the build embeds Google Maps, per the scope). */
const map = (label, cls = '', pins = 1) => `
  <div class="map-ph ${cls}" role="img" aria-label="Map of ${esc(label)} (Google Map to come)">
    <span class="flex gap-10">${'<span class="map-ph-pin"></span>'.repeat(pins)}</span>
    <span class="map-ph-label">Google Map · ${esc(label)}</span>
  </div>`;

/** The homepage "Let's do business together" block; buttons open the popup with the type set. */
const enquiryImages = ['enquiry-distribution', 'enquiry-dealership', 'enquiry-retail', 'enquiry-general'];
const enquiryBlock = (title = 'Let’s do business together', sub = 'Have a business enquiry? Select the enquiry type below and get in touch with the relevant BMK Group team.', id = 'work-with-us') => `
  <section id="${id}" class="section-y scroll-mt-24 bg-white" data-section>
    <div class="shell flex flex-col gap-10">
      <div class="flex flex-col gap-3 text-center"><h2 class="t-display">${esc(title)}</h2><p class="t-body">${esc(sub)}</p></div>
      <div class="mx-auto grid w-full max-w-[1292px] gap-4 rounded-3xl bg-mist p-2 sm:p-4 md:grid-cols-2">
        ${enquiryTypes
          .map(
            (t, i) => `<article class="enquiry group">
              <div class="enquiry-media"><img src="${A}images/${enquiryImages[i]}.webp" alt="" loading="lazy" /></div>
              <div class="enquiry-text"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>
              <button type="button" class="btn btn-navy" data-enquire="${esc(t.type)}">${esc(t.type)} ${arrow('orange')}</button>
            </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;

/** Photo page hero (FAQ, Contact; Figma). */
const pageHero = (trail, title, sub, img, extra = '', pos = 'center') => `
  <section class="photo-hero pt-[clamp(128px,11vw,176px)] pb-[clamp(48px,5vw,80px)]" style="--hero-overlay:linear-gradient(90deg,rgb(0 0 0/.6) 0%,rgb(0 0 0/.25) 60%,rgb(0 0 0/.05) 100%)">
    <img class="photo-hero-img" src="${A}images/${img}.webp" alt="" fetchpriority="high" style="object-position:${pos}" />
    <div class="shell">
      ${crumbs(trail, true)}
      <h1 class="t-display mt-6 max-w-4xl">${esc(title)}</h1>
      <p class="t-body mt-3 max-w-2xl text-mist">${esc(sub)}</p>
      ${extra}
    </div>
  </section>`;

/** Office map: static map preview with a pin (Google Maps embed to come). */
const officeMap = (label) => `
  <div class="relative aspect-[672/370] overflow-hidden rounded-2xl bg-mist" role="img" aria-label="Map of ${esc(label)} (Google Map to come)">
    <img src="${A}images/map-placeholder.webp" alt="" class="size-full object-cover" loading="lazy" />
    <img src="${A}icons/map-pin-orange.svg" alt="" width="32" height="42" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full drop-shadow-md" />
    <span class="map-ph-label">Map preview · ${esc(label)}</span>
  </div>`;

/** Highlight the in-page pill for the section in view. */
function wireSections(root) {
  const pills = root.querySelectorAll('.pillbar [data-anchor]');
  if (!pills.length) return null;
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && pills.forEach((p) => p.classList.toggle('is-on', p.getAttribute('href') === `#${e.target.id}`))),
    { rootMargin: '-40% 0px -55% 0px' },
  );
  root.querySelectorAll('[data-section]').forEach((s) => io.observe(s));
  return () => io.disconnect();
}

// ── Shared pieces ────────────────────────────────────────────────────────────
/** Milestone cards (same component as the homepage timeline). */
const milestoneCard = (m) => {
  const v = milestoneVisual[m.year] || {};
  return `<li class="milestone" data-tone="dark">
    <div class="m-bg" aria-hidden="true">${v.img ? `<img src="${A}images/${v.img}.webp" alt="" loading="lazy" />` : ''}</div>
    <span class="m-icon-wrap"><img class="m-icon" src="${A}icons/${v.icon}.svg" alt="" width="32" height="32" /></span>
    <div class="m-text">
      <p class="m-year">${esc(m.year)}</p>
      <p class="m-title">${esc(m.title)}</p>
      <p class="m-desc">${esc(v.short || m.points[0])}</p>
    </div>
  </li>`;
};

/** Horizontal card rail with a progress thumb and arrows. Returns cleanup. */
function wireRail(root) {
  const rail = root.querySelector('[data-rail]');
  if (!rail) return null;
  const track = rail.querySelector('[data-rail-track]');
  const thumb = rail.querySelector('[data-rail-thumb]');
  const prev = rail.querySelector('[data-rail-prev]');
  const next = rail.querySelector('[data-rail-next]');
  const cards = [...track.querySelectorAll('.milestone')];
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    const range = thumb.parentElement.clientWidth - thumb.offsetWidth;
    thumb.style.transform = `translateX(${p * range}px)`;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  const step = () => (cards[0]?.offsetWidth || 280) + 8;
  prev.addEventListener('click', () => track.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  cards.forEach((c) => {
    c.addEventListener('pointerenter', () => c.classList.add('is-active'));
    c.addEventListener('pointerleave', () => c.classList.remove('is-active'));
  });
  const ro = new ResizeObserver(update);
  ro.observe(track);
  update();
  return () => ro.disconnect();
}

/** Region map for "Who we are": the homepage dot map, cropped to where BMK
 *  operates, with a flag per region. Drawn on a canvas once. */
const CROP = { x: 470, y: 150, w: 560, h: 380 };
const regionPins = () =>
  regions.map((r) => {
    const cs = countries.filter((c) => c.region === r).map((c) => countryVisual[c.id]);
    const x = cs.reduce((a, c) => a + c.x, 0) / cs.length;
    const y = cs.reduce((a, c) => a + c.y, 0) / cs.length;
    return { r, x: ((x / 100) * 1200 - CROP.x) / CROP.w * 100, y: ((y / 100) * 620 - CROP.y) / CROP.h * 100, n: cs.length };
  });

function drawRegionMap(canvas) {
  const ctx = canvas.getContext('2d');
  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const s = (rect.width / CROP.w) * dpr;
    ctx.setTransform(s, 0, 0, s, -CROP.x * s, -CROP.y * s);
    const { dots, r } = mapData;
    ctx.fillStyle = 'rgb(31 72 125 / 0.28)';
    ctx.beginPath();
    for (let i = 0; i < dots.length; i += 2) {
      const x = dots[i];
      const y = dots[i + 1];
      if (x < CROP.x - 4 || x > CROP.x + CROP.w + 4 || y < CROP.y - 4 || y > CROP.y + CROP.h + 4) continue;
      ctx.moveTo(x + r * 1.15, y);
      ctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
    }
    ctx.fill();
  };
  const ro = new ResizeObserver(draw);
  ro.observe(canvas);
  return () => ro.disconnect();
}

// ── About Us ─────────────────────────────────────────────────────────────────
// Layout follows the About Us frame in Figma: region map with stats, a large
// card per country (city photo + glass details panel), horizontal journey cards.
export function renderAbout(params) {
  const sections = [
    ['who-we-are', 'Who we are'],
    ['mission', 'Mission & values'],
    ['companies', 'Our companies'],
    ['our-brands', 'Our brands'],
    ['journey', 'Our journey'],
    ['work-with-us', 'Work with us'],
  ];
  const valueIcon = { Integrity: 'verified', 'Customer-Centric': 'milestone-2012', 'Quality-Driven': 'star', 'Innovation-Focused': 'milestone-2022' };

  const countryCard = (c, i) => {
    const v = visual(c);
    const list = entitiesIn(c.id);
    const flip = i % 2 === 1;
    return `
    <article id="${c.id}" class="co-card ${flip ? 'is-flip' : ''} scroll-mt-40" ${v.photo ? '' : 'data-no-photo'}>
      ${v.photo ? `<img class="co-photo" src="${v.photo}" alt="" loading="lazy" style="object-position:${v.pos || 'center'}" />` : `<img class="co-mark" src="${A}patterns/history-mark-2.svg" alt="" />`}
      <span class="co-badge"><img src="${v.icon}" alt="" width="40" height="40" /></span>
      <p class="co-city">${esc(c.city.split(',')[0])}</p>
      <div class="co-panel">
        <p class="text-xs tracking-[0.14em] text-muted uppercase">${esc(c.city)}, ${esc(c.name)}</p>
        ${list
          .map(
            (e, k) => `<section id="${e.id}" class="scroll-mt-40 ${k ? 'mt-6 border-t border-ink/10 pt-6' : 'mt-2'}">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2"><h3 class="text-[clamp(1.5rem,1.2rem+0.8vw,2rem)] leading-tight font-semibold tracking-[-0.03em]">${esc(e.name)}</h3>${kindTag(e)}</div>
              <p class="mt-2 text-[15px] leading-6 text-muted">${esc(e.role)}</p>
              ${e.mandate ? `<p class="mt-2 text-sm"><span class="text-muted">Authorized mandate:</span> ${esc(e.mandate)}</p>` : ''}
              ${e.products ? `<p class="mt-2 text-sm"><span class="text-muted">In store:</span> ${esc(e.products)}</p>` : ''}
              <div class="mt-4">${contactRows(e)}</div>
              <a class="btn btn-navy mt-5" href="${href('/contact', { office: e.id })}">${e.retail ? 'Visit the showroom' : 'Contact this office'} ${arrow('orange')}</a>
            </section>`,
          )
          .join('')}
        <div class="mt-6">${map(c.city, 'aspect-[16/7]', list.length)}</div>
      </div>
    </article>`;
  };

  const brandTile = (b) => {
    const n = products.filter((p) => p.brand === b.id).length;
    // Same card as the homepage "Our Brands" (white, grey outline)
    return `<article class="ih-card">
      <div class="flex items-center justify-between gap-6">
        <span class="brand-tag">BMK brand</span>
        ${brandMark(b, { cls: 'h-[57px] !max-w-40 object-right' })}
      </div>
      <div class="mt-auto flex flex-col items-start gap-3 pt-16">
        <h3 class="text-[32px] leading-8 font-semibold">${esc(b.name)}</h3>
        <p class="t-body text-black/50">${esc(b.intro)}</p>
        <div class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a class="brand-cta" href="${href(`/brand/${b.id}`)}">${n ? `View ${n} products` : 'View brand'} <img src="${A}icons/arrow-orange.svg" alt="" class="btn-icon" width="16" height="16" /></a>
          ${b.sites.map(([d]) => `<a class="text-sm text-black/70 underline decoration-black/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-accent" href="https://${d}" target="_blank" rel="noopener">${esc(d)} ↗</a>`).join('')}
        </div>
      </div>
    </article>`;
  };

  return {
    title: 'About Us',
    html: `
    <section class="photo-hero pt-[clamp(128px,11vw,176px)] pb-[146px]" style="--hero-overlay:linear-gradient(90deg,rgb(0 0 0/.75) 0%,rgb(0 0 0/.35) 60%,rgb(0 0 0/.2) 100%)">
      <img class="photo-hero-img object-[66%_50%]" src="${A}images/about.webp" alt="" fetchpriority="high" />
      <div class="shell">
        ${crumbs([['Home', '../'], ['About Us']], true)}
        <h1 class="t-display mt-6 max-w-3xl">About BMK Group</h1>
        <p class="t-body mt-3 max-w-2xl text-mist">Who we are, what we stand for, where we operate and how we got here.</p>
      </div>
    </section>
    ${pillbar('On this page', sections.map(([id, l], i) => `<li><a class="pill-dark ${i ? '' : 'is-on'}" href="#${id}" data-anchor>${l}</a></li>`).join(''))}

    <section id="who-we-are" class="section-y scroll-mt-24 bg-white" data-section>
      <div class="shell grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-[120px]">
        <div class="flex flex-col items-start gap-6">
          <span class="chip border-line text-ink">Who we are</span>
          <h2 class="t-display">${esc(intro.heading)}</h2>
          <div class="t-body space-y-5">${intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          <a class="btn btn-navy" href="#our-brands" data-anchor>Explore our brands ${arrow('orange')}</a>
        </div>
        <div class="relative">
          <div class="region-map" role="img" aria-label="Map of BMK Group regions: ${regions.join(', ')}">
            <canvas data-region-canvas></canvas>
            ${regionPins()
              .map((p) => `<span class="region-flag ${p.x > 70 ? 'is-left' : ''}" style="left:${p.x}%;top:${p.y}%"><span class="region-flag-pole"></span><span class="region-flag-label">${esc(p.r)}</span></span>`)
              .join('')}
          </div>
          <dl class="relative z-10 mx-auto -mt-[clamp(16px,3vw,48px)] grid max-w-[560px] grid-cols-2 gap-2 rounded-3xl bg-mist p-2">
            ${[
              [entities.length, 'Group companies'],
              [countries.length, 'Countries'],
            ]
              .map(([n, l]) => `<div class="flex flex-col justify-between gap-6 rounded-2xl bg-white p-6"><dt class="text-sm text-muted">${l}</dt><dd class="text-[clamp(3rem,2rem+3vw,4.5rem)] leading-none font-medium tracking-[-0.05em]">${n}</dd></div>`)
              .join('')}
          </dl>
        </div>
      </div>
    </section>

    <section id="mission" class="section-y relative isolate scroll-mt-24 overflow-hidden bg-navy text-white" data-section>
      <img src="${A}patterns/history-mark-1.svg" alt="" class="absolute -top-24 -right-24 -z-10 w-[min(520px,50vw)] opacity-10 brightness-0 invert" />
      <div class="shell">
        <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
          ${[
            ['Our mission', mission],
            ['Our vision', vision],
          ]
            .map(([k, t]) => `<div class="flex flex-col items-start gap-6"><h2 class="text-xs tracking-[0.14em] text-white/60 uppercase">${k}</h2><p class="text-[clamp(1.5rem,1.1rem+1.1vw,2.25rem)] leading-tight tracking-[-0.03em]">${esc(t)}</p></div>`)
            .join('')}
        </div>
        <div class="mt-16 border-t border-white/15 pt-12">
          <h2 class="text-xs tracking-[0.14em] text-white/60 uppercase">Core values</h2>
          <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${values
              .map(
                (v) => `<li class="value-card"><span class="grid size-14 place-items-center rounded-full bg-white"><img src="${A}icons/${valueIcon[v.name]}.svg" alt="" class="size-7" /></span>
                  <p class="mt-8 text-xl leading-7 font-semibold">${esc(v.name)}</p><p class="mt-2 text-[15px] leading-6 text-white/70">${esc(v.text)}</p></li>`,
              )
              .join('')}
          </ul>
        </div>
      </div>
    </section>

    <section id="companies" class="section-y scroll-mt-24 bg-fog" data-section>
      <div class="shell">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="flex max-w-[620px] flex-col items-start gap-6">
            <span class="chip border-line bg-white text-ink">Group presence</span>
            <h2 class="t-display">Our companies</h2>
            <p class="t-body">BMK Group operates an integrated network of corporate entities, retail outlets, and distribution hubs across six core markets.</p>
          </div>
          <ul class="flex flex-wrap gap-2">${countries.map((c) => `<li><a class="pill" href="#${c.id}" data-anchor>${esc(c.short)} <span class="n">${entitiesIn(c.id).length}</span></a></li>`).join('')}</ul>
        </div>
        <div class="mt-14 grid gap-8 lg:gap-12">${countries.map(countryCard).join('')}</div>
      </div>
    </section>

    <section id="our-brands" class="section-y scroll-mt-24 bg-white" data-section>
      <div class="shell">
        <div class="flex max-w-[640px] flex-col items-start gap-6">
          <span class="chip border-line text-ink">Our brands</span>
          <h2 class="t-display">Built by BMK, and distributed by BMK</h2>
          <p class="t-body">BMK Group develops and markets its own technology and home living brands, and is an official distributor and channel partner for premier global names.</p>
        </div>
        <div class="mt-12 grid gap-4 lg:grid-cols-2">${inHouseBrands.map(brandTile).join('')}</div>
        <p class="mt-16 mb-5 text-xs tracking-[0.14em] text-muted uppercase">Partner brands</p>
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">${partnerBrands.map((b) => `<li><a class="partner-tile" href="${href(`/brand/${b.id}`)}" title="${esc(b.name)}">${brandMark(b, { cls: 'h-11 !text-[17px]' })}</a></li>`).join('')}</ul>
      </div>
    </section>

    <section id="journey" class="section-y relative scroll-mt-24 overflow-hidden bg-mist" data-section>
      <div class="shell" data-rail>
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="flex max-w-[560px] flex-col items-start gap-6">
            <span class="chip border-line bg-white text-ink">Our Journey</span>
            <h2 class="t-display">From global trade to new possibilities.</h2>
            <p class="t-body">From a Dubai trading firm in 2002 to companies, brands and retail across six markets.</p>
          </div>
          <div class="flex gap-1 self-end">
            <button type="button" class="icon-btn hover:bg-white" data-rail-prev aria-label="Previous milestones"><img src="${A}icons/arrow-dark.svg" alt="" class="size-4 -scale-x-100" /></button>
            <button type="button" class="icon-btn hover:bg-white" data-rail-next aria-label="Next milestones"><img src="${A}icons/arrow-dark.svg" alt="" class="size-4" /></button>
          </div>
        </div>
        <div class="relative mt-10 h-2 overflow-hidden rounded-full bg-white/70" aria-hidden="true"><div class="absolute inset-y-0 left-0 w-[min(160px,25%)] bg-accent transition-transform duration-150" data-rail-thumb></div></div>
        <ol class="-mx-[clamp(20px,7.5vw,120px)] mt-8 flex snap-x gap-2 overflow-x-auto px-[clamp(20px,7.5vw,120px)] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-rail-track>
          ${milestones.map(milestoneCard).join('')}
        </ol>
      </div>
    </section>

    ${enquiryBlock('Work with BMK', 'Distribution, dealership, retail supply or something else.')}`,
    wire(root) {
      const off = [wirePillbar(root), wireSections(root), wireRail(root), drawRegionMap(root.querySelector('[data-region-canvas]'))];
      const target = params.get('section') || params.get('company');
      if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }));
      return () => off.forEach((f) => f?.());
    },
  };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function renderFaq() {
  const item = (f) => `
    <details class="faq" data-faq data-topic="${f.topic}" data-text="${esc([f.q, ...f.a, ...(f.list || [])].join(' ').toLowerCase())}">
      <summary><span>${esc(f.q)}</span><span class="faq-icon" aria-hidden="true">${icon.plus}</span></summary>
      <div class="faq-a">
        ${f.a.map((p) => `<p>${linkify(p)}</p>`).join('')}
        ${f.list ? `<ul>${f.list.map((x) => `<li>${linkify(x)}</li>`).join('')}</ul>` : ''}
      </div>
    </details>`;

  return {
    title: 'FAQ',
    html: `
    ${pageHero(
      [['Home', '../'], ['FAQ']],
      'Frequently asked questions',
      'Answers to common questions about BMK Group, our brands and partnering with us.',
      'faq-hero',
      `<label class="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-ink/15 bg-white py-1.5 pr-1.5 pl-5 text-ink transition-colors focus-within:border-navy">
        ${icon.search}<input data-faq-search type="search" placeholder="Search questions" class="min-w-0 flex-1 bg-transparent py-2.5 outline-none" aria-label="Search questions" />
      </label>`,
      '75% center',
    )}
    <section class="shell section-y !pt-12">
      <div class="mb-10 flex flex-wrap gap-2" role="group" aria-label="Topics">
        <button type="button" class="pill is-on" data-faq-topic="">All <span class="n">${faqs.length}</span></button>
        ${faqTopics.map((t) => `<button type="button" class="pill" data-faq-topic="${t.id}">${esc(t.name)} <span class="n">${faqs.filter((f) => f.topic === t.id).length}</span></button>`).join('')}
      </div>
      <div class="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div class="grid gap-12">
          ${faqTopics
            .map(
              (t) => `<section data-faq-group="${t.id}">
                <h2 class="mb-2 text-xs tracking-[0.14em] text-muted uppercase">${esc(t.name)}</h2>
                ${faqs.filter((f) => f.topic === t.id).map(item).join('')}
              </section>`,
            )
            .join('')}
          <div data-faq-empty class="hidden rounded-2xl bg-mist p-10"><p class="text-[28px] leading-tight tracking-[-0.04em]">No questions match your search</p><p class="t-body mt-3 text-muted">Try other words, or ask our team directly.</p></div>
        </div>
        <aside class="h-fit rounded-3xl bg-navy p-8 text-white lg:sticky lg:top-32">
          <img src="${A}images/faq-help.webp" alt="" class="aspect-[296/280] w-full rounded-2xl object-cover" loading="lazy" />
          <p class="mt-3 text-[28px] leading-tight tracking-[-0.04em]">Still have a question?</p>
          <p class="t-body mt-3 text-white/75">Our team will get back to you.</p>
          <div class="mt-8 grid gap-3">
            <button type="button" class="btn bg-white text-ink hover:bg-accent hover:text-white" data-enquire="General Enquiry">Send an enquiry ${arrow('orange')}</button>
            <a class="btn btn-outline-light" href="${href('/contact')}">Contact us</a>
          </div>
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
          root.querySelectorAll('[data-faq-topic]').forEach((x) => x.classList.toggle('is-on', x === b));
          apply();
        }),
      );
    },
  };
}

// ── Contact Us ───────────────────────────────────────────────────────────────
export function renderContact(params) {
  const fromOffice = entities.find((e) => e.id === params.get('office'));
  let country = fromOffice?.country || countries.find((c) => c.id === (params.get('country') || params.get('office')))?.id || 'uae';

  const panel = (cid) => {
    const c = countries.find((x) => x.id === cid);
    const v = visual(c);
    const list = entitiesIn(cid);
    return `
      ${list
        .map(
          (e) => `<div class="rounded-2xl bg-white p-6 sm:p-8 ${fromOffice?.id === e.id ? 'ring-2 ring-navy' : ''}" data-entity="${e.id}">
            <div class="flex items-start gap-4 max-sm:flex-col">
              <span class="grid size-16 shrink-0 place-items-center rounded-full bg-mist"><img src="${v.icon}" alt="" width="36" height="36" /></span>
              <div class="min-w-0">
                <p class="text-xs tracking-[0.14em] text-muted uppercase">${esc(c.city)}</p>
                <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2"><p class="text-xl leading-7 font-semibold tracking-[-0.02em]">${esc(e.name)}</p>${kindTag(e)}</div>
                <p class="mt-1 text-[15px] leading-6 text-muted">${esc(e.mandate || e.role)}</p>
              </div>
            </div>
            <div class="mt-5 border-t border-line pt-5">${contactRows(e)}</div>
            <a class="group mt-5 inline-flex items-center gap-2 text-sm font-semibold" href="https://www.google.com/maps/search/${encodeURIComponent(e.address)}" target="_blank" rel="noopener">Get directions ${arrow('orange')}</a>
          </div>`,
        )
        .join('')}
      ${officeMap(c.city)}`;
  };

  return {
    title: 'Contact Us',
    html: `
    ${pageHero([['Home', '../'], ['Contact Us']], 'Get in touch', 'Reach the right BMK Group company, or send us a message.', 'contact-hero')}
    <section class="shell section-y !pt-12">
      <div class="grid items-start gap-10 lg:grid-cols-[688fr_608fr] lg:gap-16">
        <div>
          <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h2 class="text-[28px] leading-tight tracking-[-0.04em]">Our offices</h2>
            <div class="flex flex-wrap gap-2" role="tablist" aria-label="Countries">
              ${countries.map((c) => `<button type="button" role="tab" class="pill ${c.id === country ? 'is-on' : ''}" aria-selected="${c.id === country}" data-country="${c.id}">${esc(c.short)}</button>`).join('')}
            </div>
          </div>
          <div class="mt-5 grid gap-2 rounded-3xl border border-line bg-mist p-2" data-panel role="tabpanel">${panel(country)}</div>
        </div>
        <div class="lg:sticky lg:top-32">
          <h2 class="text-[28px] leading-tight tracking-[-0.04em]">Send us a message</h2>
          <div class="mt-5 rounded-3xl border border-line bg-white p-6 sm:p-10" data-contact-form-wrap>
          <form class="grid gap-4" data-contact-form>
            <label class="grid gap-1.5 text-sm"><span class="font-medium">Full name</span><input required class="field" autocomplete="name" /></label>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="grid gap-1.5 text-sm"><span class="font-medium">Email</span><input type="email" required class="field" autocomplete="email" /></label>
              <label class="grid gap-1.5 text-sm"><span class="font-medium">Phone</span><input type="tel" class="field" autocomplete="tel" /></label>
            </div>
            <label class="grid gap-1.5 text-sm"><span class="font-medium">Subject</span>
              <span class="select w-full"><select class="!w-full !rounded-xl !py-3">${enquiryTypes.map((t) => `<option>${esc(t.type)}</option>`).join('')}</select></span>
            </label>
            <label class="grid gap-1.5 text-sm"><span class="font-medium">Message</span><textarea rows="5" required class="field"></textarea></label>
            <button class="btn btn-navy mt-2 w-full">Send message ${arrow('orange')}</button>
            <p class="text-center text-xs text-muted">We’ll reply by email.</p>
          </form>
          </div>
        </div>
      </div>
    </section>
    <section class="shell">
      <div class="flex flex-col gap-6 rounded-3xl bg-navy p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4">
          <span class="grid size-14 shrink-0 place-items-center rounded-full bg-white"><img src="${A}icons/loc-dubai.svg" alt="" width="32" height="32" /></span>
          <div><p class="text-xs tracking-[0.14em] text-white/60 uppercase">Head office</p><p class="mt-1 text-xl leading-7 font-semibold">${esc(contact.company)} · Jebel Ali Free Zone, Dubai</p></div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a class="btn bg-white text-ink hover:bg-accent hover:text-white" href="tel:${contact.phone.replace(/\s/g, '')}">${ico.phone} ${esc(contact.phone)}</a>
          <a class="btn btn-outline-light" href="mailto:${contact.email}">${ico.mail} ${esc(contact.email)}</a>
        </div>
      </div>
    </section>
    ${enquiryBlock('Business enquiries', undefined, 'business-enquiries')}`,
    wire(root) {
      root.querySelectorAll('[data-country]').forEach((b) =>
        b.addEventListener('click', () => {
          country = b.dataset.country;
          root.querySelectorAll('[data-country]').forEach((x) => {
            x.classList.toggle('is-on', x === b);
            x.setAttribute('aria-selected', String(x === b));
          });
          root.querySelector('[data-panel]').innerHTML = panel(country);
        }),
      );
      if (fromOffice) requestAnimationFrame(() => root.querySelector(`[data-entity="${fromOffice.id}"]`)?.scrollIntoView({ block: 'center' }));
      root.querySelector('[data-contact-form]').addEventListener('submit', (ev) => {
        ev.preventDefault();
        root.querySelector('[data-contact-form-wrap]').innerHTML = `<div class="grid justify-items-center gap-4 py-20 text-center"><span class="grid size-16 place-items-center rounded-full bg-navy text-white">${icon.check.replace('width="11" height="11"', 'width="24" height="24"')}</span><p class="text-[28px] leading-tight tracking-[-0.04em]">Thanks, your message is on its way</p><p class="t-body max-w-sm text-muted">We’ll reply by email.</p></div>`;
      });
    },
  };
}
