# PostgreSQL and Docker run manual

This guide runs the public portfolio, contact persistence and private admin
dashboard with PostgreSQL. The Docker configuration is for local development.
Production requirements are listed separately below.

## Requirements

- Docker Desktop, or Docker Engine with Docker Compose v2.
- For the recommended workflow: Node.js 22.12 or newer and pnpm 10.13.1.
- Free local ports 5432 (PostgreSQL), 3000 (Next.js) and optionally 8080
  (Adminer), or alternative ports.

The project pins the official `postgres:18.4-alpine` image. PostgreSQL data is
stored in the named `postgres_data` volume. The database port binds only to
`127.0.0.1`, so it is not exposed on the LAN.

## Option A: PostgreSQL in Docker, application on the host

This is the recommended development workflow because Next.js Fast Refresh and
the existing local tooling run directly on the host.

### 1. Configure Docker

From the project root:

```sh
cp .env.docker.example .env.docker
```

Open `.env.docker` and replace `POSTGRES_PASSWORD`. For the easiest connection
URL, use a long random value containing only letters, numbers, `_` and `-`.
Do not commit `.env.docker`.

If port 5432 is occupied, set for example:

```dotenv
POSTGRES_PORT=55433
```

### 2. Start PostgreSQL

```sh
docker compose --env-file .env.docker up -d postgres
docker compose --env-file .env.docker ps
```

Wait until `postgres` reports `healthy`. The first initialization also creates
the isolated `photographer_fes_test` database used by integration tests.

### 3. Configure the application

Install dependencies and create the local application environment:

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
```

In `.env.local`, set the password and port to the same values as `.env.docker`:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_DATABASE_URL=postgresql://photographer_fes:YOUR_URL_SAFE_PASSWORD@127.0.0.1:5432/photographer_fes
ADMIN_DATABASE_POOL_MAX=10
```

If a database password contains reserved URL characters, percent-encode it in
`ADMIN_DATABASE_URL`. Keep this variable server-only.

Sanity public values already documented in `.env.example` are required for the
current site build. Resend variables are optional locally; without them,
enquiries are still stored but contact notification and reply email are not sent.

### 4. Apply the schema and create the administrator

```sh
pnpm admin:migrate
pnpm admin:user create you@example.com "Your Name"
```

The password prompt is hidden and requires 15–256 characters. No default admin
or password is included. Migrations are transactional, take a PostgreSQL
advisory lock and can safely be run again.

### 5. Run the project

```sh
pnpm dev
```

Open:

- Public site: `http://localhost:3000/en` (also `/fr` and `/ar`).
- Contact form: `http://localhost:3000/en/contact`.
- Admin login: `http://localhost:3000/admin/login`.

After login, complete the issuer information under **Settings** before issuing
an estimate or invoice.

## Option B: run the complete local project in Docker

This profile runs PostgreSQL and the Next.js development server in containers.
It is convenient for a self-contained check, but does not mount the source tree;
rebuild after code changes.

On macOS, start Docker Desktop and wait until `docker info` succeeds:

```sh
open -a Docker
cd /Users/sloopy/Documents/photographer_fes
docker info
```

Save all edited files in your editor before rebuilding. Docker only includes
files saved on disk. Keep your existing `.env.docker`; only copy the example
on first setup, when `.env.docker` does not exist. This machine uses
`POSTGRES_PORT=55434` to avoid the conflict on port 5432, `APP_PORT=3000`,
`NEXT_PUBLIC_SITE_URL=http://localhost:3000`, and `ADMINER_PORT=8080`.

```sh
# First setup only; preserves an existing configuration.
test -f .env.docker || cp .env.docker.example .env.docker
# On first setup, edit POSTGRES_PASSWORD before continuing.
docker compose --env-file .env.docker --profile app --profile tools up -d --build
docker compose --env-file .env.docker --profile app --profile tools ps
docker compose --env-file .env.docker --profile app --profile tools logs -f app
```

Press Ctrl+C to leave the logs; the containers continue running.

For subsequent saved code or dependency changes, run the same `up -d --build`
command. A restart alone does not copy new source files into the image.

```sh
# Build the app image only, without starting or replacing containers.
docker compose --env-file .env.docker --profile app --profile tools build app

# Start all services using the existing image.
docker compose --env-file .env.docker --profile app --profile tools up -d

# Stop all project services, preserving the database.
docker compose --env-file .env.docker --profile app --profile tools stop

# Remove project containers and network, preserving the database volume.
docker compose --env-file .env.docker --profile app --profile tools down
```

To stop Docker Desktop itself, first stop the project, then choose **Quit Docker
Desktop** from its menu-bar icon. Quitting Docker Desktop stops other projects
running in Docker too. Do not add `--volumes` to `down` unless you intend to
delete the database.

The app waits for a healthy database and runs migrations before starting.
Create the administrator inside the running app container:

```sh
docker compose --env-file .env.docker --profile app exec app \
  pnpm admin:user create you@example.com "Your Name"
```

Open `http://localhost:3000`. If port 3000 is occupied, set `APP_PORT` and update
`NEXT_PUBLIC_SITE_URL` to the same port in `.env.docker`. This application
profile uses `next dev`; it is not a production container or deployment recipe.

