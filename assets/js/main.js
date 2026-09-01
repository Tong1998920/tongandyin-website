/*
  TONG YIN — shared site script.
  Intentionally small: it opens/closes the mobile navigation menu, and
  (on the homepage only) reveals the hero image on load. Nothing on
  this site depends on JavaScript to be usable — the hero has a
  <noscript> fallback in index.html so it's never left invisible.
*/
(function () {
  // Homepage hero reveal: add .is-loaded once the page has settled,
  // so the CSS transition in style.css (.hero-wrap) can run. Runs on
  // window 'load' (matching the reference site's own timing), with an
  // immediate check in case the event already fired before this ran.
  var heroWrap = document.querySelector('.hero-wrap');
  if (heroWrap) {
    var reveal = function () { heroWrap.classList.add('is-loaded'); };
    if (document.readyState === 'complete') {
      reveal();
    } else {
      window.addEventListener('load', reveal);
    }
  }
})();

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.primary-nav');
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  }

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = 'Close';
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.contains('is-open');
    if (isOpen) { closeNav(); } else { openNav(); }
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
})();

(function () {
  // Works submenu: on the mobile full-screen menu the submenu is
  // always expanded in CSS (no hover needed there). This block only
  // handles the in-between case — a touch device at a wide-enough
  // viewport that it still gets the desktop hover-style header. A
  // finger can't hover, so give the "Works" trigger a first tap that
  // opens the submenu instead of navigating, and a second tap (or a
  // tap elsewhere) that proceeds normally / closes it.
  var hasSubmenuItems = document.querySelectorAll('.primary-nav li.has-submenu');
  if (!hasSubmenuItems.length) return;
  var isCoarsePointer = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isCoarsePointer) return;

  hasSubmenuItems.forEach(function (item) {
    var trigger = item.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      // Mobile overlay: the submenu is already always-visible via CSS,
      // so the trigger should behave like a normal link there.
      if (window.matchMedia('(max-width: 700px)').matches) return;

      if (!item.classList.contains('is-open')) {
        e.preventDefault();
        hasSubmenuItems.forEach(function (other) { other.classList.remove('is-open'); });
        item.classList.add('is-open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    hasSubmenuItems.forEach(function (item) {
      if (!item.contains(e.target)) item.classList.remove('is-open');
    });
  });
})();

(function () {
  // Language toggle: structure only, per the current brief — no
  // Chinese content has been supplied yet, so this just tracks which
  // option is selected (aria-pressed) and is a no-op otherwise. Once
  // Chinese copy exists, swap the no-op branch below for the real
  // content switch (e.g. toggling a `lang-zh` class on <body> and
  // showing/hiding matching [data-lang="zh"] content blocks).
  var options = document.querySelectorAll('.lang-option');
  if (!options.length) return;

  options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      options.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      // No Chinese content exists yet — English stays the functional
      // default regardless of which option is selected.
    });
  });
})();
