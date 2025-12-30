// about.js
// ABOUT: horizontal scrolling + modal + snap vertical transitions + scrubber + staff “pluck” bulge

document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("aboutTrack");
  const aboutSection = document.querySelector(".about");
  const projectsSection = document.getElementById("projects"); // ensure this exists

  if (!scroller || !aboutSection) {
    console.warn("[About] Missing #aboutTrack or .about");
    return;
  }

  /* --------------------------
     Scrubber setup
     -------------------------- */
  const scrubber = document.createElement("div");
  scrubber.className = "about-scrubber";
  scrubber.innerHTML = `
    <div class="about-scrubber__track">
      <div class="about-scrubber__thumb" role="slider" aria-label="Scroll About"></div>
    </div>
  `;
  aboutSection.prepend(scrubber);

  const track = scrubber.querySelector(".about-scrubber__track");
  const thumb = scrubber.querySelector(".about-scrubber__thumb");

  // Show scrubber only when About is >= 60% in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          scrubber.classList.add("visible");
        } else {
          scrubber.classList.remove("visible");
        }
      });
    },
    { threshold: 0.9 }
  );
  observer.observe(aboutSection);

  // --- thumb sizing + syncing
  function sizeThumb() {
    const view = scroller.clientWidth;
    const full = scroller.scrollWidth;
    const ratio = Math.max(view / full, 0.08); // min thumb size
    thumb.style.width = `${track.clientWidth * ratio}px`;
    syncThumb();
  }

  function syncThumb() {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const pct = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
    const maxThumbTravel = track.clientWidth - thumb.clientWidth;
    thumb.style.transform = `translateX(${pct * maxThumbTravel}px)`;
  }

  // thumb dragging
  let dragging = false,
    dragStartX = 0,
    dragStartLeft = 0;

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

    // guard divide-by-zero
    if (maxThumbTravel <= 0) return;

    const scrollDelta = (dx / maxThumbTravel) * maxScroll;
    scroller.scrollLeft = Math.min(Math.max(dragStartLeft + scrollDelta, 0), maxScroll);
    syncThumb();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((t) =>
    thumb.addEventListener(t, () => (dragging = false))
  );

  // click track to jump
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
     Snap helpers
     -------------------------- */
  const isAtFarLeft = () => scroller.scrollLeft <= 1;
  const isAtFarRight = () =>
    scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;

  const isBottomAligned = () => {
    const rect = aboutSection.getBoundingClientRect();
    return rect.bottom <= window.innerHeight + 1;
  };
  const isTopAligned = () => {
    const rect = aboutSection.getBoundingClientRect();
    return rect.top >= -1;
  };

  const snapToBottom = () => {
    aboutSection.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  const snapToCenter = () => {
    const top = aboutSection.offsetTop;
    const center = top - (window.innerHeight - aboutSection.offsetHeight) / 2;
    window.scrollTo({ top: center, behavior: "smooth" });
  };

  const snapToProjects = () => {
    if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
  };

  // Enter snapping (vertical) thresholds
  const ENTER_RATIO_DOWN = 0.7; // down from previous
  const ENTER_RATIO_UP = 0.6; // up from next
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

    setTimeout(() => {
      centerSnapping = false;
    }, SNAP_LOCK_MS);
  };

  /* --------------------------
     Modal refs (needed before wheel interception)
     -------------------------- */
  const modal = document.getElementById("about-modal");
  const modalBody = document.getElementById("about-modal-body");
  const closeBtn = modal?.querySelector(".about-modal__close");
  const dialog = modal?.querySelector(".about-modal__dialog");

  // Create content wrapper for better styling control
  if (modal && modalBody && dialog) {
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "about-modal__content";
    contentWrapper.appendChild(modalBody);
    dialog.appendChild(contentWrapper);
  }

  let isAnimating = false;

  // Define open/close (will be wrapped later to lock body scrolling)
  let openModal = (html) => {
    if (!modal || !modalBody) return;
    if (isAnimating) return;

    isAnimating = true;
    modalBody.innerHTML = html;

    modal.hidden = false;
    aboutSection.classList.add("modal-open");

    // reflow
    modal.offsetHeight;

    requestAnimationFrame(() => {
      modal.classList.add("open");
      setTimeout(() => {
        isAnimating = false;
      }, 600);
    });
  };

  let closeModal = () => {
    if (!modal) return;
    if (isAnimating) return;

    isAnimating = true;
    modal.classList.add("closing");
    modal.classList.remove("open");

    setTimeout(() => {
      modal.classList.remove("closing");
      modal.hidden = true;
      aboutSection.classList.remove("modal-open");
      isAnimating = false;
    }, 400);
  };

  // Wrap to prevent body scroll when modal open
  const originalOpenModal = openModal;
  const originalCloseModal = closeModal;

  openModal = (html) => {
    document.body.style.overflow = "hidden";
    originalOpenModal(html);
  };

  closeModal = () => {
    setTimeout(() => {
      document.body.style.overflow = "";
    }, 400);
    originalCloseModal();
  };

  /* --------------------------
     Vertical snap interception
     -------------------------- */
  window.addEventListener(
    "wheel",
    (e) => {
      // never interfere with the About horizontal scroller
      if (e.target.closest("#aboutTrack")) return;
      // never interfere with modal
      if (modal && !modal.hidden) return;

      const ratio = aboutVisibleRatio();

      // DOWN from previous -> snap only if About >= 70% visible
      if (e.deltaY > 0) {
        if (ratio >= ENTER_RATIO_DOWN && !isAboutCentered()) {
          e.preventDefault();
          snapAboutToCenter("smooth");
        }
        return;
      }

      // UP from next -> snap only if About >= 60% visible
      if (e.deltaY < 0) {
        if (ratio >= ENTER_RATIO_UP && !isAboutCentered()) {
          e.preventDefault();
          snapAboutToCenter("smooth");
        }
      }
    },
    { passive: false }
  );

  // Touchpad momentum / touch scroll: after scroll settles, snap based on last direction
  let scrollEndTimer = null;
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (modal && !modal.hidden) return;
      if (centerSnapping) return;

      const nowY = window.scrollY;
      const dirDown = nowY > lastScrollY;
      lastScrollY = nowY;

      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        if (modal && !modal.hidden) return;

        const ratio = aboutVisibleRatio();

        if (dirDown) {
          if (ratio >= ENTER_RATIO_DOWN && !isAboutCentered()) snapAboutToCenter("smooth");
          return;
        }

        if (ratio >= ENTER_RATIO_UP && !isAboutCentered()) snapAboutToCenter("smooth");
      }, 120);
    },
    { passive: true }
  );

  /* --------------------------
     Wheel handling (horizontal + vertical boundary logic)
     -------------------------- */
  scroller.addEventListener(
    "wheel",
    (e) => {
      const delta = e.deltaY;
      if (delta === 0) return;

      // SCROLLING UP
      if (delta < 0) {
        if (isAtFarLeft()) {
          if (!isTopAligned()) {
            e.preventDefault();
            snapToCenter();
            return;
          }
          return; // already aligned -> allow vertical scroll
        }
      }

      // SCROLLING DOWN
      if (delta > 0) {
        if (!isBottomAligned()) {
          e.preventDefault();
          snapToBottom();
          return;
        }
        if (isAtFarRight()) {
          e.preventDefault();
          snapToProjects();
          return;
        }
      }

      // HORIZONTAL SCROLL
      e.preventDefault();
      scroller.scrollLeft += delta * 0.9;
      syncThumb();
    },
    { passive: false }
  );

  /* --------------------------
     Horizontal drag on scroller
     -------------------------- */
  let isDown = false,
    startX = 0,
    startLeft = 0;

  scroller.addEventListener("pointerdown", (e) => {
    // If pointer starts on button/link/etc, DON'T start drag/capture.
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
     Modal content
     -------------------------- */
  const content = {
    education: `
      <h3>education</h3>
      <article>
        <h4>Lyceum of the Philippines University – Cavite</h4>
        <p><strong>B.S. in Computer Science</strong> (2023–2027). Resident Scholar (S.Y. 2023–2025). GWA 1.18.</p>
        <ul>
          <li>Relevant coursework: Data Structures & Algorithms, Database Systems, Machine Learning,
              Mobile Computing, Web Development.</li>
        </ul>
      </article>

      <article>
        <h4>Harvard University – Online / edX</h4>
        <p><em>Non-degree online courses (2023–2025)</em></p>
        <ul>
          <li>Data Science: Building Machine Learning Models</li>
          <li>Machine Learning and Artificial Intelligence with Python</li>
          <li>CS50's Introduction to Artificial Intelligence with Python</li>
          <li>CS50's Introduction to Cybersecurity</li>
          <li>Introduction to Data Science with Python</li>
          <li>Using Python for Research</li>
          <li>CS50's Introduction to Computer Science</li>
        </ul>
      </article>

      <article>
        <h4>Cisco Networking Academy</h4>
        <p><em>Certificates and training programs</em></p>
        <ul>
          <li><strong>Cisco Certified SQL Engineer</strong> (Aug 2025)</li>
          <li>Computer Programming 1 and 2 (C/C++ and foundational programming concepts)</li>
        </ul>
      </article>
    `,

    skills: `
      <h3>tech stack</h3>

      <h4>Languages & Frameworks</h4>
      <ul class="skills-grid">
        <li><img src="assets/icons/java.png" alt="Java"></li>
        <li><img src="assets/icons/php.png" alt="PHP"></li>
        <li><img src="assets/icons/python.png" alt="Python"></li>
        <li><img src="assets/icons/kotlin.png" alt="Kotlin"></li>
        <li><img src="assets/icons/react.png" alt="React JS"></li>
        <li><img src="assets/icons/flutter.png" alt="Flutter"></li>
      </ul>

      <h4>Web Technologies</h4>
      <ul class="skills-grid">
        <li><img src="assets/icons/html.png" alt="HTML5"></li>
        <li><img src="assets/icons/css.png" alt="CSS3"></li>
        <li><img src="assets/icons/sql.png" alt="MySQL"></li>
        <li><img src="assets/icons/postgresql.png" alt="PostgreSQL"></li>
        <li><img src="assets/icons/rest.png" alt="REST API"></li>
      </ul>

      <h4>Machine Learning / AI</h4>
      <ul class="skills-grid">
        <li><img src="assets/icons/tensorflow.png" alt="TensorFlow"></li>
        <li><img src="assets/icons/pytorch.png" alt="PyTorch"></li>
        <li><img src="assets/icons/scikit.png" alt="scikit-learn"></li>
      </ul>

      <h4>Core Competencies</h4>
      <p>
        Predictive modeling, cross-platform mobile development, full-stack web
        development, database design and optimization, data preprocessing, and
        model evaluation with a focus on creating scalable, efficient solutions.
      </p>
    `,

    work: `
      <h3>work experience</h3>

      <article>
        <h4>IT Service Helpdesk — Lyceum of the Philippines University – Cavite</h4>
        <p><em>Internship | Sep 2024 – Mar 2025</em></p>
        <p>Provided comprehensive technical support, troubleshooting, and user assistance at the IT Department, gaining hands-on experience in enterprise-level IT operations.</p>
      </article>

      <article>
        <h4>PixelPulse — Web Solutions for Local SMEs</h4>
        <p><em>Founder & Developer | 2025 – Present</em></p>
        <p>Established a boutique digital agency offering custom websites for local schools, gyms, and restaurants, helping SMEs build their online presence with modern, responsive designs.</p>
      </article>

      <article>
        <h4>Freelance Developer</h4>
        <p><em>May 2023 – Present</em></p>
        <p>Worked independently on diverse projects including web applications, mobile app prototypes, and database management systems for various clients across different industries.</p>
      </article>

      <article>
        <h4>Creative & Business Roles</h4>
        <p><em>2020 – Present</em></p>
        <p>Built diverse experience through modeling collaborations, real estate sales, and social media management, developing strong communication, client relations, and creative problem-solving skills.</p>
      </article>
    `,

    contact: `
      <h3>contact</h3>
      <article>
        <h4>Get in Touch</h4>
        <ul>
          <li>Email: <a href="mailto:c.aundrekaperez@gmail.com">c.aundrekaperez@gmail.com</a></li>
          <li>Phone: <a href="tel:09664701756">09664701756</a></li>
          <li>GitHub: <a href="https://github.com/aundreka" target="_blank" rel="noopener">github.com/aundreka</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/aundreka-perez-8ba178353/" target="_blank" rel="noopener">
            linkedin.com/in/aundreka-perez</a></li>
          <li>Location: Dasmariñas City, Cavite</li>
        </ul>

        <h4>Professional Certification</h4>
        <p><strong>Cisco Certified SQL Engineer</strong> (Aug 2025)</p>

        <h4>Let's Collaborate</h4>
        <p>Always interested in discussing new opportunities, innovative projects, and creative collaborations. Feel free to reach out!</p>
      </article>
    `,
  };

  // Open modal on note block click
  document.querySelectorAll(".note-block").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = btn.dataset.category;
      if (content[key]) openModal(content[key]);
    });
  });

  // Close interactions
  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });

  modal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("about-modal__backdrop")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden && !isAnimating) closeModal();
  });

  /* --------------------------
     Wave Staff (SVG) — UPWARD PLUCK BULGE (mouse-centered)
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

    // state
    let waveHoverEl = null;
    let isWaveActive = false;
let tiltVel = 0;
let tiltPos = 0;
let driftVel = 0;
let driftPos = 0;

    let amp = 0;
    let ampTarget = 0;
    let lastT = performance.now();

    let mouseX = 0;
    let mouseVX = 0;
    let lastMouseX = 0;

    // tuning (tall + narrow)
    const AMP_MAX = 70;
    const SMOOTH = 0.12;

    function staffBaseYs(h) {
      const gap =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--staff-gap")) || 48;
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

    function renderBulge() {
  const rect = staffLinesEl.getBoundingClientRect();
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);

  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const baseYs = staffBaseYs(h);

  const step = Math.max(18, Math.min(40, w / 42));
  const count = Math.ceil(w / step);

  // Base "tightness" of arcs (smaller = tighter)
  const SIGMA0 = Math.max(42, w * 0.01);

  const gauss = (x, c, sigma) => {
    const d = x - c;
    return Math.exp(-(d * d) / (2 * sigma * sigma));
  };

  const edgeFade = (x) => {
    const t = x / w;
    const s = Math.sin(t * Math.PI);
    return Math.pow(s, 0.9);
  };

  const center = isWaveActive ? mouseX : -999999;

  // Multi-arc ripple profile:
  // Several upward humps around the center (no negative dips).
  // Each line gets slightly different spacing + sigma + weights + asymmetry.
  function rippleProfile(x, lineIdx) {
    if (!isWaveActive) return 0;

    // Line-specific variations (so lines don't move uniformly)
    const lineBias = (lineIdx - 2) * 5;              // shifts slightly per line
    const sigma = SIGMA0 * (1 + Math.abs(lineIdx - 2) * 0.06);
    const L = sigma * (3.5 + lineIdx * 0.05);          // spacing between arcs
    const c = center + lineBias * 6;                    // tiny center offset per line

    // Weights per line (middle line strongest + cleaner falloff)
    const w0 = 25.00;                                     // main crest
    const w1 = 5.95 - lineIdx * 0.03;                    // inner side crests
    const w2 = 1.54 - Math.abs(lineIdx - 2) * 0.04;      // outer side crests

    // Slight asymmetry so it feels "real" (not mirrored perfectly)
    const asym = 2 * (lineIdx % 2 === 0 ? 1 : -1);    // alternate direction per line

    // 5 upward humps: center, ±L, ±2L
    const g0 = gauss(x, c, sigma);
    const gL = gauss(x, c - L * (1.00 + asym), sigma * 1.03) + gauss(x, c + L * (1.00 - asym), sigma * 0.98);
    const g2 = gauss(x, c - 2 * L * (1.00 + asym * 0.6), sigma * 1.08) + gauss(x, c + 2 * L * (1.00 - asym * 0.6), sigma * 1.02);

    // Combine (all positive -> multiple arcs, no oscillation)
    const raw = (w0 * g0) + (w1 * gL) + (w2 * g2);

    // Normalize so center always ~1.0 regardless of weights
    const norm = w0 + 2 * w1 + 2 * w2;

const base = raw / norm;

// Stronger center only: add a narrow extra gaussian at the exact center
const peak = gauss(x, c, sigma * 0.95); // 0.45–0.65 = narrower peak
const PEAK_BOOST = 0.85;                // 0.5–1.5 (higher = stronger center)

return base + PEAK_BOOST * peak;  }

  for (let line = 0; line < 5; line++) {
    const y0 = baseYs[line];

    // Overall line scaling (middle line strongest)
    const lineScale = 1 - (Math.abs(line - 2) * 0.07);

    const pts = [];
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * w;

      if (!isWaveActive) {
        pts.push({ x, y: y0 });
        continue;
      }

      const env = rippleProfile(x, line) * edgeFade(x);

      // Upward only (screen coords: smaller y = up)
      const y = y0 - (amp * lineScale * env);

      pts.push({ x, y });
    }

    paths[line].setAttribute("d", catmullRomToBezier(pts));
  }
}

    function tick(now) {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      amp += (ampTarget - amp) * (1 - Math.pow(1 - SMOOTH, dt * 60));

      renderBulge();

      if (waveHoverEl) {
// --- Stronger, more physical response ---
const strength = amp / AMP_MAX;

// lift still follows wave height, but eased
const lift = Math.pow(strength, 0.8) * AMP_MAX * 0.85;

// --- DRIFT (horizontal sway) ---
const driftTarget = Math.max(-10, Math.min(10, mouseVX * 0.45)) * strength;
const tiltTarget  = Math.max(-10, Math.min(10, mouseVX * 0.65)) * strength;
driftVel += (driftTarget - driftPos) * 0.05;
driftVel *= 0.88;
driftPos += driftVel;

// --- TILT (rotational inertia) ---
tiltVel += (tiltTarget - tiltPos) * 0.045;
tiltVel *= 0.90;
tiltPos += tiltVel;

waveHoverEl.style.setProperty("--wave-lift", `${lift}px`);
waveHoverEl.style.setProperty("--wave-drift-x", `${driftPos}px`);
waveHoverEl.style.setProperty("--wave-tilt", `${tiltPos}deg`);

     }

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // hover hooks
    noteBlocks.forEach((btn) => {
      btn.addEventListener("mouseenter", (e) => {
        isWaveActive = true;
        ampTarget = AMP_MAX;
        waveHoverEl = btn;
        btn.classList.add("wave-active");
        setMouseXFromEvent(e);
      });

      btn.addEventListener("mousemove", (e) => {
        if (!isWaveActive) return;
        setMouseXFromEvent(e);
      });

btn.addEventListener("mouseleave", () => {
  isWaveActive = false;
  ampTarget = 0;

  btn.classList.remove("wave-active");
  btn.classList.add("wave-releasing");

  // Allow CSS animation to complete
  setTimeout(() => {
    btn.classList.remove("wave-releasing");
    btn.style.setProperty("--wave-lift", `0px`);
    btn.style.setProperty("--wave-drift-x", `0px`);
    btn.style.setProperty("--wave-tilt", `0deg`);
  }, 520);

  if (waveHoverEl === btn) waveHoverEl = null;
});

    });
  } else {
    console.warn("[About] staff-lines not found or no .note-block elements.");
  }

  /* --------------------------
     Init
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

/* --------------------------
   Hover SFX (separate IIFE)
   -------------------------- */
(() => {
  const buttons = document.querySelectorAll(".note-block");
  if (!buttons.length) return;

  // Preload audio elements (one per fx)
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

  // Unlock audio on first user gesture (autoplay policy)
  let audioUnlocked = false;
  const unlockAudio = () => {
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

  // Cooldown so hover doesn't machine-gun the sound
  const lastPlay = new WeakMap();
  const COOLDOWN_MS = 180;

  buttons.forEach((btn) => {
    if (btn.dataset.color) btn.style.setProperty("--note-color", btn.dataset.color);

    btn.addEventListener("mouseenter", () => {
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

