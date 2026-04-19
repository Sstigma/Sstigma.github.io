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

var HOBBIES = [
  {
    icon: "📋",
    name: "Collecting Licences",
    sub: "Always chasing the next qualification",
    body: "I push my limits by continuously expanding my skillset through licences and certifications — from driving and riding to technical disciplines like SCUBA diving. Each milestone represents a challenge I’ve taken on and completed, fueling my curiosity and drive to keep improving.",
    tags: [
      "Class 2B",
      "Class 2A",
      "Class 3",
      "PADI SCUBA Assistant Instructor",
      "Constant learning",
    ],
  },
  {
    icon: "🏃",
    name: "Running",
    sub: "Pushing the mind and body",
    body: "Running is my reset button. There is something about lacing up before sunrise and hitting the pavement that clears my mind and sets the tone for the whole day. I run 3–4 times a week and have been building up my distance steadily. The discipline I build on the road carries directly into how I approach work.",
    tags: ["5K", "10K", "Half Marathon", "Endurance"],
  },
  {
    icon: "🏋️",
    name: "Gymming",
    sub: "Discipline outside the office",
    body: "Hitting the gym is how I stay grounded. Consistency in the gym taught me that progress is rarely dramatic — it is built rep by rep, day by day. That mindset directly shapes how I approach coding and problem-solving. I train 4–5 days a week with a focus on strength and functional fitness.",
    tags: ["Strength Training", "Consistency", "Discipline"],
  },
  {
    icon: "🎮",
    name: "Gaming",
    sub: "Relaxation on weekends",
    body: "Gaming is where I unwind and, honestly, where I first fell in love with logic and systems thinking. I gravitate toward strategy games and deep RPGs that reward patience and planning. It is the same kind of thinking I bring to software architecture and debugging — breaking a complex system down until you find the lever that makes everything work.",
    tags: ["Strategy", "RPG", "Systems Thinking", "Problem Solving"],
  },
];

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var overlay = document.getElementById("hobbyModal");
  var closeBtn = document.getElementById("hobbyModalClose");
  var modalIcon = document.getElementById("hobbyModalIcon");
  var modalTitle = document.getElementById("hobbyModalTitle");
  var modalSub = document.getElementById("hobbyModalSub");
  var modalBody = document.getElementById("hobbyModalBody");
  var modalTags = document.getElementById("hobbyModalTags");
  var cards = document.querySelectorAll(".hobby-card");

  if (!overlay || !cards.length) return;

  /* Open modal */
  function openModal(index) {
    var h = HOBBIES[index];
    if (!h) return;

    modalIcon.textContent = h.icon;
    modalTitle.textContent = h.name;
    modalSub.textContent = h.sub;
    modalBody.textContent = h.body;

    /* Build tags */
    modalTags.innerHTML = "";
    for (var i = 0; i < h.tags.length; i++) {
      var tag = document.createElement("span");
      tag.className = "hobby-modal-tag";
      tag.textContent = h.tags[i];
      modalTags.appendChild(tag);
    }

    /* Show overlay */
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    /* Double rAF */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add("visible");
      });
    });
  }

  /* Close modal */
  function closeModal() {
    overlay.classList.remove("visible");
    document.body.style.overflow = "";

    /* Wait for fade-out transition before hiding */
    setTimeout(function () {
      overlay.classList.remove("active");
    }, 280);
  }

  /* Card click & keyboard */
  for (var i = 0; i < cards.length; i++) {
    (function (card, idx) {
      card.addEventListener("click", function () {
        openModal(idx);
      });
      /* Keyboard accessibility */
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(idx);
        }
      });
    })(cards[i], parseInt(cards[i].getAttribute("data-hobby"), 10));
  }

  /* Close triggers */
  closeBtn.addEventListener("click", closeModal);

  /* Click outside modal box closes it */
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  /* Escape key closes it */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeModal();
    }
  });

  /* Scroll-reveal */
  var targets = document.querySelectorAll(".sr");
  var DELAY_CLASSES = ["d1", "d2", "d3", "d4", "d5"];
  if ("IntersectionObserver" in window) {
    function disableDelays(el) {
      for (var d = 0; d < DELAY_CLASSES.length; d++) {
        if (el.classList.contains(DELAY_CLASSES[d])) {
          el.setAttribute("data-delay-cls", DELAY_CLASSES[d]);
          el.style.transitionDelay = "0s";
          el.style.webkitTransitionDelay = "0s";
          break;
        }
      }
    }
    function restoreDelays(el) {
      if (el.getAttribute("data-delay-cls")) {
        el.style.transitionDelay = "";
        el.style.webkitTransitionDelay = "";
      }
    }
    var observer = new IntersectionObserver(
      function (entries) {
        for (var e = 0; e < entries.length; e++) {
          var entry = entries[e];
          var el = entry.target;
          if (entry.isIntersecting) {
            el.classList.remove("out");
            restoreDelays(el);
            (function (elem) {
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  elem.classList.add("in");
                });
              });
            })(el);
          } else if (el.classList.contains("in")) {
            el.classList.remove("in");
            disableDelays(el);
            el.classList.add("out");
            (function (elem) {
              setTimeout(function () {
                restoreDelays(elem);
              }, 500);
            })(el);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    for (var t = 0; t < targets.length; t++) observer.observe(targets[t]);
  } else {
    for (var t = 0; t < targets.length; t++) targets[t].classList.add("in");
  }
});
