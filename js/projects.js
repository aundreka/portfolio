
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#projects.projects");
  if (!root) return;

  const pianoHost   = root.querySelector("#projectsPiano");
  const filtersPanelEl = root.querySelector("#projectsFiltersPanel");
  const searchToggleBtn = root.querySelector("#projectsSearchToggle");
  const searchToggleMobileBtn = root.querySelector("#projectsSearchToggleMobile");
  const filterToggleBtn = root.querySelector("#projectsFiltersToggle");
  const searchInputEl = root.querySelector("#projectsSearch");
  const searchInputMobileEl = root.querySelector("#projectsSearchMobile");
  const langValueEl = root.querySelector("#langValue");
  const toolValueEl = root.querySelector("#toolValue");
  const catValueEl  = root.querySelector("#catValue");
  const sortValueEl = root.querySelector("#sortValue");
  const langMenuEl  = root.querySelector("#langMenu");
  const toolMenuEl  = root.querySelector("#toolMenu");
  const catMenuEl   = root.querySelector("#catMenu");
  const sortMenuEl  = root.querySelector("#sortMenu");
  const langFilter  = root.querySelector('.filter[data-filter="language"]');
  const toolFilter  = root.querySelector('.filter[data-filter="tool"]');
  const catFilter   = root.querySelector('.filter[data-filter="category"]');
  const sortFilter  = root.querySelector('.filter[data-filter="sort"]');

  if (!pianoHost || !filtersPanelEl || !searchToggleBtn || !filterToggleBtn || !searchInputEl || !langValueEl || !toolValueEl || !catValueEl || !sortValueEl || !langMenuEl || !toolMenuEl || !catMenuEl || !sortMenuEl || !langFilter || !toolFilter || !catFilter || !sortFilter) {
    console.warn("[ProjectsPiano] Missing required DOM elements inside #projects.");
    return;
  }

  const searchToggleButtons = [searchToggleBtn, searchToggleMobileBtn].filter(Boolean);
  const searchInputs = [searchInputEl, searchInputMobileEl].filter(Boolean);

  function getResponsivePianoMetrics() {
    const viewportW = window.innerWidth || document.documentElement.clientWidth || 1440;

    if (viewportW <= 560) {
      return {
        openWidth: "94vw",
        keyWidth: "108px",
        keyWidthSmall: "84px",
        approxKeyWidth: 124,
        blackWidth: 52,
      };
    }

    if (viewportW <= 820) {
      return {
        openWidth: "88vw",
        keyWidth: "132px",
        keyWidthSmall: "96px",
        approxKeyWidth: 150,
        blackWidth: 64,
      };
    }

    return {
      openWidth: "1200px",
      keyWidth: "150px",
      keyWidthSmall: "120px",
      approxKeyWidth: 190,
      blackWidth: 74,
    };
  }

  function applyResponsivePianoMetrics() {
    const metrics = getResponsivePianoMetrics();
    pianoHost.style.setProperty("--open-w", metrics.openWidth);
    pianoHost.style.setProperty("--key-w", metrics.keyWidth);
    pianoHost.style.setProperty("--key-w-small", metrics.keyWidthSmall);
  }

  function isCompactProjectsViewport() {
    return window.matchMedia("(max-width: 1300px)").matches;
  }

  let lastViewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  let lastViewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

  function setFiltersTrayOpen(isOpen) {
    root.classList.toggle("filters-open", isOpen);
    if (isOpen) {
      root.classList.remove("search-open");
      searchToggleBtn.setAttribute("aria-expanded", "false");
    }
    filterToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!isOpen) clearMenusAnimated();
  }

  function setSearchTrayOpen(isOpen) {
    root.classList.toggle("search-open", isOpen);
    if (isOpen) {
      root.classList.remove("filters-open");
      filterToggleBtn.setAttribute("aria-expanded", "false");
      clearMenusAnimated();
      window.setTimeout(() => {
        const activeInput = isCompactProjectsViewport() && searchInputMobileEl ? searchInputMobileEl : searchInputEl;
        activeInput.focus();
      }, 60);
    } else if (!state.search) {
      searchInputs.forEach((input) => input.blur());
    }
    searchToggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function syncSearchInputs(value) {
    searchInputs.forEach((input) => {
      if (input.value !== value) input.value = value;
    });
  }

  function handleSearchInput(event) {
    state.search = event.currentTarget.value || "";
    state.openIndex = null;
    syncSearchInputs(state.search);
    clearMenus();
    setSearchTrayOpen(Boolean(state.search) || root.classList.contains("search-open"));
    render({ restoreScrollLeft: 0 });
  }

  applyResponsivePianoMetrics();

  const LANGUAGES = ["All","python","html css js","php sql","react native","react","next","expo","kotlin","java","c++","flutter"];
  const TOOLS = ["All","React","React Native","Flutter","Laravel","Node.js","Supabase","GCE","Vercel","REST APIs","Tableau","Power BI","Git","Docker","Figma"];
  const CATEGORIES = ["All","apps","websites","games","ai/ml","ui/ux"];
  const SORT_OPTIONS = ["Newest","Oldest","A-Z"];


  const PROJECT_DATA = window.PROJECTS_DATA || {};
  const RAW_PROJECTS = Array.isArray(PROJECT_DATA.RAW_PROJECTS) ? PROJECT_DATA.RAW_PROJECTS : [];
  const PROJECT_DATE_SEEDS = Array.isArray(PROJECT_DATA.PROJECT_DATE_SEEDS) ? PROJECT_DATA.PROJECT_DATE_SEEDS : [];


  function formatDateKeyword(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  const PROJECTS = RAW_PROJECTS.map((project, index) => {
    const publishedAt = PROJECT_DATE_SEEDS[index] || "2024-01-01";
    return {
      ...project,
      publishedAt,
      dateKeyword: formatDateKeyword(publishedAt),
    };
  });



  const NOTE_LETTERS = ["a","b","c","d","e","f","g"];
  const NOTE_BASE = "assets/music/notes";
  const HOVER_COOLDOWN_MS = 120;

  
  const KEY_ANIM_MS = 520;
  const NOTE_ANIM_MS = 380;

  const state = {
    language: "All",
    tool: "All",
    category: "All",
    sort: "Newest",
    search: "",
    openIndex: null,
    lastHoverAt: 0,
    lastHoverSlot: null,
  };

  const normalize = (s) => String(s || "").trim().toLowerCase();
  const hasNormalized = (items, needle) => items.some((item) => normalize(item) === normalize(needle));

  function getProjectToolTags(project) {
    const tags = new Set();
    const add = (value) => {
      if (value) tags.add(normalize(value));
    };

    const language = normalize(project?.language);
    const category = normalize(project?.category);
    const title = normalize(project?.title);
    const description = normalize(project?.description);

    add(project?.language);
    (project?.icons || []).forEach(add);
    (project?.tools || []).forEach(add);

    if (language === "react") {
      add("React");
      add("Vercel");
      add("REST APIs");
      add("Figma");
    }

    if (language === "react native") {
      add("React Native");
      add("REST APIs");
      add("Figma");
    }

    if (language === "flutter") add("Flutter");

    if (language === "php sql") {
      add("Laravel");
      add("REST APIs");
    }

    if (language === "html css js") {
      add("Git");
      add("Figma");
    }

    if (category === "ui/ux") add("Figma");
    if (category === "apps" || category === "websites") add("Git");

    if (category === "ai/ml" || title.includes("analytics") || description.includes("analytics")) {
      add("Tableau");
      add("Power BI");
    }

    if (title.includes("dashboard") || description.includes("dashboard")) add("Power BI");

    return [...tags];
  }

  function matchesSearch(project) {
    const searchNeedle = normalize(state.search);
    if (!searchNeedle) return true;

    const haystack = [
      project?.title,
      project?.description,
      project?.language,
      project?.category,
      project?.dateKeyword,
      project?.publishedAt,
      ...(project?.icons || []),
      ...getProjectToolTags(project),
    ]
      .map((value) => normalize(value))
      .join(" ");

    return haystack.includes(searchNeedle);
  }
function isNoteInteractiveTarget(target) {
  // anything clickable inside the opened note should not start drag capture
  return !!target.closest(".note a, .note button, .note [role='button'], .note input, .note textarea, .note select");
}
  function matchesFilters(project) {
    if (!project) return false;
    const langOk = state.language === "All" || normalize(project.language) === normalize(state.language);
    const toolOk = state.tool === "All" || hasNormalized(getProjectToolTags(project), state.tool);
    const catOk  = state.category === "All" || normalize(project.category) === normalize(state.category);
    const searchOk = matchesSearch(project);
    return langOk && toolOk && catOk && searchOk;
  }

  function compareProjects(a, b) {
    if (state.sort === "Oldest") {
      return String(a.publishedAt).localeCompare(String(b.publishedAt));
    }

    if (state.sort === "A-Z") {
      return String(a.title || "").localeCompare(String(b.title || ""));
    }

    return String(b.publishedAt).localeCompare(String(a.publishedAt));
  }

  function getFilteredProjects() {
    return PROJECTS.filter(matchesFilters).sort(compareProjects);
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
  if (which === "language") closeMenuAnimated(toolFilter);
  if (which === "language") closeMenuAnimated(sortFilter);
  if (which === "tool") closeMenuAnimated(langFilter);
  if (which === "tool") closeMenuAnimated(catFilter);
  if (which === "tool") closeMenuAnimated(sortFilter);
  if (which === "category") closeMenuAnimated(langFilter);
  if (which === "category") closeMenuAnimated(toolFilter);
  if (which === "category") closeMenuAnimated(sortFilter);
  if (which === "sort") closeMenuAnimated(langFilter);
  if (which === "sort") closeMenuAnimated(toolFilter);
  if (which === "sort") closeMenuAnimated(catFilter);

  const target =
    which === "language" ? langFilter :
    which === "tool" ? toolFilter :
    which === "category" ? catFilter :
    sortFilter;
  target.classList.remove("is-closing");
  target.classList.add("is-open");
}

function toggleMenu(which) {
  const target =
    which === "language" ? langFilter :
    which === "tool" ? toolFilter :
    which === "category" ? catFilter :
    sortFilter;
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
  closeMenuAnimated(toolFilter);
  closeMenuAnimated(catFilter);
  closeMenuAnimated(sortFilter);
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
  setFiltersTrayOpen(false);
  render({ restoreScrollLeft: 0 });
});

renderMenu(toolMenuEl, TOOLS, (picked) => {
  state.tool = picked;
  toolValueEl.textContent = picked;
  state.openIndex = null;
  clearMenus();
  setFiltersTrayOpen(false);
  render({ restoreScrollLeft: 0 });
});

renderMenu(catMenuEl, CATEGORIES, (picked) => {
  state.category = picked;
  catValueEl.textContent = picked;
  state.openIndex = null;
  clearMenus();
  setFiltersTrayOpen(false);
  render({ restoreScrollLeft: 0 });
});

renderMenu(sortMenuEl, SORT_OPTIONS, (picked) => {
  state.sort = picked;
  sortValueEl.textContent = picked;
  state.openIndex = null;
  clearMenus();
  setFiltersTrayOpen(false);
  render({ restoreScrollLeft: 0 });
});

  searchToggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSearchTrayOpen(!root.classList.contains("search-open"));
      if (!root.classList.contains("search-open")) return;
      const activeInput = isCompactProjectsViewport() && searchInputMobileEl ? searchInputMobileEl : searchInputEl;
      activeInput.select?.();
    });
  });

filterToggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  setFiltersTrayOpen(!root.classList.contains("filters-open"));
});

langFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu("language");
});

toolFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu("tool");
});

catFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu("category");
});

sortFilter.querySelector(".filter__btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu("sort");
});

searchInputs.forEach((input) => {
  input.addEventListener("input", handleSearchInput);
});


document.addEventListener("pointerdown", (e) => {
  if (searchToggleButtons.some((button) => button.contains(e.target)) || filterToggleBtn.contains(e.target) || filtersPanelEl.contains(e.target)) return;
  clearMenusAnimated();
  setSearchTrayOpen(false);
  setFiltersTrayOpen(false);
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
if (isCompactProjectsViewport()) {
  overlay.appendChild(textGlass);
  overlay.appendChild(metaRow);
} else {
  overlay.appendChild(metaRow);
  overlay.appendChild(textGlass);
}

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
    const { approxKeyWidth } = getResponsivePianoMetrics();
    const approxKeyW = approxKeyWidth;
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
    const { blackWidth } = getResponsivePianoMetrics();
    const blackW = blackWidth;

    
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
      const blackLeft = x;
      const blackRight = x + w;

      if (blackRight > left && blackLeft < right) bk.classList.add("is-hidden");
    });
  }

  function applyKeyTransitions(track) {
    track.querySelectorAll(".piano-key").forEach((k) => {
      
      k.style.transition = `flex-basis ${KEY_ANIM_MS}ms ease, width ${KEY_ANIM_MS}ms ease, transform ${KEY_ANIM_MS}ms ease`;
      k.style.willChange = "flex-basis,width,transform";
    });
  }

  function render(options = {}) {
    const { focusSlot = null, restoreScrollLeft = null, focusBehavior = "smooth" } = options;
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

    if (filtered.length === 0) {
      const emptyHint = document.createElement("div");
      emptyHint.className = "projects-empty";
      emptyHint.textContent = "No projects found";
      pianoHost.appendChild(emptyHint);
    }

    requestAnimationFrame(() => {
      applyKeyTransitions(track);

      buildBlackLayer(track, KEY_COUNT);
      hideBlackKeysInsideOpen(track);

      
      requestAnimationFrame(() => {
        if (Number.isFinite(restoreScrollLeft)) {
          pianoHost.scrollLeft = restoreScrollLeft;
        }

        if (Number.isFinite(focusSlot)) {
          const focusKey = pianoHost.querySelector(`.piano-key[data-slot="${focusSlot}"]`);
          focusKey?.scrollIntoView({ behavior: focusBehavior, inline: "center", block: "nearest" });
        }

        syncBlackLayerSize(track);
        hideBlackKeysInsideOpen(track);
      });
    });
  }

  let isDown = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startWindowScrollY = 0;
  let didPageScrollDuringPointer = false;
  let moved = 0;
  let movedY = 0;
  let dragAxis = null;
  const DRAG_THRESHOLD = 10;
  const AXIS_LOCK_BIAS = 10;
  const PAGE_SCROLL_TAP_CANCEL_PX = 8;

