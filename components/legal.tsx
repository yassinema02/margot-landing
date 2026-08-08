import Link from "next/link";

// Shared typography for legal pages (/privacy, /terms, /mentions-legales and
// their French counterparts). Extracted from app/privacy/page.tsx so every
// legal page renders identically.

export function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      {title && (
        <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(20px,2.2vw,26px)] leading-[1.2] tracking-tight4 mt-10 mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 mb-3">
      <h3 className="font-display italic text-ink2 opsz-96 text-[16px] leading-[1.3] tracking-tight5 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-3 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-5 my-3 space-y-1.5">
      {children}
    </ul>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export function Hr() {
  return <hr className="my-10 border-0 h-px bg-warm2" />;
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
      {children}
    </th>
  );
}

export function Tr({ cells }: { cells: string[] }) {
  return (
    <tr className="border-b border-warm2/60 last:border-b-0">
      {cells.map((c, i) => (
        <td
          key={i}
          className={`py-3 pr-4 font-sans text-[14px] tracking-tight7 ${i === 0 ? "font-medium text-ink" : "text-ink2"}`}
        >
          {c}
        </td>
      ))}
    </tr>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
    >
      {label}
    </Link>
  );
}

export function LegalMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">{children}</article>
    </main>
  );
}

// Identity block for the publisher — single source of truth for company facts.
export const COMPANY = {
  name: "YAVREN",
  form: { fr: "société par actions simplifiée (SAS)", en: "a French simplified joint-stock company (SAS)" },
  capital: { fr: "5 000 €", en: "€5,000" },
  address: "78 avenue des Champs-Élysées, Bureau 326, 75008 Paris, France",
  siret: "108 367 863 00017",
  rcs: { fr: "RCS Paris 108 367 863", en: "Paris Trade and Companies Register (RCS) no. 108 367 863" },
  publicationDirector: "Yassine Benlahmr",
  contactEmail: "margot@margotwardrobe.com",
} as const;
