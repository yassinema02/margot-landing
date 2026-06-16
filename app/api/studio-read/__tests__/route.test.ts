import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "../route";

// No GEMINI_API_KEY / no SUPABASE env in this test env, so classifyFit
// short-circuits to `unreadable` WITHOUT any network call, and persist is a
// no-op. That lets us exercise the route's own logic (validation, rate-limit,
// orchestration, token issuance) deterministically and offline.
beforeEach(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.DAILY_GEMINI_CAP;
});

let ipCounter = 0;
function reqOf(body: unknown, opts: { raw?: string } = {}): Request {
  // Unique IP per request so the in-memory rate limiter doesn't bleed across tests.
  const ip = `10.0.0.${++ipCounter}`;
  return new Request("http://localhost/api/studio-read", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: opts.raw ?? JSON.stringify(body),
  });
}

describe("POST /api/studio-read", () => {
  it("invalid JSON -> 400", async () => {
    const res = await POST(reqOf(null, { raw: "}{ not json" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_json");
  });

  it("missing image -> 400", async () => {
    const res = await POST(reqOf({ locale: "en" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("missing_image");
  });

  it("oversized image -> 413", async () => {
    const res = await POST(reqOf({ imageBase64: "a".repeat(8_000_001) }));
    expect(res.status).toBe(413);
    expect((await res.json()).error).toBe("too_large");
  });

  it("valid request -> 200 with token + result (no key => unreadable, offline)", async () => {
    const res = await POST(reqOf({ imageBase64: "ZmFrZQ==", locale: "en" }));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.token).toMatch(/^[0-9a-f-]{36}$/);
    expect(j.result.status).toBe("unreadable");
  });

  it("over daily budget -> 503", async () => {
    process.env.DAILY_GEMINI_CAP = "1";
    await POST(reqOf({ imageBase64: "ZmFrZQ==" })); // 1st call hits the cap of 1
    const res = await POST(reqOf({ imageBase64: "ZmFrZQ==" })); // 2nd is over
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("busy");
  });

  it("same IP over the limit -> 429", async () => {
    const ip = "172.16.9.9";
    const fire = () =>
      POST(
        new Request("http://localhost/api/studio-read", {
          method: "POST",
          headers: { "content-type": "application/json", "x-real-ip": ip },
          body: JSON.stringify({ imageBase64: "ZmFrZQ==" }),
        }),
      );
    let last: Response | undefined;
    for (let i = 0; i < 9; i++) last = await fire(); // limit is 8 → 9th is blocked
    expect(last!.status).toBe(429);
  });
});