function getNearestProjectSlot() {
  const keys = [...pianoHost.querySelectorAll(".piano-key:not(.is-empty)")];
  if (!keys.length) return 0;

  const hostRect = pianoHost.getBoundingClientRect();
  const hostCenter = hostRect.left + hostRect.width / 2;
  let nearestSlot = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  keys.forEach((key) => {
    const rect = key.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(center - hostCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestSlot = Number(key.dataset.slot || 0);
    }
  });

  return nearestSlot;
}

function focusProjectSlot(slot, behavior = "smooth") {
  const key = pianoHost.querySelector(`.piano-key[data-slot="${slot}"]`);
  key?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
}

pianoHost.addEventListener("pointerdown", (e) => {
  // ✅ allow links/buttons inside note to work normally
  if (isNoteInteractiveTarget(e.target)) return;

  if (e.pointerType === "mouse" && e.button !== 0) return;
  isDown = true;
  startX = e.clientX;
  startY = e.clientY;
  startScrollLeft = pianoHost.scrollLeft;
  startWindowScrollY = window.scrollY;
  didPageScrollDuringPointer = false;
  moved = 0;
  movedY = 0;
  dragAxis = null;
  if (e.pointerType === "mouse") {
    pianoHost.setPointerCapture?.(e.pointerId);
  }
});

