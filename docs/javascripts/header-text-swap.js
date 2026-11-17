/* Ascendio RP — Text states swap (Transitions.dev adaptation).
   Reuses Zensical's native header title active state; no React dependency. */
(function () {
  function init() {
    const headerTitle = document.querySelector(".md-header__title");
    if (!headerTitle || headerTitle.dataset.textSwapReady === "true") return;

    const siteName = headerTitle.querySelector(".md-header__topic:first-child .md-ellipsis");
    const pageName = headerTitle.querySelector('.md-header__topic[data-md-component="header-topic"] .md-ellipsis');
    if (!siteName || !pageName) return;

    const siteText = siteName.textContent.trim();
    const pageText = pageName.textContent.trim() || siteText;
    const label = document.createElement("span");
    label.className = "t-text-swap";
    label.textContent = headerTitle.classList.contains("md-header__title--active") ? pageText : siteText;

    headerTitle.appendChild(label);
    headerTitle.classList.add("t-text-swap-ready");
    headerTitle.dataset.textSwapReady = "true";

    let target = label.textContent;
    let timer = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function update() {
      const next = headerTitle.classList.contains("md-header__title--active") ? pageText : siteText;
      if (next === target) return;
      target = next;
      if (timer !== null) window.clearTimeout(timer);

      if (reducedMotion.matches) {
        label.textContent = next;
        label.classList.remove("is-exit", "is-enter-start");
        timer = null;
        return;
      }

      label.classList.remove("is-enter-start");
      label.classList.add("is-exit");
      const duration = Number.parseFloat(
        getComputedStyle(label).getPropertyValue("--text-swap-dur")
      ) || 150;

      timer = window.setTimeout(function () {
        label.textContent = target;
        label.classList.remove("is-exit");
        label.classList.add("is-enter-start");
        void label.offsetWidth;
        requestAnimationFrame(function () {
          label.classList.remove("is-enter-start");
        });
        timer = null;
      }, duration);
    }

    new MutationObserver(update).observe(headerTitle, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
