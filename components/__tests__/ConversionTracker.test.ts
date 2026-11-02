import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const trackGA = vi.fn();
vi.mock("@/lib/analytics", () => ({ trackGA: (...args: unknown[]) => trackGA(...args) }));

import { storeClickHandler } from "@/components/analytics/ConversionTracker";

// Minimal DOM stand-ins (vitest runs in node).
class FakeElement {
  constructor(private readonly link: { dataset: Record<string, string> } | null) {}
  closest() {
    return this.link;
  }
}

function click(dataset: Record<string, string> | null) {
  return { target: new FakeElement(dataset ? { dataset } : null) } as unknown as MouseEvent;
}

beforeEach(() => {
  trackGA.mockReset();
  vi.stubGlobal("Element", FakeElement);
  vi.stubGlobal("document", { documentElement: { lang: "es" } });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("storeClickHandler", () => {
  it("sends the store tap to PostHog with placement and the page language", () => {
    const ph = { capture: vi.fn() };
    storeClickHandler(ph as never, { ga: true })(click({ cta: "app-store", placement: "social_invite" }));
    expect(ph.capture).toHaveBeenCalledWith("app_store_click", { placement: "social_invite", language: "es" });
    expect(trackGA).toHaveBeenCalledWith("app_store_click", { placement: "social_invite", language: "es" });
  });

  it("ga: false keeps the tap in PostHog only (invitation page)", () => {
    const ph = { capture: vi.fn() };
    storeClickHandler(ph as never, { ga: false })(click({ cta: "play-store", placement: "social_invite" }));
    expect(ph.capture).toHaveBeenCalledWith("play_store_click", { placement: "social_invite", language: "es" });
    expect(trackGA).not.toHaveBeenCalled();
  });

  it("ignores clicks that are not on a store link", () => {
    const ph = { capture: vi.fn() };
    storeClickHandler(ph as never, { ga: true })(click(null));
    expect(ph.capture).not.toHaveBeenCalled();
    expect(trackGA).not.toHaveBeenCalled();
  });
});
