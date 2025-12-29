// ABOUT: horizontal scrolling + modal + snap vertical transitions + scrubber
document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.getElementById("aboutTrack");
  const aboutSection = document.querySelector(".about");
  const projectsSection = document.getElementById("projects"); // make sure you add an element with id="projects"

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
// Show scrubber only when About is fully in viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
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
    const scrollDelta = (dx / maxThumbTravel) * maxScroll;
    scroller.scrollLeft = Math.min(Math.max(dragStartLeft + scrollDelta, 0), maxScroll);
    syncThumb();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(t =>
    thumb.addEventListener(t, () => dragging = false)
  );

  // click track to jump
  track.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const maxThumbTravel = track.clientWidth - thumb.clientWidth;
    const clamped = Math.max(0, Math.min(x - thumb.clientWidth/2, maxThumbTravel));
    const pct = clamped / maxThumbTravel;
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
    if (projectsSection)
      projectsSection.scrollIntoView({ behavior: "smooth" });
  };
  
  const ENTER_RATIO_DOWN = 0.7; // down from previous
  const ENTER_RATIO_UP   = 0.6; // up from next
  const CENTER_TOL = 10;       // px tolerance to avoid jitter
  const SNAP_LOCK_MS = 450;    // should roughly match your smooth scroll feel
  let centerSnapping = false;
  const isProjectsVisible = () => {
    if (!projectsSection) return false;
    const r = projectsSection.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };
  const aboutVisibleRatio = () => {
    const r = aboutSection.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    const clamped = Math.max(0, Math.min(visible, r.height));
    return r.height > 0 ? (clamped / r.height) : 0;
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

  // Only intercept DOWNWARD wheel entering About from previous section
     window.addEventListener(
    "wheel",
    (e) => {
      // never interfere with the About horizontal scroller
      if (e.target.closest("#aboutTrack")) return;
      // never interfere with modal
      if (!modal.hidden) return;

      const ratio = aboutVisibleRatio();

      // SCROLLING DOWN from PREVIOUS -> snap only if About is >= 70% visible
      if (e.deltaY > 0) {
        if (ratio >= ENTER_RATIO_DOWN && !isAboutCentered()) {
          e.preventDefault();
          snapAboutToCenter("smooth");
        }
        return;
      }

      // SCROLLING UP from NEXT -> snap only if About is >= 60% visible
      if (e.deltaY < 0) {
        if (ratio >= ENTER_RATIO_UP && !isAboutCentered()) {
          e.preventDefault();
          snapAboutToCenter("smooth");
        }
      }
    },
    { passive: false }
  );

  // Touchpad momentum / touch scroll: after scroll settles, only snap if last move was DOWN
  let scrollEndTimer = null;
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (!modal.hidden) return;
      if (centerSnapping) return;

      const nowY = window.scrollY;
      const dirDown = nowY > lastScrollY;
      lastScrollY = nowY;

      clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
        if (!modal.hidden) return;

        const ratio = aboutVisibleRatio();

        // If last movement was DOWN -> snap at 70%
        if (dirDown) {
          if (ratio >= ENTER_RATIO_DOWN && !isAboutCentered()) {
            snapAboutToCenter("smooth");
          }
          return;
        }

        // If last movement was UP -> snap at 60%
        if (!dirDown) {
          if (ratio >= ENTER_RATIO_UP && !isAboutCentered()) {
            snapAboutToCenter("smooth");
          }
        }
      }, 120);
    },
    { passive: true }
  );
  /* --------------------------
     Wheel handling
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
          return; // already aligned → vertical scroll allowed
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
let isDown = false, startX = 0, startLeft = 0;

scroller.addEventListener("pointerdown", (e) => {
  // If the pointer starts on a button/link/etc, DON'T start drag/capture.
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

["pointerup","pointerleave","pointercancel"].forEach(t =>
  scroller.addEventListener(t, () => isDown = false)
);

const modal = document.getElementById("about-modal");
const modalBody = document.getElementById("about-modal-body");
const closeBtn = modal.querySelector(".about-modal__close");

// Create content wrapper for better styling control
const contentWrapper = document.createElement("div");
contentWrapper.className = "about-modal__content";
contentWrapper.appendChild(modalBody);

// Insert content wrapper into dialog
const dialog = modal.querySelector(".about-modal__dialog");
dialog.appendChild(contentWrapper);

let isAnimating = false;

const openModal = (html) => {
  if (isAnimating) return;
  
  isAnimating = true;
  modalBody.innerHTML = html;
  
  // Remove hidden and add open class
  modal.hidden = false;
  document.querySelector(".about")?.classList.add("modal-open");
  
  // Trigger reflow to ensure initial state is applied
  modal.offsetHeight;
  
  // Add open class for animations
  requestAnimationFrame(() => {
    modal.classList.add("open");
    setTimeout(() => {
      isAnimating = false;
    }, 600); // Match the longest animation duration
  });
};

const closeModal = () => {
  if (isAnimating) return;
  
  isAnimating = true;
  modal.classList.add("closing");
  modal.classList.remove("open");
  
  // Wait for closing animation to complete
  setTimeout(() => {
    modal.classList.remove("closing");
    modal.hidden = true;
    document.querySelector(".about")?.classList.remove("modal-open");
    isAnimating = false;
  }, 400); // Match the closing animation duration
};

// Content per category with enhanced structure
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
  `
};

// Open modal on note block click
document.querySelectorAll(".note-block").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = btn.dataset.category;
    if (content[key]) {
      openModal(content[key]);
    }
  });
});

// Enhanced close interactions
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  closeModal();
});

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("about-modal__backdrop")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden && !isAnimating) {
    closeModal();
  }
});

// Prevent scrolling on body when modal is open
const originalOpenModal = openModal;
const originalCloseModal = closeModal;

openModal = (html) => {
  document.body.style.overflow = 'hidden';
  originalOpenModal(html);
};

closeModal = () => {
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 400);
  originalCloseModal();
};


  /* --------------------------
     Init
     -------------------------- */
  sizeThumb();
  window.addEventListener("load", () => { sizeThumb(); syncThumb(); });
  requestAnimationFrame(() => { sizeThumb(); syncThumb(); });
});

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

  // Mobile + browser autoplay policies: unlock audio on first user gesture
  let audioUnlocked = false;
  const unlockAudio = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // "Warm up" all sounds silently
    buttons.forEach((btn) => {
      const src = btn.dataset.fx;
      if (!src) return;
      const a = getAudio(src);
      a.muted = true;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      }).catch(() => {
        // if it fails, still mark unlocked; hover will try again after gesture
      });
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
    // OPTIONAL: also set CSS var from data-color (in case you want dynamic colors)
    if (btn.dataset.color) btn.style.setProperty("--note-color", btn.dataset.color);

    btn.addEventListener("mouseenter", () => {
      const src = btn.dataset.fx;
      if (!src) return;

      const now = performance.now();
      const last = lastPlay.get(btn) || 0;
      if (now - last < COOLDOWN_MS) return;
      lastPlay.set(btn, now);

      const a = getAudio(src);

      // Restart the sound cleanly
      try {
        a.currentTime = 0;
      } catch (e) {}

      a.play().catch(() => {
        // If not unlocked yet, user gesture will unlock later
      });
    });
  });
})();