/* ===================================================================
   Simplifica Contábil — interactivity
   =================================================================== */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year in footer ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = $('#siteHeader');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const toggle = $('#navToggle');
  const nav = $('#siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    // Close on link click
    $$('#siteNav a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal-on-scroll animation ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Counters ---------- */
  const counters = $$('.stat-value');
  if ('IntersectionObserver' in window && counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const fmt = new Intl.NumberFormat('pt-BR');
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(target * eased);
        el.textContent = fmt.format(current) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => {
      el.textContent = (el.dataset.count || '') + (el.dataset.suffix || '');
    });
  }

  /* ---------- Phone mask (BR) ---------- */
  const tel = $('input[name="telefone"]');
  if (tel) {
    tel.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
      } else {
        v = v.replace(/^(\d{0,2}).*/, '($1');
      }
      e.target.value = v;
    });
  }

  /* ---------- Contact form (client-side only) ---------- */
  const form = $('#contactForm');
  const feedback = $('#formFeedback');
  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      const data = Object.fromEntries(new FormData(form).entries());
      const errors = [];

      if (!data.nome || data.nome.trim().length < 2) errors.push('informe seu nome');
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('e‑mail válido');

      if (errors.length) {
        feedback.classList.add('error');
        feedback.textContent = 'Por favor, ' + errors.join(' e ') + '.';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      // Simulated submission. Conecte aqui seu endpoint, FormSubmit, EmailJS etc.
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalLabel;
        feedback.classList.add('success');
        feedback.textContent = 'Recebemos sua mensagem! Em até 1 dia útil entraremos em contato.';
        form.reset();
      }, 900);
    });
  }

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  // Nothing extra needed — using scroll-margin via header offset isn't required
  // because we rely on CSS scroll-behavior. Keeping hook for future tweaks.
})();
