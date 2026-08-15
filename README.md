# Mohammed Laâchach photography portfolio

A multilingual, photography-first portfolio for a photographer and videographer based in Fès, Morocco. The application is built with Next.js App Router, strict TypeScript, Tailwind CSS, Sanity, `next-intl`, React Three Fiber, and Resend. The published portfolio uses the supplied original photography through curated, optimized WebP derivatives. Client references, public contact details, journal entries, and legal business fields still require approved source content before launch.

## Prerequisites

- Node.js 22 or newer
- pnpm 10 or newer
- A Sanity project and dataset
- A verified Resend sending domain for production contact delivery

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000/fr` or `http://localhost:3000/en`.

## Environment variables

Copy `.env.example` and replace every documented placeholder. Variables prefixed with `NEXT_PUBLIC_` are safe for the browser. `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, and contact mailbox settings are server-only and must never be exposed in client components.

Public WhatsApp and email actions are centralized in `src/config/site.ts`. `NEXT_PUBLIC_CONTACT_EMAIL` remains the static-hosting fallback used by the contact form.

The contact route uses a development-only in-memory limiter. Configure the documented distributed rate-limiting variables and adapter before multi-instance production traffic.

## Sanity setup and editing

1. Create a Sanity project and production dataset.
2. Add the project ID and dataset to `.env.local`.
3. Run `pnpm sanity dev` through the Sanity CLI if developing the Studio separately, or deploy the Studio in the preferred Sanity-managed location.
4. Create singletons first: Site settings, Navigation, Homepage, and Photographer profile.
5. Add portfolio categories before projects, then services, FAQs, clients, testimonials, and journal entries.

See `docs/sanity-editor-guide.md` for validation and publishing guidance.

## Testing and quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm test:e2e
pnpm format:check
pnpm build
```

Install Playwright's Chromium runtime once with `pnpm exec playwright install chromium` before local end-to-end runs.

## Production build and Vercel deployment

Connect the repository to Vercel, select pnpm, add all production environment variables, and deploy. The production build command is `pnpm build`. Add the Vercel domain to Sanity CORS origins and configure the same value as `NEXT_PUBLIC_SITE_URL`. See `docs/deployment.md`.

## Content editing and image requirements

- Upload only authorized original photography and video.
- Supply meaningful French alternative text; add English whenever available.
- Use an uncropped master large enough for responsive derivatives, preferably wide-gamut JPEG or lossless source media.
- Keep image focal points in Sanity hotspot data.
- Supply video posters and transcripts/captions.
- Do not mark testimonials or client logos approved without display permission.

Track every unresolved item in `content-todo.md`. Migration planning is in `docs/content-migration.md`.

## Troubleshooting

- **Sanity content does not appear:** verify project ID, dataset, CORS origins, and published document state.
- **Contact returns 503:** configure the Resend key, verified sender, and recipient variables.
- **Fonts fail in a restricted build:** allow access to Google font assets during build or replace them with licensed local font files through `next/font/local`.
- **WebGL is unavailable:** the hero intentionally keeps its static fallback and all navigation remains available.
- **Large galleries feel slow:** check source dimensions, poster images, responsive `sizes`, and avoid preloading below-the-fold media.