## Inspect PostgreSQL in a browser

The optional `tools` profile runs Adminer on a loopback-only port:

```sh
docker compose --env-file .env.docker --profile tools up -d adminer
```

Open `http://localhost:8080` (or the `ADMINER_PORT` from `.env.docker`) and use:

- System: **PostgreSQL**
- Server: `postgres`
- Username: the `POSTGRES_USER` from `.env.docker`
- Password: the `POSTGRES_PASSWORD` from `.env.docker`
- Database: the `POSTGRES_DB` from `.env.docker`

The server name is `postgres`, not `localhost`, because Adminer connects over
the private Compose network. After login, choose **Tables and views** to browse
the application tables. `admin_users`, `admin_sessions`, `clients`,
`documents`, `contact_messages`, `message_replies`, `notifications`, `settings`
and `audit_log` are the main tables. Adminer is a local development tool; do not
publish its port on a production server.

To run PostgreSQL, the application and Adminer together:

```sh
docker compose --env-file .env.docker --profile app --profile tools up -d --build
```

## Tests and validation

The normal suite runs without a database and marks the PostgreSQL integration
file skipped when `TEST_DATABASE_URL` is absent:

```sh
pnpm typecheck
pnpm lint
pnpm test:run
pnpm exec next build --webpack
```

Run the real PostgreSQL service suite against the dedicated test database:

```sh
TEST_DATABASE_URL=postgresql://photographer_fes:YOUR_URL_SAFE_PASSWORD@127.0.0.1:5432/photographer_fes_test \
  pnpm test:postgres
```

The integration setup deletes and recreates the `public` schema in
`photographer_fes_test`. Never point `TEST_DATABASE_URL` at the development or
production database. In CI, the test file refuses to run without an explicit
test URL.

If a volume predates the test-database initializer, create it once:

```sh
docker compose --env-file .env.docker exec postgres \
  createdb -U photographer_fes -O photographer_fes photographer_fes_test
```

## Daily Docker commands

```sh
# Status and logs
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f postgres

# PostgreSQL console
docker compose --env-file .env.docker exec postgres \
  psql -U photographer_fes -d photographer_fes

# Stop while preserving data
docker compose --env-file .env.docker stop

# Remove containers/network while preserving the named volume
docker compose --env-file .env.docker down
```

`docker compose down --volumes` permanently deletes the local database volume.
Use it only when intentionally resetting disposable local data, then rerun the
migration and administrator commands.

## Backup and restore

Create a directory outside source control, then make a custom-format backup:

```sh
mkdir -p backups
docker compose --env-file .env.docker exec -T postgres \
  pg_dump -U photographer_fes -d photographer_fes --format=custom \
  > backups/photographer_fes.dump
```

Test restoration into a separate database before relying on a backup:

```sh
docker compose --env-file .env.docker exec postgres \
  createdb -U photographer_fes -O photographer_fes photographer_fes_restore_test
cat backups/photographer_fes.dump | \
  docker compose --env-file .env.docker exec -T postgres \
  pg_restore -U photographer_fes -d photographer_fes_restore_test --exit-on-error
```

## Production checklist

The local Compose file is not production infrastructure. Before deployment:

1. Provision persistent PostgreSQL with encrypted storage, automated backups,
   point-in-time recovery and a tested restore procedure.
2. Use a least-privilege application role and a separate migration role where
   the provider supports it. Never use the Docker sample password.
3. Require verified TLS in the provider connection URL, normally
   `sslmode=verify-full`, and store the URL in the hosting secret manager.
4. Size `ADMIN_DATABASE_POOL_MAX` across every application replica and the
   provider's connection limit; use an approved pooler if needed.
5. Run `pnpm admin:migrate` as a one-off release step before starting the new
   application version. Back up before every schema change.
6. Configure the trusted reverse-proxy IP header, Upstash rate limiting, HTTPS,
   Resend sender and recipient settings described in
   [Admin dashboard](admin-dashboard.md). Production contact/login protections
   intentionally fail closed when required infrastructure is missing.
7. Run the full validation commands and a staging login/contact/reply check.

The adapter uses a bounded node-postgres pool, server-parameterized queries and
same-client transactions. See the official node-postgres documentation for
[parameterized queries](https://node-postgres.com/features/queries),
[transactions](https://node-postgres.com/features/transactions) and
[pooling](https://node-postgres.com/features/pooling). The Docker variables and
volume behavior follow the
[official PostgreSQL image documentation](https://hub.docker.com/_/postgres).

## Troubleshooting

- **Port already allocated:** change `POSTGRES_PORT` or `APP_PORT`, then update
  the host-side URL in `.env.local`.
- **Password authentication failed after editing `.env.docker`:** image setup
  variables only initialize an empty volume. Either restore the old password or,
  for disposable local data only, run `docker compose down --volumes` and start
  again.
- **`setup_required`:** verify `ADMIN_DATABASE_URL` starts with `postgresql://`
  or `postgres://`, contains a database name and is available to the process.
- **Connection timeout:** confirm the container is healthy and the URL uses
  `127.0.0.1` from the host or `postgres` from the app container.
- **Migration failed:** inspect PostgreSQL logs and permissions. The transaction
  rolls back the file; correct the cause and rerun `pnpm admin:migrate`.
