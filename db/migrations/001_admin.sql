CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN','USER')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  locale TEXT NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr','en','ar')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE UNIQUE INDEX admin_users_email_unique ON admin_users ((lower(email)));

CREATE TABLE admin_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX sessions_expiry ON admin_sessions(expires_at);
CREATE INDEX sessions_user ON admin_sessions(user_id);

CREATE TABLE admin_rate_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  reset_at BIGINT NOT NULL
);
CREATE INDEX limits_expiry ON admin_rate_limits(reset_at);

CREATE TABLE clients (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX clients_email ON clients ((lower(email)));
CREATE INDEX clients_name ON clients ((lower(name)));

CREATE TABLE document_sequences (
  kind TEXT NOT NULL,
  year TEXT NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY(kind, year)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('ESTIMATE','INVOICE')),
  number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  source_estimate_id UUID UNIQUE REFERENCES documents(id) ON DELETE RESTRICT,
  client_snapshot JSONB NOT NULL,
  issuer_snapshot JSONB NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL CHECK (due_date >= issue_date),
  status TEXT NOT NULL CHECK (
    (kind = 'ESTIMATE' AND status IN ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED')) OR
    (kind = 'INVOICE' AND status IN ('DRAFT','SENT','PAID','PARTIALLY_PAID','OVERDUE','CANCELLED'))
  ),
  currency TEXT NOT NULL CHECK (currency IN ('MAD','EUR','USD')),
  subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
  discount BIGINT NOT NULL CHECK (discount >= 0 AND discount <= subtotal),
  tax BIGINT NOT NULL CHECK (tax >= 0),
  total BIGINT NOT NULL CHECK (total = subtotal - discount + tax),
  amount_paid BIGINT NOT NULL DEFAULT 0 CHECK (amount_paid >= 0 AND amount_paid <= total),
  notes TEXT NOT NULL DEFAULT '',
  terms TEXT NOT NULL DEFAULT '',
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX documents_client ON documents(client_id);
CREATE INDEX documents_kind_status ON documents(kind, status);
CREATE INDEX documents_created ON documents(kind, created_at DESC);

CREATE TABLE document_items (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price >= 0),
  tax_rate NUMERIC(5,2) NOT NULL CHECK (tax_rate >= 0 AND tax_rate <= 100),
  subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
  discount BIGINT NOT NULL CHECK (discount >= 0),
  tax BIGINT NOT NULL CHECK (tax >= 0),
  total BIGINT NOT NULL CHECK (total >= 0),
  UNIQUE(document_id, position)
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  project_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  budget TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL CHECK (consent),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','READ','REPLIED','ARCHIVED')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  email_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (email_status IN ('PENDING','SENT','FAILED','UNCONFIGURED')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  replied_at TIMESTAMPTZ
);
CREATE INDEX messages_status ON contact_messages(status, is_read);
CREATE INDEX messages_created ON contact_messages(created_at DESC);
CREATE INDEX messages_email ON contact_messages ((lower(email)));

CREATE TABLE message_replies (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES contact_messages(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING','SENT','FAILED')),
  provider_id TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ
);
CREATE INDEX replies_message ON message_replies(message_id, created_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL UNIQUE REFERENCES contact_messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'CONTACT_MESSAGE' CHECK (type = 'CONTACT_MESSAGE'),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX notifications_unread ON notifications(is_read, created_at DESC);

CREATE TABLE admin_settings (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  currency TEXT NOT NULL CHECK (currency IN ('MAD','EUR','USD')),
  issuer_name TEXT NOT NULL DEFAULT '',
  issuer_address TEXT NOT NULL DEFAULT '',
  issuer_email TEXT NOT NULL DEFAULT '',
  issuer_registration TEXT NOT NULL DEFAULT ''
);
INSERT INTO admin_settings (id, currency) VALUES (1, 'MAD');

CREATE TABLE admin_audit (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX audit_created ON admin_audit(created_at DESC);
