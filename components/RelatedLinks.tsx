import Link from "next/link";

export type RelatedLink = { href: string; title: string; blurb: string };

/** "Keep reading" block: descriptive links to the closest pages, so readers and crawlers move between related guides. */
export function RelatedLinks({ title, links }: { title: string; links: RelatedLink[] }) {
  if (!links.length) return null;
  return (
    <nav aria-label={title} className="mt-16 border-t border-warm2 pt-10">
      <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 m-0 mb-6">{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
        {links.map((l) => (
          <li key={l.href} className="rounded-2xl border border-warm2 bg-surface p-5">
            <Link href={l.href} className="font-sans text-[16px] font-semibold text-ink no-underline hover:underline decoration-peach underline-offset-4">
              {l.title}
            </Link>
            <p className="mt-2 mb-0 font-sans text-[14px] leading-[1.55] text-ink3 [text-wrap:pretty]">{l.blurb}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
