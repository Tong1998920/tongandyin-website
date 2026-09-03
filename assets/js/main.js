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
  // carousel above, but its own separate instance. A no-op on every
  // page that doesn't have a [data-work-carousel] element.
  //
  // Navigation is the artwork IMAGE itself: hovering the left half of
  // the currently visible image shows a small, quiet left-arrow cursor
  // and clicking goes to the previous image; the right half is the
  // mirror. There is no visible button — .work-carousel has no padding
  // of its own around the active slide (see style.css), so the
  // element's own bounds already match the displayed image precisely.
  // This is strictly an INTERNAL gallery control for one artwork's own
  // images; switching between different artworks is a separate system
  // (.selected-works-list, plain page links) and is never touched here.
  var carousel = document.querySelector('[data-work-carousel]');
  if (!carousel) return;

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.work-carousel-slide'));
  // A single-image artwork has nothing to navigate between — leave the
  // cursor and click behavior alone entirely (normal cursor, no zones).
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

  // Always loops: first image's "previous" wraps to the last, and the
  // last image's "next" wraps to the first (kept consistent for every
  // artwork gallery, per the brief).
  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  // Small, quiet, stroke-only left/right chevrons — the same shape
  // already used for the homepage carousel's prev/next arrows — as
  // cursor images rather than an on-screen button: no circle, no
  // background, no border, no shadow. `w-resize`/`e-resize` is the
  // fallback for browsers that ignore cursor images.
  var LEFT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2215%206%209%2012%2015%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, w-resize';
  var RIGHT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%229%206%2015%2012%209%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, e-resize';

  // The element's own box is the interaction zone (see comment above):
  // left half of that box = previous, right half = next.
  function zoneFor(e) {
    var r = carousel.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return null;
    return (e.clientX - r.left) < r.width / 2 ? 'prev' : 'next';
  }

  carousel.addEventListener('mousemove', function (e) {
    var zone = zoneFor(e);
    carousel.style.cursor = zone === 'prev' ? LEFT_CURSOR : zone === 'next' ? RIGHT_CURSOR : '';
  });
  carousel.addEventListener('mouseleave', function () {
    carousel.style.cursor = '';
  });
  carousel.addEventListener('click', function (e) {
    var zone = zoneFor(e);
    if (zone === 'prev') prev();
    else if (zone === 'next') next();
  });

  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
})();

