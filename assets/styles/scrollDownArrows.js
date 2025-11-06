  window.addEventListener("scroll", function() {
    const arrows = document.getElementById("scroll-down-arrows");
    if (window.scrollY > 50) {
      arrows.style.opacity = "0";
      arrows.style.transition = "opacity 0.5s ease";
    } else {
      arrows.style.opacity = "1";
    }
  });