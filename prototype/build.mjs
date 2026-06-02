// LUSTIQUE CO. — static site generator (dev-only). Emits all pages with shared chrome.
import { writeFileSync } from "node:fs";
import { photo, pageHero, ctaBand, prose } from "./content/util.mjs";
import { termsBody, privacyBody } from "./content/legal.mjs";
import { skinPrepBody, timelineBody, artistBody } from "./content/guides.mjs";
import { quoteViewBody, invoiceBody, thankYouBody, notFoundBody } from "./content/flow.mjs";
import { blogIndexBody, post1Body, post2Body, post3Body } from "./content/blog.mjs";

const NAV = [
  ["About", "about.html"], ["Services", "services.html"], ["The Team", "team.html"],
  ["Portfolio", "portfolio.html"], ["Pricing", "pricing.html"], ["Guides", "guides.html"], ["Journal", "blog.html"],
];

const header = (active) => `
  <div class="topbar"><span>Now booking 2026 &amp; 2027 weddings · Book hair &amp; makeup for 4+ and the least-expensive look is on us</span></div>
  <header class="nav" id="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="index.html"><img class="brand-logo" src="assets/logo.png" alt="Lustique Co." onerror="this.style.display='none'" /><span class="brand-name">Lustique Co.</span></a>
      <nav><ul class="nav-links" id="navLinks">
        ${NAV.map(([l, h]) => `<li><a href="${h}"${h === active ? ' class="active"' : ""}>${l}</a></li>`).join("")}
      </ul></nav>
      <div class="nav-cta">
        <a class="btn btn-primary" href="quote.html">Get a Quote</a>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>`;

const footer = () => `
  <footer>
    <div class="wrap foot-grid">
      <div class="foot-brand">
        <span class="brand-name" style="font-size:1.6rem;">Lustique Co.</span>
        <p>Bridal hair &amp; makeup artistry for the bride who wants to feel most like herself.</p>
        <p style="margin-top:.7rem;font-size:.8rem;opacity:.62;">Serving brides across Gauteng, Limpopo, Mpumalanga &amp; North West — and destination weddings.</p>
      </div>
      <div><h4>Explore</h4><ul>
        <li><a href="about.html">About</a></li><li><a href="services.html">Services</a></li>
        <li><a href="team.html">The Team</a></li><li><a href="portfolio.html">Portfolio</a></li>
        <li><a href="pricing.html">Pricing</a></li><li><a href="faq.html">FAQ</a></li>
        <li><a href="blog.html">Journal</a></li>
      </ul></div>
      <div><h4>Contact</h4><ul>
        <li><a href="tel:+27679253894">067 925 3894</a></li>
        <li><a href="mailto:info@lustiqueco.co.za">info@lustiqueco.co.za</a></li>
        <li>242 Frangipani Street,<br>La Montagne, Pretoria</li>
        <li><a href="contact.html">Contact us &amp; map →</a></li>
      </ul></div>
      <div><h4>Follow</h4><ul>
        <li><a href="https://www.instagram.com/lustique_cosmetology/">Instagram</a></li>
        <li><a href="https://www.facebook.com/LustiqueCosmetology">Facebook</a></li>
        <li><a href="https://www.tiktok.com/@lustique_co">TikTok</a></li>
        <li><a href="guides.html">Free Guides</a></li>
      </ul></div>
    </div>
    <div class="wrap foot-bottom">
      <span>© 2026 Lustique Co. · Pretoria · <a href="terms.html">Terms</a> · <a href="privacy.html">Privacy</a></span>
      <span class="foot-sign">Blessings, The Lustique Cosmetology Team</span>
    </div>
  </footer>`;

const SITE = "https://lustiqueco.co.za";
const OG_IMG = SITE + "/assets/hero.jpg";
const JSONLD = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org", "@type": "HealthAndBeautyBusiness",
  name: "Lustique Co.", description: "Bridal hair and makeup artistry in Pretoria — a team of nine artists serving Gauteng and beyond.",
  image: OG_IMG, "@id": SITE + "/", url: SITE + "/", telephone: "+27-67-925-3894", priceRange: "R500–R8000",
  address: { "@type": "PostalAddress", streetAddress: "242 Frangipani Street, La Montagne", addressLocality: "Pretoria", addressRegion: "Gauteng", postalCode: "0184", addressCountry: "ZA" },
  areaServed: ["Gauteng", "Limpopo", "Mpumalanga", "North West"],
  founder: { "@type": "Person", name: "Zandeline Kemp" },
  sameAs: ["https://www.instagram.com/lustique_cosmetology/", "https://www.facebook.com/LustiqueCosmetology", "https://www.tiktok.com/@lustique_co"],
})}</script>`;

const shell = ({ slug, title, desc, body, script, jsonld }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${SITE}/${slug === "index.html" ? "" : slug}" />
<link rel="icon" href="assets/logo.png" type="image/png" />
<link rel="apple-touch-icon" href="assets/logo.png" />
<link rel="alternate icon" href="favicon.svg" type="image/svg+xml" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Lustique Co." />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${OG_IMG}" />
<meta property="og:url" content="${SITE}/${slug === "index.html" ? "" : slug}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#A0625E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="styles.css" />
${JSONLD}
${jsonld || ""}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(slug)}
<main id="main">
${body}
</main>
${footer()}
<div class="cookie-banner" id="cookieBanner" hidden>
  <p>We use a few cookies to make the site work and to understand how it’s used. <a href="privacy.html">Privacy &amp; cookies</a>.</p>
  <div class="cookie-actions"><button class="btn btn-ghost" id="cookieDecline">Decline</button><button class="btn btn-primary" id="cookieAccept">Accept</button></div>
</div>
<button class="to-top" id="toTop" aria-label="Back to top">↑</button>
<script src="site.js"></script>
${script ? `<script src="${script}"></script>` : ""}
</body>
</html>`;

