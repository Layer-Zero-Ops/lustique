/**
 * Append-only audit: one immutable R2 object + one audit_log row per state change.
 * This is the durability net that makes free-tier (no PITR) safe for money + PII and
 * doubles as the POPIA record of processing (spec §6/§12). `fetch` and the clock are
 * injectable for deterministic tests. R2 is typed structurally (just `put`) — no
 * @cloudflare/workers-types dependency needed.
 */
import { insertAudit, type DbEnv } from "./db";

interface R2Putter {
  put(key: string, value: string): Promise<unknown>;
}
export interface AuditEnv extends DbEnv {
  AUDIT: R2Putter;
}

export async function writeAudit(
  env: AuditEnv,
  e: { bookingId: string | null; eventType: string; payload: unknown },
  f: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<void> {
  const ts = now().toISOString();
  const key = `audit/${e.bookingId ?? "system"}/${ts}-${e.eventType}.json`;
  await env.AUDIT.put(key, JSON.stringify({ ...e, ts }));
  await insertAudit(env, { booking_id: e.bookingId, event_type: e.eventType, payload: e.payload }, f);
}