(function () {
  // Stranger series preview pages (works/the-stranger/stranger-01..04)
  // — a dedicated "image only" template with no visible prev/next
  // link. Switching between the four works happens by clicking the
  // image's own left/right half — same quiet arrow-cursor convention
  // as the [data-work-carousel] block above, but this one is a real
  // page navigation (a different artwork, not another slide of the
  // same one), so it sets location.href rather than swapping a slide.
  // A work at either end of the series (Stranger 01 has no previous,
  // Stranger 04 has no next) simply has no href on that side, via a
  // missing data-prev-href/data-next-href attribute — that half of
  // the image is then inert and shows no cursor hint, never wrapping
  // around and never linking to itself. The real, visually-hidden
  // <a> in each page's markup is what makes the series navigable
  // without JavaScript; this block is purely an enhancement on top.
  var stage = document.querySelector('[data-stranger-preview]');
  if (!stage) return;

  var prevHref = stage.dataset.prevHref || null;
  var nextHref = stage.dataset.nextHref || null;

  var LEFT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2215%206%209%2012%2015%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, w-resize';
  var RIGHT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%229%206%2015%2012%209%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, e-resize';

  function zoneFor(e) {
    var r = stage.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return null;
    return (e.clientX - r.left) < r.width / 2 ? 'prev' : 'next';
  }

  function hrefFor(zone) {
    if (zone === 'prev') return prevHref;
    if (zone === 'next') return nextHref;
    return null;
  }

  stage.addEventListener('mousemove', function (e) {
    var zone = zoneFor(e);
    var href = hrefFor(zone);
    stage.style.cursor = !href ? '' : zone === 'prev' ? LEFT_CURSOR : RIGHT_CURSOR;
  });
  stage.addEventListener('mouseleave', function () {
    stage.style.cursor = '';
  });
  stage.addEventListener('click', function (e) {
    var href = hrefFor(zoneFor(e));
    if (href) window.location.href = href;
  });

  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' && prevHref) window.location.href = prevHref;
    else if (e.key === 'ArrowRight' && nextHref) window.location.href = nextHref;
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

(function () {
  // Archive: a separate, data-driven browsing system from Selected
  // Works — a flat thumbnail grid (see style.css, .archive-grid) with
  // two plain-text category filters, opening into a full-screen
  // lightbox instead of a dedicated project page per artwork. The
  // grid is rendered entirely from the ARCHIVE_WORKS array declared
  // inline in works/archive/index.html — adding a future work means
  // adding one entry there (image, thumbnail, title, year, medium,
  // dimensions, category), never new CSS, coordinates, or a new
  // detail route. A no-op on every page without [data-archive].
  var root = document.querySelector('[data-archive]');
  if (!root) return;

  var works = Array.isArray(window.ARCHIVE_WORKS) ? window.ARCHIVE_WORKS : [];
  var grid = root.querySelector('[data-archive-grid]');
  var emptyNote = root.querySelector('[data-archive-empty]');
  var categoryButtons = Array.prototype.slice.call(root.querySelectorAll('[data-archive-category]'));
  var lightbox = document.querySelector('[data-archive-lightbox]');
  var lightboxImage = lightbox ? lightbox.querySelector('[data-archive-lightbox-image]') : null;
  var lightboxMeta = lightbox ? lightbox.querySelector('[data-archive-lightbox-meta]') : null;
  var lightboxVideos = lightbox ? lightbox.querySelector('[data-archive-lightbox-videos]') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('[data-archive-lightbox-close]') : null;

  if (!grid) return;

  var DEFAULT_CATEGORY = '2022-2026';
  var activeCategory = DEFAULT_CATEGORY;
  var visible = []; // the works currently rendered for the active category
  var openId = null; // id of the work currently shown in the lightbox
  // Whether the current history entry is one this page itself pushed —
  // true only when the lightbox was opened by a real navigation (a
  // click on a grid thumbnail, or a browser Back/Forward that landed
  // back on a #work-<id> entry we'd pushed), false when the page
  // simply loaded with a #work-<id> hash already in the URL (a
  // shared/deep link). Set once per "open", not touched by step() —
  // step() moves between works with history.replaceState, which
  // mutates the current entry instead of pushing a new one, so this
  // flag keeps describing the entry that was actually pushed (or
  // wasn't) regardless of how many works were browsed since. Only in
  // the true case is there a matching history entry for Close to step
  // back into — see closeLightbox().
  var hashIsOurs = false;

  function metaLine(w) {
    var parts = [];
    var titleYear = [w.title, w.year].filter(Boolean).join(', ');
    if (titleYear) parts.push(titleYear);
    if (w.medium) parts.push(w.medium);
    if (w.dimensions) parts.push(w.dimensions);
    return parts.join(' | ');
  }

  function renderGrid() {
    visible = works.filter(function (w) { return w.category === activeCategory; });
    grid.innerHTML = '';
    visible.forEach(function (w) {
      var figure = document.createElement('figure');
      figure.className = 'archive-figure';
      var a = document.createElement('a');
      a.className = 'archive-thumb';
      a.href = '#work-' + encodeURIComponent(w.id);
      var label = [w.title, w.year].filter(Boolean).join(', ');
      a.setAttribute('aria-label', label ? 'Open ' + label : 'Open artwork');
      var img = document.createElement('img');
      img.src = w.thumbnail || w.image;
      img.alt = label || '';
      if (w.width) img.width = w.width;
      if (w.height) img.height = w.height;
      a.appendChild(img);
      figure.appendChild(a);
      grid.appendChild(figure);
    });
    if (emptyNote) emptyNote.hidden = visible.length > 0;
  }

  function setActiveCategory(category) {
    if (category === activeCategory) return;
    activeCategory = category;
    categoryButtons.forEach(function (btn) {
      var isActive = btn.dataset.archiveCategory === category;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    renderGrid();
  }

  categoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveCategory(btn.dataset.archiveCategory);
    });
  });

  renderGrid();

  // ---- Lightbox ----
  if (!lightbox || !lightboxImage) return;

  // Same small, quiet, stroke-only cursor hints as [data-work-carousel]
  // / [data-stranger-preview] above — no on-screen arrow buttons.
  var LEFT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%2215%206%209%2012%2015%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, w-resize';
  var RIGHT_CURSOR = 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2357554f%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%229%206%2015%2012%209%2018%22%2F%3E%3C%2Fsvg%3E") 12 12, e-resize';

  function findById(id) {
    for (var i = 0; i < works.length; i++) {
      if (String(works[i].id) === id) return works[i];
    }
    return null;
  }

  function showWork(w) {
    openId = w.id;
    lightboxImage.src = w.image || w.thumbnail;
    var label = [w.title, w.year].filter(Boolean).join(', ');
    lightboxImage.alt = label || '';
    if (w.width) lightboxImage.setAttribute('width', w.width); else lightboxImage.removeAttribute('width');
    if (w.height) lightboxImage.setAttribute('height', w.height); else lightboxImage.removeAttribute('height');
    if (lightboxMeta) lightboxMeta.textContent = metaLine(w);
    // Optional "Video →" (or "Video 1 →" / "Video 2 →") links — only
    // a couple of works have these (see the `videos` field on those
    // ARCHIVE_WORKS entries). Rebuilt fresh each time so the element
    // is genuinely empty/hidden for every other work rather than
    // leftover-from-last-time.
    if (lightboxVideos) {
      lightboxVideos.innerHTML = '';
      var vids = Array.isArray(w.videos) ? w.videos : [];
      if (vids.length) {
        vids.forEach(function (v, i) {
          if (i > 0) lightboxVideos.appendChild(document.createTextNode('  '));
          var a = document.createElement('a');
          a.href = v.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = v.label || 'Video →';
          lightboxVideos.appendChild(a);
        });
        lightboxVideos.hidden = false;
      } else {
        lightboxVideos.hidden = true;
      }
    }
    // Keep the category tab in sync so a deep-linked or swiped-to work
    // from the other category still shows the right selection behind
    // the lightbox.
    if (w.category && w.category !== activeCategory) setActiveCategory(w.category);
    lightbox.hidden = false;
    document.body.classList.add('archive-lightbox-open');
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('archive-lightbox-open');
    openId = null;
    if (/^#work-/.test(location.hash)) {
      if (hashIsOurs) {
        // We pushed this hash entry ourselves (a click) — stepping
        // back consumes exactly that entry, so the browser's Back
        // button and this Close control agree with each other.
        history.back();
      } else {
        // The page loaded with this hash already in the URL (a
        // shared/deep link) — there is no entry of ours to step back
        // into, so just drop the hash in place without adding or
        // removing history.
        history.replaceState(null, '', location.pathname + location.search);
      }
    }
    hashIsOurs = false;
  }

  function openById(id, viaNavigation) {
    var w = findById(id);
    if (!w) { closeLightbox(); return; }
    hashIsOurs = !!viaNavigation;
    showWork(w);
  }

  window.addEventListener('hashchange', function () {
    var m = /^#work-(.+)$/.exec(location.hash);
    if (m) openById(decodeURIComponent(m[1]), true);
    else if (!lightbox.hidden) closeLightbox();
  });

  function zoneFor(e) {
    var r = lightboxImage.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return null;
    return (e.clientX - r.left) < r.width / 2 ? 'prev' : 'next';
  }

  function step(dir) {
    if (openId == null) return;
    var idx = -1;
    for (var i = 0; i < visible.length; i++) {
      if (visible[i].id === openId) { idx = i; break; }
    }
    if (idx < 0) return;
    var nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= visible.length) return;
    // Update the URL in place rather than pushing a new history entry
    // for every prev/next step — otherwise browsing five works would
    // stack five entries, and a single Escape/Back would only unwind
    // one of them instead of leaving the lightbox. replaceState keeps
    // exactly one entry "spent" on the lightbox no matter how many
    // works were viewed, and (unlike location.hash =) it doesn't fire
    // hashchange, so we call showWork ourselves.
    history.replaceState(null, '', '#work-' + encodeURIComponent(visible[nextIdx].id));
    showWork(visible[nextIdx]);
  }

  lightboxImage.addEventListener('mousemove', function (e) {
    var zone = zoneFor(e);
    lightboxImage.style.cursor = zone === 'prev' ? LEFT_CURSOR : zone === 'next' ? RIGHT_CURSOR : '';
  });
  lightboxImage.addEventListener('mouseleave', function () { lightboxImage.style.cursor = ''; });
  lightboxImage.addEventListener('click', function (e) {
    e.stopPropagation();
    var zone = zoneFor(e);
    if (zone === 'prev') step(-1);
    else if (zone === 'next') step(1);
  });
  if (lightboxMeta) lightboxMeta.addEventListener('click', function (e) { e.stopPropagation(); });

  // Click on the surrounding background (not the image or caption)
  // closes the viewer — e.target === lightbox only when the click
  // lands on the backdrop itself, since the figure/image/caption stop
  // their own clicks from bubbling any further logic here.
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Touch swipe — kept intentionally minimal, no external library.
  var touchStartX = null;
  lightboxImage.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightboxImage.addEventListener('touchend', function (e) {
    if (touchStartX == null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) step(1); else step(-1);
  }, { passive: true });

  // Deep link on initial page load, e.g. /works/archive/#work-<id>.
  var initial = /^#work-(.+)$/.exec(location.hash);
  if (initial) openById(decodeURIComponent(initial[1]), false);
})();
