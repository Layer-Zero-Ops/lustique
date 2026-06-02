# Lustique Co. — System Architecture (Standalone site + AXIS-ready)

**Status:** Plan v1 — 2026-06-01
**Principle (locked by Pieter):** the website is **fully standalone**. AXIS is an **add-on** that enhances automation — never a dependency. If AXIS isn't there, the site still books weddings via the manual/automated-lite engine.

---

## 1. The two engines

```
                 ┌─────────────────────────── THE WEBSITE (always) ───────────────────────────┐
  Bride ──▶ Astro site (Cloudflare Pages) ──▶ Cloudflare Worker (the API boundary) ──▶ data + comms
                 └──────────────────────────────────────────────────────────────────────────────┘
                                                   │
                        ┌──────────────────────────┴───────────────────────────┐
                        ▼                                                        ▼
              v1 ENGINE (manual-lite, no AXIS)                      v2 ENGINE (AXIS add-on)
              • Worker writes to Google Sheets CRM                  • AXIS reads the same data + event stream
              • Brevo sends confirmations + nurture                 • AXIS orchestrates: qualify → quote →
              • Zandeline approves quotes / sends invoices            invoice → schedule → allocate → follow-up
              • Google Calendar checked manually                    • AXIS becomes the "autonomous COO"
```

**The key design move:** the Worker exposes a small, stable **API + event boundary** (`/api/enquiry`, `/api/quote`, `/api/booking`, webhook events). v1 wires those to Google + Brevo directly. v2 lets **AXIS subscribe to the same events and take over orchestration** — no site rewrite, just a smarter brain behind the same doors.

---

## 2. The quote → invoice pipeline (the conversion core)

The funnel has two tiers, exactly as Pieter described:

**Tier 1 — the curious:** use the **estimator** (instant, no commitment, no data needed). Already built.

**Tier 2 — the serious:** **Request a Quote** → details captured → **auto-generated quote** → bride **Approves/Rejects** → on approve → **invoice generated + sent**.

### Pipeline states (the lead's lifecycle)

```
ENQUIRY ─▶ QUOTE_DRAFTED ─▶ QUOTE_SENT ─▶ (Approve) ─▶ ACCEPTED ─▶ INVOICED ─▶ DEPOSIT_PAID ─▶ BOOKED ─▶ COMPLETED
                                       └─ (Reject) ─▶ DECLINED / re-quote
```

### How each step works (v1 → v2)

| Step | v1 (no AXIS) | v2 (AXIS) |
|---|---|---|
| **Enquiry captured** | Worker validates + writes row to Sheets CRM (status ENQUIRY); Brevo confirmation email; notify Zandeline | same intake; AXIS scores/qualifies the lead, flags priority |
| **Quote drafted** | Worker auto-computes the quote from the form data + `PRICING.md` rules (same logic as the estimator, server-side) → a quote record + a shareable quote page | AXIS drafts + applies promos, upsells, seasonal rules, and reviews edge cases |
| **Quote sent** | Brevo emails a link to a **hosted quote page** (itemised: each person, hair length, travel, promo) with **Approve / Reject** buttons | AXIS personalises timing + follow-up cadence |
| **Approve / Reject** | Buttons hit `/api/quote/respond` → Worker updates status; on reject, optional reason + re-quote | AXIS handles negotiation, re-quotes, objection follow-ups |
| **Invoice** | On approve, Worker generates a branded **invoice** (PDF via a template) → emails it (Gmail API) + logs to Drive + Sheets | AXIS issues invoice, schedules the deposit reminder, reconciles payment |
| **Booking** | On deposit proof, Zandeline confirms; Calendar event created | AXIS auto-confirms, creates the Calendar event, allocates artists, triggers the booked-bride flow |

### Data model (Sheets CRM today → a real DB later)
`Lead { id, status, bride, contact, weddingDate, venue{name, town, lat, lng}, party{bride_len, bridesmaids{mk,hr}, mothers{mk,hr}, flowergirls{mk,hr,age}, guests{mk,hr}, party_len}, travel{km, cost}, estimate, quote{lines[], total, sentAt, respondedAt, decision}, invoice{number, total, issuedAt, paidAt}, artistsAllocated[], source, notes }`

