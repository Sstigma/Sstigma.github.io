window.addEventListener("scroll", function () {
  const arrows = document.getElementById("scroll-down-arrows");
  if (window.scrollY > 50) {
    arrows.style.opacity = "0";
    arrows.style.transition = "opacity 0.5s ease";
  } else {
    arrows.style.opacity = "1";
  }
});

(function () {
  var EASING = "cubic-bezier(0.22, 0.61, 0.36, 1)";
  var DURATION_IN = "0.75s";
  var DURATION_OUT = "0.5s";

  var selectors = ".sa, .sa-right, .sa-scale";
  var targets = document.querySelectorAll(selectors);

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  targets.forEach(function (el) {
    var delay = el.getAttribute("data-delay") || "0";
    el._inDelay = parseInt(delay, 10);
    setTransition(el, DURATION_IN, el._inDelay);
  });

  function setTransition(el, duration, delayMs) {
    el.style.transition =
      "opacity " +
      duration +
      " " +
      EASING +
      " " +
      delayMs +
      "ms, " +
      "transform " +
      duration +
      " " +
      EASING +
      " " +
      delayMs +
      "ms";
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;

        if (entry.isIntersecting) {
          setTransition(el, DURATION_IN, el._inDelay);
          el.classList.remove("before-enter", "after-leave");
          el.classList.add("visible");
        } else {
          setTransition(el, DURATION_OUT, 0);
          el.classList.remove("visible");

          var rect = entry.boundingClientRect;
          if (rect.top < 0) {
            el.classList.remove("before-enter");
            el.classList.add("after-leave");
          } else {
            el.classList.remove("after-leave");
            el.classList.add("before-enter");
          }
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
