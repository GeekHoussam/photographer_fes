# Vercel deployment

1. Import the repository in Vercel and keep pnpm as the detected package manager.
2. Use Node.js 22.12 or newer and `pnpm build`.
3. Configure the public site URL, Sanity project/dataset/version, server-only Sanity preview token if used, Resend key, verified sender, business recipient, and production rate-limiter credentials.
4. Add preview and production domains to Sanity CORS origins with credentials only where preview authentication requires them.
5. Verify the Resend domain's DNS records before testing live contact mail.
6. Run the production smoke journeys in French, English, and Arabic, then verify sitemap, robots, canonical URLs, alternate locales, structured data, and legacy redirects.
7. Connect the approved production domain only after placeholders and legal drafts are resolved.

Rollback through Vercel's previous deployment promotion. Content-only mistakes should normally be corrected or unpublished in Sanity without a code rollback.

## Contact mode and production release gate

The current public pages use local typed content, not live Sanity queries.
Sanity is a separate, optional Studio. Do not configure preview credentials
unless an actual preview integration is being added.

For static hosting, keep `NEXT_PUBLIC_CONTACT_EMAIL` set to the approved public
mailbox. This opens a draft; the visitor must send it. No API, Resend, or Redis
is used. The GitHub Pages workflow sets this fallback explicitly.

For server delivery, leave `NEXT_PUBLIC_CONTACT_EMAIL` unset and configure:

- `NEXT_PUBLIC_SITE_URL`: the exact public origin, optionally with a base path.
  The browser's Origin must match its origin; arbitrary preview domains are
  not implicitly trusted. Configure preview environments separately.
- `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`: a verified sender
  and the approved business recipient; all server-only.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: a writable Upstash
  Redis REST endpoint over HTTPS and a token permitted to run EVAL, INCR, and
  PEXPIRE. The URL must end in `.upstash.io` without a path, query, or credentials.
  The adapter uses one atomic script and a three-second network timeout.
- `CONTACT_RATE_LIMIT_IP_HEADER`: the single-IP header your hosting proxy
  overwrites. Vercel's IP helper uses `x-real-ip`; verify behavior for your
  actual proxy chain before setting it. Never blindly trust an incoming
  `x-forwarded-for`, and prevent direct access that bypasses the proxy.

The API returns 503 without mail delivery if production limiting is missing
or fails. It requires same-origin JSON, caps actual request bodies at 16 KiB
and ten seconds, and returns 429 after five attempts in 15 minutes. Keys use
IP hashes with expiry; treat them as pseudonymous data, not anonymous data.
The limiter is not bot detection: configure edge body/time limits, abuse
monitoring, and provider spend alerts. Multi-IP spam still requires edge
controls. A receipt email failure after successful business delivery is
logged without personal data and no longer reports a failed enquiry.

Before switching to server contact, test quota sharing across two instances,
expiry, spoofed-header resistance, backend outage handling, and actual mail
delivery in an authorized staging environment. Local unit tests mock external
services and do not establish production configuration or delivery.

References: [Upstash REST API](https://upstash.com/docs/redis/features/restapi),
[Vercel IP helper source](https://github.com/vercel/vercel/blob/main/packages/functions/src/headers.ts).

## Security headers and static export

The server sends CSP, nosniff, Referrer-Policy, Permissions-Policy, and framing
restrictions from `src/config/security-headers.ts`. With an HTTPS public URL
it also sends HSTS for one year, without `includeSubDomains` or `preload`.
Production CSP does not allow eval or wildcard origins. It allows inline
scripts and styles because static Next.js hydration, the theme initializer,
and existing animation depend on them. This is a documented limitation, not
a strict XSS prevention guarantee. Nonces would require changing the static
rendering strategy; a hash-based static policy needs a separate build/edge
integration. See [Next.js CSP guidance](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/content-security-policy.mdx).

GitHub Pages does not execute `next.config.ts` headers, API routes, Proxy, or
server redirects. Apply equivalent headers through a capable edge/hosting
service if required; do not assume the static build installs them. Verify
actual public response headers after an authorized deployment. The local
export build is:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://geekhoussam.github.io/photographer_fes NEXT_PUBLIC_BASE_PATH=/photographer_fes NEXT_PUBLIC_CONTACT_EMAIL=contact@photographefes.com pnpm exec next build --webpack
```

Keep the hosting URL and mailbox above aligned with the approved workflow.
Building is local validation; it does not publish the site.
