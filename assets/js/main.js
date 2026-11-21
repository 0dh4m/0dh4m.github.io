/* ==========================================================================
   Adham Cherkaoui Eddeqaqi — Portfolio Scripts
   Dark/Light theme · EN/FR i18n · Typewriter · Scroll reveals
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;

  /* ===================== THEME (dark / light) ===================== */
  const themeBtn  = document.getElementById('themeToggle');
  const themeIcon = themeBtn.querySelector('i');

  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
  }
  applyTheme(
    localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  themeBtn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ===================== I18N (EN / FR) ===================== */
  const bsLink   = document.getElementById('bootstrap-css');
  const BS_LTR   = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
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
    bsLink.setAttribute('href', BS_LTR);
    langLabel.textContent = langNames[lang];

    applyTranslations();
    setTypedWords(translations[lang].hero_titles || []);

    // Download CV follows the active language (EN / FR PDF)
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
    wIdx = 0; cIdx = 0; deleting = false;
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
    else if (deleting && cIdx === 0)       { deleting = false; wIdx = (wIdx + 1) % words.length; delay = 350; }
    typedTimer = setTimeout(type, delay);
  }

  // Init language (this also starts the typewriter)
  setLanguage(localStorage.getItem('portfolio-lang') || 'en');

  /* ===================== NAV (active link + mobile close) ===================== */
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const backTop  = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    navLinks.forEach(a => a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id));
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Close the mobile menu after clicking a link
  const navMenu = document.getElementById('navMenu');
  navLinks.forEach(a => a.addEventListener('click', () => {
    const c = bootstrap.Collapse.getInstance(navMenu);
    if (c && navMenu.classList.contains('show')) c.hide();
  }));

  // Neutralize placeholder links (project demo/code buttons)
  document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* ===================== SCROLL REVEAL + SKILL BARS ===================== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        en.target.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.progress + '%'; });
        io.unobserve(en.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ===================== BACK TO TOP ===================== */
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===================== CONTACT FORM (front-end demo) ===================== */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      e.stopPropagation();
      if (form.checkValidity()) {
        form.reset();
        form.classList.remove('was-validated');
        success.classList.remove('d-none');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => success.classList.add('d-none'), 6000);
      } else {
        form.classList.add('was-validated');
      }
    });
  }

  /* ===================== FOOTER YEAR ===================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
