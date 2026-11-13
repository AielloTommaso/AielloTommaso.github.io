/* One lazy viewer, with an explicit document allowlist and native dialog focus. */
const root = new URL("../", import.meta.url);
const papers = {
  "curie-weiss-i": {
    title: "Curie–Weiss & Diffusion — Part I",
    label: "Research notes",
    file: "assets/research-curie-weiss-diffusion.pdf",
  },
  "curie-weiss-ii": {
    title: "Part II: Reverse Dynamics & Effective Potentials",
    label: "Research notes",
    file: "assets/Diffusion_In_Reverse_Potential.pdf",
  },
  "hierarchical-diffusion-thesis": {
    title: "Generative Diffusion for Hierarchical Models of Language",
    label: "Bachelor’s thesis · 39 pages",
    file: "assets/LFF3208266.pdf",
  },
};

const dialog = document.getElementById("paperDialog");
const stage = document.getElementById("paperStage");
const loading = document.getElementById("paperLoading");
const error = document.getElementById("paperError");
const host = document.getElementById("paperFrameHost");
const closeButton = document.getElementById("paperClose");
let frame, activeId, returnFocus, timeout, state = "idle", scrollPosition = 0;

function setState(next) {
  state = next;
  loading.hidden = next !== "loading";
  error.hidden = next !== "error";
  stage.setAttribute("aria-busy", String(next === "loading"));
  if (frame) frame.style.visibility = next === "ready" ? "visible" : "hidden";
  if (next !== "loading") clearTimeout(timeout);
}

function loadPaper(id) {
  const paper = papers[id];
  activeId = id;
  clearTimeout(timeout);
  frame = document.createElement("iframe");
  frame.title = paper.title + " — PDF reader";
  const viewer = new URL("vendor/pdfjs-6.5.438/web/viewer.html", root);
  viewer.searchParams.set("file", new URL(paper.file, root).href);
  viewer.hash = "zoom=page-width";
  frame.src = viewer.href;
  host.replaceChildren(frame);
  setState("loading");
  // A blocked worker or unavailable script must leave a usable original link.
  timeout = setTimeout(() => setState("error"), 45000);
  const thisFrame = frame;
  frame.addEventListener("error", () => {
    if (frame === thisFrame) setState("error");
  });
}

// PDF.js emits this before initialization, so preferences apply to its first load.
document.addEventListener("webviewerloaded", (event) => {
  const viewer = event.detail?.source;
  const thisFrame = frame;
  if (!viewer || viewer !== thisFrame?.contentWindow) return;
  viewer.PDFViewerApplicationOptions.setAll({
    disablePreferences: true,
    enableScripting: false,
    annotationEditorMode: -1,
    enableComment: false,
    viewerCssTheme: 2,
    sidebarViewOnLoad: 0,
    localeProperties: { lang: "en-US" },
  });
  viewer.document.addEventListener("keydown", (key) => {
    if (key.key === "Escape" && dialog.open) {
      key.preventDefault();
      dialog.close();
    }
  }, true);
  viewer.PDFViewerApplication.initializedPromise.then(() => {
    if (frame !== thisFrame) return;
    const bus = viewer.PDFViewerApplication.eventBus;
    bus.on("pagerendered", (page) => {
      if (frame === thisFrame) setState(page.error ? "error" : "ready");
    });
    bus.on("documenterror", () => {
      if (frame === thisFrame) setState("error");
    });
  }).catch(() => {
    if (frame === thisFrame) setState("error");
  });
});