// photo, pageHero, ctaBand, prose now imported from ./content/util.mjs

/* ---------------- HOME ---------------- */
const home = `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Bridal Hair &amp; Makeup Artistry · Pretoria &amp; Beyond</span>
        <h1 class="display">Feel most like <em>yourself</em>.</h1>
        <p class="hero-sub">For the bride who wants to look softly, unmistakably, unforgettably like herself — on the morning that matters most.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="pricing.html">Get your estimate</a>
          <a class="btn btn-ghost" href="portfolio.html">View the portfolio</a>
        </div>
      </div>
      <div class="hero-media">
        ${photo("hero.jpg")}
        <div class="hero-badge">Calm and curated</div>
      </div>
    </div>
  </section>

  <section class="trust">
    <div class="wrap">
      <div class="trust-item">We travel to you on your wedding day</div>
      <div class="trust-item">Trials by appointment, <b>in&nbsp;studio</b></div>
      <div class="trust-item">Personal, from your trial to the final touch-up</div>
    </div>
  </section>

  <section class="section statement">
    <div class="wrap">
      <span class="eyebrow reveal">Who we are</span>
      <h2 class="reveal d1" style="margin-top:1rem;">The artist a bride chooses when she wants to feel most like herself.</h2>
      <p class="reveal d2">We are a team of nine bridal artists, working as one quiet, capable presence on the morning of your wedding. Since 2018 we have made it our craft to enhance — never to mask — so that when you look in the mirror, you simply see yourself, on your most radiant day.</p>
      <p class="reveal d2">From your trial to the final touch-up, every detail is personal, calm, and considered. We count it a blessing to play a small part in your day.</p>
      <div class="quote-block reveal d3">
        <p class="lead">“Beauty begins the moment you decide to be yourself.”</p>
        <cite>— Coco Chanel</cite>
      </div>
    </div>
  </section>

  <section class="section" style="background:linear-gradient(180deg,var(--blush),var(--ivory));">
    <div class="wrap">
      <div class="services-head">
        <div><span class="eyebrow reveal">What we do</span><h2 class="reveal d1" style="margin-top:1rem;">Flawless. Elegant.<br>Unforgettable.</h2></div>
        <p class="reveal d2" style="max-width:34ch;color:#5c5048;">Every look is tailored to you — your features, your dress, the feeling of your day.</p>
      </div>
      <div class="cards">
        <article class="card reveal"><div class="card-media">${photo("s1.jpg")}</div><div class="card-body"><h3>Bridal Makeup</h3><p>A soft, lasting look built on flawless skin — from natural radiance to timeless glamour, made to last from “I do” to the last dance.</p><a class="card-link" href="services.html">Explore makeup <span>→</span></a></div></article>
        <article class="card reveal d1"><div class="card-media">${photo("s2.jpg")}</div><div class="card-body"><h3>Bridal Hair</h3><p>From romantic soft curls to elegant updos, styled to complement your features, your dress and the spirit of your celebration.</p><a class="card-link" href="services.html">Explore hair <span>→</span></a></div></article>
        <article class="card reveal d2"><div class="card-media">${photo("s3.jpg")}</div><div class="card-body"><h3>The Whole Party</h3><p>Bridesmaids, mothers, flower girls and guests — beautifully cohesive, individually considered, calmly choreographed on the day.</p><a class="card-link" href="pricing.html">Explore packages <span>→</span></a></div></article>
      </div>
    </div>
  </section>

  <section class="section team">
    <div class="wrap team-grid">
      <div class="team-collage reveal">${photo("t1.jpg")}${photo("t2.jpg")}${photo("t3.jpg")}${photo("t4.jpg")}</div>
      <div class="team-copy">
        <span class="eyebrow reveal">The Lustique team</span>
        <h2 class="reveal d1">Nine artists.<br>One quiet morning at a time.</h2>
        <p class="reveal d2">Lustique is no longer one pair of hands — it is a team of nine bridal artists who move as one. Whoever joins you on your day brings the same calm, the same standard, the same care.</p>
        <p class="reveal d2">We allocate the right artists for your wedding so you never have to. You simply get the Lustique standard, every time.</p>
        <div class="stat-row reveal d3">
          <div class="stat"><b>9</b><span>Artists</span></div>
          <div class="stat"><b>40+</b><span>Years combined</span></div>
          <div class="stat"><b>2018</b><span>Since</span></div>
        </div>
        <div style="margin-top:2rem;" class="reveal d3"><a class="btn btn-ghost" href="team.html">Meet the team</a></div>
      </div>
    </div>
  </section>

  <section class="section pricing">
    <div class="wrap">
      <div class="pricing-head">
        <span class="eyebrow reveal">Transparent pricing</span>
        <h2 class="reveal d1">Know your investment before you enquire.</h2>
        <p class="reveal d2">No vague ranges, no “request a quote to find out.” See clear starting prices, then build a personalised estimate in under a minute.</p>
      </div>
      <div class="price-grid">
        <div class="price reveal"><small>Solo Bride · trial + day</small><div class="amt"><sup>from R</sup>2 690</div></div>
        <div class="price reveal d1"><small>Bridesmaid · makeup</small><div class="amt"><sup>R</sup>550</div></div>
        <div class="price reveal d2"><small>Mother · makeup</small><div class="amt"><sup>R</sup>500</div></div>
        <div class="price reveal d3"><small>Bridal hair</small><div class="amt"><sup>from R</sup>495</div></div>
      </div>
      <div class="pricing-foot">
        <p>Free travel within 30 km of our La Montagne studio · R7/km beyond · prices scale with hair length</p>
        <a class="btn btn-light reveal" href="pricing.html">See full pricing &amp; estimate →</a>
      </div>
    </div>
  </section>

  <section class="section testi">
    <div class="wrap">
      <div class="stars reveal">★★★★★</div>
      <div class="testi-slider reveal d1">
        <div class="testi-slide active"><p class="lead">“They felt less like a vendor and more like the calmest people in the room. I looked like me — just the version I always hoped to be on my wedding day.”</p><cite>A Lustique Bride</cite></div>
        <div class="testi-slide"><p class="lead">“My whole bridal party was ready, relaxed and glowing. Not one moment of stress all morning.”</p><cite>A Lustique Bride</cite></div>
        <div class="testi-slide"><p class="lead">“The trial sold me. They listened, adjusted, and on the day my makeup lasted from the first photo to the last dance.”</p><cite>A Lustique Bride</cite></div>
      </div>
      <div class="testi-dots"></div>
      <div class="sub reveal d2">— sample reviews shown · real bride testimonials &amp; video to be added from our Google profile</div>
    </div>
  </section>

  <section class="section" style="background:linear-gradient(180deg,var(--ivory),var(--blush));">
    <div class="wrap res-grid">
      <div class="res-copy">
        <span class="eyebrow reveal">For your big day</span>
        <h2 class="reveal d1">Free guides, from us to you.</h2>
        <p class="reveal d2">A 30-day bridal skin-prep plan, a wedding-morning timeline, and more — thoughtful resources to help your day feel calm and considered. Yours, free.</p>
        <a class="btn btn-primary reveal d2" href="guides.html">Browse the guides</a>
      </div>
      <div class="res-media reveal d1">${photo("res.jpg")}</div>
    </div>
  </section>
  ${ctaBand}`;

