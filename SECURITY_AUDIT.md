# Photographer Fes Security Audit

Audit dates: **2026-08-27–28**. Repository base: `0743668`.

## Executive Summary

Overall status: **Mostly Secure within the reviewed repository scope**, with
deployment checks still required. This is not a penetration-test certification
or a claim that a live deployment has been secured.

The audit fixed two confirmed medium application weaknesses, added missing
server security headers, and corrected three functional bugs. The design,
photography, portfolio ordering, route slugs, contact details, French/English/
Arabic content, and RTL layout were preserved.

The package-manager findings fell from **44 (23 high, 21 moderate)** to
**one moderate, zero high, zero critical**. These are package-manager summary
counts, not 44 exploitable site vulnerabilities. The original JSON contained
40 advisory records, some with multiple affected dependency paths. The
remaining UUID advisory is in Sanity CLI tooling and has no identified path
from a public route to its affected API methods.

Lint, type checking, all 81 unit/component tests, the production build, and
the GitHub Pages export passed. The browser suite passed 90 tests, with four
intentional skips. No credentials were found in the reviewed current files.
No commit, push, publication, credential rotation, external database creation,
or actual email delivery was performed.

### Scope and limits

Reviewed current tracked/untracked source, configuration, examples, scripts,
dependency manifests, deployment workflow, Graphify artifacts, and root
environment files. The initial secret scan covered 238 text files; its only
candidate was a deliberately incomplete example in a vendored skill document.
Only `.env.example` exists in the checkout. `.gitignore` excludes other env
files, build products, dependencies, test output, and photo masters. No
inappropriate tracked env/build/dependency files were found.

Git history, external account settings, production secrets, DNS/TLS, real
Resend/Upstash connections, hosting proxy behavior, and live response headers
were not audited. Binary media was checked through asset references and
rendering, not exhaustive metadata or steganographic inspection. Pattern
scans cannot prove the absence of every possible secret.

## Architecture Summary

| Area                    | Current implementation                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Stack                   | Next.js App Router 16.3.3, React/React DOM 19.2.8, strict TypeScript 5.9.3, Tailwind CSS 4, next-intl 4          |
| Runtime                 | Node >=22.12; validation ran on Node 24.16.0 with pnpm 10.13.1                                                   |
| Pages                   | Mostly statically generated server components; FR, EN, AR; Arabic document direction is RTL                      |
| Client components       | Navigation, theme, forms, dialogs, portfolio filters/lightbox, video activation, animations, progressive 3D lens |
| Content                 | Typed local projects, services, pages, and journal records under `src/features`                                  |
| Backend                 | One public `POST /api/contact` handler; Zod validation, Resend delivery, production Redis quota                  |
| Authentication/database | No application login, session, admin route, SQL/NoSQL database, ORM, or Server Actions                           |
| CMS                     | Separate Sanity Studio/schema scaffold; public routes do not currently use Sanity queries or its read token      |
| Media                   | Bundled optimized assets; allowlisted Sanity/YouTube image origins; lazy YouTube privacy-enhanced iframes        |
| Deployment              | Next.js server or GitHub Pages static export. Static mode uses mailto and has no API runtime                     |

Graphify was queried before source changes and used to trace contact, locale,
SEO, and portfolio relationships. The supplied approximate graph counts were
not assumed current. The inspected graph had **1,223 nodes / 1,790 edges /
107 communities**; the AST-only refresh has **1,248 / 1,835 / 121** at zero LLM
token cost. It also contains vendored skill/docs communities, so its community
count is not a count of application modules.

Application hubs remain `isLocale` (44 edges), `getPageContent` (42),
`createPageMetadata` (31), `Locale` (25), and `localizedUrl` (22). These represent
cohesive localization/content/SEO responsibilities. Broad community cohesion
is low (site 0.08, structured data 0.06), which is expected for shared helpers
used by many route entry points and does not alone justify refactoring.

Both Graphify and a separate TypeScript import traversal found **no runtime
import cycles**. The refreshed graph has zero dangling endpoints and zero
self-loops. Its edges contain 1,829 EXTRACTED and six INFERRED relationships;
the generated report's simultaneous "100% EXTRACTED" summary is misleading.
Six inferred edges were not treated as proof of source behavior. Graphify
renamed 16 community labels after clustering changed; semantic relabeling and
document re-extraction were not run.

## Confirmed Vulnerabilities

