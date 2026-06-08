import Image from "next/image";
import { AppStoreBadge } from "./AppStoreBadge";

// Real in-app screens (the same shots used on the App Store). Each image is a
// self-contained marketing frame — phone mockup, headline and background baked
// in — so the gallery just presents them in a horizontal, snap-scrolling rail.
const SHOTS = [
  { src: "/screenshots/01-daily.jpg", alt: { EN: "Margot's daily outfit suggestion", FR: "La tenue du jour suggérée par Margot" } },
  { src: "/screenshots/02-add.jpg", alt: { EN: "Adding a clothing item in seconds", FR: "Ajouter un vêtement en quelques secondes" } },
  { src: "/screenshots/03-looks.jpg", alt: { EN: "Looks built from your own wardrobe", FR: "Des looks créés à partir de votre garde-robe" } },
  { src: "/screenshots/04-plans.jpg", alt: { EN: "Outfits ready for your calendar", FR: "Des tenues prêtes pour votre agenda" } },
  { src: "/screenshots/05-rediscover.jpg", alt: { EN: "Wardrobe wear analytics", FR: "Analyse de l'usage de votre garde-robe" } },
  { src: "/screenshots/06-travel.jpg", alt: { EN: "Travel packing list", FR: "Liste de valise pour voyager" } },
] as const;

const COPY = {
  EN: { eyebrow: "A look inside", headline: "Every morning, sorted.", subline: "One outfit, picked from what you already own — plus everything Margot does once she knows your closet." },
  FR: { eyebrow: "Un aperçu", headline: "Chaque matin, réglé.", subline: "Une tenue, choisie dans ce que vous possédez déjà — et tout ce que Margot fait une fois votre dressing connu." },
} as const;

export function Screenshots({ lang = "EN" }: { lang?: "EN" | "FR" }) {
  const c = COPY[lang];
  return (
    <section className="bg-bg border-t border-warm2 py-[clamp(56px,8vw,104px)]">
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-5 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
          <span className="w-1.5 h-1.5 rounded-full bg-peach" />
          {c.eyebrow}
        </div>
        <h2 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(34px,5vw,56px)] leading-[1.0] tracking-tightest [text-wrap:balance]">
          {c.headline}
        </h2>
        <p className="mx-auto mt-4 font-display italic text-ink2 opsz-96 text-[clamp(16px,1.7vw,20px)] leading-[1.45] tracking-tight6 max-w-[480px] [text-wrap:pretty]">
          {c.subline}
        </p>
      </div>

      <div
        className="mt-[clamp(32px,4vw,56px)] flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={lang === "FR" ? "Captures d'écran de l'app Margot" : "Margot app screenshots"}
      >
        {SHOTS.map((s, i) => (
          <div
            key={s.src}
            role="listitem"
            className="snap-center shrink-0 relative w-[clamp(232px,70vw,288px)] aspect-[426/923] rounded-[26px] overflow-hidden border border-warm2 shadow-[0_24px_60px_-36px_rgba(45,58,51,0.5)]"
          >
            <Image
              src={s.src}
              alt={s.alt[lang]}
              fill
              sizes="(max-width: 640px) 70vw, 288px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 mt-[clamp(28px,3.5vw,44px)] px-6">
        <AppStoreBadge lang={lang} size="lg" />
        <span className="font-sans text-[12px] text-ink3 tracking-tight7">
          {lang === "FR" ? "Gratuit · iPhone" : "Free · iPhone"}
        </span>
      </div>
    </section>
  );
}
