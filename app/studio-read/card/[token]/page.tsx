import type { Metadata } from "next";
import Link from "next/link";
import { getStudioRead } from "@/lib/studioRead/persist";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";
import { MargotMark } from "@/components/MargotMark";
import { MARGOT, onAccent, pickAccent } from "@/lib/studioRead/brand";

export const runtime = "nodejs";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const data = await getStudioRead(token);
  const title = data ? `${data.result.share_card.headline} — Margot` : "Read your style — Margot";
  return {
    title,
    description: data?.result.share_card.one_liner ?? STUDIO_READ_COPY.en.metaDescription,
    alternates: { canonical: `/studio-read/card/${token}` },
    robots: { index: false, follow: true },
  };
}

export default async function CardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getStudioRead(token);
  const locale = data?.locale ?? "en";
  const c = STUDIO_READ_COPY[locale];
  const sc = data?.result.share_card;
  const palette = sc?.palette_hexes?.length ? sc.palette_hexes.slice(0, 4) : ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];
  const accent = pickAccent(palette);
  const t = onAccent(accent);

  return (
    <main className="min-h-screen bg-bg">
      <nav className="flex items-center px-6 py-4 sm:px-14" style={{ borderBottom: `1px solid ${MARGOT.hairline}` }}>
        <Link href={locale === "fr" ? "/fr" : "/"} className="no-underline">
          <MargotMark size={26} tone="ink" accent={MARGOT.beakRust} showWordmark wordSize={24} />
        </Link>
      </nav>

      <div className="mx-auto max-w-[460px] px-6 py-12 sm:py-16">
        {sc ? (
          <div className="overflow-hidden rounded-[28px] bg-surface" style={{ boxShadow: "0 14px 40px rgba(31,42,38,0.16)" }}>
            <div className="flex min-h-[340px] flex-col justify-between gap-5 px-7 pb-8 pt-6" style={{ background: accent }}>
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.soft }}>{c.eyebrow}</span>
                <MargotMark size={30} tone={t.markTone} accent={t.sparkle} />
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="font-display opsz-144 text-[58px] leading-[0.95] tracking-[-0.02em]" style={{ color: t.text }}>
                  {sc.headline}<span style={{ color: t.soft }}>.</span>
                </h1>
                <p className="font-display italic text-[23px] leading-[1.22]" style={{ color: t.text }}>{sc.one_liner}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 px-7 pb-7 pt-[22px]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: MARGOT.textMuted }}>{c.paletteLabel}</span>
              <div className="flex gap-1.5">
                {palette.map((hex, i) => (
                  <div key={i} className="flex flex-1 flex-col gap-1.5">
                    <div className="h-[62px] rounded-[10px]" style={{ background: hex, boxShadow: "inset 0 0 0 1px rgba(31,42,38,0.06)" }} />
                    <span className="text-center text-[9px] font-medium tracking-[0.04em]" style={{ color: "#A7ACA6" }}>{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center">
            <MargotMark size={72} tone="ink" accent={MARGOT.beakRust} />
            <h1 className="font-display opsz-144 text-4xl tracking-[-0.02em] text-ink">{c.cardCtaTitle}</h1>
          </div>
        )}

        {/* close the viral loop */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-[20px] border p-6 text-center" style={{ background: MARGOT.cream, borderColor: MARGOT.hairline }}>
          <p className="font-display italic text-[22px] leading-[1.2] text-ink">{c.cardCtaTitle}</p>
          <p className="text-[14.5px] leading-[1.5]" style={{ color: MARGOT.textBody }}>{c.cardCtaBody}</p>
          <Link
            href={locale === "fr" ? "/fr/studio-read" : "/studio-read"}
            className="mt-2 inline-flex h-[52px] items-center justify-center rounded-xl bg-ink px-7 font-sans text-[15.5px] font-semibold text-surface no-underline transition-colors hover:bg-[#1F2A26]"
          >
            {c.cardCta}
          </Link>
        </div>
      </div>
    </main>
  );
}
