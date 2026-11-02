import { describe, expect, it, vi } from "vitest";

// /i/<token>/<anything> would otherwise render the global 404 (RootShell:
// GA4, Meta Pixel) with the token in its URL. It goes back to /i/<token>.
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT ${url}`);
});
vi.mock("next/navigation", () => ({ redirect: (url: string) => redirect(url) }));

import InviteCatchAll, { dynamic } from "../(invite)/i/[token]/[...rest]/page";

const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";

describe("/i/[token]/[...rest]", () => {
  it("redirects to the invitation page itself", async () => {
    await expect(InviteCatchAll({ params: Promise.resolve({ token: TOKEN, rest: ["extra", "more"] }) })).rejects.toThrow(
      `NEXT_REDIRECT /i/${TOKEN}`,
    );
  });

  it("keeps a junk first segment encoded (the page then says the link is not valid)", async () => {
    await expect(InviteCatchAll({ params: Promise.resolve({ token: "a b/c", rest: ["x"] }) })).rejects.toThrow(
      "NEXT_REDIRECT /i/a%20b%2Fc",
    );
  });

  it("is rendered per request", () => {
    expect(dynamic).toBe("force-dynamic");
  });
});