/* ---------------- ABOUT ---------------- */
const about = `
  ${pageHero("Our Story", "The artist a bride chooses<br>when she wants to feel most like herself.", "Tailored hair and makeup for the bride who wants to feel like the most radiant version of herself.")}
  <section class="section"><div class="wrap team-grid">
    <div class="res-media">${photo("hero.jpg")}</div>
    <div class="team-copy">
      <span class="eyebrow">Since 2018</span>
      <h2 style="margin:1rem 0 1.2rem;">More than makeup —<br>a feeling of calm.</h2>
      <p>At Lustique Co. we believe beauty is more than makeup and hairstyling — it’s about confidence, individuality, and a look that reflects you. What began with Zandeline in 2018 has grown into a team of nine bridal artists who bring over 40 years of combined experience to every wedding.</p>
      <p>Our approach is personal and collaborative. From the moment you book your trial, we take the time to understand your style, your dress and your vision — then craft a look that feels effortlessly, unmistakably you.</p>
      <p>We are a faith-led, family-spirited studio, and we count it a blessing to play a small part in one of the most important days of your life.</p>
    </div>
  </div></section>
  <section class="section statement" style="background:linear-gradient(180deg,var(--blush),var(--ivory));"><div class="wrap">
    <p class="lead reveal" style="max-width:30ch;margin-inline:auto;">“Beauty begins the moment you decide to be yourself.”</p>
    <cite class="reveal d1" style="display:block;margin-top:1rem;font-style:normal;font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;color:var(--burgundy);">— Coco Chanel</cite>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="center" style="margin-bottom:3rem;"><span class="eyebrow reveal">Why brides choose us</span><h2 class="reveal d1" style="margin-top:1rem;">Why choose Lustique</h2></div>
    <div class="cards">
      <article class="card reveal" style="padding:2.2rem 1.9rem;"><h3>Tailored beauty</h3><p style="margin-top:.7rem;">Every bride is unique, and so is our approach. We create a look that enhances your natural beauty and suits your style, theme and personality.</p></article>
      <article class="card reveal d1" style="padding:2.2rem 1.9rem;"><h3>Expertise you can trust</h3><p style="margin-top:.7rem;">Nine bridal-specialised artists, 40+ years combined. Your look is flawless, camera-ready, and lasts from the first photo to the final dance.</p></article>
      <article class="card reveal d2" style="padding:2.2rem 1.9rem;"><h3>A calm, professional morning</h3><p style="margin-top:.7rem;">We bring more than brushes — we bring peace of mind, so you can relax and soak in every moment leading up to “I do.”</p></article>
    </div>
  </div></section>
  ${ctaBand}`;

