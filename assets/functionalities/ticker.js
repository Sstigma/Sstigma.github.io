const AWARDS = [
  {
    icon: "🏆",
    award: "Edusave Good Progress Award",
    org: "Ministry of Education, Singapore",
    year: "2017",
  },
  {
    icon: "🥇",
    award:
      "Edusave Award for Achievement, Good Leadership and Service (EAGLES)",
    org: "Ministry of Education, Singapore",
    year: "2017",
  },
  {
    icon: "🌟",
    award: "Edusave Character Award",
    org: "Ministry of Education, Singapore",
    year: "2017",
  },
  {
    icon: "🏆",
    award: "Edusave Certificate of Academic Achievement",
    org: "Ministry of Education, Singapore",
    year: "2020",
  },
  {
    icon: "🏅",
    award: "Edusave Merit Bursary",
    org: "Ministry of Education, Singapore",
    year: "2021",
  },
  {
    icon: "🌟",
    award: "Edusave Certificate of Academic Achievement",
    org: "Ministry of Education, Singapore",
    year: "2021",
  },
  {
    icon: "🎓",
    award: "Edusave Good Progress Award",
    org: "Ministry of Education, Singapore",
    year: "2023",
  },
];
// ──────────────────────────────────────────────────────────────

function buildItem(a) {
  return `
    <div class="ticker-item">
      <span class="ticker-icon">${a.icon}</span>
      <div class="ticker-body">
        <div class="ticker-award">${a.award}</div>
        <div class="ticker-org">${a.org}</div>
      </div>
      <span class="ticker-year">${a.year}</span>
    </div>`;
}

const track = document.getElementById("ticker-track");

// Render items twice so the loop is seamless
const html = AWARDS.map(buildItem).join("");
track.innerHTML = html + html;

// Speed: ~28px per second. More items = longer duration.
const itemHeight = 72; // approx px per item
const totalHeight = AWARDS.length * itemHeight;
const speed = 28; // px per second — lower = slower
const duration = Math.round(totalHeight / speed);
track.style.setProperty("--ticker-duration", duration + "s");
document
  .getElementById("awards-ticker")
  .style.setProperty("--ticker-duration", duration + "s");
