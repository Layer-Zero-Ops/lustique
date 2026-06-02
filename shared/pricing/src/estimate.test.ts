import { describe, it, expect } from "vitest";
import { computeEstimate, travelForKm } from "./estimate";
import type { EstimateInput } from "./types";

const base: EstimateInput = {
  occasion: "wedding", brideHairLen: "medium", partyHairLen: "medium",
  bmMakeup: 0, bmHair: 0, momMakeup: 0, momHair: 0,
  fgAge: "under", fgMakeup: 0, fgHair: 0, guestMakeup: 0, guestHair: 0,
  promoOn: true, travel: { band: "studio" },
};

describe("travelForKm", () => {
  it("is free within 30 km", () => expect(travelForKm(30)).toBe(0));
  it("charges round-trip distance * R7 beyond 30 km", () => expect(travelForKm(50)).toBe(700)); // 50*2*7
});

describe("computeEstimate — wedding", () => {
  it("solo bride, medium hair, no party = bride core only", () => {
    expect(computeEstimate(base)).toEqual({ total: 2890, heads: 1, destination: false, occasion: "wedding" });
  });

  it("full party applies the assistant tier + cheapest-free promo", () => {
    // bride + 3 bridesmaids(mk+hr) + 2 mothers(mk+hr) + 1 flower-girl<12(mk+hr), all medium, free travel:
    // 2890 + 3*(550+495) + 2*(500+495) + (250+250) = 8515; +850 assistant (heads 7 >= 5) = 9365; -500 promo (>=4 people) = 8865
    const r = computeEstimate({ ...base, bmMakeup: 3, bmHair: 3, momMakeup: 2, momHair: 2, fgMakeup: 1, fgHair: 1 });
    expect(r.total).toBe(8865);
    expect(r.heads).toBe(7);
  });

  it("promo off keeps the cheapest person's cost", () => {
    const r = computeEstimate({ ...base, bmMakeup: 3, bmHair: 3, momMakeup: 2, momHair: 2, fgMakeup: 1, fgHair: 1, promoOn: false });
    expect(r.total).toBe(9365);
  });

  it("destination travel zeroes travel and flags destination", () => {
    expect(computeEstimate({ ...base, travel: { cost: 0, destination: true } }))
      .toEqual({ total: 2890, heads: 1, destination: true, occasion: "wedding" });
  });
});

describe("computeEstimate — events", () => {
  it("solo matric face = event base", () => {
    const r = computeEstimate({ ...base, occasion: "matric" });
    expect(r.total).toBe(750);
    expect(r.occasion).toBe("matric");
  });
});
