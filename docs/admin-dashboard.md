# Admin dashboard

## Architecture and important files

The existing Next.js portfolio keeps its public layouts, content and styling.
The new `/admin` root layout reuses its fonts, color tokens, next-intl, Lucide,
Zod, React Hook Form, Resend and Vitest. No database or authentication previously
existed. Sanity remains CMS scaffolding, separate from private business data.

- `src/features/admin/server/`: authorization, database, queries and business services.
- `src/features/admin/schema.ts`, `money.ts`: strict validation and exact arithmetic.
- `src/features/admin/ui/`: small shared components, forms and server page compositions.
- `src/app/admin/`: private pages and login; `src/app/api/admin/[...path]/`: API entry point.
- `messages/admin/{en,fr,ar}.json`: matching translation keys, including errors.
- `src/styles/admin.css`: responsive admin styling and print rules.
- `db/migrations/001_admin.sql`: database schema; `scripts/admin-*.ts`: operator commands.
- `src/app/api/contact/route.ts`: persists contact submissions before optional email delivery.

`pg` is the database runtime dependency. The application uses a bounded
node-postgres connection pool, parameterized statements and same-client
transactions. `tsx` runs the private management scripts. PostgreSQL runs in the
provided local Docker stack; production can use a managed PostgreSQL service.
See the complete [PostgreSQL and Docker run manual](postgresql-docker.md).

## Local setup

1. Copy `.env.docker.example` to `.env.docker`, replace its local database
   password, then run `docker compose --env-file .env.docker up -d postgres`.
