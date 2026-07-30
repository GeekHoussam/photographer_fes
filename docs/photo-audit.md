# Photography asset audit

The full row-by-row inventory is in `docs/photo-audit.csv`. It records every supported source image in `_photo-masters`, its folder, category, intended page, dimensions, orientation, quality signals, selection status, and duplicate notes. Optimized selected derivatives are delivered from `public/images/portfolio`.

## Library summary

| Folder                | Detected category         |   Files | Selected for the site |
| --------------------- | ------------------------- | ------: | --------------------: |
| `Events`              | Events                    |      13 |                     8 |
| `Personnels`          | Personal                  |       4 |     1 (`m2.png` only) |
| `REEL ESTATE`         | Real estate / hospitality |      11 |                     8 |
| `Restaurants & Foods` | Food / restaurant         |      93 |                    12 |
| `Weddings`            | Weddings                  |       3 |                     3 |
| **Total**             |                           | **124** |                **32** |

## Selection decisions

- Weddings: all three files form a short intentional sequence from couple portrait to bouquet and hand detail.
- Events: eight images cover the complete story: ceremony, speaker, wide room, candid exchange, award, signing detail, and group portrait. The second graduation frame and the second signature angle were excluded as redundant.
- Real estate: eight images balance traditional riad architecture, modern interiors, wide rooms, and bedrooms. Repeated views of the same rooms were excluded.
- Food: twelve images replace the 93-file folder dump with a concise sequence: drink, setting, tagines, two cooks, flame, preparation, plated dishes, and a complete table. Long flame bursts, repeated dishes, and near-identical table angles were excluded.
- Personal: `_photo-masters/Personnels/m2.png` is the exact source used only in the homepage artist introduction, via its optimized derivative `public/images/portfolio/personal/m2.webp`. `m1.jpg`, `m3.png`, and `logo.png` are not published.

## Duplicate findings

No byte-for-byte duplicate files were found. Automated perceptual screening flagged `DSC02518.jpg` / `DSC02519.jpg` and `DSC02525.jpg` / `DSC02526.jpg` as very similar. Visual review identified many additional food burst sequences; only the strongest representative frame from each repeated action or dish was selected.

## Delivery rules

Original photographs remain untouched. Selection is controlled in `src/features/portfolio/projects.ts`. Next.js serves responsive AVIF/WebP derivatives with explicit aspect ratios, lazy loading below the fold, and high-priority loading only for the hero and project covers.
