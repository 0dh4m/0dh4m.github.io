/**
 * Copyright (C) 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved.
 * Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
 * Author: Adham Cherkaoui Eddeqaqi (0dh4m) <0dh4mm@gmail.com>
 * GitHub: https://github.com/0dh4m
 */

/* Scroll progress and subtle scroll-driven motion for both pages. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const hero = document.querySelector('.hero');
  const blobs = [...document.querySelectorAll('.hero-blob, .hero-visual')];

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    if (hero && blobs.length) {
      const center = window.scrollY + window.innerHeight / 2;
      const strength = Math.max(-1, Math.min(1, (center - hero.offsetTop) / Math.max(1, hero.offsetHeight)));
      blobs.forEach((el, i) => {
        const direction = i % 2 ? -1 : 1;
        el.style.setProperty('--scroll-shift', `${direction * strength * (i ? 34 : 58)}px`);
      });
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
