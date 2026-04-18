window.addEventListener("scroll", function () {
  const arrows = document.getElementById("scroll-down-arrows");
  if (window.scrollY > 50) {
    arrows.style.opacity = "0";
    arrows.style.transition = "opacity 0.5s ease";
  } else {
    arrows.style.opacity = "1";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var DELAY_CLASSES = ["d1", "d2", "d3", "d4", "d5"];

  /* Grab ALL animated elements — sr, sr-right, sr-scale */
  var targets = document.querySelectorAll(".sr, .sr-right, .sr-scale");

  /* Hard fallback: if no elements found, bail early*/
  if (!targets || targets.length === 0) {
    return;
  }

  /* Fallback for old browsers */
  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add("in");
    }
    return;
  }

  /* Strip stagger delays before exit */
  function disableDelays(el) {
    for (var i = 0; i < DELAY_CLASSES.length; i++) {
      if (el.classList.contains(DELAY_CLASSES[i])) {
        el.setAttribute("data-delay-cls", DELAY_CLASSES[i]);
        el.style.transitionDelay = "0s";
        el.style.webkitTransitionDelay = "0s";
        break;
      }
    }
  }

  /* Restore stagger delays after exit finishes */
  function restoreDelays(el) {
    if (el.getAttribute("data-delay-cls")) {
      el.style.transitionDelay = "";
      el.style.webkitTransitionDelay = "";
    }
  }

  /* Main IntersectionObserver */
  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var el = entry.target;

        if (entry.isIntersecting) {
          /* ENTERING viewport */
          el.classList.remove("out");
          restoreDelays(el);
          (function (element) {
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                element.classList.add("in");
              });
            });
          })(el);
        } else {
          /* LEAVING viewport */
          if (el.classList.contains("in")) {
            el.classList.remove("in");
            disableDelays(el);
            el.classList.add("out");

            /* Restore delays after exit transition completes */
            (function (element) {
              setTimeout(function () {
                restoreDelays(element);
              }, 500);
            })(el);
          }
        }
      }
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  /* Observe every target element */
  for (var j = 0; j < targets.length; j++) {
    observer.observe(targets[j]);
  }
});
