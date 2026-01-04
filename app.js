const EVENTS = [
  {
    title: "Creative Social",
    dateLabel: "28 January",
    mood: "An intimate evening of presence and shared curiosity.",
    link: "https://example.com/tickets"
  },
  {
    title: "Film Club",
    dateLabel: "Monthly",
    mood: "Watching together. Sitting with stories.",
    link: "https://example.com/filmclub"
  },
  {
    title: "Art Club",
    dateLabel: "Ongoing",
    mood: "Making, slowly.",
    link: "https://example.com/artclub"
  }
];

const ROOM_MOMENTS_DEFAULT = [
  { line: "A full room, held quietly.", meta: "recently" },
  { line: "Hands busy. Minds open.", meta: "recently" },
  { line: "Music low. Conversations unforced.", meta: "recently" }
];

const ARCHIVE_TILES = [
  { title: "Film Club", sub: "Watching together." },
  { title: "Art Club", sub: "Making, slowly." },
  { title: "Mario Kart Nights", sub: "Play, lightly." },
  { title: "Workshops", sub: "Hands on, calm." },
  { title: "Kitchen Sessions", sub: "Music in close quarters." },
  { title: "Community Gatherings", sub: "A room that holds." }
];

function qs(sel){ return document.querySelector(sel); }
function el(tag, cls){ const n = document.createElement(tag); if(cls) n.className = cls; return n; }

function renderEvents(){
  const list = qs("#eventList");
  list.innerHTML = "";

  EVENTS.forEach((e) => {
    const row = el("div", "eventRow");
    const top = el("div", "eventRowTop");
    const name = el("div", "eventName"); name.textContent = e.title;
    const date = el("div", "eventDate"); date.textContent = e.dateLabel;
    const mood = el("div", "eventMood"); mood.textContent = e.mood;

    top.appendChild(name);
    top.appendChild(date);
    row.appendChild(top);
    row.appendChild(mood);

    row.addEventListener("click", () => {
      if (e.link && e.link.startsWith("http")) window.open(e.link, "_blank", "noreferrer");
    });

    list.appendChild(row);
  });

  const next = EVENTS[0];
  qs("#nextEventMeta").textContent = next.dateLabel;
  qs("#nextEventBody").textContent = next.mood;

  const link = qs("#nextEventLink");
  link.href = next.link || "#";
  link.textContent = next.link && next.link.startsWith("http") ? "Open details" : "No link yet";
  link.style.pointerEvents = (next.link && next.link.startsWith("http")) ? "auto" : "none";
  link.style.opacity = (next.link && next.link.startsWith("http")) ? "1" : ".6";
}

function getRoomMoments(){
  try{
    const raw = localStorage.getItem("sonderhaus_room_moments");
    if(!raw) return ROOM_MOMENTS_DEFAULT;
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed) || parsed.length === 0) return ROOM_MOMENTS_DEFAULT;
    return parsed.slice(0, 12);
  }catch{
    return ROOM_MOMENTS_DEFAULT;
  }
}

function setRoomMoments(moments){
  localStorage.setItem("sonderhaus_room_moments", JSON.stringify(moments.slice(0, 12)));
}

function renderRoom(){
  const feed = qs("#roomFeed");
  feed.innerHTML = "";
  const moments = getRoomMoments();

  moments.forEach((m) => {
    const box = el("div", "moment");
    const line = el("p", "momentLine");
    line.textContent = m.line;
    const meta = el("p", "momentMeta");
    meta.textContent = m.meta || "";
    box.appendChild(line);
    box.appendChild(meta);
    feed.appendChild(box);
  });
}

function renderArchive(){
  const grid = qs("#archiveGrid");
  grid.innerHTML = "";

  ARCHIVE_TILES.forEach((t) => {
    const tile = el("div", "tile");
    const text = el("div", "tileText");
    const title = el("p", "tileTitle"); title.textContent = t.title;
    const sub = el("p", "tileSub"); sub.textContent = t.sub;
    text.appendChild(title);
    text.appendChild(sub);
    tile.appendChild(text);
    grid.appendChild(tile);
  });
}

function setupNav(){
  const navBtn = qs("#navBtn");
  const drawer = qs("#drawer");
  const closeBtn = qs("#drawerClose");

  function openDrawer(){
    drawer.style.display = "block";
    drawer.setAttribute("aria-hidden", "false");
    navBtn.setAttribute("aria-expanded", "true");
  }
  function closeDrawer(){
    drawer.style.display = "none";
    drawer.setAttribute("aria-hidden", "true");
    navBtn.setAttribute("aria-expanded", "false");
  }

  navBtn.addEventListener("click", () => {
    const expanded = navBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeDrawer() : openDrawer();
  });

  closeBtn.addEventListener("click", closeDrawer);

  drawer.addEventListener("click", (e) => {
    if(e.target === drawer) closeDrawer();
  });

  document.querySelectorAll(".drawerLink").forEach(a => {
    a.addEventListener("click", closeDrawer);
  });
}

function setupJoin(){
  const btn = qs("#joinBtn");
  const input = qs("#email");
  const note = qs("#joinNote");

  btn.addEventListener("click", () => {
    const v = (input.value || "").trim();
    if(!v || !v.includes("@")){
      note.textContent = "Add an email to stay close.";
      return;
    }
    note.textContent = "Saved locally for now. Connect email later.";
    localStorage.setItem("sonderhaus_email", v);
    input.value = "";
  });
}

function setupCopyEvent(){
  const btn = qs("#copyEventBtn");
  btn.addEventListener("click", async () => {
    const e = EVENTS[0];
    const text = `Sonderhaus\n${e.title}\n${e.dateLabel}\n${e.mood}\n${e.link}`;
    try{
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = "Copy info", 1200);
    }catch{
      btn.textContent = "Copy failed";
      setTimeout(() => btn.textContent = "Copy info", 1200);
    }
  });
}

function setupAddMoment(){
  const btn = qs("#addRoomNoteBtn");
  btn.addEventListener("click", () => {
    const line = prompt("Add a moment (one short line):");
    if(!line) return;
    const trimmed = line.trim();
    if(!trimmed) return;

    const moments = getRoomMoments();
    const now = new Date();
    const meta = now.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    const next = [{ line: trimmed, meta }, ...moments].slice(0, 12);
    setRoomMoments(next);
    renderRoom();
  });
}

function setupCollabForm(){
  const form = qs("#collabForm");
  const note = qs("#collabNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (qs("#name").value || "").trim();
    const msg = (qs("#message").value || "").trim();

    const subject = encodeURIComponent("Sonderhaus collaboration");
    const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${msg}\n\nSent from sonderhaus website`);

    const to = "sonderhaus3vents@email.com";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email client…";
  });
}

function init(){
  renderEvents();
  renderRoom();
  renderArchive();
  setupNav();
  setupJoin();
  setupCopyEvent();
  setupAddMoment();
  setupCollabForm();
}
init();
