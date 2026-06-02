# Lustique Co. — Session Activation Prompt

Copy the block below into a new session to continue the build.

---

> We're building a website + platform for **Lustique Co.** — a Pretoria bridal hair & makeup studio (founder: Zandeline Kemp; 9 artists). I'm Pieter. Everything lives in:
> `/Users/pieter/Documents/Layer Zero Studios/Opus Project Folder/Lustique/`
>
> **Read the source-of-truth docs first, in this order:**
> 1. `PLAN.md` (+ §0 locked decisions) · `BRAND.md` · `PRICING.md` · `CONTENT.md` · `ARCHITECTURE.md` · `STANDARDS.md` · `SECURITY.md` · `SETUP.md` · `REVIEW.md` · `TODO.md`
> 2. `docs/superpowers/specs/2026-06-02-lustique-astro-port-design.md` — the **build design spec (v2)**: the staged plan (Pass 1 parity → 1.5 premium elevation → 2 Sanity → 3 Worker backend → 4 bride/admin/artist portal), the hybrid-palette decision, the one-shared-pricing-module principle.
> 3. `docs/superpowers/plans/2026-06-02-lustique-pass-1-astro-port.md` — the Pass-1 implementation plan.
> 4. The working `prototype/` (23 pages, regenerate with `node build.mjs`) — the **golden-master reference** the Astro port is diffed against.
>
> **Current state (handoff):**
> - **Pass 1 (Astro parity port) is COMPLETE + verified.** A production Astro app lives in `site/` (npm workspace) with a tested `shared/pricing` module. All **23 routes are byte-faithful to the prototype** (whitespace + void-element-normalized `<main>` diff, 23/23). `npm run build` builds it; `npm run dev` serves it on localhost:4321.
> - **The occasion-aware quote form is DONE + browser-verified** — picking a non-wedding occasion swaps the bridal-party fields for simple event/lessons fields, and pricing branches correctly (matric R750; group lesson 6 × R700 = R4200). Group-lesson R700/R600 tiers corrected. **10/10 pricing unit tests pass.**
> - **Pass 1.5 (premium elevation) is IN PROGRESS.** The **hybrid palette** is recalibrated (champagne pink → golden `#E8D5B7`, deeper charcoal, pricing band + footer → deep mocha, rose de-saturated but kept on buttons) — **Pieter still needs to eyeball it.** Remaining 1.5 slices: flatten the CSS gradients → solid tone-blocks + a whisper of film-grain (BRAND.md §10); re-art-direct the hero as a full-bleed magazine cover (§6A); the §6B motion system (image breathing, word-by-word headline reveal, Astro View Transitions, count-up estimate); real responsive `<img>` + blur-up (replacing the `background-image` divs). Body-level components (`Photo`, `PageHero`, `CtaBand`, `ServiceCard`) are staged but unused — Pass 1 used verbatim bodies; componentize during 1.5.
> - **Venue geocoding:** now leans on the **venue name first**, shows what it found, and nudges "drag the pin." Honest limit confirmed by probing: free Photon/OSM can't reliably resolve wedding venues (it fuzzy-matches to wrong same-named places). The **reliable fix is Google Maps Places autocomplete — a Pass-3 feature needing a Maps API key.** Decision pending: live with the free estimate + Places later, or pull the Maps key forward.
>
> **Git:** initialized. `main` holds the docs + prototype + spec + plan. **All build work is on branch `build/pass-1-astro-port`** (tag `pass-1-parity`), NOT yet merged. The prototype is untouched (the parity reference). To go live eventually, merge to main + do the Phase-1 accounts.
>
> **Operational gotchas (important):**
> - **`npm install` must be run in Pieter's own terminal** — the harness sandbox blocks/kills network installs. (Deps are already installed.)
> - **After changing the `shared/pricing` workspace package, restart `npm run dev`** (Ctrl+C, rerun) — Vite caches the pre-bundled dep; a browser refresh isn't enough.
> - Parity = a whitespace + void-element-normalized `<main>` diff vs `prototype/`. Pass 1.5 intentionally diverges (the quote page + palette already do).
> - **Pieter (with Zandeline) is the design judge** on the visual elevation — implement a tasteful direction, then get his eyeball and iterate.
>
> **Pending inputs / decisions:**
> - 🔐 **Rotate the Sanity API token** (it was exposed in a screenshot; "later" per Pieter). Sanity project "Lustique Co" + a Viewer token exist → Pass 2 ready. Secrets go in `site/.env` (gitignored; template in `site/.env.example`), never in repo/chat.
> - **Eyeball the hybrid palette** + tune tones.
> - **Geocoding decision** (free now + Google Places later, vs prioritize the Maps key).
> - Still missing: logo → `prototype/assets/logo.png` + `site/public/assets/logo.png`, real Google reviews, 9 artist bios + photos, confirmed new-service prices, the legal redraft.
> - **Deferred accounts — do NOT assume done; ask:** GoDaddy, Cloudflare, Google Workspace. (AXIS Supabase is resource-exhausted — a separate, parked issue.)
>
> **Likely next step (confirm with me first):** continue **Pass 1.5 elevation** (gradients → tone-blocks, magazine hero, motion, real images), iterating against my eyeball — OR your recommended move.
>
> **How I work:** explain reasoning, stay honest about what needs accounts vs not, confirm big decisions, don't rebuild what's done — extend it, and verify changes (build/test/browser) before claiming done. Pick up from here.

---

*One-liner: "Read everything in `/Users/pieter/Documents/Layer Zero Studios/Opus Project Folder/Lustique/` (PLAN.md → ACTIVATION.md → the spec + plan under docs/superpowers/) and continue the Lustique build. Pass 1 is done; Pass 1.5 elevation is in progress on branch `build/pass-1-astro-port`."*
