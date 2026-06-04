export type HairLength = "short" | "medium" | "long" | "xlong";

/** A length distribution: how many heads need hair at each length. */
export type HairBuckets = Record<HairLength, number>;

export type Occasion =
  | "wedding" | "matric" | "editorial" | "engagement" | "corporate" | "pageant" | "lessons";

export type TravelBand = "studio" | "mid" | "far" | "veryfar" | "destination";

export interface EstimateInput {
  occasion: Occasion;
  brideHairLen: HairLength;
  /**
   * Adult party hair (bridesmaids + mothers + guests) as a length distribution —
   * "of those needing hair, how many short / medium / long / x-long". The sum is the
   * adult hair-head count; effort (and price) is exact and party-size-independent.
   * A collapsed "one length for everyone" UI is just a single populated bucket.
   */
  partyHair: HairBuckets;
  bmMakeup: number;  bmHair: number;
  momMakeup: number; momHair: number;
  /** Flower-girls under 12 keep the cheaper hair table; over 12 price like adults. Their own length. */
  fgAge: "under" | "over"; fgMakeup: number; fgHair: number; fgHairLen: HairLength;
  guestMakeup: number; guestHair: number;
  // Non-wedding events (matric/editorial/engagement/corporate/pageant) — simple face counts:
  evMakeup?: number; evHair?: number; evHairLen?: HairLength;
  // Group lessons (6+ attendees):
  lessonsAttending?: number;
  promoOn: boolean;
  /** Either a named band, or an exact override from the map-pin route. */
  travel: { band: TravelBand } | { cost: number; destination: boolean };
}

export interface EstimateResult {
  total: number;
  heads: number;
  destination: boolean;
  occasion: Occasion;
}
