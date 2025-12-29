// js/entrance.js
(() => {
  const LOG = "[entrance-anim]";

  // Tuning knobs (ms / px)
  const DUR = {
    drop: 1000,     // was ~650 — longer, smoother fall
    bounce: 700,    // was ~520 — gentler settle
    stagger: 260,   // was ~120 — bigger gaps between pianos
    catExtra: 380,  // extra delay so cat still lands last
  };
  const BOUNCE = {
    first: -10,     // was -14px — softer first bounce
    second: -4,     // was -6px  — softer second bounce
  };

  // Adjust if your cat uses a different selector
  const getCat = () =>
    document.querySelector('[data-role="cat"]') ||
    document.querySelector('.cat') ||
    document.querySelector('.cat-wrap');

  // Compute a per-element offscreen startY so it begins above the viewport
  function computeStartY(el) {
    const margin = 30; // px above top
    const rect = el.getBoundingClientRect();
    return -(rect.top + rect.height + margin);
  }

  // We need to capture each element's *final* carousel transform.
  function animate() {
    const pianos = Array.from(
      document.querySelectorAll('model-viewer.piano, .piano')
    );
    const cat = getCat();

    if (pianos.length === 0 && !cat) {
      console.warn(LOG, "No targets found (.piano or cat).");
      return;
    }

    // Ensure carousel transforms are applied by index.js
    const haveAnyTransform = pianos.some(
      el => getComputedStyle(el).transform !== "none"
    );

    const run = () => {
      // Push smoother/longer timings into CSS custom properties
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--drop-duration', `${DUR.drop}ms`);
      rootStyle.setProperty('--bounce-duration', `${DUR.bounce}ms`);
      rootStyle.setProperty('--stagger', `${DUR.stagger}`);
      rootStyle.setProperty('--cat-extra', `${DUR.catExtra}`);
      rootStyle.setProperty('--bounce-1', `${BOUNCE.first}px`);
      rootStyle.setProperty('--bounce-2', `${BOUNCE.second}px`);

      document.body.classList.add('intro-active');

      const targets = [...pianos];
      if (cat) targets.push(cat);

      // Seed: cache final transform and compute each element's startY
      targets.forEach((el) => {
        const computedTF = getComputedStyle(el).transform; // e.g., matrix(...)
        const finalTF = (computedTF && computedTF !== 'none') ? computedTF : 'none';

        // Save inline transform so we can restore after the intro (if any)
        el.dataset.origInlineTransform = el.style.transform || "";

        // During intro, CSS uses these variables to compose the transform
        el.style.setProperty('--finalTF', finalTF);

        const startY = computeStartY(el);
        el.style.setProperty('--startY', `${startY}px`);

        el.classList.add('intro-target');
      });

      // Start staggered animations after seed has painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const root = getComputedStyle(document.documentElement);
          const stagger = parseInt(root.getPropertyValue('--stagger')) || DUR.stagger;
          const drop = DUR.drop;
          const bounce = DUR.bounce;
          const catExtra = parseInt(root.getPropertyValue('--cat-extra')) || DUR.catExtra;

          targets.forEach((el, i) => {
            const isCat = (el === cat);
            const pianoCount = pianos.length;
            const baseIndex = isCat ? pianoCount : i;
            const delay = baseIndex * stagger + (isCat ? catExtra : 0);

            setTimeout(() => {
              if (el.dataset.fellOnce === 'true') return;

              el.classList.add('fall-in');

              const onDone = () => {
                el.classList.remove('fall-in', 'intro-target');
                el.style.removeProperty('--finalTF');
                el.style.removeProperty('--startY');

                // Restore inline transform (carousel remains in control)
                if (el.dataset.origInlineTransform !== undefined) {
                  el.style.transform = el.dataset.origInlineTransform;
                }
                el.dataset.fellOnce = 'true';
                el.removeEventListener('animationend', onDone);
              };
              el.addEventListener('animationend', onDone, { once: true });
            }, delay);
          });

          // Global cleanup after the last item finishes
          const total =
            (pianos.length - 1) * stagger +
            (cat ? catExtra : 0) +
            drop + bounce + 100;

          setTimeout(() => {
            document.body.classList.remove('intro-active');
            console.log(LOG, `Intro complete for ${pianos.length} piano(s)${cat ? " + cat" : ""}.`);
          }, total);
        });
      });
    };

    if (!haveAnyTransform) {
      // Give index.js a tiny bit more time to position the carousel
      setTimeout(run, 0);
    } else {
      run();
    }
  }

  // Wait for full load so <model-viewer> upgrades & your index.js carousel have applied
  if (document.readyState === 'complete') {
    animate();
  } else {
    window.addEventListener('load', animate, { once: true });
  }
})();
