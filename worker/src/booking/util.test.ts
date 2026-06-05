import { describe, it, expect } from "vitest";
import { workingDaysBefore, makeReference } from "./util";

describe("workingDaysBefore", () => {
  // 2024-01-08 is a Monday; 2024-01-01 is the previous Monday.
  it("1 working day before Mon 2024-01-08 is Fri 2024-01-05", () => {
    expect(workingDaysBefore(new Date("2024-01-08T00:00:00Z"), 1).toISOString().slice(0, 10)).toBe("2024-01-05");
  });
  it("5 working days before Mon 2024-01-08 is Mon 2024-01-01 (skips the weekend)", () => {
    expect(workingDaysBefore(new Date("2024-01-08T00:00:00Z"), 5).toISOString().slice(0, 10)).toBe("2024-01-01");
  });
  it("never lands on a weekend", () => {
    for (let n = 1; n <= 30; n++) {
      const day = workingDaysBefore(new Date("2024-01-08T00:00:00Z"), n).getUTCDay();
      expect(day).not.toBe(0);
      expect(day).not.toBe(6);
    }
  });
});

describe("makeReference", () => {
  it("formats a human reference from the uuid + year", () => {
    expect(makeReference("1a2b3c4d-5e6f-7081-9213-456789abcdef", 2026)).toBe("LUS-2026-1A2B3C");
  });
});
