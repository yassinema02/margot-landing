import { describe, expect, it } from "vitest";
import { POSTHOG_OPTIONS, pageviewUrl, posthogOptions } from "@/components/PostHogProvider";

// An invitation link carries a single-use token: whoever holds it can claim
// the invitation. PostHog must only ever see /i/:token.
const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";

describe("PostHogProvider", () => {
  it("sends /i/:token as the pageview URL", () => {
    expect(pageviewUrl("https://www.margotwardrobe.com", `/i/${TOKEN}`, "")).toBe("https://www.margotwardrobe.com/i/:token");
    expect(pageviewUrl("https://www.margotwardrobe.com", `/i/${TOKEN}`, "utm_source=whatsapp")).toBe(
      "https://www.margotwardrobe.com/i/:token?utm_source=whatsapp",
    );
  });

  it("keeps other pageview URLs as they are", () => {
    expect(pageviewUrl("https://www.margotwardrobe.com", "/download", "c=ig_bio")).toBe(
      "https://www.margotwardrobe.com/download?c=ig_bio",
    );
  });

  it("scrubs every event before it leaves the browser (autocapture, pageleave, clicks)", () => {
    const beforeSend = POSTHOG_OPTIONS.before_send;
    expect(typeof beforeSend).toBe("function");
    const out = (beforeSend as (e: unknown) => { properties: Record<string, unknown> })({
      uuid: "e1",
      event: "app_store_click",
      properties: {
        $current_url: `https://www.margotwardrobe.com/i/${TOKEN}`,
        $pathname: `/i/${TOKEN}`,
        placement: "social_invite",
      },
    });
    expect(JSON.stringify(out)).not.toContain(TOKEN);
    expect(out.properties.$pathname).toBe("/i/:token");
  });

  it("stays cookieless", () => {
    expect(POSTHOG_OPTIONS.persistence).toBe("memory");
    expect(POSTHOG_OPTIONS.capture_pageview).toBe(false);
  });

  it("disableFlags (invitation page): no /flags request, which would carry $initial_current_url", () => {
    const options = posthogOptions({ disableFlags: true });
    expect(options.advanced_disable_flags).toBe(true);
    expect(options.before_send).toBe(POSTHOG_OPTIONS.before_send);
    expect(options.persistence).toBe("memory");
  });

  it("the rest of the site keeps its options", () => {
    expect(posthogOptions({ disableFlags: false })).toBe(POSTHOG_OPTIONS);
    expect(POSTHOG_OPTIONS.advanced_disable_flags).toBeUndefined();
  });
});
