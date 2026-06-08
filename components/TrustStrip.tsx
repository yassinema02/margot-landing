import { APP_STORE_RATING } from "@/lib/launch";

// Under-CTA trust row. Shows the real App Store rating once it exists
// (APP_STORE_RATING set in lib/launch.ts); until then, honest signals that
// double as brand positioning — no fabricated stars.
const SIGNALS = {
  EN: ["Free to download", "No ads", "Your wardrobe stays private"],
  FR: ["Téléchargement gratuit", "Sans publicité", "Votre garde-robe reste privée"],
} as const;

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47L2.6 9.9l6.5-.95L12 2.5z" strokeLinejoin="round" />
    </svg>
  );
}

export function TrustStrip({ lang = "EN" }: { lang?: "EN" | "FR" }) {
  if (APP_STORE_RATING && APP_STORE_RATING.count > 0) {
    const { average, count } = APP_STORE_RATING;
    const rounded = Math.round(average);
    return (
      <div className="flex items-center gap-2.5 text-ink2">
        <span className="flex items-center gap-0.5 text-peach">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} filled={i < rounded} />
          ))}
        </span>
        <span className="font-sans text-[13px] tracking-tight7">
          {average.toFixed(1)}
          <span className="text-ink3">
            {" · "}
            {count.toLocaleString(lang === "FR" ? "fr-FR" : "en-GB")}{" "}
            {lang === "FR" ? "avis" : "ratings"}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-sans text-[12px] text-ink3 tracking-tight7">
      {SIGNALS[lang].map((s, i) => (
        <span key={s} className="flex items-center gap-3">
          {i > 0 && <span className="w-1 h-1 rounded-full bg-ink4" />}
          {s}
        </span>
      ))}
    </div>
  );
}