export function openPaper(id, trigger) {
  if (!Object.hasOwn(papers, id)) return;
  returnFocus = trigger;
  document.getElementById("paperDialogKind").textContent = papers[id].label;
  document.getElementById("paperDialogTitle").textContent = papers[id].title;
  document.getElementById("paperOriginal").href = new URL(papers[id].file, root).href;
  if (!dialog.open) {
    scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("reader-open");
    // A sheet flung away last time comes back on the normal path.
    settle?.cancel();
    settle = null;
    dialog.classList.remove("is-flung", "is-dragging");
    dialog.style.transform = "";
    dialog.showModal();
    // Grow from the cover or button that was clicked (spatial continuity).
    const from = trigger?.getBoundingClientRect?.();
    const box = dialog.getBoundingClientRect();
    if (from && box.width) {
      dialog.style.setProperty("--origin-x", `${from.left + from.width / 2 - box.left}px`);
      dialog.style.setProperty("--origin-y", `${from.top + from.height / 2 - box.top}px`);
    }
    closeButton.focus();
  }
  if (activeId !== id || !frame || state === "error") loadPaper(id);
}

closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const original = document.getElementById("paperOriginal");
  if (event.shiftKey && document.activeElement === closeButton) {
    event.preventDefault();
    original.focus();
  } else if (!event.shiftKey && document.activeElement === original) {
    event.preventDefault();
    closeButton.focus();
  }
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("reader-open");
  document.body.style.removeProperty("top");
  window.scrollTo({ top: scrollPosition, behavior: "instant" });
  returnFocus?.focus({ preventScroll: true });
});
document.getElementById("paperRetry").addEventListener("click", () => loadPaper(activeId));

/* Swipe down on the header to close (touch and pen). The sheet follows the
   finger 1:1 from where it was grabbed, resists when pulled upward, projects
   the release velocity to decide, and settles from its live position, so it
   can be grabbed again mid-flight. */
const header = dialog.querySelector(".paper-dialog-header");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let drag = null, settle = null;
const project = (velocity, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);
const rubberband = (offset, size, c = 0.55) => (offset * size * c) / (size + c * Math.abs(offset));
const liveY = () => new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m42;

header.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" || event.button !== 0 || event.target.closest("button, a")) return;
  const y = settle ? liveY() : 0;
  settle?.cancel();
  settle = null;
  drag = { id: event.pointerId, startY: event.clientY, offset: event.clientY - y, moved: false,
           history: [[event.clientY, event.timeStamp]] };
  header.setPointerCapture(event.pointerId);
  dialog.classList.add("is-dragging");
  dialog.style.transform = `translate3d(0, ${y}px, 0)`;
});

header.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  if (!drag.moved && Math.abs(event.clientY - drag.startY) < 10) return; // hysteresis
  drag.moved = true;
  let y = event.clientY - drag.offset;
  if (y < 0) y = rubberband(y, dialog.offsetHeight);
  dialog.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  drag.history.push([event.clientY, event.timeStamp]);
  if (drag.history.length > 5) drag.history.shift();
});

const release = (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  const { moved, history } = drag;
  drag = null;
  dialog.classList.remove("is-dragging");
  const height = dialog.offsetHeight;
  const y = liveY();
  const [y1, t1] = history[0], [y2, t2] = history[history.length - 1];
  const velocity = t2 > t1 ? ((y2 - y1) / (t2 - t1)) * 1000 : 0; // px/s, down is positive
  // An upward flick always returns; otherwise the projected rest point decides.
  const dismiss = moved && velocity > -200 && y + project(velocity) > height * 0.4;
  const target = dismiss ? height : 0;
  const finish = () => {
    settle = null;
    if (dismiss) { dialog.classList.add("is-flung"); dialog.close(); }
    else dialog.style.transform = "";
  };
  if (reducedMotion.matches || !dialog.animate) {
    dialog.style.transform = `translate3d(0, ${target}px, 0)`;
    finish();
    return;
  }
  const distance = Math.abs(target - y);
  // A dismissal keeps the finger's speed, linearly, until it is off screen;
  // a return eases to rest on the shared curve.
  const duration = Math.min(420, Math.max(140, (distance / Math.max(Math.abs(velocity), 800)) * 1000));
  settle = dialog.animate(
    [{ transform: `translate3d(0, ${y}px, 0)` }, { transform: `translate3d(0, ${target}px, 0)` }],
    { duration, easing: dismiss ? "linear" : "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
  );
  settle.onfinish = finish;
};
header.addEventListener("pointerup", release);
header.addEventListener("pointercancel", release);
