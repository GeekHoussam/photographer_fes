# Mohammed Laâchach photography portfolio

A multilingual, photography-first portfolio for a photographer and videographer based in Fès, Morocco. The application is built with Next.js App Router, strict TypeScript, Tailwind CSS, Sanity, `next-intl`, React Three Fiber, and Resend. The published portfolio uses the supplied original photography through curated, optimized WebP derivatives. Client references, public contact details, journal entries, and legal business fields still require approved source content before launch.

## Prerequisites

- Node.js 22.12 or newer
- pnpm 10 or newer
- A Sanity project only when using the separate Studio (the public site currently uses typed local content)
- A verified Resend domain and configured Upstash limiter for server contact delivery; neither is needed for the static mailto fallback

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000/fr`, `/en`, or `/ar`.

## Environment variables

Copy `.env.example` and configure the integrations you use. Variables prefixed with `NEXT_PUBLIC_` are embedded in browser assets: the prefix does **not** make a value safe to publish. Never put tokens or credentials in them. `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`, Upstash credentials, and contact delivery settings must remain server-only.

Public WhatsApp and email actions are centralized in `src/config/site.ts`. `NEXT_PUBLIC_CONTACT_EMAIL` remains the static-hosting fallback used by the contact form.

With `NEXT_PUBLIC_CONTACT_EMAIL` set, the form opens an email draft; the visitor must send it in their mail application. Leave it unset to use `/api/contact`. Production API delivery requires the canonical `NEXT_PUBLIC_SITE_URL`, both Upstash variables, a trusted `CONTACT_RATE_LIMIT_IP_HEADER`, and Resend settings. The hosting proxy must overwrite the chosen header with a single client IP and block direct origin access. Missing or failed limiter configuration returns 503 without sending mail. The in-memory limiter runs only in development/tests. See `docs/deployment.md` and `SECURITY_AUDIT.md` before enabling server delivery.

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