### S1 — Bypassable and process-local contact quota

- **Severity:** MEDIUM.
- **Status:** CONFIRMED; FIXED in code; production configuration still required.
- **Files/function:** `src/app/api/contact/route.ts` POST, now lines 23–36;
  `src/features/contact/rate-limit.ts`, especially lines 13–26 and 36–103.
- **Problem:** The original route keyed an unbounded Map from the first
  caller-supplied `x-forwarded-for` value. Upstash env variables were documented
  but never used. Workers/restarts had separate quotas and stale keys remained.
- **Attack condition:** A server deployment accepts caller-controlled
  forwarding values, runs multiple instances, or restarts. Not exposed in the
  GitHub Pages export.
- **Impact:** Email abuse, provider cost and quota consumption, and memory
  growth; not authentication bypass or access to private records.
- **Fix applied:** Explicit trusted single-IP header configuration; validated,
  normalized IPs hashed before storage; atomic Redis increment plus expiry;
  five attempts per 15 minutes; HTTPS endpoint restriction, no redirects,
  three-second storage timeout; 503 on missing/broken production limiting.
  The local fallback has expiry cleanup and a 1,000-key cap and is forbidden
  in production. Responses are not cached and 429 includes Retry-After.
- **Validation:** `contact-rate-limit.test.ts` and `contact-route.test.ts`
  cover forwarding spoof resistance, quota expiry/cap, production rejection,
  storage request shape, invalid responses and endpoints, and safe failures.
  External Redis behavior and cross-instance operation still require staging.

### S2 — Unbounded contact request parsing

- **Severity:** MEDIUM.
- **Status:** CONFIRMED; FIXED.
- **Files/function:** Previous `request.json()` in POST;
  `src/features/contact/request-policy.ts` lines 15–89 now owns the checks.
- **Problem:** JSON was fully read before schema limits were evaluated.
  Arbitrarily large unknown fields were still read before Zod stripped them.
- **Attack condition:** A server host without a stricter ingress limit accepts
  a large or stalled body. Static hosting has no handler.
- **Impact:** Avoidable application memory/connection consumption.
- **Fix applied:** Content-Length precheck plus an actual byte-counted stream
  limit of 16 KiB; ten-second read deadline; cancellation on early termination;
  invalid JSON/UTF-8 gets 400, excess body gets 413, timeout gets 408. Only
  same-origin JSON is accepted, including rejection of simple cross-site form
  content types and missing/foreign Origin. This is abuse hardening; the app
  has no authenticated cookie session to exploit with conventional CSRF.
- **Validation:** Route/request-policy tests cover a dishonest size header,
  excess unknown data, chunked/stalled streams, malformed input, and origins.
  Twelve endpoint tests failed against the original implementation before the
  fix and passed afterward. Host-level limits are still recommended.

### S3 — Missing server response hardening

- **Severity:** LOW.
- **Status:** CONFIRMED missing configuration; FIXED for a Next.js server.
- **Files/function:** `next.config.ts` headers and
  `src/config/security-headers.ts` createSecurityHeaders.
- **Problem/condition:** The server configuration did not define framing,
  content-type, referrer, browser feature, or CSP restrictions; exposure depends
  on additional hosting headers. No content injection exploit was found.
- **Impact:** Missing defense in depth, including framing protection.
- **Fix applied:** CSP, nosniff, strict-origin-when-cross-origin, disabled
  camera/microphone/geolocation, frame-ancestors none and X-Frame-Options DENY.
  HTTPS deployments get one-year HSTS without subdomain/preload commitments.
- **Validation:** Unit checks plus actual localhost production response
  headers and browser journeys. YouTube activation and local media still work.
  HSTS's HTTPS branch was unit-tested, not verified on a public TLS deployment.
- **Limitation:** Next.js static hydration/theme scripts and animated inline
  styles require the documented inline allowances. Production has no eval
  allowance or wildcard origins. This is not a strict XSS-prevention CSP.
  GitHub Pages ignores these server headers; host/edge configuration remains
  a manual action. [Next.js CSP rendering guidance](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx).

### Dependency findings

