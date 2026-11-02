import { describe, expect, it } from "vitest";
import { redactInviteEvent, redactInviteToken } from "@/lib/redactInviteToken";

const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";

describe("redactInviteToken", () => {
  it("replaces the token of a full invitation URL", () => {
    expect(redactInviteToken(`https://www.margotwardrobe.com/i/${TOKEN}`)).toBe("https://www.margotwardrobe.com/i/:token");
    expect(redactInviteToken(`https://www.margotwardrobe.com/i/${TOKEN}?utm_source=x#top`)).toBe(
      "https://www.margotwardrobe.com/i/:token?utm_source=x#top",
    );
    expect(redactInviteToken(`http://localhost:3000/i/${TOKEN}`)).toBe("http://localhost:3000/i/:token");
  });

  it("replaces the token of a pathname", () => {
    expect(redactInviteToken(`/i/${TOKEN}`)).toBe("/i/:token");
    expect(redactInviteToken("/i/anything-at-all")).toBe("/i/:token");
    expect(redactInviteToken(`/i/${TOKEN}/more`)).toBe("/i/:token/more");
  });

  it("finds an invitation link inside a longer string", () => {
    expect(redactInviteToken(`a:href="https://www.margotwardrobe.com/i/${TOKEN}"`)).toBe(
      'a:href="https://www.margotwardrobe.com/i/:token"',
    );
  });

  it("is idempotent", () => {
    expect(redactInviteToken("/i/:token")).toBe("/i/:token");
    expect(redactInviteToken("https://www.margotwardrobe.com/i/:token")).toBe("https://www.margotwardrobe.com/i/:token");
  });

  it("leaves every other page alone", () => {
    for (const url of [
      "https://www.margotwardrobe.com/",
      "https://www.margotwardrobe.com/fr",
      "https://www.margotwardrobe.com/images/x.png",
      "https://www.margotwardrobe.com/download?c=ig_bio",
      "https://www.margotwardrobe.com/i",
      "https://www.margotwardrobe.com/i/",
      "/blog/i/like-this",
      "/studio-read/card/abc",
    ]) {
      expect(redactInviteToken(url)).toBe(url);
    }
  });
});

describe("redactInviteEvent (PostHog before_send)", () => {
  it("scrubs every URL and pathname property PostHog adds on its own", () => {
    const event = {
      uuid: "e1",
      event: "$pageleave",
      properties: {
        $current_url: `https://www.margotwardrobe.com/i/${TOKEN}`,
        $pathname: `/i/${TOKEN}`,
        $host: "www.margotwardrobe.com",
        $referrer: `https://www.margotwardrobe.com/i/${TOKEN}`,
        $prev_pageview_pathname: `/i/${TOKEN}`,
        $session_entry_url: `https://www.margotwardrobe.com/i/${TOKEN}`,
        $elements: [{ tag_name: "a", attr__href: `https://www.margotwardrobe.com/i/${TOKEN}` }],
        placement: "social_invite",
        count: 3,
      },
      $set_once: { $initial_current_url: `https://www.margotwardrobe.com/i/${TOKEN}`, $initial_pathname: `/i/${TOKEN}` },
    };
    const out = redactInviteEvent(event)!;
    expect(JSON.stringify(out)).not.toContain(TOKEN);
    expect(out.properties.$current_url).toBe("https://www.margotwardrobe.com/i/:token");
    expect(out.properties.$pathname).toBe("/i/:token");
    expect(out.properties.$host).toBe("www.margotwardrobe.com");
    expect(out.properties.placement).toBe("social_invite");
    expect(out.properties.count).toBe(3);
    expect(out.$set_once!.$initial_pathname).toBe("/i/:token");
    expect(out.uuid).toBe("e1");
    expect(out.event).toBe("$pageleave");
  });

  it("passes null through (an earlier hook dropped the event)", () => {
    expect(redactInviteEvent(null)).toBeNull();
  });

  it("does not change an event from another page", () => {
    const event = {
      uuid: "e2",
      event: "$pageview",
      properties: { $current_url: "https://www.margotwardrobe.com/fr", $pathname: "/fr" },
    };
    expect(redactInviteEvent(event)).toEqual(event);
  });
});
