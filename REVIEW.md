# Lustique Co. — Critique & Improvement Roadmap

**Lens:** world-class bridal site that pulls traffic and converts **above** the industry norm.
**Benchmark:** current funnel ≈ 3–5% (6–8 booked ÷ 140–200 enquiries). Premium-bridal norm 15–25%. Target 8–12% in 12 months.
**Date:** 2026-06-01

---

## Scorecard (after this round)

| Dimension | Before | Now | World-class needs |
|---|---|---|---|
| Visual design | 7 | **9** | Final photo curation + mobile polish |
| Conversion (CRO) | 3 | **7** | Live estimator ✅ · real form ✅ · still needs: real testimonials, automated follow-up, online deposit |
| Traffic (SEO) | 2 | **6** | Schema ✅ OG ✅ sitemap ✅ alt text ✅ · still needs: blog, Google Business Profile, reviews, backlinks, speed |
| Backend / automation | 1 | **3** | Needs the Phase-1 accounts: form→CRM→Brevo, GA4, hosting |
| Content integrity | 6 | **8** | Artist photos + bios, real reviews, address fix live |

---

## What this round improved

**Conversion**
- **Working live estimator** — real pricing math, recalculates as the bride fills the form (the single biggest conversion lever; it answers "can I afford this?" and pre-qualifies leads). Verified: a bride + 3 bridesmaids + 2 mothers + flower girl + travel + promo = **R8,775**, correctly applying the assistant tier and the "cheapest free" promo.
- **Rebuilt quote form** — makeup and hair split per role (e.g. "3 need makeup, 2 need hair"), mothers up to 4, distance band, style, inspiration link, promo toggle. More complete than before, but **deliberately shorter than the old Wix form** (counts + one party-length selector instead of seven per-person dropdowns — see Wix critique below).
- **Sticky live-estimate bar** keeps the number in view while she fills the form.
- **Back-to-top button** sitewide.

**Traffic / SEO**
- **Structured data** (`HealthAndBeautyBusiness` JSON-LD: name, geo, area served, founder, socials) → eligible for Google rich results + local "near me" visibility.
- **Open Graph + Twitter cards** → link previews when brides share the site.
- **Canonical URLs**, **sitemap.xml**, **robots.txt**.
- **Real `<img>` + descriptive alt text** in the portfolio (SEO + accessibility).

**UX / polish**
- Fixed the "in studio" type (was an out-of-place serif italic; now consistent emphasis).
- Pricing page warmed with a photo + intro + soft background.
- Portfolio: real masonry gallery (15 of her photos) with **working category filters**.

---

## Critique of the old Wix quote form (per your ask)

The Wix form is thorough but **too long → it leaks conversions.** Specific issues:
- **Seven separate "Bridesmaid N hair length" dropdowns** always visible — exhausting; most brides abandon long forms.
- Asks hair length per individual *before* she's committed — premature precision.
- No live price feedback — she fills 30+ fields blind, then waits.

**What we kept / slimmed:** kept the warm sectioned voice ("the star of the show"), kept the makeup-vs-hair split (genuinely needed for accurate pricing), but replaced per-person length dropdowns with **one "most of the party's hair length"** for the estimate, confirming exact lengths at the trial. Net: fewer fields, a live estimate, same quote accuracy. **This alone should lift form-completion meaningfully.**

---

## Critical gaps to hit world-class + above-industry conversion

### P0 — needs the Phase-1 accounts (the real "backend")
1. **Form → CRM → email automation.** The form is a beautiful shell until the Cloudflare Worker writes submissions to the Google Sheet CRM, emails the bride a confirmation, and pings Zandeline. *Needs Cloudflare + Google + the service account.*
2. **Brevo nurture flows.** 90%+ of enquiries don't book immediately — the 6-email nurture sequence is where tail conversions live. *Needs Brevo + domain auth.*
3. **GA4 + event tracking.** We can't improve what we can't measure: estimator-started, estimator-completed, form-submitted, WhatsApp-clicked. *Needs GA4 ID.*
4. **Real hosting + domain + email migration.** Cloudflare Pages + the GoDaddy→Workspace email move.

