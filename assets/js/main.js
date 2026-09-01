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
