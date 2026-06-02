// DEV-ONLY one-shot generator: lifts each prototype page's <main> verbatim into
// an Astro page wrapped in BaseLayout. Run from the Lustique root: `node gen-pages.mjs`.
// Title/description are extracted from the prototype's own <head> — no transcription.
// Pass 1 = byte-faithful parity; body-level componentization is a Pass-1.5 cleanup.
import { readFileSync, writeFileSync } from "node:fs";

const SLUGS = [
  "index", "about", "services", "team", "pricing", "portfolio", "faq", "guides",
  "contact", "quote", "terms", "privacy", "guide-skin-prep", "guide-timeline",
  "guide-artist", "your-quote", "invoice", "thank-you", "blog",
  "blog-choosing-artist", "blog-bridal-trial", "blog-2026-trends", "404",
];

for (const slug of SLUGS) {
  const html = readFileSync(`prototype/${slug}.html`, "utf8");
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  if (!main) { console.log("NO <main>, skipping:", slug); continue; }
  const inner = main[1];
  // Astro treats `{` / `}` in template content as expression delimiters — a literal
  // brace in body HTML would break the build. None expected; guard anyway.
  if (/[{}]/.test(inner)) { console.log("BRACES present, skipping (handle manually):", slug); continue; }
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1];
  const desc = (html.match(/name="description" content="([^"]*)"/) || [, ""])[1];
  const out = `---
import BaseLayout from "../layouts/BaseLayout.astro";
const title = ${JSON.stringify(title)};
const desc = ${JSON.stringify(desc)};
---
<BaseLayout slug=${JSON.stringify(slug + ".html")} title={title} desc={desc}>${inner}</BaseLayout>
`;
  writeFileSync(`site/src/pages/${slug}.astro`, out);
  console.log("wrote", slug);
}
