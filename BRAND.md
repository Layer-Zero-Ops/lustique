# Lustique Cosmetology — Brand System

**Status:** Draft v1 — awaiting Zandeline's reaction
**Last updated:** 2026-05-27
**Source of truth:** This file is canonical for every design and copy decision during the build.

---

## 1. The brief (Zandeline's words, verbatim)

> Lustique Cosmetology's website should feel like stepping into a quiet, luxurious dressing room — warm, soft, and unhurried. Think muted tones (champagne, blush, ivory, deep mocha), editorial-style imagery, generous white space, and elegant serif typography. The experience should feel personal and curated, never corporate or clinical. Every word and image should whisper confidence and trust — this is the artist a bride chooses when she wants to feel most like herself.

## 2. The three pillars

Combining her three keywords with this brief:

- **Elegant** — restraint. The site does *less*, on purpose. Whitespace, classical serif, no gradient tricks.
- **Intimate** — close. Faces shown half-lit, hands at work, sentences in second person. The bride is *the only person in the room*.
- **Transformative** — quietly. The "before" is the bride at her own kitchen table; the "after" is her looking exactly like herself, just unmistakably right. We never show the transformation as dramatic — we show it as inevitable.

The central rule: **whisper, don't shout.** Every component, every sentence, every image is judged against this. If it raises its voice, it doesn't belong on Lustique's site.

---

## 3. Colour palette

Five primary tones. Hex values are proposals — Zandeline to react.

| Role | Name | Hex | Where it lives |
|---|---|---|---|
| Primary background | **Ivory** | `#FAF6F0` | Page backgrounds — the canvas. Warm enough never to feel clinical. |
| Secondary background | **Champagne** | `#E8D5B7` | Section dividers, soft cards, alternating panels. |
| Accent | **Blush** | `#EFD2C5` | Hover states, subtle gradient overlays, accent borders. Used sparingly. |
| Brand mark / headlines | **Deep Mocha** | `#5C4332` | Display type, accent borders, signature elements. Replaces black for warmth. |
| Body text | **Charcoal** | `#3A2E26` | Long-form body where readability matters. Never pure `#000`. |
| White (reserved) | **White** | `#FFFFFF` | Used sparingly — only for elevated cards or sharp UI contrast. |

**Reserved:** The logo's existing burgundy `#7A2E3A`. **Open question** — see §9. Default plan: keep the logo as-is and use burgundy *only* as an accent on brand-mark elements (footer signature, favicon, the occasional flourish), not as a UI color.

**Accessibility:** Deep Mocha on Ivory passes WCAG AAA for normal text (~9:1 contrast). Charcoal on Ivory exceeds AAA.

**Usage discipline:**
- 60% Ivory · 20% Champagne · 10% Mocha · 5% Blush · 5% White
- No more than two background tones in a single section
- No saturated reds or vivid pinks anywhere

---

## 4. Typography

### Primary recommendation

| Use | Family | Why |
|---|---|---|
| **Display / headlines** | Cormorant Garamond | High-contrast classical serif. Light weight reads as "whispered." Free on Google Fonts. |
| **Body** | Manrope | Humanist sans-serif — warm, not technical. Excellent at body sizes. Pairs cleanly with Cormorant. |
| **Pull-quotes / accent** | Cormorant Garamond Italic | Same family, italicised. No third typeface needed. |

### Type scale (desktop)

```
H1 (Cormorant Garamond Light, 64px / 1.1)
H2 (Cormorant Garamond Regular, 40px / 1.2)
H3 (Cormorant Garamond Regular, 28px / 1.3)
Pull-quote (Cormorant Italic, 22px / 1.5)
Body-lg (Manrope Regular, 18px / 1.6)
Body (Manrope Regular, 16px / 1.6)
Caption (Manrope Medium 13px, uppercase, +1px tracking)
Button (Manrope Medium 14px, uppercase, +1.5px tracking)
```

Mobile: scale display sizes down by ~30%, body remains 16px.

### Alternative pairings (if she wants different)

