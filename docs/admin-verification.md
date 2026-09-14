# Admin implementation verification

Verified locally on 2026-08-29. No deployment, production account, real client
data or outbound email was created.

## Automated checks

| Check                            | Result                                                    |
| -------------------------------- | --------------------------------------------------------- |
| `pnpm typecheck`                 | Passed                                                    |
| `pnpm lint`                      | Passed                                                    |
| `pnpm test:run`                  | Passed: 110; 33 PostgreSQL cases skipped without test URL |
| PostgreSQL integration suite     | Passed: 33 tests against PostgreSQL 18.4                  |
| `pnpm format:check`              | Passed                                                    |
| `git diff --check`               | Passed                                                    |
| `pnpm exec next build --webpack` | Passed, including all admin pages/API                     |
| GitHub Pages static build        | Passed; no admin routes or exported admin files           |
| `pnpm audit --prod`              | One existing moderate Sanity CLI `uuid` advisory remains  |

The Pages build used the existing workflow settings:

```sh
GITHUB_PAGES=true \
NEXT_PUBLIC_SITE_URL=https://geekhoussam.github.io/photographer_fes \
NEXT_PUBLIC_BASE_PATH=/photographer_fes \
NEXT_PUBLIC_CONTACT_EMAIL=contact@photographefes.com \
pnpm exec next build --webpack
```

The new tests cover exact monetary arithmetic and rounding, strict validation,
translation parity, a real isolated PostgreSQL test database, password and
session authorization, revocation, login quotas, client relationship safety,
concurrent unique numbering, draft edits and revisions, immutable issued
snapshots, payments, estimate conversion, message persistence, notifications,
reply success/failure/idempotency and manual unread behavior. Existing contact
tests cover storage failure and retained messages when optional email fails.
Email transports are mocked in automated tests.

## Browser and HTTP checks

A separate local development server used a disposable database and synthetic
administrator. Email credentials were unset throughout. Checked:

- Anonymous admin navigation reaches login; valid login opens the dashboard.
- Real empty dashboard counts, client creation/details and estimate creation.
- An estimate with quantity 2, price 100.25, discount 10 and tax 20% totals
  228.60 MAD in both the interface and stored financial result.
- HTTP transitions through sent/accepted, conversion to an invoice, partial
  payment and paid state.
- EN, FR and AR interface switching; Arabic document `lang="ar"`, `dir="rtl"`
  and mirrored navigation. Desktop and 390 × 844 mobile views were inspected.
  The mobile dashboard/message view had no horizontal document overflow, and
  mobile navigation opened and selected the inbox.
- Contact submission through the public form displayed success and persisted
  the enquiry. It appeared in the inbox with an unread notification.
- Opening a message updated read/notification state; explicitly marking it
  unread remained unread in the database. Missing email configuration displayed
  a reply warning instead of pretending to send.
- French homepage and English portfolio headings, navigation, locale direction
  and responsive layout remained available.

A separate `next start` production-mode server also passed an HTTP smoke check:

| Scenario                                       | Observed result                                                 |
| ---------------------------------------------- | --------------------------------------------------------------- |
| Anonymous private API                          | 401                                                             |
| Anonymous admin page                           | Next streamed redirect to `/admin/login`; no private data       |
| Login without trusted proxy IP                 | 503                                                             |
| Valid login with a synthetic trusted IP        | 200                                                             |
| Production session cookie                      | `__Host-`, Secure, HttpOnly, SameSite=Strict, Path=/; no Domain |
| Authorized overview API and page               | 200; API no-store and page noindex                              |
| Mutation with an untrusted Origin              | 403                                                             |
| Production contact without Redis configuration | 503                                                             |
| Logout, then reuse of revoked session          | 200, then 401                                                   |

The HTTP test supplied a synthetic trusted header on localhost. It does not
verify a real hosting proxy, HTTPS certificate or browser HTTPS cookie delivery.
The development preview and production smoke servers were stopped after checks;
their disposable account and database were removed.

## PostgreSQL and Docker replacement

The persistence implementation was subsequently replaced with PostgreSQL and
verified against the official `postgres:18.4-alpine` container:

- The container initialized with SCRAM host authentication, data checksums, a
  persistent named volume, health check and dedicated test database.
- `pnpm admin:migrate` applied the full schema, and an immediate second run was
  a no-op. The same command succeeded from the application container.
- All 33 service integration tests passed against the isolated PostgreSQL test
  database, including three concurrent invoice creations and transaction retry
  behavior.
- Administrator create, password-reset and disable commands completed against
  PostgreSQL without exposing the password in command arguments.
- The final Dockerfile built successfully as the unprivileged `node` user.
- The complete local Docker profile served a public French page, logged in with
  a disposable admin, loaded the private overview, persisted a public contact
  enquiry, exposed one inbox item and one unread notification, logged out and
  rejected reuse of the revoked session.
- A production-mode Next.js server used PostgreSQL successfully while retaining
  anonymous rejection, secure `__Host-` session cookies, origin checks, trusted
  IP failure behavior, distributed-limiter failure behavior and logout
  revocation.
- A custom-format `pg_dump` restored into a separate database; the restored
  migration record was queried successfully before the disposable volume was
  removed.
- Docker Compose configuration rendered successfully with loopback-only host
  ports. The temporary containers, volume, accounts and enquiry were deleted
  after verification.

No managed production PostgreSQL service, production TLS connection, backup
provider or real customer data was used.

## Review and remaining deployment checks

The targeted review checked independent page/API/service authorization,
parameterized database operations, escaped user content, strict input schemas,
request-origin/body protections, safe financial transitions, quotas, email
failure semantics and credential boundaries. Tests and local checks are not an
independent penetration test or an accounting/legal certification.

Still requires deployment-specific verification:

- Production PostgreSQL TLS, pool sizing, backups and restore.
- Trusted proxy IP overwriting, origin access restrictions and real Upstash.
- Resend sender verification, actual delivery and provider retry outcomes.
- Production TLS, optional MFA access gateway and operational monitoring.
- Business issuer identifiers, billing/tax/retention rules and privacy policy.

Document print styles are implemented; an exported PDF and every printer/browser
combination were not visually verified. Browser checks above were targeted,
not a run of the repository's complete Playwright suite.

`graphify update .` completed using the AST-only workflow. Its graph includes
the new TypeScript relationships. The optional SQL parser was unavailable, so
the migration is verified by actual PostgreSQL tests rather than graph extraction.
The update also produced the expected generated graph/community changes.

See [Admin dashboard](admin-dashboard.md) for architecture, schema, routes,
security decisions and setup.
