# Lustique Co. — Production Build Design (Astro + Sanity + Worker + Portal)

**Status:** Design v2 — awaiting Pieter's review
*(v2 folds in the front/back-end critique, the premium-elevation pass, and the bride/admin/artist portal.)*
**Last updated:** 2026-06-02
**Owner:** Pieter (decisions) · Zandeline (brand/content sign-off) · Claude (build)
**Source-of-truth docs:** [`PLAN.md`](../../../PLAN.md) · [`BRAND.md`](../../../BRAND.md) · [`PRICING.md`](../../../PRICING.md) · [`CONTENT.md`](../../../CONTENT.md) · [`ARCHITECTURE.md`](../../../ARCHITECTURE.md) · [`STANDARDS.md`](../../../STANDARDS.md) · [`SECURITY.md`](../../../SECURITY.md)
Where any business rule here disagrees with PRICING.md/BRAND.md, those docs win.

---

## 1. Goal & shape

Turn the complete, on-brand `prototype/` (23 pages) into the production codebase, elevate it to a **"R100k+" feel** for both visitors and admin, then add a logged-in **portal** — all **without losing or redesigning what's done.**

The discipline throughout is **golden master**: reproduce the prototype faithfully *first*, elevate deliberately *second*, so every visible change is intentional and reviewable — never an accident of the port.

| Pass | Delivers | Needs accounts? |
|---|---|---|
| **1 — Astro parity port** | `site/` renders all 23 pages pixel-identical to the prototype; estimator working; pricing in a shared module. Runs locally, builds static. | **No** |
| **1.5 — Premium elevation** | palette recalibration (hybrid), gradients→tone-blocks, real responsive images + blur-up, the BRAND.md §6B motion system, hero re-art-direction, concierge multi-step form | **No** (full image pipeline lands in Pass 2) |
| **2 — Sanity CMS** | `studio/` + schemas; site reads content; Zandeline self-edits; image CDN powers the blur-up | Free Sanity signup (done) |
| **3 — Worker backend** | one Worker: enquiry→DB→email, quote/approve/invoice, travel proxy, newsletter, spam, rebuild webhook | Cloudflare, Google, Brevo (deferred) |
| **4 — The Lustique Portal** | auth + dedicated Supabase + RLS; bride, admin (Zandeline), and artist dashboards | Dedicated Lustique Supabase (+ Pass-3 accounts) |

This spec **details Pass 1**, **defines Pass 1.5's scope**, and **sketches 2–4**. Pass 1.5 and Pass 4 each get their own implementation plan; **Pass 4 is a distinct subsystem** (auth ≠ a marketing site) and gets its own spec before any code.

---

## 2. Principles

1. **Golden master.** Port exactly, *then* elevate. Never mix a port-fix with a design change in the same diff.
2. **Subtract, don't add.** Restraint reads expensive (BRAND.md §6A/§10). Most of the elevation *removes* (gradients, extra tones, the floating hero badge) and *deepens* what remains (photography, type, motion).
3. **One source of truth for money.** Pricing lives in one module that both the browser estimator and the Worker import.
4. **Standalone first.** The site books weddings without AXIS; the portal runs on its own stack; AXIS later orchestrates (ARCHITECTURE.md §5).
5. **Least privilege.** Secrets never enter repo or chat; RLS isolates each artist's data at the database.
6. **Account-free as long as possible.** Build locally first.

---

## 3. Repo & project structure

A lightweight **npm workspace** (built into npm 11.6.2 — no new tooling) so the shared pricing module is importable across projects.

```
Lustique/
├── prototype/              ← UNTOUCHED. Golden master + reference to diff against.
├── site/                   ← NEW. Astro production app (Pass 1 + 1.5).
│   ├── src/{pages,layouts,components,data,content,scripts,styles}/
│   ├── public/assets/
│   └── astro.config.mjs
├── shared/pricing/         ← pricing.ts — SINGLE source of truth (PRICING.md). site now; Worker later.
├── studio/                 ← (Pass 2) Sanity Studio
├── worker/                 ← (Pass 3) Cloudflare Worker — the API boundary
├── portal/                 ← (Pass 4) authenticated dashboards on the dedicated Supabase
├── docs/superpowers/specs/ ← this spec
└── package.json            ← workspace root
```

The prototype stays the untouched golden master. `studio/`, `worker/`, and `portal/` are created in their passes; the site is built **portal-ready** from the start (the Worker boundary already is).

---

## 4. Component & data mapping (Pass 1)

The prototype is componentised in spirit, so this is translation, not redesign:

| Prototype (`build.mjs`) | → Astro |
|---|---|
| `shell()` | `layouts/BaseLayout.astro` |
| `header()` / `footer()` | `Header.astro` / `Footer.astro` |
| `pageHero()`, `photo()`, `ctaBand`, `svc()` | `PageHero.astro`, `Photo.astro`, `CtaBand.astro`, `ServiceCard.astro` |
| each page-body const | `pages/*.astro` |
| `content/*.mjs` | `content/` collections + `pages/` for the quote/invoice mockups |
| `ARTISTS`, `FAQ`, `gallery` | `data/*.ts` |
| `site.js` behaviours | small TS modules, per-page |
| `estimator.js` math | moves into `shared/pricing` |
| JSON-LD / sitemap / robots | per-page `<head>` + `@astrojs/sitemap` |

