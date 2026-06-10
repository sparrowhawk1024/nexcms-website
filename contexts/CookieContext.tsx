"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CookieConsent {
  essential: true;      // Always true — required for cart & session
  analytics: boolean;   // Optional — site traffic analytics
  marketing: boolean;   // Optional — personalised recommendations & ads
  decided: boolean;     // Has the user made a choice yet?
  decidedAt?: string;   // ISO timestamp when the user last decided
}

export interface CookieCategory {
  id: keyof Omit<CookieConsent, "decided" | "decidedAt">;
  label: string;
  description: string;
  required: boolean;
  icon: string;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    label: "Essential Cookies",
    description:
      "Required for the site to function. These power your shopping cart, session security, and page navigation. Cannot be disabled.",
    required: true,
    icon: "🔒",
  },
  {
    id: "analytics",
    label: "Analytics Cookies",
    description:
      "Help us understand how visitors interact with NexStore — which pages are popular, where users drop off, and how we can improve. All data is anonymised.",
    required: false,
    icon: "📊",
  },
  {
    id: "marketing",
    label: "Personalisation Cookies",
    description:
      "Enable personalised product recommendations, targeted deals, and tailored content based on your browsing behaviour on NexStore.",
    required: false,
    icon: "✨",
  },
];

const STORAGE_KEY = "nexstore_cookie_consent";

const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  decided: false,
};

// ── Context ───────────────────────────────────────────────────────────────────

interface CookieContextType {
  consent: CookieConsent;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (partial: Partial<Pick<CookieConsent, "analytics" | "marketing">>) => void;
  saveConsent: (partial: Partial<Pick<CookieConsent, "analytics" | "marketing">>) => void;
  openPreferences: () => void;
  closeBanner: () => void;
  isPreferencesOpen: boolean;
}

const CookieContext = createContext<CookieContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function CookieProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydrate from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CookieConsent = JSON.parse(stored);
        // Ensure essential is always true (guard against corrupted data)
        setConsent({ ...parsed, essential: true });
        // Only show banner if user hasn't decided yet
        setShowBanner(!parsed.decided);
      } else {
        // First ever visit — show the banner
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
    setHydrated(true);
  }, []);

  // ── Persist to localStorage whenever consent changes (after hydration) ────
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // Storage might be unavailable in private mode — fail silently
    }
  }, [consent, hydrated]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const acceptAll = useCallback(() => {
    const updated: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      decided: true,
      decidedAt: new Date().toISOString(),
    };
    setConsent(updated);
    setShowBanner(false);
    setIsPreferencesOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const updated: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      decided: true,
      decidedAt: new Date().toISOString(),
    };
    setConsent(updated);
    setShowBanner(false);
    setIsPreferencesOpen(false);
  }, []);

  const updateConsent = useCallback(
    (partial: Partial<Pick<CookieConsent, "analytics" | "marketing">>) => {
      setConsent((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const saveConsent = useCallback(
    (partial: Partial<Pick<CookieConsent, "analytics" | "marketing">>) => {
      setConsent((prev) => ({
        ...prev,
        ...partial,
        decided: true,
        decidedAt: new Date().toISOString(),
      }));
      setShowBanner(false);
      setIsPreferencesOpen(false);
    },
    []
  );

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closeBanner = useCallback(() => setShowBanner(false), []);

  return (
    <CookieContext.Provider
      value={{
        consent,
        showBanner,
        acceptAll,
        rejectAll,
        updateConsent,
        saveConsent,
        openPreferences,
        closeBanner,
        isPreferencesOpen,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCookieConsent() {
  const ctx = useContext(CookieContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieProvider");
  return ctx;
}
