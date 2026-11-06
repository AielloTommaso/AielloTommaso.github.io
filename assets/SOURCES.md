# Local asset sources

The six project illustrations and screenshots below were selected and supplied
by the site owner on 2026-11-06, in reading order. They replace the previous
repository-derived previews. No notebooks or experiments were executed. Resizing
preserves each complete image, its aspect ratio, colors, and labels. WebP variants
and JPEG fallbacks are committed so the website never fetches remote images at
runtime. The `v2` filenames prevent stale cached previews.

- `projects/narrativegraph-v2*`: supplied colored community-network illustration.
- `projects/tp53-v2*`: supplied eukaryotic transcription-initiation diagram.
- `projects/scene-graph-v2*`: supplied screenshot pairing an annotated video frame with a person–object scene graph.
- `projects/two-view-v2*`: supplied screenshot comparing two point-cloud reconstructions with the original SDA Bocconi photographs.
- `projects/diffusion-v2*`: supplied four-panel diffusion illustration with animal images and timestep labels; an illustrative preview, not a plot of the repository's experimental results.
- `projects/pydeia-v2*`: supplied Pydeia screenshot showing the conversation and recommendation-preparation screen.
- `projects/part-one-*` and `projects/part-two-*`: first pages rendered from the two research PDFs provided in this repository.
- `background-*` and `tommaso-aiello-*.webp`: compressed variants of the existing photographs. The background also has AVIF variants; the original JPEG files remain as fallbacks.

## Fonts

Inter (variable, weights 400–700) and IBM Plex Mono (400 and 500) use the Latin
WOFF2 subsets supplied by Google Fonts. They are served locally. The SIL Open
Font License files are included in `fonts/`; no Google Fonts requests are made
by the site.

## PDF.js

`vendor/pdfjs-6.5.438` is Mozilla's official **6.5.438** generic distribution from
[the tagged release](https://github.com/mozilla/pdf.js/releases/tag/v6.5.438).
The Apache 2.0 license is included. Debugging files, source maps, and the sample
document are omitted. `web/viewer.html` adds a link to the portfolio's local skin;
the upstream JavaScript and CSS are otherwise unchanged.
