import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactElement } from "react";
import { InviteDownload, copyInviteLink } from "@/components/InviteDownload";

const URL_ = "https://www.margotwardrobe.com/i/0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";
const STORE = "https://apps.apple.com/app/margot-outfit-planner/id6766047882";

// Minimal stand-in for the browser ClipboardItem: keeps what it was given.
class FakeClipboardItem {
  static supports?: (type: string) => boolean;
  constructor(public readonly items: Record<string, Blob>) {}
}

function stubClipboard(clipboard: Partial<Clipboard> | undefined, withItem = true) {
  vi.stubGlobal("navigator", clipboard === undefined ? {} : { clipboard });
  vi.stubGlobal("ClipboardItem", withItem ? FakeClipboardItem : undefined);
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete FakeClipboardItem.supports;
});

describe("copyInviteLink", () => {
  it("writes the link as text and as a URL when the browser can", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText });

    await copyInviteLink(URL_);

    expect(write).toHaveBeenCalledTimes(1);
    const [items] = write.mock.calls[0] as [FakeClipboardItem[]];
    expect(items).toHaveLength(1);
    expect(Object.keys(items[0].items)).toEqual(["text/plain", "text/uri-list"]);
    expect(await items[0].items["text/plain"].text()).toBe(URL_);
    expect(await items[0].items["text/uri-list"].text()).toBe(URL_);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("starts the copy synchronously, inside the tap", () => {
    const write = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText: vi.fn() });
    void copyInviteLink(URL_);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("drops the URL flavour when the browser says it cannot write it", async () => {
    FakeClipboardItem.supports = (type) => type !== "text/uri-list";
    const write = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText: vi.fn() });

    await copyInviteLink(URL_);

    const [items] = write.mock.calls[0] as [FakeClipboardItem[]];
    expect(Object.keys(items[0].items)).toEqual(["text/plain"]);
  });

  it("falls back to plain text when the rich write is refused", async () => {
    const write = vi.fn().mockRejectedValue(new DOMException("Type text/uri-list not supported on write.", "NotAllowedError"));
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText });

    await copyInviteLink(URL_);

    expect(writeText).toHaveBeenCalledWith(URL_);
  });

  it("falls back to plain text when the rich write throws synchronously", async () => {
    const write = vi.fn(() => {
      throw new TypeError("boom");
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText });

    await copyInviteLink(URL_);

    expect(writeText).toHaveBeenCalledWith(URL_);
  });

  it("uses plain text when ClipboardItem does not exist", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText }, false);

    await copyInviteLink(URL_);

    expect(writeText).toHaveBeenCalledWith(URL_);
  });

  it("never rejects, whatever the clipboard does", async () => {
    stubClipboard({ write: vi.fn().mockRejectedValue(new Error("no")), writeText: vi.fn().mockRejectedValue(new Error("no")) });
    await expect(copyInviteLink(URL_)).resolves.toBeUndefined();

    stubClipboard({
      writeText: vi.fn(() => {
        throw new Error("no");
      }),
    }, false);
    await expect(copyInviteLink(URL_)).resolves.toBeUndefined();

    stubClipboard(undefined, false);
    await expect(copyInviteLink(URL_)).resolves.toBeUndefined();
  });
});

describe("InviteDownload", () => {
  const props = { href: STORE, store: "app_store" as const, label: "Télécharger dans l'App Store", primary: true, placement: "social_invite" };

  it("is a real store link, tracked like every other store button", () => {
    const html = renderToStaticMarkup(createElement(InviteDownload, { ...props, copyUrl: URL_ }));
    expect(html).toContain(`href="${STORE}"`);
    expect(html).toContain('data-cta="app-store"');
    expect(html).toContain('data-placement="social_invite"');
    expect(html).not.toContain(URL_);
  });

  it("copies the invitation on tap and lets the browser open the store", () => {
    const write = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ write, writeText: vi.fn() });
    const anchor = InviteDownload({ ...props, copyUrl: URL_ }) as ReactElement<{ onClick?: (e: unknown) => void }>;
    const preventDefault = vi.fn();

    anchor.props.onClick?.({ preventDefault });

    expect(write).toHaveBeenCalledTimes(1);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("copies nothing when there is no valid invitation", () => {
    const write = vi.fn();
    const writeText = vi.fn();
    stubClipboard({ write, writeText });
    const anchor = InviteDownload(props) as ReactElement<{ onClick?: (e: unknown) => void }>;

    anchor.props.onClick?.({ preventDefault: vi.fn() });

    expect(write).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });

  it("tags Google Play buttons for the conversion tracker", () => {
    const html = renderToStaticMarkup(
      createElement(InviteDownload, { ...props, store: "play_store", href: "https://play.google.com/x", primary: false }),
    );
    expect(html).toContain('data-cta="play-store"');
  });
});