### P1 — content + trust (mostly Zandeline)
5. **Real bride testimonials + video** (currently 3 labelled samples). Pull written reviews from the Google Business Profile; add 3–5 phone videos. *Video testimonials convert dramatically better than text.*
6. **9 artist photos + bios.** The team page is the brand's #1 differentiator and it's currently placeholders.
7. **Google Business Profile** — claim/optimise, fix the address to 242 Frangipani, La Montagne, seed reviews. This is the biggest *local* traffic lever for "bridal makeup Pretoria."
8. **Final photo curation** — Zandeline picks which shots represent makeup vs hair vs party (I matched by shape).

### P2 — compounding growth
9. **Blog** (the `/guides` engine + articles) for organic search — "bridal skin prep", "wedding morning timeline", venue-specific posts. The single best long-term traffic source.
10. **Backlinks** — photographer partners (Ryno Stoltz, Legendz Media, Lilly Mae), the Wedding Guide 2023 feature, SA bridal directories.
11. **Afrikaans keyword capture** in meta/alt (English site, but a big slice of Pretoria brides search "bruidsgrimering").
12. **Performance + mobile pass** — Sanity image CDN (responsive sizes), Lighthouse ≥95, full mobile-polish sweep.
13. **Online deposit** (PayFast) once the funnel is proven — currently deferred (manual EFT).

---

## The honest backend status

Everything that can be built **without live accounts is built**: the estimator logic, the SEO infrastructure, the CMS-ready structure, the form UX. The remaining backend — form processing, CRM writes, email automation, analytics, hosting — is **designed and ready to wire**, but genuinely needs the Phase-1 setup (Cloudflare, Google Workspace, Brevo, GA4) that's currently deferred. **That setup is now the true unlock**: it's what turns this from a beautiful brochure into a converting machine.

**Recommended next move:** do the Phase-1 setup (SETUP.md), then port this prototype to Astro + Sanity and wire the Worker + Brevo + GA4. That's the step that moves the 3–5% → 8–12%.

---

## Overlooked / risk register (raised 1 Jun 2026)

1. **Image rights + consent (HIGH).** Wedding photos are copyright of the *photographer* (Ryno Stoltz, Lumier, GC, etc.), not the studio — using them on a commercial site needs written permission + a credit line. Separately, POPIA: photos of identifiable brides/people need their consent for public/marketing use. **Action: secure written usage rights from photographers + consent from brides before launch.**
2. **POPIA cookie consent.** GA4 + tracking requires a consent banner under POPIA.
3. **Form spam protection.** Bridal enquiry forms attract bots — add a honeypot + rate-limit when the Worker is wired.
4. **Availability / double-booking.** With 9 artists across many weddings, need a Google Calendar-backed availability view so two bookings don't collide.
5. **Google Search Console + Business Profile.** Submit the sitemap; optimise the GMB (fix address to La Montagne, seed reviews) — the single biggest *local* SEO lever for "bridal makeup Pretoria".
6. **Reviews engine.** A systematic ask-past-brides flow feeds the slideshow, the GMB, and SEO. (Auto-fetching GMB reviews isn't possible without the Places API key — Zandeline can paste 3–5 favourites in the meantime.)
7. **Launch polish.** Favicon + app icons, a branded 404 page, a real OG share image, and a full accessibility (WCAG) + mobile pass before go-live.
8. **Backups + ownership.** Domain, content, and original image files backed up; clear owner for content updates + an annual pricing review.

## AXIS as the engine (future) — see chat note
The site is being built headless/modular (Astro + Sanity + a clean Worker API boundary) specifically so AXIS can later become the orchestration layer (lead intake → qualification → quote → booking → calendar → nurture → review) without a rewrite. Lustique becomes a live AXIS dogfooding case study. Keep the site fully functional without AXIS; AXIS is an upgrade, not a dependency.
