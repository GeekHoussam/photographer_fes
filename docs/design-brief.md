# Photography portfolio redesign brief

## Design read

For clients in Morocco who want a photographer with an editorial eye, the site should feel like entering a quiet darkroom and then opening a finished contact sheet.

## Concept spine

**From contact sheet to finished frame.** Hairline rules, measured crops, image sequencing, and restrained depth make the photographs feel selected and authored rather than uploaded in bulk.

## Delivery tier

**Cinema, restrained.** The experience uses scroll-owned sticky image chapters and an existing progressive 3D lens layer. It avoids passive video, generated portfolio imagery, and motion that competes with the work.

## Locked palette

- Darkroom: `#101112`
- Deep tray: `#181A1C`
- Gallery white: `#F1F2EE`
- Silver accent: `#B7BCC2`
- Muted type: `#8E9398`

The palette comes from silver-gelatin prints, matte camera bodies, and gallery walls. The accent is deliberately low saturation.

## Locked type

Cormorant Garamond Variable with Manrope Variable. The serif is justified by the photographer's editorial, image-led positioning; Manrope keeps navigation, captions, and forms contemporary and practical.

## Tier-1 technique

**D2, sticky-stack chapters.** Four full-width portfolio chapters layer as the visitor scrolls, mirroring how a photographer edits a sequence on a light table. On mobile, they become a simple vertical story without sticky overlap.

## Progressive 3D

The existing React Three Fiber aperture remains a decorative desktop enhancement. It is dynamically loaded, capped at 1.5 DPR, paused outside view and when the page is hidden, omitted on mobile, and removed for reduced motion. Essential text and links remain semantic HTML.

## Section plan

1. Asymmetric full-viewport hero with one primary frame and two supporting crops.
2. Sticky portfolio chapters for Weddings, Events, Hospitality, and Food.
3. Overlapping photographer introduction using `Personnels/m2.png`.
4. Scroll-driven selected-work contact sheet, preserving the same six-image sequence.
5. Ruled four-step process list.
6. Full-width contact band.

## Motion language

- Interface feedback: 180–260 ms.
- Image and chapter transitions: scroll-scrubbed contact-sheet wipes, with 600–900 ms interface responses elsewhere.
- Hero lens movement: pointer and scroll input only.
- Hot-path properties: transform and opacity.
- Reduced motion: static image sequence, no smooth scroll, no 3D canvas.

## CTA inventory

- Hero portfolio link: viewfinder corner brackets that close on hover.
- Category chapter: whole-image title band with a moving directional rule.
- Artist link: compact text link with a traveling arrow.
- Final contact band: full-width grade shift with a sliding arrow.

## Responsive contract

Desktop receives the layered hero, sticky category chapters, and 3D lens. Tablet reduces offsets. Mobile removes cursor dependencies and sticky overlap, uses one-column image stories, keeps 44 px minimum controls, and never crops text over a face.

## Asset plan

Only supplied photographs are used for portfolio content. `m2.png` is the sole Personal-folder image used, and only in the homepage artist section. No original image is deleted or modified. Higgsfield-generated supporting assets are omitted because the Higgsfield CLI is not available on PATH; the real photographs provide the complete visual layer.

## Anti-convergence ledger

This is the first redesign in the task. Its axes are silver-darkroom palette, Cormorant/Manrope type, asymmetric image-collage hero, D2 sticky chapters, viewfinder/band/text-link CTA garments, and sharp hairline framing.
