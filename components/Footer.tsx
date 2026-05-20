import type { LangContent } from "@/lib/content";
import { MargotSVG } from "./MargotSVG";

export function Footer({ t }: { t: LangContent }) {
  return (
    <footer className="bg-surface border-t border-warm2 px-6 py-14">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        <div className="flex justify-between items-center gap-8 flex-wrap">
          <div className="flex items-center gap-3.5">
            <MargotSVG state="considering" size={44} showLegs={false} crop="portrait" />
            <div>
              <div className="font-display italic font-normal text-[26px] text-ink opsz-96 tracking-tight3 leading-none">
                Margot<span className="text-peach not-italic">.</span>
              </div>
              <div className="font-display italic text-[13px] text-ink3 mt-1">{t.footer.tagline}</div>
            </div>
          </div>

          <nav className="flex gap-[clamp(14px,2vw,28px)] flex-wrap items-center">
            {t.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="font-sans text-[13px] font-medium text-ink2 no-underline tracking-tight7 pb-0.5 border-b border-transparent hover:border-peach hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-warm2 flex justify-between items-center gap-4 flex-wrap">
          <div className="font-sans text-xs text-ink3 tracking-[0.04em]">{t.footer.madeIn}</div>
          <div className="font-sans text-[11px] text-ink3 tracking-[0.06em]">{t.footer.legal}</div>
        </div>
      </div>
    </footer>
  );
}
