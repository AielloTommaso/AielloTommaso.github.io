# Local asset sources

All project images are authentic project material, downloaded from the owner's
repositories on 2026-11-05. No notebooks or experiments were executed. Scientific
plots retain their original colors, axes, and labels; resizing preserves aspect ratio.
WebP variants and JPEG fallbacks are committed so the website never fetches GitHub
assets at runtime.

- `projects/narrativegraph-*`: [chapter 6 predicted network](https://github.com/AielloTommaso/NarrativeGraph/blob/main/results_and_plots/Sample_Improvement/MSE_post_train/two_chapters_change/graph_pred_chapter_6.png).
- `projects/tp53-*`: first PNG output of cell 23 (zero-based), [TCGA binary notebook](https://github.com/AielloTommaso/tp53-mutation-classification/blob/main/notebooks/tcga_binary_classification.ipynb). TCGA confusion matrix, accuracy 0.7937.
- `projects/scene-graph-*`: [sample scene graph](https://github.com/AielloTommaso/STTran_Anticipatory_Pre-Training_for_Dynamic_Scene_Graph_Generation/blob/main/results/qualitative/Changed_Graphs/0A8CF.mp4/000083.png). Illustrates the repository's scene-graph workflow; it is not presented as an APT benchmark result.
- `projects/two-view-*`: [Img_1.jpeg](https://github.com/AielloTommaso/3D_Two_View_Reconstruction/blob/main/Photos2/Img_1.jpeg) and [Img2.jpeg](https://github.com/AielloTommaso/3D_Two_View_Reconstruction/blob/main/Photos2/Img2.jpeg), placed side by side without cropping.
- `projects/diffusion-*`: first PNG output of cell 48 (zero-based), [binary diffusion notebook](https://github.com/AielloTommaso/DIffusion_Processes_for_Generative_Hierchical_Models/blob/main/Notebooks/Binary_diffusion.ipynb). Reconstruction cross-entropy by timestep.
- `projects/pydeia-*`: [first-question screenshot](https://github.com/AielloTommaso/Pydeia/blob/main/docs/screenshots/first-question.png).
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