2. Run `pnpm install --frozen-lockfile`.
3. Copy `.env.example` to `.env.local` if no local configuration exists; do not
   overwrite existing credentials. Put the matching PostgreSQL password and
   port in `ADMIN_DATABASE_URL` and set
   `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
4. Run `pnpm admin:migrate`.
5. Run `pnpm admin:user create YOUR_EMAIL "YOUR_NAME"`. Enter a password at the
   hidden terminal prompt (15–256 characters). No account or password is seeded.
6. Run `pnpm dev` and open `/admin/login`.
7. In Settings, enter verified issuer details and choose the default currency.
   MAD is the explicit initial default; EUR and USD are also supported.

The commands read `.env.local` when present; existing environment variables take
precedence. Passwords may also be read from standard input for secret-manager
integration. Never place real passwords in shell arguments, history or source.

Recovery requires server operator access:

```sh
pnpm admin:user reset-password YOUR_EMAIL
pnpm admin:user disable YOUR_EMAIL
```

Both revoke all sessions. There is no public signup, automatic role promotion,
shared admin secret, or public password-reset endpoint.

## Database and safe record handling

| Tables                                | Purpose                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `admin_users`, `admin_sessions`       | ADMIN/USER roles, active state, salted password hashes, hashed tokens, expiry |
| `admin_rate_limits`                   | Atomic login quotas by trusted IP and normalized account                      |
| `clients`                             | Contact/company/address/notes, with name and email indexes                    |
| `documents`, `document_items`         | Shared typed storage for estimates/invoices and their line items              |
| `document_sequences`                  | Unique server-allocated DEV/INV numbers per kind/year                         |
| `contact_messages`, `message_replies` | Contact fields, consent, read state, reply content and delivery outcome       |
| `notifications`                       | One notification per new contact message                                      |
| `admin_settings`                      | Currency and verified issuer details                                          |
| `admin_audit`, `schema_migrations`    | Operation metadata and applied migration versions                             |

Client deletion is refused if financial documents reference it. Only drafts can
be edited/deleted. Issued documents and client/issuer snapshots are preserved.
Items cascade only with an allowed draft deletion. Replies and source estimates
have protected references. Estimate conversion is idempotent with a unique
source-estimate reference. Deleted document numbers are never reused.

Writes use PostgreSQL serializable transactions. Serialization failures and
deadlocks are retried only after PostgreSQL confirms rollback; arbitrary network
or uncertain commit errors are not replayed. Read batches use one repeatable-read
read-only transaction. Migrations are transactional and serialized by an
advisory lock. Back up first and add new migrations instead of editing an applied
one. Lists use 20 records per page; dashboard counts use aggregate queries and
recent sections retrieve only five records.

## Pages and API

Pages: `/admin`, `/admin/login`, `/admin/clients`, `/admin/estimates`,
`/admin/invoices`, `/admin/messages`, `/admin/notifications`, `/admin/settings`.
Clients, estimates and invoices also have `/new`, `/[id]`, `/[id]/edit` pages;
messages have `/[id]`. Document details support browser Print / Save as PDF.

All API paths below are prefixed by `/api/admin`. Private pages and API
operations independently require a valid ADMIN database session. Only login,
logout and the non-sensitive sign-in language preference are exceptions.

| API                                           | Methods / purpose                                   |
| --------------------------------------------- | --------------------------------------------------- |
| `/auth/login`, `/auth/logout`                 | POST: issue/revoke a session                        |
| `/preferences`                                | PATCH: cookie locale and signed-in admin preference |
| `/overview`                                   | GET: counts and recent records                      |
| `/clients`, `/clients/[id]`                   | GET, POST, PATCH, DELETE                            |
| `/estimates`, `/invoices`, `/[resource]/[id]` | GET, POST, PATCH, DELETE                            |
| `/[resource]/[id]/status`                     | PATCH: validated transition and revision            |
| `/invoices/[id]/payment`                      | POST: cumulative received amount and revision       |
| `/estimates/[id]/convert`                     | POST: create or return linked invoice draft         |
| `/messages`, `/messages/[id]`                 | GET; PATCH read/unread/archive                      |
| `/messages/[id]/reply`                        | POST: content and stable UUID request ID            |
| `/notifications`, `/notifications/count`      | GET: list / unread count                            |
| `/notifications/[id]`, `/notifications/all`   | PATCH: acknowledge one/all                          |
| `/settings`                                   | GET, PATCH                                          |

Financial edits require the current revision. Invalid transitions, overpayments,
reduced receipts and stale writes are rejected. “Mark as sent” confirms the
administrator has sent the document; it does not email the invoice. There is no
refund/credit-note workflow, accounting ledger or external invoice integration.

## Financial calculations

Amounts are validated decimal strings with two places; quantities allow three.
Server calculations use BigInt scaled integers and half-up rounding per line.
A fixed discount is apportioned before line tax, with remaining cents assigned
in line order. Checked integer minor-unit totals are capped at 1,000,000,000,000.
Browser totals and arbitrary status fields are rejected. Expiry/overdue status
is derived from stored dates without a scheduler. Conversion creates a draft
dated today, with today's due date available for editing.

Print views are operational templates, not a claim of tax-law compliance.
Confirm business identifiers, required wording, tax treatment, numbering,
retention and credit/refund procedures before official billing. No business
identifiers or retention periods are invented.

## Contact, replies and notifications

Contact form → existing origin/body/schema/quota checks → atomic message and
notification persistence → optional Resend notification → private admin inbox.

Success means the enquiry is saved. Missing/failed notification email does not
discard it or invite duplicate resubmissions. Its delivery status appears in
the inbox. Storage failure returns 503. All original fields and the honeypot
are preserved. Opening a message clears its notification; marking unread
restores the count, and archiving clears it. State is shared across admins.
Header counts refresh after navigation/mutations and once per visible minute.

Replies are saved before calling Resend. Only provider acceptance sets REPLIED
and a sent timestamp; it does not guarantee arrival in the recipient's inbox.
Failure is retained in history and can be retried with the same request ID,
which is also the provider idempotency key. Pending retries wait two minutes.
Requests older than 23 hours are not replayed automatically: verify their
provider outcome before creating a new reply. New replies are limited to 30 per
admin per hour. History shows the latest 50 replies with a limit notice.

## Security and localization

- Session tokens contain 32 random bytes; only their SHA-256 hashes are stored.
  Cookies are HttpOnly, SameSite=Strict, expire after eight hours, and use Secure
  plus `__Host-` in production. Database role/active state is checked per request.
- Salted Node scrypt uses N=131072, r=8, p=1, following the
  [OWASP scrypt baseline](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
  Unknown users perform the same derivation and receive a generic login error.
  A password reset during login cannot issue a session with the old password.
- Mutation requests require the configured origin and JSON, with a 16 KiB
  streamed-body cap and 10-second timeout. Private unauthenticated requests are
  rejected before body parsing. There are no added CORS permissions.
- Parameterized SQL, UUIDs, strict schemas, role guards and revision checks
  protect against injection, IDOR, mass assignment and stale writes. React
  escapes user text; replies use plain text and a fixed subject. No user HTML,
  attachments or public upload endpoints are accepted.
- APIs are private/no-store. Admin metadata is noindex and robots excludes it.
  Audit records contain action/actor/resource/timestamp, not confidential content.
- EN/FR/AR labels, statuses, errors and confirmations use translation resources.
  The existing `NEXT_LOCALE` cookie and saved admin preference retain the URL.
  The root document renders Arabic `lang` and RTL; logical CSS mirrors layout.
  Email/number fields are isolated directionally; money/dates use locale formatting.

## Environment and rollout

| Variable                                             | Requirement                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `ADMIN_DATABASE_URL`                                 | PostgreSQL URL for admin and server contact persistence; server secret |
| `ADMIN_DATABASE_POOL_MAX`                            | Connections per app process, integer 1–30; default 10                  |
| `NEXT_PUBLIC_SITE_URL`                               | Exact canonical origin; HTTPS in production                            |
| `CONTACT_RATE_LIMIT_IP_HEADER`                       | Trusted proxy client-IP header for production login/contact            |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Existing production contact quotas                                     |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`               | Required to send replies                                               |
| `CONTACT_TO_EMAIL`                                   | Also required for contact notification email                           |
| `NEXT_PUBLIC_CONTACT_EMAIL`                          | Static hosting mailto fallback only                                    |
| `NEXT_BUILD_DIR`                                     | Optional isolated local preview output, e.g. `.next-admin-preview`     |

