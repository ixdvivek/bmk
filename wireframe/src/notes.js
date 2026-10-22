// Numbered annotation markers for client walkthroughs.
// Any element with data-note="…" gets a numbered badge; clicking it shows the note.
let pop;

function closePop() {
  pop?.remove();
  pop = null;
}

export function refreshNotes() {
  document.querySelectorAll('.note-badge, .change-badge').forEach((b) => b.remove());
  closePop();
  refreshChanges();
  let n = 0;
  document.querySelectorAll('[data-note]').forEach((el) => {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return; // hidden
    n++;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'note-badge';
    b.textContent = n;
    b.setAttribute('aria-label', `Note ${n}`);
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const same = pop?.dataset.for === String(n);
      closePop();
      if (same) return;
      pop = document.createElement('div');
      pop.className = 'note-pop';
      pop.dataset.for = String(n);
      pop.innerHTML = `<strong class="mr-1">${n}.</strong>${el.dataset.note.replace(/&/g, '&amp;').replace(/</g, '&lt;')}`;
      document.body.appendChild(pop);
      const r = b.getBoundingClientRect();
      const w = pop.offsetWidth;
      pop.style.left = `${Math.max(16, Math.min(window.scrollX + r.left, window.scrollX + innerWidth - w - 16))}px`;
      pop.style.top = `${window.scrollY + r.bottom + 8}px`;
      if (getComputedStyle(el).position === 'fixed' || el.closest('header, #drawer, [role="dialog"]')) {
        pop.style.position = 'fixed';
        pop.style.left = `${Math.max(16, Math.min(r.left, innerWidth - w - 16))}px`;
        pop.style.top = `${r.bottom + 8}px`;
      }
    });
    el.appendChild(b);
  });
  return n;
}

/** Yellow "v2" markers on sections that changed since the previous version. */
function refreshChanges() {
  let n = 0;
  document.querySelectorAll('[data-change]').forEach((el) => {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
    n++;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'change-badge';
    b.innerHTML = `v2 <span>${n}</span>`;
    b.setAttribute('aria-label', `Change ${n} in v2`);
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = `c${n}`;
      const same = pop?.dataset.for === key;
      closePop();
      if (same) return;
      pop = document.createElement('div');
      pop.className = 'note-pop change-pop';
      pop.dataset.for = key;
      pop.innerHTML = `<strong class="mr-1">Changed in v2:</strong>${el.dataset.change.replace(/&/g, '&amp;').replace(/</g, '&lt;')}`;
      document.body.appendChild(pop);
      const r = b.getBoundingClientRect();
      const w = pop.offsetWidth;
      const fixed = getComputedStyle(el).position === 'fixed' || el.closest('header, #drawer, [role="dialog"]');
      pop.style.position = fixed ? 'fixed' : 'absolute';
      pop.style.left = `${Math.max(16, Math.min((fixed ? 0 : scrollX) + r.left, (fixed ? 0 : scrollX) + innerWidth - w - 16))}px`;
      pop.style.top = `${(fixed ? 0 : scrollY) + r.bottom + 8}px`;
    });
    el.appendChild(b);
  });
  return n;
}

export function initNotes() {
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.note-badge, .note-pop, .change-badge')) closePop();
  });
  window.addEventListener('resize', closePop);
}
