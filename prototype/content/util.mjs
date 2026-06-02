// Shared markup helpers used by build.mjs and every content module.
export const photo = (src, cls = "") => `<div class="ph img ${cls}" style="background-image:url('assets/${src}')"></div>`;

export const pageHero = (eyebrow, title, sub) => `
  <section class="page-hero">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    ${sub ? `<p>${sub}</p>` : ""}
  </section>`;

export const ctaBand = `
  <section class="section cta-band">
    <div class="wrap">
      <span class="eyebrow reveal">Let’s begin</span>
      <h2 class="reveal d1" style="margin-top:1rem;">Tell us about your day.</h2>
      <p class="reveal d2">Share a few details and we’ll send a personalised quote — usually within 24 hours, often sooner.</p>
      <a class="btn btn-primary reveal d2" href="quote.html">Get a Quote</a>
    </div>
  </section>`;

// A simple prose-page wrapper for legal / long-form content.
export const prose = (body) => `<section class="section"><div class="wrap prose">${body}</div></section>`;
