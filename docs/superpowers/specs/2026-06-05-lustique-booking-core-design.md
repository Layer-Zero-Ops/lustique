# Lustique Co. — Booking Core (Pass 3 · v1) Design Spec

**Status:** Design v1 — awaiting Pieter's review
**Last updated:** 2026-06-05
**Owner:** Pieter (decisions) · Zandeline (brand/ops sign-off) · Claude (build)
**Source-of-truth docs:** [`PLAN.md`](../../../PLAN.md) · [`PRICING.md`](../../../PRICING.md) · [`ARCHITECTURE.md`](../../../ARCHITECTURE.md) · [`SECURITY.md`](../../../SECURITY.md) · [`SETUP.md`](../../../SETUP.md)
**Builds on:** [`2026-06-02-lustique-astro-port-design.md`](./2026-06-02-lustique-astro-port-design.md) §8 (Worker) + §10 (Portal)

> **Reconciliation with the v2 design doc.** That doc split Pass 3 (Worker: enquiry/quote/quote-respond) from Pass 4 (Portal: auth + dedicated Supabase). This session's brainstorm **collapsed the separate quote-approval step** — *the estimator **is** the quote* — into a single **request → confirm → deposit** loop, and **pulls Supabase forward into Pass 3** for booking persistence (the v2 doc §8 explicitly anticipated this: *"we likely leapfrog… straight to the dedicated Supabase. Decide at the Pass-3 plan."* — decided here: **yes**). It is the **same** client-owned Supabase the Pass 4 portal will later use, so Pass 4 adds auth + RLS policies + dashboards with **no data migration**.

---

## 1. Goal & shape

Let a bride go from a live estimate to a **secured wedding date with a paid deposit**, with Zandeline as the one human gate — and nothing else manual. One loop:

> **estimator (= quote)** → bride **"Request to book"** (+ her date + chosen deposit %) → request **persisted + emailed to Zandeline** with a signed confirm link → she **eyeballs availability + confirms** → a **Yoco deposit link auto-fires** with the correct grossed-up amount → bride pays → **date secured** → a daily job sends the **balance reminder** 14 working days out, with its own pay link → balance paid → **settled**.

The marketing site already captures *enquiries* (`/api/enquiry`). This adds the **transactional** path beside it, on the same Worker boundary.

---

## 2. Locked decisions (this session)

