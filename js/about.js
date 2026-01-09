document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("aboutTrack");
  const aboutSection = document.querySelector(".about");
  const projectsSection = document.getElementById("projects");

  if (!scroller || !aboutSection) {
    console.warn("[About] Missing #aboutTrack or .about");
    return;
  }

  /* --------------------------
     Find NEXT section after About
     -------------------------- */
  const getNextSection = (el) => {
    let n = el?.nextElementSibling;
    while (n) {
      if (n.matches?.("section, footer, main, header")) return n;
      n = n.nextElementSibling;
    }
    return null;
  };
  const nextAfterAbout = getNextSection(aboutSection);

  /* --------------------------
     Scrubber + stars
     -------------------------- */
  const scrubber = document.createElement("div");
  scrubber.className = "about-scrubber";
  scrubber.innerHTML = `
    <div class="about-scrubber__track">
      <div class="about-scrubber__thumb" role="slider" aria-label="Scroll About"></div>
    </div>
  `;
  aboutSection.prepend(scrubber);

  const stars = document.createElement("div");
  stars.className = "about-stars";
  stars.innerHTML = `
    <div class="stars s1"></div>
    <div class="stars s2"></div>
    <div class="stars s3"></div>
  `;
  aboutSection.prepend(stars);

  const track = scrubber.querySelector(".about-scrubber__track");
  const thumb = scrubber.querySelector(".about-scrubber__thumb");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // NOTE: you had threshold 0.9 but checked ratio >= 0.6
        // Keeping your behavior but matching threshold to avoid "never visible" cases
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) scrubber.classList.add("visible");
        else scrubber.classList.remove("visible");
      });
    },
    { threshold: [0, 0.6, 0.9, 1] }
  );
  observer.observe(aboutSection);

  function sizeThumb() {
    const view = scroller.clientWidth;
    const full = scroller.scrollWidth;
    const ratio = Math.max(view / full, 0.08);
    thumb.style.width = `${track.clientWidth * ratio}px`;
    syncThumb();
  }

  function syncThumb() {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const pct = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
    const maxThumbTravel = track.clientWidth - thumb.clientWidth;
    thumb.style.transform = `translateX(${pct * maxThumbTravel}px)`;
  }

  /* --------------------------
     Theme swapping helpers
     -------------------------- */
  let modalPinnedTheme = false; // kept (you use it in clearAboutAccent)
  let lastAccent = "#ffffff";
  let activeThemeBtn = null;

  const profileImg = aboutSection.querySelector(".intro-photo");

  let setAboutAccent = () => {};
  let clearAboutAccent = () => {};

  const rememberOriginalSrc = (el) => {
    if (!el) return;
    if (!el.dataset.srcOriginal) el.dataset.srcOriginal = el.getAttribute("src") || "";
  };

  const toWhiteAsset = (src) => {
    if (!src) return src;
    if (src.includes("profile.png")) return src.replace("profile.png", "profile-white.png");

    if (src.endsWith(".svg") && !src.endsWith("-white.svg")) return src.replace(".svg", "-white.svg");
    return src;
  };

  const setThemeAssetsForBlock = (on, blockEl) => {
    if (!blockEl) return;
    const imgs = blockEl.querySelectorAll("img.note-img");
    imgs.forEach((img) => {
      rememberOriginalSrc(img);
      const base = img.dataset.srcOriginal;
      img.src = on ? toWhiteAsset(base) : base;
    });
  };

  /* --------------------------
     Scrubber drag
     -------------------------- */
  let dragging = false, dragStartX = 0, dragStartLeft = 0;

  thumb.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
    dragStartLeft = scroller.scrollLeft;
    thumb.setPointerCapture(e.pointerId);
  });

  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const maxThumbTravel = track.clientWidth - thumb.clientWidth;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxThumbTravel <= 0) return;

    const scrollDelta = (dx / maxThumbTravel) * maxScroll;
    scroller.scrollLeft = Math.min(Math.max(dragStartLeft + scrollDelta, 0), maxScroll);
    syncThumb();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
    thumb.addEventListener(t, () => (dragging = false))
  );

  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const maxThumbTravel = track.clientWidth - thumb.clientWidth;
    const clamped = Math.max(0, Math.min(x - thumb.clientWidth / 2, maxThumbTravel));
    const pct = maxThumbTravel > 0 ? clamped / maxThumbTravel : 0;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = pct * maxScroll;
    syncThumb();
  });

  window.addEventListener("resize", sizeThumb);

  /* --------------------------
     Snap helpers (Projects is now ABOVE About)
     -------------------------- */
  const isAtFarLeft = () => scroller.scrollLeft <= 1;
  const isAtFarRight = () => scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;

  const isBottomAligned = () => {
    const rect = aboutSection.getBoundingClientRect();
    return rect.bottom <= window.innerHeight + 1;
  };
  const isTopAligned = () => {
    const rect = aboutSection.getBoundingClientRect();
    return rect.top >= -1;
  };

  const snapToBottom = () => aboutSection.scrollIntoView({ block: "end", behavior: "smooth" });

  const snapToCenter = () => {
    const top = aboutSection.offsetTop;
    const center = top - (window.innerHeight - aboutSection.offsetHeight) / 2;
    window.scrollTo({ top: center, behavior: "smooth" });
  };

  const snapToProjects = () => {
    if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const snapToNextAfterAbout = () => {
    if (nextAfterAbout) nextAfterAbout.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* --------------------------
     Vertical snapping into About
     (works whether entering from Projects above OR from below)
     -------------------------- */
  const ENTER_RATIO = 0.6;     // your preferred value
  const CENTER_TOL = 10;
  const SNAP_LOCK_MS = 450;
  let centerSnapping = false;

  const aboutVisibleRatio = () => {
    const r = aboutSection.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    const clamped = Math.max(0, Math.min(visible, r.height));
    return r.height > 0 ? clamped / r.height : 0;
  };

  const isAboutCentered = () => {
    const r = aboutSection.getBoundingClientRect();
    const desiredTop = (window.innerHeight - r.height) / 2;
    return Math.abs(r.top - desiredTop) <= CENTER_TOL;
  };

  const snapAboutToCenter = (behavior = "smooth") => {
    if (centerSnapping) return;
    centerSnapping = true;

    const sectionTopOnPage = window.scrollY + aboutSection.getBoundingClientRect().top;
    const centerTop = sectionTopOnPage - (window.innerHeight - aboutSection.offsetHeight) / 2;

    window.scrollTo({ top: centerTop, behavior });

    setTimeout(() => (centerSnapping = false), SNAP_LOCK_MS);
  };

  // Wheel-based snap into center (global)
  window.addEventListener(
    "wheel",
    (e) => {
      // ignore wheel when the user is intentionally horizontal scrolling inside aboutTrack
if (scroller && (e.target === scroller || scroller.contains(e.target))) return;

      const ratio = aboutVisibleRatio();

      // If About is sufficiently visible but not centered, snap it in.
      if (ratio >= ENTER_RATIO && !isAboutCentered()) {
        e.preventDefault();

        snapAboutToCenter("smooth");
      }
    },
    { passive: false }
  );

  // Scroll-end snap (touchpad/drag scroll) into center
  let scrollEndTimer = null;
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (centerSnapping) return;

      const nowY = window.scrollY;
      const dirDown = nowY > lastScrollY;
      lastScrollY = nowY;

      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        const ratio = aboutVisibleRatio();
        if (ratio >= ENTER_RATIO && !isAboutCentered()) snapAboutToCenter("smooth");
      }, 120);
    },
    { passive: true }
  );

  /* --------------------------
     Horizontal wheel inside aboutTrack
     - scrolls horizontally
     - exits vertically to Projects (up) or next section (down)
     -------------------------- */
