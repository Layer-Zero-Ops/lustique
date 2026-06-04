import { describe, it, expect } from "vitest";
import { computeEstimate, travelForKm } from "./estimate";
import type { EstimateInput } from "./types";

const base: EstimateInput = {
  occasion: "wedding", brideHairLen: "medium",
  partyHair: { short: 0, medium: 0, long: 0, xlong: 0 },
  bmMakeup: 0, bmHair: 0, momMakeup: 0, momHair: 0,
  fgAge: "under", fgMakeup: 0, fgHair: 0, fgHairLen: "medium",
  guestMakeup: 0, guestHair: 0,
  promoOn: true, travel: { band: "studio" },
};

describe("travelForKm", () => {
  it("is free within 30 km", () => expect(travelForKm(30)).toBe(0));
  it("charges round-trip distance * R7 beyond 30 km", () => expect(travelForKm(50)).toBe(700)); // 50*2*7
});

describe("computeEstimate — wedding (collapsed single length = parity with the old model)", () => {
  it("solo bride, medium hair, no party = bride core only", () => {
    expect(computeEstimate(base)).toEqual({ total: 2890, heads: 1, destination: false, occasion: "wedding" });
  });

  it("full party applies the assistant tier + cheapest-free promo", () => {
    // bride + 3 bridesmaids(mk+hr) + 2 mothers(mk+hr) + 1 flower-girl<12(mk+hr), all medium, free travel.
    // 5 adult hair-heads (3 bm + 2 mom), all medium → partyHair {medium:5}; flower-girl hair on its own length.
    // 2890 + 3*(550+495) + 2*(500+495) + (250+250) = 8515; +850 assistant (heads 7 >= 5) = 9365; -500 promo (>=4 people) = 8865
    const r = computeEstimate({
      ...base, bmMakeup: 3, bmHair: 3, momMakeup: 2, momHair: 2, fgMakeup: 1, fgHair: 1,
      partyHair: { short: 0, medium: 5, long: 0, xlong: 0 },
    });
    expect(r.total).toBe(8865);
    expect(r.heads).toBe(7);
  });

  it("promo off keeps the cheapest person's cost", () => {
    const r = computeEstimate({
      ...base, bmMakeup: 3, bmHair: 3, momMakeup: 2, momHair: 2, fgMakeup: 1, fgHair: 1,
      partyHair: { short: 0, medium: 5, long: 0, xlong: 0 }, promoOn: false,
    });
    expect(r.total).toBe(9365);
  });

  it("destination travel zeroes travel and flags destination", () => {
    expect(computeEstimate({ ...base, travel: { cost: 0, destination: true } }))
      .toEqual({ total: 2890, heads: 1, destination: true, occasion: "wedding" });
  });

  it("collapsed length (all long) prices every adult head at that one length", () => {
    // 3 guests need makeup + hair, all long; promo frees the cheapest (a guest), assistant tier not reached (heads 4).
    // 2890 + 3*(550+595)=6325; no assistant (4<5); -1145 promo (>=4 people) = 5180
    const r = computeEstimate({
      ...base, guestMakeup: 3, guestHair: 3, partyHair: { short: 0, medium: 0, long: 3, xlong: 0 },
    });
    expect(r.total).toBe(5180);
    expect(r.heads).toBe(4);
  });
});

describe("computeEstimate — wedding (length distribution: each head priced at its own length)", () => {
  it("a mixed bucket prices every adult hair-head at its own length", () => {
    // 4 bridesmaids (mk+hr) across one of each length + 1 makeup-only mother. No flower girl.
    // adult hair = short395 + medium495 + long595 + xlong695 = 2180; +4*550 makeup = 4380.
    // 2890 + 4380 + 500(mom mk) = 7770; +850 assistant (heads 6 >= 5) = 8620; -500 promo (mom is cheapest) = 8120
    const r = computeEstimate({
      ...base, bmMakeup: 4, bmHair: 4, momMakeup: 1, momHair: 0,
      partyHair: { short: 1, medium: 1, long: 1, xlong: 1 },
    });
    expect(r.total).toBe(8120);
    expect(r.heads).toBe(6);
  });

  it("the adult-hair total is independent of party size — only the bucket counts matter", () => {
    // Same two long heads whether they are 2 bridesmaids or 1 bridesmaid + 1 guest.
    const asBridesmaids = computeEstimate({
      ...base, bmMakeup: 0, bmHair: 2, partyHair: { short: 0, medium: 0, long: 2, xlong: 0 }, promoOn: false,
    });
    const splitRoles = computeEstimate({
      ...base, bmMakeup: 0, bmHair: 1, guestMakeup: 0, guestHair: 1, partyHair: { short: 0, medium: 0, long: 2, xlong: 0 }, promoOn: false,
    });
    expect(asBridesmaids.total).toBe(2890 + 2 * 595); // 4080
    expect(splitRoles.total).toBe(asBridesmaids.total);
  });

  it("flower-girls-under-12 keep the cheaper hair table on their own length", () => {
    // 2 flower girls <12, mk + hair at long: hairFgUnder.long = 300 (not the adult 595).
    // 2890 + 2*(250+300) = 3990; heads 3 (<5 no assistant); 3 people (<4 no promo)
    const r = computeEstimate({
      ...base, fgAge: "under", fgMakeup: 2, fgHair: 2, fgHairLen: "long",
    });
    expect(r.total).toBe(3990);
    expect(r.heads).toBe(3);
  });
});

describe("computeEstimate — events (occasion-aware)", () => {
  it("matric: makeup faces × base + hair × event-hair (medium)", () => {
    const r = computeEstimate({ ...base, occasion: "matric", evMakeup: 3, evHair: 2 });
    expect(r.total).toBe(750 * 3 + 495 * 2); // 3240
    expect(r.occasion).toBe("matric");
  });
  it("corporate: a single face = base", () => {
    expect(computeEstimate({ ...base, occasion: "corporate", evMakeup: 1 }).total).toBe(650);
  });
});

describe("computeEstimate — group lessons (tiered, PRICING.md §7)", () => {
  it("under 10 attendees = R700pp", () => {
    expect(computeEstimate({ ...base, occasion: "lessons", lessonsAttending: 6 }).total).toBe(6 * 700);
  });
  it("10+ attendees = R600pp", () => {
    expect(computeEstimate({ ...base, occasion: "lessons", lessonsAttending: 12 }).total).toBe(12 * 600);
  });
});
