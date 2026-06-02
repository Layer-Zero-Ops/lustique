# Lustique Co. — Readiness Standards (Definition of Done)

**Purpose:** the bar the website + platform must reach before it is "ready for use." Nothing launches until each section passes. Each item is checkable. Status: ☐ not yet · ◑ partial · ✅ met.

**Owner of sign-off:** Pieter (technical) + Zandeline (brand/content).

---

## 1. Brand & design
- ✅ Muted "quiet-luxury" palette (champagne/blush/ivory/mocha), Cormorant + Manrope, generous space.
- ✅ Real logo in header + favicon; consistent across all pages.
- ✅ Real photography only (no stock/AI presented as real work); photographer credits where shown.
- ☐ Sells the brand within 5 seconds of landing (the "not bland" test) — confirmed by Zandeline on the live build.

## 2. Content & voice
- ✅ Voice = warm, elegant, second-person, faith-aware where natural; "we" (team-first).
- ☐ Every page proofread; no placeholder/sample copy remains live.
- ☐ Real testimonials (text + video) in place of samples.
- ☐ 9 artist bios + photos live.
- ☐ Legal docs (Terms, Privacy) reviewed + approved by Zandeline (and ideally a legal professional).
- ✅ Only true claims (since 2018, 40+ years combined, 9 artists).

## 3. UX & usability
- ✅ Clear nav; every page reachable; active states; back-to-top.
- ☐ Tested on real phones (iOS Safari + Android Chrome), not just desktop.
- ✅ Estimator works + is honest; quote → approve → invoice flow is clear.
- ☐ No dead ends; every CTA leads somewhere sensible.

## 4. Accessibility — WCAG 2.1 AA
- ✅ Skip-link, `<main>`, visible focus styles, `prefers-reduced-motion`.
- ✅ Descriptive `alt` on portfolio images.
- ☐ Colour contrast AA verified on all text (incl. on rose/mocha bands).
- ☐ Full keyboard pass (forms, map, accordion, slideshow); screen-reader spot-check.
- ☐ Form fields have associated labels + error messaging.

## 5. Performance — Core Web Vitals
- ☐ Lighthouse ≥ 90 (Performance, SEO, Best Practices, Accessibility) on mobile.
- ☐ LCP < 2.5s, CLS < 0.1, INP < 200ms on 4G.
- ☐ Images responsive + lazy (Sanity/Cloudflare CDN, AVIF/WebP, width/height set).
- ☐ Fonts preloaded/subset; total homepage weight reasonable.

## 6. SEO (technical + on-page + local)
- ✅ Per-page titles + meta descriptions; canonical URLs; sitemap.xml; robots.txt.
- ✅ Structured data: LocalBusiness + FAQPage (extend: Service, BreadcrumbList, AggregateRating once reviews live).
- ✅ OG + Twitter cards.
- ☐ Google Search Console verified; sitemap submitted; no crawl errors.
- ☐ Google Business Profile claimed + optimised (correct La Montagne address, categories, photos, reviews).
- ☐ Afrikaans keyword capture in meta/alt where natural.
- ☐ 301 redirects mapped from old Wix URLs (preserve ranking).

## 7. Inbound marketing engine (pull traffic in)
- ◑ Blog/Journal live with a publishing cadence (agent-assisted — see §13).
- ✅ Lead magnets (free guides) gated by email → feed the list.
- ☐ Internal linking + topic clusters (bridal prep, venues, timelines).
- ☐ Local + venue-area landing content ("bridal makeup [town]").
- ☐ Backlinks: photographer partners, Wedding Guide feature, SA bridal directories.

## 8. Outbound marketing engine (reach out + nurture)
- ☐ Brevo connected + domain-authenticated (SPF/DKIM/DMARC).
- ☐ Nurture flows live: lead (6 emails), booked-bride, past-bride/anniversary.
- ☐ Newsletter capture wired to Brevo with consent.
- ☐ Social posting cadence (IG/FB/TikTok) + shareable OG cards.
- ☐ (Optional) retargeting-ready pixels behind consent.

## 9. Conversion (CRO)
- ☐ Funnel measured: estimator → form → quote → approve → booked.
- ✅ Transparent pricing + instant estimator (the core lever).
- ✅ Trust signals: real work, team stats, testimonials slot, clear process.
- ☐ Target: enquiry→booking trending toward 8–12% (from 3–5%).

## 10. Analytics & measurement
- ☐ GA4 live (behind consent) with custom events (estimator_started/completed, quote_form_submitted, whatsapp_click, guide_download).
- ☐ Cloudflare Web Analytics (cookieless) as backup.
- ☐ A simple dashboard Zandeline/Pieter can read weekly.

## 11. Security & privacy (POPIA) — see SECURITY.md
- ✅ Honeypot; no client-side secrets; HTTPS-ready static build.
- ☐ Turnstile + rate limiting + server-side validation on the form.
- ☐ Security headers (CSP etc.); SPF/DKIM/DMARC; 2FA on all accounts.
- ✅ Privacy/cookie policy + consent banner; image consent practice confirmed.
- ☐ Signed/expiring quote-approval links; CRM access controlled.

## 12. CMS / maintainability — Zandeline can run it herself
- ☐ Sanity Studio live; Zandeline can, unaided: swap any photo, edit any text, reorder/add/remove sections, manage galleries, team, testimonials, **promotions**, pricing, FAQ, and **publish blog posts**.
- ☐ A one-page "how to update your site" guide for Zandeline.
- ☐ Design guardrails hold — she cannot break the layout/brand.
- ☐ Edits go live within ~1 minute (webhook → rebuild).

## 13. Agents (content automation, with approval gates)
- ☐ **Blog-draft agent**: researches topics + drafts SEO posts in the brand voice → saves to Sanity as **Draft** → Zandeline reviews/edits → **she approves to publish**. Never auto-publishes.
- ☐ Human-in-the-loop on anything public-facing or money-related.
- ☐ Agents log their actions; scoped credentials; do not conflict with AXIS (they sit alongside / under it — see ARCHITECTURE.md).

## 14. Integrations (external app stack)
- ☐ Google Workspace: Gmail (send), Calendar (availability), Drive (docs), Sheets (CRM), Contacts.
- ☐ Brevo (email marketing).
- ☐ Zandeline's other business apps catalogued + integration plan agreed (list needed — see ARCHITECTURE.md).
- ☐ Clean Worker API boundary so new apps + AXIS plug in without a rewrite.

## 15. Reliability & ownership
- ☐ Backups: content (Sanity export), CRM (Sheets export), image originals, domain auto-renew.
- ☐ Uptime + form-error monitoring with alerts.
- ☐ Documented owner for content, pricing review (annual), and incident response.

## 16. Legal & compliance
- ☐ Terms/Service Agreement + Privacy/Cookie reviewed + published.
- ☐ POPIA consent + data-subject request path.
- ☐ Photographer usage rights + bride image consent on file.

---

### Launch gate
**"Ready for use" = every ✅/☐ in §1–§6, §11, §12, §16 is ✅** (the must-haves), with §7–§10, §13–§15 at least ◑ and on a clear path. Pieter + Zandeline both sign off.