// ---- Trackpad-safe wheel routing for #aboutTrack ----
let wheelRaf = 0;
let wheelAccum = 0;
let lastWheelT = 0;

function wheelToPixels(e) {
  // deltaMode: 0=pixel, 1=line, 2=page
  const LINE = 16;
  const PAGE = window.innerHeight;
  const mul = e.deltaMode === 1 ? LINE : (e.deltaMode === 2 ? PAGE : 1);
  return { dx: e.deltaX * mul, dy: e.deltaY * mul };
}

scroller.addEventListener("wheel", (e) => {
  // If your cursor is over a clickable UI inside the scroller, don't hijack.
  if (e.target.closest('button, a, input, textarea, [role="button"]')) return;

  // Kill bubbling early so the window-level wheel snap doesn't fight us
  e.stopPropagation();
  e.preventDefault();
centerSnapping = true;
setTimeout(() => (centerSnapping = false), 220);

  const { dx, dy } = wheelToPixels(e);

  // Trackpads often provide both dx and dy. Decide intent by magnitude.
  const intentHorizontal = Math.abs(dx) > Math.abs(dy) * 0.75;

  // Use horizontal intent when present, otherwise map vertical to horizontal (your design)
  const delta = intentHorizontal ? dx : dy;

  // Accumulate and apply in rAF to avoid jitter from high-frequency wheel events
  wheelAccum += delta;

  const now = performance.now();
  lastWheelT = now;

  if (!wheelRaf) {
    wheelRaf = requestAnimationFrame(() => {
      wheelRaf = 0;

      // apply scroll
      scroller.scrollLeft += wheelAccum;
      wheelAccum = 0;

      syncThumb();

      // ---- Edge exit rules (same idea as yours, but AFTER applying scroll) ----
      const atLeft  = scroller.scrollLeft <= 1;
      const atRight = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;

      // If user is trying to go "up" (negative dy) and they're at far-left, allow exit to Projects
      if (dy < 0 && atLeft) {
        // Let the page handle the next wheel moment after we finish this frame
        // (we already prevented this event, so do a clean exit ourselves)
        if (!isTopAligned()) snapToCenter();
        else snapToProjects();
      }

      // If user is trying to go "down" (positive dy) and they are at far-right AND bottom aligned, exit to next section
      if (dy > 0 && atRight) {
        if (!isBottomAligned()) snapToBottom();
        else snapToNextAfterAbout();
      }
    });
  }
}, { passive: false });


  /* --------------------------
     Pointer-drag horizontal scroll
     -------------------------- */
  let isDown = false, startX = 0, startLeft = 0;

  scroller.addEventListener("pointerdown", (e) => {
    if (e.target.closest('button, a, input, textarea, [role="button"]')) return;
    isDown = true;
    startX = e.clientX;
    startLeft = scroller.scrollLeft;
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    scroller.scrollLeft = startLeft - (e.clientX - startX);
    syncThumb();
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((t) =>
    scroller.addEventListener(t, () => (isDown = false))
  );

  /* --------------------------
     Staff SVG + wave stuff (unchanged)
     -------------------------- */
  const noteBlocks = aboutSection.querySelectorAll(".note-block");
  const staffLinesEl = aboutSection.querySelector(".staff-lines");

  if (staffLinesEl && noteBlocks.length) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "staff-svg");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    const paths = [];
    for (let i = 0; i < 5; i++) {
      const p = document.createElementNS(svgNS, "path");
      p.classList.add(`line-${i + 1}`);
      svg.appendChild(p);
      paths.push(p);
    }
    staffLinesEl.appendChild(svg);

    const defs = document.createElementNS(svgNS, "defs");
    const grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", "staffGrad");
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");

    const s0 = document.createElementNS(svgNS, "stop");
    s0.setAttribute("offset", "0%");
    s0.setAttribute("stop-color", "#ffffff");
    s0.setAttribute("stop-opacity", "0.95");

    const s1 = document.createElementNS(svgNS, "stop");
    s1.setAttribute("offset", "45%");
    s1.setAttribute("stop-color", "#ffffff");
    s1.setAttribute("stop-opacity", "0.95");

    const s2 = document.createElementNS(svgNS, "stop");
    s2.setAttribute("offset", "100%");
    s2.setAttribute("stop-color", "#ffffff");
    s2.setAttribute("stop-opacity", "0.95");

    grad.appendChild(s0);
    grad.appendChild(s1);
    grad.appendChild(s2);
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);

    const setProfileTheme = (on) => {
      if (!profileImg) return;
      rememberOriginalSrc(profileImg);
      const base = profileImg.dataset.srcOriginal;
      profileImg.src = on ? toWhiteAsset(base) : base;
    };

    setAboutAccent = (btn) => {
      if (activeThemeBtn && activeThemeBtn !== btn) {
        activeThemeBtn.classList.remove("theme-on");
        setThemeAssetsForBlock(false, activeThemeBtn);
      }

      const accent = getComputedStyle(btn).getPropertyValue("--note-color").trim() || "#ffffff";
      lastAccent = accent;
      activeThemeBtn = btn;

      aboutSection.classList.add("stars-on");
      aboutSection.style.setProperty("--about-accent", accent);
      setProfileTheme(true);

      s2.setAttribute("stop-color", `color-mix(in srgb, ${accent} 55%, #ffffff)`);

      btn.classList.add("theme-on");
      setThemeAssetsForBlock(true, btn);
    };

    clearAboutAccent = () => {
      if (modalPinnedTheme) return;

      if (activeThemeBtn) {
        activeThemeBtn.classList.remove("theme-on");
        setThemeAssetsForBlock(false, activeThemeBtn);
      }

      activeThemeBtn = null;
      lastAccent = "#ffffff";

      aboutSection.classList.remove("stars-on");
      aboutSection.style.setProperty("--about-accent", "#ffffff");
      setProfileTheme(false);

      s2.setAttribute("stop-color", "#ffffff");
    };

    let waveHoverEl = null;
    let isWaveActive = false;
    let releaseT = 0;
    let releasing = false;
    const RELEASE_MS = 520;

    let amp = 0;
    let ampTarget = 0;
    let lastT = performance.now();

    let mouseX = 0;
    let mouseVX = 0;
    let lastMouseX = 0;

    const AMP_MAX = 70;
    const SMOOTH = 0.12;

    function staffBaseYs(h) {
      const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--staff-gap")) || 48;
      const mid = h * 0.5;
      return [mid - 2 * gap, mid - 1 * gap, mid, mid + 1 * gap, mid + 2 * gap];
    }

    function catmullRomToBezier(points) {
      if (points.length < 2) return "";
      let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(
          2
        )}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
      }
      return d;
    }

    function setMouseXFromEvent(e) {
      const r = staffLinesEl.getBoundingClientRect();
      const x = e.clientX - r.left;
      const clamped = Math.max(0, Math.min(x, r.width));
      mouseVX = clamped - lastMouseX;
      lastMouseX = clamped;
      mouseX = clamped;
    }

    let W = 1;
    let SIGMA0 = 60;

    const gauss = (x, c, sigma) => {
      const d = x - c;
      return Math.exp(-(d * d) / (2 * sigma * sigma));
    };

    const edgeFade = (x) => {
      const t = x / W;
      const s = Math.sin(t * Math.PI);
      return Math.pow(s, 0.9);
    };

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function releaseBounce(t) {
      const fall = 1 - easeOutCubic(t);
      const bounce = 0.32 * Math.sin((t * Math.PI) * 3) * (1 - t);
      return Math.max(0, fall + bounce);
    }

    function rippleProfile(x, lineIdx) {
      const activeStrength = isWaveActive ? 1 : (releasing ? releaseBounce(releaseT) : 0);
      if (activeStrength <= 0) return 0;

      const center = mouseX;

      const lineBias = (lineIdx - 2) * 5;
      const sigma = SIGMA0 * (1 + Math.abs(lineIdx - 2) * 0.06);
      const L = sigma * (3.5 + lineIdx * 0.05);
      const c = center + lineBias * 6;

      const w0 = 25.0;
      const w1 = 5.95 - lineIdx * 0.03;
      const w2 = 1.54 - Math.abs(lineIdx - 2) * 0.04;

      const asym = 2 * (lineIdx % 2 === 0 ? 1 : -1);

      const g0 = gauss(x, c, sigma);
      const gL =
        gauss(x, c - L * (1.0 + asym), sigma * 1.03) +
        gauss(x, c + L * (1.0 - asym), sigma * 0.98);
      const g2 =
        gauss(x, c - 2 * L * (1.0 + asym * 0.6), sigma * 1.08) +
        gauss(x, c + 2 * L * (1.0 - asym * 0.6), sigma * 1.02);

      const raw = w0 * g0 + w1 * gL + w2 * g2;
      const norm = w0 + 2 * w1 + 2 * w2;

      const base = raw / norm;

      const peak = gauss(x, c, sigma * 0.95);
      const PEAK_BOOST = 0.85;

      return (base + PEAK_BOOST * peak) * activeStrength;
    }

    function renderBulge() {
      const rect = staffLinesEl.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      W = w;
      SIGMA0 = Math.max(42, w * 0.01);

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const baseYs = staffBaseYs(h);

      const step = Math.max(18, Math.min(40, w / 42));
      const count = Math.ceil(w / step);

      for (let line = 0; line < 5; line++) {
        const y0 = baseYs[line];
        const lineScale = 1 - (Math.abs(line - 2) * 0.07);

        const pts = [];
        for (let i = 0; i <= count; i++) {
          const x = (i / count) * w;
          const env = rippleProfile(x, line) * edgeFade(x);
          const y = y0 - (amp * lineScale * env);
          pts.push({ x, y });
        }
        paths[line].setAttribute("d", catmullRomToBezier(pts));
      }
    }

    function wrapTitleLetters(titleEl) {
      if (!titleEl) return;
      if (titleEl.dataset.lettersWrapped === "1") return;

      const text = titleEl.textContent || "";
      titleEl.textContent = "";

      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "letter";
        span.innerHTML = ch === " " ? "&nbsp;" : ch;
        titleEl.appendChild(span);
      }
      titleEl.dataset.lettersWrapped = "1";
    }

    noteBlocks.forEach((b) => wrapTitleLetters(b.querySelector(".note-title")));

    function tick(now) {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      amp += (ampTarget - amp) * (1 - Math.pow(1 - SMOOTH, dt * 60));

      if (!isWaveActive && releasing) {
        releaseT += (dt * 1000) / RELEASE_MS;
        if (releaseT >= 1) {
          releaseT = 1;
          releasing = false;
        }
      }

      renderBulge();

      if (waveHoverEl) {
        const rect = staffLinesEl.getBoundingClientRect();

        const elCenterX = (el) => {
          const r = el.getBoundingClientRect();
          return (r.left + r.width / 2) - rect.left;
        };

        const envAt = (x) => {
          const clampedX = Math.max(0, Math.min(x, W));
          return rippleProfile(clampedX, 2) * edgeFade(clampedX);
        };

        const strength = amp / AMP_MAX;

        const imgs = waveHoverEl.querySelectorAll(".note-img");
        imgs.forEach((img) => {
          const x = elCenterX(img);
          const env = envAt(x);

          const lift = (amp * 0.85) * env;
          const driftTarget = Math.max(-10, Math.min(10, mouseVX * 0.45)) * strength * env;
          const tiltTarget  = Math.max(-10, Math.min(10, mouseVX * 0.65)) * strength * env;

          const curD = parseFloat(img.style.getPropertyValue("--wave-drift-x")) || 0;
          const curT = parseFloat((img.style.getPropertyValue("--wave-tilt") || "0").replace("deg","")) || 0;

          const nextD = curD + (driftTarget - curD) * 0.18;
          const nextT = curT + (tiltTarget  - curT) * 0.16;

          img.style.setProperty("--wave-lift", `${lift}px`);
          img.style.setProperty("--wave-drift-x", `${nextD}px`);
          img.style.setProperty("--wave-tilt", `${nextT}deg`);
        });

        const letters = waveHoverEl.querySelectorAll(".note-title .letter");
        letters.forEach((sp) => {
          const x = elCenterX(sp);
          const env = envAt(x);

          const lift = (amp * 0.22) * env;
          const driftTarget = Math.max(-8, Math.min(8, mouseVX * 0.30)) * strength * env;
          const tiltTarget  = Math.max(-8, Math.min(8, mouseVX * 0.40)) * strength * env;

          const curD = parseFloat(sp.style.getPropertyValue("--l-drift-x")) || 0;
          const curT = parseFloat((sp.style.getPropertyValue("--l-tilt") || "0").replace("deg","")) || 0;

          const nextD = curD + (driftTarget - curD) * 0.20;
          const nextT = curT + (tiltTarget  - curT) * 0.18;

          sp.style.setProperty("--l-lift", `${lift}px`);
          sp.style.setProperty("--l-drift-x", `${nextD}px`);
          sp.style.setProperty("--l-tilt", `${nextT}deg`);
        });
      }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    noteBlocks.forEach((btn) => {
      btn.addEventListener("pointerenter", (e) => {
        setAboutAccent(btn);

        isWaveActive = true;
        releasing = false;
        releaseT = 0;

        ampTarget = AMP_MAX;
        waveHoverEl = btn;
        btn.classList.add("wave-active");
        setMouseXFromEvent(e);
      });

      btn.addEventListener("pointermove", (e) => {
        if (!isWaveActive) return;
        setMouseXFromEvent(e);
      });

      btn.addEventListener("pointerleave", () => {
        isWaveActive = false;
        releasing = true;
        releaseT = 0;

        ampTarget = 0;

        btn.classList.remove("wave-active");
        btn.classList.add("wave-releasing");

        clearAboutAccent();

        setTimeout(() => {
          btn.classList.remove("wave-releasing");

          btn.querySelectorAll(".note-img").forEach((img) => {
            img.style.setProperty("--wave-lift", `0px`);
            img.style.setProperty("--wave-drift-x", `0px`);
            img.style.setProperty("--wave-tilt", `0deg`);
          });

          btn.querySelectorAll(".note-title .letter").forEach((sp) => {
            sp.style.setProperty("--l-lift", `0px`);
            sp.style.setProperty("--l-drift-x", `0px`);
            sp.style.setProperty("--l-tilt", `0deg`);
          });
        }, 520);

        if (waveHoverEl === btn) waveHoverEl = null;
      });

      // IMPORTANT: modal click removed (you said redesign)
      // btn.addEventListener("click", ...)  <-- removed on purpose
    });
  } else {
    console.warn("[About] staff-lines not found or no .note-block elements.");
  }

  /* --------------------------
     Init sizes
     -------------------------- */
  sizeThumb();
  window.addEventListener("load", () => {
    sizeThumb();
    syncThumb();
  });
  requestAnimationFrame(() => {
    sizeThumb();
    syncThumb();
  });
});

