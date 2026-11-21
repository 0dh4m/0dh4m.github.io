/* Lightweight page transition shared by index.html and projects.html. */
(function () {
  'use strict';
  const page = document.body;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  page.classList.add('page-enter');
  requestAnimationFrame(() => page.classList.add('page-enter-ready'));
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname || url.hash) return;
    if (link.target && link.target !== '_self') return;
    event.preventDefault();
    page.classList.add('page-leave');
    window.setTimeout(() => { window.location.href = url.href; }, 320);
  });
})();
