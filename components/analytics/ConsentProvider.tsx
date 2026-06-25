"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ConsentState = "granted" | "denied" | null;

const STORAGE_KEY = "margot:consent";

type ConsentContextValue = {
  /** null = undecided. */
  consent: ConsentState;
  /** false until the stored choice has been read on the client (avoids a banner flash for returning visitors). */
  hydrated: boolean;
  accept: () => void;
  decline: () => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  hydrated: false,
  accept: () => {},
  decline: () => {},
});

export const useConsent = () => useContext(ConsentContext);

// Replay the choice to gtag, which boots with everything denied via the
// Consent Mode default script in app/layout.tsx. No-op if GA isn't loaded.
function gtagConsentUpdate(granted: boolean): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  const value = granted ? "granted" : "denied";
  w.gtag?.("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

function readStored(): ConsentState {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setConsent(stored);
      if (stored === "granted") gtagConsentUpdate(true);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((value: "granted" | "denied") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage blocked — the choice just won't survive a reload */
    }
    setConsent(value);
    gtagConsentUpdate(value === "granted");
  }, []);

  const accept = useCallback(() => persist("granted"), [persist]);
  const decline = useCallback(() => persist("denied"), [persist]);

  return (
    <ConsentContext.Provider value={{ consent, hydrated, accept, decline }}>
      {children}
    </ConsentContext.Provider>
  );
}
