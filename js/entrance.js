(() => {
  const DUR = {
    drop: 760,
    bounce: 420,
    stagger: 150,
    catExtra: 220,
  };

  const BOUNCE = {
    first: -12,
    second: -5,
  };

  let didRun = false;

  const getCat = () =>
    document.querySelector('[data-role="cat"]') ||
    document.querySelector(".cat") ||
    document.querySelector(".cat-wrap");

  function computeStartY(el) {
    const rect = el.getBoundingClientRect();
    const extra = Math.max(36, Math.round(rect.height * 0.2));
    return -(window.innerHeight + rect.height + extra);
  }

  function animateTarget(el, delay) {
    if (!el || el.dataset.fellOnce === "true") return;

    const startY = computeStartY(el);
    el.style.setProperty("--intro-start-y", `${startY}px`);
    el.classList.add("intro-target");

    const animation = el.animate(
      [
        {
          opacity: 0,
          translate: `0 ${startY}px`,
          easing: "cubic-bezier(.22,.9,.22,1)",
          offset: 0,
        },
        {
          opacity: 1,
          translate: "0 0",
          easing: "cubic-bezier(.22,.9,.22,1)",
          offset: 0.7,
        },
        {
          opacity: 1,
          translate: `0 ${BOUNCE.first}px`,
          easing: "ease-out",
          offset: 0.84,
        },
        {
          opacity: 1,
          translate: "0 0",
          easing: "ease-out",
          offset: 0.93,
        },
        {
          opacity: 1,
          translate: `0 ${BOUNCE.second}px`,
          easing: "ease-out",
          offset: 0.97,
        },
        {
          opacity: 1,
          translate: "0 0",
          easing: "ease-out",
          offset: 1,
        },
      ],
      {
        duration: DUR.drop + DUR.bounce,
        delay,
        fill: "both",
      }
    );

    el._entranceAnimation = animation;

    animation.addEventListener(
      "finish",
      () => {
        el.classList.remove("intro-target");
        el.style.removeProperty("--intro-start-y");
        el.style.opacity = "";
        el.style.translate = "";
        el.dataset.fellOnce = "true";
        if (el._entranceAnimation === animation) delete el._entranceAnimation;
      },
      { once: true }
    );
  }

  function animate() {
    if (didRun) return;
    didRun = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pianos = Array.from(document.querySelectorAll("model-viewer.piano, .piano"));
    const cat = getCat();
    const targets = [...pianos];

    if (cat) targets.push(cat);
    if (targets.length === 0) return;

    document.body.classList.add("intro-active");

    targets.forEach((el) => {
      el._entranceAnimation?.cancel?.();
      delete el._entranceAnimation;
    });

    requestAnimationFrame(() => {
      targets.forEach((el, i) => {
        const isCat = el === cat;
        const delay = (isCat ? pianos.length : i) * DUR.stagger + (isCat ? DUR.catExtra : 0);
        animateTarget(el, delay);
      });

      const totalDelay =
        ((cat ? pianos.length : Math.max(pianos.length - 1, 0)) * DUR.stagger) +
        (cat ? DUR.catExtra : 0) +
        DUR.drop +
        DUR.bounce;

      window.setTimeout(() => {
        document.body.classList.remove("intro-active");
      }, totalDelay + 80);
    });
  }

  if (document.readyState === "complete") {
    animate();
  } else {
    window.addEventListener("load", animate, { once: true });
  }
})();
