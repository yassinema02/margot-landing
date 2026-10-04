// Typographic helpers for the comparison and alternatives pages. Same shapes
// and classes as the hand-written guides, so the pages read as one family.

export function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10" id={id}>
      <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-tight4 mt-12 mb-4 [text-wrap:balance]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="font-display font-normal text-ink opsz-96 text-[clamp(19px,2vw,22px)] leading-[1.25] tracking-tight4 mt-8 mb-3 [text-wrap:balance]">
      {children}
    </h3>
  );
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-4 max-w-[640px] ${className ?? ""}`}>
      {children}
    </p>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="font-sans text-[16px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-6 mb-5 space-y-2 max-w-[640px]">{children}</ul>;
}

export function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

/** Comparison table: first column is the row label. Scrolls sideways on narrow screens instead of squeezing. */
export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6 -mx-6 px-6">
      <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-warm2">
            {head.map((cell) => (
              <th key={cell} scope="col" className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3 align-bottom">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr key={label} className="border-b border-warm2/60 last:border-b-0">
              <th scope="row" className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7 align-top">
                {label}
              </th>
              {cells.map((cell, i) => (
                <td key={i} className="py-3 pr-4 font-sans text-[14px] leading-[1.5] text-ink2 tracking-tight7 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
