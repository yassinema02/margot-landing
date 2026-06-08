"use client";

import { useEffect, useState } from "react";
import { AppStoreBadge } from "./AppStoreBadge";

// Sticky bottom download bar — mobile only. Stays out of the way until the
// visitor scrolls past the hero (whose own badge is already in view), then
// slides up and follows them down the page.
export function MobileCTA({ lang = "EN" }: { lang?: "EN" | "FR" }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-warm2 bg-surface/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 transition-transform duration-300 ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <span className="font-display italic text-ink2 text-[15px] leading-tight opsz-96">
        {lang === "FR" ? "Habillée dès demain matin." : "Dressed by tomorrow morning."}
      </span>
      <AppStoreBadge lang={lang} size="sm" />
    </div>
  );
}
