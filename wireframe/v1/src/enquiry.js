import { esc, icons, note } from './ui.js';
import { refreshNotes } from './notes.js';

const TYPES = ['Distribution Enquiry', 'Dealership Enquiry', 'Retail Sales Enquiry', 'General Enquiry'];

/** Enquiry popup. With a product, it's pre-filled so BMK knows what the lead is about. */
export function openEnquiry({ product = null, type = '' } = {}) {
  const host = document.getElementById('overlays');
  host.innerHTML = `
  <div class="fixed inset-0 z-[80] grid place-items-end sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="enq-title">
    <div class="scrim" data-close></div>
    <div class="relative max-h-[92svh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 sm:max-w-lg sm:rounded-2xl" ${note('Enquiry popup (shared component). Opened from a product it carries that product, so the lead arrives with context, and there is no enquiry type to choose. Elsewhere the enquiry type maps to the four types in the scope; submissions go to Enquiry Management in the admin.')}>
      <div class="mb-5 flex items-start justify-between gap-4">
        <div><p class="eyebrow">Business enquiry</p><h2 id="enq-title" class="mt-1 text-xl font-semibold">${product ? 'Enquire about this product' : 'Make an enquiry'}</h2></div>
        <button type="button" data-close class="grid size-9 shrink-0 place-items-center rounded-full hover:bg-wash" aria-label="Close">${icons.close}</button>
      </div>
      <form class="grid gap-4" data-form>
        ${
          product
            ? `<div class="flex items-center gap-3 rounded-lg border border-line p-3"><div class="ph size-12 shrink-0 rounded" style="aspect-ratio:1"></div><div class="min-w-0"><p class="text-xs text-faint">Product</p><p class="truncate text-sm font-semibold">${esc(product.name)}</p></div></div>`
            : ''
        }
        ${
          product
            ? '' // product enquiries don't ask for a type: the product is the context
            : `<label class="grid gap-1.5 text-sm"><span class="font-medium">Enquiry type</span>
          <select required class="rounded-lg border border-line px-3 py-2.5">${['', ...TYPES].map((t) => `<option value="${esc(t)}" ${t === type ? 'selected' : ''} ${t ? '' : 'disabled'}>${t || 'Select a type'}</option>`).join('')}</select>
        </label>`
        }
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Full name</span><input required class="rounded-lg border border-line px-3 py-2.5" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Company</span><input class="rounded-lg border border-line px-3 py-2.5" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Email</span><input type="email" required class="rounded-lg border border-line px-3 py-2.5" /></label>
          <label class="grid gap-1.5 text-sm"><span class="font-medium">Phone</span><input type="tel" class="rounded-lg border border-line px-3 py-2.5" /></label>
        </div>
        <label class="grid gap-1.5 text-sm"><span class="font-medium">Country</span><input class="rounded-lg border border-line px-3 py-2.5" /></label>
        <label class="grid gap-1.5 text-sm"><span class="font-medium">Message</span><textarea rows="3" class="rounded-lg border border-line px-3 py-2.5">${product ? `I'd like more information about the ${esc(product.name)}.` : ''}</textarea></label>
        <button class="btn btn-primary mt-1 w-full">Send enquiry</button>
        <p class="text-center text-xs text-faint">Wireframe: nothing is sent.</p>
      </form>
    </div>
  </div>`;
  document.body.classList.add('no-scroll');
  const close = () => {
    host.innerHTML = '';
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  document.addEventListener('keydown', onKey);
  host.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  host.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.outerHTML = `<div class="grid justify-items-center gap-3 py-8 text-center"><div class="grid size-12 place-items-center rounded-full border-2 border-ink text-xl">✓</div><p class="font-semibold">Thanks, we’ve received your enquiry</p><p class="text-sm text-sub">The relevant BMK team will reply by email. (Success state.)</p><button type="button" class="btn btn-ghost btn-sm mt-2" data-done>Close</button></div>`;
    host.querySelector('[data-done]').addEventListener('click', close);
  });
  refreshNotes();
}