(() => {
  const buttons = document.querySelectorAll(".note-block");
  if (!buttons.length) return;

  
  const cache = new Map();
  const getAudio = (src) => {
    if (!cache.has(src)) {
      const a = new Audio(src);
      a.preload = "auto";
      a.volume = 0.75;
      cache.set(src, a);
    }
    return cache.get(src);
  };

  
let audioUnlocked = false;
const unlockAudio = () => {
  if (audioUnlocked) return;
  audioUnlocked = true;

  buttons.forEach((btn) => {
    const src = btn.dataset.fx;
    if (!src) return;

    const a = getAudio(src);

    // prime silently — NEVER unmute here
    const oldVol = a.volume;
    a.volume = 0;      // extra safety
    a.muted = true;

    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
      // keep muted; restore volume (still muted)
      a.volume = oldVol;
    }).catch(() => {});
  });

  window.removeEventListener("pointerdown", unlockAudio);
  window.removeEventListener("keydown", unlockAudio);
};


  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

  
  const lastPlay = new WeakMap();
  const COOLDOWN_MS = 180;

  buttons.forEach((btn) => {
    if (btn.dataset.color) btn.style.setProperty("--note-color", btn.dataset.color);

btn.addEventListener("pointerenter", () => {
  const src = btn.dataset.fx;
  if (!src) return;

  const now = performance.now();
  const last = lastPlay.get(btn) || 0;
  if (now - last < COOLDOWN_MS) return;
  lastPlay.set(btn, now);

  const a = getAudio(src);

  a.muted = false;      // ✅ only unmute for real playback
  a.volume = 0.75;

  try { a.currentTime = 0; } catch (_) {}
  a.play().catch(() => {});
});

  });
})();

