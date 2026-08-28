# Architecture decision record

## Current implementation — 2026-08-27

This section supersedes the original plan below where they differ. Public
French, English, and Arabic pages use typed content under `src/features`,
including projects, services, and journal articles. Sanity schemas, queries,
and mappers remain available for a future CMS integration; the public routes
do not currently fetch them. There is no application database, authentication,
admin route, or public file-upload endpoint.

The Next.js App Router renders localized content and metadata on the server;
interactive components handle navigation, filters, dialogs, video activation,
theme, animation, and the progressive 3D lens. High-connectivity locale,
content, and SEO helpers are cohesive shared modules, not mixed-purpose
backend controllers. A source import audit found no runtime import cycles.

Two deployment modes are supported: a Next.js server with `POST /api/contact`,
and GitHub Pages static export with a public mailto fallback. Static hosting
does not run Proxy, redirects, response-header configuration, or the contact
API. No distributed limiter or email credentials are required for that mode.

Server contact delivery now separates bounded request parsing and origin
checks (`request-policy.ts`), validation (`schema.ts`), distributed quotas
(`rate-limit.ts`), and email delivery. Production quotas use atomic Redis EVAL
through the documented Upstash REST interface, five attempts per trusted
client IP per 15 minutes. Only local development/tests use bounded process
memory. The proxy trust boundary and integration credentials require hosting
configuration; unconfigured production delivery fails closed.

Security headers are centralized in `src/config/security-headers.ts` for the
server deployment. Static hosts must apply equivalent response headers at
their edge. The compatible CSP retains inline scripts/styles required by
static hydration and existing animation; it is not a strict XSS policy.

## Original design plan

## ADR-001: Headless, localized Next.js portfolio

- **Status:** Accepted
- **Date:** 2026-07-11

### Context

Mohammed Laâchach needs a photography-first website that supports two locales, image-heavy portfolios, service discovery, editorial content, quotation requests, accessible interactions, local SEO, and non-developer editing. The existing WordPress site is a content reference, not an implementation base. Authorized original media will be supplied separately.

### Decision

Use the latest stable Next.js App Router with strict TypeScript and server components by default. Route all public pages through a `[locale]` segment managed by `next-intl`; keep short interface strings in locale modules and editorial content in Sanity. Fetch and map CMS data in `src/lib/sanity`, returning domain types to presentation components.

Build reusable layout and interface primitives with Tailwind CSS and CSS design tokens. Interactive islands are limited to navigation, filters, forms, lightbox, smooth scrolling, and the homepage lens. The `LensHero` canvas lives exclusively in `src/components/three`, loads dynamically without SSR, and is always backed by meaningful static media.

Submit contact requests to a server route validated by the same Zod schema used by React Hook Form. Resend credentials remain server-only. Rate limiting uses a small adapter: distributed storage in production when configured, with a conservative in-memory development fallback.

Generate metadata, canonical URLs, alternate locales, sitemap, robots, and JSON-LD on the server from typed site settings. Use placeholder business fields until verified values are entered in Sanity.

### Consequences

- Content editors can update projects, services, articles, FAQs, and site settings without code changes.
- Large photographic pages stay server-rendered and image optimized; client JavaScript is reserved for genuine interaction.
- Sanity becomes an operational dependency, so preview-safe placeholder data is provided for local development.
- WebGL is progressive enhancement, not a prerequisite for navigation or content.
- Vercel is the deployment target; Resend and optional distributed rate limiting are configured through environment variables.

## Folder structure

```text
src/
  app/
    [locale]/
      about/
      contact/
      journal/[slug]/
      legal/
      portfolio/[slug]/
      privacy/
      process/
      services/[slug]/
      thank-you/
    api/contact/
    robots.ts
    sitemap.ts
  components/
    common/
    forms/
    layout/
    portfolio/
    sections/
    three/
  config/
  features/
    contact/
    portfolio/
    services/
  hooks/
  i18n/
  lib/
    analytics/
    email/
    sanity/
    seo/
    utils/
  styles/
  types/
sanity/
  schemaTypes/
tests/
  e2e/
  unit/
docs/
```

## Dependencies and reasons

| Package                                            | Purpose                                              |
| -------------------------------------------------- | ---------------------------------------------------- |
| `next`, `react`, `react-dom`, `typescript`         | App Router application and strict typed UI           |
| `tailwindcss`, `@tailwindcss/postcss`              | Token-driven responsive styling                      |
| `three`, `@react-three/fiber`, `@react-three/drei` | Progressive lens hero                                |
| `gsap`, `lenis`                                    | Restrained scroll choreography and smooth scrolling  |
| `sanity`, `next-sanity`, `@sanity/vision`          | Hosted content studio, typed queries, image delivery |
| `next-intl`                                        | Locale routing, messages, and metadata               |
| `react-hook-form`, `@hookform/resolvers`, `zod`    | Accessible form state and shared validation          |
| `resend`                                           | Server-side enquiry and acknowledgement email        |
| `focus-trap-react`                                 | Predictable focus containment for the lightbox       |
| `vitest`, Testing Library, `jsdom`                 | Unit and component tests                             |
| `@playwright/test`                                 | Critical browser journeys                            |
| ESLint, Prettier, Husky, lint-staged               | Automated code-quality guardrails                    |

## Implementation plan

1. Establish configuration, tokens, locale routing, environment validation, and quality scripts.
2. Build accessible design-system primitives and global navigation/layout.
3. Define Sanity schemas, validation, preview structures, GROQ queries, and domain mappers.
4. Compose the static-first homepage and all required content routes.
5. Add portfolio filters, gallery, lightbox, project relationships, and service pages.
6. Add journal, profile, process, legal, and privacy views using explicit placeholders.
7. Implement the shared contact schema, server endpoint, rate limiting, and Resend delivery.
8. Add the progressively enhanced aperture hero, reduced-motion behavior, and restrained motion.
9. Complete metadata, JSON-LD, sitemap, robots, redirect configuration, and documentation.
10. Run type, lint, unit, component, browser, and production-build checks; optimize failures and regressions.
