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
    const src = document.currentScript ? document.currentScript.src : window.location.href;
    const m = src.match(/^(.*\/)js\/main\.js$/);
    return m ? m[1] : window.location.pathname.replace(/\/[^/]*$/, "/");
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
                escapeHtml(post.readTime || "5 min read") + ' read</span></div>' +
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
})();