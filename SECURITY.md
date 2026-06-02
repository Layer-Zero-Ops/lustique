# Lustique Co. — Security & Safety

**Status:** Plan v1 — 2026-06-01
**Goal:** a site that's safe for brides' personal data, resistant to abuse, and POPIA-compliant. Legend: ✅ done in prototype · �ⁿ wired in Phase-1/live build.

---

## 1. Transport & hosting
- ✅ **HTTPS everywhere** (Cloudflare Pages auto-TLS; HTTP→HTTPS upgrade).
- �ⁿ **HSTS** + Cloudflare **"Full (strict)"** TLS mode.
- �ⁿ Cloudflare **WAF + DDoS protection** (free tier) in front of the site + Worker.
- �ⁿ Security headers: **Content-Security-Policy**, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options/frame-ancestors`, `Permissions-Policy` (set at the Worker/Pages edge).

## 2. The quote form (highest-risk surface)
- ✅ **Honeypot field** (`hp_company`, hidden) — bots fill it; the Worker silently drops those submissions.
- �ⁿ **Cloudflare Turnstile** (free, privacy-friendly CAPTCHA) — invisible bot challenge, no annoying puzzles.
- �ⁿ **Rate limiting** at the Worker (per-IP) to stop floods.
- �ⁿ **Server-side validation + sanitisation** of every field (types, lengths, allow-lists for dropdowns) — never trust client input.
- �ⁿ **No secrets client-side** — geocoding/routing/pricing that must stay private move server-side; the public estimator only exposes prices that are already public.

## 3. Secrets & credentials
- ✅ **Pattern already in use:** the Wix key lives in the Supabase vault; we read it server-side, never echo it, never commit it.
- �ⁿ Google **service-account JSON**, Brevo API key, GA4, payment keys → **Cloudflare Worker secrets / vault** only. Never in the repo, never in client JS.
- �ⁿ **Least-privilege scopes** on the Google service account (only Calendar free/busy, Sheets, Gmail-send, Drive — nothing more).
- �ⁿ `.gitignore` covers all key files; pre-commit secret scan.

## 4. POPIA (SA data-protection law) — this is mandatory
- ✅ **Privacy policy** page exists (POPIA-aware) — to be refreshed with the correct studio details.
- �ⁿ **Cookie/consent banner** before any analytics (GA4) or marketing cookies fire; "reject" must be honoured.
- �ⁿ **Lawful basis + consent** captured on the form (a checkbox to be contacted + marketing opt-in separate from the enquiry).
- ✅ **Image consent** — Pieter confirms permission is always obtained before using bride/client images (keep records; credit photographers).
- �ⁿ **Data-subject rights**: a documented way for a bride to request access/deletion of her data.
- �ⁿ **Data minimisation + retention**: only collect what the quote needs; define how long leads are kept.

## 5. The CRM, quotes & invoices
- �ⁿ **Access control** on the Google Sheet/CRM (Workspace accounts only; least privilege; no public links).
- �ⁿ **Quote Approve/Reject links** use a **signed, single-purpose token** (not guessable IDs) so only the recipient can act, and links **expire**.
- �ⁿ **Invoices**: stored in Drive with restricted access; PII (names, dates, venues) handled under POPIA; payment handled by a PCI-compliant processor (PayFast/Yoco) — **we never store card data**.

## 6. Email deliverability & anti-spoofing
- �ⁿ **SPF + DKIM + DMARC** for `lustiqueco.co.za` (merged SPF for Google + Brevo — see SETUP.md) so quotes/invoices don't spoof or land in spam, and nobody can spoof the brand.

## 7. App & dependency hygiene
- �ⁿ **Astro static output** = tiny attack surface (no server-rendered app to exploit; the only dynamic piece is the Worker).
- �ⁿ **Sanity CMS**: role-based access; Zandeline's editor account is separate from any admin; 2FA on Google/Sanity/Cloudflare.
- �ⁿ **Dependency scanning** (Dependabot/`npm audit`) + pinned versions; minimal third-party scripts.
- �ⁿ **Subresource Integrity** or self-hosting for any CDN scripts (e.g. the map library) in production.

## 8. Availability, backups & monitoring
- �ⁿ **Backups**: CRM (Sheets) export schedule; Sanity content export; image originals backed up; domain auto-renew.
- �ⁿ **Monitoring**: uptime check on the site + Worker; alert on form-handler errors; GA4 + Cloudflare analytics for anomalies.
- �ⁿ **2FA** on every critical account (Cloudflare, Google Workspace, Sanity, Brevo, GoDaddy until transfer).

## 9. AXIS (when added)
- �ⁿ AXIS gets its **own scoped credentials**, not the site's.
- �ⁿ All AXIS actions (quotes, invoices, bookings) are **logged/audit-trailed**.
- �ⁿ A human-approval gate on money-movement actions until trust is established (no autonomous invoicing/refunds on day one).

---

### Done now (prototype)
Honeypot field, HTTPS-ready static build, no client-side secrets, privacy policy page, image-consent practice confirmed.

### The rest unlocks with Phase-1 accounts
Turnstile, rate limiting, server validation, security headers, SPF/DKIM/DMARC, consent banner, signed quote tokens, access control, backups, 2FA. **None are hard — they're standard, and the architecture already assumes them.**