/* ---------------- SERVICES ---------------- */
const svc = (n, title, body, price) => `<article class="card reveal" style="padding:2.1rem 1.9rem;"><span class="eyebrow">${n}</span><h3 style="margin:.6rem 0 .6rem;">${title}</h3><p>${body}</p><p style="margin-top:1rem;font-family:var(--serif);font-size:1.3rem;color:var(--mocha);">${price}</p></article>`;
const services = `
  ${pageHero("What we do", "Flawless. Elegant. Unforgettable.", "From the bride and her party to special-occasion glamour, every look is tailored — with quality, care, and a personal touch.")}
  <section class="section"><div class="wrap">
    <div class="center" style="margin-bottom:2.6rem;"><span class="eyebrow reveal">The wedding day</span><h2 class="reveal d1" style="margin-top:.8rem;">Bridal hair &amp; makeup</h2></div>
    <div class="cards">
      <article class="card reveal"><div class="card-media">${photo("s1.jpg")}</div><div class="card-body"><h3>Bridal Makeup</h3><p>Enhance your natural beauty with a customised look — soft glow or bold glam — using premium, long-wearing, photography-friendly products.</p><p style="font-family:var(--serif);font-size:1.3rem;color:var(--mocha);">from R850</p></div></article>
      <article class="card reveal d1"><div class="card-media">${photo("s2.jpg")}</div><div class="card-body"><h3>Bridal Hair</h3><p>Romantic curls, elegant updos, or effortless waves — styled to complement your features, dress and theme, and to hold all day.</p><p style="font-family:var(--serif);font-size:1.3rem;color:var(--mocha);">from R495</p></div></article>
      <article class="card reveal d2"><div class="card-media">${photo("s3.jpg")}</div><div class="card-body"><h3>The Whole Party</h3><p>Bridesmaids, mothers, flower girls and guests — cohesive yet individual, calmly choreographed so everyone is ready and glowing.</p><p style="font-family:var(--serif);font-size:1.3rem;color:var(--mocha);">see pricing</p></div></article>
    </div>
  </div></section>
  <section class="section" style="background:linear-gradient(180deg,var(--blush),var(--ivory));"><div class="wrap">
    <div class="center" style="margin-bottom:2.6rem;"><span class="eyebrow reveal">Beyond bridal</span><h2 class="reveal d1" style="margin-top:.8rem;">For every special occasion</h2><p class="reveal d2" style="max-width:52ch;margin:1rem auto 0;color:#5c5048;">We do any event — and group lessons too. Pricing for new occasion services is being finalised; figures below are indicative.</p></div>
    <div class="cards">
      ${svc("01", "Matric Farewell", "A standout look for her big night — glam that photographs beautifully and lasts through every dance.", "R750")}
      ${svc("02", "Editorial &amp; Photoshoot", "Camera-ready makeup for editorial, brand and personal shoots. Lashes included on photoshoots.", "from R600")}
      ${svc("03", "Engagement &amp; Maternity", "Soft, radiant looks for engagement and maternity shoots — natural, warm, and you.", "from R650*")}
      ${svc("04", "Corporate &amp; Events", "Polished makeup for corporate events, galas and celebrations, for one face or many.", "from R650*")}
      ${svc("05", "Pageant &amp; Stage", "Bold, long-wearing makeup built for stage lighting and the camera.", "from R950*")}
      ${svc("06", "Group Lessons", "Learn to do your own makeup with us — groups of 6+, at Bez Ranch (Kameelfontein) or on location. Includes a brush-set goodie bag.", "from R600 pp")}
    </div>
    <p class="note center" style="margin-top:1.6rem;">* Indicative — final pricing to be confirmed with Zandeline.</p>
  </div></section>
  ${ctaBand}`;

/* ---------------- TEAM ---------------- */
const ARTISTS = ["Zandeline","Monique","Marize","Jana","Janeke","Elria","Maroné","René","Samantha"];
const team = `
  ${pageHero("The Team", "Nine artists. One quiet<br>morning at a time.", "Together our nine bridal artists bring over 40 years of combined experience. Whoever joins you on your day brings the same calm, the same standard, the same care.")}
  <section class="section"><div class="wrap">
    <div class="artist-grid">
      ${ARTISTS.map((name, idx) => `
        <div class="artist reveal${idx % 3 === 1 ? " d1" : idx % 3 === 2 ? " d2" : ""}">
          <div class="ph"></div>
          <h3>${name}</h3>
          <div class="role">${name === "Zandeline" ? "Founder &amp; Lead Artist" : "Bridal Artist"}</div>
          <p>${name === "Zandeline" ? "Founder of Lustique Co. Doing makeup since 2018, and leading the team with calm and care." : "Bridal-specialised artist. A short bio in Zandeline’s words is on the way."}</p>
        </div>`).join("")}
    </div>
    <p class="note center" style="margin-top:2.4rem;max-width:60ch;margin-inline:auto;">Each artist’s portfolio will live as a highlight on our Instagram. We allocate the right artists for your wedding by date and party size — so you simply get the Lustique standard, every time. <em>Artist photos &amp; bios coming soon.</em></p>
  </div></section>
  ${ctaBand}`;

