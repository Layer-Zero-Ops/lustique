/**
 * Booking financials — the money truth the Worker shares with the estimate logic.
 * All amounts are integer ZAR cents. computeEstimate() returns whole Rand, so
 * randToCents is exact (×100). Kept in this package so every money rule lives in one place.
 */

/** Yoco's per-transaction online fee as a fraction. Config — set to Zandeline's real rate (spec §15). */
export const YOCO_FEE_RATE = 0.029;

/** Whole-Rand (from computeEstimate) → integer cents. Exact: pricing is integer Rand. */
export const randToCents = (rand: number): number => Math.round(rand * 100);

/**
 * Split a total into the chosen deposit and the remaining balance, in cents.
 * Balance absorbs any rounding so depositNet + balanceNet === total, always.
 */
export function splitDeposit(
  totalCents: number,
  pct: 25 | 50 | 100,
): { depositNetCents: number; balanceNetCents: number } {
  const depositNetCents = Math.round((totalCents * pct) / 100);
  return { depositNetCents, balanceNetCents: totalCents - depositNetCents };
}

/**
 * Gross a net amount up so that, after Yoco's fee, Lustique nets the full amount.
 * ceil ⇒ Lustique never under-nets by a cent; the bride covers the fee (shown openly).
 * A zero net (100% deposit ⇒ no balance) grosses to zero — no R0 link is ever created.
 */
export function grossUp(netCents: number, feeRate: number = YOCO_FEE_RATE): number {
  if (netCents <= 0) return 0;
  return Math.ceil(netCents / (1 - feeRate));
}
