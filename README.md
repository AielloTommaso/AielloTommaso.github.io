# Tommaso Aiello — portfolio

Static HTML, CSS, and JavaScript, published by GitHub Pages from `master` at the
repository root. No build step, backend, runtime package installation, analytics,
or external font service is required.

## Preview locally

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Use HTTP rather than opening the HTML file directly:
PDF.js needs a web server to load its modules and worker.

## Updating content

- The two research papers and six GitHub cards are static markup in `index.html`.
- Keep project images in `assets/projects/`, including width-specific WebP
  variants and a JPEG fallback. Update the source sets, alt text, and intrinsic
  dimensions together. Scientific figures use `object-fit: contain`.
- The paper reader uses the two-document allowlist in `js/paper-reader.js`.
  Update it and the ordinary HTML PDF links together when replacing a paper.
- The active viewer is retained while closed, preserving its page, zoom, and
  search and avoiding another download. Switching papers replaces that viewer.
- Blog entries remain in `js/posts.js`. All font families are locally hosted.
- Asset provenance and licenses are recorded in `assets/SOURCES.md`.

## Checks before publishing

Verify the home page at 360, 390, 768, 1024, and 1440 px; all eight images; both
PDF previews; page navigation, zoom, text search, download, close/Escape and focus
return; the CV links; navigation and blog links. Test a failed PDF request and
retry, reduced motion, and the ordinary document links without JavaScript.
The initial home page must not request PDF.js, its worker, or either paper.

Run a Lighthouse mobile comparison with a local server and Chrome:

```sh
npx --yes lighthouse http://127.0.0.1:8765/ --only-categories=performance,accessibility --chrome-flags='--headless'
```

Local-server audits do not reproduce GitHub Pages' CDN, Gzip, or cache headers.
When changing CSS or scripts, update their version query strings in all consumers
(including the reader module and its viewer stylesheet link).

## Publish

Push a reviewed commit to `master`, wait for the GitHub Pages build, then verify
the live home page, PDF viewer, and CV download. To roll back a release, revert
that commit and push the revert; never force-push the published branch.