/* ---------------- PRICING ---------------- */
const pricing = `
  ${pageHero("Pricing", "Know your investment<br>before you enquire.", "Transparent, component-based pricing — clear starting points with no hidden surprises. Final quotes are tailored to your day.")}
  <section class="section" style="background:linear-gradient(180deg,var(--ivory),var(--blush));"><div class="wrap" style="max-width:980px;">
    <div class="team-grid reveal" style="margin-bottom:3.2rem;align-items:center;">
      <div class="res-media">${photo("res.jpg")}</div>
      <div><span class="eyebrow">Simple &amp; honest</span><h2 style="margin:1rem 0 1rem;font-size:clamp(1.9rem,3.2vw,2.6rem);">Priced by what you actually need.</h2><p style="color:#5c5048;">Makeup and hair are charged per person and by hair length — so your quote reflects your day, not a one-size package. Here’s where it starts.</p></div>
    </div>
    <table class="ptable reveal"><caption>The Bride — trial + wedding day</caption>
      <tr><th>Service</th><th>Short</th><th>Medium</th><th>Long</th><th>X-Long</th></tr>
      <tr><td>Bridal makeup (trial + day)</td><td class="amt">R1 700</td><td class="amt">R1 700</td><td class="amt">R1 700</td><td class="amt">R1 700</td></tr>
      <tr><td>Bridal hair (trial + day)</td><td class="amt">R990</td><td class="amt">R1 190</td><td class="amt">R1 390</td><td class="amt">R1 590</td></tr>
      <tr><td><strong>Solo bride — from</strong></td><td class="amt"><strong>R2 690</strong></td><td class="amt"><strong>R2 890</strong></td><td class="amt"><strong>R3 090</strong></td><td class="amt"><strong>R3 290</strong></td></tr>
    </table>
    <p class="note" style="margin-top:.8rem;">Includes the trial, strip lashes and a wedding-day touch-up kit. Hair length: Short (chin) · Medium (shoulder) · Long (mid-back) · X-Long (pantyline).</p>

    <table class="ptable reveal" style="margin-top:2.5rem;"><caption>The Bridal Party — per person</caption>
      <tr><th>Person</th><th>Makeup</th><th>Hair (from)</th></tr>
      <tr><td>Bridesmaid</td><td class="amt">R550</td><td class="amt">R395</td></tr>
      <tr><td>Mother of bride / groom</td><td class="amt">R500</td><td class="amt">R395</td></tr>
      <tr><td>Wedding guest</td><td class="amt">R550</td><td class="amt">R395</td></tr>
      <tr><td>Flower girl (under 12)</td><td class="amt">R250</td><td class="amt">R200</td></tr>
      <tr><td>Strip lashes (add-on)</td><td class="amt">R75</td><td class="amt">—</td></tr>
    </table>
    <p class="note" style="margin-top:.8rem;">Hair scales with length. A second artist joins for larger parties (5+ people) so everyone is calm and on time.</p>

    <table class="ptable reveal" style="margin-top:2.5rem;"><caption>Beyond the wedding</caption>
      <tr><th>Occasion</th><th>From</th></tr>
      <tr><td>Matric farewell</td><td class="amt">R750</td></tr>
      <tr><td>Editorial</td><td class="amt">R750</td></tr>
      <tr><td>Photoshoot (lashes incl.)</td><td class="amt">R600</td></tr>
      <tr><td>Engagement / maternity / corporate</td><td class="amt">R650*</td></tr>
      <tr><td>Pageant / stage</td><td class="amt">R950*</td></tr>
      <tr><td>Group lessons (6+, per person)</td><td class="amt">R600–R700</td></tr>
    </table>
    <p class="note" style="margin-top:.8rem;">* Indicative — final pricing to be confirmed.</p>

    <div style="margin-top:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="reveal">
      <div class="form-step" style="margin:0;"><h3 style="font-size:1.3rem;">Travel</h3><p style="margin-top:.5rem;color:#5c5048;">Free within 30 km of our La Montagne studio, then R7/km (round trip). Over 200 km one way is a destination wedding — we’ll tailor a quote.</p></div>
      <div class="form-step" style="margin:0;"><h3 style="font-size:1.3rem;">Booking</h3><p style="margin-top:.5rem;color:#5c5048;">A 50% booking fee secures your date (a 25% + 25% split is available). The balance is due 14 working days before your wedding.</p></div>
    </div>
    <div class="center" style="margin-top:2.6rem;"><a class="btn btn-primary" href="quote.html">Build your estimate &amp; request a quote</a></div>
  </div></section>`;

/* ---------------- PORTFOLIO ---------------- */
const gallery = [
  { s: "hero.jpg", c: "makeup" }, { s: "s2.jpg", c: "hair" }, { s: "t1.jpg", c: "makeup" }, { s: "res.jpg", c: "party" },
  { s: "s1.jpg", c: "makeup" }, { s: "t3.jpg", c: "hair" }, { s: "s3.jpg", c: "party" }, { s: "t2.jpg", c: "makeup" },
  { s: "t4.jpg", c: "hair" }, { s: "g10.jpg", c: "party" }, { s: "g11.jpg", c: "makeup" }, { s: "g12.jpg", c: "hair" },
  { s: "g13.jpg", c: "party" }, { s: "g14.jpg", c: "makeup" }, { s: "g15.jpg", c: "hair" },
];
const portfolio = `
  ${pageHero("Portfolio", "Real work. Real mornings.", "Every image here is real work — never stock, never AI. As each of our artists adds her portfolio, you’ll be able to browse them here too.")}
  <section class="section"><div class="wrap">
    <div class="gallery" id="gallery">
      ${gallery.map((g) => `<img class="gitem" src="assets/${g.s}" alt="Bridal ${g.c === "party" ? "party hair & makeup" : g.c} — Lustique Co., Pretoria" loading="lazy">`).join("")}
    </div>
    <p class="note center" style="margin-top:2rem;">Every photograph here is our own real work — never stock, never AI. Per-artist galleries arrive as each of our nine artists shares hers.</p>
  </div></section>
  ${ctaBand}`;

/* ---------------- FAQ ---------------- */
const FAQ = [
  ["How far in advance should I book?", "We’re at our best with a little time — most brides book 8 to 12 months ahead. That said, we love a last-minute bride too; if your date is close, send an enquiry and we’ll tell you honestly what’s possible (usually up to 48 hours before)."],
  ["Do you offer bridal trials, and when?", "Yes — the trial is the heart of the experience. It’s a relaxed, by-appointment session in studio where we shape your look together, usually a few weeks to a month before the wedding."],
  ["What should I bring to my trial?", "Inspiration images, any hair accessories or your veil, and a clean, moisturised face. Come as yourself — we’ll take it from there."],
  ["Do I need a skincare routine before the wedding?", "A little prep goes a long way. We share a free 30-day skin-prep guide, and we’ll give you personalised pointers at your trial."],
  ["Do you travel to my venue on the day?", "Yes — on your wedding day we come to you. Travel is free within 30 km of our La Montagne studio, then R7/km. Trials are by appointment in studio."],
  ["How long will hair and makeup take?", "Plan around 2.5 hours for the bride. We’ll send a detailed time schedule the week before, based on your party size."],
  ["Can you accommodate large bridal parties?", "Absolutely. For larger parties we bring additional artists so everyone is ready, calm and on time."],
  ["What products do you use?", "Professional, long-wearing, photography-friendly products suited to your skin. If you have favourites or sensitivities, just tell us."],
  ["What if I have sensitive skin or allergies?", "Let us know on your enquiry and at your trial — we’ll patch-test and adjust so your day is comfortable."],
  ["Can I make changes after the trial?", "Of course. The trial exists so we can refine until it feels exactly like you."],
];
const faq = `
  ${pageHero("FAQ", "Your questions, answered.", "Everything you might want to know before your enquiry. Still unsure? We’re a message away.")}
  <section class="section"><div class="wrap"><div class="faq-list">
    ${FAQ.map(([q, a]) => `<div class="faq-item reveal"><button class="faq-q">${q}<span class="icon">+</span></button><div class="faq-a"><p>${a}</p></div></div>`).join("")}
  </div></div></section>
  ${ctaBand}`;