The PostgreSQL URL must use `postgresql://` or `postgres://` and include a
database name. Require provider-verified TLS in production and keep the URL in a
secret manager. The trusted proxy must overwrite the IP header with one
validated address and block direct origin access. Production login fails closed
without it; contact
also requires the existing distributed limiter. Keep database credentials
server-only. Use encrypted PostgreSQL storage, automated backups and a tested
restore. Restart after environment changes. No production account, provider
credentials or deployment has been created by this implementation.

Use a Next.js Node server for admin features. Before public rollout, configure
storage, migrate, provision the administrator, verify email and proxy settings,
and confirm privacy/retention and billing requirements. This implementation has
no MFA; an identity-aware access gateway with MFA can provide an additional
boundary for internet-facing administration.

GitHub Pages remains the public static portfolio. The `.server.tsx`/`.server.ts`
route entry points are recognized only in server mode and are absent from its
static manifest/export. `tsconfig.static.json` isolates static route validation
from dynamic development types. Static hosting cannot run login, persistence or
replies; its mailto contact draft cannot populate the inbox. On server hosting,
contact always posts to `/api/contact`, even if a public email is configured.

## Verification

Run `pnpm typecheck`, `pnpm lint`, `pnpm test:run` and
`pnpm exec next build --webpack`. The Pages workflow documents its build
variables. The service integration suite uses the dedicated PostgreSQL test
database and a mocked email transport; it never targets development data, sends
email or seeds real client data. Final results and browser coverage are recorded
in `docs/admin-verification.md`.
