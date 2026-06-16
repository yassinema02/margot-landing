import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "../route";

// Offline: no SUPABASE / BEEHIIV env, so both side effects are no-ops and we
// exercise the route's own validation + orchestration.
beforeEach(() => {
  delete process.env.BEEHIIV_API_KEY;
  delete process.env.BEEHIIV_PUBLICATION_ID;
});

const TOKEN = "11111111-2222-4333-8444-555555555555";

let n = 0;
function reqOf(body: unknown, raw?: string): Request {
  const ip = `192.168.5.${++n}`;
  return new Request("http://localhost/api/studio-read/attach", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: raw ?? JSON.stringify(body),
  });
}

describe("POST /api/studio-read/attach", () => {
  it("invalid JSON -> 400", async () => {
    const res = await POST(reqOf(null, "nope"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_json");
  });

  it("bad token -> 400", async () => {
    const res = await POST(reqOf({ token: "not-a-uuid", email: "a@b.co" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_token");
  });

  it("bad email -> 400", async () => {
    const res = await POST(reqOf({ token: TOKEN, email: "nope" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_email");
  });

  it("valid -> 200 ok (offline no-ops)", async () => {
    const res = await POST(reqOf({ token: TOKEN, email: "Person@Example.com", archetype: "boho", lang: "fr" }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("same IP over the limit -> 429", async () => {
    const ip = "192.168.99.99";
    const fire = () =>
      POST(
        new Request("http://localhost/api/studio-read/attach", {
          method: "POST",
          headers: { "content-type": "application/json", "x-real-ip": ip },
          body: JSON.stringify({ token: TOKEN, email: "a@b.co" }),
        }),
      );
    let last: Response | undefined;
    for (let i = 0; i < 9; i++) last = await fire();
    expect(last!.status).toBe(429);
  });
});
