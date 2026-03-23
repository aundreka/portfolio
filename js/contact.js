(() => {
  const cat = document.querySelector(".contact__cat");
  if (!cat) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cameraFrame = null;
  let animationTimer = null;
  let pointerTargetX = 0;
  let pointerTargetY = 88;
  let pointerCurrentX = 0;
  let pointerCurrentY = 88;

  function animateCamera() {
    pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.08;
    pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.08;
    cat.setAttribute("camera-orbit", `${pointerCurrentX.toFixed(2)}deg ${pointerCurrentY.toFixed(2)}deg 2.7m`);
    cameraFrame = window.requestAnimationFrame(animateCamera);
  }

  function updatePointerTarget(event) {
    const rect = cat.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clientX = "touches" in event ? event.touches[0]?.clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0]?.clientY : event.clientY;
    if (typeof clientX !== "number" || typeof clientY !== "number") return;

    const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((clientY - rect.top) / rect.height) * 2 - 1;

    pointerTargetX = Math.max(-1, Math.min(1, normalizedX)) * -12;
    pointerTargetY = 88 + Math.max(-1, Math.min(1, normalizedY)) * -6;
  }

  function resetPointerTarget() {
    pointerTargetX = 0;
    pointerTargetY = 88;
  }

  function getAnimationDuration() {
    const duration = Number(cat.duration);
    if (Number.isFinite(duration) && duration > 0) return duration;
    return 3;
  }

  function clearAnimationTimer() {
    if (animationTimer) {
      window.clearTimeout(animationTimer);
      animationTimer = null;
    }
  }

  function startAnimationLoop() {
    clearAnimationTimer();

    const animations = Array.isArray(cat.availableAnimations) ? cat.availableAnimations.filter(Boolean) : [];
    if (!animations.length) return;

    const sequence = prefersReducedMotion.matches ? [0] : [2, 1];
    let step = 0;

    function playNext() {
      const animationIndex = sequence[step % sequence.length];
      cat.animationName = animations[animationIndex] || animations[0];
      cat.setAttribute("animation-loop", "false");
      cat.currentTime = 0;
      cat.play().catch(() => {});

      animationTimer = window.setTimeout(() => {
        step += 1;
        playNext();
      }, getAnimationDuration() * 1000);
    }

    playNext();
  }

  cat.addEventListener("load", startAnimationLoop, { once: true });
  window.requestAnimationFrame(startAnimationLoop);
  prefersReducedMotion.addEventListener?.("change", () => {
    startAnimationLoop();
  });

  cat.addEventListener("pointermove", updatePointerTarget, { passive: true });
  cat.addEventListener("touchmove", updatePointerTarget, { passive: true });
  cat.addEventListener("pointerleave", resetPointerTarget, { passive: true });
  cat.addEventListener("touchend", resetPointerTarget, { passive: true });

  animateCamera();

  window.addEventListener("beforeunload", () => {
    clearAnimationTimer();
    if (cameraFrame) window.cancelAnimationFrame(cameraFrame);
  });
})();
