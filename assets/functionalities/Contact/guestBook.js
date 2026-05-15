//Guestbook in contact page

// Config Supabase
const SUPABASE_URL = "https://lzmkcuktaqenqpyclhby.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bWtjdWt0YXFlbnFweWNsaGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTI4MjgsImV4cCI6MjA5MjAyODgyOH0.kQ5pZngoK99U_td885KX6-6BNbEBn0JFSEuIy-g30Uo";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const PREVIEW_COUNT = 2;

//  Initiate Auth state
var isAdmin = false;

// Check if already logged in from a previous session
db.auth.getSession().then(function (res) {
  if (res.data && res.data.session) {
    setAdminMode(true);
  }
});

// React to login / logout events
db.auth.onAuthStateChange(function (event, session) {
  setAdminMode(!!session);
});

function setAdminMode(on) {
  isAdmin = on;
  var btn = document.getElementById("gb-admin-btn");
  if (!btn) return;
  if (on) {
    document.body.classList.add("gb-admin-mode");
    btn.textContent = "Sign out";
    btn.classList.add("logged-in");
  } else {
    document.body.classList.remove("gb-admin-mode");
    btn.textContent = "Admin";
    btn.classList.remove("logged-in");
  }
}

// Toggle admin button
function toggleAdmin() {
  if (isAdmin) {
    db.auth.signOut();
  } else {
    openLoginModal();
  }
}

// Login modal
function openLoginModal() {
  var overlay = document.getElementById("gb-login-overlay");
  overlay.style.display = "flex";
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add("visible");
    });
  });
  document.getElementById("gb-email").focus();
  document.getElementById("gb-login-error").style.display = "none";
}

function closeLoginModal() {
  var overlay = document.getElementById("gb-login-overlay");
  overlay.classList.remove("visible");
  setTimeout(function () {
    overlay.style.display = "none";
  }, 280);
}

// Close on backdrop click
document
  .getElementById("gb-login-overlay")
  .addEventListener("click", function (e) {
    if (e.target === this) closeLoginModal();
  });

// Close on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeLoginModal();
});

// Submit on Enter in password field
document
  .getElementById("gb-password")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLogin();
  });

async function doLogin() {
  var email = document.getElementById("gb-email").value.trim();
  var password = document.getElementById("gb-password").value;
  var btn = document.getElementById("gb-login-submit");
  var errEl = document.getElementById("gb-login-error");

  if (!email || !password) return;

  btn.disabled = true;
  btn.textContent = "Signing in…";
  errEl.style.display = "none";

  var result = await db.auth.signInWithPassword({
    email: email,
    password: password,
  });

  btn.disabled = false;
  btn.textContent = "Sign in";

  if (result.error) {
    errEl.style.display = "block";
    return;
  }

  // Success — modal closes
  closeLoginModal();
  document.getElementById("gb-email").value = "";
  document.getElementById("gb-password").value = "";
  showToast("Admin mode unlocked ✓", "success");
}

//  Avatar helpers
const likedKey = "gb_liked";
const getLiked = () => JSON.parse(localStorage.getItem(likedKey) || "[]");
const saveLiked = (ids) => localStorage.setItem(likedKey, JSON.stringify(ids));

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

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// Render one entry
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
    <div class="d-flex justify-content-between align-items-start mb-1">
      <div>
        <span class="fw-semibold" style="font-size:.9rem">&nbsp;${esc(entry.name)}</span>
        ${entry.location ? `<div class="text-muted" style="font-size:.78rem">&nbsp;${esc(entry.location)}</div>` : ""}
      </div>
      <span class="text-muted gb-timestamp" style="font-size:.75rem">${timeAgo(entry.created_at)}</span>
    </div>
    <p class="mb-2 text-secondary" style="font-size:.875rem;line-height:1.6">${esc(entry.message)}</p>
    <div class="d-flex align-items-center gap-2">
      <button class="btn btn-outline-secondary btn-sm gb-like-btn ${liked ? "liked" : ""}"
        onclick="toggleLike(${entry.id}, this)">
        ${liked ? "♥ liked" : "♡ like"}
      </button>
      <span class="text-muted" style="font-size:.75rem" id="gb-likes-${entry.id}">${entry.likes}</span>
      <button class="gb-delete-btn" onclick="deleteEntry(${entry.id})">✕ delete</button>
    </div>
  </div>
