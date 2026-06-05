import { describe, it, expect, vi } from "vitest";
import { writeAudit } from "./audit";

it("puts one immutable R2 object and one audit_log row per event", async () => {
  const put = vi.fn().mockResolvedValue(undefined);
  const f = vi.fn().mockResolvedValue(new Response("", { status: 201 }));
  const env = {
    SUPABASE_URL: "https://x.supabase.co",
    SUPABASE_SERVICE_KEY: "svc",
    AUDIT: { put },
  };
  await writeAudit(
    env,
    { bookingId: "b1", eventType: "booking.confirmed", payload: { ok: true } },
    f as unknown as typeof fetch,
    () => new Date("2026-06-05T10:00:00Z"),
  );
  expect(put).toHaveBeenCalledWith(
    "audit/b1/2026-06-05T10:00:00.000Z-booking.confirmed.json",
    expect.stringContaining("booking.confirmed"),
  );
  expect(f).toHaveBeenCalledOnce();
});

it("keys system events (no booking) under audit/system/", async () => {
  const put = vi.fn().mockResolvedValue(undefined);
  const f = vi.fn().mockResolvedValue(new Response("", { status: 201 }));
  const env = { SUPABASE_URL: "https://x", SUPABASE_SERVICE_KEY: "svc", AUDIT: { put } };
  await writeAudit(
    env,
    { bookingId: null, eventType: "cron.keepwarm", payload: {} },
    f as unknown as typeof fetch,
    () => new Date("2026-06-05T06:00:00Z"),
  );
  expect((put.mock.calls[0]![0] as string)).toMatch(/^audit\/system\//);
});
