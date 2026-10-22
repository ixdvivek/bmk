// About Us, FAQ and Contact Us — homepage styles, wireframe structure and copy.
import { intro, entities, milestones, enquiryTypes, faqTopics, faqs } from '../../wireframe/v1/src/content.js';
import { A, esc, href, arrow, icon, crumbs } from './ui.js';
import { pillbar, wirePillbar } from './listing.js';

// Line icons that take the text colour
const ico = {
  pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3.5l1.8 4.4-2.2 1.4a11 11 0 0 0 6.1 6.1l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

// City icons from the homepage location cards
const cityIcon = { 'bmk-global': 'petronas', 'bmk-asia': 'loc-singapore', 'bmk-europe': 'loc-london', 'bmk-middle-east': 'loc-dubai' };
const city = (e) => e.city.split(',')[0];
const tbc = (label = 'To be confirmed') => `<span class="text-muted/70 italic">${label}</span>`;

/** Contact rows for an office (address, phone, email). */
const contactRows = (e, light = false) => `
  <dl class="grid gap-3 text-[15px] leading-6">
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Address">${ico.pin}</dt><dd>${e.address ? esc(e.address) : tbc()}</dd></div>
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Phone">${ico.phone}</dt><dd>${e.phone ? `<a class="hover:text-accent" href="tel:${esc(e.phone.replace(/\s/g, ''))}">${esc(e.phone)}</a>` : tbc()}</dd></div>
    <div class="flex gap-3"><dt class="mt-0.5 shrink-0 ${light ? 'text-white/60' : 'text-navy'}" aria-label="Email">${ico.mail}</dt><dd>${e.email ? `<a class="hover:text-accent" href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : tbc()}</dd></div>
  </dl>`;

/** Google Map stand-in (the build embeds Google Maps, per the scope). */
const map = (e, cls = '') => `
  <div class="map-ph ${cls}" role="img" aria-label="Map of ${esc(e.city)} (Google Map to come)">
    <span class="map-ph-pin"></span>
    <span class="map-ph-label">Google Map · ${esc(city(e))}</span>
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

/** Light page hero (FAQ, Contact): same rhythm as the listing heroes. */
const lightHero = (trail, chip, title, sub, extra = '') => `
  <section class="bg-mist pt-[clamp(128px,11vw,176px)] pb-[clamp(48px,5vw,80px)]">
    <div class="shell">
      ${crumbs(trail)}
      <span class="chip mt-6 border-line bg-white text-ink">${esc(chip)}</span>
      <h1 class="t-display mt-4 max-w-4xl">${esc(title)}</h1>
      <p class="t-body mt-3 max-w-2xl text-ink/80">${esc(sub)}</p>
      ${extra}
    </div>
  </section>`;

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

// ── About Us ─────────────────────────────────────────────────────────────────
const MILESTONE_IMG = new Set(['2005', '2008', '2012', '2015', '2018', '2022']);

