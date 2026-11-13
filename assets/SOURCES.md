# Local asset sources

The project illustrations and screenshots marked `v2` below were selected and
supplied by the site owner on 2026-11-06. The two marked `v3` come from the
projects' own repositories. No notebooks or experiments were executed. Resizing
preserves each complete image, its aspect ratio, colors, and labels. WebP or AVIF
variants and JPEG fallbacks are committed so the website never fetches remote images at
runtime. The `v2` and `v3` filenames prevent stale cached previews.

- `projects/narrativegraph-v3*`: ground-truth character-affinity graph for chapter 5 of *Jude the Obscure*, taken on 2026-11-13 from the NarrativeGraph repository (`results_and_plots/Sample_Improvement/GT/two_chapters_change/graph_gt_chapter_5.png`, 2210×1530). Resized whole, uncropped, to 640 and 1200 px wide AVIF plus a 1200×830 JPEG fallback. It replaces the supplied `narrativegraph-v2*` illustration, which is no longer referenced.
- `projects/tp53-v2*`: supplied eukaryotic transcription-initiation diagram.
- `projects/scene-graph-v3*`: supplied screenshot pairing an annotated video frame with a person–object scene graph. On 2026-11-13 the top 12 px (clipped caption descenders) were cropped away from the 1200×554 JPEG, giving 1200×542; served as AVIF at 640 and 1200 px wide with a JPEG fallback.
- `projects/two-view-v2*`: supplied screenshot comparing two point-cloud reconstructions with the original SDA Bocconi photographs.
- `projects/diffusion-v2*`: supplied four-panel diffusion illustration with animal images and timestep labels; an illustrative preview, not a plot of the repository's experimental results.
- `projects/pydeia-v3*`: results screen from the Pydeia repository (`docs/screenshots/results.png`, 1919×903), taken on 2026-11-13 and cropped to 800×720 at offset x=550, y=0 (ffmpeg `crop=800:720:550:0`) to keep the heading and the first recommendation card. AVIF at 640 and 800 px wide plus a JPEG fallback. It replaces the supplied `pydeia-v2*` screenshot, which is no longer referenced.
- `projects/part-one-*`: first page rendered from `research-curie-weiss-diffusion.pdf`.
- `projects/part-two-v2*`: first page rendered from the updated, 39-page `Diffusion_In_Reverse_Potential.pdf`, supplied by the owner on 2026-11-06.
- `LFF3208266.pdf`: the owner's 39-page bachelor's thesis, supplied on 2026-11-06 and linked from the hierarchical diffusion project. The original PDF is served without modification.
- `collage-v5-*`: personal photo collage supplied by the owner on 2026-11-13 as the 1800×9500 lossless master `/Users/tommasoaiello/Downloads/tommaso_mosaic_v2_master.png`. The treatment is baked in so the site needs no live filter: Lanczos downscale, Gaussian blur (sigma 1.2 at 1800 px, scaled with width), saturation 0.8, then brightness multiplied by 0.6. AVIF at 720, 1080 and 1440 px wide (the encoder's 8704 px height limit rules out an 1800 px AVIF) and JPEG fallbacks at 900 and 1800 px wide, all at the master's exact ratio. With `M` the master path and `W` the width, and sigma = 1.2 × W / 1800: `VF="scale=W:-2:flags=lanczos,gblur=sigma=S,eq=saturation=0.8,lutrgb=r=val*0.6:g=val*0.6:b=val*0.6"`; AVIF: `ffmpeg -i "$M" -vf "$VF" -c:v libaom-av1 -cpu-used 4 -crf 46 -b:v 0 -still-picture 1 collage-v5-W.avif` (sigma 0.48, 0.72, 0.96 for W = 720, 1080, 1440); JPEG: `ffmpeg -i "$M" -vf "$VF,format=yuvj420p" -c:v mjpeg -q:v 6 collage-v5-W.jpg` (sigma 0.6 and 1.2 for W = 900 and 1800). Supersedes the v4 collage (sigma 4–10, saturation 60%, with a live `brightness(0.6)` filter), whose files were deleted when the page switched to v5.
- `tommaso-aiello-*.webp`: compressed variants of the existing portrait; the original JPEG remains as the fallback.

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
