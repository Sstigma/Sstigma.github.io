const petals = document.querySelectorAll(".petal");

// Number of viewport heights to complete bloom
const totalScrolls = 0.6;

// Spread positions for 4 petals
const spreadX = [-350, 350, 0, 0]; // left, right, top, bottom
const spreadY = [0, 0, -350, 350];

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // progress: 0 = first scroll, 1 = after 5 viewport heights
  let progress = scrollY / (window.innerHeight * totalScrolls);
  progress = Math.min(Math.max(progress, 0), 1); // clamp 0 → 1

  petals.forEach((petal, i) => {
    petal.style.transform = `translate(${spreadX[i] * progress}px, ${
      spreadY[i] * progress
    }px) scale(${0.5 + 0.5 * progress})`;
    petal.style.opacity = progress;
  });
});
