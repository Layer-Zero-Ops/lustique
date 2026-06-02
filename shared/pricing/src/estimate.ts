import { PRICING, RATE_PER_KM, FREE_KM, EVENT_BASE, LESSONS } from "./constants";
import type { EstimateInput, EstimateResult, HairLength } from "./types";

/** Round-trip travel cost: free within 30 km, else round-trip distance × R7. */
export const travelForKm = (km: number): number =>
  km <= FREE_KM ? 0 : Math.round(km * 2 * RATE_PER_KM);

function resolveTravel(t: EstimateInput["travel"]): { cost: number; destination: boolean } {
  if ("cost" in t) return { cost: t.destination ? 0 : t.cost, destination: t.destination };
  const band = PRICING.travel[t.band];
  return { cost: band === null ? 0 : band, destination: band === null };
}

/**
 * Faithful port of prototype/estimator.js computeEstimate (lines 39–86).
 * Pure function — the browser estimator and (later) the Worker both call this,
 * so the price a bride sees can never drift from the price she's quoted.
 */
export function computeEstimate(input: EstimateInput): EstimateResult {
  const pl = input.partyHairLen;
  const trav = resolveTravel(input.travel);

  // Group lessons — tiered per-person (PRICING.md §7), minimum group of 6.
  if (input.occasion === "lessons") {
    const n = Math.max(LESSONS.minGroup, input.lessonsAttending ?? 0);
    const pp = n < LESSONS.threshold ? LESSONS.perPersonUnder10 : LESSONS.perPerson10Plus;
    let total = n * pp;
    if (!trav.destination) total += trav.cost;
    return { total, heads: n, destination: trav.destination, occasion: input.occasion };
  }

  // Other non-wedding events — makeup faces × base + hair faces × event-hair.
  if (input.occasion !== "wedding") {
    const base = EVENT_BASE[input.occasion] ?? 750;
    const evMakeup = input.evMakeup ?? 0;
    const evHair = input.evHair ?? 0;
    const len = input.evHairLen ?? pl;
    let total = base * evMakeup + PRICING.hairAdult[len] * evHair;
    if (!trav.destination) total += trav.cost;
    return { total, heads: Math.max(1, evMakeup, evHair), destination: trav.destination, occasion: input.occasion };
  }

  // Wedding — full bridal logic.
  const people: number[] = [];
  let total = PRICING.brideCore[input.brideHairLen];
  people.push(total);

  const addRole = (
    mk: number, hr: number, mkPrice: number, hrTable: Record<HairLength, number>, len: HairLength,
  ): number => {
    const heads = Math.max(mk, hr);
    for (let i = 0; i < heads; i++) {
      let c = 0;
      if (i < mk) c += mkPrice;
      if (i < hr) c += hrTable[len];
      total += c;
      if (c > 0) people.push(c);
    }
    return heads;
  };

  let heads = 1;
  heads += addRole(input.bmMakeup, input.bmHair, PRICING.makeup.bridesmaid, PRICING.hairAdult, pl);
  heads += addRole(input.momMakeup, input.momHair, PRICING.makeup.mother, PRICING.hairAdult, pl);
  heads += addRole(input.guestMakeup, input.guestHair, PRICING.makeup.guest, PRICING.hairAdult, pl);
  const fgUnder = input.fgAge === "under";
  heads += addRole(
    input.fgMakeup, input.fgHair,
    fgUnder ? PRICING.makeup.fgUnder : PRICING.makeup.fgOver,
    fgUnder ? PRICING.hairFgUnder : PRICING.hairAdult, pl,
  );

  for (const t of PRICING.assistantTiers) { if (heads >= t.min) { total += t.fee; break; } }
  if (!trav.destination) total += trav.cost;

  // Standing promo: book 4+ people → the least-expensive person's hair & makeup is free.
  if (input.promoOn && people.length >= 4) {
    total -= Math.min(...people.filter((c) => c > 0));
  }

  return { total, heads, destination: trav.destination, occasion: "wedding" };
}
