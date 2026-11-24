"use client";

import { useState } from "react";

export function CopyReferralCode({ code, label, copy, copied, manual }: {
  code: string; label: string; copy: string; copied: string; manual: string;
}) {
  const [feedback, setFeedback] = useState("");
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback(copied);
    } catch {
      setFeedback(manual);
    }
  }
  return <div className="ph-no-capture">
    <p>{label}<strong className="block select-all text-2xl tracking-widest">{code}</strong></p>
    <button type="button" className="min-h-11 underline" onClick={copyCode}>{copy}</button>
    <p role="status" className="text-sm">{feedback}</p>
  </div>;
}
