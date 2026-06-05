import { describe, it, expect } from "vitest";
import { randToCents, splitDeposit, grossUp, YOCO_FEE_RATE } from "./payments";

describe("randToCents", () => {
  it("converts whole Rand to cents exactly", () => {
    expect(randToCents(2690)).toBe(269000);
    expect(randToCents(10000)).toBe(1000000);
  });
});

describe("splitDeposit", () => {
  it("50% splits evenly", () => {
    expect(splitDeposit(1000000, 50)).toEqual({ depositNetCents: 500000, balanceNetCents: 500000 });
  });
  it("100% leaves a zero balance (the settle-outright case)", () => {
    expect(splitDeposit(1000000, 100)).toEqual({ depositNetCents: 1000000, balanceNetCents: 0 });
  });
  it("balance absorbs rounding so the parts always sum to the total", () => {
    const { depositNetCents, balanceNetCents } = splitDeposit(269001, 25);
    expect(depositNetCents + balanceNetCents).toBe(269001);
  });
});

describe("grossUp", () => {
  it("grosses a R5,000 deposit at 2.9% to R5,149.34 (ceil ⇒ never under-net)", () => {
    expect(grossUp(500000, 0.029)).toBe(514934); // ceil(500000 / 0.971)
  });
  it("returns 0 for a zero balance (100% deposit)", () => {
    expect(grossUp(0)).toBe(0);
  });
  it("defaults to YOCO_FEE_RATE", () => {
    expect(grossUp(500000)).toBe(grossUp(500000, YOCO_FEE_RATE));
  });
});
