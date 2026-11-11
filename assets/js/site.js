/* ==========================================================================
   PARALLAX — shared interaction layer
   Vanilla JS. No dependencies.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Mobile navigation
     ------------------------------------------------------------------ */
  const nav = $('#nav');
  const menuToggle = $('#menu-toggle');

  function closeNav() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('no-scroll');
  }

  if (nav && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    $$('a', nav).forEach((link) => link.addEventListener('click', closeNav));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ------------------------------------------------------------------
     3. Pixel starfield
     ------------------------------------------------------------------ */
  const starCanvas = $('#starfield');
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    let stars = [];
    let animationId = null;
    let width = 0;
    let height = 0;
    let lastFrame = 0;

    const palette = ['#f2e6c9', '#f0c05a', '#78b5c4', '#a184b8', '#e3d2ad'];

    function buildStars() {
      const rect = starCanvas.getBoundingClientRect();
      width = Math.max(80, Math.ceil(rect.width / 4));
      height = Math.max(80, Math.ceil(rect.height / 4));
      starCanvas.width = width;
      starCanvas.height = height;
      ctx.imageSmoothingEnabled = false;
      const count = Math.max(55, Math.floor((width * height) / 150));
      stars = Array.from({ length: count }, () => ({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        size: Math.random() > 0.86 ? 2 : 1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.018,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.35 + Math.random() * 0.6
      }));
    }

    function drawStars(time) {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const twinkle = reduceMotion ? 1 : 0.55 + Math.sin(star.phase + time * star.speed) * 0.45;
        ctx.globalAlpha = Math.max(0.12, star.alpha * twinkle);
        ctx.fillStyle = star.color;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        if (star.size === 2 && star.phase > 4.8) {
          ctx.globalAlpha *= 0.55;
          ctx.fillRect(star.x - 1, star.y, 1, 1);
          ctx.fillRect(star.x + 2, star.y, 1, 1);
          ctx.fillRect(star.x, star.y - 1, 1, 1);
          ctx.fillRect(star.x, star.y + 2, 1, 1);
        }
      });
      ctx.globalAlpha = 1;
    }

    function loop(time) {
      if (time - lastFrame > 80) {
        drawStars(time);
        lastFrame = time;
      }
      animationId = window.requestAnimationFrame(loop);
    }

    buildStars();
    drawStars(0);
    if (!reduceMotion) animationId = window.requestAnimationFrame(loop);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildStars();
        drawStars(0);
      }, 120);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!document.hidden && !reduceMotion && !animationId) {
        animationId = window.requestAnimationFrame(loop);
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Video preview controls
     ------------------------------------------------------------------ */
  function setupVideo(buttonId, videoId) {
    const button = $('#' + buttonId);
    const video = $('#' + videoId);
    if (!button || !video) return;

    if (reduceMotion) {
      video.pause();
      button.textContent = '▶';
      button.setAttribute('aria-label', 'Play preview');
    }

    const sync = () => {
      const paused = video.paused;
      button.textContent = paused ? '▶' : 'II';
      button.setAttribute('aria-label', paused ? 'Play preview' : 'Pause preview');
    };

    button.addEventListener('click', () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    sync();
  }

  setupVideo('screen-play', 'hero-video');
  setupVideo('case-play', 'case-video');

  /* ------------------------------------------------------------------
     5. Scroll reveal
     ------------------------------------------------------------------ */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 });
    revealEls.forEach((el) => observer.observe(el));
    window.setTimeout(() => revealEls.forEach((el) => el.classList.add('is-in')), 3000);
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------
     6. Toast + clipboard
     ------------------------------------------------------------------ */
  const toast = $('#toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
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
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    area.remove();
    return ok;
  }

  function briefFor(slot, role) {
    return `PARALLAX — SUBMISSION BRIEF / SLOT ${slot}
Role focus: ${role}

1. DISPLAY NAME:
2. ONE-LINE PRACTICE:
3. BIO (120 words):
4. PROJECT TITLE:
5. YEAR / MEDIUM:
6. THREE IMAGES (1600px wide, JPG/WebP):
7. PROJECT STATEMENT (150 words):
8. TOOLS / CREDITS:
9. LINKS:

Return this to the group lead. The layout will handle the rest.
— PARALLAX / 4P`;
  }

  $$('a[data-copy]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const value = link.getAttribute('data-copy');
      const ok = await copyText(value);
      showToast(ok ? 'Copied: ' + value : 'Copy failed — select the email manually.');
    });
  });

  /* ------------------------------------------------------------------
     7. Slot dialog
     ------------------------------------------------------------------ */
  const slotDialog = $('#slot-dialog');
  const dialogSlot = $('#dialog-slot');
  const dialogRole = $('#dialog-role');
  const dialogStatus = $('#dialog-status');
  const dialogCopy = $('#dialog-copy');
  let activeSlot = '02';
  let activeRole = 'Research & Writing';
  let dialogTrigger = null;

  function openSlotDialog(slot, role, trigger) {
    if (!slotDialog) return;
    activeSlot = slot || '02';
    activeRole = role || 'Open role';
    dialogSlot.textContent = activeSlot;
    dialogRole.textContent = activeRole + ' / TBA';
    if (dialogStatus) dialogStatus.textContent = '';
    dialogTrigger = trigger || null;
    if (typeof slotDialog.showModal === 'function') {
      if (!slotDialog.open) slotDialog.showModal();
    } else {
      slotDialog.setAttribute('open', '');
    }
    document.body.classList.add('no-scroll');
  }

  function closeSlotDialog() {
    if (!slotDialog || !slotDialog.open) return;
    slotDialog.close();
  }

  $$('[data-slot]').forEach((trigger) => {
    trigger.addEventListener('click', async (event) => {
      const slot = trigger.getAttribute('data-slot');
      const role = trigger.getAttribute('data-role') || 'Open role';

      if (trigger.hasAttribute('data-copy-brief') && !trigger.closest('#slot-dialog')) {
        event.preventDefault();
        const ok = await copyText(briefFor(slot === '00' ? '02–04' : slot, slot === '00' ? 'All open roles' : role));
        showToast(ok ? 'Submission brief copied.' : 'Copy failed — open a slot to read the brief.');
        return;
      }

      event.preventDefault();
      openSlotDialog(slot, role, trigger);
    });
  });

  if (slotDialog) {
    const closeBtn = $('#dialog-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSlotDialog);
    slotDialog.addEventListener('click', (event) => {
      if (event.target === slotDialog) closeSlotDialog();
    });
    slotDialog.addEventListener('close', () => {
      document.body.classList.remove('no-scroll');
      if (dialogTrigger) dialogTrigger.focus();
    });
  }

  if (dialogCopy) {
    dialogCopy.addEventListener('click', async () => {
      const ok = await copyText(briefFor(activeSlot, activeRole));
      if (dialogStatus) dialogStatus.textContent = ok ? 'BRIEF COPIED TO CLIPBOARD.' : 'COPY FAILED — SELECT THE TEXT MANUALLY.';
    });
  }

  /* ------------------------------------------------------------------
     8. Works filters
     ------------------------------------------------------------------ */
  const filters = $$('.filter');
  const workCards = $$('.work-card');
  if (filters.length) {
    filters.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filters.forEach((other) => {
          const active = other === button;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });
        workCards.forEach((card) => {
          const show = filter === 'all' || card.getAttribute('data-status') === filter;
          card.hidden = !show;
          if (show) card.classList.add('is-in');
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     9. Local clock (Asia/Manila)
     ------------------------------------------------------------------ */
  function updateClock() {
    const clocks = $$('[data-clock]');
    if (!clocks.length) return;
    let time = '--:--';
    try {
      time = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
    } catch (error) {
      time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    clocks.forEach((clock) => {
      if (clock.firstChild && clock.firstChild.nodeType === 3) {
        clock.firstChild.nodeValue = time;
      } else {
        clock.insertBefore(document.createTextNode(time), clock.firstChild);
      }
    });
  }

  updateClock();
  window.setInterval(updateClock, 30000);

  /* ------------------------------------------------------------------
     10. Contact form (prototype)
     ------------------------------------------------------------------ */
  const contactForm = $('#contact-form');
  if (contactForm) {
    const errorBox = $('#contact-error');
    const success = $('#contact-success');
    const formBody = $('#contact-form-body');
    const messagePreview = $('#success-message');
    const mailto = $('#mailto-link');
    const copyMessage = $('#copy-message');
    const recipient = 'hello@parallax.studio';

    contactForm.addEventListener('input', (event) => {
      if (errorBox) errorBox.hidden = true;
      if (event.target.matches('input, textarea, select')) event.target.removeAttribute('aria-invalid');
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('#contact-name').value.trim();
      const email = $('#contact-email').value.trim();
      const subject = $('#contact-subject').value;
      const message = $('#contact-message').value.trim();

      const invalid = [];
      if (name.length < 2) invalid.push($('#contact-name'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.push($('#contact-email'));
      if (message.length < 10) invalid.push($('#contact-message'));

      if (invalid.length) {
        if (errorBox) {
          errorBox.hidden = false;
          errorBox.textContent = 'Please fill in your name, a valid email, and a message of at least 10 characters.';
        }
        invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
        invalid[0].focus();
        return;
      }

      const composed = `FROM: ${name} <${email}>\nSUBJECT: ${subject}\n\n${message}\n\n— Sent from the PARALLAX mailbox.`;
      if (messagePreview) messagePreview.textContent = composed;
      if (mailto) {
        mailto.href = `mailto:${recipient}?subject=${encodeURIComponent('[PARALLAX] ' + subject)}&body=${encodeURIComponent(composed)}`;
      }
      if (formBody) formBody.hidden = true;
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
      showToast('Message queued. The prototype does not send it automatically.');
    });

    if (copyMessage && messagePreview) {
      copyMessage.addEventListener('click', async () => {
        const ok = await copyText(messagePreview.textContent);
        showToast(ok ? 'Message copied. Paste it into your mail app.' : 'Copy failed — select the text manually.');
      });
    }

    const reset = $('#contact-reset');
    if (reset) {
      reset.addEventListener('click', () => {
        contactForm.reset();
        if (success) success.classList.remove('is-visible');
        if (formBody) formBody.hidden = false;
        if (errorBox) errorBox.hidden = true;
        const first = $('#contact-name');
        if (first) first.focus();
      });
    }
  }

  /* ------------------------------------------------------------------
     11. Small utility: current year in footer if marked
     ------------------------------------------------------------------ */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
