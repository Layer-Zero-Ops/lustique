import { pageHero, prose } from "./util.mjs";

const printBar = `<div class="print-bar"><button class="btn btn-ghost" onclick="window.print()">⤓ Save / print this guide</button><a class="btn btn-primary" href="quote.html">Get your quote</a></div>`;

export const skinPrepBody = `
  ${pageHero("Free Guide · Skin", "30-Day Bridal Skin Prep", "A simple, realistic plan so your skin is calm, glowing and camera-ready by the morning of your wedding.")}
  ${prose(`
    ${printBar}
    <p>Beautiful makeup starts with healthy skin. You don’t need a 12-step routine — you need consistency and a little planning. Here’s what we recommend to our brides.</p>

    <h2>4 weeks before — build the base</h2>
    <ul>
      <li><strong>Hydrate, inside and out.</strong> Water through the day; a gentle moisturiser morning and night.</li>
      <li><strong>Cleanse gently</strong> twice a day. Avoid harsh scrubs that leave skin red.</li>
      <li><strong>Sunscreen every morning</strong> (SPF 30+). This is the single biggest difference-maker.</li>
      <li>If you want to try anything new (a facial, a product), <strong>do it now</strong> — never in the final fortnight.</li>
    </ul>

    <h2>3 weeks before — be consistent</h2>
    <ul>
      <li>Keep the routine steady. Add a hydrating mask once or twice a week if your skin likes it.</li>
      <li>Prioritise sleep and easy movement — both show up on your skin.</li>
      <li>Book any final facial for <strong>no later than 10–14 days out</strong>, so any reaction settles.</li>
    </ul>

    <h2>2 weeks before — keep it calm</h2>
    <ul>
      <li><strong>No experiments.</strong> No new actives, no first-time treatments, no extractions close to the day.</li>
      <li>Gentle exfoliation only if it’s already part of your routine.</li>
      <li>Lips: a soft scrub + balm at night so they’re smooth for lipstick.</li>
    </ul>

    <h2>The final week — protect the glow</h2>
    <ul>
      <li>Hydrate and rest. Ease back on salt, alcohol and very sugary food to reduce puffiness.</li>
      <li>Moisturise well the night before and the morning of — well-prepped skin holds makeup beautifully.</li>
      <li>Arrive to your appointment with a clean, moisturised, makeup-free face.</li>
    </ul>

    <h2>A note on sensitive skin</h2>
    <p>If your skin is reactive, tell us at your trial — we patch-test and choose gentle, long-wearing products that suit you. Comfort first, always.</p>

    <p class="note">With love &amp; care, the Lustique Cosmetology team.</p>
    ${printBar}
  `)}`;

export const timelineBody = `
  ${pageHero("Free Guide · Timing", "Your Wedding-Morning Timeline", "A calm, realistic getting-ready schedule for you and your whole party — so the morning feels unhurried.")}
  ${prose(`
    ${printBar}
    <p>The secret to a relaxed wedding morning is a realistic schedule. Here’s how we plan it — work backwards from the time you need to be photographed dressed and ready.</p>

    <h2>How long each look takes</h2>
    <ul>
      <li><strong>Bride</strong> (hair + makeup): about <strong>2.5 hours</strong>, scheduled last so you’re freshest.</li>
      <li><strong>Each additional person</strong>: roughly <strong>45–60 minutes</strong> per service.</li>
      <li>We bring <strong>additional artists for larger parties</strong> so several people are styled at once — your final schedule reflects this.</li>
    </ul>

    <h2>A sample morning (bride + 3, ceremony at 15:00)</h2>
    <table class="ptable">
      <tr><th>Time</th><th>What’s happening</th></tr>
      <tr><td>08:30</td><td>Team arrives &amp; sets up</td></tr>
      <tr><td>09:00</td><td>Bridesmaids &amp; mom — hair &amp; makeup begin (in rotation)</td></tr>
      <tr><td>11:30</td><td>Bride’s hair</td></tr>
      <tr><td>12:30</td><td>Bride’s makeup</td></tr>
      <tr><td>13:30</td><td>Touch-ups, lashes, final checks</td></tr>
      <tr><td>14:00</td><td>Into the dress · photographer ready</td></tr>
    </table>
    <p class="note">We send <em>your</em> exact schedule the week before, built around your venue, party size and photographer’s timing.</p>

    <h2>Make the morning lovely</h2>
    <ul>
      <li>Choose a room with <strong>good natural light</strong> and space to set up.</li>
      <li>Have everyone’s hair <strong>clean and dry</strong> (unless we’ve advised otherwise).</li>
      <li>Keep a light breakfast, water, and a button-up top handy (so nothing pulls over a finished look).</li>
      <li>Build in 15 minutes of buffer — calm beats rushed, every time.</li>
    </ul>

    <p class="note">With love, the Lustique Cosmetology team.</p>
    ${printBar}
  `)}`;

export const artistBody = `
  ${pageHero("Free Guide · Choosing", "Choosing Your Bridal Artist", "What to look for — and what to ask — so you book with complete confidence.")}
  ${prose(`
    ${printBar}
    <p>Your hair and makeup set the tone for how you feel — and how your photos look — all day. Here’s how to choose well.</p>

    <h2>What to look for</h2>
    <ul>
      <li><strong>A real portfolio of real brides</strong> — not stock or filtered images. Look for skin that still looks like skin.</li>
      <li><strong>Range</strong> — can they do soft-natural <em>and</em> glam, and adapt to your features rather than one signature look?</li>
      <li><strong>A trial</strong> offered as standard. The trial is where trust is built.</li>
      <li><strong>Transparent pricing</strong> — you should understand what you’re paying for before you commit.</li>
      <li><strong>Calm, reliable communication.</strong> How they answer your enquiry is how your morning will feel.</li>
    </ul>

    <h2>Questions worth asking</h2>
    <ul>
      <li>Do you travel to my venue, and what’s the travel cost?</li>
      <li>How long will everyone take on the morning, and do you bring assistants for bigger parties?</li>
      <li>What products do you use, and can you work with sensitive skin?</li>
      <li>What does the booking fee and balance look like, and what’s your cancellation policy?</li>
      <li>Can I see photos of brides with a similar skin tone or hair type to mine?</li>
    </ul>

    <h2>Trust the feeling</h2>
    <p>Beyond skill, you want someone who makes you feel calm and heard. On the day, the right artist is the steadiest, kindest presence in the room — and it shows in every photo.</p>

    <p class="note">However you choose, we wish you a beautiful day. — The Lustique Cosmetology team.</p>
    ${printBar}
  `)}`;