| # | Decision | Choice | Why |
|---|---|---|---|
| 1 | **Data-store ownership** | **Client-owned** Supabase org; Zandeline owns it, LZ invited as **Administrator** | Matches the locked studio model; best POPIA posture (she's the Responsible Party, LZ a technical admin); Supabase's free allowance is *per-org* so this scales across clients at $0 |
| 2 | **Tier to start** | **Free**, upgrade to **Pro (~R/$25 mo)** when real deposits flow | Data volumes are trivially within free limits; the **daily balance-cron doubles as the keep-warm heartbeat** that defeats the 7-day pause; only PITR backups are given up, mitigated by the R2 audit log (§12) |
| 3 | **Confirm gate (v1)** | **Email-driven, no UI, no auth** — signed one-click confirm link | Fastest path to a working deposit loop; an admin dashboard is Pass 4 |
| 4 | **Yoco deposits** | **API-created Payment Links/checkouts**, grossed-up amount pre-filled; manual link only as a never-block fallback | Zandeline already has a Yoco POS + API key; the amount is computed server-side and pre-filled |
| 5 | **Availability (v1)** | **Zandeline eyeballs it at confirm** | She's already the human gate; drops the Google-Calendar integration (and its Workspace-admin setup) out of v1 — `party_size` is captured so the auto-check is a clean fast-follow |
| 6 | **Data layer = the source code seam** | The booking data-access reads connection + keys **by secret name**; the schema assumes nothing about *whose* org hosts it | Makes ownership a **deploy-time** choice per client, not an architecture fork — Lustique = client-owned, a future client could be LZ-hosted with zero code change |

---

## 3. Scope

**In (v1):** request-to-book; server-authoritative pricing recompute; persistence; signed email confirm gate; Yoco deposit + balance via API; webhook settlement; the 5 transactional emails; daily balance-reminder + token-expiry cron; R2 audit trail; deny-all RLS.

**Out (deferred, named so scope can't creep):**
- **Auto availability** across the 9 artists' Google Calendars (fast-follow — Pass 3.5).
- **Admin dashboard**, **bride portal**, **artist dashboards + per-booking artist financials** → **Pass 4** (own spec; adds Supabase Auth + RLS policies).
- **Structured artist allocation** (which artists on which booking) — v1 captures `party_size` only; Zandeline allocates off-system.
- Newsletter, travel-geocode proxy, Sanity-rebuild webhook (other Pass-3 endpoints from the v2 doc; not part of the booking loop).

---

## 4. End-to-end flow

```
Bride (site)                Worker (API boundary)            Zandeline        Yoco           Brides's inbox
─────────────────────────────────────────────────────────────────────────────────────────────────────────
estimator → "Request to book"
  + date + depositPct ─────► POST /api/booking/request
                              • honeypot + validate
                              • RECOMPUTE computeEstimate(input)  ← authoritative price
                              • insert bookings(status=requested)
                              • sign confirm token, store hash
                              • email request + confirm link ───► (inbox)
                              • email "received" ───────────────────────────────────────────► received ✓
                                                                  reads, checks
                                                                  availability,
                                                                  clicks link
                              GET /api/booking/confirm?token  ◄── (render-only page; prefetch-safe)
                              POST /api/booking/confirm ◄──────── "Confirm & send deposit"
                              • verify token (single-use, TTL)
                              • status=confirmed
                              • create Yoco checkout(deposit) ──────────────► {id, redirectUrl}
                              • insert payments(kind=deposit,pending)
                              • email deposit pay-link ──────────────────────────────────────► pay link ✓
bride pays on Yoco ───────────────────────────────────────────────────────► hosted page
                              POST /api/yoco/webhook ◄──────────────────────── payment.succeeded
                              • verify signature; idempotent
                              • payments.paid; booking.deposit_paid
                              • email "date secured + balance due" ──────────────────────────► secured ✓
                              • email Zandeline "booking secured" ─────────► (inbox)
... 14 working days before wedding_date ...
                              scheduled() daily cron
                              • keep-warm SELECT
                              • find deposit_paid due soon
                              • create Yoco checkout(balance)
                              • email balance pay-link ──────────────────────────────────────► balance ✓
balance paid ─────────────────► webhook → booking.settled ✓
```

---

## 5. State machine

`booking.status` enum and the **only** legal transitions (each transition writes an `audit_log` row → R2):

| From | → To | Trigger | Side-effects |
|---|---|---|---|
| — | `requested` | `POST /api/booking/request` | recompute price; persist; email Zandeline + bride |
| `requested` | `confirmed` | `POST /api/booking/confirm` (valid token) | create Yoco deposit checkout; email bride pay-link; mark token used |
| `requested` | `declined` | `POST /api/booking/confirm` with `action=decline` | email bride a gentle decline |
| `requested` | `expired` | cron, token past TTL | none (silent) |
| `confirmed` | `deposit_paid` | Yoco webhook (deposit), **balance > 0** | secure date; email bride (balance + due date) + Zandeline |
| `confirmed` | `settled` | Yoco webhook (deposit), **100% deposit → balance = 0** | secure date; email both "fully paid" — **no balance step** |
| `confirmed` | `expired` | cron, deposit unpaid past TTL | optional nudge, then expire |
| `deposit_paid` | `settled` | Yoco webhook (balance) | email both "fully paid" |
| `deposit_paid` | `cancelled` | manual (Zandeline, out-of-band v1) | none automated |

**Note:** there is no separate `balance_due` *state* — it's a *query* over `deposit_paid` bookings (`wedding_date − 14 working days ≤ today AND balance_reminder_sent_at IS NULL AND balance_net_cents > 0`). The cron acts on that set. The `balance_net_cents > 0` filter is what stops a **100%-paid booking** (which settled on its deposit webhook) from ever being sent a R0 balance link.

---

## 6. Data model (Supabase / Postgres)

Three tables. **Money is stored in integer cents** (ZAR) to avoid float drift; `shared/pricing` returns whole Rand, so `cents = rand × 100` is exact. RLS is **enabled and deny-all** in v1 (no end-user logins yet); the Worker uses the **service-role key** (bypasses RLS). Pass 4 adds policies.

### `bookings`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | `gen_random_uuid()` — internal key |
| `reference` | text unique | human-readable (`LUS-2026-0042`) — what emails + the Yoco reference quote; uuid stays internal |
| `idempotency_key` | text unique | client-minted per submission; dedupes the enquiry-style auto-retry so a timeout-then-success can't double-book |
| `created_at` / `updated_at` | timestamptz | |
| `status` | `booking_status` enum | §5 |
| `occasion` | text | from `EstimateInput.occasion` |
| `wedding_date` | date | the date being held |
| `bride_name` / `bride_email` / `bride_phone` | text | PII |
| `town` / `province` / `venue` | text | nullable |
| `party_size` | int | `EstimateResult.heads` — drives the manual staffing call (§11) |
| `estimate_input` | jsonb | the full `EstimateInput` — enables authoritative re-compute + audit |
| `total_cents` | int | **server recompute** `computeEstimate(input).total × 100` |
| `quote_lines` | jsonb | `EstimateResult.lines` snapshot (itemised, what she saw) |
| `deposit_pct` | int | 25 \| 50 \| 100 |
| `deposit_net_cents` | int | `round(total_cents × pct/100)` — what Lustique nets |
| `balance_net_cents` | int | `total_cents − deposit_net_cents` |
| `confirm_token_hash` | text | `sha256(token)` — never store the raw token |
| `confirm_token_expires_at` | timestamptz | TTL (default 14 days) |
| `confirm_token_used_at` | timestamptz | single-use guard |
| `confirmed_at` / `declined_at` / `deposit_paid_at` / `settled_at` | timestamptz | nullable lifecycle stamps |
| `balance_reminder_sent_at` | timestamptz | cron idempotency |
| `notes` | text | free |

*Pass-4 forward-compat (do not build in v1):* artist allocation lives in a future `booking_artists` join (`booking_id`, `artist_id`, `pay_cents`) — that's where **artist financials** attach. Mentioned so v1 doesn't paint it out; no column needed now.

### `payments`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `booking_id` | uuid fk → bookings | |
| `kind` | text | `'deposit'` \| `'balance'` |
| `net_cents` | int | what Lustique nets |
| `payable_cents` | int | grossed-up — what the bride pays (§8) |
| `yoco_checkout_id` | text | from checkout creation |
| `yoco_payment_id` | text | from the webhook |
| `status` | text | `'pending'` \| `'paid'` \| `'failed'` \| `'expired'` |
| `pay_url` | text | the Yoco redirect/link |
| `created_at` / `paid_at` | timestamptz | |
| `raw` | jsonb | webhook payload for reconciliation |

### `audit_log`  (append-only; mirrored to R2)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | |
| `booking_id` | uuid | nullable |
| `event_type` | text | e.g. `request.created`, `booking.confirmed`, `payment.deposit.paid` |
| `payload` | jsonb | the diff/context |
| `created_at` | timestamptz | |

Every state change writes here **and** puts one immutable object to R2 (`audit/{booking_id}/{ts}-{event}.json`) — the durability net that makes free-tier (no PITR) safe for money + PII, and the POPIA processing record.

---

## 7. Worker surface

All new routes extend the existing single-`fetch` router in [`worker/src/index.ts`](../../../worker/src/index.ts), reusing its `corsHeaders`/`json`/honeypot/`brevoEmail` helpers. The Worker gains a dependency on the **`shared/pricing`** workspace package (same import the site estimator uses) for the authoritative recompute.

| Method · Path | Job | Gate |
|---|---|---|
| `POST /api/booking/request` | **Turnstile + per-IP rate-limit** → honeypot+validate (incl. future `wedding_date` + phone + **consent**) → **dedupe on `idempotency_key`** → **`computeEstimate(input)` server-side** → insert `bookings(requested)` → sign confirm token, store hash → email Zandeline (details + confirm link) + bride (received) | S1 live |
| `GET /api/booking/confirm?token=` | **render-only** hosted page showing the booking + a "Confirm & send deposit" button (and a "Decline" link). *No mutation* — see §12 prefetch note | S1 |
| `POST /api/booking/confirm` | verify token (HMAC, not expired, not used, still `requested`) → `confirmed` → create Yoco deposit checkout → insert `payments(deposit,pending)` → email bride pay-link → mark token used | S1+S4 |
| `POST /api/yoco/webhook` | **verify Yoco signature** → match `payments` by metadata → `paid`; advance booking (`deposit_paid` or `settled`) → emails → audit. **Idempotent** (dedupe on `yoco_payment_id`) | S4 |
| `scheduled()` (Cron) | daily: keep-warm `select 1` → balance-reminder sweep (only `balance_net_cents > 0`: create balance checkout + email link + stamp) → expire stale tokens → **purge PII of long-expired bookings** (retention) | S1+S4 |

**`Env` grows** (all secrets, set via `wrangler secret put`, never in repo/chat — SECURITY.md):
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `YOCO_SECRET_KEY`, `YOCO_WEBHOOK_SECRET`, `SIGNING_SECRET` (HMAC for links), `TURNSTILE_SECRET` (bot check), plus existing `BREVO_API_KEY`, `NOTIFY_EMAIL`, `ALLOWED_ORIGIN`. **`wrangler.toml`** gains an `[[r2_buckets]]` binding and `[triggers] crons = ["0 6 * * *"]` (06:00 UTC ≈ 08:00 SAST).

**DB access:** call Supabase **PostgREST over `fetch`** with the service key (keeps the Worker dependency-free, matching its current fetch-only style) — `@supabase/supabase-js` is an option but not needed. Decide in the S1 plan.

---

## 8. Authoritative pricing & money math

**Never trust a client-sent price.** The request carries the `EstimateInput` (the *inputs*), not the total; the Worker recomputes with the same `computeEstimate` the browser used, so the persisted `total_cents` is authoritative and tamper-proof. (The estimator stays for instant UX; the Worker is the source of truth.)

**Deposit %** is chosen at the **request** step (so the Yoco amount is known at confirm). Locked: `25 | 50 | 100`. *(A pay-time deposit-chooser page is a v1.1 option — see §15.)*

**Validation & guards** (the request endpoint, before any insert): `wedding_date` must parse and be **in the future**; a valid phone is required; the **consent** box must be ticked (POPIA, §12); the recomputed `total_cents` is **sanity-capped** (> R200,000 → accept but flag `notes` for manual review, never auto-reject a real big wedding). **100% deposit** means `balance_net_cents = 0` → the deposit webhook settles the booking outright; no balance link is ever created (§5).

**Fee gross-up** (PRICING-style transparency — Lustique nets the full intended amount; the bride covers Yoco's fee, shown openly):

```
net_cents      = round(total_cents × pct / 100)              // deposit; balance = total − deposit
payable_cents  = ceil( net_cents / (1 − YOCO_FEE_RATE) )     // ceil ⇒ never under-net by a cent
```

`YOCO_FEE_RATE` is a **config constant** (like `ACTIVE_PROMO`), set to Zandeline's real online rate — *not* hardcoded inline.

**Worked example** — R10,000 booking, 50% deposit, fee 2.9% (`YOCO_FEE_RATE = 0.029`):

| | cents | Rand |
|---|---|---|
| `total_cents` | 1,000,000 | R10,000.00 |
| `deposit_net_cents` (50%) | 500,000 | R5,000.00 (Lustique nets) |
| `payable_cents` = ⌈500000 / 0.971⌉ | 514,934 | **R5,149.34** (bride pays) |
| Yoco fee absorbed | 14,934 | ~R149.34 |
| balance later (same maths) | 500,000 → 514,934 | R5,149.34 |

Bride sees: *"Deposit R5,149.34 (includes card processing). Secures your date; balance R5,149.34 due 14 working days before."*

---

## 9. Yoco integration

**Create (deposit & balance, same path):** `POST https://payments.yoco.com/api/checkouts` with `Authorization: Bearer <YOCO_SECRET_KEY>`, body `{ amount: payable_cents, currency: "ZAR", successUrl, cancelUrl, metadata: { booking_id, payment_id, kind } }` → returns `{ id, redirectUrl }`. Store `id` + `redirectUrl` (`pay_url`). **`successUrl` → `/booking-confirmed?ref=…`** (a render-only thank-you that reads booking status — the **webhook**, not this redirect, is the source of truth, since a bride can close the tab before it fires); **`cancelUrl` → `/booking-payment-cancelled?ref=…`** (re-offers the same pay link). *(Exact endpoint/field names + the live vs test key split: **verify at developer.yoco.com with the real key** — flagged in §15. This is the spec-level contract; the S4 plan nails the wire format.)*

**Webhook:** Yoco POSTs payment events to `/api/yoco/webhook`. **Verify the signature** with `YOCO_WEBHOOK_SECRET` (reject unsigned/invalid). Match `metadata.payment_id` → set `payments.paid` + advance the booking. **Idempotent**: webhooks retry, so dedupe on `yoco_payment_id` and treat a re-delivery of an already-`paid` payment as a no-op 200.

**No card data ever touches us** — payment happens on Yoco's hosted page; we store only ids + amounts + status.

**Fallback (never-block):** if checkout creation fails or her plan can't create links via API, the confirm flow instead emails Zandeline *"create a Yoco link for R X.XX and send it"* and records a `pending` manual payment, which she marks paid out-of-band. Pieter has confirmed the API key exists, so the API path is primary; this only guarantees the loop never hard-stops.

---

## 10. Notifications (Brevo)

Five transactional emails, all through the existing `brevoEmail` helper (extend, don't replace):

1. **Request → Zandeline:** booking details + party + `total` + the **confirm link**. **Includes a same-date warning** — "⚠️ N other booking(s) already hold {date}" (a cheap query on `wedding_date`) so she never double-confirms a date while auto-availability is still a fast-follow.
2. **Request → bride:** "received, awaiting confirmation" (mirrors the enquiry confirmation tone).
3. **Confirmed → bride:** the **Yoco deposit pay-link** + what the deposit secures.
4. **Deposit paid → bride** (date secured, balance + due date) **and → Zandeline** (booking secured).
5. **Balance reminder → bride:** the **Yoco balance pay-link**, sent by the cron 14 working days out.

---

## 11. Availability & staffing (v1 = manual; rule captured)

The staffing rule (from ACTIVATION / PRICING) — **the old assistant *fee* tiers repurposed into an *allocation* rule**:

| Party size (people) | Artists needed |
|---|---|
| ≤ 4 | 1 |
| 5–8 | 2 |
| 9–12 | 3 |
| 13+ | 4 |

In v1 Zandeline applies this **herself** when she gets the confirm email (she knows her team's diary). `party_size` is persisted so the **fast-follow** can automate it: Google Calendar free/busy across the 9 (Workspace **domain-wide delegation** via a service account) → only offer dates with enough free artists. Out of v1 scope; no calendar code now.

---

## 12. Security & POPIA

- **Signed links.** `token = base64url( booking_id | exp | HMAC-SHA256(booking_id|exp, SIGNING_SECRET) )`. Store **`sha256(token)`** as `confirm_token_hash`; enforce **expiry** (`confirm_token_expires_at`) and **single-use** (`confirm_token_used_at`). Raw token only ever lives in the emailed URL.
- **Prefetch-safe confirm.** Mail clients/scanners pre-fetch links with **GET** — so `GET /api/booking/confirm` is **render-only** (shows the booking + a button); the state change is a **POST**. A scanner can never silently confirm a booking.
- **Deny-all RLS now.** All three tables: RLS enabled, no anon/auth policies in v1. Only the Worker's **service-role key** reads/writes; that key is a vaulted secret-by-name, never in repo/chat. Pass 4 adds per-role policies (bride sees her booking; artist sees only her allocations — `using (artist_id = auth.uid())`).
- **Data residency.** Provision the Supabase project in **`af-south-1`** (South Africa) if offered; else EU-West with a documented POPIA **§72** cross-border basis. Decide in the S1 plan once the region list is checked.
- **Durability net.** Free tier has no PITR → the **R2 append-only audit log** (§6) is the reconstruct-from path for payment + booking state, and doubles as the POPIA record of processing.
- **Yoco webhook** signature verified; **no card data** stored (Yoco-hosted).
- **PII minimisation:** persist only what the booking needs; `estimate_input` carries no extra PII beyond party composition.
- **Abuse control.** `/api/booking/request` is gated by **Cloudflare Turnstile** (`TURNSTILE_SECRET`, server-verified) + a **per-IP rate limit** — the honeypot alone is too weak for an endpoint that writes rows and triggers email/Yoco.
- **POPIA consent at collection.** The request form carries a required **consent checkbox** linking the privacy page; the timestamp/version of consent is recorded with the booking. (Pairs with the named operators + retention already in `privacy.astro`.)
- **Retention.** Booking PII is purged by the cron once a booking is long-`expired`/`declined`, and after a defined period post-`settled` (exact periods await Zandeline — already a pending privacy item). The R2 audit trail keeps a minimal, immutable financial record separate from live PII.
- **Carryover (do this when touching secrets):** 🔐 **rotate the exposed Sanity Viewer token** (flagged since the last session).

---

## 13. Subsystem breakdown → implementation plans

Each becomes its **own `writing-plans` artifact** (bite-sized TDD), built in order. **S1 is the foundation; everything waits on the client-owned Supabase project existing.** SQL/schema and pure functions are *plannable and testable now*; only *applying* + the live integrations are account-gated.

| # | Subsystem | Deliverable | Build gate |
|---|---|---|---|
| **S1** | **Data layer** | `bookings`/`payments`/`audit_log` schema + migrations; Worker PostgREST data-access (by-secret-name); R2 audit writer | **Supabase project created (client-owned) + LZ invited** |
| **S2** | **Request-to-book** | site form extension (date + depositPct on the estimator/quote) + `POST /api/booking/request` with **server recompute** | none to build; persists once S1 live |
| **S3** | **Confirm gate** | HMAC sign/verify; Zandeline email; **render-only** GET page; `POST /api/booking/confirm` | Brevo (exists) + S1 |
| **S4** | **Payments** | Yoco checkout creation + `/api/yoco/webhook` (verify + idempotent) + records | Yoco key (exists) + **verify Yoco API** + S1 |
| **S5** | **Balance automation** | `scheduled()` cron: keep-warm + balance sweep + token expiry | S1 + S4 |
| **S6** | **Notifications** | the 5 Brevo templates, woven through S2–S5 | Brevo |

**Critical-path account actions for Pieter (unblock the build):**
1. Create the **client-owned Lustique Supabase** org/project, invite `hello@layerzerostudios.com` as **Administrator**, note the region.
2. **Verify the Yoco API** (endpoints + webhook signature) with her key, and get her **real online fee rate** for `YOCO_FEE_RATE`.

Until #1, S1 can't be applied (so nothing downstream runs live) — but its SQL + the pure logic (gross-up, token, working-day calc, webhook idempotency) are written and unit-tested first.

---

## 14. Definition of Done — v1

1. Bride: estimator → "Request to book" (+ date + deposit %) → a `bookings(requested)` row with a **server-recomputed** `total_cents` (client price is never trusted).
2. Zandeline gets the request email and **confirms via the prefetch-safe signed link** (single-use, expiring).
3. Bride receives a **Yoco link for the grossed-up deposit**, pays, the **webhook secures the date**, and both parties get confirmations.
4. The **daily cron** issues the **balance** link 14 working days out and emails it; paying it **settles** the booking.
5. All money flows through `computeEstimate` recompute + the `YOCO_FEE_RATE` gross-up; all PII sits behind **deny-all RLS**; every state change is **audited to R2**.
6. `shared/pricing` tests stay green; new logic is unit-tested: request validation (future date, consent, dedupe), gross-up maths, token sign/verify (incl. expiry + reuse), webhook idempotency, the working-day calculation.
7. A **100% deposit** settles the booking on its single payment — no R0 balance link is ever created; a **duplicate/retried** request returns the same booking, never a second.
8. **Consent** is captured at request; `/api/booking/request` rejects bots (Turnstile) and is rate-limited; the bride lands on a real **return page** after paying or cancelling.

---

## 15. Open items / verify-at-build

1. **Yoco wire format** — exact checkout endpoint, field names, live/test keys, and webhook signature scheme (developer.yoco.com, with the real key). Contract in §9 is the design; S4 confirms the bytes.
2. **`YOCO_FEE_RATE`** — Zandeline's real online rate (config value).
3. **"14 working days"** — define working day = **Mon–Fri**; SA public-holiday handling deferred (v1 = weekdays only; add a holiday list later). Confirm the count is *before* the wedding and the reminder lead-time suits her.
4. **Supabase region** — confirm `af-south-1` availability; else EU + §72 note.
5. **DB access lib** — PostgREST-over-`fetch` (lean, recommended) vs `@supabase/supabase-js`.
6. **Deposit-% UX** — chosen at *request* (locked) vs a *pay-time* chooser page (v1.1).
7. **Sanity-cap threshold** — confirm R200,000 is the right "flag for manual review" line for Lustique's real bookings.
8. **Test doubles** — S4/S5 unit tests need a **mock Yoco** (checkout + signed webhook) and a **test Supabase** (local container or a throwaway free project); pick the approach in the S4 plan.

---

## 16. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Client tampers with the price | Worker **recomputes** via `shared/pricing`; client total is display-only |
| Free-tier DB pauses → booking API fails | The **daily cron is the keep-warm heartbeat**; upgrade to Pro when volume/PITR justify |
| Lost DB with no PITR (free tier) | **R2 append-only audit log** reconstructs booking + payment state |
| Email scanner prefetch auto-confirms | Confirm GET is **render-only**; mutation is POST (§12) |
| Webhook double-delivery double-advances a booking | **Idempotent** on `yoco_payment_id`; re-delivery = no-op 200 |
| Yoco API can't create links on her plan | **Manual-link fallback** keeps the loop unblocked (§9) |
| Cross-client PII bleed | Client-owned, isolated project (Option A); deny-all RLS; service key vaulted |
| Secret exposure | Secrets-by-name in Worker vault; never repo/chat; rotate the Sanity token |

---

## 17. Next step

On approval → **`writing-plans`** for **S1 (data layer)** first (schema + migrations + data-access + R2 audit — its SQL and pure logic are account-free to write and test now), then S2–S6 in order. Building goes live as the two account actions in §13 clear. Per the device standard: **Opus writes these plans; Sonnet builds them.**
