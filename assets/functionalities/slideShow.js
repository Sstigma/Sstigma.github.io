// Slideshow for about page

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* Slideshow */
  var slides = document.querySelectorAll(".slide");
  var dots = document.querySelectorAll(".slide-dot");
  var counter = document.getElementById("slideCounter");
  var prevBtn = document.getElementById("slidePrev");
  var nextBtn = document.getElementById("slideNext");
  var current = 0;
  var total = slides.length;
  var autoTimer = null;

  if (!slides.length) return;

  function goTo(index) {
    /* Remove active from current */
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    /* Wrap around */
    current = (index + total) % total;

    slides[current].classList.add("active");
    dots[current].classList.add("active");
    if (counter) counter.textContent = current + 1 + " / " + total;
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  /* Auto-advance every 4 seconds */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (prevBtn)
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      prev();
      startAuto();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      next();
      startAuto();
    });

  /* Dot clicks */
  for (var d = 0; d < dots.length; d++) {
    (function (dot, idx) {
      dot.addEventListener("click", function (e) {
        e.stopPropagation();
        goTo(idx);
        startAuto();
      });
    })(dots[d], parseInt(dots[d].getAttribute("data-dot"), 10));
  }

  /* Touch / swipe support — GitHub Pages mobile friendly */
  var touchStartX = 0;
  var slideshowEl = document.getElementById("slideshow");

  if (slideshowEl) {
    slideshowEl.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    slideshowEl.addEventListener(
      "touchend",
      function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) next();
          else prev();
          startAuto();
        }
      },
      { passive: true },
    );
  }

  startAuto();

  /* ── Lightbox ───────────────────────────────── */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCap = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    var activeSlide = document.querySelector(".slide.active");
    if (!activeSlide) return;
    var img = activeSlide.querySelector("img");
    var capEl = activeSlide.querySelector(".slide-caption-text");
    lightboxImg.src = img ? img.src : "";
    lightboxImg.alt = img ? img.alt : "";
    lightboxCap.textContent = capEl ? capEl.textContent : "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lightbox.classList.add("visible");
      });
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("visible");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.classList.remove("active");
    }, 280);
  }

  if (slideshowEl) {
    slideshowEl.addEventListener("click", function (e) {
      /* Only open lightbox if click was NOT on a button */
      if (!e.target.closest(".slide-btn") && !e.target.closest(".slide-dot")) {
        openLightbox();
      }
    });
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox) return;
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        next();
        openLightbox();
      }
      if (e.key === "ArrowLeft") {
        prev();
        openLightbox();
      }
    }
  });
});
