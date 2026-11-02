"use client";

/**
 * Store button of the invitation page (/i/<token>).
 *
 * On tap, the invitation link is copied, so that once the app is installed it
 * can offer « Coller le lien » and attach the invitation. The copy starts
 * synchronously inside the tap (Safari only allows clipboard writes during a
 * user gesture), then the browser follows the plain store link as usual: no
 * preventDefault, no scripted navigation, so in-app browsers and the App
 * Store / Play hand-off behave exactly like the /download buttons.
 *
 * The link is written both as text and as a URL (text/uri-list) when the
 * browser allows it: iOS then reports a URL on the pasteboard, which is what
 * the app's paste button looks for first. Any copy failure is ignored; the
 * store still opens. The token is never logged.
 */

type Store = "app_store" | "play_store";

type ClipboardItemCtor = {
  new (items: Record<string, Blob>): ClipboardItem;
  supports?: (type: string) => boolean;
};

function writeTextOrNothing(clipboard: Clipboard | undefined, url: string): Promise<unknown> {
  try {
    return typeof clipboard?.writeText === "function" ? clipboard.writeText(url) : Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/** Copies the invitation link. Starts synchronously, never rejects. */
export function copyInviteLink(url: string): Promise<void> {
  const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
  const Item = (typeof ClipboardItem === "undefined" ? undefined : ClipboardItem) as ClipboardItemCtor | undefined;
  let attempt: Promise<unknown>;
  try {
    if (Item && typeof clipboard?.write === "function") {
      const items: Record<string, Blob> = { "text/plain": new Blob([url], { type: "text/plain" }) };
      const uriList = typeof Item.supports === "function" ? Item.supports("text/uri-list") : true;
      if (uriList) items["text/uri-list"] = new Blob([url], { type: "text/uri-list" });
      attempt = clipboard.write([new Item(items)]).catch(() => writeTextOrNothing(clipboard, url));
    } else {
      attempt = writeTextOrNothing(clipboard, url);
    }
  } catch {
    attempt = writeTextOrNothing(clipboard, url);
  }
  return attempt.then(
    () => undefined,
    () => undefined,
  );
}

const PRIMARY =
  "rounded-full bg-ink px-6 py-4 text-center font-sans text-base font-medium text-surface no-underline transition-opacity hover:opacity-90";
const SECONDARY =
  "rounded-full border border-ink/30 px-6 py-4 text-center font-sans text-base font-medium text-ink no-underline transition-opacity hover:opacity-80";

export function InviteDownload({
  href,
  store,
  label,
  primary,
  placement,
  copyUrl,
}: {
  href: string;
  store: Store;
  label: string;
  primary: boolean;
  placement: string;
  /** Invitation link to copy on tap; absent when the invitation is not valid. */
  copyUrl?: string;
}) {
  return (
    <a
      href={href}
      className={primary ? PRIMARY : SECONDARY}
      // Picked up by ConversionTracker (app_store_click / play_store_click).
      data-cta={store === "app_store" ? "app-store" : "play-store"}
      data-placement={placement}
      onClick={
        copyUrl
          ? () => {
              void copyInviteLink(copyUrl);
            }
          : undefined
      }
    >
      {label}
    </a>
  );
}
