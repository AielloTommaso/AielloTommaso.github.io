/* ============================================================
   main.js — nav, scroll reveal, blog rendering, helpers
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  /* ---------- Sticky nav + mobile toggle ---------- */

  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    $$("a", navLinks).forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Footer year ---------- */

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Current page detection ---------- */

  const root = (function () {
    return new URL("../", document.currentScript.src).href;
  })();

  /* ---------- Blog listing page ---------- */

  const blogGrid = $("#blogGrid");
  if (blogGrid && typeof blogPosts !== "undefined") {
    if (!blogPosts.length) {
      blogGrid.innerHTML =
        '<p class="empty-state">No posts yet. Check back soon!</p>';
    } else {
      blogGrid.innerHTML = blogPosts
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((post) => {
          const tags = (post.tags || [])
            .map((t) => '<span class="tag-pill">' + escapeHtml(t) + "</span>")
            .join("");
          return (
            '<article class="blog-card">' +
              '<div class="tags">' + tags + "</div>" +
              '<div class="card-meta"><time datetime="' + escapeHtml(post.date) + '">' +
                formatDate(post.date) + '</time><span class="dot"></span><span>' +
                escapeHtml(post.readTime || "5 min") + ' read</span></div>' +
              "<h3><a href='" + escapeHtml(root + "blog/post.html") + "?id=" +
                encodeURIComponent(post.id) + "'>" + escapeHtml(post.title) + "</a></h3>" +
              "<p>" + escapeHtml(post.excerpt || "") + "</p>" +
              '<a class="read-more" href="' + escapeHtml(root + "blog/post.html") +
                "?id=" + encodeURIComponent(post.id) + '">Read more <span class="lk-arrow">→</span></a>' +
            "</article>"
          );
        })
        .join("");
    }
  }

  /* ---------- Blog post page ---------- */

  const postRoot = $("#postRoot");
  if (postRoot && typeof blogPosts !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const post = blogPosts.find((p) => p.id === id);

    if (!post) {
      postRoot.innerHTML =
        '<div class="empty-state">' +
          "<h2>Post not found</h2>" +
          '<p class="back-home"><a href="' + escapeHtml(root + "blog/") + '">Back to the blog →</a></p>' +
        "</div>";
    } else {
      postRoot.innerHTML =
        '<article class="post-wrap">' +
          '<a class="back-link" href="' + escapeHtml(root + "blog/") + '">← All posts</a>' +
          '<header class="post-head">' +
            '<div class="tags">' + (post.tags || []).map((t) =>
              '<span class="tag-pill">' + escapeHtml(t) + "</span>").join("") + "</div>" +
            "<h1>" + escapeHtml(post.title) + "</h1>" +
            '<div class="post-meta">' +
              '<time datetime="' + escapeHtml(post.date) + '">' + formatDate(post.date) + "</time>" +
              "<span>·</span><span>" + escapeHtml(post.readTime || "5 min") + " read</span>" +
            "</div>" +
          "</header>" +
          '<div class="post-body">' + post.content + "</div>" +
          '<p class="post-end-tag">✦</p>' +
          '<footer class="post-footer"><a href="' + escapeHtml(root + "blog/") +
            '">Back to all posts →</a></footer>' +
        "</article>";
    }

    document.title = (post ? post.title + " — " : "") + "Tommaso Aiello";
  }
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

  /* The reader and PDF.js stay off the initial loading path. */
  let readerModule;
  $$("[data-paper]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) return;
      event.preventDefault();
      readerModule ||= import(new URL("js/paper-reader.js?v=5", root).href);
      readerModule.then((reader) => reader.openPaper(link.dataset.paper, link)).catch(() => {
        readerModule = null;
        window.location.assign(link.href);
      });
    });
  });
})();