export function renderAbout(params) {
  const countries = new Set(entities.map((e) => e.city.split(',').pop().trim())).size;
  const sections = [
    ['who-we-are', 'Who we are'],
    ['presence', 'Group presence'],
    ['history', 'Our history'],
    ['work-with-us', 'Work with us'],
  ];

  const company = (e, i) => {
    const flip = i % 2 === 1;
    return `
    <article id="${e.id}" class="grid scroll-mt-40 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div class="company-media ${flip ? 'lg:order-2' : ''}" role="img" aria-label="${esc(e.name)} (company photo to come)">
        <img src="${A}patterns/history-mark-2.svg" alt="" class="company-mark" />
        <span class="company-badge"><img src="${A}icons/${cityIcon[e.id]}.svg" alt="" width="40" height="40" /></span>
        <p class="company-city">${esc(city(e))}</p>
      </div>
      <div class="flex flex-col items-start gap-6 ${flip ? 'lg:order-1' : ''}">
        <div>
          <p class="text-xs tracking-[0.14em] text-muted uppercase">${esc(e.city)}</p>
          <h3 class="mt-2 text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em]">${esc(e.name)}</h3>
          <p class="t-body mt-3 text-muted">${esc(e.role)}</p>
        </div>
        <div class="grid w-full gap-4 rounded-2xl bg-white p-3 sm:grid-cols-[1fr_1.15fr] sm:items-center">
          ${map(e, 'aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-44')}
          <div class="p-2 sm:p-3">${contactRows(e)}</div>
        </div>
        <a class="btn btn-navy" href="${href('/contact', { office: e.id })}">Contact this office ${arrow('orange')}</a>
      </div>
    </article>`;
  };

  const milestone = (m, i) => {
    const img = MILESTONE_IMG.has(m.year);
    return `
    <li class="tl-item ${i % 2 ? 'tl-right' : ''}">
      <span class="tl-dot" aria-hidden="true"></span>
      <article class="tl-card">
        <div class="tl-media">${img ? `<img src="${A}images/milestone-${m.year}.webp" alt="" loading="lazy" />` : `<img src="${A}patterns/history-mark-2.svg" alt="" class="tl-mark" />`}</div>
        <div class="flex flex-col justify-center p-6">
          <p class="text-[32px] leading-8 font-semibold">${m.year}</p>
          <p class="mt-2 text-base leading-6 font-medium tracking-[-0.01em]">${esc(m.title)}</p>
          <p class="mt-2 text-[15px] leading-6 text-black/55">${esc(m.text)}</p>
        </div>
      </article>
    </li>`;
  };

  return {
    title: 'About Us',
    html: `
    <section class="photo-hero pt-[clamp(128px,11vw,176px)] pb-[146px]" style="--hero-overlay:linear-gradient(90deg,rgb(0 0 0/.75) 0%,rgb(0 0 0/.35) 60%,rgb(0 0 0/.2) 100%)">
      <img class="photo-hero-img object-[66%_50%]" src="${A}images/about.webp" alt="" fetchpriority="high" />
      <div class="shell">
        ${crumbs([['Home', '../'], ['About Us']], true)}
        <span class="pill-dark mt-6">About Us</span>
        <h1 class="t-display mt-4 max-w-3xl">About BMK Group</h1>
        <p class="t-body mt-3 max-w-2xl text-mist">The BMK Group profile: who we are, where we operate and how we got here.</p>
      </div>
    </section>
    ${pillbar('On this page', sections.map(([id, l], i) => `<li><a class="pill-dark ${i ? '' : 'is-on'}" href="#${id}" data-anchor>${l}</a></li>`).join(''))}

    <section id="who-we-are" class="section-y scroll-mt-24 bg-white" data-section>
      <div class="shell grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-[120px]">
        <div class="flex flex-col items-start gap-6">
          <span class="chip border-line text-ink">Who we are</span>
          <h2 class="t-display">${esc(intro.heading)}</h2>
          <div class="t-body space-y-6">${intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          <a class="btn btn-navy" href="${href('/products')}">Explore our brands ${arrow('orange')}</a>
        </div>
        <dl class="grid grid-cols-2 gap-2 rounded-3xl bg-mist p-2">
          ${[
            [entities.length, 'Group companies'],
            [countries, 'Countries'],
          ]
            .map(([n, l]) => `<div class="flex aspect-[5/4] flex-col justify-between rounded-2xl bg-white p-6"><dt class="text-sm text-muted">${l}</dt><dd class="text-[clamp(3rem,2rem+3vw,4.5rem)] leading-none font-medium tracking-[-0.05em]">${n}</dd></div>`)
            .join('')}
          <div class="col-span-2 flex flex-col gap-5 rounded-2xl bg-navy p-6 text-white">
            <dt class="text-sm text-white/70">Regions</dt>
            <dd class="flex flex-wrap gap-2">${['Southeast Asia', 'Europe', 'MENA'].map((r) => `<span class="pill-dark">${r}</span>`).join('')}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="presence" class="section-y scroll-mt-24 bg-fog" data-section>
      <div class="shell">
        <div class="flex max-w-[560px] flex-col items-start gap-6">
          <span class="chip border-line bg-white text-ink">Group presence</span>
          <h2 class="t-display">Our companies</h2>
          <p class="t-body">BMK Group operates through distinct registered companies and business entities across multiple countries and regions.</p>
        </div>
        <div class="mt-16 grid gap-20 lg:gap-28">${entities.map(company).join('')}</div>
      </div>
    </section>

    <section id="history" class="section-y scroll-mt-24 bg-mist" data-section>
      <div class="shell">
        <div class="mx-auto flex max-w-[640px] flex-col items-center gap-6 text-center">
          <span class="chip border-line bg-white text-ink">Our Journey</span>
          <h2 class="t-display">From global trade to new possibilities.</h2>
          <p class="t-body">A business built on international connections, evolving with the technology market and expanding into new opportunities.</p>
        </div>
        <ol class="timeline mt-16">${milestones.map(milestone).join('')}</ol>
      </div>
    </section>

    ${enquiryBlock('Work with BMK', 'Distribution, dealership, retail supply or something else.')}`,
    wire(root) {
      const off = [wirePillbar(root), wireSections(root)];
      const target = params.get('section') || params.get('company');
      if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }));
      return () => off.forEach((f) => f?.());
    },
  };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function renderFaq() {
  const item = (f) => `
    <details class="faq" data-faq data-topic="${f.topic}" data-text="${esc((f.q + ' ' + (f.a || '')).toLowerCase())}">
      <summary><span>${esc(f.q)}</span><span class="faq-icon" aria-hidden="true">${icon.plus}</span></summary>
      <div class="faq-a">${f.a ? `<p>${esc(f.a)}</p>` : `<p class="faq-tbc">Answer to be supplied by BMK</p>`}</div>
    </details>`;

  return {
    title: 'FAQ',
    html: `
    ${lightHero(
      [['Home', '../'], ['FAQ']],
      'FAQ',
      'Frequently asked questions',
      'Answers to common questions about BMK Group, our brands and partnering with us.',
      `<label class="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-ink/15 bg-white py-1.5 pr-1.5 pl-5 transition-colors focus-within:border-navy">
        ${icon.search}<input data-faq-search type="search" placeholder="Search questions" class="min-w-0 flex-1 bg-transparent py-2.5 outline-none" aria-label="Search questions" />
      </label>`,
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
        <aside class="relative isolate h-fit overflow-hidden rounded-3xl bg-navy p-8 text-white lg:sticky lg:top-32">
          <img src="${A}patterns/history-mark-1.svg" alt="" class="absolute -top-16 -right-16 -z-10 w-56 opacity-20" />
          <p class="text-[28px] leading-tight tracking-[-0.04em]">Still have a question?</p>
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
  let office = entities.find((e) => e.id === params.get('office'))?.id || 'bmk-middle-east';
  const details = (e) => `
    <div class="flex items-start gap-4">
      <span class="grid size-16 shrink-0 place-items-center rounded-full bg-white"><img src="${A}icons/${cityIcon[e.id]}.svg" alt="" width="36" height="36" /></span>
      <div>
        <p class="text-xs tracking-[0.14em] text-muted uppercase">${esc(e.city)}</p>
        <p class="mt-1.5 text-2xl leading-7 font-semibold tracking-[-0.02em]">${esc(e.name)}</p>
        <p class="t-body mt-2 text-muted">${esc(e.role)}</p>
      </div>
    </div>
    <div class="mt-6 border-t border-line pt-6">${contactRows(e)}</div>
    <a class="group mt-6 inline-flex items-center gap-2 text-sm font-semibold" href="https://www.google.com/maps/search/${encodeURIComponent(e.address || e.city)}" target="_blank" rel="noopener">Get directions ${arrow('orange')}</a>`;

  return {
    title: 'Contact Us',
    html: `
    ${lightHero([['Home', '../'], ['Contact Us']], 'Contact Us', 'Get in touch', 'Reach the right BMK Group company, or send us a message.')}
    <section class="shell section-y !pt-12">
      <div class="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 class="text-[28px] leading-tight tracking-[-0.04em]">Our offices</h2>
          <div class="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Offices">
            ${entities.map((e) => `<button type="button" role="tab" class="pill ${e.id === office ? 'is-on' : ''}" aria-selected="${e.id === office}" data-office="${e.id}">${esc(city(e))}</button>`).join('')}
          </div>
          <div class="mt-6 grid gap-2 rounded-3xl bg-mist p-2">
            <div data-map>${map(entities.find((e) => e.id === office), 'aspect-[16/9]')}</div>
            <div class="rounded-2xl bg-white p-6 sm:p-8" data-office-details role="tabpanel">${details(entities.find((e) => e.id === office))}</div>
          </div>
        </div>
        <div class="rounded-3xl border border-line bg-white p-6 sm:p-10 lg:sticky lg:top-32" data-contact-form-wrap>
          <span class="chip border-line text-ink">Contact form</span>
          <h2 class="mt-4 text-[28px] leading-tight tracking-[-0.04em]">Send us a message</h2>
          <form class="mt-8 grid gap-4" data-contact-form>
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
    </section>
    ${enquiryBlock('Business enquiries', undefined, 'business-enquiries')}`,
    wire(root) {
      root.querySelectorAll('[data-office]').forEach((b) =>
        b.addEventListener('click', () => {
          office = b.dataset.office;
          const e = entities.find((x) => x.id === office);
          root.querySelectorAll('[data-office]').forEach((x) => {
            x.classList.toggle('is-on', x === b);
            x.setAttribute('aria-selected', String(x === b));
          });
          root.querySelector('[data-office-details]').innerHTML = details(e);
          root.querySelector('[data-map]').innerHTML = map(e, 'aspect-[16/9]');
        }),
      );
      root.querySelector('[data-contact-form]').addEventListener('submit', (ev) => {
        ev.preventDefault();
        root.querySelector('[data-contact-form-wrap]').innerHTML = `<div class="grid justify-items-center gap-4 py-20 text-center"><span class="grid size-16 place-items-center rounded-full bg-navy text-white">${icon.check.replace('width="11" height="11"', 'width="24" height="24"')}</span><p class="text-[28px] leading-tight tracking-[-0.04em]">Thanks, your message is on its way</p><p class="t-body max-w-sm text-muted">We’ll reply by email.</p></div>`;
      });
    },
  };
}
