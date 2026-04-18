// Supabase configuration
const SUPABASE_URL = "https://lzmkcuktaqenqpyclhby.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bWtjdWt0YXFlbnFweWNsaGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTI4MjgsImV4cCI6MjA5MjAyODgyOH0.kQ5pZngoK99U_td885KX6-6BNbEBn0JFSEuIy-g30Uo";
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// Local liked-entry tracking (persists across page reloads)
const likedKey = "gb_liked";
const getLiked = () => JSON.parse(localStorage.getItem(likedKey) || "[]");
const saveLiked = (ids) => localStorage.setItem(likedKey, JSON.stringify(ids));

// Avatar color palette
const PALETTE = [
  ["#dbeafe", "#1d4ed8"],
  ["#dcfce7", "#15803d"],
  ["#fce7f3", "#be185d"],
  ["#ede9fe", "#6d28d9"],
  ["#ffedd5", "#c2410c"],
  ["#cffafe", "#0e7490"],
];
function avatarStyle(name) {
  const i = name.charCodeAt(0) % PALETTE.length;
  const [bg, color] = PALETTE[i];
  return `background:${bg};color:${color}`;
}
function initials(name) {
  return (
    name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2) || "?"
  );
}
function timeAgo(ts) {
  const secs = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return Math.floor(secs / 60) + "m ago";
  if (secs < 86400) return Math.floor(secs / 3600) + "h ago";
  return Math.floor(secs / 86400) + "d ago";
}

// Render a single entry card
function renderEntry(entry, prepend = false) {
  const liked = getLiked().includes(entry.id);
  const card = document.createElement("div");
  card.className =
    "card border-0 shadow-sm mb-3 gb-entry" + (prepend ? " gb-new" : "");
  card.id = `gb-entry-${entry.id}`;
  card.innerHTML = `
    <div class="card-body p-3 d-flex gap-3">
      <div class="gb-avatar" style="${avatarStyle(entry.name)}">${initials(entry.name)}</div>
      <div class="flex-grow-1">
        <div class="d-flex align-items-baseline gap-2 mb-1">
          <span class="fw-semibold" style="font-size:.9rem">&ensp;${esc(entry.name)}</span>
          &ensp;${entry.location ? `<span class="text-muted" style="font-size:.78rem">${esc(entry.location)}</span>` : ""}
          <span class="text-muted ms-auto gb-timestamp">&ensp;${timeAgo(entry.created_at)}</span>
        </div>
        <p class="mb-2 text-secondary" style="font-size:.875rem;line-height:1.6">&ensp;${esc(entry.message)}</p>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm gb-like-btn ${liked ? "liked" : ""}"
            onclick="toggleLike(${entry.id}, this)">
            ${liked ? "♥ liked ${entry.likes}" : "♡ like "}
          </button>
          <span class="text-muted" style="font-size:.75rem" id="gb-likes-${entry.id}">${entry.likes}</span>
        </div>
      </div>
    </div>`;
  return card;
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// Load all entries
async function loadEntries() {
  const { data, error } = await db
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("gb-entries");
  document.getElementById("gb-loading")?.remove();

  if (error || !data) {
    container.innerHTML = '<p class="text-danger">Failed to load messages.</p>';
    return;
  }

  data.forEach((entry) => container.appendChild(renderEntry(entry)));
  updateCount(data.length);
}

function updateCount(n) {
  document.getElementById("gb-count").textContent =
    n + (n === 1 ? " message" : " messages");
}

// Real-time subscription
db.channel("guestbook-inserts")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "guestbook" },
    (payload) => {
      // Only add if not already rendered (we add it optimistically on submit)
      if (!document.getElementById(`gb-entry-${payload.new.id}`)) {
        const container = document.getElementById("gb-entries");
        container.prepend(renderEntry(payload.new, true));
        const current =
          parseInt(document.getElementById("gb-count").textContent) || 0;
        updateCount(current + 1);
      }
    },
  )
  .subscribe();

// Submit
document.getElementById("gb-submit").addEventListener("click", async () => {
  const name = document.getElementById("gb-name").value.trim();
  const location = document.getElementById("gb-location").value.trim();
  const message = document.getElementById("gb-message").value.trim();

  if (!name || !message) {
    alert("Please enter your name and a message.");
    return;
  }

  const btn = document.getElementById("gb-submit");
  btn.disabled = true;
  btn.textContent = "Posting…";

  const { data, error } = await db
    .from("guestbook")
    .insert([{ name, location, message }])
    .select()
    .single();

  btn.disabled = false;
  btn.textContent = "Post message";

  if (error || !data) {
    alert("Something went wrong. Please try again.");
    return;
  }

  // Optimistic render
  const container = document.getElementById("gb-entries");
  container.prepend(renderEntry(data, true));
  const current =
    parseInt(document.getElementById("gb-count").textContent) || 0;
  updateCount(current + 1);

  // Clear form
  document.getElementById("gb-name").value = "";
  document.getElementById("gb-location").value = "";
  document.getElementById("gb-message").value = "";
  document.getElementById("gb-char-count").textContent = "0 / 300";

  // Toast
  const toastEl = document.getElementById("gb-toast");
  new bootstrap.Toast(toastEl, { delay: 2500 }).show();
});

// Like / Unlike
async function toggleLike(id, btn) {
  const liked = getLiked();
  const alreadyLiked = liked.includes(id);
  const delta = alreadyLiked ? -1 : 1;

  const countEl = document.getElementById(`gb-likes-${id}`);
  const current = parseInt(countEl.textContent) || 0;
  countEl.textContent = current + delta;

  if (alreadyLiked) {
    saveLiked(liked.filter((x) => x !== id));
    btn.classList.remove("liked");
    btn.textContent = "♡ like";
  } else {
    saveLiked([...liked, id]);
    btn.classList.add("liked");
    btn.textContent = "♥ liked";
  }

  await db
    .from("guestbook")
    .update({ likes: current + delta })
    .eq("id", id);
}

// Char counter
document.getElementById("gb-message").addEventListener("input", function () {
  document.getElementById("gb-char-count").textContent =
    `${this.value.length} / 300`;
});

// Init
loadEntries();
