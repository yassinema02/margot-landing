/* eslint-disable @next/next/no-img-element */
import { APP_STORE_URL } from "@/lib/launch";

// Desktop-only "scan to download" card. Pointless on mobile (you'd just tap the
// badge), so hidden below md. The QR encodes the App Store listing.
export function DownloadQR({ lang = "EN" }: { lang?: "EN" | "FR" }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="app-store-qr"
      className="hidden md:flex items-center gap-3.5 rounded-2xl border border-warm2 bg-surface px-4 py-3 no-underline hover:border-sage transition-colors"
    >
      <img src="/app-qr.svg" alt="" aria-hidden="true" width={64} height={64} className="w-16 h-16 rounded-md" />
      <span className="flex flex-col text-left leading-tight">
        <span className="font-sans text-[13px] font-semibold text-ink tracking-tight7">
          {lang === "FR" ? "Scannez pour télécharger" : "Scan to download"}
        </span>
        <span className="font-sans text-[12px] text-ink3 tracking-tight7">
          {lang === "FR" ? "Pointez l'appareil photo de votre iPhone" : "Point your iPhone camera here"}
        </span>
      </span>
    </a>
  );
}
