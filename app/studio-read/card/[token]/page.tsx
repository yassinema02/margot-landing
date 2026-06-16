import type { Metadata } from "next";
import Link from "next/link";
import { getStudioRead } from "@/lib/studioRead/persist";
import { STUDIO_READ_COPY } from "@/lib/studioRead/copy";

export const runtime = "nodejs";

// Landing page a shared card link resolves to. The colocated opengraph-image
// supplies the unfurl; this page closes the viral loop with a "read your own" CTA.
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
  const palette = sc?.palette_hexes?.length ? sc.palette_hexes : ["#EFE7D8", "#C8B49A", "#8A7D6B", "#3B3730"];

  return (
    <main className="min-h-screen bg-bg px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <Link href={locale === "fr" ? "/fr" : "/"} className="font-display italic text-xl text-ink no-underline">
          Margot<span className="text-peach not-italic">.</span>
        </Link>

        {sc ? (
          <div className="mt-10">
            <h1 className="font-display text-5xl text-ink tracking-tightest leading-[0.95]">{sc.headline}</h1>
            <p className="mt-3 font-display italic text-lg text-ink2">{sc.one_liner}</p>
            <div className="mt-6 flex gap-2">
              {palette.slice(0, 4).map((hex, i) => (
                <span key={i} className="h-10 flex-1 rounded-md border border-black/5" style={{ backgroundColor: hex }} />
              ))}
            </div>
          </div>
        ) : (
          <h1 className="mt-10 font-display text-4xl text-ink tracking-tightest">{c.cardCtaTitle}</h1>
        )}

        <div className="mt-12 rounded-2xl border border-warm2 bg-surface p-6">
          <h2 className="font-display text-2xl text-ink tracking-tighter2">{c.cardCtaTitle}</h2>
          <p className="mt-2 text-ink2 leading-relaxed">{c.cardCtaBody}</p>
          <Link
            href={locale === "fr" ? "/fr/studio-read" : "/studio-read"}
            className="mt-5 inline-flex items-center rounded-xl bg-ink px-6 py-3 font-sans text-sm font-semibold text-surface no-underline hover:opacity-90 transition-opacity"
          >
            {c.cardCta}
          </Link>
        </div>
      </div>
    </main>
  );
}
