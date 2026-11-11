/* ==========================================================================
   PARALLAX / WIREFRAME — tiny prototype behaviours
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* Annotation toggle */
  const notesToggle = $('#notes-toggle');
  if (notesToggle) {
    notesToggle.addEventListener('click', () => {
      const hidden = document.body.classList.toggle('notes-off');
      notesToggle.setAttribute('aria-pressed', String(!hidden));
      notesToggle.textContent = hidden ? 'ANNOTATIONS: OFF' : 'ANNOTATIONS: ON';
    });
  }

  /* Toast */
  const toast = $('#wf-toast');
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Fall through.
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
    area.remove();
    return ok;
  }

  const brief = `PARALLAX — WIREFRAME SUBMISSION BRIEF

SLOT: 02–04
1. DISPLAY NAME
2. ROLE / DISCIPLINE
3. 120-WORD BIO
4. PROJECT TITLE
5. YEAR / MEDIUM
6. THREE IMAGES (1600px wide, JPG/WebP)
7. 150-WORD PROJECT STATEMENT
8. TOOLS / CREDITS
9. LINKS

This is a structural wireframe. Replace the dashed cards with real content;
keep the sizing and spacing intact.`;

  const copyBrief = $('#copy-brief');
  if (copyBrief) {
    copyBrief.addEventListener('click', async () => {
      const ok = await copyText(brief);
      showToast(ok ? 'Brief template copied.' : 'Copy failed — select the text manually.');
    });
  }

  /* Works filter */
  const filters = $$('.filter');
  const cards = $$('.work-card');
  if (filters.length && cards.length) {
    filters.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filters.forEach((other) => {
          const active = other === button;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });
        cards.forEach((card) => {
          const status = card.getAttribute('data-status');
          card.hidden = !(filter === 'all' || filter === status);
        });
      });
    });
  }

  /* Contact form prototype */
  const form = $('#wf-contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = $('#form-status');
      if (status) {
        status.textContent = 'PROTOTYPE ONLY — NO MESSAGE SENT. FORM BEHAVIOUR IS SHOWN IN THE FINAL SITE.';
      }
      showToast('Prototype form: nothing was sent.');
    });
  }
})();
