import { pageHero, prose } from "./util.mjs";

/* The hosted quote a bride receives by email. In production it's generated
   per-lead from her form data; here it's a worked sample with live buttons. */
export const quoteViewBody = `
  ${pageHero("Your personalised quote", "For Anke &amp; her bridal party", "Prepared with love by the Lustique Cosmetology team · Valid for 14 days")}
  <section class="section"><div class="wrap" style="max-width:820px;">
    <div class="doc reveal">
      <div class="doc-head">
        <div><div class="brand-name" style="font-size:1.5rem;">Lustique Co.</div><p class="note">Quote LC-2026-0418 · 14 Nov 2026 · Red Ivory Estate, Hartbeespoort</p></div>
        <div class="note" style="text-align:right;">242 Frangipani Street<br>La Montagne, Pretoria<br>info@lustiqueco.co.za</div>
      </div>
      <table class="ptable" style="box-shadow:none;">
        <tr><th>Service</th><th>Detail</th><th style="text-align:right;">Amount</th></tr>
        <tr><td>Bride — trial + wedding day</td><td>Hair &amp; makeup, long, lashes + kit</td><td class="amt">R3 090</td></tr>
        <tr><td>Bridesmaids ×3</td><td>Makeup + hair (medium)</td><td class="amt">R3 135</td></tr>
        <tr><td>Mothers ×2</td><td>Makeup + hair (medium)</td><td class="amt">R1 990</td></tr>
        <tr><td>Additional artist</td><td>For an on-time morning (6 looks)</td><td class="amt">R850</td></tr>
        <tr><td>Travel</td><td>≈ 54 km round trip · R7/km</td><td class="amt">R756</td></tr>
        <tr><td>Promotion — 4+ booked</td><td>Least-expensive look free</td><td class="amt">– R995</td></tr>
        <tr><td><strong>Total</strong></td><td></td><td class="amt"><strong>R8 826</strong></td></tr>
      </table>
      <p class="note" style="margin-top:1rem;">A 50% booking fee (R4 413) secures your date. The balance is due 14 working days before the wedding. See our <a href="terms.html">service agreement</a>.</p>
      <div class="doc-actions">
        <a class="btn btn-primary" href="invoice.html">✓ Approve this quote</a>
        <a class="btn btn-ghost" href="contact.html">Request a change</a>
      </div>
      <p class="note center" style="margin-top:1.4rem;">Approving generates your invoice and reserves your date. <strong>Blessings, the Lustique Cosmetology team.</strong></p>
    </div>
  </div></section>`;

export const invoiceBody = `
  ${pageHero("Your invoice", "Invoice LC-INV-2026-0418", "Thank you for trusting us with your day, Anke.")}
  <section class="section"><div class="wrap" style="max-width:820px;">
    <div class="doc reveal">
      <div class="doc-head">
        <div><div class="brand-name" style="font-size:1.5rem;">Lustique Co.</div><p class="note">Issued 2 Jun 2026 · Wedding 14 Nov 2026</p></div>
        <div class="note" style="text-align:right;">Bill to:<br>Anke &amp; party<br>Red Ivory Estate, Hartbeespoort</div>
      </div>
      <table class="ptable" style="box-shadow:none;">
        <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
        <tr><td>Bridal hair &amp; makeup package (per accepted quote LC-2026-0418)</td><td class="amt">R8 826</td></tr>
        <tr><td><strong>Booking fee due now (50%)</strong></td><td class="amt"><strong>R4 413</strong></td></tr>
        <tr><td>Balance — due 14 working days before</td><td class="amt">R4 413</td></tr>
      </table>
      <div class="doc-pay">
        <h3 style="font-size:1.3rem;margin-bottom:.6rem;">Payment</h3>
        <p class="note">EFT to: Lustique Co. · [Bank] · [Acc no.] · Reference: <strong>LC-0418 Anke</strong><br>Please email proof of payment to info@lustiqueco.co.za to confirm your date.</p>
      </div>
      <p class="note center" style="margin-top:1.4rem;">We can’t wait to be part of your day. <strong>Blessings, the Lustique Cosmetology team.</strong></p>
    </div>
  </div></section>`;

export const thankYouBody = `
  ${pageHero("Thank you", "Your enquiry is on its way to us.", "We’ll reply within 24 hours — often sooner.")}
  ${prose(`
    <p style="text-align:center;font-size:1.12rem;">We’re honoured you’re considering us for your day. Here’s what happens next:</p>
    <ol style="max-width:46ch;margin:1.5rem auto;line-height:2;">
      <li>We review your details and check artist availability for your date.</li>
      <li>We send your personalised quote — with clear, itemised pricing.</li>
      <li>You approve it, and we reserve your date with a booking fee.</li>
    </ol>
    <div class="center" style="margin-top:2rem;">
      <p class="note" style="margin-bottom:1rem;">While you wait — a little gift:</p>
      <a class="btn btn-primary" href="guide-skin-prep.html">Download our 30-day skin-prep guide</a>
    </div>
    <p class="note center" style="margin-top:2.4rem;">Blessings,<br>The Lustique Cosmetology Team</p>
  `)}`;

export const notFoundBody = `
  <section class="page-hero" style="min-height:62vh;display:flex;flex-direction:column;justify-content:center;">
    <span class="eyebrow">404</span>
    <h1>This page slipped away.</h1>
    <p>The link may be old or mistyped — but your day’s still on. Let’s get you back.</p>
    <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a class="btn btn-primary" href="index.html">Back home</a>
      <a class="btn btn-ghost" href="quote.html">Get a quote</a>
    </div>
  </section>`;
