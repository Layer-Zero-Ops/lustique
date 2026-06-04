import { PRICING, RATE_PER_KM, FREE_KM, EVENT_BASE, LESSONS } from "./constants";
import type { EstimateInput, EstimateResult, HairBuckets, HairLength } from "./types";

const LENGTHS: readonly HairLength[] = ["short", "medium", "long", "xlong"];

/** Round-trip travel cost: free within 30 km, else round-trip distance × R7. */
export const travelForKm = (km: number): number =>
  km <= FREE_KM ? 0 : Math.round(km * 2 * RATE_PER_KM);

/** Flatten a length distribution into an ordered list (short→x-long), one entry per head. */
function expandBuckets(b: HairBuckets): HairLength[] {
  const out: HairLength[] = [];
  for (const len of LENGTHS) for (let i = 0; i < b[len]; i++) out.push(len);
  return out;
}

function resolveTravel(t: EstimateInput["travel"]): { cost: number; destination: boolean } {
  if ("cost" in t) return { cost: t.destination ? 0 : t.cost, destination: t.destination };
  const band = PRICING.travel[t.band];
  return { cost: band === null ? 0 : band, destination: band === null };
}

/**
 * Pricing is pure component arithmetic (PRICING.md §1). The browser estimator and the
 * Worker both call this, so the price a bride sees can never drift from the price she's quoted.
 *
 * Party hair is a length *distribution* (PRICING.md §2): we hand each adult hair-head a length
 * drawn from `partyHair` (short→x-long order). The total is the sum of the buckets — independent
 * of party size — and each head is priced at its own length. Flower-girls-under-12 keep the
 * cheaper table on their own length. Under-filled buckets fall back to "medium" (the historic default).
 */
export function computeEstimate(input: EstimateInput): EstimateResult {
  const trav = resolveTravel(input.travel);

  // Group lessons — tiered per-person (PRICING.md §7), minimum group of 6.
  if (input.occasion === "lessons") {
    const n = Math.max(LESSONS.minGroup, input.lessonsAttending ?? 0);
    const pp = n < LESSONS.threshold ? LESSONS.perPersonUnder10 : LESSONS.perPerson10Plus;
    let total = n * pp;
    if (!trav.destination) total += trav.cost;
    return { total, heads: n, destination: trav.destination, occasion: input.occasion };
  }

  // Other non-wedding events — makeup faces × base + hair faces × event-hair (single length).
  if (input.occasion !== "wedding") {
    const base = EVENT_BASE[input.occasion] ?? 750;
    const evMakeup = input.evMakeup ?? 0;
    const evHair = input.evHair ?? 0;
    const len = input.evHairLen ?? "medium";
    let total = base * evMakeup + PRICING.hairAdult[len] * evHair;
    if (!trav.destination) total += trav.cost;
    return { total, heads: Math.max(1, evMakeup, evHair), destination: trav.destination, occasion: input.occasion };
  }

  // Wedding — full bridal logic.
  const people: number[] = [];
  let total = PRICING.brideCore[input.brideHairLen];
  people.push(total);

  // Adult hair-heads draw their length, in order, from the party-hair distribution.
  const adultLengths = expandBuckets(input.partyHair);
  let hairIdx = 0;
  const nextAdultLen = (): HairLength => adultLengths[hairIdx++] ?? "medium";

  const addRole = (mk: number, hr: number, mkPrice: number, hairCost: () => number): number => {
    const heads = Math.max(mk, hr);
    for (let i = 0; i < heads; i++) {
      let c = 0;
      if (i < mk) c += mkPrice;
      if (i < hr) c += hairCost();
      total += c;
      if (c > 0) people.push(c);
    }
    return heads;
  };

  const adultHair = () => PRICING.hairAdult[nextAdultLen()];
  let heads = 1;
  heads += addRole(input.bmMakeup, input.bmHair, PRICING.makeup.bridesmaid, adultHair);
  heads += addRole(input.momMakeup, input.momHair, PRICING.makeup.mother, adultHair);
  heads += addRole(input.guestMakeup, input.guestHair, PRICING.makeup.guest, adultHair);
  const fgUnder = input.fgAge === "under";
  const fgTable = fgUnder ? PRICING.hairFgUnder : PRICING.hairAdult;
  heads += addRole(
    input.fgMakeup, input.fgHair,
    fgUnder ? PRICING.makeup.fgUnder : PRICING.makeup.fgOver,
    () => fgTable[input.fgHairLen],
  );

  for (const t of PRICING.assistantTiers) { if (heads >= t.min) { total += t.fee; break; } }
  if (!trav.destination) total += trav.cost;

  // Standing promo: book 4+ people → the least-expensive person's hair & makeup is free.
  if (input.promoOn && people.length >= 4) {
    total -= Math.min(...people.filter((c) => c > 0));
  }

  return { total, heads, destination: trav.destination, occasion: "wedding" };
}
