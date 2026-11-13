/* ============================================================
   main.js — nav, copy email, image viewer, scroll reveal, helpers
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Sticky nav + mobile toggle ---------- */

  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    const setMenu = (open) => {
      navLinks.classList.toggle("open", open);
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };
    navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    $$("a", navLinks).forEach((link) => link.addEventListener("click", () => setMenu(false)));
    // The open menu also closes on Escape (focus returns to the toggle) and on any outside click.
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !navLinks.classList.contains("open")) return;
      setMenu(false);
      navToggle.focus();
    });
    document.addEventListener("click", (event) => {
      if (navLinks.classList.contains("open") && !nav.contains(event.target)) setMenu(false);
    });
  }

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Backdrop pan fallback ---------- */

  /* CSS scroll-driven animation pans the collage where it exists. Elsewhere,
     and only when motion is allowed, do the same from a throttled scroll handler. */
  const backdrop = $(".backdrop");
  const backdropImg = backdrop && $("img", backdrop);
  if (backdropImg &&
      !(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let queued = false;
    // Same cap as the CSS keyframe (--veil-max in style.css).
    const veilMax = parseFloat(getComputedStyle(backdrop).getPropertyValue("--veil-max")) || 0.2;
    backdrop.classList.add("backdrop-js");
    const pan = () => {
      queued = false;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      const travel = Math.max(0, backdropImg.offsetHeight - backdrop.clientHeight);
      backdropImg.style.transform = "translate3d(0," + (-progress * travel).toFixed(1) + "px,0)";
      // The ink veil rises over the first viewport of scroll, like the CSS animation-range.
      const veil = Math.min(1, window.scrollY / Math.max(1, window.innerHeight)) * veilMax;
      backdrop.style.setProperty("--veil", veil.toFixed(3));
    };
    const requestPan = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pan);
    };
    window.addEventListener("scroll", requestPan, { passive: true });
    window.addEventListener("resize", requestPan);
    window.addEventListener("load", requestPan);
    backdropImg.addEventListener("load", requestPan);
    pan();
  }

  /* ---------- Copy email ---------- */

  /* The address links stay plain mailto:. The copy buttons ship hidden and only
     appear where the async clipboard API exists. */
  if (navigator.clipboard && navigator.clipboard.writeText) {
    $$("[data-copy]").forEach((button) => {
      const label = button.querySelector("[aria-live]") || button;
      let timer;
      button.hidden = false;
      button.addEventListener("click", () => {
        const say = (text) => {
          label.textContent = text;
          clearTimeout(timer);
          timer = setTimeout(() => { label.textContent = "Copy"; }, 1600);
        };
        navigator.clipboard.writeText(button.dataset.copy)
          .then(() => say("Copied"), () => say("Couldn’t copy"));
      });
    });
  }

  /* ---------- Footer year ---------- */

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Site root (for lazy module URLs) ---------- */

  const root = (function () {
    return new URL("../", document.currentScript.src).href;
  })();


  /* Reserve image space in HTML; shimmer only while an image is pending. */
  $$(".project-media img").forEach((img) => {
    const media = img.closest(".project-media");
    const finish = () => {
      media.classList.remove("is-loading");
      if (!img.naturalWidth && !media.querySelector(".media-error")) {
        const note = document.createElement("span");
        note.className = "media-error mono";
        note.textContent = "Preview unavailable";
        media.append(note);
      }
    };
    img.addEventListener("load", finish, { once: true });
    img.addEventListener("error", finish, { once: true });
    if (img.complete) finish();
    else media.classList.add("is-loading");
  });

  /* Sections below the fold fade and rise once as they arrive.
     Opt-in: without JS, IntersectionObserver or with reduced motion, nothing is hidden. */
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const targets = $$(".section > .container").filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    if (targets.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      targets.forEach((el) => { el.classList.add("reveal-target"); io.observe(el); });
      document.documentElement.classList.add("reveal");
    }
  }

  /* Wayfinding: on the home page the nav marks the section in view. A thin band
     at the middle of the viewport decides, so exactly one section is current. */
  const sectionLinks = $$('.nav-links a[href^="#"]').filter((a) => a.hash.length > 1 && $(a.hash));
  if (sectionLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(sectionLinks.map((a) => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (entry.isIntersecting) {
          sectionLinks.forEach((a) => { if (a !== link) a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "location");
        } else if (link.hasAttribute("aria-current")) {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    byId.forEach((link, id) => spy.observe($("#" + id)));
  }

  /* Project image viewer: the figure link opens a native dialog with the same
     picture at full size. Without JS or <dialog> the link opens the JPEG. */
  const imageDialog = $("#imageDialog");
  if (imageDialog && typeof imageDialog.showModal === "function") {
    const stage = $("#imageStage");
    const kind = $("#imageDialogKind");
    const title = $("#imageDialogTitle");
    let returnFocus = null;
    let scrollPosition = 0;
    $$("[data-zoom]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const card = link.closest(".project-card");
        const picture = $("picture", link);
        if (!card || !picture) return;
        event.preventDefault();
        returnFocus = link;
        kind.textContent = $(".proj-kind", card).textContent;
        title.textContent = $(".proj-title", card).textContent;
        const copy = picture.cloneNode(true);
        $$("source, img", copy).forEach((el) => el.setAttribute("sizes", "96vw"));
        $("img", copy).removeAttribute("loading");
        stage.replaceChildren(copy);
        scrollPosition = window.scrollY;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add("reader-open");
        imageDialog.showModal();
        // Grow from the figure that was clicked, like the paper reader.
        const from = link.getBoundingClientRect();
        const box = imageDialog.getBoundingClientRect();
        imageDialog.style.setProperty("--origin-x", `${from.left + from.width / 2 - box.left}px`);
        imageDialog.style.setProperty("--origin-y", `${from.top + from.height / 2 - box.top}px`);
      });
    });
    $("#imageClose").addEventListener("click", () => imageDialog.close());
    imageDialog.addEventListener("click", (event) => {
      if (event.target !== imageDialog) return;
      const rect = imageDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
    });
    imageDialog.addEventListener("close", () => {
      document.body.classList.remove("reader-open");
      document.body.style.removeProperty("top");
      window.scrollTo({ top: scrollPosition, behavior: "instant" });
      returnFocus?.focus({ preventScroll: true });
    });
  }

  /* The reader and PDF.js stay off the initial loading path. The small reader
     module (not PDF.js) is fetched on hover/focus so the first click opens at once. */
  let readerModule;
  const loadReader = () => {
    readerModule ||= import(new URL("js/paper-reader.js?v=7", root).href)
      .catch((err) => { readerModule = null; throw err; });
    return readerModule;
  };
  $$("[data-paper]").forEach((link) => {
    const prefetch = () => { loadReader().catch(() => {}); };
    link.addEventListener("pointerenter", prefetch, { once: true });
    link.addEventListener("focus", prefetch, { once: true });
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) return;
      event.preventDefault();
      loadReader().then((reader) => reader.openPaper(link.dataset.paper, link)).catch(() => {
        readerModule = null;
        window.location.assign(link.href);
      });
    });
  });
})();
