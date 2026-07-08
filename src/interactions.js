// Shared 3D tilt + entrance animation helpers used across all pages.
(function () {
  const MAX_DEG = 10;

  function bindTilt(el) {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";
    const maxDeg = parseFloat(el.dataset.tiltMax) || MAX_DEG;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const rx = (px - 0.5) * maxDeg * 2;
      const ry = (0.5 - py) * maxDeg * 2;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    });

    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }

  function applyStagger(container, selector, stepMs = 90) {
    const scope = container || document;
    const items = scope.querySelectorAll(selector || "[data-stagger]");
    items.forEach((el, i) => {
      el.classList.add("stagger-in");
      el.style.animationDelay = `${i * stepMs}ms`;
    });
  }

  function init() {
    document.querySelectorAll("[data-tilt]").forEach(bindTilt);
    applyStagger(document);
  }

  document.addEventListener("DOMContentLoaded", init);

  // Exposed so pages that inject content after load (e.g. search results)
  // can (re)bind tilt and re-run the stagger entrance.
  window.tiltAndStagger = { bindTilt, applyStagger };
})();