Known vulnerable package versions were confirmed in the original lockfile;
this does not establish a matching exploitable route. See the per-package
inventory below. For example, the Next.js proxy-bypass advisory requires a
specific single-locale setup and proxy authentication; this site has no such
authentication. The upgrade still removes the affected version.
[Maintainer advisory](https://github.com/vercel/next.js/security/advisories/GHSA-6gpp-xcg3-4w24).

## Potential Risks

1. **MODERATE / REQUIRES UPSTREAM UPDATE:** `uuid@10.0.0` through
   `sanity > @sanity/cli > typeid-js`. Patched release starts at 11.1.1, outside
   typeid-js 1.2.0's declared `^10.0.0` range. Its installed code uses `v7` and
   `stringify`, not the advisory's `v3`, `v5`, or `v6` buffer APIs. No public-route
   exploit path was identified. Do not force a major override merely to turn
   the audit green. [UUID maintainer advisory](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq).
2. **REQUIRES DEPLOYMENT VERIFICATION:** Header overwriting, origin access
   controls, actual shared Redis quotas, email delivery, provider limits, and
   public HTTPS/headers. The repository cannot establish those settings.
3. **RECOMMENDATION:** Review Sanity role/CORS/dataset policies before enabling
   CMS queries or preview. Its Studio image/video acceptance hints are not
   server upload validation. Future CMS URLs need protocol/origin validation
   and image rules scoped to the configured project; there is no current
   public upload surface or CMS rendering path.
4. **RECOMMENDATION:** Sanity's upstream workbench alpha package requests an
   SDK 3 prerelease while the resolved SDK is 2.20.2. The public app does not
   use workbench, the CLI launches, and builds pass; validate the separate
   Studio before using that feature. No prerelease was forced into the project.

## Bugs Found

| File                                                     | Problem and impact                                                                                    | Fix and validation                                                                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/forms/contact-form.tsx` submit           | Network rejection escaped the handler, leaving no useful retry message                                | Catch transport and HTTP failures, keep entered values, show localized error; component tests verify offline/server failure followed by successful retry |
| `src/lib/email/send-contact-emails.ts` sendContactEmails | A failed receipt after successful business delivery returned failure, encouraging duplicate enquiries | Business delivery determines success; receipt failure produces only a generic server warning; tests cover provider and network receipt failures          |
| `src/components/layout/theme-toggle.tsx`                 | A blocked localStorage read/write could throw and prevent theme switching                             | Guard storage access while preserving current-page theme behavior; blocked-storage component test passes                                                 |

## Architecture Problems

- **Documentation drift fixed:** README incorrectly equated a public env
  prefix with safety. Architecture/deployment docs described active CMS data
  and distributed limiting that did not exist. Current implementation and
  deployment requirements now explicitly supersede the historical plan.
- **Boundary improvement:** Request policy, quota handling, schema, and email
  delivery have separate small modules. `server-only` guards protect the
  request policy, limiter, and mail provider; server env markers were absent
  from inspected production client chunks.
- **No speculative restructuring:** Large journal/project files contain
  localized editorial data. Shared locale/SEO hubs are cohesive, not mixed UI,
  authentication, storage, and transport controllers.
- **Dormant code:** `section-heading.tsx`, `hero-media.tsx`, and
  `rotating-catalogue.tsx` are not reachable from current public roots. They
  were retained as optional components because deleting them offers no
  security benefit. Sanity modules are a dormant integration scaffold.
  Config-discovered `request.ts`, the image loader, redirects, headers, and
  type-only content imports are not dead-code findings.
- **Performance:** Existing responsive images, WebP media, lazy thumbnails,
  click-activated iframes, reduced-motion behavior, and progressive canvas
  were preserved. Browser viewport/media tests pass. The library emits a
  non-blocking THREE.Clock deprecation warning; no application console errors
  were seen in the inspected homepage/contact/static-contact flows. No
  Lighthouse/Core Web Vitals or independent bundle-size benchmark was run.

## Changes Applied

- Bounded, timed, same-origin contact JSON parsing and safe HTTP errors.
- Real production Redis quota adapter; explicit proxy trust; bounded local
  fallback; no silent production fallback or infrastructure provisioning.
- Central security headers, documented CSP/static-host limitations, server-only
  markers, and no-store API responses.
- Three functional fixes listed above and seven new test files (44 new tests).
- Updated Next.js and its ESLint config, Sanity/vision/next-sanity, React/DOM,
  and affected transitive dependencies within compatible upgrade paths.
- Explicit compatible Sanity client peer; server-only marker dependency;
  Node minimum corrected to 22.12.
- Migrated build-script allowlist to `pnpm-workspace.yaml` and added two
  narrowly scoped, same-major parser overrides for the Sanity CLI's pinned
  dependencies. No force audit fix, disabled advisory, or broad major override.
- Preserved the CRLF lockfile convention and declared its CR whitespace rule
  in `.gitattributes`; generated/vendored Graphify/agent files are excluded
  from Prettier checks without changing their content to satisfy formatting.
- Refreshed Graphify code relationships and retained its automatic backup.

## Dependency Audit

`pnpm audit --json` baseline: **44 findings; 23 high, 21 moderate**.
Final: **one moderate**; command exit **1**, so the complete dependency audit
is **not a clean PASS**. All reported high/critical findings are absent.
`pnpm outdated` was reviewed; unrelated major TypeScript, ESLint, jsdom, and
Testing Library upgrades were not pursued as security fixes.

| Package / advisory links                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Highest reported severity | Affected installed versions before | Patched target / resolved now | Action                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `adm-zip` — [GHSA-xcpc-8h2w-3j85](https://github.com/advisories/GHSA-xcpc-8h2w-3j85)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | HIGH                      | 0.5.10, 0.5.18                     | 0.6.0                         | Updated; no remaining audit finding                                                 |
| `brace-expansion` — [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | HIGH                      | 1.1.16, 2.1.2, 5.0.7               | 1.1.18, 5.0.9                 | Updated; no remaining audit finding                                                 |
| `dompurify` — [GHSA-55q2-fjhq-7xh7](https://github.com/advisories/GHSA-55q2-fjhq-7xh7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | MODERATE                  | 3.4.12                             | 3.4.14                        | Updated; no remaining audit finding                                                 |
| `js-yaml` — [GHSA-mh29-5h37-fv8m](https://github.com/advisories/GHSA-mh29-5h37-fv8m), [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68), [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m), [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj)                                                                                                                                                                                                                                                                                                                                                                                | HIGH                      | 3.13.1, 4.3.0                      | 3.15.1, 4.3.2                 | Compatible updates plus scoped CLI parser override                                  |
| `nanoid` — [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv), [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | HIGH                      | 3.3.15                             | 3.3.18, 5.1.16, 6.0.1         | Updated; no remaining audit finding                                                 |
| `next` — [GHSA-6gpp-xcg3-4w24](https://github.com/advisories/GHSA-6gpp-xcg3-4w24), [GHSA-m99w-x7hq-7vfj](https://github.com/advisories/GHSA-m99w-x7hq-7vfj), [GHSA-89xv-2m56-2m9x](https://github.com/advisories/GHSA-89xv-2m56-2m9x), [GHSA-68g3-v927-f742](https://github.com/advisories/GHSA-68g3-v927-f742), [GHSA-4633-3j49-mh5q](https://github.com/advisories/GHSA-4633-3j49-mh5q), [GHSA-4c39-4ccg-62r3](https://github.com/advisories/GHSA-4c39-4ccg-62r3), [GHSA-p9j2-gv94-2wf4](https://github.com/advisories/GHSA-p9j2-gv94-2wf4), [GHSA-q8wf-6r8g-63ch](https://github.com/advisories/GHSA-q8wf-6r8g-63ch), [GHSA-955p-x3mx-jcvp](https://github.com/advisories/GHSA-955p-x3mx-jcvp) | HIGH                      | 16.2.10                            | 16.3.3                        | Updated; no remaining audit finding                                                 |
| `postcss` — [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849)                                                                                                                                                                                                                                                                                                                                                                                | HIGH                      | 8.4.31, 8.5.16                     | 8.5.23, 8.5.26                | Updated; no remaining audit finding                                                 |
| `sharp` — [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | HIGH                      | 0.34.5                             | 0.35.4                        | Updated; no remaining audit finding                                                 |
| `smol-toml` — [GHSA-v3rj-xjv7-4jmq](https://github.com/advisories/GHSA-v3rj-xjv7-4jmq)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | MODERATE                  | 1.5.2                              | 1.6.1, 1.8.0                  | Compatible updates plus scoped CLI parser override                                  |
| `tar` — [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | HIGH                      | 7.5.19                             | 7.5.22                        | Updated; no remaining audit finding                                                 |
| `undici` — [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524), [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272), [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5), [GHSA-jr45-8vmc-qm54](https://github.com/advisories/GHSA-jr45-8vmc-qm54), [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm)                                                                                                                                                                                                                                                                                                       | HIGH                      | 6.27.0, 7.28.0                     | 6.28.0, 7.29.0                | Updated; no remaining audit finding                                                 |
| `uuid` — [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | MODERATE                  | 10.0.0, 8.3.2                      | 10.0.0, 11.1.1, 14.0.2        | 8.x path removed; 10.0.0 remains in CLI; >=11.1.1 requires upstream major migration |

Next.js moved from 16.2.10 to 16.3.3 because the latter also updates its pinned
PostCSS and Sharp dependencies; the minimal 16.2.11 patch retained their
affected versions. React/DOM's 19.2.8 patch satisfies the current editor peer.
The lockfile explains the larger dependency diff, including peer snapshots;
it is not a source redesign. A pinned-pnpm frozen install passed.

## Security Controls

| Control              | State                                      | Evidence / limitation                                                                                                                                 |
| -------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input validation     | PASS                                       | Server Zod schema, bounded JSON, types/lengths/enum/consent/honeypot; unknown fields stripped                                                         |
| Authentication       | NOT APPLICABLE                             | No app login/session/privileged routes                                                                                                                |
| Authorization        | NOT APPLICABLE                             | No private records or user-owned object operations; Sanity account permissions are external                                                           |
| XSS protection       | PASS for reviewed sinks                    | React escapes normal text; JSON-LD serializer escapes `<` and line separators; theme script is a fixed server constant; email HTML fields are escaped |
| CSRF protection      | NOT APPLICABLE to authenticated operations | No cookie-authenticated mutations; public contact additionally requires same-origin JSON                                                              |
| CORS                 | PASS in repository                         | No wildcard credentialed API policy; unrelated origins rejected; external Sanity policy unverified                                                    |
| Rate limiting        | PARTIAL                                    | Code tested, production fails closed; live proxy/shared-store verification outstanding                                                                |
| Security headers     | PARTIAL                                    | Next.js server responses verified locally; static host and public TLS headers unverified; inline CSP limitation documented                            |
| Cookie security      | NOT APPLICABLE to secrets                  | Locale preference is not an auth token; localStorage contains only a theme choice                                                                     |
| File-upload security | NOT APPLICABLE to public app               | No upload handler; local processing scripts use operator-controlled paths and fixed asset lists                                                       |
| Secrets management   | PASS within scan scope                     | Only safe env example; ignore rules; no discovered credentials; privileged modules server-only                                                        |
| Database security    | NOT APPLICABLE to app records              | No SQL/NoSQL queries; dormant GROQ uses a `$slug` parameter; Redis quota keys do not interpolate commands                                             |
| SSRF / redirects     | PASS within reviewed paths                 | No user-URL fetch or open redirect; static internal redirects; image-origin allowlist; localhost image URL rejected with HTTP 400                     |
| Logging              | PASS                                       | No tokens, request bodies, or contact details logged; receipt warning is generic                                                                      |
| Error handling       | PASS                                       | Typed/safe API errors, no provider messages, no-store responses, recoverable form state                                                               |
| Dependency security  | PARTIAL                                    | One moderate CLI advisory remains; no high/critical audit findings                                                                                    |

External links using `_blank` already use `noreferrer` (which also prevents
opener access) or `noopener noreferrer`. No tabnabbing change was necessary.
No eval/new Function/document.write/unsafe HTML input path was found in app
source. Local filesystem/image scripts are not HTTP endpoints. There are no
analytics/CDN scripts to remove; fonts are local and video iframe activation
is deferred. Thumbnail requests can still reach YouTube's image origin.

## Verification

| Check                                              | Result                                                                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial lint / typecheck / unit tests              | PASS; 37 original tests                                                                                                                                  |
| Regression reproduction                            | 12 of 16 new route tests failed against original code; all passed after fix                                                                              |
| `pnpm lint`                                        | PASS, zero warnings                                                                                                                                      |
| `pnpm typecheck`                                   | PASS                                                                                                                                                     |
| `pnpm test:run`                                    | PASS, 14 files / 81 tests                                                                                                                                |
| `pnpm format:check`                                | PASS                                                                                                                                                     |
| `git diff --check`                                 | PASS with the repository's declared CRLF lockfile rule                                                                                                   |
| `npx --yes pnpm@10.13.1 install --frozen-lockfile` | PASS                                                                                                                                                     |
| `pnpm build`                                       | PASS, production Turbopack build                                                                                                                         |
| GitHub Pages webpack export                        | PASS with the workflow's public URL/base path/mailbox                                                                                                    |
| Export inspection                                  | 79 HTML files, 75 localized pages; 3,824 local link/asset checks, zero failures; lang/dir/canonical checks pass; sitemap/robots present; no exported API |
| Production browser suite                           | PASS, 90 passed / 4 intentionally skipped, desktop and mobile                                                                                            |
| In-app browser                                     | Homepage theme/contact dialog visually checked; exported Arabic contact rendered and client validation worked; no message was sent                       |
| Local HTTP smoke                                   | Page headers present, GET contact API 405, disallowed remote image URL 400                                                                               |
| `pnpm exec sanity --version`                       | PASS, CLI 8.4.2 launches; not a Studio integration test                                                                                                  |
| Dependency audit                                   | PARTIAL / exit 1: one moderate UUID CLI finding                                                                                                          |
| `graphify update .`                                | PASS, AST-only, zero LLM tokens; graph/HTML/report refreshed                                                                                             |

Browser command:

```bash
PLAYWRIGHT_PORT=3027 PLAYWRIGHT_USE_PRODUCTION=true pnpm test:e2e
```

GitHub Pages command:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://geekhoussam.github.io/photographer_fes NEXT_PUBLIC_BASE_PATH=/photographer_fes NEXT_PUBLIC_CONTACT_EMAIL=contact@photographefes.com pnpm exec next build --webpack
```

The browser skips are existing mobile duplicates of viewport/route/keyboard
coverage. Browser email success uses a mocked API response; Redis and Resend
unit tests also use mocks. No result here establishes live mail delivery.
Vite's future config-loader notice and THREE.Clock deprecation are non-failing
upstream notices, not suppressed errors.

## Remaining Manual Actions

1. Before enabling server delivery, configure the exact public origin, verified
   Resend sender/recipient, Upstash endpoint/token, and trusted IP header.
   Verify header overwriting/direct-origin blocking, shared quota/expiry,
   outage handling, and real mail delivery in authorized staging. With mailto
   mode, the visitor sends the draft and these backend services are unnecessary.
2. Verify actual HTTPS/security headers at the intended host. GitHub Pages
   does not run Next.js header rules; stronger static CSP/header deployment
   requires a suitable host/edge integration.
3. Track the UUID/typeid-js upstream update and remove parser overrides after
   upstream pins are patched. Do not expose Sanity Studio/workbench without
   separately validating its account permissions, content policies, and peers.
4. Add host-level request/time limits, provider spend/abuse alerts, and
   appropriate bot protection if real abuse warrants it. IP quotas do not stop
   distributed bot traffic. No production monitoring service was configured.
5. Retain explicit release approval. No deployment or remote state was changed
   by this audit.

No credential rotation is requested because no real secret was discovered;
history and external secret stores remain outside the scan scope.

## Overall Risk

Remaining **package-manager advisory counts**:

```text
Critical: 0
High: 0
Medium (moderate): 1
Low: 0
```

Application findings S1/S2/S3: **two medium and one low fixed**, with zero
unfixed confirmed application vulnerabilities identified in this review.
Three informational architecture observations are retained: documentation
drift (corrected), dormant modules (retained), and non-actionable graph hubs/
zero import cycles. Potential deployment risks are listed separately and
are not silently counted as either proven safe or confirmed exploitable.

The remaining dependency issue is a tooling risk without an identified
public exploit path. Server release readiness depends on the manual checks;
the validated static export has a smaller attack surface and no contact API.

## Audit Change Log

- **[FOUND]** Untrusted/process-local quota, unbounded body read, absent
  response hardening, three functional bugs, outdated packages/docs.
- **[FIXED]** S1–S3 repository changes, the three bugs, compatible package
  patches, env/deployment documentation and test coverage.
- **[VERIFIED]** Unit, type/lint/format, production/static builds, browser
  journeys, exported links/assets, import graph and local response headers.
- **[REQUIRES MANUAL ACTION]** UUID upstream migration; real proxy/Redis/mail
  and public hosting controls; optional Studio validation.
- **[NOT AN ISSUE]** Fixed theme script/escaped JSON-LD, fixed email subject
  and recipient, React text escaping, protected external links, local-only
  filesystem scripts, framework-discovered modules, absent auth/database/API
  surfaces beyond public contact.