/* ---------------- GUIDES ---------------- */
const guides = `
  ${pageHero("Free Guides", "Free guides, from us to you.", "Thoughtful resources to help your big day feel calm and considered. Pop in your email and they’re yours.")}
  <section class="section"><div class="wrap">
    <div class="guide-grid">
      <div class="guide reveal"><span class="eyebrow">Skin</span><h3 style="margin-top:.5rem;">30-Day Bridal Skin Prep</h3><p>A simple day-by-day plan so your skin is glowing and camera-ready by the morning of your wedding.</p><a class="btn btn-primary" href="guide-skin-prep.html">Read the guide</a></div>
      <div class="guide reveal d1"><span class="eyebrow">Timeline</span><h3 style="margin-top:.5rem;">Wedding-Morning Timeline</h3><p>A calm, realistic getting-ready schedule for the bride and the whole party.</p><a class="btn btn-primary" href="guide-timeline.html">Read the guide</a></div>
      <div class="guide reveal d2"><span class="eyebrow">Choosing</span><h3 style="margin-top:.5rem;">Choosing Your Artist</h3><p>What to look for (and what to ask) when booking bridal hair &amp; makeup.</p><a class="btn btn-primary" href="guide-artist.html">Read the guide</a></div>
    </div>
    <div class="form-step reveal" style="max-width:620px;margin:3rem auto 0;text-align:center;">
      <h3>Get the free skincare guide</h3>
      <p class="step-sub" style="margin-bottom:1.4rem;">Join our newsletter and we’ll send it straight to your inbox.</p>
      <div class="field-row" style="grid-template-columns:1fr auto;align-items:end;">
        <div class="field" style="margin:0;text-align:left;"><label>Your best email</label><input type="email" placeholder="you@email.com" /></div>
        <a class="btn btn-primary" href="#">Send it to me</a>
      </div>
    </div>
  </div></section>`;

/* ---------------- CONTACT ---------------- */
const contact = `
  ${pageHero("Contact", "Let’s talk about your day.", "We’d love to hear from you. The fastest way to a quote is the enquiry form — but you’re welcome to reach us directly too.")}
  <section class="section"><div class="wrap team-grid">
    <div class="team-copy">
      <span class="eyebrow">Get in touch</span>
      <h2 style="margin:1rem 0 1.4rem;">We reply within 24 hours.</h2>
      <p style="margin-bottom:.4rem;"><strong>Phone / WhatsApp</strong><br><a href="tel:+27679253894">067 925 3894</a></p>
      <p style="margin-bottom:.4rem;"><strong>Email</strong><br><a href="mailto:info@lustiqueco.co.za">info@lustiqueco.co.za</a></p>
      <p style="margin-bottom:.4rem;"><strong>Studio (trials by appointment)</strong><br>242 Frangipani Street, La Montagne, Pretoria</p>
      <p style="margin-bottom:1.4rem;"><strong>Follow</strong><br><a href="https://www.instagram.com/lustique_cosmetology/">Instagram</a> · <a href="https://www.facebook.com/LustiqueCosmetology">Facebook</a> · <a href="https://www.tiktok.com/@lustique_co">TikTok</a></p>
      <a class="btn btn-primary" href="quote.html">Request a quote</a>
    </div>
    <div>
      <div class="ph" style="aspect-ratio:4/3;border-radius:16px;"></div>
      <p class="note center" style="margin-top:.8rem;">Map of La Montagne, Pretoria — embeds in the live build.</p>
    </div>
  </div></section>`;

