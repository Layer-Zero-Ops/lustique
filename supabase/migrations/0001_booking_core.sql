-- Lustique booking core (Pass 3 · v1). Money is integer ZAR cents.
-- RLS is enabled + deny-all (no end-user logins in v1); the Worker uses the
-- service-role key, which bypasses RLS. Pass 4 adds per-role policies.

create type booking_status as enum (
  'requested', 'confirmed', 'deposit_paid', 'settled', 'declined', 'cancelled', 'expired'
);

create table bookings (
  id                        uuid primary key default gen_random_uuid(),
  reference                 text not null unique,
  idempotency_key           text not null unique,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  status                    booking_status not null default 'requested',
  occasion                  text not null,
  wedding_date              date not null,
  bride_name                text not null,
  bride_email               text not null,
  bride_phone               text not null,
  town                      text,
  province                  text,
  venue                     text,
  party_size                int  not null,
  estimate_input            jsonb not null,
  total_cents               int  not null,
  quote_lines               jsonb not null,
  deposit_pct               int  not null check (deposit_pct in (25, 50, 100)),
  deposit_net_cents         int  not null,
  balance_net_cents         int  not null,
  consent_at                timestamptz not null,
  confirm_token_hash        text not null,
  confirm_token_expires_at  timestamptz not null,
  confirm_token_used_at     timestamptz,
  confirmed_at              timestamptz,
  declined_at               timestamptz,
  deposit_paid_at           timestamptz,
  settled_at                timestamptz,
  balance_reminder_sent_at  timestamptz,
  notes                     text
);
create index bookings_status_idx       on bookings (status);
create index bookings_wedding_date_idx on bookings (wedding_date);

create table payments (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references bookings (id) on delete cascade,
  kind              text not null check (kind in ('deposit', 'balance')),
  net_cents         int  not null,
  payable_cents     int  not null,
  yoco_checkout_id  text,
  yoco_payment_id   text unique,
  status            text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  pay_url           text,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz,
  raw               jsonb
);
create index payments_booking_id_idx on payments (booking_id);

create table audit_log (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings (id) on delete set null,
  event_type  text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index audit_log_booking_id_idx on audit_log (booking_id);

-- updated_at maintenance
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger bookings_set_updated_at before update on bookings
  for each row execute function set_updated_at();

-- RLS: enable everywhere, define NO policies → deny-all to anon/auth. Service role bypasses.
alter table bookings  enable row level security;
alter table payments  enable row level security;
alter table audit_log enable row level security;
