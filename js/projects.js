
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

 
  pianoHost.style.setProperty("--open-w", "1200px");
  pianoHost.style.setProperty("--key-w", "150px");
  pianoHost.style.setProperty("--key-w-small", "120px");

  const LANGUAGES = ["All","python","html css js","php sql","react native","react","next","expo","kotlin","java","c++","flutter"];
  const CATEGORIES = ["All","apps","websites","games","ai/ml","ui/ux"];

const PROJECTS = [
 
  {
    title: "PRISM: Social Media Auto-Posting and Analytics",
    description:
      "A scheduling + analytics platform with a content calendar, performance tracking, and automation workflows.",
    language: "react native",
    category: "apps",
    icons: ["react native", "expo", "javascript", "sql", "ui/ux"],
    note: "c",
    keyBg: "assets/projects/prism/key.jpg",
    media: { big: "assets/projects/prism.jpg"},
    links: {
    github: "https://github.com/yourname/prism",
    docs: "https://yourdomain.com/prism/docs",
    website: "https://prism.yourdomain.com"
  }
  },
  {
    title: "SchedU: Teacher Assistant and Workflow Tool",
    description:
      "A school-focused productivity app for organizing lessons, generating classroom materials, and managing activities.",
    language: "react",
    category: "apps",
    icons: ["react", "javascript", "ui/ux"],
    note: "d",
    keyBg: "assets/projects/schedu/key.jpg",
    media: { big: "assets/projects/schedu.jpg"},
  },
  {
    title: "iBotomo: Automation and Utility App for Voting",
    description:
      "A utility-style app that streamlines repetitive tasks with simple flows, screens, and quick actions.",
    language: "kotlin",
    category: "apps",
    icons: ["kotlin", "android", "ui/ux"],
    note: "e",
    keyBg: "assets/projects/ibotomo/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Gabay — Guidance / Helper App",
    description:
      "A structured guide-style app focused on clear navigation, accessible UI, and task-based user flows.",
    language: "react native",
    category: "apps",
    icons: ["react native", "expo", "ui/ux"],
    note: "f",
    keyBg: "assets/projects/gabay/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Viewpoint — Content / Posting App Concept",
    description:
      "An app concept for viewing and sharing posts with emphasis on layout, filtering, and interaction design.",
    language: "react",
    category: "apps",
    icons: ["react", "javascript", "ui/ux"],
    note: "g",
    keyBg: "assets/projects/viewpoint/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Tarot Reading App — Card Draw + Interpretations",
    description:
      "A tarot app with card draws, saved readings, and clean UI for quick interpretation browsing.",
    language: "flutter",
    category: "apps",
    icons: ["flutter", "dart", "ui/ux"],
    note: "a",
    keyBg: "assets/projects/tarot/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Dating App — Profiles + Match Flow Concept",
    description:
      "A mobile concept focused on profile cards, swipe/match interaction, and messaging-ready layouts.",
    language: "react native",
    category: "apps",
    icons: ["react native", "expo", "ui/ux"],
    note: "b",
    keyBg: "assets/projects/dating/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Land Marketing App — Listings + Lead Capture",
    description:
      "A listing app for land/property marketing with filters, gallery pages, and inquiry/lead capture.",
    language: "react",
    category: "apps",
    icons: ["react", "javascript", "ui/ux"],
    note: "c#",
    keyBg: "assets/projects/land-marketing/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Weather App — Forecast UI + Alerts",
    description:
      "A weather app with location-based forecasts, clean cards, and a layout designed for quick scanning.",
    language: "react native",
    category: "apps",
    icons: ["react native", "expo", "ui/ux"],
    note: "d#",
    keyBg: "assets/projects/weather-app/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "University Blood Bank App — Donor + Inventory Flow",
    description:
      "A campus-oriented app concept for donor info, inventory browsing, and request/appointment flow.",
    language: "react",
    category: "apps",
    icons: ["react", "javascript", "ui/ux"],
    note: "f#",
    keyBg: "assets/projects/bloodbank-app/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },

 
  {
    title: "Ju-On Horror Game — Survivable Visual-Novel Style",
    description:
      "A horror game with exploration, puzzles, limited resources, and replayable survival mechanics.",
    language: "html css js",
    category: "games",
    icons: ["html", "css", "javascript"],
    note: "e",
    keyBg: "assets/projects/juon/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Tower Defense Game — Waves + Upgrades",
    description:
      "A strategy game prototype with wave systems, enemy scaling, and upgrade-based progression.",
    language: "java",
    category: "games",
    icons: ["java", "game-dev", "logic"],
    note: "g#",
    keyBg: "assets/projects/tower-defense/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Grimm Runner — Top-Down Survival Runner",
    description:
      "A survival game with movement/combat loops, expanding maps, and performance-focused gameplay logic.",
    language: "flutter",
    category: "games",
    icons: ["flutter", "dart", "game-dev"],
    note: "a#",
    keyBg: "assets/projects/grimm-runner/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Tree Traversal Visualizer — Algorithms Mini-Game",
    description:
      "A small interactive project that visualizes tree traversal steps (DFS/BFS) in a game-like flow.",
    language: "python",
    category: "games",
    icons: ["python", "algorithms", "data-structures"],
    note: "b#",
    keyBg: "assets/projects/tree-traversal/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },

 
  {
    title: "Beth Aven — Website / Landing Page",
    description:
      "A responsive site focused on layout, typography, and clean section-based presentation.",
    language: "html css js",
    category: "websites",
    icons: ["html", "css", "javascript"],
    note: "c",
    keyBg: "assets/projects/beth-aven/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Gabriel — Portfolio / Personal Site",
    description:
      "A personal website emphasizing UI polish, sections, and interactive presentation of work.",
    language: "html css js",
    category: "websites",
    icons: ["html", "css", "javascript", "ui/ux"],
    note: "d",
    keyBg: "assets/projects/gabriel-site/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "League of Legends Login — UI Clone Practice",
    description:
      "A front-end UI recreation project focused on spacing, alignment, and form styling details.",
    language: "html css js",
    category: "websites",
    icons: ["html", "css", "javascript", "ui/ux"],
    note: "e",
    keyBg: "assets/projects/lol-login/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "School Websites — Multiple Academic Builds",
    description:
      "A set of school-based website projects featuring responsive layouts, pages, and components.",
    language: "php sql",
    category: "websites",
    icons: ["php", "sql", "html"],
    note: "f",
    keyBg: "assets/projects/school-websites/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Diversity Globe — Informational Website",
    description:
      "A content-forward site with structured sections, visual hierarchy, and accessible navigation.",
    language: "html css js",
    category: "websites",
    icons: ["html", "css", "javascript"],
    note: "g",
    keyBg: "assets/projects/diversity-globe/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "University Blood Bank Website — Portal Concept",
    description:
      "A web portal concept for donor information, inventory browsing, and request-friendly navigation.",
    language: "react",
    category: "websites",
    icons: ["react", "javascript", "ui/ux"],
    note: "a",
    keyBg: "assets/projects/bloodbank-website/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Weather Website — Forecast Dashboard",
    description:
      "A dashboard-style site that displays weather information with clean UI and readable data cards.",
    language: "html css js",
    category: "websites",
    icons: ["html", "css", "javascript"],
    note: "b",
    keyBg: "assets/projects/weather-website/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },

 
  {
    title: "PRISM — Analytics Intelligence (AI/ML Extension)",
    description:
      "A machine-learning extension for performance prediction and smarter scheduling decisions using historical analytics.",
    language: "python",
    category: "ai/ml",
    icons: ["python", "ml", "time-series"],
    note: "c",
    keyBg: "assets/projects/prism-ml/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "BitMind — Bitcoin Auto-Trading (Predictive Modeling)",
    description:
      "A trading system combining time-series prediction, backtesting, and real-time execution logic for decision-making.",
    language: "python",
    category: "ai/ml",
    icons: ["python", "ml", "time-series", "backtesting"],
    note: "d",
    keyBg: "assets/projects/bitmind/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Neural Interface Programming — EEG Brain-to-Code Prototype",
    description:
      "A research prototype exploring EEG signal processing and transformer-based decoding for real-time intent-to-code translation.",
    language: "python",
    category: "ai/ml",
    icons: ["python", "pytorch", "signal-processing", "transformers"],
    note: "e",
    keyBg: "assets/projects/eeg-brain-to-code/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },

 
  {
    title: "Gabriel — UI System + Visual Polish",
    description:
      "A UI-focused build emphasizing typography, spacing, responsive grids, and interaction details.",
    language: "html css js",
    category: "ui/ux",
    icons: ["ui/ux", "html", "css", "javascript"],
    note: "f",
    keyBg: "assets/projects/ui-gabriel/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "Weather App — UI/UX Case Build",
    description:
      "A design-forward weather UI with readable cards, hierarchy, and polished micro-interactions.",
    language: "react native",
    category: "ui/ux",
    icons: ["ui/ux", "react native", "expo"],
    note: "g",
    keyBg: "assets/projects/ui-weather-app/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
  {
    title: "School Projects — UI Components + Layout Practice",
    description:
      "A collection of UI builds from school work focusing on layout structure, consistency, and clean screens.",
    language: "html css js",
    category: "ui/ux",
    icons: ["ui/ux", "html", "css", "javascript"],
    note: "a#",
    keyBg: "assets/projects/ui-school-projects/key.jpg",
    media: { big: "", midTop: "", midBottom: "", tall: "" },
  },
];



  const NOTE_LETTERS = ["a","b","c","d","e","f","g"];
  const NOTE_BASE = "assets/music/notes";
  const HOVER_COOLDOWN_MS = 120;

  
  const KEY_ANIM_MS = 520;
  const NOTE_ANIM_MS = 380;

  const state = {
    language: "All",
    category: "All",
    openIndex: null,
    lastHoverAt: 0,
    lastHoverSlot: null,
  };

  const normalize = (s) => String(s || "").trim().toLowerCase();
function isNoteInteractiveTarget(target) {
  // anything clickable inside the opened note should not start drag capture
  return !!target.closest(".note a, .note button, .note [role='button'], .note input, .note textarea, .note select");
}
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

  
  function boundaryHasBlack(boundaryIndex) {
    const mod = boundaryIndex % 7;
    return mod === 0 || mod === 1 || mod === 3 || mod === 4 || mod === 5;
  }

 
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

 
function clearMenus() {
  clearMenusAnimated();
}

function openMenu(which) {
  
  if (which === "language") closeMenuAnimated(catFilter);
  if (which === "category") closeMenuAnimated(langFilter);

  const target = (which === "language") ? langFilter : catFilter;
  target.classList.remove("is-closing");
  target.classList.add("is-open");
}

function toggleMenu(which) {
  const target = (which === "language") ? langFilter : catFilter;
  if (target.classList.contains("is-open")) {
    closeMenuAnimated(target);
  } else {
    openMenu(which);
  }
}
const MENU_ANIM_MS = 180;

function closeMenuAnimated(filterEl) {
  if (!filterEl.classList.contains("is-open")) return;

  
  if (filterEl.classList.contains("is-closing")) return;

  filterEl.classList.add("is-closing");

  window.setTimeout(() => {
    filterEl.classList.remove("is-open");
    filterEl.classList.remove("is-closing");
  }, MENU_ANIM_MS);
}

function clearMenusAnimated() {
  closeMenuAnimated(langFilter);
  closeMenuAnimated(catFilter);
}
function renderMenu(menuEl, items, onPick) {
  
  menuEl.innerHTML = "";

  const inner = document.createElement("div");
  inner.className = "filter__menuInner";

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item;
    btn.addEventListener("click", () => onPick(item));
    inner.appendChild(btn);
  });

  menuEl.appendChild(inner);
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
  e.stopPropagation();
  toggleMenu("language");
});

catFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu("category");
});


