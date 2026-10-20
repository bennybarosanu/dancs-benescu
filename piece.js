/* ═══════════════════════════════════════════════════════════════
   PIECE.JS — comportamentul paginilor individuale de spectacol.
   Același fișier pentru toate paginile.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ APARIȚIE LA SCROLL ============ */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  /* ============ HERO ============
     Ascunde indicatorul de scroll după ce pleci de pe hero. */
  window.addEventListener('scroll', function () {
    document.body.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Autoplay mut e permis peste tot; dacă totuși e blocat sau fișierul
     video lipsește, rămâne poza din `poster` și nu facem nimic. */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    var playing = heroVideo.play();
    if (playing && playing.catch) { playing.catch(function () { /* rămâne poster-ul */ }); }

    /* Butonul de sunet apare abia după ce videoul chiar s-a încărcat.
       Dacă fișierul .mp4 lipsește, `loadeddata` nu se declanșează și
       butonul rămâne ascuns — pagina arată doar poza. */
    var soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      heroVideo.addEventListener('loadeddata', function () {
        soundBtn.hidden = false;
      });

      soundBtn.addEventListener('click', function () {
        heroVideo.muted = !heroVideo.muted;
        soundBtn.textContent = heroVideo.muted ? 'Sound on' : 'Sound off';
        soundBtn.setAttribute('aria-pressed', String(!heroVideo.muted));
      });
    }
  }

  /* ============ POZĂ MĂRITĂ, CU SĂGEȚI ============ */
  var zoom = document.getElementById('zoom');
  if (!zoom) return;

  var zoomImg = zoom.querySelector('img');
  var zoomPrev = document.getElementById('zoomPrev');
  var zoomNext = document.getElementById('zoomNext');
  var zoomCounter = document.getElementById('zoomCounter');
  var zoomItems = [];
  var zoomIndex = 0;

  function showZoomAt(i) {
    if (!zoomItems.length) return;
    zoomIndex = (i + zoomItems.length) % zoomItems.length;
    var img = zoomItems[zoomIndex];
    zoomImg.src = img.src;
    zoomImg.alt = img.alt;
    var many = zoomItems.length > 1;
    zoomPrev.hidden = !many;
    zoomNext.hidden = !many;
    zoomCounter.textContent = many ? (zoomIndex + 1) + ' / ' + zoomItems.length : '';
  }

  function closeZoom() {
    zoom.classList.remove('open');
    document.body.classList.remove('zoom-open');
  }

  document.querySelectorAll('.piece-gallery img').forEach(function (img) {
    img.addEventListener('click', function () {
      var group = img.closest('.piece-gallery');
      zoomItems = group ? Array.prototype.slice.call(group.querySelectorAll('img')) : [img];
      showZoomAt(zoomItems.indexOf(img));
      zoom.classList.add('open');
      document.body.classList.add('zoom-open');
    });
  });

  zoom.addEventListener('click', closeZoom);
  zoomImg.addEventListener('click', function (e) { e.stopPropagation(); });
  zoomPrev.addEventListener('click', function (e) { e.stopPropagation(); showZoomAt(zoomIndex - 1); });
  zoomNext.addEventListener('click', function (e) { e.stopPropagation(); showZoomAt(zoomIndex + 1); });

  document.addEventListener('keydown', function (e) {
    if (!zoom.classList.contains('open')) return;
    if (e.key === 'Escape') { closeZoom(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showZoomAt(zoomIndex - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); showZoomAt(zoomIndex + 1); }
  });

  /* ============ ANUL DIN FOOTER ============ */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
