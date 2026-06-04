export type HairLength = "short" | "medium" | "long" | "xlong";

/** A length distribution: how many heads need hair at each length. */
export type HairBuckets = Record<HairLength, number>;

export type Occasion =
  | "wedding" | "matric" | "editorial" | "engagement" | "corporate" | "pageant" | "lessons";

export type TravelBand = "studio" | "mid" | "far" | "veryfar" | "destination";

/**
 * A configurable promotion. Zandeline rotates the *active* promo (later CMS-driven); the
 * estimator and the quote both apply whatever is active — never a hardcoded rule.
 * Extend with new kinds (percentOff, amountOff…) as she defines them.
 */
export type Promo =
  | { kind: "none" }
  | { kind: "cheapestLookFree"; minPeople: number };

/** One itemised line of an estimate/quote — what contributes to the price. */
export interface EstimateLine {
  label: string;
  amount: number; // negative for discounts
}

export interface EstimateInput {
  occasion: Occasion;
  brideHairLen: HairLength;
  /**
   * Adult party hair (bridesmaids + mothers + guests) as a length distribution —
   * "of those needing hair, how many short / medium / long / x-long". Priced exactly,
   * independent of party size.
   */
  partyHair: HairBuckets;
  bmMakeup: number;  bmHair: number;
  momMakeup: number; momHair: number;
  /** Flower-girls under 12 keep the cheaper hair table AND are never the promo's free look. */
  fgAge: "under" | "over"; fgMakeup: number; fgHair: number; fgHairLen: HairLength;
  guestMakeup: number; guestHair: number;
  /**
   * Additional artist(s) the BRIDE requests for a tighter morning (R850 each). NOT auto-added —
   * the cost of the assistant for 5+/9+ parties is already included in the per-person prices.
   */
  requestedArtists: number;
  // Non-wedding events (matric/editorial/engagement/corporate/pageant) — simple face counts:
  evMakeup?: number; evHair?: number; evHairLen?: HairLength;
  // Group lessons (6+ attendees):
  lessonsAttending?: number;
  /** The promo to apply (the active one, or { kind: "none" } when off). */
  promo: Promo;
  /** Either a named band, or an exact override from the map-pin route. */
  travel: { band: TravelBand } | { cost: number; destination: boolean };
}

export interface EstimateResult {
  total: number;
  heads: number;
  destination: boolean;
  occasion: Occasion;
  /** Itemised breakdown (bride, each role, travel, requested artists, promo discount). */
  lines: EstimateLine[];
}
