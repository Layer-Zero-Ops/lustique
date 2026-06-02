import { PRICING, RATE_PER_KM, FREE_KM, EVENT_BASE } from "./constants";
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

  // Non-wedding occasions — per-face event pricing.
  if (input.occasion !== "wedding") {
    const eventBase = EVENT_BASE[input.occasion] ?? 750;
    const faces = 1 + input.bmMakeup + input.momMakeup + input.fgMakeup + input.guestMakeup;
    const hairCount = input.bmHair + input.momHair + input.fgHair + input.guestHair;
    let total = eventBase * Math.max(1, faces) + hairCount * PRICING.hairAdult[pl];
    if (!trav.destination) total += trav.cost;
    return { total, heads: Math.max(1, faces), destination: trav.destination, occasion: input.occasion };
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
