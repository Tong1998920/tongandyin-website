/*
  TONG YIN — shared site script.
  Intentionally small: it opens/closes the mobile navigation menu, and
  (on the homepage only) runs the artwork carousel. Nothing on this
  site depends on JavaScript to be usable — the carousel's first slide
  is plain, visible, working markup, and its <noscript> fallback in
  index.html hides the prev/next arrows so nothing dead is left on
  screen if JS can't run.
*/
(function () {
  // Homepage artwork carousel. One slide is shown at a time
  // (.carousel-slide.is-active); changing slides is a calm, sequential
  // cross-fade — the current slide fades out, then the next slide
  // fades in — never a slide/zoom/bounce. Each slide carries its own
  // caption and its own link (or no link, for a slide with no detail
  // page yet), so swapping slides never needs to touch any text.
  var carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  var track = carousel.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
  var prevBtn = carousel.querySelector('[data-carousel-prev]');
  var nextBtn = carousel.querySelector('[data-carousel-next]');
  if (!track || slides.length < 2) return;

  var current = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
  if (current < 0) current = 0;
  var animating = false;
  // Kept short and linear on purpose — a quick, light cut rather than
  // an animated fade, so prev/next feels immediate (see style.css,
  // .carousel-slide.is-active's transition). ~180-250ms reads as
  // "almost instantaneous" without an abrupt flash.
  var FADE_MS = 200;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function goTo(index) {
    if (index === current || animating) return;
    var from = slides[current];
    var to = slides[index];

    if (prefersReducedMotion()) {
      from.classList.remove('is-active', 'is-visible');
      to.classList.add('is-active', 'is-visible');
      current = index;
      return;
    }

    animating = true;
    from.classList.remove('is-visible'); // starts the fade-out

    window.setTimeout(function () {
      from.classList.remove('is-active');
      to.classList.add('is-active');
      // Force layout so the browser registers the "not yet visible"
      // state before is-visible is added, so the fade-in transitions
      // instead of snapping straight to opacity: 1.
      void to.offsetWidth;
      to.classList.add('is-visible');
      current = index;
      animating = false;
    }, FADE_MS);
  }

  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Keyboard: Left/Right anywhere on the page, as long as focus isn't
  // inside a text field (there isn't one on the homepage today, but
  // this keeps the behavior safe if that ever changes).
  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });

  // Touch swipe: a simple horizontal-distance check on the viewport,
  // not a drag-follows-finger interaction — kept restrained on
  // purpose, matching the calm cross-fade rather than a sliding feel.
  var touchStartX = null;
  var viewport = carousel.querySelector('.carousel-viewport');
  if (viewport) {
    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      var THRESHOLD = 40;
      if (dx <= -THRESHOLD) next();
      else if (dx >= THRESHOLD) prev();
    }, { passive: true });
  }
})();

(function () {
  // Single-work detail page carousel (see works/calling-a-deer-a-horse/
  // index.html) — same calm, fast cross-fade pattern as the homepage
  // carousel above, but its own separate instance: the prev/next
  // controls live in the left column, not beside the image, so they're
  // found by [data-work-prev]/[data-work-next] rather than being
  // adjacent DOM siblings. A no-op on every page that doesn't have a
  // [data-work-carousel] element.
  var carousel = document.querySelector('[data-work-carousel]');
  if (!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.work-carousel-slide'));
  var prevBtn = document.querySelector('[data-work-prev]');
  var nextBtn = document.querySelector('[data-work-next]');
  if (slides.length < 2) return;

  var current = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
  if (current < 0) current = 0;
  var animating = false;
  var FADE_MS = 200;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function goTo(index) {
    if (index === current || animating) return;
    var from = slides[current];
    var to = slides[index];

    if (prefersReducedMotion()) {
      from.classList.remove('is-active', 'is-visible');
      to.classList.add('is-active', 'is-visible');
      current = index;
      return;
    }

    animating = true;
    from.classList.remove('is-visible');

    window.setTimeout(function () {
      from.classList.remove('is-active');
      to.classList.add('is-active');
      void to.offsetWidth;
      to.classList.add('is-visible');
      current = index;
      animating = false;
    }, FADE_MS);
  }

  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
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
