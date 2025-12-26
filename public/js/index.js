// js/index.js
// Carousel + labels + drag + stationary-cat + cat-wrap click → About

/***********************
 * DOM LOOKUPS
 ***********************/
const carousel = document.querySelector(".piano-carousel");
const stage = document.querySelector(".stage");
const prevBtn = document.getElementById("prevbtn");
const nextBtn = document.getElementById("nextbtn");
const pianos = document.querySelectorAll(".piano");
const totalPianos = pianos.length;

const catEl   = document.querySelector("#cat");        // <model-viewer>
const catWrap = document.querySelector(".cat-wrap");   // wrapper div
const catBtn  = document.getElementById("cat-click");  // invisible button overlay

/***********************
 * CAROUSEL CONSTANTS
 ***********************/
let currentIndex = 0;
const angleStep    = 360 / totalPianos;
const radius       = 520;
const heightFactor = 60;
const offsetFactor = 60;
const duration     = 800; // ms — used for transform transitions & label timing
const colors       = ["red", "blue", "green", "yellow", "purple"];

/***********************
 * ABOUT FOCUS HELPERS
 ***********************/
function enterAboutFocus() {
  document.body.classList.add("about-focus");
  keepCatFullyOnscreen();
}

function exitAboutFocus() {
  document.body.classList.remove("about-focus");
  document.querySelector(".piano-carousel")?.classList.remove("piano-lift");
  catWrap?.classList.remove("cat-fixed-left");
  // Re-show the current label after fade back
  setTimeout(() => {
    if (typeof showLabelForIndex === "function") showLabelForIndex(currentIndex);
  }, 200);
}

function keepCatFullyOnscreen() {
  if (!catWrap) return;
  const pad = 16;
  const rect = catWrap.getBoundingClientRect();

  const cs = getComputedStyle(catWrap);
  const leftPx = parseFloat(cs.left);
  if (!Number.isFinite(leftPx)) return;

  const maxLeft = Math.max(pad, window.innerWidth - rect.width - pad);
  const minLeft = pad;
  const clamped = Math.min(Math.max(leftPx, minLeft), maxLeft);
  if (Math.abs(clamped - leftPx) > 0.5) {
    catWrap.style.left = `${clamped}px`;
  }
}

window.addEventListener("resize", keepCatFullyOnscreen, { passive: true });
window.addEventListener("orientationchange", keepCatFullyOnscreen, { passive: true });
/***********************
 * BACKGROUND PALETTE SYNC
 ***********************/
const bgRoot = document.querySelector(".background");
const bgBubbles = bgRoot ? Array.from(bgRoot.querySelectorAll("span")) : [];

// Define per-piano color palettes (background + three bubble tints)
const BG_PALETTES = {
  red: {
    base: "#ffffff", // light base
    tints: ["#FFB3BA", "#FFD1CF", "#FFC7C7"] // pastel reds/pinks
  },
  blue: {
    base: "#ffffff",
    tints: ["#B3E5FC", "#CBEFFF", "#A7D8FF"] // pastel blues
  },
  green: {
    base: "#ffffff",
    tints: ["#C8E6C9", "#DFF6DD", "#B2E2B2"] // pastel greens
  },
  yellow: {
    base: "#ffffff",
    tints: ["#FFF9C4", "#FFFDE7", "#FFF3B0"] // pastel yellows
  },
  purple: {
    base: "#ffffff",
    tints: ["#E1BEE7", "#F3E5F5", "#D1C4E9"] // pastel purples/lavender
  }
};

function applyBackgroundTheme(colorName = "purple") {
  if (!bgRoot || bgBubbles.length === 0) return;
  const theme = BG_PALETTES[colorName] || BG_PALETTES.purple;

  // Set base background
  bgRoot.style.background = theme.base;

  // Distribute bubble tints and matching glows
  bgBubbles.forEach((el, i) => {
    const tint = theme.tints[i % theme.tints.length];
    el.style.color = tint;
    // subtle glow sized similarly to your original
    const glow = 5 + (i % 6); // 5..10 vmin
    el.style.boxShadow = `${(i % 2 ? "" : "-")}40vmin 0 ${glow}vmin currentColor`;
  });
}

// Call once on load (after initial layout)
applyBackgroundTheme(colors[currentIndex % colors.length]);

/***********************
 * AUDIO: INTRO + PIANO SFX
 ***********************/
const startAudio = new Audio("assets/music/start.mp3");
startAudio.preload = "auto";
startAudio.volume = 0.6;
startAudio.loop = false;