/* ---------------- QUOTE ---------------- */
const opts = (max) => Array.from({ length: max + 1 }, (_, i) => `<option>${i}</option>`).join("");
const lenOpts = `<option value="short">Short (chin)</option><option value="medium" selected>Medium (shoulder)</option><option value="long">Long (mid-back)</option><option value="xlong">X-Long (pantyline)</option>`;
const quote = `
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  ${pageHero("Get a Quote", "Tell us about your day.", "Every bride deserves a look as unique as her story. Build your estimate below — it updates live — then send it through for a personalised quote within 24 hours.")}
  <section class="section"><div class="wrap form-wrap">
    <div class="estimate-box" id="estimateBar">
      <div><div style="font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85;">Your live estimate</div><div id="estimateSub" style="opacity:.85;font-size:.88rem;">Updates as you fill in the form</div></div>
      <div class="amt" id="estimateAmount">from R 2 890</div>
    </div>
    <form id="quoteForm">
      <input type="text" name="company" id="hp_company" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">
      <div class="form-step reveal"><h3>Your occasion</h3><p class="step-sub">The estimator is tuned for weddings — choose another occasion and the pricing switches.</p>
        <div class="field"><label>What are we creating for?</label><select id="occasion"><option value="wedding">Wedding</option><option value="matric">Matric farewell</option><option value="editorial">Editorial / photoshoot</option><option value="engagement">Engagement / maternity shoot</option><option value="corporate">Corporate / event</option><option value="pageant">Pageant / stage</option><option value="lessons">Group lesson (6+)</option></select></div>
      </div>
      <div class="form-step reveal"><h3>About you</h3><p class="step-sub">Let’s start with the star of the show.</p>
        <div class="field-row"><div class="field"><label>First name</label><input placeholder="Your name"></div><div class="field"><label>Last name</label><input placeholder="Surname"></div></div>
        <div class="field-row"><div class="field"><label>Email</label><input type="email" placeholder="you@email.com"></div><div class="field"><label>Mobile / WhatsApp</label><input placeholder="067 000 0000"></div></div>
        <div class="field"><label>How did you hear about us?</label><select><option>Instagram</option><option>Google</option><option>A friend / past bride</option><option>TikTok</option><option>Facebook</option><option>Other</option></select></div>
      </div>
      <div class="form-step reveal"><h3>Your big day</h3><p class="step-sub">So we can reserve the date and work out the travel from our La Montagne studio.</p>
        <div class="field-row"><div class="field"><label>Wedding date</label><input type="date"></div><div class="field"><label>Province</label><select id="provinceInput"><option>Gauteng</option><option>Limpopo</option><option>Mpumalanga</option><option>North West</option><option>Other / outside SA</option></select></div></div>
        <div class="field"><label>Venue name <span style="text-transform:none;letter-spacing:0;font-weight:400;color:#8a7d72;">(optional)</span></label><input placeholder="e.g. Red Ivory Estate"></div>
        <div class="field"><label>Town / area</label><input id="townInput" placeholder="e.g. Hartbeespoort"></div>
        <button type="button" class="btn btn-ghost" id="checkTravel" style="padding:.7em 1.4em;">Find venue on map</button>
        <div id="venueMap" style="height:300px;border-radius:14px;margin-top:1rem;display:none;"></div>
        <p class="note" id="mapHint" style="display:none;margin-top:.5rem;">📍 Drag the pin to your exact venue for the most accurate travel cost.</p>
        <p class="note" id="travelResult" style="margin:.85rem 0 0;">We travel from La Montagne, Pretoria — free within 30 km, then R7/km round trip.</p>
        <div class="field" id="bandWrap" style="display:none;margin-top:1rem;"><label>Distance band (fallback)</label><select id="travelBand"><option value="studio">Within 30 km (free)</option><option value="mid">30–80 km</option><option value="far">80–150 km</option><option value="veryfar">150–200 km</option><option value="destination">Over 200 km / destination</option></select></div>
      </div>
      <div class="form-step reveal"><h3>The bride</h3><p class="step-sub">Your trial and wedding-day hair &amp; makeup — lashes and a touch-up kit included.</p>
        <div class="field"><label>Bride’s hair length</label><select id="brideHairLen">${lenOpts}</select></div>
      </div>
      <div class="form-step reveal"><h3>Your bridal party</h3><p class="step-sub">Makeup and hair are priced separately — so tell us exactly who needs what, and only pay for that.</p>
        <p style="font-weight:600;color:var(--mocha);margin:.2rem 0 .6rem;">Bridesmaids</p>
        <div class="field-row"><div class="field"><label>Need makeup</label><select id="bmMakeup">${opts(7)}</select></div><div class="field"><label>Need hair</label><select id="bmHair">${opts(7)}</select></div></div>
        <p style="font-weight:600;color:var(--mocha);margin:1rem 0 .6rem;">Mothers (of the bride &amp; groom)</p>
        <div class="field-row"><div class="field"><label>Need makeup</label><select id="momMakeup">${opts(4)}</select></div><div class="field"><label>Need hair</label><select id="momHair">${opts(4)}</select></div></div>
        <p style="font-weight:600;color:var(--mocha);margin:1rem 0 .6rem;">Flower girls</p>
        <div class="field-row"><div class="field"><label>Age</label><select id="fgAge"><option value="under">Under 12</option><option value="over">12 and over</option></select></div><div class="field"><label>Need makeup</label><select id="fgMakeup">${opts(4)}</select></div></div>
        <div class="field"><label>Flower girls — need hair</label><select id="fgHair">${opts(4)}</select></div>
        <p style="font-weight:600;color:var(--mocha);margin:1rem 0 .6rem;">Other guests</p>
        <div class="field-row"><div class="field"><label>Need makeup</label><select id="guestMakeup">${opts(5)}</select></div><div class="field"><label>Need hair</label><select id="guestHair">${opts(5)}</select></div></div>
        <div class="field" style="margin-top:1rem;"><label>Most of the party’s hair length <span style="text-transform:none;letter-spacing:0;font-weight:400;color:#8a7d72;">(for your estimate — we’ll confirm each at your trial)</span></label><select id="partyHairLen">${lenOpts}</select></div>
      </div>
      <div class="form-step reveal"><h3>Your vision</h3><p class="step-sub">The more you share, the more we can tailor your day.</p>
        <div class="field"><label>Style</label><select><option>Natural &amp; soft</option><option>Soft glam</option><option>Full glam</option><option>Editorial</option><option>Boho</option><option>Not sure yet — guide me</option></select></div>
        <div class="field"><label>Inspiration link (Pinterest / Instagram)</label><input placeholder="Paste a link — optional"></div>
        <div class="field"><label>Anything else we should know? (skin notes, timings, special requests)</label><textarea rows="4" placeholder="Tell us anything that helps us prepare…"></textarea></div>
        <label style="display:flex;align-items:center;gap:.6rem;font-size:.92rem;color:#5c5048;margin:.2rem 0 1.3rem;"><input type="checkbox" id="promoToggle" checked style="width:auto;"> Apply the “book 4+, least-expensive look free” offer to my estimate</label>
        <a class="btn btn-primary" href="thank-you.html" style="width:100%;justify-content:center;">Send my enquiry</a>
        <p class="note center" style="margin-top:1rem;">Prototype form — not yet connected. In the live build this writes to the CRM, emails your confirmation, and starts your quote. <strong>Blessings, The Lustique Cosmetology Team.</strong></p>
      </div>
    </form>
  </div></section>`;