pianoHost.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(window.scrollY - startWindowScrollY) > PAGE_SCROLL_TAP_CANCEL_PX) {
    didPageScrollDuringPointer = true;
  }
  moved = Math.max(moved, Math.abs(dx));
  movedY = Math.max(movedY, Math.abs(dy));

  if (!dragAxis && (moved > DRAG_THRESHOLD || movedY > DRAG_THRESHOLD)) {
    if (moved >= DRAG_THRESHOLD && moved - movedY >= AXIS_LOCK_BIAS) {
      dragAxis = "x";
    } else if (movedY >= DRAG_THRESHOLD && movedY - moved >= AXIS_LOCK_BIAS) {
      dragAxis = "y";
      didPageScrollDuringPointer = true;
      isDown = false;
      if (e.pointerType === "mouse" && pianoHost.hasPointerCapture?.(e.pointerId)) {
        pianoHost.releasePointerCapture?.(e.pointerId);
      }
      return;
    }
  }

  if (dragAxis === "x" && moved > DRAG_THRESHOLD) {
    pianoHost.scrollLeft = startScrollLeft - dx;
  }
});

pianoHost.addEventListener("pointerup", (e) => {
  // ✅ if they clicked inside note (links/buttons), don't treat it as piano click
  if (isNoteInteractiveTarget(e.target)) {
    isDown = false;
    didPageScrollDuringPointer = false;
    return;
  }

  if (!isDown) return;
  isDown = false;

  if (Math.abs(window.scrollY - startWindowScrollY) > PAGE_SCROLL_TAP_CANCEL_PX) {
    didPageScrollDuringPointer = true;
  }

  if (didPageScrollDuringPointer) {
    dragAxis = null;
    didPageScrollDuringPointer = false;
    return;
  }

  if (dragAxis === "x" && moved > DRAG_THRESHOLD) return;
  if (dragAxis === "y" && movedY > DRAG_THRESHOLD) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;

  const key = el.closest(".piano-key");
  if (!key || !pianoHost.contains(key)) return;

  const slot = Number(key.dataset.slot);
  const filtered = getFilteredProjects();
  const project = filtered[slot];
  if (!project) return;

  playNote(pickNoteLetter(project, slot));

  state.openIndex = (state.openIndex === slot) ? null : slot;
  render({ focusSlot: slot });
});

  pianoHost.addEventListener("pointercancel", () => {
    isDown = false;
    dragAxis = null;
    didPageScrollDuringPointer = false;
  });

  document.addEventListener("pointerdown", (e) => {
    if (state.openIndex === null) return;
    if (!root.contains(e.target)) return;
    if (e.target.closest(".piano-key")) return;
    if (e.target.closest(".note")) return;

    const restoreScrollLeft = pianoHost.scrollLeft;
    state.openIndex = null;
    render({ restoreScrollLeft });
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
    if (isCompactProjectsViewport()) return;
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
  toolValueEl.textContent = state.tool;
  catValueEl.textContent = state.category;
  sortValueEl.textContent = state.sort;
  syncSearchInputs(state.search);

  render();

window.ProjectsPiano = window.ProjectsPiano || {};

window.ProjectsPiano.setCategory = (cat) => {
  const normalized = String(cat || "All");
  state.category = normalized;
  catValueEl.textContent = normalized;
  state.openIndex = null;
  clearMenus();
  render({ restoreScrollLeft: 0 });
};

window.ProjectsPiano.setLanguage = (lang) => {
  const normalized = String(lang || "All");
  state.language = normalized;
  langValueEl.textContent = normalized;
  state.openIndex = null;
  clearMenus();
  render({ restoreScrollLeft: 0 });
};

window.ProjectsPiano.setTool = (tool) => {
  const normalized = String(tool || "All");
  state.tool = normalized;
  toolValueEl.textContent = normalized;
  state.openIndex = null;
  clearMenus();
  render({ restoreScrollLeft: 0 });
};

  window.ProjectsPiano.resetFilters = () => {
  state.language = "All";
  state.tool = "All";
  state.category = "All";
  state.sort = "Newest";
  state.search = "";
  langValueEl.textContent = "All";
  toolValueEl.textContent = "All";
  catValueEl.textContent = "All";
  sortValueEl.textContent = "Newest";
  syncSearchInputs("");
  setSearchTrayOpen(false);
  state.openIndex = null;
  clearMenus();
  render({ restoreScrollLeft: 0 });
};

  
  window.addEventListener("resize", () => {
    const nextViewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const nextViewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const widthDelta = Math.abs(nextViewportWidth - lastViewportWidth);
    const heightDelta = Math.abs(nextViewportHeight - lastViewportHeight);
    const compactViewport = isCompactProjectsViewport();

    lastViewportWidth = nextViewportWidth;
    lastViewportHeight = nextViewportHeight;

    // Mobile browsers fire resize while the URL bar hides/shows during scroll.
    // Ignore those height-only jitters so the accordion does not rebuild/reset.
    if (compactViewport && widthDelta < 2 && heightDelta > 0) {
      return;
    }

    applyResponsivePianoMetrics();
    if (!compactViewport) {
      clearMenusAnimated();
    }
    render({ restoreScrollLeft: pianoHost.scrollLeft, focusBehavior: "auto" });
  });

  
  window.addEventListener("load", () => {
    const track = pianoHost.querySelector(".piano-track");
    if (!track) return;
    syncBlackLayerSize(track);
    hideBlackKeysInsideOpen(track);
  });
});