const pianoSounds = Array.from({ length: Math.max(1, totalPianos) }, (_, i) => {
  const a = new Audio(`assets/music/piano${i + 1}.wav`);
  a.preload = "auto";
  a.volume = 0.8;
  return a;
});

function tryPlayAudio(audio) {
  if (!audio || !audio.paused) return;
  const playAttempt = audio.play();
  if (playAttempt?.then) {
    playAttempt.catch(() => {
      const resume = () => {
        if (audio.paused) {
          audio.play().finally(() => {
            window.removeEventListener("pointerdown", resume);
            window.removeEventListener("keydown", resume);
          });
        }
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    });
  }
}

function playFromStart(audio) {
  if (!audio) return;
  try { audio.pause(); } catch(_) {}
  try { audio.currentTime = 0; } catch(_) {}
  const p = audio.play();
  if (p?.then) {
    p.catch(() => {
      const resume = () => {
        try { audio.currentTime = 0; } catch(_) {}
        audio.play().finally(() => {
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        });
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    });
  }
}

function stopAllAudio() {
  try { startAudio.pause(); } catch(_) {}
  try { startAudio.currentTime = 0; } catch(_) {}
  for (const a of pianoSounds) {
    try { a.pause(); } catch(_) {}
    try { a.currentTime = 0; } catch(_) {}
  }
}

function playPianoSound(index) {
  const audio = pianoSounds[(index % pianoSounds.length + pianoSounds.length) % pianoSounds.length];
  playFromStart(audio);
}

/***********************
 * LABEL COLORS
 ***********************/
const labelColorMap = {
  red:    "rgba(255, 76, 76, 0.4)",
  blue:   "rgba(137, 210, 220, 0.5)",
  green:  "rgba(46, 204, 113, 0.4)",
  yellow: "rgba(255, 214, 51, 0.6)",
  purple: "rgba(155, 89, 182, 0.4)",
};

function cssToRgb(color) {
  if (color.startsWith("#")) {
    const n = color.slice(1);
    return { r: parseInt(n.slice(0,2),16), g: parseInt(n.slice(2,4),16), b: parseInt(n.slice(4,6),16) };
  }
  const tmp = document.createElement("div");
  tmp.style.color = color;
  document.body.appendChild(tmp);
  const cs = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);
  const m = cs.match(/(\d+),\s*(\d+),\s*(\d+)/);
  return m ? { r:+m[1], g:+m[2], b:+m[3] } : { r:0, g:0, b:0 };
}
function pickTextColor(bg) {
  const { r, g, b } = cssToRgb(bg);
  const L = 0.2126*r + 0.7152*g + 0.0722*b;
  return L > 170 ? "#2b2b2b" : "#ffffff";
}

/***********************
 * MODEL COLORING (optional)
 ***********************/
pianos.forEach((piano, index) => {
  piano.addEventListener("load", async () => {
    try {
      const model = piano.model;
      const materials = model?.materials;
      if (!materials?.length) return;
      const material = materials[0];
      const colorFactor = getColorFactor(colors[index % colors.length]);
      if (material.pbrMetallicRoughness) {
        material.pbrMetallicRoughness.setBaseColorFactor(colorFactor);
        material.pbrMetallicRoughness.baseColorTexture = null;
      }
      if (material.alphaMode) material.alphaMode = "OPAQUE";
    } catch(_) {}
  });
});

function getColorFactor(color) {
  const colorMap = {
    red: [1, 0.9, 0.9, 1],
    blue: [0.9, 0.95, 1, 1],
    green: [0.9, 1, 0.9, 1],
    yellow: [1, 1, 0.9, 1],
    purple: [0.9, 0.9, 1, 1],
  };
  return colorMap[color] || [1, 1, 1, 1];
}

/***********************
 * TRANSITIONS
 ***********************/
pianos.forEach((piano) => {
  piano.style.transition = `transform ${duration}ms ease-out`;
});

/***********************
 * LABEL OVERLAY
 ***********************/
const labels = ["Apps", "Websites", "Games", "AI/ML", "UI/UX"];
let labelEl = document.getElementById("piano-label");

function ensureLabelEl() {
  if (labelEl) return labelEl;
  const el = document.createElement("div");
  el.id = "piano-label";
  (stage || document.body).appendChild(el);
  labelEl = el;
  return labelEl;
}

function setLabelText(text) {
  ensureLabelEl();
  labelEl.textContent = text;
}

function showLabelForIndex(frontIdx) {
  const text = labels[frontIdx % labels.length] || "";
  setLabelText(text);
  const pianoColorName = colors[frontIdx % colors.length];
  const bg = labelColorMap[pianoColorName] || "var(--pink)";
  labelEl.style.background = bg;
  labelEl.style.color = "#fff";
  labelEl.classList.remove("show");
  void labelEl.offsetWidth;
  labelEl.classList.add("show");
}

function hideLabel() {
  ensureLabelEl();
  labelEl.classList.remove("show");
}

/***********************
 * GEOMETRY HELPERS
 ***********************/
function getCenterPiano() {
  return pianos[currentIndex]; // front one
}

/***********************
 * ROTATION / LAYOUT
 ***********************/
function normalizeDeg(d) {
  let a = d % 360;
  if (a > 180) a -= 360;
  if (a <= -180) a += 360;
  return a;
}

function animateRotation(targetIndex) {
  hideLabel();
  const targetAngle = targetIndex * angleStep;

  pianos.forEach((piano, index) => {
    const baseAngle = index * angleStep;
    let effectiveAngle = normalizeDeg(baseAngle - targetAngle);
    const rad = (effectiveAngle * Math.PI) / 180;

    let x = Math.sin(rad) * radius;
    let z = Math.cos(rad) * radius;
    let y = (1 - Math.abs(Math.cos(rad))) * heightFactor;
    let offsetX = Math.sin(rad) * offsetFactor;

    if (Math.abs(effectiveAngle) < 30) {
      y = -30;
      offsetX = 0;
    }

    const orbitX = -effectiveAngle; // face viewer
    piano.setAttribute("camera-orbit", `${orbitX}deg 90deg 90deg`);
    piano.style.transform =
      `translateX(${x + offsetX}px) translateZ(${z}px) translateY(${-y}px)`;

    const depth = Math.cos(rad);
    piano.style.zIndex = String(Math.round((depth + 1) * 100));
  });

  currentIndex = ((targetIndex % totalPianos) + totalPianos) % totalPianos;
  applyBackgroundTheme(colors[currentIndex % colors.length]);

  setTimeout(() => showLabelForIndex(currentIndex), duration * 0.85);

  if (window.__hasInitializedCarousel__) {
    stopAllAudio();
    playPianoSound(currentIndex);
  } else {
    window.__hasInitializedCarousel__ = true;
  }
}

/***********************
 * BUTTON CONTROLS
 ***********************/
nextBtn?.addEventListener("click", () => {
  animateRotation((currentIndex + 1) % totalPianos);
  playCatOnceThenIdle();
});

prevBtn?.addEventListener("click", () => {
  animateRotation((currentIndex - 1 + totalPianos) % totalPianos);
  playCatOnceThenIdle();
});

/***********************
 * INITIAL LAYOUT + LABEL
 ***********************/
animateRotation(0);
setTimeout(() => {
  applyBackgroundTheme(colors[currentIndex % colors.length]);
  showLabelForIndex?.(0);
}, 0);

/***********************
 * DRAG CONTROLS (front piano only)
 ***********************/
let isDragging = false;
let startX = 0, startY = 0;
let lastOrbitX = 90, lastOrbitY = 90;

function startDrag(event) {
  isDragging = true;
  hideLabel();

  startX = event.clientX || event.touches?.[0]?.clientX || 0;
  startY = event.clientY || event.touches?.[0]?.clientY || 0;

  const centerPiano = getCenterPiano();
  const orbit = (centerPiano.getAttribute("camera-orbit") || "0deg 90deg 90deg").split(" ");
  lastOrbitX = parseFloat(orbit[0]);
  lastOrbitY = parseFloat(orbit[1]);

  event.preventDefault?.();
}

function drag(event) {
  if (!isDragging) return;

  const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
  const clientY = event.clientY || event.touches?.[0]?.clientY || 0;

  const deltaX = clientX - startX;
  const deltaY = clientY - startY;

  const sensitivityX = 0.2;
  const sensitivityY = 0.15;

  let newOrbitX = lastOrbitX - deltaX * sensitivityX;
  let newOrbitY = lastOrbitY - deltaY * sensitivityY;

  newOrbitY = Math.max(75, Math.min(105, newOrbitY));
  newOrbitX = Math.max(-30, Math.min(30, newOrbitX));

  const centerPiano = getCenterPiano();
  centerPiano.setAttribute("camera-orbit", `${newOrbitX}deg ${newOrbitY}deg 90deg`);
}

function stopDrag() {
  isDragging = false;
  setTimeout(() => {
    const centerPiano = getCenterPiano();
    centerPiano.setAttribute("camera-orbit", "0deg 90deg 90deg");
    setTimeout(() => showLabelForIndex(currentIndex), duration * 0.85);
  }, 500);
}

carousel?.addEventListener("mousedown", startDrag);
carousel?.addEventListener("touchstart", startDrag, { passive: true });
window.addEventListener("mousemove", drag, { passive: true });
window.addEventListener("touchmove", drag, { passive: true });
window.addEventListener("mouseup", stopDrag, { passive: true });
window.addEventListener("touchend", stopDrag, { passive: true });

/***********************
 * CAT CAMERA FOLLOW (no click nudge; clicks handled by wrapper/button)
 ***********************/
if (catEl) {
  let targetAz = 0, targetEl = 90;
  let curAz = 0, curEl = 90;
  const yawMax = 30;
  const pitchMax = 15;
  const dist = "3m";
  const ease = 0.12;

  function onMove(e) {
    const rect = catEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = e.touches ? e.touches[0].clientX : e.clientX;
    const my = e.touches ? e.touches[0].clientY : e.clientY;
    const nx = Math.max(-1, Math.min(1, (mx - cx) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (my - cy) / (rect.height / 2)));
    targetAz = -nx * yawMax;
    targetEl = 90 + -ny * pitchMax;
  }

  function tick() {
    if (!isDragging) {
      curAz += (targetAz - curAz) * ease;
      curEl += (targetEl - curEl) * ease;
      catEl.setAttribute("camera-orbit", `${curAz.toFixed(2)}deg ${curEl.toFixed(2)}deg ${dist}`);
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  tick();

  // Idle on load
  catEl.addEventListener("load", () => {
    const anims = catEl.availableAnimations;
    if (anims && anims.length > 2) {
      catEl.animationName = anims[2]; // Idle
      catEl.setAttribute("animation-loop", "true");
      catEl.play();
    }
  });
}

/***********************
 * CAT-WRAP CLICK → ABOUT
 ***********************/
function focusAboutScroll() {
  const about = document.getElementById("about");
  if (!about) return;
  enterAboutFocus();
  about.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Prefer the overlay button (keyboard accessible); fallback to wrapper
catBtn?.addEventListener("click", (e) => { e.preventDefault(); focusAboutScroll(); });
catWrap?.addEventListener("click", (e) => {
  // If the overlay button exists, let it handle; otherwise the wrapper handles
  if (catBtn) return;
  e.preventDefault();
  focusAboutScroll();
});

/***********************
 * Scroll sync: enter when at About; exit when above
 ***********************/
window.addEventListener("scroll", () => {
  const about = document.getElementById("about");
  if (!about) return;

  const docTop = window.scrollY || document.documentElement.scrollTop;
  const aboutTop = about.getBoundingClientRect().top + window.scrollY;

  if (docTop >= aboutTop - 10) {
    enterAboutFocus();
    // Optional: slide cat while focused
    catWrap?.classList.add("cat-fixed-left");
    document.querySelector(".piano-carousel")?.classList.add("piano-lift");
    keepCatFullyOnscreen();
  } else {
    exitAboutFocus();
    if (catWrap) catWrap.style.left = ""; // clear any clamped inline left
  }
}, { passive: true });

/***********************
 * Intro heading + audio
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("hero-heading");
  const text = "Hi, I'm Aundreka Perez.";
  let i = 0;

  (function type() {
    if (i < text.length) {
      heading.textContent += text.charAt(i++);
      setTimeout(type, 10);
    }
  })();

  tryPlayAudio(startAudio);

  const gestureStart = () => {
    tryPlayAudio(startAudio);
    window.removeEventListener("pointerdown", gestureStart);
    window.removeEventListener("keydown", gestureStart);
  };
  window.addEventListener("pointerdown", gestureStart);
  window.addEventListener("keydown", gestureStart);
});

/***********************
 * Cat idle helper (used by buttons)
 ***********************/
function playCatOnceThenIdle() {
  if (!catEl) return;
  const anims = catEl.availableAnimations;
  if (!anims || anims.length < 5) return;

  catEl.animationName = anims[4];
  catEl.setAttribute("animation-loop", "true");
  catEl.play();

  const len = catEl.duration;
  if (len > 0) {
    setTimeout(() => {
      if (anims.length > 2) {
        catEl.animationName = anims[2];
        catEl.setAttribute("animation-loop", "true");
        catEl.play();
      }
    }, len * 1000);
  }
}


