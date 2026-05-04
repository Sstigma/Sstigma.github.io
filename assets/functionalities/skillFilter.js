document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var cards = document.querySelectorAll(".skill-card");
  var filterBtns = document.querySelectorAll(".skills-filter-btn");
  var countEl = document.getElementById("skills-count");
  var totalEl = document.getElementById("skills-total");

  var total = cards.length;
  if (totalEl) totalEl.textContent = "(" + total + ")";
  if (countEl) countEl.textContent = "Showing all " + total + " skills";

  /* Filter logic */
  function filterSkills(cat) {
    var visible = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var match = cat === "all" || card.getAttribute("data-category") === cat;

      if (match) {
        card.classList.remove("hidden");
        (function (c) {
          requestAnimationFrame(function () {
            c.classList.remove("filtered-out");
          });
        })(card);
        visible++;
      } else {
        card.classList.add("filtered-out");
        (function (c) {
          setTimeout(function () {
            if (c.classList.contains("filtered-out")) {
              c.classList.add("hidden");
            }
          }, 260);
        })(card);
      }
    }

    /* Update count label */
    if (countEl) {
      if (cat === "all") {
        countEl.textContent = "Showing all " + total + " skills";
      } else {
        var label = filterBtns[0].parentElement
          ? document
              .querySelector('[data-filter="' + cat + '"]')
              .textContent.trim()
          : cat;
        countEl.textContent = "Showing " + visible + " of " + total + " skills";
      }
    }
  }

  /* Filter button clicks */
  for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener("click", function () {
      for (var j = 0; j < filterBtns.length; j++) {
        filterBtns[j].classList.remove("active");
      }
      this.classList.add("active");
      filterSkills(this.getAttribute("data-filter"));
    });
  }
});
