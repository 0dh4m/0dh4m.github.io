/* ==========================================================================
   Adham Cherkaoui Eddeqaqi — Portfolio Scripts
   Dark/Light theme · EN/FR i18n · Typewriter · Scroll reveals
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;

  /* ===================== THEME (dark / light) ===================== */
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
  }
  applyTheme(
    localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ===================== I18N (EN / FR) ===================== */
  const bsLink = document.getElementById('bootstrap-css');
  const BS_LTR = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  const langLabel = document.getElementById('langLabel');
  const langNames = { en: 'EN', fr: 'FR' };
  let currentLang = 'en';

  function t(key) {
    const val = key.split('.').reduce((obj, k) => (obj || {})[k], translations[currentLang]);
    return typeof val === 'string' ? val : '';
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-ph'));
      if (v) el.setAttribute('placeholder', v);
    });
  }

  function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);

    root.setAttribute('lang', lang);
    root.setAttribute('dir', 'ltr');
    if (bsLink) bsLink.setAttribute('href', BS_LTR);
    if (langLabel) langLabel.textContent = langNames[lang];

    applyTranslations();
    setTypedWords(translations[lang].hero_titles || []);

    const previewCvBtn = document.getElementById('previewCvBtn');
    if (previewCvBtn) {
      previewCvBtn.href = lang === 'fr'
        ? 'assets/cv/Adham-CV-FR.pdf'
        : 'assets/cv/Adham-CV-EN.pdf';
    }
    const cvLink = document.getElementById('cvDownload');
    if (cvLink) {
      cvLink.href = lang === 'fr'
        ? 'assets/cv/Adham-CV-FR.pdf'
        : 'assets/cv/Adham-CV-EN.pdf';
    }
  }

  document.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      setLanguage(item.dataset.lang);
    });
  });

  /* ===================== TYPEWRITER ===================== */
  const typedEl = document.getElementById('typed');
  let words = [], wIdx = 0, cIdx = 0, deleting = false, typedTimer = null;

  function setTypedWords(newWords) {
    if (!typedEl) return;
    words = newWords;
    wIdx = 0;
    cIdx = 0;
    deleting = false;
    clearTimeout(typedTimer);
    type();
  }
  function type() {
    if (!words.length || !typedEl) return;
    const word = words[wIdx];
    cIdx += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, cIdx);

    let delay = deleting ? 40 : 90;
    if (!deleting && cIdx === word.length) { delay = 1800; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; delay = 350; }
    typedTimer = setTimeout(type, delay);
  }

  // Init language (this also starts the typewriter)
  setLanguage(localStorage.getItem('portfolio-lang') || 'en');

  /* ===================== NAV (active link + mobile close) ===================== */
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const backTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY + 140;
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    navLinks.forEach(a => a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id));
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navMenu = document.getElementById('navMenu');
  navLinks.forEach(a => a.addEventListener('click', () => {
    const c = window.bootstrap && bootstrap.Collapse.getInstance(navMenu);
    if (c && navMenu.classList.contains('show')) c.hide();
  }));

  // Neutralize placeholder links
  document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* ===================== SCROLL REVEAL ===================== */
  const revealEls = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Safety net: never leave a section invisible if the observer is skipped
  // (hash navigation, print, unusual embedded browsers).
  setTimeout(() => revealEls.forEach(el => el.classList.add('visible')), 2500);

  /* ===================== BACK TO TOP ===================== */
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===================== CONTACT FORM (front-end validation only) ===================== */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      e.stopPropagation();
      if (form.checkValidity()) {
        form.reset();
        form.classList.remove('was-validated');
        if (success) {
          success.classList.remove('d-none');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => success.classList.add('d-none'), 8000);
        }
      } else {
        form.classList.add('was-validated');
      }
    });
  }

  /* ===================== FOOTER YEAR ===================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   ZELLIGE CONSTELLATION CANVAS
   Majorelle · zellige · saffron nodes, subtle links, reduced-motion aware
   ========================================================================== */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (reduced) drawFrame();
  });

  const palette = [
    'rgba(47, 91, 255, ',
    'rgba(18, 181, 165, ',
    'rgba(232, 180, 74, '
  ];

  const count = Math.min(Math.floor((width * height) / 26000), 46);
  const particles = [];
  const mouse = { x: null, y: null, radius: 130 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.7,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.6;
            p.y -= (dy / dist) * force * 1.6;
          }
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.65)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(18, 181, 165, ${0.13 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    if (!document.hidden) drawFrame();
    requestAnimationFrame(loop);
  }

  if (reduced) {
    drawFrame();
  } else {
    requestAnimationFrame(loop);
  }
})();
