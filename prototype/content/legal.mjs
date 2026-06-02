import { pageHero, prose } from "./util.mjs";

const draftNote = `<div class="draft-note">📋 <strong>Working draft.</strong> Please review with Zandeline (and ideally a legal professional) before this goes live. Figures are aligned to the 2026–2027 pricing.</div>`;

export const termsBody = `
  ${pageHero("The fine print, kindly", "Service Agreement &amp; Terms", "Everything we agree on, in plain language — so your day is calm and there are no surprises.")}
  ${prose(`
    ${draftNote}

    <h2>1. Booking &amp; securing your date</h2>
    <p>A <strong>50% booking fee</strong> secures your date and is required to confirm your booking. If that isn’t comfortable upfront, we offer a split: <strong>25% now</strong> to hold the date, and the remaining <strong>25%</strong> on a date we agree, or together with the balance. Until the booking fee is received, your date remains open to other enquiries.</p>
    <p>The <strong>balance</strong> is due no later than <strong>14 working days before</strong> your wedding, by EFT. If the balance isn’t received in time, we may treat the booking as cancelled.</p>

    <h2>2. The trial</h2>
    <p>Your trial is the heart of the experience — a relaxed, by-appointment session at one of our studios (we don’t travel for trials). We’ll shape your look together; bring inspiration images, any hair pieces or your veil, and come with clean, moisturised skin. Trials are usually held a few weeks to a month before the wedding.</p>

    <h2>3. Travel</h2>
    <p>On your wedding day, <strong>we come to you</strong>. Travel is <strong>free within 30 km</strong> of our La Montagne studio (242 Frangipani Street, Pretoria), then <strong>R7 per km</strong> (round trip) beyond that. Weddings more than <strong>200 km</strong> one way are destination weddings, quoted individually; where an overnight stay is required, the client provides reasonable accommodation (minimum 3-star) or an agreed accommodation fee.</p>

    <h2>4. Your bridal party &amp; additional artists</h2>
    <p>Makeup and hair are priced per person and by hair length. For larger parties, one or more additional artists join so everyone is ready, calm, and on time. Once a package including an assistant is booked, the party size can’t be reduced below that assistant threshold (the assistant booking is non-refundable).</p>

    <h2>5. On the day</h2>
    <p>We’ll send a detailed time schedule the week before. Please allow the time indicated for each service. <strong>Overtime</strong> caused by client-side delays is charged at R250 per 30 minutes. Please let us know in advance if no food or refreshments will be available for the team, so we can plan.</p>

    <h2>6. Changes, postponements &amp; cancellations</h2>
    <p><strong>Postponement:</strong> one free postponement to a weekday is allowed; a weekend postponement carries a R1 000 fee, and each further postponement R1 000, subject to availability on the new date.</p>
    <p><strong>Cancellation by you:</strong> the booking fee is non-refundable. Cancellations closer to the date may incur additional charges on a sliding scale, as set out in your signed agreement, to cover the reserved time and any artists already committed.</p>
    <p><strong>Cancellation by us</strong> (rare — illness or emergency): we’ll do everything to arrange a qualified replacement from our team; if we can’t, you receive a full refund of amounts paid.</p>

    <h2>7. Skin, allergies &amp; comfort</h2>
    <p>Please disclose any allergies, sensitivities or skin conditions when you enquire and again at your trial, so we can patch-test and choose suitable products. Your comfort and safety come first.</p>

    <h2>8. Photography &amp; your images</h2>
    <p>We love sharing our work. We only use images of you publicly with your permission, and we credit the photographer. You can ask us not to use your images at any time.</p>

    <h2>9. Promotions</h2>
    <p>Standing offers (such as “book 4+ and the least-expensive look is free”) apply as described at the time of booking and can’t be combined unless stated. Component pricing applies unless a promotion is running.</p>

    <p class="note" style="margin-top:2rem;">Questions about anything here? Email <a href="mailto:info@lustiqueco.co.za">info@lustiqueco.co.za</a> — we’re happy to talk it through.</p>
  `)}`;

export const privacyBody = `
  ${pageHero("Your privacy matters", "Privacy &amp; Cookie Policy", "How we look after your information, in line with South Africa’s POPIA.")}
  ${prose(`
    ${draftNote}

    <h2>Who we are</h2>
    <p>Lustique Co. (“we”, “us”) — bridal hair &amp; makeup, 242 Frangipani Street, La Montagne, Pretoria. Contact: <a href="mailto:info@lustiqueco.co.za">info@lustiqueco.co.za</a> · 067 925 3894.</p>

    <h2>What we collect</h2>
    <ul>
      <li>Your name, email, phone, and the wedding details you share (date, venue/town, party, preferences) when you enquire or request a quote.</li>
      <li>Basic website usage (via privacy-friendly analytics and cookies) to improve the site.</li>
      <li>Marketing preferences, only if you opt in.</li>
    </ul>

    <h2>How we use it</h2>
    <ul>
      <li>To prepare your quote, plan your booking, and provide our services.</li>
      <li>To contact you about your enquiry or booking.</li>
      <li>To send you helpful content or offers — only with your consent, and you can unsubscribe anytime.</li>
      <li>To improve the website.</li>
    </ul>

    <h2>Lawful basis &amp; consent (POPIA)</h2>
    <p>We process your information to respond to your enquiry and fulfil our services, and — for marketing — on the basis of your consent. You may withdraw consent at any time.</p>

    <h2>Sharing</h2>
    <p>We use trusted service providers (e.g. our email and scheduling tools) under confidentiality, only as needed to serve you. We do <strong>not</strong> sell your information. We may disclose information if legally required.</p>

    <h2>Security &amp; retention</h2>
    <p>We use reputable, secured services and keep your information only as long as needed for your booking or as the law requires, then remove it.</p>

    <h2>Your rights</h2>
    <p>You may ask us to access, correct, or delete your information, or object to its processing. Email <a href="mailto:info@lustiqueco.co.za">info@lustiqueco.co.za</a> and we’ll help.</p>

    <h2>Cookies</h2>
    <p>We use a small number of cookies for the site to work and to understand how it’s used. You’ll be asked to accept or decline non-essential cookies, and you can change your choice anytime via the banner or your browser settings. Declining won’t stop you from using the site.</p>

    <h2>Updates</h2>
    <p>We may update this policy; the latest version always lives here.</p>
  `)}`;