**Pass-1 decisions, both serving parity:** CSS ported **verbatim** as one global sheet (same bytes = same render); **TypeScript** for app + pricing (money typos become compile errors).

---

## 5. Definition of Done — Pass 1 (golden-master parity)

1. All **23 routes** render the same content/layout as `prototype/` (side-by-side match).
2. `shared/pricing` returns **identical numbers to `estimator.js`** across a battery of inputs (the parity test). Pass 1 is a *pure mirror*; the §6 corrections are a separate post-parity follow-up, **not** part of Pass-1 done.
3. Estimator runs client-side with live updates; map-pin travel works.
4. Runs on `npm run dev`; builds static with `npm run build`.
5. SEO parity: titles/metas, canonical, JSON-LD (`HealthAndBeautyBusiness` + `FAQPage`), `sitemap.xml`, `robots.txt`, OG/Twitter.
6. A11y parity: skip-link, `<main>`, focus styles, `prefers-reduced-motion`, alt text — carried over, not regressed.

Pass 1 **excludes** the elevation (§7), Sanity, the Worker, and the portal.

---

## 6. The shared pricing module (`shared/pricing`)

Typed module exporting the PRICING.md rules as pure functions + constants. Pass 1 wires only the client estimator; the Worker joins in Pass 3.

**Parity first, then corrections.** Pass 1 mirrors `estimator.js` exactly (parity test). The known issues are then fixed as a small, separately-tested "pricing corrections" follow-up so the port diff and the fix diff never mix. All four resolved from the docs (per Pieter's instruction — no need to ask):

| Item | Prototype | Per docs | Action |
|---|---|---|---|
| X-Long bride core | R3,290 ✓ | components sum to R3,290; §3 *subtotal cell* R3,490 is a typo | confirm + fix the doc cell (the only genuine doc self-conflict) |
| Group lessons | flat R600 | PRICING.md §7: R700pp (<10) / R600pp (10+) + own "# attending" input | fix in corrections + tests |
| "Very far" travel band | R1,900 | §4 R7/km round-trip ⇒ ~R2,100–R2,800 | re-derive all bands from the rate |
| Promo "cheapest free" | hair+makeup both, 4+, trial excluded from count | PRICING.md §9 states this assumption | lock as typed constants + tests |

Non-wedding occasions: see §7 (concierge form makes the estimator occasion-aware).

**Tests:** `shared/pricing` is where unit tests earn their keep — pure functions, known outputs from PRICING.md, including the REVIEW.md scenario.

---

## 7. Premium elevation (Pass 1.5)

Deliberate, on-brand upgrades layered on top of the parity port — the "expensive feel" for **visitors**. All `prefers-reduced-motion`-safe; Zandeline signs off visuals on the live build.

**Palette — hybrid (DECIDED).** Champagne restored toward golden (`~#E8D5B7`, BRAND.md §3); **mocha promoted** as the lead structural accent; **rose de-saturated and demoted** to a refined *secondary* accent (not the dominant button/band colour); trim ~10 → ~6–7 tones; drop `plum` (footer → deep mocha); burgundy a tiny brand-mark accent only (BRAND.md §9). Honours BRAND.md §11's "few disciplined colours" without fully removing the rose Zandeline knows.

**Depth without gradients.** Remove the `linear-gradient` section/hero backgrounds (BRAND.md §10 lists gradients under "avoid"); use flat layered tone-blocks (ivory→champagne→mocha) + photography for depth; add a barely-there film-grain on ivory so it never reads as flat white.

**Photography.** Replace `background-image` `.ph` divs with real responsive `<img>` (`srcset`) + LQIP **blur-up** (low-res → sharp, eased). Premium-feel *and* performance; sets up the Sanity image CDN (Pass 2).

**Motion system (BRAND.md §6B vocabulary).** Continuous hero image "breathing" (1.0→1.05, 8–12s); word-by-word headline reveal (the "curtain rising"); **Astro View Transitions** for soft route cross-fades (native, zero-jank — §6B's "soft cross-fades between routes, never hard cuts"); eased lightbox with blur-up; count-up on the live estimate. Easing stays `cubic-bezier(0.22,1,0.36,1)` (already correct).

**Hero re-art-direction.** Full-bleed editorial cover (BRAND.md §6A "magazine cover, not a header") — large warm image, restrained Cormorant overlaid with space, measured reveal — replacing the split-grid + floating "Calm and curated" badge. Must pass the 5-second test.

**Concierge booking flow.** The long-scroll form becomes a calm, multi-step wizard (one question-group per screen, progress, the estimate animating alongside). This also **resolves the occasion-aware-form gap**: each step adapts to the selected occasion (wedding → full party; events → faces+hair; group lessons → attendees + location), matched to the `shared/pricing` occasion logic.

---

## 8. The Worker / API boundary (Pass 3)

Per ARCHITECTURE.md, **one** Cloudflare Worker is the stable API boundary. Built as code during the port (runs under `wrangler dev`), live only once accounts exist.

| Endpoint | Job |
|---|---|
| `/api/enquiry` | validate → DB → Brevo → notify Zandeline |
| `/api/quote` | recompute authoritatively via `shared/pricing`; render hosted quote |
| `/api/quote/respond` | approve/reject via signed, expiring token (SECURITY.md §5) |
| `/api/travel` | geocode/route proxy (hides a Maps key if we leave keyless Photon/OSRM) |
| `/api/subscribe` | newsletter / lead-magnet → Brevo |
| (wrapper) | Turnstile + per-IP rate limit |
| (webhook) | Sanity edit → Pages rebuild |

**Data store refinement (triggered by the portal):** ARCHITECTURE.md §2 plans "Sheets → a real DB later." Because the portal (Pass 4) needs a real DB *anyway*, we likely **leapfrog the Google-Sheets CRM straight to the dedicated Supabase**, keeping Sheets (if wanted) only as a familiar read-only export for Zandeline. Decide at the Pass-3 plan.

This Worker boundary is also the seam AXIS later subscribes to (ARCHITECTURE.md §5) — no site rewrite.

---

## 9. Sanity (Pass 2)

**Token (decided):** website uses a **Viewer (read-only)** token in a secret store (never repo/chat); one-time seeding uses a **separate, temporary read+write** token, deleted after.

**Content boundary (confirm in the Pass-2 plan):** Sanity owns what Zandeline edits (STANDARDS.md §12) — hero, galleries, team, testimonials, **promos**, pricing display, FAQ, blog (so the future blog-draft agent can write drafts). Code owns legal pages, site chrome, and all estimator/form logic. Guides start as Markdown collections; can migrate later.

**Editing model:** Studio + Presentation (live visual editing) with design guardrails (locked decision) — click-to-edit preview, can't break layout. Sanity's image CDN powers the Pass-1.5 blur-up at production quality.

---

## 10. The Lustique Portal (Pass 4) — distinct subsystem

The logged-in space — the **"exclusive"** half of the premium goal. Auth + a **dedicated Lustique Supabase project** (separate from the overloaded AXIS one) + Row-Level Security. Three roles:

- **Bride portal** — her quote (approve/reject), booking status, trial date, wedding-morning timeline, allocated artist(s), inspiration uploads. A bespoke concierge space instead of an email thread.
- **Admin (Zandeline)** — the "COO" view ARCHITECTURE.md §5 envisions: pipeline, calendar/availability across the 9, allocation, quotes/invoices, promos.
- **Artist mini-dashboards** *(Pieter's new requirement)* — each artist logs in and sees **only her** Lustique-issued weddings/events (date, venue, call-time, party + look brief, schedule). Enforced by RLS (`using (allocated_artist_id = auth.uid())`) — data isolation at the database, not in fallible app code.

**Why it's last and separate:** auth + multi-role data is a different discipline from a marketing site; it needs accounts; and it must not delay or bloat the public-site launch. The site is built portal-*ready* (the Worker boundary, a real DB). **Pass 4 gets its own spec and plan** before any code. Standalone per ARCHITECTURE.md — AXIS later orchestrates these dashboards, it isn't a dependency.

---

## 11. Open items

Resolved from the docs (no longer questions): group-lesson tiers (§7), promo semantics (§9), travel-band re-derivation (§4), **palette = hybrid (decided)**. Remaining:

1. **X-Long bride price** — confirm R3,290 + fix the PRICING.md §3 subtotal typo (the only genuine doc self-conflict).
2. **New-service prices** — PRICING.md §6 itself marks these "await Zandeline"; using its proposals as working values. Not blocking.
3. **Spec location / git** — keep in `docs/superpowers/specs/` (vs root)? `git init` the project (ties into SETUP.md Phase 8)?

None block Pass 1.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Visual drift during the port | Verbatim CSS + golden-master diff; parity is the Pass-1 DoD |
| Elevation regressing parity | Pass 1.5 is a *separate, deliberate* layer after parity is signed off |
| Scope creep (portal bleeding into the site) | Pass 4 is a separate subsystem with its own spec; site only built portal-*ready* |
| Pricing errors | `shared/pricing` unit tests before any fix ships |
| Secret exposure / cross-artist data leak | Read-only tokens; secrets in a store; RLS isolates artist rows at the DB |
| "Premium" tipping into cheesy | Every elevation judged against BRAND.md ("whisper, don't shout"); subtract-don't-add |

---

## 13. Next step

On approval of this spec → **writing-plans** for the **Pass-1** implementation plan (scaffold workspace → BaseLayout + chrome → components → pages → `shared/pricing` + estimator → parity verification). Pass 1.5, 2, 3, and 4 each get their own plan when we reach them. No production code until the Pass-1 plan is approved.
