"use client";

import { useState } from "react";
import type { LangContent } from "@/lib/content";

interface ItemProps {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ q, a, isOpen, onToggle }: ItemProps) {
  return (
    <div className="border-b border-warm2">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left py-6 bg-transparent border-none cursor-pointer flex items-center justify-between gap-6"
      >
        <span className="font-display font-normal opsz-96 text-ink text-[clamp(20px,2.2vw,28px)] leading-[1.25] tracking-tight4">
          {q}
        </span>
        <span
          className="font-display text-[30px] text-ink3 font-light leading-none flex-shrink-0"
          style={{
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 240ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="grid"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-7 pr-6 font-sans text-[15px] leading-[1.6] text-ink2 tracking-tight7 max-w-[720px] [text-wrap:pretty]">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ t }: { t: LangContent }) {
  const [open, setOpen] = useState<number>(-1);
  return (
    <section className="max-w-[880px] mx-auto px-6 py-[clamp(64px,8vw,120px)]">
      <div className="mb-8">
        <div className="font-display font-normal text-ink opsz-144 text-[clamp(28px,3.4vw,44px)] leading-none tracking-tight2">
          {t.faqHeading}
        </div>
      </div>
      <div>
        {t.faq.map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}
