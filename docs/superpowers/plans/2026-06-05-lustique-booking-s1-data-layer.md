# Booking Core — S1 Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tested persistence + money foundation for the booking loop — Supabase schema, the shared financial helpers, the Worker's data-access + R2 audit writer, and the cron keep-warm — so S2–S6 build on a green base.

**Architecture:** Money rules join the single source of truth in `@lustique/pricing` (a new `payments.ts`). The Worker gains `src/booking/{util,db,audit}.ts` — pure helpers, a PostgREST-over-`fetch` data-access layer keyed by secret-name env, and an R2 audit writer — all unit-tested with injected `fetch`/clock/bucket (no live accounts needed to test). The SQL migration defines an enum + 3 tables with **deny-all RLS**; the Worker uses the service-role key.

**Tech Stack:** TypeScript, Vitest, Cloudflare Workers (`wrangler`), Supabase Postgres + PostgREST, Cloudflare R2.

**Spec:** [`2026-06-05-lustique-booking-core-design.md`](../specs/2026-06-05-lustique-booking-core-design.md) (§6 data model, §7 Worker, §8 money, §12 security).

**Account gate:** *Writing and testing* this plan needs **no accounts** — every integration is tested with fakes. *Applying* the migration (Task 4) and going live needs the **client-owned Supabase project** (Pieter). One step needs Pieter's terminal: `npm install` after Task 2 adds vitest (the sandbox blocks network installs).

---

## File Structure

