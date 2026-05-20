import type { ComparisonRow } from "@/lib/content";

interface Props {
  headers: { feature: string; margot: string; whering: string; aesty: string };
  rows: ComparisonRow[];
}

function Cell({ value }: { value: boolean }) {
  return value ? (
    <span aria-label="yes" className="text-sage font-display text-[22px] leading-none">
      ✓
    </span>
  ) : (
    <span aria-label="no" className="text-ink4 font-sans text-[18px] leading-none">
      –
    </span>
  );
}

export function ComparisonTable({ headers, rows }: Props) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-warm2 bg-surface">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-warm/40">
              <th className="text-left px-6 py-4 font-sans text-[11px] font-semibold uppercase tracking-wider2 text-ink3">
                {headers.feature}
              </th>
              <th className="px-6 py-4 font-display italic text-[18px] text-ink tracking-tight5 bg-[rgba(184,81,51,0.08)]">
                {headers.margot}
              </th>
              <th className="px-6 py-4 font-sans text-[13px] font-medium text-ink2 tracking-tight7">
                {headers.whering}
              </th>
              <th className="px-6 py-4 font-sans text-[13px] font-medium text-ink2 tracking-tight7">
                {headers.aesty}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i < rows.length - 1 ? "border-b border-warm2" : ""}>
                <td className="px-6 py-4 font-sans text-[14px] text-ink tracking-tight7">{row.feature}</td>
                <td className="px-6 py-4 text-center bg-[rgba(184,81,51,0.05)]">
                  <Cell value={row.margot} />
                </td>
                <td className="px-6 py-4 text-center">
                  <Cell value={row.whering} />
                </td>
                <td className="px-6 py-4 text-center">
                  <Cell value={row.aesty} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-warm2 bg-surface px-5 py-4">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-wider2 text-ink3 mb-3">
              {row.feature}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[rgba(184,81,51,0.08)] px-2 py-3">
                <div className="font-display italic text-[13px] text-ink mb-1">{headers.margot}</div>
                <Cell value={row.margot} />
              </div>
              <div className="rounded-xl bg-warm/30 px-2 py-3">
                <div className="font-sans text-[12px] text-ink2 mb-1">{headers.whering}</div>
                <Cell value={row.whering} />
              </div>
              <div className="rounded-xl bg-warm/30 px-2 py-3">
                <div className="font-sans text-[12px] text-ink2 mb-1">{headers.aesty}</div>
                <Cell value={row.aesty} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
