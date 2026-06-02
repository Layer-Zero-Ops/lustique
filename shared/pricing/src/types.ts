export type HairLength = "short" | "medium" | "long" | "xlong";

export type Occasion =
  | "wedding" | "matric" | "editorial" | "engagement" | "corporate" | "pageant" | "lessons";

export type TravelBand = "studio" | "mid" | "far" | "veryfar" | "destination";

export interface EstimateInput {
  occasion: Occasion;
  brideHairLen: HairLength;
  partyHairLen: HairLength;
  bmMakeup: number;  bmHair: number;
  momMakeup: number; momHair: number;
  fgAge: "under" | "over"; fgMakeup: number; fgHair: number;
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
