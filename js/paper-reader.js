/* One lazy viewer, with an explicit document allowlist and native dialog focus. */
const root = new URL("../", import.meta.url);
const papers = {
  "curie-weiss-i": {
    title: "Curie–Weiss & Diffusion — Part I",
    file: "assets/research-curie-weiss-diffusion.pdf",
  },
  "curie-weiss-ii": {
    title: "Part II: Reverse Dynamics & Effective Potentials",
    file: "assets/Diffusion_In_Reverse_Potential (1).pdf",
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
  document.getElementById("paperDialogTitle").textContent = papers[id].title;
  document.getElementById("paperOriginal").href = new URL(papers[id].file, root).href;
  if (!dialog.open) {
    scrollPosition = window.scrollY;
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add("reader-open");
    dialog.showModal();
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
