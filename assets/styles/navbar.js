let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");
let hideTimeout;

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    // scrolling down > start delay timer
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      navbar.classList.add("hide");
    }, 0); // delay before hiding (ms)
  } else {
    // scrolling up > show navbar immediately
    clearTimeout(hideTimeout);
    navbar.classList.remove("hide");
  }

  lastScrollY = window.scrollY;
});
