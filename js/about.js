document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("aboutTrack");
  const aboutSection = document.querySelector(".about");
  const projectsSection = document.getElementById("projects");
  const compactAboutQuery = window.matchMedia("(max-width: 900px)");
  const hoverCapableQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

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
  const isCompactAbout = () => compactAboutQuery.matches;
  const canUseHover = () => hoverCapableQuery.matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // NOTE: you had threshold 0.9 but checked ratio >= 0.6
        // Keeping your behavior but matching threshold to avoid "never visible" cases
        if (!isCompactAbout() && entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          scrubber.classList.add("visible");
        } else {
          scrubber.classList.remove("visible");
        }
      });
    },
    { threshold: [0, 0.6, 0.9, 1] }
  );
  observer.observe(aboutSection);

  const interestsRevealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.07 }
  );

  document.querySelectorAll(".interests-mobile-gallery .rv").forEach((el) => {
    interestsRevealObserver.observe(el);
  });

  const desktopInterests = document.querySelector(".interests-desktop");
  if (desktopInterests) {
    const trackEl = desktopInterests.querySelector(".interests-desktop__track");
    const dots = Array.from(desktopInterests.querySelectorAll(".interests-desktop__dot"));
    const prevBtn = desktopInterests.querySelector(".interests-desktop__arrow--prev");
    const nextBtn = desktopInterests.querySelector(".interests-desktop__arrow--next");
    const panels = Array.from(desktopInterests.querySelectorAll(".interests-desktop__panel-inner"));

    const updateDesktopInterests = () => {
      if (!trackEl) return;
      const panelWidth = Math.max(trackEl.clientWidth, 1);
      const nextIndex = Math.round(trackEl.scrollLeft / panelWidth);
      dots.forEach((dot, index) => dot.classList.toggle("is-active", index === nextIndex));
      panels.forEach((panel, index) => panel.classList.toggle("is-in", index === nextIndex));
      if (prevBtn) prevBtn.disabled = nextIndex <= 0;
      if (nextBtn) nextBtn.disabled = nextIndex >= dots.length - 1;
    };

    const goToDesktopInterest = (index) => {
      if (!trackEl) return;
      trackEl.scrollTo({ left: trackEl.clientWidth * index, behavior: "smooth" });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToDesktopInterest(index));
      dot.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        goToDesktopInterest(index);
      });
    });

    const goPrev = () => {
      const current = dots.findIndex((dot) => dot.classList.contains("is-active"));
      goToDesktopInterest(Math.max(current - 1, 0));
    };

    const goNext = () => {
      const current = dots.findIndex((dot) => dot.classList.contains("is-active"));
      goToDesktopInterest(Math.min(current + 1, dots.length - 1));
    };

    prevBtn?.addEventListener("click", goPrev);
    nextBtn?.addEventListener("click", goNext);
    prevBtn?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      goPrev();
    });
    nextBtn?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      goNext();
    });

    trackEl.addEventListener("scroll", updateDesktopInterests, { passive: true });
    window.addEventListener("resize", updateDesktopInterests);
    updateDesktopInterests();
  }

  const setupScrollReveals = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealGroups = isCompactAbout()
      ? [
          [...document.querySelectorAll(".intro-block")],
          [...document.querySelectorAll(".staff-track > .note-block")],
          [...document.querySelectorAll('.note-block[data-category="education"] .education-panel')],
          [...document.querySelectorAll("#contact .contact__intro, #contact .contact__form, #contact .contact__actions")],
        ]
      : [
          [...document.querySelectorAll("#contact .contact__intro, #contact .contact__actions, #contact .contact__form")],
        ];

    const revealTargets = revealGroups.flat().filter(Boolean);
    if (!revealTargets.length) return;

    revealTargets.forEach((el) => el.classList.add("scroll-reveal-mobile"));

    if (reduceMotion) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const mobileRevealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealGroups.forEach((group) => {
      group.forEach((el, index) => {
        el.style.setProperty("--scroll-reveal-delay", `${index * 70}ms`);
        mobileRevealObserver.observe(el);
      });
    });
  };

  setupScrollReveals();

  if (isCompactAbout()) {
    scrubber.remove();
    stars.remove();
    return;
  }

  function sizeThumb() {
    if (isCompactAbout()) {
      scrubber.classList.remove("visible");
      thumb.style.width = "";
      thumb.style.transform = "translateX(0)";
      return;
    }

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

  function centerExpandedPanel(btn) {
    if (!btn || isCompactAbout()) return;

    const panel = btn.querySelector(".note-panel");
    if (!panel) return;

    // Wait for hover layout to apply, then measure the real panel box.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panelRect = panel.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();

        if (!panelRect.width || !scrollerRect.width) return;

        const panelCenter = panelRect.left + panelRect.width / 2;
        const viewportCenter = scrollerRect.left + scrollerRect.width / 2;
        const leftBias = 80;
        const delta = panelCenter - (viewportCenter - leftBias);

        if (Math.abs(delta) < 4) return;

        const maxScroll = Math.max(scroller.scrollWidth - scroller.clientWidth, 0);
        const nextLeft = Math.max(0, Math.min(scroller.scrollLeft + delta, maxScroll));
        scroller.scrollTo({ left: nextLeft, behavior: "smooth" });
        requestAnimationFrame(syncThumb);
      });
    });
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
    if (isCompactAbout()) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartLeft = scroller.scrollLeft;
    thumb.setPointerCapture(e.pointerId);
  });

  thumb.addEventListener("pointermove", (e) => {
    if (isCompactAbout()) return;
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
    if (isCompactAbout()) return;
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
  compactAboutQuery.addEventListener?.("change", sizeThumb);

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

  const isEnteringAbout = (dir) => {
    const r = aboutSection.getBoundingClientRect();
    if (dir > 0) return r.top >= 0; // scrolling down into About
    if (dir < 0) return r.bottom <= window.innerHeight; // scrolling up into About
    return false;
  };

  // Wheel-based snap into center (global)
  window.addEventListener(
    "wheel",
    (e) => {
      if (isCompactAbout()) return;
      // ignore wheel when inside About; handled by the About scroller
      if (e.target.closest(".about")) return;

      const dir = Math.sign(e.deltaY);
      if (!isEnteringAbout(dir)) return;

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
        if (ratio >= ENTER_RATIO && !isAboutCentered() && isEnteringAbout(dirDown ? 1 : -1)) {
          snapAboutToCenter("smooth");
        }
      }, 120);
    },
    { passive: true }
  );

  /* --------------------------
     Horizontal wheel inside aboutTrack
     - scrolls horizontally
     - exits vertically to Projects (up) or next section (down)
     -------------------------- */
  scroller.addEventListener(
    "wheel",
    (e) => {
      if (isCompactAbout()) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const hasHorizontalIntent = absX > absY || e.shiftKey;

      const delta = hasHorizontalIntent ? e.deltaX : e.deltaY;
      if (delta === 0) return;

      // Allow vertical exit only at edges.
      if (!hasHorizontalIntent) {
        if (delta > 0 && isAtFarRight()) return; // exit down to next section
        if (delta < 0 && isAtFarLeft()) return;  // exit up to previous section
      }

      // Otherwise, convert wheel to horizontal scroll.
      e.preventDefault();
      scroller.scrollLeft += delta * 0.9;
      syncThumb();
    },
    { passive: false }
  );

  /* --------------------------
     Pointer-drag horizontal scroll
     -------------------------- */
  let isDown = false, startX = 0, startLeft = 0;

  scroller.addEventListener("pointerdown", (e) => {
    if (isCompactAbout()) return;
    const isInteractive = e.target.closest('button, a, input, textarea, [role="button"]');
    if (isInteractive && e.pointerType === "mouse") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDown = true;
    startX = e.clientX;
    startLeft = scroller.scrollLeft;
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener("pointermove", (e) => {
    if (isCompactAbout()) return;
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
    let activeWaveImages = [];
    let activeWaveLetters = [];
    let isWaveActive = false;
    let releaseT = 0;
    let releasing = false;
    const RELEASE_MS = 620;

    let amp = 0;
    let ampTarget = 0;
    let lastT = performance.now();
    let waveRafId = 0;

    let mouseX = 0;
    let mouseVX = 0;
    let lastMouseX = 0;
    let staffLeft = 0;
    let staffWidth = 1;
    let staffHeight = 1;

    const AMP_MAX = 70;
    const SMOOTH = 0.09;

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

    function updateStaffMetrics() {
      const rect = staffLinesEl.getBoundingClientRect();
      staffLeft = rect.left;
      staffWidth = Math.max(1, rect.width);
      staffHeight = Math.max(1, rect.height);
    }

    function updateWaveTargets() {
      if (!waveHoverEl) {
        activeWaveImages = [];
        activeWaveLetters = [];
        return;
      }

      activeWaveImages = Array.from(waveHoverEl.querySelectorAll(".note-img")).map((img) => {
        const r = img.getBoundingClientRect();
        return { el: img, x: (r.left + r.width / 2) - staffLeft };
      });

      activeWaveLetters = Array.from(waveHoverEl.querySelectorAll(".note-title .letter")).map((letter) => {
        const r = letter.getBoundingClientRect();
        return { el: letter, x: (r.left + r.width / 2) - staffLeft };
      });
    }

    function setMouseXFromEvent(e) {
      const x = e.clientX - staffLeft;
      const clamped = Math.max(0, Math.min(x, staffWidth));
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
      W = staffWidth;
      SIGMA0 = Math.max(42, staffWidth * 0.01);

      svg.setAttribute("viewBox", `0 0 ${staffWidth} ${staffHeight}`);
      const baseYs = staffBaseYs(staffHeight);

      const step = Math.max(20, Math.min(46, staffWidth / 38));
      const count = Math.ceil(staffWidth / step);

      for (let line = 0; line < 5; line++) {
        const y0 = baseYs[line];
        const lineScale = 1 - (Math.abs(line - 2) * 0.07);

        const pts = [];
        for (let i = 0; i <= count; i++) {
          const x = (i / count) * staffWidth;
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

    function startWaveLoop() {
      if (waveRafId) return;
      lastT = performance.now();
      waveRafId = requestAnimationFrame(tick);
    }

    function tick(now) {
      waveRafId = 0;
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
        const envAt = (x) => {
          const clampedX = Math.max(0, Math.min(x, W));
          return rippleProfile(clampedX, 2) * edgeFade(clampedX);
        };

        const strength = amp / AMP_MAX;

        activeWaveImages.forEach(({ el: img, x }) => {
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

        activeWaveLetters.forEach(({ el: sp, x }) => {
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

      mouseVX *= 0.82;

      if (isWaveActive || releasing || Math.abs(amp) > 0.08) {
        waveRafId = requestAnimationFrame(tick);
      } else {
        amp = 0;
        renderBulge();
      }
    }

    updateStaffMetrics();
    renderBulge();

    const refreshWaveLayout = () => {
      if (!isWaveActive && !releasing && !waveHoverEl) return;
      updateStaffMetrics();
      updateWaveTargets();
      renderBulge();
      if (isWaveActive || releasing) startWaveLoop();
    };

    window.addEventListener("resize", refreshWaveLayout, { passive: true });
    scroller.addEventListener("scroll", refreshWaveLayout, { passive: true });

    const endNoteInteraction = (btn) => {
      isWaveActive = false;
      releasing = true;
      releaseT = 0;

      ampTarget = 0;

      btn.classList.remove("wave-active");
      btn.classList.add("wave-releasing");
      btn.classList.remove("is-turned");
      btn.classList.remove("panel-pinned");

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
      }, RELEASE_MS);

      if (waveHoverEl === btn) {
        waveHoverEl = null;
        activeWaveImages = [];
        activeWaveLetters = [];
      }

      startWaveLoop();
    };

    noteBlocks.forEach((btn) => {
      btn.addEventListener("pointerenter", (e) => {
        if (isCompactAbout() || !canUseHover()) return;
        setAboutAccent(btn);
        btn.classList.add("is-turned");

        if (btn.dataset.category === "contact") {
          requestAnimationFrame(() => centerExpandedPanel(btn));
        }

        isWaveActive = true;
        releasing = false;
        releaseT = 0;

        ampTarget = AMP_MAX;
        waveHoverEl = btn;
        updateStaffMetrics();
        updateWaveTargets();
        btn.classList.add("wave-active");
        setMouseXFromEvent(e);
        startWaveLoop();
      });

      btn.addEventListener("pointermove", (e) => {
        if (isCompactAbout() || !canUseHover()) return;
        if (!isWaveActive) return;
        setMouseXFromEvent(e);
        startWaveLoop();
      });

      btn.addEventListener("pointerleave", () => {
        if (isCompactAbout() || !canUseHover()) return;
        endNoteInteraction(btn);
      });

      btn.addEventListener("focusin", () => {
        if (isCompactAbout() || canUseHover()) return;
        setAboutAccent(btn);
        btn.classList.add("is-turned");
      });

      btn.addEventListener("focusout", (e) => {
        if (isCompactAbout() || canUseHover()) return;
        if (btn.contains(e.relatedTarget)) return;
        endNoteInteraction(btn);
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
  const compactAboutQuery = window.matchMedia("(max-width: 900px)");
  const hoverCapableQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const isCompactAbout = () => compactAboutQuery.matches;
  const canUseHover = () => hoverCapableQuery.matches;

  
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
    if (isCompactAbout()) return;
    if (audioUnlocked) return;
    audioUnlocked = true;

    buttons.forEach((btn) => {
      const src = btn.dataset.fx;
      if (!src) return;
      const a = getAudio(src);
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {});
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
      if (isCompactAbout() || !canUseHover()) return;
      const src = btn.dataset.fx;
      if (!src) return;

      const now = performance.now();
      const last = lastPlay.get(btn) || 0;
      if (now - last < COOLDOWN_MS) return;
      lastPlay.set(btn, now);

      const a = getAudio(src);
      try {
        a.currentTime = 0;
      } catch (e) {}

      a.play().catch(() => {});
    });
  });
})();

(function() {
 
 
  /* ── Data ───────────────────────────────────────────────────── */
  const iconFiles = {
    php: "php.png",
    mysql: "mysql.png",
    python: "python.png",
    js: "javascript.png",
    ts: "typescript.png",
    cpp: "cpp.png",
    java: "java.png",
    dart: "dart.png",
    htmlcss: "css.png",
    react: "react.png",
    rn: "rn.png",
    flutter: "flutter.png",
    laravel: "laravel.png",
    nodejs: "nodejs.png",
    supabase: "supabase.png",
    gce: "gce.png",
    vercel: "vercel.png",
    restapi: "restapi.svg",
    tableau: "tableau.svg",
    powerbi: "powerbi.png",
    git: "git.svg",
    docker: "docker.svg",
    figma: "figma.png",
  };

  const legend = [
    { label: 'Languages', cat: 'lang', labelTheme: { bg: '#213a73' } },
    { label: 'Frontend', cat: 'frontend', labelTheme: { bg: '#3f2d67' } },
    { label: 'Backend & Cloud', cat: 'backend', labelTheme: { bg: '#0f4c5c' } },
    { label: 'Data Visualization', cat: 'data', labelTheme: { bg: '#5d4037' } },
    { label: 'Tools', cat: 'tools', labelTheme: { bg: '#39424e' } },
  ];

  const rows = [
    {
      indent: '0px',
      keys: [
        { label: 'PHP',        icon: 'php',      cat: 'lang', filterType: 'language', filterValue: 'php sql', theme: { face: '#1b3f8b', side: '#10265a', text: '#ffffff' } },
        { label: 'SQL',        icon: 'mysql',    cat: 'lang', filterType: 'language', filterValue: 'php sql', theme: { face: '#d86b1f', side: '#7a340b', text: '#fff2de' } },
        { label: 'Python',     icon: 'python',   cat: 'lang', filterType: 'language', filterValue: 'python', theme: { face: '#141414', side: '#000000', text: '#ffffff' } },
        { label: 'JS',         icon: 'js',       cat: 'lang', filterType: 'language', filterValue: 'html css js', theme: { face: '#3e2d12', side: '#241806', text: '#fff4b5' } },
        { label: 'TypeScript', icon: 'ts',       cat: 'lang', filterType: 'tool', filterValue: 'React Native', theme: { face: '#245cbe', side: '#15366f', text: '#ffffff' } },
      ]
    },
    {
      indent: '24px',
      keys: [
        { label: 'C++',      icon: 'cpp',      cat: 'lang', filterType: 'language', filterValue: 'c++', theme: { face: '#3847a3', side: '#20295f', text: '#ffffff' } },
        { label: 'Java',     icon: 'java',     cat: 'lang', filterType: 'language', filterValue: 'java', theme: { face: '#8b2f24', side: '#53180f', text: '#ffffff' } },
        { label: 'Dart',     icon: 'dart',     cat: 'lang', filterType: 'language', filterValue: 'flutter', theme: { face: '#0d6e8a', side: '#083b4a', text: '#ffffff' } },
        { label: 'HTML/CSS', icon: 'htmlcss',  cat: 'lang', filterType: 'language', filterValue: 'html css js', theme: { face: '#9a4d17', side: '#5d2d0b', text: '#ffffff' } },
        { label: 'React',    icon: 'react',    cat: 'frontend', filterType: 'language', filterValue: 'react', theme: { face: '#0f5164', side: '#082d37', text: '#ddf9ff' } },
        { label: 'Flutter',  icon: 'flutter',  cat: 'frontend', filterType: 'language', filterValue: 'flutter', theme: { face: '#1c69b7', side: '#103d69', text: '#ffffff' } },
      ]
    },
    {
      indent: '56px',
      keys: [
        { label: 'React Native', icon: 'rn',       cat: 'frontend', wide: true, filterType: 'language', filterValue: 'react native', theme: { face: '#2d4254', side: '#18232d', text: '#ffffff' } },
        { label: 'Laravel',      icon: 'laravel',  cat: 'backend', filterType: 'tool', filterValue: 'Laravel', theme: { face: '#8c251d', side: '#53130e', text: '#ffffff' } },
        { label: 'Node.js',      icon: 'nodejs',   cat: 'backend', filterType: 'tool', filterValue: 'Node.js', theme: { face: '#346533', side: '#1d391c', text: '#efffe9' } },
        { label: 'Supabase',     icon: 'supabase', cat: 'backend', filterType: 'tool', filterValue: 'Supabase', theme: { face: '#1d6c49', side: '#103b28', text: '#ffffff' } },
        { label: 'GCE',          icon: 'gce',      cat: 'backend', filterType: 'tool', filterValue: 'GCE', theme: { face: '#25588d', side: '#14314f', text: '#ffffff' } },
        { label: 'Vercel',       icon: 'vercel',   cat: 'backend', filterType: 'tool', filterValue: 'Vercel', theme: { face: '#111111', side: '#000000', text: '#ffffff' } },
      ]
    },
    {
      indent: '18px',
      keys: [
        { label: 'REST APIs', icon: 'restapi', cat: 'backend', wide: true, filterType: 'tool', filterValue: 'REST APIs', theme: { face: '#12606c', side: '#09353c', text: '#e9ffff' } },
        { label: 'Tableau',   icon: 'tableau', cat: 'data',    wide: true, filterType: 'tool', filterValue: 'Tableau', theme: { face: '#d56a29', side: '#8a3f13', text: '#ffffff' } },
        { label: 'Power BI',  icon: 'powerbi', cat: 'data',    wide: true, filterType: 'tool', filterValue: 'Power BI', theme: { face: '#846600', side: '#544000', text: '#fff7ce' } },
        { label: 'Git',       icon: 'git',     cat: 'tools', filterType: 'tool', filterValue: 'Git', theme: { face: '#d65a22', side: '#853413', text: '#ffffff' } },
        { label: 'Docker',    icon: 'docker',  cat: 'tools', filterType: 'tool', filterValue: 'Docker', theme: { face: '#1f5fb9', side: '#12376c', text: '#ffffff' } },
        { label: 'Figma',     icon: 'figma',   cat: 'tools', filterType: 'tool', filterValue: 'Figma', theme: { face: '#6b3cc6', side: '#3d2271', text: '#ffffff' } },
      ]
    }
  ];
 
  /* ── Build DOM ─────────────────────────────────────────────── */
  const kb = document.getElementById('skills-keyboard');
  const projectsSection = document.getElementById('projects');
  if (!kb) return;

  const focusProjectsWithFilter = (filterType, filterValue) => {
    window.ProjectsPiano?.resetFilters?.();

    if (filterType === 'language') {
      window.ProjectsPiano?.setLanguage?.(filterValue);
    } else if (filterType === 'tool') {
      window.ProjectsPiano?.setTool?.(filterValue);
    }

    projectsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
 
  const makeKey = (k) => {
    const key = document.createElement('div');
    const wideClass = k.wide ? ' wide' : k.xwide ? ' xwide' : '';
    key.className = `skb-key ${k.cat}${wideClass}`;
    key.tabIndex = 0;
    key.setAttribute('aria-label', k.label);

    if (k.theme) {
      if (k.theme.face) key.style.setProperty('--skb-desktop-face-bg', k.theme.face);
      if (k.theme.side) key.style.setProperty('--skb-desktop-side', k.theme.side);
      if (k.theme.text) key.style.setProperty('--skb-desktop-text', k.theme.text);
    }

    key.innerHTML = `
      <div class="skb-face">
        <div class="skb-icon">
          <img src="assets/icons/${iconFiles[k.icon] || `${k.icon}.png`}" alt="${k.label}">
        </div>
        <div class="skb-label">${k.label}</div>
      </div>`;

    key.addEventListener('pointerdown', () => {
      key.classList.add('skb-pressed');
    });
    key.addEventListener('click', () => {
      focusProjectsWithFilter(k.filterType, k.filterValue);
      key.blur();
    });
    key.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      focusProjectsWithFilter(k.filterType, k.filterValue);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt =>
      key.addEventListener(evt, () => {
        setTimeout(() => key.classList.remove('skb-pressed'), 80);
      })
    );

    return key;
  };

  const categoryRows = legend.map((item) => ({
    ...item,
    keys: rows.flatMap((rowData) => rowData.keys.filter((k) => k.cat === item.cat)),
  }));

  const renderSkills = () => {
    kb.innerHTML = '';

    categoryRows.forEach((item) => {
      const row = document.createElement('section');
      row.className = 'skb-row';

      const label = document.createElement('h3');
      label.className = 'skb-row__label';
      label.textContent = item.label;
      if (item.labelTheme?.bg) {
        label.style.setProperty('--skb-label-bg', item.labelTheme.bg);
      }
      row.appendChild(label);

      const keys = document.createElement('div');
      keys.className = 'skb-row__keys';
      item.keys.forEach((k) => keys.appendChild(makeKey(k)));
      row.appendChild(keys);

      kb.appendChild(row);
    });
  };

  renderSkills();
 
})();
