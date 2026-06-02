# Lustique Cosmetology — Website Rebuild Plan

**Status:** v2 — most business decisions locked by Zandeline (1 Jun 2026); tech decisions + Wix export still pending
**Last updated:** 2026-06-01
**Owner:** Pieter (project) · Zandeline (business decisions) · Claude (build)
**Companion docs:** [`BRAND.md`](./BRAND.md) (voice + visual) · [`PRICING.md`](./PRICING.md) (pricing + estimator spec)

---

## 0. Decisions locked (Zandeline, 1 Jun 2026)

The questionnaire is answered. These are now fixed and supersede anything earlier in this doc or the original brief.

| # | Decision | Locked answer |
|---|---|---|
| Pricing display | Firm "From R", length-tiered, components only | "From R" (no "±"); **no bundle discounts**; clear split between bride vs. party pricing. See PRICING.md. |
| Team voice | When does "we" start? | **Immediately at launch.** "We" everywhere except the founder story. |
| Team structure | Hierarchy? | **No "main/assistant" language.** All 9 artists equal, all bridal-specialised. "Assistant" is a booking-day role only. |
| Artist Instagram | Link personal accounts? | **No.** Artists are sub-contractors with their own businesses. Portfolios live as **highlights on Lustique's own Instagram** (Zandeline building these within ~2 weeks). |
| Artist allocation | Can a bride request an artist? | **No.** Lustique allocates by availability. Team page is **feel-only** — no "request this artist." → *removes the artist-preference field from the form.* |
| Artist bios | Who writes? | Zandeline writes all 9 (100–150 words, consistent voice); Claude polishes. |
| Positioning | Price tier | **"Premium at an accessible price."** |
| Faith | Religious tone | **Explicitly Christian** — faith-forward on story/values/sign-offs, faith-neutral on services/pricing/portfolio. See BRAND.md. |
| Language | Bilingual? | **English only.** (Afrikaans captured only via SEO meta, not site content.) |
| Sign-off | Email/thank-you | **"Blessings, The Lustique Cosmetology Team."** |
| Hair lengths | Estimator tiers | Short=chin · Medium=chin-to-shoulder · Long=below-shoulder-to-mid-back · X-Long=mid-back-to-pantyline · beyond=POA. |
| Travel | Rate | **R7/km** round trip, free within 15 km, from the Doornpoort studio; destination = >200 km one way. *(mechanic + address to confirm — PRICING.md §4, CONTENT.md C1/C3)* |
| Lead time | Booking window | Ideal 8–12 months; accommodates last-minute; "too late" = 48 hours before. |
| New services | Add what? | Matric farewells, editorial, corporate events, engagement + maternity shoots, pageant/stage, "any special event." Prices proposed in PRICING.md §6 (await confirm). |
| Group lessons | Defined | 6+ people, R700pp (<10) / R600pp (10+), Bez Ranch or on-location. See PRICING.md §7. |
| Workshops | Now or later? | **Later.** Reserve URL + waitlist capture for v1. |
| Deposit/cancellation | Terms | **50% upfront** to secure (flexible 25% + 25% option); balance 14 working days before. **Service agreement to be redrafted by Claude** to align everything. See PRICING.md §5. |
| **Editing dashboard** | Zandeline's control level | ✅ **Confirmed: content freedom** → **Sanity + Presentation (live visual editing)** + flexible page-builder schema. She swaps images, edits text, reorders sections, manages galleries/team/testimonials/**promos** via click-to-edit live preview — design guardrails hold, so it can't go bland. (Not a full drag-drop layout builder.) |
| **Promotions** | Editable? | **Yes — CMS-editable + rotatable** by Zandeline. Standing promo: "4+ → least-expensive person's hair & makeup free." |
| Brand name | Display | **"Lustique Co."** (full "Lustique Cosmetology" for sign-offs/legal/SEO). |
| Experience | Trust stats | Zandeline **since 2018**; team **40+ years combined** across 9 artists (headline stat). |
| 12-month goal | Success | Automated-but-personal system; double bookings; keep team calendars full. |

**Tech decisions locked (Pieter, 1 Jun 2026):**
- **DNS → move to Cloudflare now** (GoDaddy stays registrar). Required for Pages on the bare domain; cleaner + free.
- **Payments → no online deposits for v1.** Keep the current manual EFT + signed-agreement flow. Site captures the enquiry; deposits stay human. *(PayFast can be added later as a clean increment.)* → the Worker has one job: capture + fan-out (Sheets + Brevo + notify). No payment integration.
- **WhatsApp → Contact + thank-you pages only** (not a sitewide floating button — protects the quiet aesthetic). wa.me link to 067 925 3894, context-prefilled.
- **Project folder confirmed:** `/Users/pieter/Documents/Layer Zero Studios/Opus Project Folder/Lustique/`.

