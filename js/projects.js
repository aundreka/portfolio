document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#projects.projects");
  if (!root) return;

  const pianoHost   = root.querySelector("#projectsPiano");
  const langValueEl = root.querySelector("#langValue");
  const catValueEl  = root.querySelector("#catValue");
  const langMenuEl  = root.querySelector("#langMenu");
  const catMenuEl   = root.querySelector("#catMenu");
  const langFilter  = root.querySelector('.filter[data-filter="language"]');
  const catFilter   = root.querySelector('.filter[data-filter="category"]');

  if (!pianoHost || !langValueEl || !catValueEl || !langMenuEl || !catMenuEl || !langFilter || !catFilter) {
    console.warn("[ProjectsPiano] Missing required DOM elements inside #projects.");
    return;
  }

  /* ---------- sizing knobs (accordion) ---------- */
  // If your CSS uses these vars (it does), this makes the open key larger.
  pianoHost.style.setProperty("--open-w", "1300px");
  pianoHost.style.setProperty("--key-w", "190px");
  pianoHost.style.setProperty("--key-w-small", "120px");

  const LANGUAGES = ["All","python","html css js","php sql","react native","react","next","expo","kotlin","java","c++","flutter"];
  const CATEGORIES = ["All","apps","websites","games","ai/ml","ui/ux"];

  const PROJECTS = [
    {
      title: "PRISM — Social Media Auto-Posting + Analytics",
      description: "A scheduling + analytics platform with a content calendar, performance tracking, and automation workflows.",
      language: "react native",
      category: "apps",
      icons: ["react native", "expo", "javascript"],
      note: "c",
      keyBg: "assets/projects/prism/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
    {
      title: "Grimm Runner — Top-Down Survival Game",
      description: "A top-down survival game with wave-based enemies, upgrades, and progression systems.",
      language: "flutter",
      category: "games",
      icons: ["flutter", "dart", "firebase"],
      note: "d",
      keyBg: "assets/projects/grimm/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
    {
      title: "BitMind — Bitcoin Auto-Trading System",
      description: "An AI-powered trading system with predictive modeling, backtesting, and real-time execution.",
      language: "python",
      category: "ai/ml",
      icons: ["python", "pytorch", "pandas"],
      note: "e",
      keyBg: "assets/projects/bitmind/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
    {
      title: "SchedU — PDF-to-Lesson Plan Generator",
      description: "A teacher assistant that converts PDFs into lesson plans, quizzes, and activities with export options.",
      language: "react",
      category: "websites",
      icons: ["react", "next", "typescript"],
      note: "f",
      keyBg: "assets/projects/schedu/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
    {
      title: "WindErA — Local Wind Speed Dashboard",
      description: "A dashboard for wind monitoring and hazard awareness with real-time data and alerts.",
      language: "html css js",
      category: "websites",
      icons: ["html css js", "leaflet", "firebase"],
      note: "a",
      keyBg: "assets/projects/windera/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
    {
      title: "Clinic Feasibility — Salus Specialty Clinic",
      description: "A feasibility pack with market + financial analysis and a simple 1-storey floor plan.",
      language: "php sql",
      category: "ui/ux",
      icons: ["php sql", "mysql", "figma"],
      note: "b",
      keyBg: "assets/projects/salus/key.jpg",
      media: { big: "", midTop: "", midBottom: "", tall: "" },
    },
  ];

  const NOTE_LETTERS = ["a","b","c","d","e","f","g"];
  const NOTE_BASE = "assets/music/notes"; // expects a6.mp3, b6.mp3...
  const HOVER_COOLDOWN_MS = 120;

  const state = {
    language: "All",
    category: "All",
    openIndex: null,
    lastHoverAt: 0,
    lastHoverSlot: null,
  };

  const normalize = (s) => String(s || "").trim().toLowerCase();

  function matchesFilters(project) {
    if (!project) return false;
    const langOk = state.language === "All" || normalize(project.language) === normalize(state.language);
    const catOk  = state.category === "All" || normalize(project.category) === normalize(state.category);
    return langOk && catOk;
  }

  function getFilteredProjects() {
    return PROJECTS.filter(matchesFilters);
  }

  function pickNoteLetter(project, slotIndex) {
    const forced = normalize(project?.note);
    if (NOTE_LETTERS.includes(forced)) return forced;

    const seed = (project?.title || "") + "|" + slotIndex;
    let hash = 0;
    for (let i=0;i<seed.length;i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return NOTE_LETTERS[hash % NOTE_LETTERS.length];
  }

  // black key pattern: 2, gap, 3, gap
  function boundaryHasBlack(boundaryIndex) {
    const mod = boundaryIndex % 7;
    return mod === 0 || mod === 1 || mod === 3 || mod === 4 || mod === 5;
  }

  /* -----------------------------
     AUDIO
     ----------------------------- */
  const audioCache = new Map();
  let audioUnlocked = false;

  function getAudio(letter) {
    const key = normalize(letter);
    if (audioCache.has(key)) return audioCache.get(key);
    const a = new Audio(`${NOTE_BASE}/${key}6.mp3`);
    a.preload = "auto";
    audioCache.set(key, a);
    return a;
  }

  function unlockAudioOnce() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    try {
      const a = getAudio("a");
      a.volume = 0;
      a.play()
        .then(() => { a.pause(); a.currentTime = 0; a.volume = 1; })
        .catch(() => {});
    } catch {}
  }

  function playNote(letter) {
    try {
      const a = getAudio(letter);
      a.pause();
      a.currentTime = 0;
      a.volume = 1;
      a.play().catch(() => {});
    } catch {}
  }

  root.addEventListener("pointerdown", unlockAudioOnce, { once: true });

  /* -----------------------------
     FILTER MENUS
     ----------------------------- */
  function clearMenus() {
    langFilter.classList.remove("is-open");
    catFilter.classList.remove("is-open");
  }

  function toggleMenu(which) {
    if (which === "language") {
      const willOpen = !langFilter.classList.contains("is-open");
      clearMenus();
      if (willOpen) langFilter.classList.add("is-open");
    } else {
      const willOpen = !catFilter.classList.contains("is-open");
      clearMenus();
      if (willOpen) catFilter.classList.add("is-open");
    }
  }

  function renderMenu(menuEl, items, onPick) {
    menuEl.innerHTML = "";
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item;
      btn.addEventListener("click", () => onPick(item));
      menuEl.appendChild(btn);
    });
  }

  renderMenu(langMenuEl, LANGUAGES, (picked) => {
    state.language = picked;
    langValueEl.textContent = picked;
    state.openIndex = null;
    clearMenus();
    render();
  });

  renderMenu(catMenuEl, CATEGORIES, (picked) => {
    state.category = picked;
    catValueEl.textContent = picked;
    state.openIndex = null;
    clearMenus();
    render();
  });

  langFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu("language");
  });

  catFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu("category");
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) clearMenus();
  });

  /* -----------------------------
     NOTE PANEL
     ----------------------------- */
  function buildNotePanel(project) {
    const note = document.createElement("div");
    note.className = "note";

    const media = document.createElement("div");
    media.className = "note__media";

    const big = document.createElement("div");
    big.className = "media--big";

    const mid = document.createElement("div");
    mid.className = "media--mid";
    const midTop = document.createElement("div");
    const midBottom = document.createElement("div");
    mid.appendChild(midTop);
    mid.appendChild(midBottom);

    const tall = document.createElement("div");
    tall.className = "media--tall";

    const m = project.media || {};
    if (m.big) big.style.background = `url("${m.big}") center/cover no-repeat`;
    if (m.midTop) midTop.style.background = `url("${m.midTop}") center/cover no-repeat`;
    if (m.midBottom) midBottom.style.background = `url("${m.midBottom}") center/cover no-repeat`;
    if (m.tall) tall.style.background = `url("${m.tall}") center/cover no-repeat`;

    media.appendChild(big);
    media.appendChild(mid);
    media.appendChild(tall);

    const desc = document.createElement("p");
    desc.className = "note__desc";
    desc.textContent = project.description || "This is the project description.";

    const title = document.createElement("h2");
    title.className = "note__title";
    title.textContent = project.title || "This is the Project Title";

    const langs = document.createElement("div");
    langs.className = "note__langs";

    const icons = Array.isArray(project.icons) ? project.icons : [];
    icons.slice(0, 6).forEach((iconKey) => {
      const img = document.createElement("img");
      img.alt = String(iconKey);
      img.src = `assets/icons/${iconKey}.png`;
      langs.appendChild(img);
    });

    note.appendChild(media);
    note.appendChild(desc);
    note.appendChild(title);
    note.appendChild(langs);

    return note;
  }

  function computeKeyCount() {
    const filtered = getFilteredProjects();
    const hostW = pianoHost.clientWidth || window.innerWidth || 1200;

    // approximate "closed" key width (should match CSS)
    const approxKeyW = 190;
    const fit = Math.ceil(hostW / approxKeyW);
    const baseline = Math.max(12, fit + 6);
    return Math.max(filtered.length, baseline);
  }

  function buildBlackLayer(track, keyCount) {
    const old = track.querySelector(".blacklayer");
    if (old) old.remove();

    const layer = document.createElement("div");
    layer.className = "blacklayer";

    const firstKey = track.querySelector(".piano-key");
    const keyW = firstKey ? firstKey.getBoundingClientRect().width : 190;
    const blackW = 74;

    for (let i = 0; i < keyCount - 1; i++) {
      if (!boundaryHasBlack(i)) continue;
      const black = document.createElement("div");
      black.className = "black-key";
      black.dataset.boundary = String(i);

      const x = (i + 1) * keyW - (blackW / 2);
      black.style.left = `${x}px`;
      layer.appendChild(black);
    }

    track.appendChild(layer);
  }

  function hideBlackKeysInsideOpen(track) {
    const layer = track.querySelector(".blacklayer");
    if (!layer) return;

    layer.querySelectorAll(".black-key").forEach((bk) => bk.classList.remove("is-hidden"));

    const openKey = track.querySelector(".piano-key.is-open");
    if (!openKey) return;

    const openRect = openKey.getBoundingClientRect();
    const layerRect = layer.getBoundingClientRect();

    const left = openRect.left - layerRect.left;
    const right = openRect.right - layerRect.left;

    layer.querySelectorAll(".black-key").forEach((bk) => {
      const x = parseFloat(bk.style.left || "0");
      const w = bk.getBoundingClientRect().width || 74;
      const center = x + w / 2;

      if (center > left && center < right) bk.classList.add("is-hidden");
    });
  }

  function render() {
    pianoHost.innerHTML = "";

    const track = document.createElement("div");
    track.className = "piano-track";

    const filtered = getFilteredProjects();
    const KEY_COUNT = computeKeyCount();

    if (state.openIndex !== null) track.classList.add("is-accordion");

    for (let i = 0; i < KEY_COUNT; i++) {
      const project = filtered[i] || null;

      const key = document.createElement("div");
      key.className = "piano-key";
      key.dataset.slot = String(i);
      key.tabIndex = 0;

      if (project?.keyBg) key.style.setProperty("--hover-bg", `url("${project.keyBg}")`);
      else key.style.removeProperty("--hover-bg");

      const title = document.createElement("div");
      title.className = "key-title";

      if (!project) {
        key.classList.add("is-empty");
        title.textContent = "";
      } else {
        title.textContent = project.title || "This is the Project Title";
      }

      key.appendChild(title);

      if (project && state.openIndex === i) {
        key.classList.add("is-open");
        key.appendChild(buildNotePanel(project));
      }

      track.appendChild(key);
    }

    pianoHost.appendChild(track);

    requestAnimationFrame(() => {
      buildBlackLayer(track, KEY_COUNT);
      hideBlackKeysInsideOpen(track);
    });
  }

  /* -----------------------------
     Hover sound
     ----------------------------- */
  pianoHost.addEventListener("pointermove", (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const key = el?.closest?.(".piano-key");
    if (!key || !pianoHost.contains(key)) return;

    const slot = Number(key.dataset.slot);
    if (!Number.isFinite(slot)) return;

    if (state.lastHoverSlot === slot) return;
    state.lastHoverSlot = slot;

    const filtered = getFilteredProjects();
    const project = filtered[slot];
    if (!project) return;

    const now = Date.now();
    if (now - state.lastHoverAt < HOVER_COOLDOWN_MS) return;
    state.lastHoverAt = now;

    playNote(pickNoteLetter(project, slot));
  });

  pianoHost.addEventListener("pointerleave", () => {
    state.lastHoverSlot = null;
  });

  /* -----------------------------
     Click open/close + drag scroll
     - Clicking the SAME key again closes it
     - Vertical wheel scroll is NEVER trapped:
       * if user wheel-scrolls vertically, we let page scroll
       * horizontal scrolling remains via trackpad deltaX and drag
     ----------------------------- */
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = 0;
  const DRAG_THRESHOLD = 6;

  pianoHost.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDown = true;
    startX = e.clientX;
    startScrollLeft = pianoHost.scrollLeft;
    moved = 0;
    pianoHost.setPointerCapture?.(e.pointerId);
  });

  pianoHost.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > DRAG_THRESHOLD) {
      pianoHost.scrollLeft = startScrollLeft - dx;
    }
  });

  pianoHost.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;

    // drag gesture -> no click
    if (moved > DRAG_THRESHOLD) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    if (el.closest(".note")) return;

    const key = el.closest(".piano-key");
    if (!key || !pianoHost.contains(key)) return;

    const slot = Number(key.dataset.slot);
    const filtered = getFilteredProjects();
    const project = filtered[slot];
    if (!project) return;

    // click sound always
    playNote(pickNoteLetter(project, slot));

    // toggle open/close
    state.openIndex = (state.openIndex === slot) ? null : slot;
    render();

    // only scroll into view if opening
    if (state.openIndex !== null) {
      const opened = pianoHost.querySelector(`.piano-key[data-slot="${slot}"]`);
      opened?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
  
  pianoHost.addEventListener("pointercancel", () => { isDown = false; });
document.addEventListener("pointerdown", (e) => {
  if (state.openIndex === null) return;

  // Only handle clicks when Projects section exists on the page
  if (!root.contains(e.target)) return;

  // If click is inside a key, do nothing (key click toggles itself)
  if (e.target.closest(".piano-key")) return;

  // If click is inside the note panel, do nothing
  if (e.target.closest(".note")) return;

  // Otherwise close
  state.openIndex = null;
  render();
});
  /* -----------------------------
     Wheel behavior FIX
     The real issue: your previous wheel handler converted vertical wheel to horizontal,
     which prevents page from scrolling down.
     New behavior:
       - If the user scrolls vertically (deltaY dominant), let the PAGE scroll.
       - If the user scrolls horizontally (deltaX dominant), let the piano scroll.
     ----------------------------- */
  pianoHost.addEventListener("wheel", (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    // Horizontal intent (trackpad shift or horizontal wheel) -> scroll piano
    if (absX > absY) {
      // allow piano to handle horizontal scroll
      return;
    }

    // Vertical intent -> DO NOT preventDefault, let page scroll naturally
    // (no conversion of deltaY into horizontal scroll)
  }, { passive: true });

  /* -----------------------------
     Projects snap-to-center
     Keep it ONLY when coming DOWN into Projects (not while trying to leave up)
     - snaps when section is >=60% visible
     - only if user is scrolling DOWN
     ----------------------------- */
  let lastScrollY = window.scrollY;
  let snapLock = false;
  let lastSnapAt = 0;

  function centerProjectsSectionSmooth() {
    const r = root.getBoundingClientRect();
    const targetY = window.scrollY + r.top - (window.innerHeight / 2 - r.height / 2);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  const io = new IntersectionObserver(
    (entries) => {
      const ent = entries[0];
      if (!ent) return;

      const nowY = window.scrollY;
      const goingDown = nowY > lastScrollY;
      lastScrollY = nowY;

      // Only snap when user is moving DOWN into the section
      if (!goingDown) return;

      if (ent.intersectionRatio >= 0.6) {
        const now = performance.now();
        if (snapLock) return;
        if (now - lastSnapAt < 650) return;

        snapLock = true;
        lastSnapAt = now;

        centerProjectsSectionSmooth();
        setTimeout(() => { snapLock = false; }, 750);
      }
    },
    { threshold: [0, 0.2, 0.35, 0.5, 0.6, 0.7, 0.85, 1] }
  );

  io.observe(root);

  /* -----------------------------
     Remove ABOUT snapping entirely
     (you asked: it should just go to about section)
     ----------------------------- */

  /* -----------------------------
     INIT
     ----------------------------- */
  langValueEl.textContent = state.language;
  catValueEl.textContent = state.category;

  render();

  window.addEventListener("resize", () => { render(); });
});