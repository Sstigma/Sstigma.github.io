const petals = document.querySelectorAll(".petal");
const container = document.querySelector(".image-container");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const progress = Math.min(Math.max(scrollY / window.innerHeight, 0), 1);

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Relative offsets (proportion of container size)
  const spreadX = [-1.2 * containerWidth, 1.2 * containerWidth, 0, 0];
  const spreadY = [0, 0, -1.2 * containerHeight, 1.2 * containerHeight];

  petals.forEach((petal, i) => {
    petal.style.transform = `translate(${spreadX[i] * progress}px, ${
      spreadY[i] * progress
    }px) scale(${0.5 + 0.5 * progress})`;
    petal.style.opacity = progress;
  });
});
