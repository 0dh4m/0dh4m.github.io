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
    // Preview CV follows active language
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


/* ==========================================================================
   SUPERCHARGED CANVAS PARTICLE NETWORK & TELEMETRY TERMINAL INTERACTION
   Authored by 0dh4m · 60FPS Hardware-Accelerated Physics
   ========================================================================== */
(function() {
  // 1. High Performance Background Particle Constellation
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
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
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(129, 140, 248, '
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion / interaction
        if (mouse.x !== null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2;
            p.y -= (dy / dist) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.7)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 2. Interactive Telemetry Terminal Simulator
  const liveTyping = document.getElementById('terminalLiveTyping');
  const termBody = document.getElementById('telemetryBody');
  const termBtns = document.querySelectorAll('.term-btn');

  const cmdOutputs = {
    tech_stack: [
      { text: "Executing: query_stack_manifest()", color: "text-info" },
      { text: "[RUNTIME] C# 12 (.NET 8) · Node.js v20.x LTS · PHP 8.2 OOP", color: "text-light" },
      { text: "[SYSTEMS] Windows WASAPI Audio Subsystem · WinRT BLE GATT", color: "text-light" },
      { text: "[DATABASE] MySQL 8.0 (ACID Row-Locking) · SQLite · Redis", color: "text-warning" },
      { text: "[FRONTEND] Modern Vanilla ES6+ · Tailwind CSS · Bootstrap 5", color: "text-success" }
    ],
    benchmarks: [
      { text: "Benchmarking core subsystems...", color: "text-info" },
      { text: "-> Watch Together WebSocket Sync Drift: 42ms (Target: <1500ms) [PASS]", color: "text-success" },
      { text: "-> DualLumi WinRT BLE Command RTT: 6.8ms [PASS]", color: "text-success" },
      { text: "-> DualAudio WASAPI Ringbuffer Latency: 18ms [PASS]", color: "text-success" },
      { text: "-> Hotel ERP Concurrency Deadlocks: 0 (Tested with 50 parallel PDO transactions) [PASS]", color: "text-success" }
    ],
    github_status: [
      { text: "Connecting to api.github.com/users/0dh4m/repos...", color: "text-info" },
      { text: "[OK] 10 Public Repositories synchronized on GitHub.", color: "text-success" },
      { text: "-> watch-together, happy-gym-pro, hotel-management-system, movies-streaming-platform", color: "text-light" },
      { text: "-> duallumi-pro, dualaudio-sync, tapocam-viewer, radio-maroc-live, cyberops-academy, portfolio", color: "text-light" },
      { text: "Total commits: 250+ | Status: 100% Green CI & Passing Tests", color: "text-primary" }
    ],
    whoami: [
      { text: "User: Adham Cherkaoui Eddeqaqi (@0dh4m)", color: "text-info" },
      { text: "Role: Full-Stack & Desktop Software Developer", color: "text-light" },
      { text: "Location: Rabat / Salé, Morocco | Status: Ready for Hire", color: "text-warning" },
      { text: "Email: 0dh4mm@gmail.com | Phone: +212 625-632628", color: "text-success" },
      { text: "GitHub: https://github.com/0dh4m", color: "text-primary" }
    ]
  };

  if (termBtns.length && liveTyping && termBody) {
    termBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmdKey = btn.getAttribute('data-cmd');
        const outputLines = cmdOutputs[cmdKey];
        if (!outputLines) return;

        // Append user prompt
        const promptDiv = document.createElement('div');
        promptDiv.className = 'term-line mt-2';
        promptDiv.innerHTML = `<span class="term-prompt">0dh4m@sys:~$</span> <span class="term-cmd">--${cmdKey}</span>`;
        termBody.appendChild(promptDiv);

        // Append output lines
        outputLines.forEach((line, idx) => {
          setTimeout(() => {
            const outDiv = document.createElement('div');
            outDiv.className = 'term-line';
            outDiv.innerHTML = `<span class="term-out ${line.color}">${line.text}</span>`;
            termBody.appendChild(outDiv);
            termBody.scrollTop = termBody.scrollHeight;
          }, (idx + 1) * 120);
        });
      });
    });
  }
})();
