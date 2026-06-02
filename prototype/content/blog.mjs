import { pageHero, prose, ctaBand } from "./util.mjs";

const POSTS = [
  { slug: "blog-choosing-artist.html", title: "How to Choose a Bridal Makeup Artist in Pretoria", excerpt: "Five things that separate a great bridal artist from a risky booking — and the questions to ask before you pay a deposit." },
  { slug: "blog-bridal-trial.html", title: "What to Expect at Your Bridal Trial", excerpt: "Your trial is the most important appointment before the wedding. Here’s how to get the most from it." },
  { slug: "blog-2026-trends.html", title: "Bridal Beauty for 2026 & 2027: Soft, Timeless, You", excerpt: "Why the most-loved looks right now are the ones that still look like you in twenty years’ time." },
];

export const blogIndexBody = `
  ${pageHero("Journal", "Notes for your big day", "Honest, practical advice from a team that has spent hundreds of wedding mornings doing exactly this.")}
  <section class="section"><div class="wrap">
    <div class="cards">
      ${POSTS.map((p, i) => `
        <article class="card reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}" style="padding:2rem 1.9rem;">
          <span class="eyebrow">Guide</span>
          <h3 style="margin:.6rem 0 .7rem;">${p.title}</h3>
          <p style="font-size:.96rem;color:#5c5048;margin-bottom:1.2rem;">${p.excerpt}</p>
          <a class="card-link" href="${p.slug}">Read <span>→</span></a>
        </article>`).join("")}
    </div>
  </div></section>`;

export const post1Body = `
  ${pageHero("Journal · Pretoria", "How to Choose a Bridal Makeup Artist in Pretoria", "Five things that separate a great bridal artist from a risky booking.")}
  ${prose(`
    <p>Pretoria brides are spoilt for choice — which makes choosing harder, not easier. After hundreds of weddings across Gauteng, Limpopo, Mpumalanga and the North West, here’s what we’d look for if we were booking.</p>
    <h2>1. A portfolio of real brides</h2>
    <p>Ask to see real clients, not stock or heavily-filtered images. Skin should still look like skin. A trustworthy bridal artist shows you exactly what you’ll get.</p>
    <h2>2. Range, not just a signature</h2>
    <p>Your artist should adapt to <em>your</em> features and style — soft and natural, or full glam — rather than painting every bride the same way.</p>
    <h2>3. A trial as standard</h2>
    <p>The trial is where trust is built and your look is perfected. If it isn’t offered, that’s a flag.</p>
    <h2>4. Transparent pricing</h2>
    <p>You should understand what you’re paying for before you commit — per person, by hair length, with travel made clear. Vague “from” ranges leave you guessing.</p>
    <h2>5. Calm, reliable communication</h2>
    <p>How an artist answers your first enquiry is how your wedding morning will feel. Choose the steady, kind, organised one.</p>
    <p>Want to see our work and pricing? <a href="portfolio.html">Browse the portfolio</a> or <a href="pricing.html">view transparent pricing</a>.</p>
  `)}
  ${ctaBand}`;

export const post2Body = `
  ${pageHero("Journal · Trials", "What to Expect at Your Bridal Trial", "How to get the most from the most important appointment before your wedding.")}
  ${prose(`
    <p>The trial is the heart of the bridal beauty experience. It’s a relaxed, by-appointment session at our studio where we shape your look together — long before the big day.</p>
    <h2>Bring inspiration</h2>
    <p>A handful of images (Pinterest or Instagram), your hair accessories or veil, and an idea of your dress neckline all help us tailor the look.</p>
    <h2>Come prepared</h2>
    <p>Arrive with clean, moisturised, makeup-free skin. Tell us about any allergies or sensitivities so we can patch-test and choose the right products.</p>
    <h2>Speak up</h2>
    <p>This is the time to refine — lighter, softer, more defined. We’d far rather adjust now than on the morning. By the end, it should feel unmistakably <em>you</em>.</p>
    <h2>After the trial</h2>
    <p>We note everything — products, shades, the exact look — so your wedding morning is calm and certain.</p>
    <p>Ready to begin? <a href="quote.html">Request your quote</a> and we’ll plan your trial.</p>
  `)}
  ${ctaBand}`;

export const post3Body = `
  ${pageHero("Journal · Style", "Bridal Beauty for 2026 &amp; 2027: Soft, Timeless, You", "Why the most-loved looks right now are the ones that still look like you in twenty years.")}
  ${prose(`
    <p>Trends come and go, but wedding photos are forever. The brides who love their pictures years later almost always chose looks that enhanced — rather than masked — who they are.</p>
    <h2>Skin that looks like skin</h2>
    <p>Luminous, lived-in skin beats heavy, flat coverage every time, especially in photographs. The prep matters as much as the product (see our <a href="guide-skin-prep.html">skin-prep guide</a>).</p>
    <h2>Soft definition</h2>
    <p>A softly-defined eye, a flush of warmth, a lip that’s a little more <em>you</em> — timeless, and it photographs beautifully from the first look to the last dance.</p>
    <h2>Hair that holds the moment</h2>
    <p>Romantic waves and elegant, secure updos that last through hugs, dancing and a Highveld afternoon.</p>
    <p>However bold or soft you go, we tailor it to you. <a href="portfolio.html">See recent brides →</a></p>
  `)}
  ${ctaBand}`;

export const blogPosts = POSTS;
