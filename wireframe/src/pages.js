// Company pages: Home (reference only), About Us, FAQ, Contact Us.
import { brands } from './data.js';
import { intro, entities, milestones, conflicts, enquiryTypes, faqTopics, faqs } from './content.js';
import { esc, href, icons, ph, note } from './ui.js';
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

const tbc = (label = 'to be supplied') => `<span class="tbc">${esc(label)}</span>`;

/** World map placeholder with the group's pins (same positions as the built site). */
function mapPh(activeId, { onClick = true } = {}) {
  return `<div class="ph relative rounded-xl" style="aspect-ratio:1200/620"><span>World map</span>
    ${entities
      .map(
        (e) => `<${onClick ? 'button type="button"' : 'span'} data-pin="${e.id}" class="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center" style="left:${e.x}%;top:${e.y}%" ${onClick ? `aria-label="${esc(e.name)}"` : ''}>
          <span class="block size-3 rounded-full border-2 border-white ${e.id === activeId ? 'scale-150 bg-ink' : 'bg-sub'} transition-transform"></span></${onClick ? 'button' : 'span'}>`,
      )
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

/** After render, honour ?section=id by scrolling to it. */
function scrollToSection(params) {
  const id = params.get('section');
  if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
}

// ── Home (reference only) ────────────────────────────────────────────────────
export function renderHome() {
  const block = (title, body, cls = '') => `<section class="wrap ${cls} py-12"><h2 class="mb-6 text-2xl font-semibold tracking-tight">${title}</h2>${body}</section>`;
  return {
    title: 'Home (reference)',
    html: `
    <div class="border-b border-dashed border-faint bg-wash">
      <p class="wrap py-3 text-sm text-sub" ${note('The homepage itself is already designed and with the client for review. This page only mirrors its sections so the enquiry popups and links can be shown in context.')}><strong class="text-ink">Reference only.</strong> Mirrors the approved homepage design so the enquiry popups can be shown in context.</p>
    </div>
    <section class="wrap pt-8">
      <div class="ph flex items-end rounded-xl p-6 text-left normal-case sm:p-10" style="aspect-ratio:auto;min-height:420px">
        <div class="relative grid max-w-xl gap-4 rounded-lg bg-white/90 p-6 tracking-normal text-ink">
          <p class="eyebrow">Global technology distribution</p>
          <p class="text-3xl leading-tight font-semibold sm:text-4xl">Connecting markets with the technology of tomorrow.</p>
          <p class="text-sm text-sub">BMK Group brings global technology brands closer to businesses through trusted sourcing, international distribution and a forward-looking approach to product development.</p>
          <div class="flex flex-wrap gap-3"><a class="btn btn-primary btn-sm" href="${href('/products')}">Explore Our Products</a><a class="btn btn-ghost btn-sm" href="#enquiry" data-anchor>Partner With Us</a></div>
        </div>
      </div>
      <p class="mt-2 text-xs text-faint">Hero: scroll-driven background video (see built homepage)</p>
    </section>
    ${block(
      'Built on trust. Driven by innovation.',
      `<div class="grid gap-8 md:grid-cols-2">${ph('Image', 'rounded-xl', '520 / 504')}<div class="grid content-start gap-4 text-sub">${intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}<a class="btn btn-ghost btn-sm w-fit" href="${href('/about')}">Read More</a></div></div>`,
    )}
    ${block(
      'BMK Group Presence',
      `<div class="grid gap-6 lg:grid-cols-[1fr_320px]">${mapPh(null, { onClick: false })}
        <ul class="grid content-start gap-2">${entities.map((e) => `<li class="flex items-center justify-between gap-3 rounded-lg border border-line p-3"><span><span class="block text-sm font-semibold">${esc(e.name)}</span><span class="text-xs text-sub">${esc(e.city)}</span></span><a class="text-sm font-semibold underline underline-offset-4" href="${href('/about', { section: e.id })}">View Details</a></li>`).join('')}</ul></div>`,
    )}
    ${block(
      'Our Brands',
      `<ul class="grid gap-4 sm:grid-cols-3">${brands.map((b) => `<li><a class="card p-5" href="${href(`/brand/${b.id}`)}">${ph(`${b.name} logo`, 'rounded', '3 / 1')}<span class="mt-3 font-semibold">${esc(b.name)}</span><span class="mt-1 inline-flex items-center gap-1.5 text-sm">View brand ${icons.arrow}</span></a></li>`).join('')}</ul>`,
    )}
    ${block(
      'From global trade to new possibilities.',
      `<ul class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">${milestones
        .filter((m) => !m.source)
        .map((m) => `<li class="w-48 shrink-0 rounded-lg border border-line p-4"><p class="text-2xl font-semibold">${m.year}</p><p class="text-sm font-medium">${esc(m.title)}</p></li>`)
        .join('')}</ul>
      <a class="btn btn-ghost btn-sm mt-6" href="${href('/about', { section: 'history' })}">View Full History</a>`,
    )}
    <section id="enquiry" class="wrap scroll-mt-24 py-12" ${note('Four enquiry CTAs, per the homepage feedback. Each opens the enquiry popup with its type already selected. The same popup is used from the footer, the header Enquiry button, the Contact page and product pages.')}>
      <h2 class="text-center text-2xl font-semibold tracking-tight">Let's do business together</h2>
      <p class="mx-auto mt-2 mb-8 max-w-xl text-center text-sub">Have a business enquiry? Select the enquiry type below and get in touch with the relevant BMK Group team.</p>
      ${enquiryCards()}
    </section>`,
  };
}

// ── About Us ─────────────────────────────────────────────────────────────────
export function renderAbout(params) {
  let active = entities.some((e) => e.id === params.get('section')) ? params.get('section') : entities[0].id;
  const entityCard = (e) => `
    <article id="${e.id}" class="scroll-mt-24 rounded-xl border border-line p-5 ${e.id === active ? 'border-ink' : ''}" data-entity="${e.id}">
      <p class="eyebrow">${esc(e.city)}</p>
      <h3 class="mt-1 text-lg font-semibold">${esc(e.name)}</h3>
      <p class="mt-1 text-sm text-sub">${esc(e.role)}</p>
      <dl class="mt-4 grid gap-1.5 text-sm">
        <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Address</dt><dd>${e.address ? esc(e.address) : tbc()}</dd></div>
        <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Phone</dt><dd>${e.phone ? esc(e.phone) : tbc()}</dd></div>
        <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Email</dt><dd>${e.email ? esc(e.email) : tbc()}</dd></div>
      </dl>
      <a class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline" href="${href('/contact', { office: e.id })}">Contact this office ${icons.arrow}</a>
    </article>`;

  return {
    title: 'About Us',
    html: `
    ${pageHead('About Us', 'The BMK Group profile: who we are, where we operate and how we got here.', [['Home', '#/home'], ['About Us']],
      `<nav class="mt-6 flex flex-wrap gap-2" aria-label="On this page" ${note('In-page navigation. The homepage’s “Read More”, “View Details” and “View Full History” links land on these sections.')}>
        ${[['who-we-are', 'Who we are'], ['presence', 'Group presence'], ['history', 'Our history']].map(([id, l]) => `<a class="chip" href="#${id}" data-anchor>${l}</a>`).join('')}
      </nav>`)}

    <section id="who-we-are" class="wrap grid scroll-mt-24 gap-10 py-14 lg:grid-cols-2 lg:gap-16">
      <div class="grid content-start gap-4">
        <p class="eyebrow">Who we are</p>
        <h2 class="text-3xl leading-tight font-semibold tracking-tight">${esc(intro.heading)}</h2>
        <div class="grid gap-4 text-sub" ${note('Group introduction: the approved homepage copy, here in full.')}>${intro.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="mt-2 grid gap-2 rounded-lg border border-dashed border-faint p-4 text-sm" ${note('Corporate background: the scope lists this separately from the introduction. No copy exists yet.')}>
          <p class="font-semibold">Corporate background</p><p class="text-faint">Two or three paragraphs on the business: what BMK trades, who it serves, how it works with brands. ${tbc()}</p>
        </div>
      </div>
      <div class="grid gap-3">${ph('Corporate image', 'rounded-xl', '4 / 3')}<div class="grid grid-cols-2 gap-3">${ph('Image', 'rounded-lg', '4 / 3')}${ph('Image', 'rounded-lg', '4 / 3')}</div></div>
    </section>

    <section id="presence" class="scroll-mt-24 border-y border-line bg-wash py-14">
      <div class="wrap">
        <p class="eyebrow">Group presence</p>
        <h2 class="mt-1 text-3xl font-semibold tracking-tight">Our companies</h2>
        <p class="mt-2 max-w-2xl text-sub">BMK Group operates through distinct registered companies and business entities across multiple countries and regions.</p>
        <div class="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div ${note('Map: select a pin to highlight that company. Each company card has its own anchor, so the homepage’s “View Details” opens the right one.')}>${mapPh(active)}</div>
          <div class="grid content-start gap-3" data-entity-list ${note('Company cards: name, role, address and contacts. Address, phone and email are only known for the Dubai company (from the design footer); the rest are to be supplied.')}>${entities.map(entityCard).join('')}</div>
        </div>
      </div>
    </section>

    <section id="history" class="wrap scroll-mt-24 py-14">
      <p class="eyebrow">Our history</p>
      <h2 class="mt-1 text-3xl font-semibold tracking-tight">From global trade to new possibilities.</h2>
      <p class="mt-2 max-w-2xl text-sub">A business built on international connections, evolving with the technology market and expanding into new opportunities.</p>
      <ol class="mt-10 grid gap-0 border-l-2 border-ink pl-8 md:mx-auto md:max-w-3xl" ${note('Full timeline: the homepage shows a summary; this is the complete history. Each milestone can carry an image. Two entries come from the About copy rather than the homepage timeline (tagged).')}>
        ${milestones
          .map(
            (m) => `<li class="relative pb-10 last:pb-0">
              <span class="absolute top-1.5 -left-[41px] size-4 rounded-full border-2 border-ink bg-white"></span>
              <div class="grid gap-4 sm:grid-cols-[1fr_160px]">
                <div><p class="text-2xl font-semibold">${m.year}</p><p class="mt-1 font-medium">${esc(m.title)} ${m.source ? '<span class="tbc ml-1">from About copy</span>' : ''}</p><p class="mt-1 text-sm text-sub">${esc(m.text)}</p></div>
                ${ph('Image', 'rounded-lg', '4 / 3')}
              </div>
            </li>`,
          )
          .join('')}
      </ol>
    </section>

    <section class="wrap pb-6">
      <div class="rounded-xl border-2 border-dashed border-ink p-6" ${note('Wireframe-only callout: content conflicts found across the approved copy. BMK to confirm before the build.')}>
        <p class="font-semibold">Content to confirm with BMK</p>
        <ul class="mt-3 grid gap-2 text-sm text-sub">${conflicts.map((c) => `<li class="flex gap-2"><span aria-hidden="true">–</span>${esc(c)}</li>`).join('')}</ul>
      </div>
    </section>

    <section class="wrap py-10">
      <div class="flex flex-col items-start justify-between gap-4 rounded-xl bg-wash p-8 sm:flex-row sm:items-center">
        <div><p class="text-xl font-semibold">Work with BMK</p><p class="mt-1 text-sub">Distribution, dealership, retail supply or something else.</p></div>
        <div class="flex flex-wrap gap-2"><a class="btn btn-ghost btn-sm" href="${href('/contact')}">Contact us</a><button type="button" class="btn btn-primary btn-sm" data-enquiry-type="">Make an enquiry</button></div>
      </div>
    </section>`,
    wire(root) {
      const select = (id) => {
        active = id;
        root.querySelectorAll('[data-pin] > span').forEach((s) => {
          const on = s.parentElement.dataset.pin === id;
          s.classList.toggle('bg-ink', on);
          s.classList.toggle('scale-150', on);
          s.classList.toggle('bg-sub', !on);
        });
        root.querySelectorAll('[data-entity]').forEach((c) => c.classList.toggle('border-ink', c.dataset.entity === id));
      };
      root.querySelectorAll('button[data-pin]').forEach((b) =>
        b.addEventListener('click', () => {
          select(b.dataset.pin);
          document.getElementById(b.dataset.pin)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }),
      );
      scrollToSection(params);
    },
  };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function renderFaq() {
  const item = (f, i) => `
    <details class="group border-b border-line" data-faq data-topic="${f.topic}" data-text="${esc((f.q + ' ' + (f.a || '')).toLowerCase())}">
      <summary class="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-medium">
        <span>${esc(f.q)}</span><span class="mt-1 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">${icons.close.replace('m5 5 10 10M15 5 5 15', 'M10 4v12M4 10h12')}</span>
      </summary>
      <div class="max-w-3xl pb-5 text-sub">${f.a ? esc(f.a) : `<span class="tbc">Answer to be supplied by BMK</span>`}</div>
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
      <div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="Topics" ${note('Topics filter the list. Admin can add, edit, delete and reorder FAQs and topics (per the scope).')}>
        <button type="button" class="chip" data-faq-topic="" aria-pressed="true">All <span class="count">${faqs.length}</span></button>
        ${faqTopics.map((t) => `<button type="button" class="chip" data-faq-topic="${t.id}" aria-pressed="false">${esc(t.name)} <span class="count">${faqs.filter((f) => f.topic === t.id).length}</span></button>`).join('')}
      </div>
      <div class="grid gap-12 lg:grid-cols-[1fr_300px]">
        <div ${note('Accordion: questions grouped under topic headings. Answers marked with a dashed box are still to be supplied by BMK; the rest are draft answers from the scope and approved copy.')}>
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
  let office = entities.find((e) => e.id === params.get('office'))?.id || 'bmk-middle-east';
  const details = (e) => `
    <p class="eyebrow">${esc(e.city)}</p>
    <p class="mt-1 text-lg font-semibold">${esc(e.name)}</p>
    <p class="mt-1 text-sm text-sub">${esc(e.role)}</p>
    <dl class="mt-4 grid gap-2 text-sm">
      <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Address</dt><dd>${e.address ? esc(e.address) : tbc()}</dd></div>
      <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Phone</dt><dd>${e.phone ? `<a class="underline" href="tel:${esc(e.phone.replace(/\s/g, ''))}">${esc(e.phone)}</a>` : tbc()}</dd></div>
      <div class="flex gap-3"><dt class="w-16 shrink-0 text-faint">Email</dt><dd>${e.email ? `<a class="underline" href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : tbc()}</dd></div>
    </dl>
    <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">Get directions ${icons.arrow}</span>`;

  return {
    title: 'Contact Us',
    html: `
    ${pageHead('Contact Us', 'Reach the right BMK Group company, or send us a message.', [['Home', '#/home'], ['Contact Us']])}
    <section class="wrap grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
      <div>
        <h2 class="text-xl font-semibold">Our offices</h2>
        <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Offices" ${note('Office selector: one tab per group company. Updates the details and the map. Links from About (“Contact this office”) open the matching tab.')}>
          ${entities.map((e) => `<button type="button" role="tab" class="chip" data-office="${e.id}" aria-pressed="${e.id === office}" aria-selected="${e.id === office}">${esc(e.city.split(',')[0])}</button>`).join('')}
        </div>
        <div class="mt-5 grid gap-5 rounded-xl border border-line p-5 sm:grid-cols-[1fr_1.1fr]">
          <div data-office-details>${details(entities.find((e) => e.id === office))}</div>
          <div class="ph rounded-lg" style="aspect-ratio:4/3" ${note('Google Maps embed (per the scope), centred on the selected office.')}><span data-map-label>Google Map · ${esc(entities.find((e) => e.id === office).city)}</span></div>
        </div>
      </div>
      <div class="rounded-xl border border-line p-6" data-contact-form-wrap ${note('Contact form with the fields listed in the scope: name, email, phone, subject or enquiry type, message. Submissions go to Enquiry Management.')}>
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
    <section class="wrap pb-6" ${note('Business enquiries: the same four types as the homepage, each opening the enquiry popup with its type selected.')}>
      <h2 class="mb-5 text-xl font-semibold">Business enquiries</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        ${enquiryTypes.map((t) => `<li><button type="button" class="card h-full w-full p-5 text-left" data-enquiry-type="${esc(t.type)}"><span class="flex items-center justify-between gap-3 font-semibold">${esc(t.type)} ${icons.arrow}</span><span class="mt-1.5 block text-sm text-sub">${esc(t.text)}</span></button></li>`).join('')}
      </ul>
    </section>`,
    wire(root) {
      root.querySelectorAll('[data-office]').forEach((b) =>
        b.addEventListener('click', () => {
          office = b.dataset.office;
          const e = entities.find((x) => x.id === office);
          root.querySelectorAll('[data-office]').forEach((x) => {
            x.setAttribute('aria-pressed', String(x === b));
            x.setAttribute('aria-selected', String(x === b));
          });
          root.querySelector('[data-office-details]').innerHTML = details(e);
          root.querySelector('[data-map-label]').textContent = `Google Map · ${e.city}`;
        }),
      );
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

