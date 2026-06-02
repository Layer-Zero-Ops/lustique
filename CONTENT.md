# Lustique Cosmetology — Content Inventory & Migration Source

**Status:** v1 — extracted from the live Wix Studio site + quote form (1 Jun 2026)
**Source:** 6 Google Docs (Home, Makeup, Hair, Terms, Privacy pages + the quote form), the 2026–2027 pricing PDF, and the signed service agreement.
**Purpose:** Everything the new site migrates *from*. Copy here is the raw material — most gets refined into the new team-first, quiet-luxury voice (see BRAND.md), but nothing true is lost.

---

## ✅ Conflicts RESOLVED (Pieter, 1 Jun 2026)

| # | Conflict | **Resolved answer** |
|---|---|---|
| C1 | Studio address | **242 Frangipani Street, La Montagne, Pretoria.** ⚠️ The live site's "524 Peerboom Street, Doornpoort" is **outdated/wrong** — must be corrected on the new site, footer, T&C, privacy, **and the Google Business Profile.** Travel origin = this address. |
| C2 | Booking fee | **50% upfront to secure the date.** Flexible option: **25% now** (if that's all the bride can afford) + **the other 25% later** (on a chosen date, or with the balance). **Balance due 14 working days before** the event. → Supersedes the 40% Google-Form agreement. **Action: redraft the service agreement + T&Cs with Claude so everything aligns** (see deliverable below). |
| C3 | Travel | **R7/km, free travel within 30 km (round trip) of the La Montagne studio**; R7/km beyond. (Updated from the old "R5/km, free within 15 km.") |
| C4 | Destination / overnight | **Destination = >200 km one way** → custom quote. Overnight when required = R1000/artist/night (or client-provided 3-star). To be finalised in the service-agreement redraft. |
| C5 | Experience | **Zandeline: since 2018** (her first makeup course). **The team collectively: 40+ years across all 9 artists** — use this as the headline trust stat. (Supersedes the PDF's "2016" and the site's "7+ years / over a decade.") |
| C6 | Standing promo | **"Book Hair & Makeup for 4+ → the least-expensive person's hair & makeup is FREE."** Zandeline wants to **rotate promos**, so **promotions must be CMS-editable** (she creates/toggles them herself). This is the "promotion" exception to component-only pricing. |
| C7 | Assistant fee model | **Tiered:** 5+ people → 1 assistant R850 · 9+ → 2 assistants R1700 · 13+ → 3 assistants R2550 (from the live form). |

### 📄 New deliverable: redraft the service agreement + T&Cs
Zandeline wants Claude to tidy the service agreement and align it with the website T&Cs and the new pricing. One clean, consistent legal document → feeds the **/terms** page + the booking step. Scheduled for the content phase.

---

## Current site structure (Wix Studio — the baseline to beat)

**Staging URL:** `ahsmassage.wixstudio.com/lustique` (it's live, just on a Wix sub-domain — explains the "404" on the real domain).

**Nav:** Home · About · Services (Hair, Makeup) · FAQ · Portfolio · Blog · Terms & Conditions · **Get a Quote** (button)
**Footer:** Contact (067 925 3894 · info@lustiqueco.co.za) · Address (524 Peerboom St, Doornpoort, Pretoria) · Social (Facebook, **TikTok @lustique_co**, Instagram) · Privacy Policy · © 2025 Lustique Co.

**What's good (keep / refine):** clean serif headlines, the page-section rhythm, the FAQ accordion, the well-written quote form, the T&C + privacy (POPIA) pages, the newsletter lead-magnet idea.
**What to beat (Zandeline wants improved):** candy-pink gradients (vs the muted champagne/mocha quiet-luxury target), solo "I" voice (→ team-first "we"), placeholder celebrity quotes instead of real testimonials, and the under-use of her real photography. **Correction:** all photos on the current site are **Zandeline's own real work** (not stock/AI) — they're an asset to surface more boldly, not replace. The Wix API key (vaulted) lets us pull the real high-res originals.

**Brand name:** display as **"Lustique Co."** (her preference); full legal name "Lustique Cosmetology" reserved for sign-offs and SEO.

---

## Page copy (extracted)

### Home

- **Hero:** "The Lustique Bridal Experience" / *"Your wedding day is a once-in-a-lifetime moment—your beauty should reflect that."* → CTA "Contact Us"
  - *New direction:* hero becomes "Feel most like yourself" (or chosen tagline), team-first, real imagery, CTA → "Get your estimate."
- **Testimonials:** currently a **placeholder celebrity quote** (Bobbi Brown: *"I believe that all women are pretty without makeup—but with the right makeup, they can be pretty powerful."*) → replace with **real bride testimonials** (Google profile + video, coming within a month).
- **Services teaser:** "Flawless. Elegant. Unforgettable." → Bridal Hair + Bridal Makeup blurbs (good copy, keep & recast to "we").
  - *Bridal Hair:* "From romantic soft curls to chic updos, our expert stylists craft custom bridal hairstyles that complement your features, dress, and wedding theme…"
  - *Bridal Makeup:* "Enhance your natural beauty with a customized bridal makeup look… a look that lasts from 'I do' to the last dance."
- **About teaser:** see About below.
- **Coco Chanel quote:** *"Beauty begins the moment you decide to be yourself."* → keep as secondary tagline (Zandeline Q5).
- **Pricing teaser:** "Customised to your needs!" + link to packages PDF → replace with the firm pricing page + estimator.
- **Benefits ("Why choose us"):** Tailored Beauty Experience · Expertise You Can Trust (*"over a decade of industry experience"* — see C5) · Calm, Professional Atmosphere (*"we bring more than brushes—we bring peace of mind"* — lovely, keep).
- **Closing line:** *"Flawless hair and makeup aren't just a look—they're a feeling. One that starts with trust, attention to detail, and an unforgettable experience."* — strong, keep.
- **Promo:** "Book Hair & Makeup for 4+ → Get One FREE" (see C6).
- **Newsletter:** *"Receive A FREE Skincare Guide When You Sign Up to Our Newsletter."* → this is the lead magnet; wire to Brevo.

### About

> *About Lustique Cosmetology — Tailored hair and makeup services for the bride who wants to feel like the most radiant version of herself.*
>
> *At Lustique Cosmetology, we believe that beauty is more than just makeup and hairstyling—it's about enhancing confidence, celebrating individuality, and creating a flawless look that reflects you. [I have dedicated my career…  With 7+ years of experience…] *(← rewrite to team "we" + "since 2016", see C5)*
>
> *Our Approach — Every bride is unique, and so is her beauty. That's why we take a personalised and collaborative approach… From the moment you book your trial, we take the time to understand your style, preferences, and wedding vision to craft a look that feels effortlessly you.*
>
> *We focus on flawless application techniques, high-quality products, and long-lasting results… Whether you envision soft, romantic elegance, a timeless classic look, or bold, modern glam, [my team and I] have the expertise to bring your vision to life.*

→ Rewrite: team-first "we", "since 2016", add the explicitly-Christian founder voice (Zandeline's first-person story lives here), add the 9-artist team narrative.

### Services — Makeup ("Bridal Beauty, Perfected")

> *Explore our curated makeup crafted for brides who want to look and feel unforgettable. From soft-glam elegance to timeless updos, every detail is tailored to you — with quality, care, and a personal touch.*

**Makeup prices (lashes included\*):** Bridal **R850** · Bridesmaid **R550** · Mom **R500** · Guest **R550** · Event **R550**

### Services — Hair ("Crowning Beauty, One Style at a Time")

> *We create timeless, elegant hairstyles that feel as good as they look… From effortless waves to elegant bridal buns, our hair styling services are designed to elevate your natural beauty.*

**Hair prices** ( \* = Bridal · ^ = Bridesmaids/Moms/Guests/Events ):

| Length | Bridal\* | Others^ |
|---|---|---|
| Short (chin) | R495 | R395 |
| Medium (shoulder) | R595 | R495 |
| Long (bra) | R695 | R595 |
| X-Long (pantyline) | R795 | R695 |

*(Matches the PDF exactly. Note label wording: the form uses "Bra Length" for Long; Zandeline's Q16 defines Long as "below shoulder to mid-back." Use bride-friendly labels + a precise tooltip/diagram.)*

### FAQ (10 questions — all worth keeping, answers to be written/refined)

1. How far in advance should I book my hair and makeup for my wedding day?
2. Do you offer bridal trials and when should I schedule one?
3. What should I bring to my trial appointment?
4. Do I need to have a skincare routine before the wedding?
5. Do you travel to my venue on the wedding day?
6. How long will hair and makeup take on the wedding day?
7. Can you accommodate large bridal parties?
8. What kind of makeup products do you use?
9. What happens if I have sensitive skin or allergies?
10. Can I make changes to my look after the trial?

→ Add new ones from locked decisions: lead time (8–12 mo / 48-hr cutoff), the four provinces + destination weddings, how artist allocation works, deposit/payment, group lessons.

### Terms & Conditions (full text captured — see C2/C3/C4 conflicts)

Key clauses: 50% non-refundable booking fee *(conflict C2)*; balance due 14 business days before via EFT; trials by appointment at the studio, booked ≥1 month before; travel free within 15 km then R5/km round trip *(conflict C3)*; R1000/artist/night accommodation; cancellations within 14 business days billed in full; rescheduling subject to availability; artist-cancellation → replacement or full refund; etiquette/timeliness/conduct clauses; allergy disclosure; photography/portfolio use (with photographer credit). → Rewrite to match the **signed agreement** once C2 is resolved.

### Privacy Policy (POPIA-compliant — keep, light refresh)

Covers data collected, use, sharing, security/retention, POPIA rights, cookies, third-party links, updates, contact. Solid. Carry over, update studio address/branding.

---

## Quote form — full structure (existing, to refine into v2)

The existing form copy is **excellent** and on-brand — preserve the voice, restructure for the estimator. Sectioned flow:

**Intro:** *"Bridal beauty, tailored to you. We believe every bride deserves a look as unique as her story. Tell us about your day, and we'll send you a personalised quote to match your vision."*

**About you:** First name (*"the star of the show"*) · Last name (*"honour your journey"*) · Email · Mobile · Venue (*"where the magic will unfold"*) · Wedding date (*"reserve the date"*).

**Services needed** (multi-select, maps to component pricing): Bridal Makeup Trial · Bridal Hair Trial · Wedding-Day Makeup · Wedding-Day Hair · Bridesmaid Makeup/Hair · Mother of Bride Makeup/Hair · Mother of Groom Makeup/Hair · Flower Girl Makeup/Hair · Guest Makeup/Hair.

**Bride's hair length:** Short (chin) · Medium (shoulder) · Long (bra) · Extra Long (pantyline). Plus "describe your dream look" + file upload + hairstyle notes + file upload.

**Bridal party** (own section, lovely copy: *"Let's give your bridal party a moment to shine"*): # bridesmaids needing makeup (0–7) · # needing hair (0–7) · per-bridesmaid hair length · inspiration notes + file uploads.

**Mothers** (*"A moment for the mothers"*): # makeup (1–4) · # hair (1–4) · per-mother hair length · notes + uploads.

**Flower girls** (*"Little ones, big magic"*): age(s) under/over 12 · # makeup (0–4) · # hair (0–4) · per-girl hair length · notes + uploads.

**Guests** (*"Radiance, shared"*): # makeup (1–3) · per-guest hair length.

**Final details** (*"Let's fine-tune the timeline"*): checkboxes for surcharges — 100+ km & early start (R1000/n) · 1 assistant 5+ people (R850) · 2 assistants 9+ (R1700) · 3 assistants 13+ (R2550).

**Close:** *"Thank you for entrusting Lustique Co. with your special day. We are honoured to walk this journey with you. Before we proceed, kindly review our Terms and Conditions…"*

→ **v2 changes:** drive it from the estimator (pre-fill), keep this voice, remove the artist-preference idea (Lustique allocates), add "how did you hear about us", add WhatsApp opt-in, surface the live estimate as they fill, end with the "Blessings, The Lustique Cosmetology Team" thank-you + lead-magnet offer.

---

## Assets & accounts confirmed from this extraction

- **Phone:** 067 925 3894 · **Email:** info@lustiqueco.co.za
- **Address:** 524 Peerboom Street, Doornpoort, Pretoria *(pending C1)*
- **Socials:** Facebook /LustiqueCosmetology · Instagram @lustique_cosmetology · **TikTok @lustique_co** (new — add to build)
- **Existing lead magnet:** "Free Skincare Guide" newsletter signup → wire to Brevo
- **Packages PDF** currently hosted on Wix file storage → replace with on-site pricing + estimator

---

## Media audit (Wix library, pulled 1 Jun 2026 via API)

The Wix Media Manager holds 100+ images. **Zandeline confirms all are her own real work** (Pieter, 1 Jun). Two naming patterns exist:

- Photographer-named, high-res: `Zoë-*` (4160×6240), `Lumier-*`, `GC-*-web`, `LOWRES-*`, `Wedding-Sneak-Peek`, `MB-Wedding-*`, client WhatsApp photos.
- Oddly-named set: `-post-ai-image-####.png`, some carrying a `sourceUrl` of `im.runware.ai`. **Per Zandeline these are still her real work** — the filenames/metadata are just an artefact of whatever tool last touched them. *(Minor: worth a glance later to confirm none are mislabeled, but not a blocker — treat all as real and let Zandeline pick per-image in Sanity.)*

**Prototype currently uses 9 images** (hero = `Zoë-28`; service cards = `GC-498/Zoë-43/GC-497`; team collage = 4× `Lumier`; resources = `LOWRES-342`), resized via Wix's image CDN. **Image-to-section matching is preliminary** — chosen by aspect ratio, not content; Zandeline picks which shots represent Makeup vs Hair vs Party in the Sanity build.

## Still missing (for content phase)

- Real **bride testimonials** (Google profile harvest + video within a month) — currently celebrity-quote placeholders
- **9 artist bios + photos** (Zandeline writing, ~2 weeks) + Lustique IG portfolio highlights
- **Real portfolio photography** (curate from Instagram; current site uses stock/AI)
- **FAQ answers** (questions captured; answers to write)
- **Group-lesson + new-service page copy** (none exists yet)
