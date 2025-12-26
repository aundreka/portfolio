// components/PortfolioPageClient.tsx
"use client";

import Script from "next/script";

export default function PortfolioPageClient() {
  return (
    <>
      <div className="background-wrapper">
        {/* FLOATING BUBBLE BACKGROUND (used by applyBackgroundTheme in js/index.js) */}
        <div className="background" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        {/* (Optional) keep your previous gradient/gloss layer if you want */}
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orbs__layer"></div>
          <div className="bg-orbs__gloss"></div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav__spacer"></div>
        <div className="nav__search">
          <input id="nav-search" type="search" placeholder="Search..." aria-label="Search" />
        </div>
        <button className="nav__hamburger" aria-label="Open menu" title="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <h1 id="hero-heading"></h1>

      <main className="main-container index">
        <div className="stage">
          <div className="controls-container">
            <div className="piano-carousel">
              <div className="cat-wrap">
                {/* model-viewer custom element works once script is loaded */}
                {/* @ts-expect-error - model-viewer is a web component */}
                <model-viewer
                  id="cat"
                  src="assets/models/cat.glb"
                  autoplay
                  interaction-prompt="none"
                  style={{ background: "transparent", pointerEvents: "none" }}
                ></model-viewer>
                <button id="cat-click" aria-label="Scroll to About"></button>
              </div>

              {/* @ts-expect-error - model-viewer is a web component */}
              <model-viewer
                class="piano"
                src="assets/models/piano3.glb"
                alt="Piano 1"
                disable-zoom
                camera-orbit="90deg 90deg 0deg"
              ></model-viewer>

              {/* @ts-expect-error - model-viewer is a web component */}
              <model-viewer
                class="piano"
                src="assets/models/piano3.glb"
                alt="Piano 2"
                disable-zoom
                camera-orbit="90deg 90deg 0deg"
              ></model-viewer>

              {/* @ts-expect-error - model-viewer is a web component */}
              <model-viewer
                class="piano"
                src="assets/models/piano3.glb"
                alt="Piano 3"
                disable-zoom
                camera-orbit="90deg 90deg 0deg"
              ></model-viewer>

              {/* @ts-expect-error - model-viewer is a web component */}
              <model-viewer
                class="piano"
                src="assets/models/piano3.glb"
                alt="Piano 4"
                disable-zoom
                camera-orbit="90deg 90deg 0deg"
              ></model-viewer>

              {/* @ts-expect-error - model-viewer is a web component */}
              <model-viewer
                class="piano"
                src="assets/models/piano3.glb"
                alt="Piano 5"
                disable-zoom
                camera-orbit="90deg 90deg 0deg"
              ></model-viewer>
            </div>

            <div id="piano-label" aria-live="polite"></div>
            <button className="controls" id="prevbtn">
              {"<"}
            </button>
            <button className="controls" id="nextbtn">
              {">"}
            </button>
          </div>
        </div>
      </main>

      <section id="about" className="about">
        {/* ONE horizontal scroller that contains everything */}
        <div className="about__scroller" id="aboutTrack">
          <div className="strip">
            {/* staff drawn across the whole strip */}
            <div className="staff-lines" aria-hidden="true"></div>

            {/* INTRO (text + photo) */}
            <div className="intro-block">
              <div className="intro-text">
                <p>
                  Motivated Computer Science student with hands-on experience building cross-platform
                  mobile apps and full-stack websites. Cisco-certified SQL Engineer and Python
                  enthusiast with a strong foundation in predictive algorithms, AI, and deep learning.
                </p>
              </div>
              <img src="assets/images/profile.png" alt="Aundreka Perez" className="intro-photo" />
            </div>

            {/* LONG STAFF CONTENT */}
            <div className="staff-track">
              <button className="note-block" data-category="education" aria-label="View Education Details">
                <img src="assets/notes/note1.png" className="note-img" alt="" />
                <span className="label bottom">Education</span>
              </button>

              <button className="note-block" data-category="skills" aria-label="View Skills & Tech Stack">
                <img src="assets/notes/note2.png" className="note-img" alt="" />
                <span className="label top">Skills</span>
              </button>

              <button className="note-block" data-category="work" aria-label="View Work Experience">
                <img src="assets/notes/note3.png" className="note-img" alt="" />
                <span className="label bottom">Work</span>
              </button>

              <button className="note-block" data-category="contact" aria-label="View Contact Information">
                <img src="assets/notes/note4.png" className="note-img" alt="" />
                <span className="label top">Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Modal with better structure */}
        <div id="about-modal" className="about-modal" hidden>
          <div className="about-modal__backdrop"></div>
          <div className="about-modal__dialog">
            <button className="about-modal__close" aria-label="Close modal"></button>
            {/* Content will be dynamically inserted here by JavaScript */}
            <div id="about-modal-body"></div>
          </div>
        </div>
      </section>

      {/* Placeholder for projects section if needed */}
      <section
        id="projects"
        style={{
          height: "100vh",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Projects Section (Placeholder)</h2>
      </section>

      {/* Your existing JS (served from /public/js) */}
      <Script src="/js/index.js" strategy="afterInteractive" />
      <Script src="/js/entrance.js" strategy="afterInteractive" />
      <Script src="/js/about.js" strategy="afterInteractive" />
      <Script src="/js/projects.js" strategy="afterInteractive" />
    </>
  );
}