</div>`;
  return card;
}

// Count badge
function updateCount(n) {
  document.getElementById("gb-count").textContent =
    n + (n === 1 ? " message" : " messages");
}

// Show / hide "show more"
function refreshShowMore() {
  const hidden = document.querySelectorAll(".gb-entry.gb-hidden").length;
  const total = document.querySelectorAll(".gb-entry").length;
  const wrap = document.getElementById("gb-show-more-wrap");
  if (!wrap) return;
  if (hidden > 0) {
    wrap.style.display = "";
    document.getElementById("gb-show-more-btn").textContent =
      `Show remaining messages (${total - 2}) ↓`;
  } else {
    wrap.style.display = "none";
  }
}

function showAllEntries() {
  document.querySelectorAll(".gb-entry.gb-hidden").forEach((el) => {
    el.classList.remove("gb-hidden");
    el.style.display = "";
  });
  document.getElementById("gb-show-more-wrap").style.display = "none";
}

// Load entries
async function loadEntries() {
  const { data, error } = await db
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  document.getElementById("gb-loading")?.remove();

  const container = document.getElementById("gb-entries");

  if (error || !data) {
    container.innerHTML = '<p class="text-danger">Failed to load messages.</p>';
    return;
  }

  // PREVIEW_COUNT entries visible, rest hidden
  data.forEach((entry, i) => {
    const card = renderEntry(entry, false);
    if (i >= PREVIEW_COUNT) {
      card.classList.add("gb-hidden");
      card.style.display = "none";
    }
    container.appendChild(card);
  });

  updateCount(data.length);
  refreshShowMore();
}

// Real-time: new entries from other visitors
db.channel("guestbook-inserts")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "guestbook" },
    (payload) => {
      if (!document.getElementById(`gb-entry-${payload.new.id}`)) {
        const container = document.getElementById("gb-entries");
        container.prepend(renderEntry(payload.new, true));
        const n =
          document.querySelectorAll(".gb-entry:not(.gb-hidden)").length +
          document.querySelectorAll(".gb-entry.gb-hidden").length;
        updateCount(n);
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
  document.getElementById("gb-entries").prepend(renderEntry(data, true));
  const n = document.querySelectorAll(".gb-entry").length;
  updateCount(n);

  document.getElementById("gb-name").value = "";
  document.getElementById("gb-location").value = "";
  document.getElementById("gb-message").value = "";
  document.getElementById("gb-char-count").textContent = "0 / 300";

  showToast("Message posted!", "success");
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

// Delete
async function deleteEntry(id) {
  if (!isAdmin) return;
  if (!confirm("Delete this message?")) return;

  const card = document.getElementById(`gb-entry-${id}`);
  if (card) {
    card.style.transition = "opacity 0.2s";
    card.style.opacity = "0";
    setTimeout(() => card.remove(), 200);
  }

  await db.from("guestbook").delete().eq("id", id);

  const n = document.querySelectorAll(".gb-entry").length;
  updateCount(n);
  refreshShowMore();
}

// Toast
function showToast(msg, type) {
  const toast = document.getElementById("gb-toast");
  const body = document.getElementById("gb-toast-body");
  if (!toast || !body) return;
  body.textContent = msg;
  toast.className =
    "toast align-items-center border-0 text-white " +
    (type === "success" ? "bg-success" : "bg-danger");
  new bootstrap.Toast(toast, { delay: 2500 }).show();
}

// Char counter
document.getElementById("gb-message").addEventListener("input", function () {
  document.getElementById("gb-char-count").textContent =
    `${this.value.length} / 300`;
});

// Init
loadEntries();
