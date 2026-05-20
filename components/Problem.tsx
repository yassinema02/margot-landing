import { Fragment } from "react";
import type { LangContent } from "@/lib/content";

export function Problem({ t }: { t: LangContent }) {
  const parts = t.problem.split("—");
  return (
    <section className="max-w-[880px] mx-auto px-6 py-[clamp(64px,9vw,120px)] text-center">
      <div className="font-display font-normal text-ink2 opsz-96 text-[clamp(22px,2.4vw,30px)] leading-[1.45] tracking-tight5 [text-wrap:pretty]">
        {parts.map((part, i) =>
          i < parts.length - 1 ? (
            <Fragment key={i}>
              {part}
              <span className="text-peach">—</span>
            </Fragment>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
      </div>
    </section>
  );
}
