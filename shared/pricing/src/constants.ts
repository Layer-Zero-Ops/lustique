import type { HairLength, TravelBand } from "./types";

type LenMap = Record<HairLength, number>;

// Verbatim from prototype/estimator.js (lines 8–18, 31). Pass 1 mirrors these EXACTLY,
// including the known minor bugs (group-lesson flat 600, very-far band 1900) — corrections
// are a separate, separately-tested follow-up pass.
export const PRICING = {
  brideCore: { short: 2690, medium: 2890, long: 3090, xlong: 3290 } as LenMap,
  makeup: { bridesmaid: 550, mother: 500, guest: 550, fgUnder: 250, fgOver: 500 },
  hairAdult: { short: 395, medium: 495, long: 595, xlong: 695 } as LenMap,
  hairFgUnder: { short: 200, medium: 250, long: 300, xlong: 400 } as LenMap,
  assistantTiers: [
    { min: 13, fee: 2550 },
    { min: 9, fee: 1700 },
    { min: 5, fee: 850 },
  ],
  travel: { studio: 0, mid: 700, far: 1200, veryfar: 1900, destination: null } as Record<TravelBand, number | null>,
};

export const RATE_PER_KM = 7;
export const FREE_KM = 30;
export const DEST_KM = 200;

// Non-wedding per-face base prices (PRICING.md §6).
export const EVENT_BASE: Record<string, number> = {
  matric: 750, editorial: 750, engagement: 650, corporate: 650, pageant: 950, lessons: 600,
};

// Group lessons (PRICING.md §7): R700pp under 10 attendees, R600pp for 10+, minimum group of 6.
export const LESSONS = { perPersonUnder10: 700, perPerson10Plus: 600, threshold: 10, minGroup: 6 };