The **quote page + Approve/Reject + invoice** are buildable as static/Worker pages now (mockup-ready); the *generation + sending* needs the Phase-1 accounts.

---

## 3. Google Workspace integration map

Lustique runs on Google, so the system connects to Google products via a **service account** (server-to-server) + OAuth where a user context is needed. Each Google product has a clear job:

| Google product | Role in the system |
|---|---|
| **Gmail API** (`info@lustiqueco.co.za`) | Send quotes, invoices, confirmations, nurture from the real brand inbox; replies land in the normal inbox |
| **Google Calendar API** | The booking + availability layer — see §4. Wedding/trial events; free/busy across the 9 artists |
| **Google Sheets API** | The v1 CRM (Leads, Bookings, Artists, Analytics tabs) — Zandeline already lives here |
| **Google Drive API** | Store generated quotes + invoices + signed agreements + (optionally) portfolio originals; per-wedding folders |
| **Google Contacts (People) API** | Sync booked brides + vendors into Workspace contacts |
| **Google Forms** | Retired — the on-site quote form replaces it (kept only if Zandeline wants a backup) |
| **Google Workspace auth (OAuth)** | Team sign-in to any internal dashboard; least-privilege scopes |

**Connection method:** a Google Cloud project + **service account** (JSON key in Cloudflare Worker secrets / vault — never in the repo). Scopes limited to exactly what's used. This is the "allow for connection to/from Google products" layer Pieter asked for — built once, used by both v1 and AXIS.

---

## 4. Calendar sync — visibility into all 9 artists' availability

Pieter's idea: **sync everyone's Google Calendar to see availability.** Strong move — it prevents double-booking and powers smart allocation. Design:

**Setup (per artist, one-time):**
- Each artist shares her Google Calendar (free/busy is enough — no event details needed) with the Lustique service account, **or** the team uses a shared "Lustique Bookings" calendar.
- Privacy-respecting: we only read **free/busy**, not what they're doing.

**What it powers:**
1. **Availability check at enquiry** — when a bride picks a date, the system queries free/busy across the 9 → "X artists available on 14 Nov 2026." If zero are free, flag before quoting.
2. **Smart allocation** — assign the right number of artists for the party size (the assistant tiers) from those actually free that day.
3. **No double-booking** — a date already committed shows as busy.
4. **Booking writes back** — a confirmed wedding creates a Calendar event on the allocated artists' calendars (with the time schedule).

**v1:** a simple free/busy read + a Sheets "availability" view Zandeline checks. **v2 (AXIS):** AXIS does this automatically at quote time, allocates, and books the calendar — the "autonomous COO" scheduling function.

**Tech:** Google Calendar API `freebusy.query` across the 9 calendar IDs. Needs the Workspace + service-account setup (Phase 1).

---

## 5. AXIS integration — how it plugs in

AXIS becomes the **orchestration brain** behind the stable Worker API. It does not replace the site; it subscribes to its events and acts.

**What AXIS takes over (when added):**
- Lead **qualification + scoring** (which enquiries are serious).
- **Auto-quoting** with judgment (promos, upsells, seasonal pricing, edge cases).
- **Invoicing + deposit chasing + reconciliation.**
- **Calendar allocation + booking** across the 9 artists.
- **Nurture orchestration** (smarter than fixed Brevo flows).
- **Post-wedding review requests + anniversary re-engagement.**
- A **COO dashboard** for Zandeline (pipeline, capacity, revenue).

**The boundary (so it stays an add-on):**
- The Worker emits events (`enquiry.created`, `quote.accepted`, `deposit.paid`, …) to a queue/webhook.
- v1 handlers do the simple thing. When AXIS is connected, **AXIS handlers run instead** (feature-flagged). Turning AXIS off reverts to v1 — the site never breaks.
- Shared data store (Sheets → later a real DB AXIS can read/write).

**Strategic value:** Lustique becomes a **live, revenue-generating AXIS case study** — a real SMB running its operations on the flagship product. First customer + proof point + dogfooding, all at once. Keep it loosely coupled so Lustique's launch never waits on AXIS's roadmap (per the AXIS-first sequencing rule — Lustique is a proving ground, not a distraction).