/* ---------------- WRITE ALL ---------------- */
const faqJsonLd = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })),
})}</script>`;

const pages = [
  { slug: "index.html", title: "Lustique Co. — Bridal Hair & Makeup Artistry | Pretoria & Beyond", desc: "Bridal hair and makeup for the bride who wants to feel most like herself. Nine artists, 40+ years combined, serving Pretoria, Gauteng and beyond since 2018.", body: home },
  { slug: "about.html", title: "About — Lustique Co.", desc: "Our story: a team of nine bridal artists, 40+ years combined, crafting calm, tailored bridal beauty since 2018.", body: about },
  { slug: "services.html", title: "Services — Lustique Co.", desc: "Bridal hair & makeup, plus matric, editorial, engagement, maternity, corporate, pageant and group lessons.", body: services },
  { slug: "team.html", title: "The Team — Lustique Co.", desc: "Meet the nine bridal artists of Lustique Co. — 40+ years of combined experience.", body: team },
  { slug: "pricing.html", title: "Pricing — Lustique Co.", desc: "Transparent, component-based bridal pricing. Solo bride from R2,690. Free travel within 30 km of La Montagne, Pretoria.", body: pricing },
  { slug: "portfolio.html", title: "Portfolio — Lustique Co.", desc: "Real brides, real mornings — a gallery of recent bridal hair and makeup work.", body: portfolio },
  { slug: "faq.html", title: "FAQ — Lustique Co.", desc: "Bridal hair and makeup FAQs — booking, trials, travel, timing and more.", body: faq, jsonld: faqJsonLd },
  { slug: "guides.html", title: "Free Bridal Guides — Lustique Co.", desc: "Free downloadable guides: 30-day bridal skin prep, wedding-morning timeline and more.", body: guides },
  { slug: "contact.html", title: "Contact — Lustique Co.", desc: "Get in touch with Lustique Co. — bridal hair and makeup in La Montagne, Pretoria.", body: contact },
  { slug: "quote.html", title: "Get a Quote — Lustique Co.", desc: "Tell us about your wedding day and receive a personalised bridal hair and makeup quote within 24 hours.", body: quote, script: "estimator.js" },
  { slug: "terms.html", title: "Service Agreement & Terms — Lustique Co.", desc: "Our bridal hair and makeup service agreement and terms — booking, travel, cancellations — in plain language.", body: termsBody },
  { slug: "privacy.html", title: "Privacy & Cookie Policy — Lustique Co.", desc: "How Lustique Co. protects your information, in line with South Africa's POPIA.", body: privacyBody },
  { slug: "guide-skin-prep.html", title: "30-Day Bridal Skin Prep — Free Guide | Lustique Co.", desc: "A simple 30-day plan for glowing, camera-ready bridal skin.", body: skinPrepBody },
  { slug: "guide-timeline.html", title: "Wedding-Morning Timeline — Free Guide | Lustique Co.", desc: "A calm, realistic getting-ready schedule for the bride and the whole party.", body: timelineBody },
  { slug: "guide-artist.html", title: "Choosing Your Bridal Artist — Free Guide | Lustique Co.", desc: "What to look for and what to ask when booking bridal hair and makeup.", body: artistBody },
  { slug: "your-quote.html", title: "Your Quote — Lustique Co.", desc: "A sample personalised bridal quote with approve and reject.", body: quoteViewBody },
  { slug: "invoice.html", title: "Your Invoice — Lustique Co.", desc: "A sample bridal booking invoice.", body: invoiceBody },
  { slug: "thank-you.html", title: "Thank You — Lustique Co.", desc: "We've received your enquiry and will reply within 24 hours.", body: thankYouBody },
  { slug: "blog.html", title: "Journal — Bridal Beauty Advice | Lustique Co.", desc: "Honest, practical bridal hair and makeup advice from a Pretoria team.", body: blogIndexBody },
  { slug: "blog-choosing-artist.html", title: "How to Choose a Bridal Makeup Artist in Pretoria | Lustique Co.", desc: "Five things that separate a great bridal artist from a risky booking — and what to ask.", body: post1Body },
  { slug: "blog-bridal-trial.html", title: "What to Expect at Your Bridal Trial | Lustique Co.", desc: "How to get the most from your bridal hair and makeup trial.", body: post2Body },
  { slug: "blog-2026-trends.html", title: "Bridal Beauty for 2026 & 2027 | Lustique Co.", desc: "Soft, timeless bridal looks that still look like you in twenty years.", body: post3Body },
  { slug: "404.html", title: "Page Not Found — Lustique Co.", desc: "This page slipped away — let's get you back.", body: notFoundBody },
];

for (const p of pages) {
  writeFileSync(new URL(p.slug, import.meta.url), shell(p));
  console.log("wrote", p.slug);
}

// sitemap.xml + robots.txt (SEO)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}/${p.slug === "index.html" ? "" : p.slug}</loc></url>`).join("\n")}
</urlset>`;
writeFileSync(new URL("sitemap.xml", import.meta.url), sitemap);
writeFileSync(new URL("robots.txt", import.meta.url), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("wrote sitemap.xml + robots.txt");
console.log("done —", pages.length, "pages");