document.addEventListener("pointerdown", (e) => {
  if (langFilter.contains(e.target) || catFilter.contains(e.target)) return;
  clearMenusAnimated();
});

 
function buildNotePanel(project) {
  const note = document.createElement("div");
  note.className = "note note--hero";

  // keep your open animation
  note.style.opacity = "0";
  note.style.transform = "translateX(-18px)";
  note.style.transition = `opacity ${NOTE_ANIM_MS}ms ease, transform ${NOTE_ANIM_MS}ms ease`;

  // pick ONE image (prefer media.big, fallback to keyBg)
  const m = project.media || {};
  const heroSrc = m.big || project.keyBg || "";

  const bg = document.createElement("div");
  bg.className = "note__bg";
  if (heroSrc) bg.style.backgroundImage = `url("${heroSrc}")`;

  const overlay = document.createElement("div");
  overlay.className = "note__overlay";

  const textGlass = document.createElement("div");
  textGlass.className = "note__glass note__glass--text";

  const title = document.createElement("h2");
  title.className = "note__title";
  title.textContent = project.title || "This is the Project Title";

  const desc = document.createElement("p");
  desc.className = "note__desc";
  desc.textContent = project.description || "This is the project description.";

  textGlass.appendChild(title);
  textGlass.appendChild(desc);

// --- bottom row wrapper (two separate glasses) ---
const metaRow = document.createElement("div");
metaRow.className = "note__metaRow";

/* LEFT: icons glass */
const iconsGlass = document.createElement("div");
iconsGlass.className = "note__glass note__glass--icons";

const iconsWrap = document.createElement("div");
iconsWrap.className = "note__icons";

const icons = Array.isArray(project.icons) ? project.icons : [];
icons.slice(0, 6).forEach((iconKey) => {
  // each icon in its own container (no label hover)
  const item = document.createElement("div");
  item.className = "note__iconItem";

  const img = document.createElement("img");
  img.className = "note__iconImg";
  img.alt = String(iconKey);
  img.src = `assets/icons/${iconKey}.png`;

  item.appendChild(img);
  iconsWrap.appendChild(item);
});

iconsGlass.appendChild(iconsWrap);

// buttons group (NO GLASS CONTAINER)
const links = project.links || {};
const btnWrap = document.createElement("div");
btnWrap.className = "note__btns";

const makeBtn = (label, href, iconSrc) => {
  if (!href) return null;

  const a = document.createElement("a");
  a.className = "note__btn";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", label);

  // IMPORTANT: prevent parent click handlers from hijacking the click
  a.addEventListener("click", (e) => {
    e.stopPropagation(); // don't let the piano key / note handlers eat it
    // bulletproof open (in case something else prevents default)
    window.open(href, "_blank", "noopener,noreferrer");
  });

  const ic = document.createElement("img");
  ic.className = "note__btnIcon";
  ic.src = iconSrc;
  ic.alt = "";
  a.appendChild(ic);

  const t = document.createElement("span");
  t.className = "note__btnLabel";
  t.textContent = label;
  a.appendChild(t);

  return a;
};


const gh = makeBtn("GitHub", links.github, "assets/icons/github.png");
const dc = makeBtn("Docs", links.docs, "assets/icons/document.png");
const ws = makeBtn("Website", links.website, "assets/icons/website.png");
[gh, dc, ws].forEach((b) => b && btnWrap.appendChild(b));

// meta row: icons glass + buttons (no container)
metaRow.appendChild(iconsGlass);
if (btnWrap.childElementCount) metaRow.appendChild(btnWrap);

// overlay order
overlay.appendChild(metaRow);
overlay.appendChild(textGlass);

note.appendChild(bg);
note.appendChild(overlay);
  requestAnimationFrame(() => {
    note.style.opacity = "1";
    note.style.transform = "translateX(0)";
  });

  return note;
}

  function computeKeyCount() {
    const filtered = getFilteredProjects();
    const hostW = pianoHost.clientWidth || window.innerWidth || 1200;

    const approxKeyW = 190;
    const fit = Math.ceil(hostW / approxKeyW);
    const baseline = Math.max(12, fit + 6);
    return Math.max(filtered.length, baseline);
  }

 
  function syncBlackLayerSize(track) {
    const layer = track.querySelector(".blacklayer");
    if (!layer) return;
    
    const fullW = track.scrollWidth || track.getBoundingClientRect().width;
    layer.style.width = `${fullW}px`;
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

    
    syncBlackLayerSize(track);
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

  function applyKeyTransitions(track) {
    track.querySelectorAll(".piano-key").forEach((k) => {
      
      k.style.transition = `flex-basis ${KEY_ANIM_MS}ms ease, width ${KEY_ANIM_MS}ms ease, transform ${KEY_ANIM_MS}ms ease`;
      k.style.willChange = "flex-basis,width,transform";
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
      applyKeyTransitions(track);

      buildBlackLayer(track, KEY_COUNT);
      hideBlackKeysInsideOpen(track);

      
      requestAnimationFrame(() => {
        syncBlackLayerSize(track);
        hideBlackKeysInsideOpen(track);
      });
    });
  }

 
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

 
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = 0;
  const DRAG_THRESHOLD = 6;

pianoHost.addEventListener("pointerdown", (e) => {
  // ✅ allow links/buttons inside note to work normally
  if (isNoteInteractiveTarget(e.target)) return;

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
  // ✅ if they clicked inside note (links/buttons), don't treat it as piano click
  if (isNoteInteractiveTarget(e.target)) {
    isDown = false;
    return;
  }

  if (!isDown) return;
  isDown = false;

  if (moved > DRAG_THRESHOLD) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;
  if (el.closest(".note")) return; // keep your existing behavior

  const key = el.closest(".piano-key");
  if (!key || !pianoHost.contains(key)) return;

  const slot = Number(key.dataset.slot);
  const filtered = getFilteredProjects();
  const project = filtered[slot];
  if (!project) return;

  playNote(pickNoteLetter(project, slot));

  state.openIndex = (state.openIndex === slot) ? null : slot;
  render();

  if (state.openIndex !== null) {
    const opened = pianoHost.querySelector(`.piano-key[data-slot="${slot}"]`);
    opened?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
});

  pianoHost.addEventListener("pointercancel", () => { isDown = false; });

  document.addEventListener("pointerdown", (e) => {
    if (state.openIndex === null) return;
    if (!root.contains(e.target)) return;
    if (e.target.closest(".piano-key")) return;
    if (e.target.closest(".note")) return;

    state.openIndex = null;
    render();
  });

 
  pianoHost.addEventListener("wheel", (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX > absY) return;
  }, { passive: true });
let lastScrollY = window.scrollY;

// measure user intent (fast scroll = pass-through)
let lastWheelAt = 0;
let lastWheelDY = 0;
window.addEventListener("wheel", (e) => {
  lastWheelAt = performance.now();
  lastWheelDY = e.deltaY;
}, { passive: true });

// lock + one-snap-per-entry
let snapLock = false;
let lastSnapAt = 0;
let hasSnappedThisEntry = false;

// “near centered” tolerance so we don’t keep forcing center
const CENTER_TOL = 90; // px
function isProjectsNearCentered() {
  const r = root.getBoundingClientRect();
  const desiredTop = (window.innerHeight - r.height) / 2;
  return Math.abs(r.top - desiredTop) <= CENTER_TOL;
}

// gentle center (still smooth but not fighty)
function centerProjectsSectionSmooth() {
  const r = root.getBoundingClientRect();
  const targetY = window.scrollY + r.top - (window.innerHeight / 2 - r.height / 2);
  window.scrollTo({ top: targetY, behavior: "smooth" });
}

// detect “pass-through” intent:
// - recent wheel was strong
// - or user is still actively scrolling fast
function userIsPassingThrough() {
  const now = performance.now();
  const recentWheel = (now - lastWheelAt) < 140; // ms
  const strongWheel = Math.abs(lastWheelDY) > 85; // tweak: higher = harder to trigger snap
  return recentWheel && strongWheel;
}

// reset entry flag once Projects is mostly out of view
function resetEntryIfLeft() {
  const r = root.getBoundingClientRect();
  // when Projects is well above or well below the viewport, allow snapping next time
  if (r.bottom < 0 || r.top > window.innerHeight) {
    hasSnappedThisEntry = false;
  }
}

const io = new IntersectionObserver(
  (entries) => {
    if (projectsSnapSuspended()) return;

    const ent = entries[0];
    if (!ent) return;

    const nowY = window.scrollY;
    const goingDown = nowY > lastScrollY;
    lastScrollY = nowY;

    resetEntryIfLeft();

    // only snap when scrolling down into Projects
    if (!goingDown) return;

    // if user is trying to fly past, do nothing
    if (userIsPassingThrough()) return;

    // if already centered-ish, don't snap
    if (isProjectsNearCentered()) return;

    // snap threshold (lower than 0.8 feels less "brick wall")
    if (ent.intersectionRatio >= 0.62) {
      const now = performance.now();
      if (snapLock) return;
      if (hasSnappedThisEntry) return;
      if (now - lastSnapAt < 900) return;

      snapLock = true;
      lastSnapAt = now;
      hasSnappedThisEntry = true;

      centerProjectsSectionSmooth();

      // short lock: prevents immediate re-trigger but allows continuing down
      setTimeout(() => { snapLock = false; }, 420);
    }
  },
  { threshold: [0, 0.35, 0.5, 0.62, 0.75, 0.9, 1] }
);

io.observe(root);

 
  langValueEl.textContent = state.language;
  catValueEl.textContent = state.category;

  render();

window.ProjectsPiano = window.ProjectsPiano || {};

window.ProjectsPiano.setCategory = (cat) => {
  const normalized = String(cat || "All");
  state.category = normalized;
  catValueEl.textContent = normalized;
  state.openIndex = null;
  clearMenus();
  render();
};

window.ProjectsPiano.setLanguage = (lang) => {
  const normalized = String(lang || "All");
  state.language = normalized;
  langValueEl.textContent = normalized;
  state.openIndex = null;
  clearMenus();
  render();
};

window.ProjectsPiano.resetFilters = () => {
  state.language = "All";
  state.category = "All";
  langValueEl.textContent = "All";
  catValueEl.textContent = "All";
  state.openIndex = null;
  clearMenus();
  render();
};

  
  window.addEventListener("resize", () => { render(); });

  
  window.addEventListener("load", () => {
    const track = pianoHost.querySelector(".piano-track");
    if (!track) return;
    syncBlackLayerSize(track);
    hideBlackKeysInsideOpen(track);
  });
});