- **EB Garamond + Lato** — more traditional, less editorial
- **Tenor Sans + Inter** — cleaner, more minimal, less classical

### What we will *not* use

- Script fonts on the website (Allura, Great Vibes, etc.) — they fight the "quiet" direction. The "with love & glam" script feel lives on email sign-offs, not the site.
- Heavy display serifs (DM Serif Display, Abril) — too loud.
- Inter alone as body — feels too tech.

---

## 5. Photography & imagery

"Editorial-style" means deliberate composition and magazine-quality intention, not literal magazine spreads. The visual rule mirrors the voice rule: whisper, don't shout.

### YES — what belongs on the site

- Close-up portraits, soft natural light, gaze *not* at camera
- Hands working: a brush moving across a cheek, fastening an earring, adjusting a veil
- Half-face and profile shots with negative space
- Texture-led — skin, fabric, hair, jewellery on velvet
- Eyes closed, looking down, candid laughter
- Behind-the-scenes — artist's hand on the bride's jawline
- Detail shots — lashes mid-application, lipstick at the edge of a lip
- Black & white sparingly (high impact)
- Warm colour grade — golden-hour-adjacent, never cold or blue

### NO — what stays on Instagram, not the site

- Smiling-at-camera group shots as heroes
- Bridal-party-of-eight lineups in landing positions
- Overlit, harsh ring-light beauty look
- Heavy contouring or strong "Instagram filter" style
- Crowded compositions (more than 3 faces per frame)
- Saturated reds, vivid pinks, neon anything
- Stock photography
- Posed full-length wedding portraits (those live in the photographer's portfolio, not ours)

### Curation rule (for v1, before any new shoot)

- 60% editorial-feel portraits (close-up, soft light)
- 30% candid moments (in-progress, behind-the-scenes)
- 10% team-in-action (multiple artists working in frame)

We'll curate from Instagram first. If the editorial-feel quota can't be hit from existing posts, we shoot a half-day with the team before launch — see §9 open questions.

---

## 6. Layout & spacing

"Generous white space" is doing real work here. Concrete rules:

- **Max content width:** 1100px on desktop. Narrower feels more curated. Not 1280 or 1440.
- **Section vertical padding:** 96–120px desktop, 56–72px mobile.
- **Spacing scale:** `8 / 12 / 16 / 24 / 32 / 48 / 72 / 96 / 144` px.
- **Hero takes 85–95vh** on landing — the bride pauses before scrolling.
- **One focus per section.** One image, one statement, one CTA. Sections that try to say three things get split.
- **Edge-to-edge content is rare.** Backgrounds breathe; content sits in a measured column.
- **Subtle scroll-linked fades** on images (not parallax — parallax is dated).
- **No carousels** on the homepage. Carousels say "please look at the third slide" — the bride won't.

### Visual rhythm

Pages should *breathe*. Long pages with intentional rests, not packed conversion-funnel walls. Each section asks the bride to slow down, not speed up. This is the opposite of e-commerce; treat the site closer to a print editorial.

---

## 6A. Quiet ≠ bland — the richness mandate (Pieter, 1 Jun 2026)

**Non-negotiable:** the site must *sell the brand the instant the domain opens.* It must look like a professional designed it for a high-end bridal artist — never like a generic template. "Quiet luxury" is the *opposite* of bland; the two are easy to confuse and we must not.

The distinction, made explicit so we never build something sparse and call it "elegant":

| Quiet luxury (YES) | Bland / empty (NO) |
|---|---|
| Restraint in **noise** — few colours, few fonts, no clutter | Restraint in **substance** — empty space with nothing to look at |
| **Rich** materials: big, art-directed photography filling the frame | Small stock images floating in white voids |
| Large, confident type at editorial scale | Timid, default-size text |
| Layered warm tones, depth, considered shadows | Flat white Bootstrap default |
| Motion that feels expensive | Static, lifeless, or janky |

**Where the richness comes from:** photography (full-bleed, immersive), scale (oversized headlines, generous imagery), layered tone (ivory→champagne→mocha depth), and smooth motion. The page is *uncluttered but never empty*. Every screen has something beautiful to rest on.

**The 5-second test:** within 5 seconds of landing, an unprimed visitor should feel "this is a premium, trustworthy, beautiful bridal artist" — before reading a word. The hero alone must carry that. We art-direct the hero like a magazine cover, not a header.

---

## 6B. Motion & animation (Pieter, 1 Jun 2026)

Smooth, fluid motion is wanted — to add elegance and a premium feel. The rule mirrors the voice rule: **motion whispers.** It supports the content; it never performs for its own sake.

### The motion vocabulary (what we use)

- **Reveal on scroll** — content fades up + gently rises (translateY ~16–24px) as it enters view. The signature move. Staggered slightly for groups.
- **Slow image "breathing"** — a very slow scale (1.0→1.05 over 8–12s) or subtle parallax on hero/feature images. Adds life without distraction. *Not* aggressive parallax (dated, janky).
- **Hover lift** — cards/images rise a few px with a soft shadow and a slow image zoom-in on hover. Tactile, premium.
- **Elegant section transitions** — soft cross-fades between sections/routes; never hard cuts.
- **Hero text reveal** — the headline arrives in a measured, eased fade (optionally word-by-word) on load. This is the "curtain rising" moment.
- **Gallery** — smooth lightbox open, eased; images load with a gentle blur-up (low-res → full).

### The physics (so it feels expensive, not cheap)

- **Slow + eased.** Durations 400–800ms for reveals, longer for ambient image motion. Easing `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo-ish) — decisive start, soft landing. Nothing linear, nothing bouncy.
- **Subtle.** Small distances, low opacity deltas. The bride should *feel* polish more than *notice* animation.
- **GPU-only properties** — animate `transform` and `opacity` only. Never animate layout properties (width/top/margin) — that's what makes sites stutter.
- **One thing at a time per viewport.** Avoid everything moving at once; choreograph.

### Performance & accessibility (mandatory)

- **Respect `prefers-reduced-motion`** — users who request reduced motion get instant, static content (fades at most). This is both an accessibility requirement and an empathy one (some brides get motion-sick).
- Motion must **never delay** the bride reading or acting — content is usable before animations finish; reveals trigger early enough that nothing important is hidden.
- Keep it **60fps**. If a motion can't hold frame-rate on a mid-range phone, it's cut. Library lean: CSS + the Intersection Observer for reveals; a small library (e.g. Motion One / GSAP) only if a specific effect needs it.

---

## 7. Voice principles

**The central rule: whisper, don't shout.**

### Seven voice rules

1. **Lead with the bride, not the brand.** *"Your morning. Held quietly."* — not *"We provide premium services."*
2. **Specific over abstract.** *"The chair in our La Montagne studio."* — not *"a luxurious studio environment."*
3. **One sentence per idea.** No stacked clauses.
4. **Active voice, always.**
5. **Cut every adjective you can.** "Elegant," "luxurious," "premium," "exclusive," "beautiful" — overuse hollows them out. Use sparingly, never two in a row.
6. **No corporate verbs.** Banish *leverage, facilitate, deliver, provide, utilize*. Use *make, show, do, send, bring*.
7. **Sentences instead of headlines.** *"Tell me about your day"* instead of *"Quote Form"*.

### Yes / no copy samples

| ✕ Off-brand | ✓ On-brand |
|---|---|
| Submit your details and our team will respond shortly with a customized quote tailored to your specific needs. | Tell us about your day. We'll write back within 24 hours, often sooner. |
| Award-winning, premium bridal hair and makeup services with over 9 years of industry experience. | The artist a bride chooses when she wants to feel most like herself. |
| Our team of professionals are here to serve you on your special day. | Nine artists. One quiet morning at a time. |
| Book Now! Limited availability — secure your date today! | Some dates are already taken. We'll let you know yours when you ask. |

### Existing voice samples to carry forward

From the existing pricing PDF and indexed site copy:

- *"Beauty begins the moment you decide to be yourself."* — keep as a secondary tagline (Zandeline Q5: keep it somewhere)
- *"Personalised — designed to highlight your inner beauty and allow it to shine through effortlessly."* — keep the sentiment, recast as "we"
- *"Soft, elegant, and timeless"* — already on the indexed site and exactly on-brand; carry forward for SEO continuity

---

### Locked voice decisions (Zandeline, 1 June 2026)

**Person — "we" from day one.** The site speaks as the team everywhere except the founder story, which stays in Zandeline's first-person voice (Q2). No "I" elsewhere.

**No tier language.** Never "main artist" or "assistant" when describing the team — all nine are presented as equal artists, every one bridal-specialised (Q11, Q12). The word "assistant" only appears as a *booking-day role* ("a second artist joins for larger parties"), never as an artist rank.

**Faith — explicitly Christian (Q8).** This is genuine and unashamed, placed where it reads as warmth, not as a filter:
- *Faith-forward:* the founder story, the values/about section, email sign-offs, the occasional tasteful scripture or faith-aware line ("we count it a blessing to be part of your day").
- *Faith-neutral:* services, pricing, portfolio, the estimator and quote form — where a bride of any background is simply evaluating the work. Faith never gatekeeps a booking.
- Tone stays quiet and elegant. No heavy-handed preaching; the faith is present the way it is in a warm, well-kept home.

**Sign-off (Q6):** **"Blessings, The Lustique Cosmetology Team"** — on nurture emails and form thank-you screens. (Retires the old "With love & glam.")

**Language (Q9):** **English only.** No Afrikaans toggle. *SEO note:* a large share of Pretoria brides still search in Afrikaans ("bruidsgrimering Pretoria", "trou grimering"). We don't translate the site, but we can capture some of that traffic with a few Afrikaans terms in meta tags / alt text / one FAQ answer. Flagged for the SEO pass — content stays English.

**SEO-friendly wording (Q7):** No banned words. Lean on the real, discoverable language of the business — "bridal hair and makeup", "Pretoria", "Gauteng", venue and town names, "on-location", "wedding day". Write naturally but with search intent in mind.

### How the bride should *feel* (Zandeline Q10)

The emotional target for the whole site experience — every page is judged against these four:

1. **Calm** — the unhurried pace, the whitespace, the reassurance that she's in safe hands.
2. **Excited** — the quiet thrill of her day coming into focus.
3. **Enchanted** — a touch of romance and beauty; the site should feel a little magical.
4. **Convinced** — by the end, she believes Lustique is *the right bridal beauty supplier for her*. This is the conversion feeling — proof, warmth, and clarity stacked until the choice feels obvious.

### Positioning line (Zandeline Q3)

**"Premium at an accessible price."** Not the cheapest, not the most expensive — the quality of a premium studio at a price a real Pretoria bride can say yes to. Copy should convey *value and care*, never *discount*. We never use the word "cheap" or "affordable" as a headline; we let transparent pricing + visible quality make the value case.

### The brides we gently filter out (Zandeline Q4)

Not our bride: the price-shopper who compares quotes without valuing quality; the micromanager; the one who books too late and expects miracles; the one whose wedding style doesn't match our aesthetic. Copy filters these *gently and positively* — by signalling who we ARE for, never by scolding. Examples:
- Lead time framing: *"We're at our best with a little time — most brides book 8 to 12 months ahead."* (filters last-minute-miracle seekers without rejecting them)
- Value framing: *"For brides who care how the morning feels, not only what it costs."* (filters pure price-shoppers)
- Aesthetic framing: a strong, specific visual identity self-selects the right style match.

### Brand facts (true — use freely, these are the trust anchors)

- **Display name:** **Lustique Co.** (Zandeline's preference). Full name "Lustique Cosmetology" for sign-offs, legal pages, and SEO.
- **Founded / founder experience:** Zandeline has been doing makeup **since 2018** (her first makeup course). *(Supersedes earlier "2016 / 7+ years / over a decade" — all retired.)*
- **The headline team stat:** *"Together, our nine artists bring over 40 years of combined experience."* — this is the single strongest trust line for the team-first positioning. Lead with it.
- **Photography:** every image is **Zandeline's / the team's real work** — never stock, never AI. This authenticity is a selling point; say so where natural ("every face on this page is a real Lustique bride").
- **Studio:** 242 Frangipani Street, La Montagne, Pretoria.
- **Faith line example** (for the founder story): genuine, warm, unforced — e.g. *"We count it a blessing to play a small part in your day."*

---

## 8. Tagline candidates

Pulled directly from Zandeline's brief plus existing material:

1. **"Feel most like yourself."** *(my primary recommendation — short, ownable, ties to her exact words)*
2. **"The artist a bride chooses when she wants to feel most like herself."** *(use as longer about/values headline)*
3. **"Beauty begins the moment you decide to be yourself."** *(existing Coco Chanel quote — works as a secondary)*
4. "Quietly transformative."
5. "Soft. Warm. Unhurried."

Recommended pairing on the site:

- Hero on homepage: **"Feel most like yourself."**
- About page intro: **"The artist a bride chooses when she wants to feel most like herself."**

---

## 9. Open questions for Zandeline

These are the three reactions I need before locking the brand system.

1. **Logo reconciliation.** The existing logo's burgundy `#7A2E3A` is more saturated than the muted-mocha-and-champagne palette. Three options:
   - **(a) Keep logo as-is, use burgundy as a small accent only** (favicon, footer signature). Preserves brand recognition. *My default recommendation.*
   - **(b) Soften the logo to mocha-rose tones to match.** Small redraw, but everything aligns.
   - **(c) Keep burgundy as a deliberate anchor color** throughout the site (less "quiet," more "confident").

2. **Photography reality check.** Curating editorial-feel shots from Instagram will get us ~60% there. The remaining ~30% (deliberate close-ups, hands-at-work, texture details) may need a planned half-day team shoot. Three options:
   - **(a) Curate what we have for launch, shoot deliberately later.**
   - **(b) Half-day team shoot before launch** — invest now, get the full editorial mood from day one.
   - **(c) Hybrid** — curate now, shoot just 5–8 key hero/editorial frames before launch.

3. **Tagline pick — partially resolved.** The Coco Chanel line *"Beauty begins the moment you decide to be yourself"* is now **locked as a secondary tagline** (Zandeline Q5 — keep it somewhere; it'll live on the About/founder story). Still need her pick for the **hero line**:
   - **(a) "Feel most like yourself."** *(my recommendation — short, ownable, pairs cleanly with the Coco Chanel line below it on About)*
   - **(b) "The artist a bride chooses when she wants to feel most like herself."** *(longer, more romantic)*
   - **(c) Something else** — Zandeline writes her own and we shape it.

---

## 10. Yes / no design references

(For mood-anchoring, not direct copying.)

**YES — the hush we want**
- The whitespace discipline of *The Row* brand pages
- *Aesop*'s site — restraint, type, breathing room
- *Sézane*'s quieter editorial pages
- *Kinfolk* magazine's compositional discipline
- Anna Campbell (AU bridal) homepage moods
- Some BHLDN editorial spreads

**NO — the energy we avoid**
- Glam-squad bright-light Instagram aesthetic
- Wedding industry rose-gold-sparkle overload
- Heavy gradient or glassmorphism trends
- "Modern Bootstrap template" generic feel
- Conversion-page urgency ("ENDS TONIGHT")
- Anything that competes with the bride's attention

---

## 11. What this means practically when we build

- The CSS variables file will contain only the 6 colors above. No others get introduced.
- The Google Fonts import contains only Cormorant Garamond + Manrope, subset to Latin-Ext (covers English + Afrikaans).
- Every image upload gets reviewed against the YES/NO photography list before it goes live.
- Every paragraph of copy is judged against the seven voice rules before it ships.
- We resist every temptation to add "one more accent" or "a small flourish." Those are how quiet sites become loud.
