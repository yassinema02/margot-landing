"use client";

import { useEffect, useState } from "react";

interface Props {
  fallback: string;
  template: string; // "Join {n} others on the waitlist."
}

export function WaitlistCounter({ fallback, template }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/waitlist-count")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const n = typeof data?.count === "number" ? data.count : null;
        setCount(n);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) {
    return <p className="font-sans text-[13px] text-ink3 tracking-tight7">{fallback}</p>;
  }
  return (
    <p className="font-sans text-[13px] text-ink3 tracking-tight7">
      {template.replace("{n}", count.toLocaleString("en-US"))}
    </p>
  );
}
