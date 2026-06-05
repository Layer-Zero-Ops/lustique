/** Pure booking helpers (no I/O) — easy to test, reused across the booking endpoints. */

/**
 * The date `n` working days (Mon–Fri) before `from`. v1 ignores SA public holidays
 * (spec §15) — working day = weekday. Used for the balance-reminder lead time.
 */
export function workingDaysBefore(from: Date, n: number): Date {
  const d = new Date(from.getTime());
  let remaining = n;
  while (remaining > 0) {
    d.setUTCDate(d.getUTCDate() - 1);
    const day = d.getUTCDay(); // 0 Sun … 6 Sat
    if (day !== 0 && day !== 6) remaining--;
  }
  return d;
}

/** Human booking reference from the uuid + year, e.g. LUS-2026-1A2B3C. Deterministic, quotable. */
export const makeReference = (id: string, year: number): string =>
  `LUS-${year}-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
