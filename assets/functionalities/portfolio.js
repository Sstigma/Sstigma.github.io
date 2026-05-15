     /* portfolio.js - JavaScript for portfolio page functionalities */
     document.addEventListener('DOMContentLoaded', function () {
        var targets = document.querySelectorAll('.sr');
        if (!('IntersectionObserver' in window)) {
          for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
          return;
        }
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08 });
        targets.forEach(function (el) { obs.observe(el); });
      });

  (function () {
    var lightbox  = document.getElementById('pd-img-lightbox');
    var lbImg     = document.getElementById('pd-lightbox-img');
    var lbClose   = document.getElementById('pd-lightbox-close');

    /* Open on any .pd-feature-img click */
    document.querySelectorAll('.pd-feature-img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lbImg.src = this.src;
        lbImg.alt = this.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            lightbox.classList.add('visible');
          });
        });
      });
    });

    /* Close lightbox on close button, outside click, or Escape key */
    function closeLightbox() {
      lightbox.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(function () {
        lightbox.classList.remove('active');
        lbImg.src = '';
      }, 280);
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  })();