**Still open (Zandeline):** hero tagline pick · logo reconciliation · new-service price confirms · minimum booking value · Pinterest boards · video testimonials + real bride testimonials (coming within a month) · the 9 artist bios + IG portfolio highlights (~2 weeks).

**Content blocker — largely cleared:** all page copy, the full quote-form structure, FAQ, T&Cs and privacy are now extracted (CONTENT.md). The **Wix API key is vaulted in Supabase** → use it to pull the real high-res portfolio images + exact published content. Remaining content gaps: real photos (via Wix API), bios, testimonials.

**Decision needed now (Pieter):** the editing-dashboard control level (see table) — it forks the architecture. My recommendation: Sanity + live visual editing.

---

## 1. Executive summary

Replace the underused Wix site with a free-hosted Cloudflare site that operationalises Lustique's existing Google + Brevo workflow, repositions the brand from *Zandeline solo* to *Lustique team*, and rebuilds the bride's journey around transparency, education and speed.

**The three highest-impact moves:**

1. **Make pricing firm and visible.** Replace every "FROM ±R" approximate with a firm "from R [X]" anchored to bride hair length. Add an interactive estimator so brides can self-quote before submitting a form.
2. **Lead with the team, not the founder.** Build a "Meet the Team" architecture with 9 artist profiles, each linked to their own Instagram highlights. Reposition copy from "I" to "we" without losing Zandeline's warmth as founder.
3. **Cut the funnel from 7 steps to 3.** Today: enquiry → quote → agreement → deposit → confirmation = ~7 manual touches. Proposed: estimator → form → automated booking link = 3 touches, with the rest happening in the background via Brevo + Google Sheets.

**Expected impact:** Conversion from enquiry to booking is currently 3–5% (6–8 bookings ÷ 140–200 enquiries). Industry benchmark for premium bridal artistry is 15–25%. A realistic 12-month target is **8–12% conversion**, which would roughly double bookings without buying more traffic.

**Recurring cost:** ~$6/month (Google Workspace seat). Everything else is on free tiers.

---

## 2. Strategic positioning

Competitive map vs. the three reference brands:

| Dimension | Tash Studio (Pretoria) | Rose Serene (Pretoria) | CK Makeup (Centurion) | **Lustique (proposed)** |
|---|---|---|---|---|
| Team model | "TS Pro-Team" — Tash-forward, team in background | Solo (Jeanne-Kay) | Solo (Cicilia) | **Team-first, 9 named artists** |
| Pricing | Opaque (PDF download) | Opaque + "Instant Estimate" teaser | Opaque | **Firm "from R" anchors + live estimator** |
| Geography | Pretoria | Pretoria | Centurion | **4 provinces + destination weddings** |
| Trust signals | 300 brides, 5 awards, referrals | 1,800 weddings, 24 yrs, magazine features | 25 yrs experience, awards | **Since 2016, 9-artist team, real bride reviews, transparent pricing** |
| Education | Blog only | Blog only | None | **Blog + downloadable guides (lead magnets)** |
| Funnel | Multi-step manual | Multi-step + instant estimate teaser | Form-based | **Estimator → form → automated booking** |

**Lustique's three pillars** (the brand keywords Zandeline chose):

- **Elegant** — restrained typography, generous whitespace, considered photography. Not glittery; not minimal-cold.
- **Intimate** — close-up imagery, personal storytelling per artist, warm tones. Bride feels seen.
- **Transformative** — before/after pairs, the journey from enquiry to wedding morning, the bride's emotional arc.

The closest reference is Rose Serene (romantic / airy) with more intimacy and less luxury-distance. Not as moody as Tash, not as saturated as CK.

---

## 3. The funnel problem (and the fix)

### Today (3–5% conversion)

```
Instagram / Google
   ↓
Lustique Wix site
   ↓
Quote form (Wix Forms)
   ↓
[manual] Zandeline writes custom quote
   ↓
[manual] Quote emailed back
   ↓
[manual] Service agreement emailed
   ↓
[manual] Deposit reminder
   ↓
[manual] Booking confirmation + calendar add
```

**Where brides leak out:** pricing uncertainty before the form (high), wait time after submission (medium), manual back-and-forth fatigue (medium).

### Proposed (target 8–12%)

```
Instagram / Google
   ↓
Homepage — clear "Get your estimate" CTA
   ↓
INTERACTIVE ESTIMATOR (no form fields, just clicks)
   shows a firm price band immediately
   ↓
"Refine with custom quote" → Quote form (pre-filled)
   ↓ [submission triggers]
   • Append row to Google Sheets CRM
   • Brevo immediate confirmation email
   • WhatsApp / email ping to Zandeline
   • Brevo nurture sequence kicks off
   ↓
[24-hr] Custom quote sent via email template
   ↓
Quote accepted → signed service agreement (existing Google Form)
   ↓
Booking fee paid via EFT + proof of payment (manual, per agreement — no online checkout in v1)
   ↓
Confirmation email + Google Calendar invite
```

