import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { classifyFit } from "../engine";

function geminiReturning(text: string, opts: { ok?: boolean; finishReason?: string } = {}) {
  return vi.fn().mockResolvedValue({
    ok: opts.ok ?? true,
    json: async () => ({ candidates: [{ finishReason: opts.finishReason, content: { parts: [{ text }] } }] }),
  });
}

beforeEach(() => {
  process.env.GEMINI_API_KEY = "test-key";
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("classifyFit", () => {
  it("valid strong+high read -> status read", async () => {
    vi.stubGlobal("fetch", geminiReturning('{"primary":{"id":"boho","confidence":"high"},"secondary":{"id":"romantic"},"distinctiveness":"high","style_signal":"strong","why":"flowy and layered"}'));
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("read");
    expect(r.primary?.id).toBe("boho");
  });

  it("malformed JSON -> unreadable, never throws", async () => {
    vi.stubGlobal("fetch", geminiReturning("sorry, here is your analysis: not json at all"));
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("unreadable");
  });

  it("hallucinated id -> unreadable", async () => {
    vi.stubGlobal("fetch", geminiReturning('{"primary":{"id":"cottagecore","confidence":"high"},"distinctiveness":"high","style_signal":"strong"}'));
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("unreadable");
  });

  it("non-200 -> unreadable", async () => {
    vi.stubGlobal("fetch", geminiReturning("{}", { ok: false }));
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("unreadable");
  });

  it("SAFETY block -> unreadable", async () => {
    vi.stubGlobal("fetch", geminiReturning("", { finishReason: "SAFETY" }));
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("unreadable");
  });

  it("missing key -> unreadable (no network call)", async () => {
    delete process.env.GEMINI_API_KEY;
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);
    const r = await classifyFit("ZmFrZQ==", "en");
    expect(r.status).toBe("unreadable");
    expect(spy).not.toHaveBeenCalled();
  });
});
