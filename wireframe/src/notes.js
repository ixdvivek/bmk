// Numbered annotation markers for client walkthroughs.
// Any element with data-note="…" gets a numbered badge; clicking it shows the note.
let pop;

function closePop() {
  pop?.remove();
  pop = null;
}

export function refreshNotes() {
  document.querySelectorAll('.note-badge').forEach((b) => b.remove());
  closePop();
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

export function initNotes() {
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.note-badge, .note-pop')) closePop();
  });
  window.addEventListener('resize', closePop);
}