| File | Responsibility |
|---|---|
| `shared/pricing/src/payments.ts` | **Create.** Booking money: `randToCents`, `splitDeposit`, `grossUp`, `YOCO_FEE_RATE`. |
| `shared/pricing/src/payments.test.ts` | **Create.** Money unit tests (incl. the spec's worked example + 100% case). |
| `shared/pricing/src/index.ts` | **Modify.** Re-export `./payments`. |
| `worker/package.json` | **Modify.** Add `vitest` devDep + `test` scripts. |
| `worker/vitest.config.ts` | **Create.** Mirror shared/pricing's config. |
| `worker/src/booking/util.ts` | **Create.** `workingDaysBefore`, `makeReference`. |
| `worker/src/booking/util.test.ts` | **Create.** Pure-helper tests. |
| `supabase/migrations/0001_booking_core.sql` | **Create.** Enum + `bookings`/`payments`/`audit_log` + indexes + RLS. |
| `worker/src/booking/db.ts` | **Create.** PostgREST data-access (insert/update/find/keep-warm). |
| `worker/src/booking/db.test.ts` | **Create.** Data-access tests with injected `fetch` (incl. the dedupe path). |
| `worker/src/booking/audit.ts` | **Create.** R2 + `audit_log` append-only writer. |
| `worker/src/booking/audit.test.ts` | **Create.** Audit tests with a fake bucket + fixed clock. |
| `worker/src/index.ts` | **Modify.** Extend `Env`; add a keep-warm `scheduled()` handler. |
| `worker/wrangler.toml` | **Modify.** R2 binding + daily cron trigger. |

---

## Task 1: Money helpers in `@lustique/pricing`

**Files:**
- Create: `shared/pricing/src/payments.ts`
- Test: `shared/pricing/src/payments.test.ts`
- Modify: `shared/pricing/src/index.ts`

- [ ] **Step 1: Write the failing test**

```ts
// shared/pricing/src/payments.test.ts
import { describe, it, expect } from "vitest";
import { randToCents, splitDeposit, grossUp, YOCO_FEE_RATE } from "./payments";

describe("randToCents", () => {
  it("converts whole Rand to cents exactly", () => {
    expect(randToCents(2690)).toBe(269000);
    expect(randToCents(10000)).toBe(1000000);
  });
});

describe("splitDeposit", () => {
  it("50% splits evenly", () => {
    expect(splitDeposit(1000000, 50)).toEqual({ depositNetCents: 500000, balanceNetCents: 500000 });
  });
  it("100% leaves a zero balance (the settle-outright case)", () => {
    expect(splitDeposit(1000000, 100)).toEqual({ depositNetCents: 1000000, balanceNetCents: 0 });
  });
  it("balance absorbs rounding so the parts always sum to the total", () => {
    const { depositNetCents, balanceNetCents } = splitDeposit(269001, 25);
    expect(depositNetCents + balanceNetCents).toBe(269001);
  });
});

describe("grossUp", () => {
  it("grosses a R5,000 deposit at 2.9% to R5,149.34 (ceil ⇒ never under-net)", () => {
    expect(grossUp(500000, 0.029)).toBe(514934); // ceil(500000 / 0.971)
  });
  it("returns 0 for a zero balance (100% deposit)", () => {
    expect(grossUp(0)).toBe(0);
  });
  it("defaults to YOCO_FEE_RATE", () => {
    expect(grossUp(500000)).toBe(grossUp(500000, YOCO_FEE_RATE));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -w @lustique/pricing`
Expected: FAIL — `Cannot find module './payments'`.

- [ ] **Step 3: Write the minimal implementation**

```ts
// shared/pricing/src/payments.ts
/**
 * Booking financials — the money truth the Worker shares with the estimate logic.
 * All amounts are integer ZAR cents. computeEstimate() returns whole Rand, so
 * randToCents is exact (×100). Kept in this package so every money rule lives in one place.
 */

/** Yoco's per-transaction online fee as a fraction. Config — set to Zandeline's real rate (spec §15). */
export const YOCO_FEE_RATE = 0.029;

/** Whole-Rand (from computeEstimate) → integer cents. Exact: pricing is integer Rand. */
export const randToCents = (rand: number): number => Math.round(rand * 100);

/**
 * Split a total into the chosen deposit and the remaining balance, in cents.
 * Balance absorbs any rounding so depositNet + balanceNet === total, always.
 */
export function splitDeposit(
  totalCents: number,
  pct: 25 | 50 | 100,
): { depositNetCents: number; balanceNetCents: number } {
  const depositNetCents = Math.round((totalCents * pct) / 100);
  return { depositNetCents, balanceNetCents: totalCents - depositNetCents };
}

/**
 * Gross a net amount up so that, after Yoco's fee, Lustique nets the full amount.
 * ceil ⇒ Lustique never under-nets by a cent; the bride covers the fee (shown openly).
 * A zero net (100% deposit ⇒ no balance) grosses to zero — no R0 link is ever created.
 */
export function grossUp(netCents: number, feeRate: number = YOCO_FEE_RATE): number {
  if (netCents <= 0) return 0;
  return Math.ceil(netCents / (1 - feeRate));
}
```

- [ ] **Step 4: Re-export from the package index**

In `shared/pricing/src/index.ts`, add a line after the existing exports:

```ts
export * from "./payments";
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -w @lustique/pricing`
Expected: PASS — all `payments` tests green, existing `estimate` tests still green.

- [ ] **Step 6: Commit**

```bash
git add shared/pricing/src/payments.ts shared/pricing/src/payments.test.ts shared/pricing/src/index.ts
git commit -m "feat(pricing): booking money helpers (randToCents, splitDeposit, grossUp)"
```

---

## Task 2: Add Vitest to the Worker

**Files:**
- Modify: `worker/package.json`
- Create: `worker/vitest.config.ts`

- [ ] **Step 1: Add the test tooling to `worker/package.json`**

Set `scripts` and `devDependencies` to:

```json
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0",
    "wrangler": "^3.80.0"
  }
```

- [ ] **Step 2: Create `worker/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 3: Install (Pieter's terminal — the sandbox blocks network installs)**

Run (at repo root): `npm install`
Expected: `vitest` resolves into the workspace; no errors.

- [ ] **Step 4: Verify the runner works**

Run: `npm test -w lustique-form-handler`
Expected: Vitest runs and reports **"No test files found"** (none exist yet) — confirms the runner is wired. (Tasks 3/5/6 add the tests.)

- [ ] **Step 5: Commit**

```bash
git add worker/package.json worker/vitest.config.ts
git commit -m "chore(worker): add vitest test tooling"
```

---

## Task 3: Booking pure helpers

**Files:**
- Create: `worker/src/booking/util.ts`
- Test: `worker/src/booking/util.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// worker/src/booking/util.test.ts
import { describe, it, expect } from "vitest";
import { workingDaysBefore, makeReference } from "./util";

describe("workingDaysBefore", () => {
  // 2024-01-08 is a Monday; 2024-01-01 is the previous Monday.
  it("1 working day before Mon 2024-01-08 is Fri 2024-01-05", () => {
    expect(workingDaysBefore(new Date("2024-01-08T00:00:00Z"), 1).toISOString().slice(0, 10)).toBe("2024-01-05");
  });
  it("5 working days before Mon 2024-01-08 is Mon 2024-01-01 (skips the weekend)", () => {
    expect(workingDaysBefore(new Date("2024-01-08T00:00:00Z"), 5).toISOString().slice(0, 10)).toBe("2024-01-01");
  });
  it("never lands on a weekend", () => {
    for (let n = 1; n <= 30; n++) {
      const day = workingDaysBefore(new Date("2024-01-08T00:00:00Z"), n).getUTCDay();
      expect(day).not.toBe(0);
      expect(day).not.toBe(6);
    }
  });
});

describe("makeReference", () => {
  it("formats a human reference from the uuid + year", () => {
    expect(makeReference("1a2b3c4d-5e6f-7081-9213-456789abcdef", 2026)).toBe("LUS-2026-1A2B3C");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -w lustique-form-handler`
Expected: FAIL — `Cannot find module './util'`.

- [ ] **Step 3: Write the minimal implementation**

```ts
// worker/src/booking/util.ts
/** Pure booking helpers (no I/O) — easy to test, reused across the booking endpoints. */

/**
 * The date `n` working days (Mon–Fri) before `from`. v1 ignores SA public holidays
 * (spec §15) — working day = weekday. Used for the balance-reminder lead time.
 */
export function workingDaysBefore(from: Date, n: number): Date {
  const d = new Date(from.getTime());
  let remaining = n;
  while (remaining > 0) {
    d.setUTCDate(d.getUTCDate() - 1);
    const day = d.getUTCDay(); // 0 Sun … 6 Sat
    if (day !== 0 && day !== 6) remaining--;
  }
  return d;
}

/** Human booking reference from the uuid + year, e.g. LUS-2026-1A2B3C. Deterministic, quotable. */
export const makeReference = (id: string, year: number): string =>
  `LUS-${year}-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -w lustique-form-handler`
Expected: PASS — all `util` tests green.

- [ ] **Step 5: Commit**

```bash
git add worker/src/booking/util.ts worker/src/booking/util.test.ts
git commit -m "feat(worker): booking pure helpers (workingDaysBefore, makeReference)"
```

---

## Task 4: Supabase schema migration

**Files:**
- Create: `supabase/migrations/0001_booking_core.sql`

> No unit test (pure DDL); verification is a peer read + a real apply once the project exists. The `yoco_payment_id unique` constraint gives webhook idempotency at the database (spec §9); deny-all RLS protects PII (spec §12).

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/0001_booking_core.sql
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
```

- [ ] **Step 2: Document the apply command (runs when the project exists — Pieter)**

Add nothing to code; this is the gated step. Once the client-owned Supabase project exists, apply with the Supabase CLI from repo root:
`supabase link --project-ref <ref> && supabase db push`
Expected: `0001_booking_core.sql` applied; `bookings`/`payments`/`audit_log` exist with RLS enabled.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0001_booking_core.sql
git commit -m "feat(db): booking core schema (bookings, payments, audit_log) + deny-all RLS"
```

---

## Task 5: Worker data-access (PostgREST over fetch)

**Files:**
- Create: `worker/src/booking/db.ts`
- Test: `worker/src/booking/db.test.ts`

- [ ] **Step 1: Write the failing test** (covers the **dedupe path** — finding #2 from the review)

```ts
// worker/src/booking/db.test.ts
import { describe, it, expect, vi } from "vitest";
import { insertBooking, updateBookingStatus, findPaymentByYocoId, keepWarm } from "./db";

const env = { SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_KEY: "svc" };
const res = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("insertBooking", () => {
  it("returns the inserted row", async () => {
    const f = vi.fn().mockResolvedValue(res([{ id: "u1", reference: "LUS-2026-AAA111" }], 201));
    const out = await insertBooking(env, { idempotency_key: "k1" }, f as unknown as typeof fetch);
    expect(out).toEqual({ id: "u1", reference: "LUS-2026-AAA111" });
    expect(f).toHaveBeenCalledOnce();
  });
  it("on a duplicate (empty insert) re-fetches the existing booking — never a second row", async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(res([], 201))                                  // conflict → ignored
      .mockResolvedValueOnce(res([{ id: "u9", reference: "LUS-2026-DUP999" }])); // re-fetch
    const out = await insertBooking(env, { idempotency_key: "k1" }, f as unknown as typeof fetch);
    expect(out).toEqual({ id: "u9", reference: "LUS-2026-DUP999" });
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("throws on a non-OK insert", async () => {
    const f = vi.fn().mockResolvedValue(res({ message: "boom" }, 500));
    await expect(insertBooking(env, { idempotency_key: "k1" }, f as unknown as typeof fetch)).rejects.toThrow(/500/);
  });
});

describe("updateBookingStatus", () => {
  it("PATCHes the row by id and returns it", async () => {
    const f = vi.fn().mockResolvedValue(res([{ id: "u1", status: "confirmed" }]));
    const out = await updateBookingStatus(env, "u1", { status: "confirmed" }, f as unknown as typeof fetch);
    expect(out.status).toBe("confirmed");
    const url = (f.mock.calls[0]![0] as string);
    expect(url).toContain("/rest/v1/bookings?id=eq.u1");
  });
});

describe("findPaymentByYocoId", () => {
  it("returns null when no payment matches", async () => {
    const f = vi.fn().mockResolvedValue(res([]));
    expect(await findPaymentByYocoId(env, "pay_x", f as unknown as typeof fetch)).toBeNull();
  });
});

describe("keepWarm", () => {
  it("issues a tiny select to reset the free-tier pause clock", async () => {
    const f = vi.fn().mockResolvedValue(res([]));
    await keepWarm(env, f as unknown as typeof fetch);
    expect((f.mock.calls[0]![0] as string)).toContain("/rest/v1/bookings?select=id&limit=1");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -w lustique-form-handler`
Expected: FAIL — `Cannot find module './db'`.

- [ ] **Step 3: Write the minimal implementation**

```ts
// worker/src/booking/db.ts
/**
 * Supabase data-access via PostgREST + fetch — no SDK, matching the Worker's fetch-only style.
 * Keyed by secret-NAME env (SUPABASE_URL / SUPABASE_SERVICE_KEY) so the data home is a
 * deploy-time choice (spec §2). `fetch` is injectable for unit tests.
 */
export interface DbEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

const rest = (env: DbEnv, path: string) => `${env.SUPABASE_URL}/rest/v1/${path}`;
const headers = (env: DbEnv): HeadersInit => ({
  apikey: env.SUPABASE_SERVICE_KEY,
  authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  "content-type": "application/json",
});

/** Insert a booking; on idempotency_key conflict, return the existing row (no duplicate). */
export async function insertBooking(
  env: DbEnv,
  row: Record<string, unknown>,
  f: typeof fetch = fetch,
): Promise<{ id: string; reference: string }> {
  const r = await f(rest(env, "bookings?on_conflict=idempotency_key&select=id,reference"), {
    method: "POST",
    headers: { ...headers(env), prefer: "return=representation,resolution=ignore-duplicates" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insertBooking ${r.status}: ${await r.text()}`);
  const rows = (await r.json()) as Array<{ id: string; reference: string }>;
  if (rows.length) return rows[0]!;
  // ignore-duplicates returned [] → the key already existed; fetch the original.
  return getBookingByIdempotencyKey(env, String(row.idempotency_key), f);
}

export async function getBookingByIdempotencyKey(
  env: DbEnv,
  key: string,
  f: typeof fetch = fetch,
): Promise<{ id: string; reference: string }> {
  const r = await f(rest(env, `bookings?idempotency_key=eq.${encodeURIComponent(key)}&select=id,reference`), {
    headers: headers(env),
  });
  if (!r.ok) throw new Error(`getBookingByIdempotencyKey ${r.status}`);
  return ((await r.json()) as Array<{ id: string; reference: string }>)[0]!;
}

/** PATCH a booking by id; returns the updated row. */
export async function updateBookingStatus(
  env: DbEnv,
  id: string,
  patch: Record<string, unknown>,
  f: typeof fetch = fetch,
): Promise<Record<string, unknown>> {
  const r = await f(rest(env, `bookings?id=eq.${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: { ...headers(env), prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`updateBookingStatus ${r.status}: ${await r.text()}`);
  return ((await r.json()) as Array<Record<string, unknown>>)[0]!;
}

export async function insertPayment(
  env: DbEnv,
  row: Record<string, unknown>,
  f: typeof fetch = fetch,
): Promise<{ id: string }> {
  const r = await f(rest(env, "payments?select=id"), {
    method: "POST",
    headers: { ...headers(env), prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insertPayment ${r.status}: ${await r.text()}`);
  return ((await r.json()) as Array<{ id: string }>)[0]!;
}

/** The webhook's idempotency lookup: has this Yoco payment already been recorded paid? */
export async function findPaymentByYocoId(
  env: DbEnv,
  yocoPaymentId: string,
  f: typeof fetch = fetch,
): Promise<Record<string, unknown> | null> {
  const r = await f(rest(env, `payments?yoco_payment_id=eq.${encodeURIComponent(yocoPaymentId)}&select=*`), {
    headers: headers(env),
  });
  if (!r.ok) throw new Error(`findPaymentByYocoId ${r.status}`);
  const rows = (await r.json()) as Array<Record<string, unknown>>;
  return rows.length ? rows[0]! : null;
}

export async function insertAudit(
  env: DbEnv,
  row: Record<string, unknown>,
  f: typeof fetch = fetch,
): Promise<void> {
  const r = await f(rest(env, "audit_log"), {
    method: "POST",
    headers: headers(env),
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insertAudit ${r.status}: ${await r.text()}`);
}

/** Daily keep-warm: a tiny read resets the free-tier 7-day pause clock (spec §2). */
export async function keepWarm(env: DbEnv, f: typeof fetch = fetch): Promise<void> {
  await f(rest(env, "bookings?select=id&limit=1"), { headers: headers(env) });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -w lustique-form-handler`
Expected: PASS — all `db` tests green, including the dedupe re-fetch path.

- [ ] **Step 5: Commit**

```bash
git add worker/src/booking/db.ts worker/src/booking/db.test.ts
git commit -m "feat(worker): Supabase PostgREST data-access with idempotent insert + keep-warm"
```

---

## Task 6: R2 audit writer

**Files:**
- Create: `worker/src/booking/audit.ts`
- Test: `worker/src/booking/audit.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// worker/src/booking/audit.test.ts
import { describe, it, expect, vi } from "vitest";
import { writeAudit } from "./audit";

it("puts one immutable R2 object and one audit_log row per event", async () => {
  const put = vi.fn().mockResolvedValue(undefined);
  const f = vi.fn().mockResolvedValue(new Response("", { status: 201 }));
  const env = {
    SUPABASE_URL: "https://x.supabase.co",
    SUPABASE_SERVICE_KEY: "svc",
    AUDIT: { put },
  };
  await writeAudit(
    env,
    { bookingId: "b1", eventType: "booking.confirmed", payload: { ok: true } },
    f as unknown as typeof fetch,
    () => new Date("2026-06-05T10:00:00Z"),
  );
  expect(put).toHaveBeenCalledWith(
    "audit/b1/2026-06-05T10:00:00.000Z-booking.confirmed.json",
    expect.stringContaining("booking.confirmed"),
  );
  expect(f).toHaveBeenCalledOnce();
});

it("keys system events (no booking) under audit/system/", async () => {
  const put = vi.fn().mockResolvedValue(undefined);
  const f = vi.fn().mockResolvedValue(new Response("", { status: 201 }));
  const env = { SUPABASE_URL: "https://x", SUPABASE_SERVICE_KEY: "svc", AUDIT: { put } };
  await writeAudit(
    env,
    { bookingId: null, eventType: "cron.keepwarm", payload: {} },
    f as unknown as typeof fetch,
    () => new Date("2026-06-05T06:00:00Z"),
  );
  expect((put.mock.calls[0]![0] as string)).toMatch(/^audit\/system\//);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -w lustique-form-handler`
Expected: FAIL — `Cannot find module './audit'`.

- [ ] **Step 3: Write the minimal implementation**

```ts
// worker/src/booking/audit.ts
/**
 * Append-only audit: one immutable R2 object + one audit_log row per state change.
 * This is the durability net that makes free-tier (no PITR) safe for money + PII and
 * doubles as the POPIA record of processing (spec §6/§12). `fetch` and the clock are
 * injectable for deterministic tests. R2 is typed structurally (just `put`) — no
 * @cloudflare/workers-types dependency needed.
 */
import { insertAudit, type DbEnv } from "./db";

interface R2Putter {
  put(key: string, value: string): Promise<unknown>;
}
export interface AuditEnv extends DbEnv {
  AUDIT: R2Putter;
}

export async function writeAudit(
  env: AuditEnv,
  e: { bookingId: string | null; eventType: string; payload: unknown },
  f: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<void> {
  const ts = now().toISOString();
  const key = `audit/${e.bookingId ?? "system"}/${ts}-${e.eventType}.json`;
  await env.AUDIT.put(key, JSON.stringify({ ...e, ts }));
  await insertAudit(env, { booking_id: e.bookingId, event_type: e.eventType, payload: e.payload }, f);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -w lustique-form-handler`
Expected: PASS — both `audit` tests green.

- [ ] **Step 5: Commit**

```bash
git add worker/src/booking/audit.ts worker/src/booking/audit.test.ts
git commit -m "feat(worker): append-only R2 + audit_log writer"
```

---

## Task 7: Wire Env + wrangler (R2 binding, cron, keep-warm handler)

**Files:**
- Modify: `worker/src/index.ts`
- Modify: `worker/wrangler.toml`

- [ ] **Step 1: Extend the `Env` interface** in `worker/src/index.ts`

Replace the existing `Env` interface with:

```ts
export interface Env {
  // existing (enquiry)
  BREVO_API_KEY: string;
  NOTIFY_EMAIL: string;
  ALLOWED_ORIGIN: string;
  // booking core (added S1; consumers land in S2–S5)
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  YOCO_SECRET_KEY: string;
  YOCO_WEBHOOK_SECRET: string;
  SIGNING_SECRET: string;
  TURNSTILE_SECRET: string;
  AUDIT: { put(key: string, value: string): Promise<unknown> };
}
```

- [ ] **Step 2: Add a keep-warm `scheduled()` handler** in `worker/src/index.ts`

Add this import at the top:

```ts
import { keepWarm } from "./booking/db";
import { writeAudit } from "./booking/audit";
```

Change the default export from `export default { async fetch(...) {...} }` to also export `scheduled` — add this method alongside `fetch` inside the default-export object:

```ts
  // Daily cron (wrangler.toml). v1: keep the free-tier DB warm + leave an audit breadcrumb.
  // The balance-reminder sweep + token expiry land in S5.
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        await keepWarm(env);
        await writeAudit(env, { bookingId: null, eventType: "cron.keepwarm", payload: {} });
      })().catch(() => {}), // never throw out of the scheduled handler
    );
  },
```

> Note: `ScheduledController` / `ExecutionContext` are Workers runtime globals provided by `wrangler` at build — no import needed (the existing `fetch` handler already relies on the same ambient types).

- [ ] **Step 3: Add the R2 binding + cron trigger** to `worker/wrangler.toml`

Append:

```toml
# Booking core (S1):
[[r2_buckets]]
binding = "AUDIT"
bucket_name = "lustique-audit"

[triggers]
crons = ["0 6 * * *"]   # 06:00 UTC ≈ 08:00 SAST — keep-warm now; balance sweep in S5
```

- [ ] **Step 4: Verify the Worker still type-checks and builds**

Run: `cd worker && npx wrangler deploy --dry-run --outdir dist-dry`
Expected: builds with **no errors** ("Total Upload …"), proving the new `Env`, `scheduled` export, imports, and bindings are valid. (`--dry-run` does not contact Cloudflare — no login needed.) Then: `rm -rf dist-dry`.

- [ ] **Step 5: Run the whole worker test suite**

Run: `npm test -w lustique-form-handler`
Expected: PASS — `util`, `db`, `audit` suites all green.

- [ ] **Step 6: Commit**

```bash
git add worker/src/index.ts worker/wrangler.toml
git commit -m "feat(worker): env + R2 binding + daily keep-warm scheduled handler"
```

---

## Self-Review

**Spec coverage (§6/§7/§12):** the three tables, enum, indexes, deny-all RLS, `idempotency_key` + `reference` + `consent_at` columns, the `yoco_payment_id unique` webhook-idempotency guard, the money helpers (gross-up/split, 100%→0 balance), the keep-warm cron, and the R2 audit writer are all present. **Not in S1 (correct):** the request/confirm/webhook endpoints (S2–S4), token sign/verify (S3), Yoco calls (S4), the balance sweep + purge (S5), emails (S6) — each its own plan.

**Placeholder scan:** none — every step has complete code + exact commands + expected output.

**Type consistency:** `DbEnv` (db.ts) is extended by `AuditEnv` (audit.ts) and subsumed by `Env` (index.ts); `insertAudit` is defined in Task 5 and consumed in Task 6; the `AUDIT` binding's `put` shape matches across `audit.ts`, `index.ts`, and the wrangler binding. `grossUp(500000, 0.029) === 514934` matches the spec's worked example exactly.

**Gate honesty:** Task 4's apply and the live integrations need the Supabase project (Pieter); everything else is built and tested with fakes now. Task 2 Step 3 (`npm install`) is Pieter's one terminal step.

---

## Execution Handoff

This plan is **build-ready now** for everything except Task 4's apply (gated on the Supabase project). When ready to build, per the device standard switch to **Sonnet** and use **superpowers:subagent-driven-development** (fresh subagent per task, review between) or **executing-plans** (inline, batched). S2 (request-to-book) gets its own plan next.