---

## 6. Build order (unchanged by all this)

1. **Phase 1 setup** (accounts) — Cloudflare, Google Workspace + Cloud project/service account, Brevo, GA4. *(SETUP.md)*
2. **Port prototype → Astro + Sanity.**
3. **Wire v1 engine:** Worker `/api/enquiry` → Sheets + Brevo + Gmail; quote page + Approve/Reject; invoice generation; Calendar free/busy.
4. **Harden** (SECURITY.md).
5. **Launch.**
6. **Add AXIS** as the v2 engine when ready — no rewrite.

> The site is being built **AXIS-ready from day one**: stable API boundary, event emission, shared data, feature-flagged handlers. That's the whole point of doing the architecture now.

---

## 7. Embedded agents (content automation) — and how they relate to AXIS

**No conflict with AXIS.** Think of it as two layers: **AXIS = the operations brain** (leads, quotes, invoices, scheduling, allocation); **content agents = focused skills** that can run standalone *and* be orchestrated by AXIS later. Adding agents now does not block or clash with inserting AXIS — they compose.

**The blog-draft agent (Zandeline's request):**
```
Scheduled trigger (e.g. weekly)
   → Agent researches topics (SEO gaps, seasonal, venue/area themes, common bride questions)
   → Drafts a post in the Lustique brand voice (BRAND.md) + SEO structure
   → Writes it to Sanity as STATUS: DRAFT  (never published)
   → Zandeline gets a notification → reviews/edits in the Studio
   → SHE approves → it publishes → sitemap + internal links update
```
- **Hard rule: human-in-the-loop.** The agent never publishes; Zandeline approves every post (and anything public-facing). Same gate for any future agent touching money or messaging.
- **Implementation:** a small scheduled job (Cloudflare Cron / Worker) calling an LLM with the brand guidelines + SEO context, using the Sanity write API to create drafts. Scoped credentials; every action logged.
- **Later:** AXIS can coordinate this agent alongside its ops agents (e.g., "publish a venue spotlight when we book a new venue"), but it remains optional.

**Other candidate agents (future, all approval-gated):** a review-request agent (asks past brides, routes replies to the testimonials), a social-repurposing agent (turns a blog post into IG/FB/TikTok captions for approval), an enquiry-triage assistant (drafts a personalised first reply for Zandeline to send).

## 8. External app integration layer

Zandeline uses other business apps. The platform is built to absorb them via the **Worker API boundary + a thin adapter layer**, so each integration is isolated and swappable.

- **Confirmed core:** Google Workspace (Gmail, Calendar, Drive, Sheets, Contacts), Brevo, WhatsApp (click-to-chat now; WhatsApp Business API later).
- **⚠️ Needed from Pieter/Zandeline:** a list of the *other* apps she relies on (e.g. accounting/invoicing, scheduling/booking, social schedulers, POS/payments, contracts/e-sign, lead sources). Each gets an adapter on the same boundary.
- **Principle:** integrations are adapters behind one stable internal API — add or replace an app without touching the site, and AXIS reads the same boundary.

## 9. Inbound + outbound marketing engine

The platform must both **pull traffic in** and **reach out + convert**. The stack supports both:

**Inbound (earned/organic — pull):**
- SEO foundation (structured data, sitemap, fast static pages) ✅
- The **Journal** (agent-assisted posts) + lead-magnet **guides** (email capture)
- Local SEO (Google Business Profile, venue/area landing content, Afrikaans capture)
- Backlinks (photographer partners, directories, the Wedding Guide feature)
- Topic clusters + internal linking

**Outbound (owned/paid — reach + nurture):**
- **Brevo** nurture flows (lead / booked / past-bride-anniversary) — where most tail conversions live
- Newsletter (consented) feeding the list from guides + footer signup
- Social cadence (IG/FB/TikTok) with shareable OG cards; social-repurposing agent
- WhatsApp follow-ups; optional retargeting pixels (behind consent)

**The loop:** inbound captures the email/enquiry → outbound nurtures to booking → post-wedding review request feeds social proof + SEO → which improves inbound. AXIS (later) closes this loop automatically. Targets + the full checklist live in **STANDARDS.md** (§7–§10).
