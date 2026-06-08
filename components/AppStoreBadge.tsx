import { APP_STORE_URL } from "@/lib/launch";

// Official-style "Download on the App Store" lockup. Localised text, Apple logo
// glyph, black pill per Apple's marketing guidelines. Links straight to the
// listing (no country code, so each visitor lands on their local store).
const COPY = {
  EN: { tagline: "Download on the", store: "App Store", aria: "Download Margot on the App Store" },
  FR: { tagline: "Télécharger dans l'", store: "App Store", aria: "Télécharger Margot dans l'App Store" },
} as const;

export function AppStoreBadge({
  lang = "EN",
  size = "lg",
}: {
  lang?: "EN" | "FR";
  size?: "lg" | "sm";
}) {
  const c = COPY[lang];
  const lg = size === "lg";
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.aria}
      data-cta="app-store"
      className={`group inline-flex items-center gap-2.5 rounded-xl bg-ink text-surface no-underline hover:opacity-90 transition-opacity ${
        lg ? "px-5 py-3" : "px-3.5 py-2"
      }`}
    >
      <svg
        viewBox="0 0 384 512"
        aria-hidden="true"
        className={lg ? "w-7 h-7" : "w-5 h-5"}
        fill="currentColor"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C32.3 141.2 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.1 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span className={`font-sans ${lg ? "text-[10px]" : "text-[9px]"} font-medium tracking-tight7 opacity-90`}>
          {c.tagline}
        </span>
        <span className={`font-sans ${lg ? "text-[19px]" : "text-[15px]"} font-semibold tracking-tight7 -mt-0.5`}>
          {c.store}
        </span>
      </span>
    </a>
  );
}