> v1 keeps the deposit/payment step **human + agreement-backed** (Pieter's call). The site's job is to get her to "quote accepted" with far less friction; the proven manual booking flow takes it from there. Online deposits are a later, clean add-on.

**Bride sees:** 3 clear stages (estimator → quote → book). Backend automation handles the rest.

**Bride who doesn't convert immediately:** still enters Brevo nurture sequence — 6 emails over 60 days. Significant tail conversion expected.

---

## 4. Brand voice + visual direction

**Canonical source:** [`BRAND.md`](./BRAND.md). The brand system has its own working document so it can evolve independently of this plan. Summary below; details, hex values, type scale, photography rules, and tagline candidates all live in BRAND.md.

### The central rule

**Whisper, don't shout.** Every component, every sentence, every image is judged against this. Zandeline's brief — *"like stepping into a quiet, luxurious dressing room — warm, soft, and unhurried"* — is the guiding sentence.

### Palette (summary)

Muted, layered, warm. Ivory `#FAF6F0` (primary), Champagne `#E8D5B7`, Blush `#EFD2C5`, Deep Mocha `#5C4332` (headlines), Charcoal `#3A2E26` (body). The logo's existing burgundy is kept as a small accent only.

### Typography (summary)

Cormorant Garamond (display) + Manrope (body), both free on Google Fonts. No script faces on the website.

### Photography (summary)

Editorial-feel, close-up, hands-at-work, negative space, warm grade. NO smiling group shots as heroes, NO ring-light beauty look. Curate from Instagram for v1; possible half-day team shoot before launch (Zandeline to decide — see BRAND.md §9).

### Voice (summary)

Warm, specific, second-person, active. The seven voice rules and the yes/no copy samples live in BRAND.md §7. Tagline recommendation: **"Feel most like yourself."**

---

## 5. Sitemap & information architecture

```
/
├── Home
│     hero · estimator entry · social proof · team teaser · services grid · testimonials · footer
│
├── /bridal — The Bridal Experience
│     the journey (enquiry → trial → wedding day) · packages · what's included
│     · the trial (why it matters) · destination weddings · FAQs (accordion)
│
├── /services  (everything beyond bridal — "any special event")
│     ├── /services/matric-farewells
│     ├── /services/editorial            (editorial + photoshoots)
│     ├── /services/engagement-maternity (couple + maternity shoots)
│     ├── /services/corporate-events
│     ├── /services/pageant-stage
│     ├── /services/group-lessons        (6+, Bez Ranch or on-location)
│     └── /services/workshops            (v1: "coming soon" + waitlist capture)
│
├── /pricing
│     firm "from R" packages · transparent add-ons · travel calculator
│     · interactive estimator · "request a custom quote" CTA
│
├── /portfolio
│     filterable: by artist · by style (natural / glam / editorial / boho) · by service
│
├── /team
│     one team page with 9 equal artist sub-sections (no tier language)
│     each artist: photo, 100–150-word bio, link to her portfolio HIGHLIGHT on Lustique's IG
│     (no personal-account links, no "request this artist" — Lustique allocates)
│     framing: "feel for our artists' work" — every artist bridal-specialised
│
├── /resources
│     ├── /resources/bridal-prep-30-days (free PDF download — lead magnet)
│     ├── /resources/wedding-morning-timeline (free PDF download)
│     ├── /resources/skin-prep-guide (free PDF download)
│     └── /resources/choosing-your-artist (free guide)
│
├── /reviews — bride testimonials + any magazine features
│
├── /faq — full FAQ page (subset on /bridal)
│
├── /blog — long-form articles for SEO + nurture
│
├── /about
│     the Lustique story, the studio, Zandeline as founder
│
├── /contact — phone, email, studio address, social links, map
│
└── /quote — the form (single conversion engine)
```

**Why this structure:**

- `/team` as a destination, not buried under `/about` — gives the team-first positioning a real URL
- `/resources` is the engine of the lead-magnet funnel — every guide is gated by email signup, feeding Brevo
- `/pricing` is the trust play — competitors hide it, Lustique shows it
- `/quote` is the single conversion URL — every CTA in the site funnels here, which makes analytics clean

---

## 6. Pricing redesign

> **Authoritative spec:** [`PRICING.md`](./PRICING.md) holds the full component price list, hair-length rules, deposit/cancellation terms, new-service proposals, and the estimator formula. This section keeps only the *product/UX* thinking. If a number here ever disagrees with PRICING.md, PRICING.md wins.

### Problem with current pricing

Every package on the PDF says **"FROM ±R[X]"** — approximate, not firm. The bride sees "FROM +- R2 700" and reads "could be anywhere from R2,700 to R4,500 — I have no idea." That's a conversion killer.

The reason the price is approximate is **hair length** (the bride's hair length adds R0 / R100 / R200 / R300 to the bridal hair styling line).

### Solution: anchor packages by hair length

Show all 7 packages with a hair-length selector:

```
[ Short ] [ Medium ] [ Long ] [ Extra long ]
              ↓
Package 1 — Solo Bride
"Just you, trial + wedding day, lashes + touch-up kit"
From R 2 700      ← updates live based on selector
```

The bride toggles her hair length once at the top of the pricing page; every package quote updates. This is 1 day of dev work and removes the entire "FROM ±" ambiguity.

### Add-ons stay transparent

Current PDF already publishes add-ons clearly (Mother R895, Bridesmaid R945, etc.). Keep these. Display as a table below the packages.

### The interactive estimator

A free, no-account-needed calculator that produces a firm estimate:

**Inputs (one screen, ~30 seconds to fill):**
- Bride's hair length (short / medium / long / x-long)
- Number of bridesmaids needing hair + makeup
- Mother of bride / groom? (none / one / both)
- Flower girls under 12
- Flower girls over 12 / other family
- Wedding venue location (postal code or dropdown of common venues)

**Output:**
- A firm total range: "Your estimate: R 4 850 – R 5 200 (incl. trial + day-of + travel)"
- "Request a custom quote" CTA — pre-fills the quote form with these inputs
- "Save / email this estimate to yourself" — captures email for Brevo nurture even if she doesn't continue
- "WhatsApp us about this" — wa.me link with the estimate prefilled in the message

**Why this works:**
- Brides who would have bounced because of pricing uncertainty get an instant answer
- Brides who continue arrive at the quote form with their info already entered (less friction)
- Brides who bounce still hand over an email for nurture
- Rose Serene already advertises this — table stakes for the segment

### Travel pricing

Rate is now **R7/km** (up from R5 — fuel). The bride won't know her km, so the estimator hides the maths behind a venue-cluster dropdown with pre-computed round-trip costs (Pretoria East, Centurion, Midrand, Hartbeespoort/Magaliesburg, Bela-Bela, etc.), an "other / type my town" fallback, and a destination (>200 km) path that routes to a custom quote. Exact mechanic to confirm — see PRICING.md §4.

---

## 7. Quote form v2

Field-by-field redesign. Aim: 3-minute completion, not 10.

**Section 1 — About you**
- Full name (required)
- Email (required)
- Phone (required, with WhatsApp opt-in checkbox)
- How did you hear about us? (Instagram / Google / Friend referral / Past bride / Other)

**Section 2 — Your big day**
- Wedding date (date picker, required)
- Venue name (text)
- Town / city (text, required)
- Province (SA province dropdown + "Outside SA")
- Wedding party size (intimate <50 / medium 50-150 / large 150+ / destination)

**Section 3 — Your team**
- Bride's hair length (short / medium / long / x-long, required)
- Bridesmaids needing hair + makeup (number)
- Mother of bride / groom (none / one / both)
- Flower girls under 12 (number)
- Flower girls over 12 / other family (number)

**Section 4 — Your vision**
- Style preferences (multi-checkbox: Natural · Glam · Editorial · Boho · Vintage · Modern · Not sure yet)
- Inspiration links — Pinterest / Instagram (optional, multi-line)
- Photo upload — current hair / inspiration (optional)
- Skin concerns or allergies? (optional textarea)

**Section 5 — Logistics**
- Anything else we should know? (textarea)

> **Removed:** artist-preference field. Lustique allocates by availability (Zandeline Q14), so asking would set a false expectation. The team page sells *the team*, not a pick-list.

**Conditional logic:**
- If destination wedding (>200 km) → show travel + accommodation disclaimer (min 2 nights, 3-star) + "we'll send a tailored quote" note
- If wedding date is <30 days out → flag for priority response; show "we'll reply within 24h" and the 48-hour cutoff
- Pre-fill sections 2 & 3 from the estimator when the bride arrives via it

**Pre-fill from estimator:** If the bride came via the estimator, sections 2 and 3 are pre-populated.

**Submit button copy:** "Send my enquiry" — not "Submit" (boring) and not "Get my quote" (over-promises before we've reviewed).

**Thank-you screen:**
- "Thank you, [name] — we've received your enquiry"
- "Our team will reply within 24 hours, often sooner"
- "While you wait, [download our 30-day bridal prep guide] free" — keeps lead magnet engagement
- Social links
- Sign-off: **"Blessings, The Lustique Cosmetology Team"**

---

## 8. CRM design (Google Sheets)

The current CRM is informal (Zandeline's inbox + memory). Proposed: a structured Google Sheet, populated automatically by the form handler.

**Sheet 1 — `Leads`** (auto-populated from form submission)

| Col | Field | Notes |
|---|---|---|
| A | Timestamp | Auto |
| B | Lead ID | LST-YYYYMM-NNN |
| C | Status | NEW / CONTACTED / QUOTED / NEGOTIATING / AGREEMENT_SENT / DEPOSIT_PENDING / BOOKED / COMPLETED / DECLINED / GHOSTED |
| D | Name | |
| E | Email | |
| F | Phone | |
| G | Wedding date | |
| H | Days until wedding | Auto-calc |
| I | Venue | |
| J | Town | |
| K | Province | |
| L | Estimator total (R) | If came via estimator |
| M | Bride hair length | |
| N | Party size | bride + N |
| O | Source | IG / Google / referral / past bride / other |
| P | Artist preferred | |
| Q | Style preferences | |
| R | Notes (from form) | |
| S | Internal notes | Team-only column |
| T | Quote sent date | |
| U | Quote total (R) | |
| V | Accepted? | Y/N/Pending |
| W | Deposit received | Y/N + date |
| X | Booked? | Y/N |
| Y | Owner (artist) | |
| Z | Next action | |
| AA | Next action date | |

**Sheet 2 — `Bookings`** — confirmed bookings (filter view of Leads with Status = BOOKED+)

**Sheet 3 — `Artists`** — team roster
Name · Specialty · Instagram · Studio days · Travel willing · Notes · Current bookings count

**Sheet 4 — `Email templates`** — copy-pasteable response templates for the team

**Sheet 5 — `Analytics`** — auto-calculated weekly dashboard
- Enquiries this week / month / YTD
- Conversion rate by source
- Conversion rate by artist preference
- Average days to booking
- Average package value

**Automation:**
- Form submission → Cloudflare Worker → writes new row to `Leads` (Status: NEW)
- Email opens / clicks via Brevo → optional column updates
- Status changes manual (one column, easy to update)

---

## 9. Marketing & email stack

### Brevo flows

**Flow 1 — Lead nurture** (triggered on form submission; for everyone who doesn't book within 14 days)

| Day | Subject | Purpose |
|---|---|---|
| 0 | "We've got your enquiry, [name]" | Confirmation, what happens next, what to do while waiting |
| 3 | "Behind the scenes of a Lustique trial" | Reduce fear, build connection |
| 7 | "Free download: 30-day bridal skin prep" | Value-add, position as expert |
| 14 | "Meet the Lustique team" | Reinforce team-first positioning, link to Instagram |
| 30 | "Real brides on their morning with us" | Social proof at decision moment |
| 60 | "Last call: availability for [wedding month]" | Scarcity-driven re-engagement |

**Flow 2 — Booked bride** (triggered on deposit received)

| Trigger | Subject | Purpose |
|---|---|---|
| +0 | "Welcome to the Lustique family" | Confirmation + what to expect |
| +3 days | "Your 30-day skin prep guide" | Lead into trial |
| 2 wks before trial | "Trial day checklist" | Logistics |
| 1 week before wedding | "Wedding morning timeline planner" | Logistics |
| Day before | "We can't wait for tomorrow" | Warm reassurance |

**Flow 3 — Past bride** (triggered after wedding date passes)

| Trigger | Subject | Purpose |
|---|---|---|
| +7 days | "Thank you, [name]" + review request | Social proof harvest |
| +1 year | "Happy first anniversary 💍" | Brand love, anniversary services upsell |

### GA4 events

Custom events to track funnel health:

- `estimator_started` · `estimator_step_2`, `_3`, `_4` · `estimator_completed` · `estimator_to_form`
- `quote_form_started` · `quote_form_submitted` · `quote_form_abandoned`
- `portfolio_image_clicked` · `artist_profile_clicked` · `artist_instagram_clicked`
- `resource_download_requested` (by guide name)
- `whatsapp_clicked` · `phone_clicked` · `email_clicked`
- `pricing_page_viewed` · `package_expanded` (by package number)

Plus standard GA4: page_view, scroll, outbound_link, file_download.

### Plus Cloudflare Web Analytics

Privacy-friendly, zero-cookie analytics as a complement to GA4 (since some EU/UK brides will block GA). Free.

---

## 10. Technical architecture

### Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Astro** | Static site, fast, content collections suit bridal portfolio + blog, free hosting |
| Hosting | **Cloudflare Pages** | Free, global CDN, automatic HTTPS, preview deploys per PR |
| Form handler | **Cloudflare Worker** | Free tier 100k req/day (way more than we need), no cold start |
| **Content (CMS)** | **Sanity** (headless) — *pending confirm* | Zandeline edits images, galleries, team, testimonials, copy herself in a visual Studio. Free tier; best-in-class image pipeline (crop / focal-point / CDN). This is what gives her "decide what photo goes where." |
| Image optimisation | **Sanity image CDN** (+ Astro `<Image>` for local assets) | Sanity auto-formats/resizes/crops on the fly. Replaces the need for a separate Cloudflare Images plan. |
| DNS | **Cloudflare DNS** | Free, fast, easy MX management |
| Email | **Google Workspace Business Starter** | $6/user/mo, unavoidable for branded email |
| Email marketing | **Brevo** | Free up to 300 sends/day; reasonable paid tiers |
| Analytics | **GA4 + Cloudflare Web Analytics** | Free, complementary |
| Payments | **None in v1** — manual EFT + signed agreement | Pieter's call. PayFast a clean later add-on if/when online deposits are wanted. |
| CRM | **Google Sheets** + Sheets API | Zero learning curve, Zandeline already uses Google |
| Domain | **Cloudflare Registrar** (transfer from GoDaddy, optional) | At-cost renewals, save ~R200/yr |

### Repository layout

```
Lustique/
├── PLAN.md                   ← master plan (this file)
├── BRAND.md                  ← voice + visual + motion system
├── PRICING.md                ← pricing + estimator spec
├── SETUP.md                  ← Phase 1 provisioning runbook
├── CONTENT.md                ← copy + asset inventory (build phase)
│
├── site/                     ← the Astro project (the website)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── lib/sanity/        ← Sanity client + image-URL builder + queries
│   │   ├── content/           ← MDX for blog (CMS handles the rest)
│   │   ├── layouts/
│   │   └── styles/
│   ├── public/
│   │   ├── logo/
│   │   ├── fonts/
│   │   └── downloads/         ← the lead-magnet PDFs
│   ├── astro.config.mjs
│   └── package.json
│
├── studio/                   ← Sanity Studio (Zandeline's editing dashboard)
│   ├── schemaTypes/           ← content models: hero, gallery, artist, testimonial, page blocks
│   ├── sanity.config.ts
│   └── package.json
│
├── worker/                   ← Cloudflare Worker (form handler)
│   └── form-handler/
│       ├── index.ts
│       └── wrangler.toml
│
└── assets/                   ← raw source files (pre-upload)
    ├── portfolio/
    ├── team/
    └── guides/
```

**How content flows:** Zandeline edits in the Sanity Studio → content saves to Sanity's hosted content lake → a webhook triggers a Cloudflare Pages rebuild → the live site updates in ~1 minute. She never sees code; the site stays fully static and fast.

### Form submission flow (technical)

```
[Bride submits /quote]
       ↓
[POST to /api/quote → Cloudflare Worker]
       ↓
[Worker validates payload]
       ↓
[Worker writes row to Google Sheets via service account]
       ↓
[Worker calls Brevo API → adds contact, triggers Flow 1]
       ↓
[Worker calls Pushover/Telegram/email → notifies Zandeline immediately]
       ↓
[Worker returns 200 → bride sees thank-you page]
```

Single function, ~150 lines of TypeScript. Tested locally with `wrangler dev`.

### Performance budget

- Largest Contentful Paint: <1.5s on 4G
- Total page weight (homepage): <500KB before images, <1.5MB with images
- Lighthouse: ≥95 on Performance, Accessibility, SEO, Best Practices

These are stretch targets but realistic for a static Astro site on Cloudflare.

---

## 11. Email migration playbook (GoDaddy → Google Workspace)

Do this **before** the website cutover so email continuity is rock-solid by launch.

### Pre-flight (1 day)

1. Sign up for **Google Workspace Business Starter** at workspace.google.com. Use Zandeline's existing personal Google account or create a new admin account.
2. Add `lustiqueco.co.za` as the primary domain. Google issues a TXT verification record.
3. At GoDaddy DNS, add the TXT record. Verify in Workspace admin.
4. Create mailboxes:
   - `info@lustiqueco.co.za` (primary, replaces existing)
   - Optional: `zandeline@lustiqueco.co.za`, `bookings@lustiqueco.co.za`, `team@lustiqueco.co.za`

### Migration (1–2 days)

5. **Run IMAP migration:** Admin console → Data → Data migration → choose IMAP source. Provide GoDaddy IMAP credentials:
   - Server: `mail.lustiqueco.co.za` (or whatever GoDaddy uses)
   - Port: 993, SSL on
   - Username: `info@lustiqueco.co.za`
   - Password: existing GoDaddy email password
6. Start migration. For a multi-year inbox this can take hours-to-a-day. Doesn't disrupt incoming mail at this stage.
7. Verify migration complete — check folders, attachments, sent items all came across.

### DNS cutover (1 hour, plus 24-48h to fully propagate)

8. At DNS (GoDaddy or Cloudflare DNS — see below), replace existing MX records with:
   - `1 ASPMX.L.GOOGLE.COM`
   - `5 ALT1.ASPMX.L.GOOGLE.COM`
   - `5 ALT2.ASPMX.L.GOOGLE.COM`
   - `10 ALT3.ASPMX.L.GOOGLE.COM`
   - `10 ALT4.ASPMX.L.GOOGLE.COM`
9. Add SPF record: `v=spf1 include:_spf.google.com ~all`
10. Enable DKIM in Workspace admin (generates a TXT record to add)
11. Add DMARC record: `_dmarc TXT v=DMARC1; p=none; rua=mailto:info@lustiqueco.co.za`

### Verification + decommission (48 hours)

12. Test inbound + outbound from both directions. Have a friend send to `info@lustiqueco.co.za` — should arrive in Google.
13. Test sending — should arrive without "via gmail.com" warnings (means DKIM is working).
14. Once stable for 48h, cancel GoDaddy email subscription. Keep domain registration with GoDaddy for now.

### Optional: domain transfer (later, separate)

15. Eventually transfer `lustiqueco.co.za` from GoDaddy → Cloudflare Registrar:
   - Cheaper renewals (at-cost, no markup)
   - Single dashboard (DNS + domain together)
   - Not urgent — do whenever GoDaddy renewal comes up

### DNS strategy decision

We need to decide where DNS lives during the rebuild:

**Option A — Move DNS to Cloudflare now** (recommended)
- Cloudflare nameservers, GoDaddy as registrar only
- Cleaner DNS UI, faster propagation, free
- Required if we use Cloudflare Pages with the bare domain

**Option B — Keep DNS at GoDaddy**
- Familiar UI, no change needed
- Have to manage Cloudflare Pages via CNAME (works but less clean)

Recommend Option A. ~1 hour of work, no downtime if done correctly.

---

## 12. Phased timeline

Assumes Pieter reviews ~weekly, Zandeline available for content decisions, Claude does the build.

| Phase | What happens | Calendar week | Blocking? |
|---|---|---|---|
| **0 — Plan approval** | Pieter + Zandeline review this doc; lock big decisions | Week 0 | Yes — every later phase depends |
| **1 — Setup** | Cloudflare account, Workspace, Brevo, repo init, email migration | Week 1 | Email migration must complete before launch |
| **2 — Content collection** | Curate portfolio from IG, artist bios from Zandeline, copy drafts, lead magnet PDFs | Weeks 1–3 (parallel with Phase 1) | Bios + lead magnets are bottleneck |
| **3 — Build** | Astro scaffold, brand system, all pages, estimator, quote form, Worker, Brevo flows | Weeks 2–5 | Depends on content |
| **4 — Soft launch** | Deploy to staging subdomain, internal review, end-to-end testing | Week 5 | |
| **5 — Cutover** | DNS cutover, Wix cancellation, announcement | Week 6 | Should overlap weddings calendar — avoid Friday-Saturday |
| **6 — Iterate** | Watch analytics, refine, blog content, calendar features | Ongoing | |

**Realistic total to live launch: 4–6 weeks.** Faster is possible if Zandeline has bios and lead-magnet content ready early.

---

## 13. Costs

| Item | One-time | Monthly | Annual |
|---|---|---|---|
| Cloudflare Pages | — | — | — |
| Cloudflare Worker | — | — | — |
| Cloudflare Images | — | Free tier | — |
| Cloudflare DNS | — | — | — |
| Google Workspace Starter (1 user) | — | ~$6 (~R110) | ~$72 (~R1,320) |
| Brevo | — | Free | — |
| GA4 + CF Analytics | — | — | — |
| PayFast / Yoco | — | per-tx ~2.9% | — |
| Domain (GoDaddy, status quo) | — | — | ~R200 |
| Domain (Cloudflare Registrar, after transfer) | — | — | ~R180 (~$10) |
| **Total recurring** | — | **~$6 / mo** | **~$80 / yr** |

Compared to current Wix Premium (typically $20–30/mo + email): **immediate savings of ~$15–25/month**, even with Workspace added. Annual saving ~$200–300.

---

## 14. What I need from you

### Urgent — unblocks the next phase

1. **Wix content export.** The live site is 404 and the form is JS-rendered, so I cannot pull either remotely. From the Wix back-end I need:
   - All current page copy (Home, About, Services, Pricing, Contact, anything else)
   - Current quote form structure — field names, dropdown options, required vs optional, any conditional logic
   - Any existing testimonials / reviews stored there
   - Any portfolio images not already on Instagram
2. **Confirm project folder.** I've defaulted to `/Users/pieter/Documents/Layer Zero Studios/Opus Project Folder/Lustique/`. Change if you'd prefer.
3. **Zandeline's sign-off on the pricing redesign.** Moving from "FROM ±R" to firm "from R" anchored to hair length is the single most impactful change in this plan. Confirm she's comfortable.
4. **Decision on team-first positioning.** This plan re-positions Zandeline from "the face" to "the founder of a team." How fast does she want that transition?

### Important — needed during content phase

5. Artist bios for all 9 (Zandeline said she'd write these)
6. Studio photos if not already on Instagram
7. Past bride reviews — exported if possible; otherwise we pull from Instagram tags
8. Logo files in vector format (SVG / AI / EPS) if you have them — I have the PNGs

### Decisions to lock during plan approval

9. **Domain registrar.** Keep with GoDaddy, move to Cloudflare Registrar, or decide later?
10. **Payment processor.** PayFast vs Yoco — both fine for SA. PayFast is older / more established; Yoco has nicer UX. Want me to pick?
11. **WhatsApp Business.** Should we add click-to-WhatsApp on every page? Brides in SA expect it.
12. **Multi-language.** Pretoria's bridal market is heavily Afrikaans-speaking. English-only, or English + Afrikaans toggle? Affects content effort meaningfully.

---

## 15. Open strategic questions

These don't block the build but they're worth Zandeline's input before we lock copy:

- **Pricing tier positioning.** Lustique's R2,700–R8,000 packages sit in the middle. SA premium competitors run R5,000–R15,000+. Hold, raise, or signal "premium at an accessible price"?
- **Brand transition pace.** Does Zandeline want to step back as "the face" immediately at launch, or transition gradually over 6–12 months as the team page builds equity?
- **Team economics.** Are artists sub-contractors paid per booking, employees, or partners? Affects how we present "the team" — for example, can we credit individual artists on portfolio shots?
- **Substack / Layer Zero connection.** Treating Lustique as fully separate from Pieter's Layer Zero / AXIS work — confirm? Or any cross-promotion intended?

---

## Appendix A — Reference site teardowns (full)

### Tash Studio (tashstudio.co.za) — Pretoria

**Navigation:** Home · Portfolio · TS Pro-Team · Packages · FAQ · Blog · Contact

**Positioning:** "300+ brides, 5 industry awards, reputation built on referrals." Tash-forward but with extended team.

**Pricing:** Hidden behind a Google Drive PDF link. "By Appointment Only" — restricts consultations to Tue–Thu, Fri–Sat reserved for weddings.

**Voice samples:**
- "Hair and makeup for brides who want to look exactly like themselves just undeniably, unforgettably better."
- "We listen first, suggest second."
- Bio tagline (Tash): "Dog mom, Wife to my best friend, Lover of good food and wine"

**Trust signals:** TopVendor 2025/24/23 badges, 6+ named testimonials, referral language throughout.

**Blog topics:** "The Quiet Power of a Wife", "Find Your Dream Wedding Makeup Artist", "Finding your perfect wedding makeup look", "Team Portfolio day".

**Take for Lustique:** The "Pro-Team" model is closest to what Zandeline wants. Steal the nav pattern, beat them on pricing transparency, match the blog cadence.

---

### Rose Serene Studio (roseserenestudio.com) — Pretoria

**Navigation:** Home · Bridal Gallery · Pricing & Quotations · FAQs · Reviews · Special Occasions · Corporate · Blog

**Positioning:** "1,800 weddings, 24 years' experience." Heavy on credentials + magazine features.

**Pricing:** Opaque, but advertises "Instant Estimates Available!" — a hint at a calculator. This is exactly the move Lustique should beat them on.

**Voice samples:**
- "Be Unforgettable. Effortless Elegant Beauty."
- "I love seeing a person's self-confidence blossom throughout the beauty process."
- "What you are truly investing in on your wedding day is how your memories will look."

**Visual:** Cart icon visible top-left (suggests e-commerce capability). Logo monochrome. Photography natural-warm.

**Take for Lustique:** Rose Serene shows the appetite for transparency exists — they just haven't shipped the real thing yet. Lustique can.

---

### CK Makeup (ckmakeup.co.za) — Centurion

**Navigation:** Home · About · Services (dropdown) · Gallery (dropdown) · Contact

**Positioning:** "Award-winning, 25 years experience." Single-artist, no team model.

**Pricing:** Fully opaque. No PDF download even — just "BOOK NOW."

**Forms:** Two — a short contact form and a longer Book Now form (name, email, phone, date, time, occasion, location, "how many others need makeup", notes). Good structure to learn from.

**Voice:** Heavy testimonial language, "true artist living her passion."

**Take for Lustique:** CK's form structure is closest to what we'd build. Their lack of FAQ / blog / education is a gap we exploit.

---

## Appendix B — Source materials inventory

**What we have:**
- Pricing PDF (LC Wedding Hair & Makeup Packages & Pricing 2026-2027.pdf, 14 pages) — full pricing, services, bio, booking process, brand voice samples
- 4 logo variants (PNG) — circular framed, mirror with veil motif
- Instagram: @lustique_cosmetology
- Facebook: facebook.com/LustiqueCosmetology
- Domain: lustiqueco.co.za (current site 404)
- Email: info@lustiqueco.co.za

**What we need:**
- Wix back-end content dump
- Current quote form structure
- Vector logo files
- Studio photography
- Artist photography + bios (per the team)
- Past bride reviews
- Any signed contracts/agreements (for legal pages — privacy, T&Cs)
