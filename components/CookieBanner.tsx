"use client";

import { useEffect, useState } from "react";
import {
  useCookieConsent,
  COOKIE_CATEGORIES,
  type CookieConsent,
} from "@/contexts/CookieContext";

// ── Preferences Modal ─────────────────────────────────────────────────────────

function PreferencesModal() {
  const { consent, updateConsent, saveConsent, acceptAll, closeBanner, isPreferencesOpen } =
    useCookieConsent();

  // Local draft state so changes aren't committed until "Save Preferences"
  const [draft, setDraft] = useState({
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  // Sync draft when modal opens
  useEffect(() => {
    if (isPreferencesOpen) {
      setDraft({ analytics: consent.analytics, marketing: consent.marketing });
    }
  }, [isPreferencesOpen, consent.analytics, consent.marketing]);

  if (!isPreferencesOpen) return null;

  function handleToggle(id: keyof typeof draft) {
    setDraft((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSave() {
    updateConsent(draft);
    saveConsent(draft);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
        onClick={closeBanner}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie Preferences"
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-lg rounded-2xl border border-fuchsia-500/40 bg-[#0d0220]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(217,70,239,0.25)] overflow-hidden">
          {/* Glow accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400" />
          <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="px-6 pt-7 pb-5 border-b border-fuchsia-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                🍪
              </div>
              <div>
                <h2 className="text-white font-black text-lg tracking-tight">
                  Cookie Preferences
                </h2>
                <p className="text-fuchsia-300/60 text-xs mt-0.5">
                  Manage what data NexStore can collect
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
            {COOKIE_CATEGORIES.map((cat) => {
              const isOn = cat.id === "essential" ? true : draft[cat.id as keyof typeof draft];

              return (
                <div
                  key={cat.id}
                  className="group relative rounded-xl border border-fuchsia-500/20 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5 shrink-0">{cat.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-sm">{cat.label}</h3>
                          {cat.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/30">
                              Always On
                            </span>
                          )}
                        </div>
                        <p className="text-fuchsia-200/50 text-xs mt-1.5 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      id={`cookie-toggle-${cat.id}`}
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`Toggle ${cat.label}`}
                      disabled={cat.required}
                      onClick={() =>
                        !cat.required && handleToggle(cat.id as keyof typeof draft)
                      }
                      className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d0220] ${
                        cat.required
                          ? "cursor-not-allowed opacity-70 focus:ring-cyan-500 bg-cyan-500"
                          : isOn
                          ? "bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-[0_0_12px_rgba(217,70,239,0.5)] cursor-pointer focus:ring-fuchsia-500"
                          : "bg-white/10 border border-white/20 cursor-pointer focus:ring-fuchsia-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          isOn ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="px-6 pb-6 pt-4 border-t border-fuchsia-500/20 flex flex-col sm:flex-row gap-3">
            <button
              id="cookie-save-preferences"
              onClick={handleSave}
              className="flex-1 py-2.5 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-200 active:scale-[0.98]"
            >
              Save My Preferences
            </button>
            <button
              id="cookie-accept-all-modal"
              onClick={acceptAll}
              className="flex-1 py-2.5 px-5 rounded-xl font-bold text-sm text-[#0b0213] bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.98]"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Cookie Banner ─────────────────────────────────────────────────────────────

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences, consent } = useCookieConsent();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate banner in with a slight delay after mount
  useEffect(() => {
    if (mounted && showBanner) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [mounted, showBanner]);

  if (!mounted) return null;

  // Format the last decided date for returning users
  const lastDecided = consent.decidedAt
    ? new Date(consent.decidedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isReturningUser = consent.decided;

  return (
    <>
      {/* ── Floating Banner ────────────────────────────────────────────── */}
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          style={{
            transform: visible ? "translateY(0)" : "translateY(120%)",
            opacity: visible ? 1 : 0,
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
          }}
          className="fixed bottom-0 left-0 right-0 z-[9998] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none"
        >
          <div className="pointer-events-auto max-w-4xl mx-auto relative overflow-hidden rounded-2xl border border-fuchsia-500/40 bg-[#0d0220]/96 backdrop-blur-xl shadow-[0_-10px_60px_rgba(217,70,239,0.2),0_0_0_1px_rgba(217,70,239,0.1)]">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />

            {/* Ambient glow blobs */}
            <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-fuchsia-700/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                {/* Icon + Text */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600/80 to-cyan-600/60 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(217,70,239,0.4)] border border-fuchsia-500/30">
                    🍪
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-white font-black text-base tracking-tight">
                        {isReturningUser ? "Your Cookie Preferences" : "We value your privacy"}
                      </h2>
                      {isReturningUser && lastDecided && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-medium">
                          Last updated {lastDecided}
                        </span>
                      )}
                    </div>

                    {isReturningUser ? (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {/* Show current consent summary as pills */}
                        {[
                          { label: "Essential", on: consent.essential, icon: "🔒" },
                          { label: "Analytics", on: consent.analytics, icon: "📊" },
                          { label: "Personalisation", on: consent.marketing, icon: "✨" },
                        ].map((c) => (
                          <span
                            key={c.label}
                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                              c.on
                                ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40"
                                : "bg-white/5 text-fuchsia-200/40 border-white/10 line-through"
                            }`}
                          >
                            <span>{c.icon}</span>
                            {c.label}
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                c.on ? "bg-fuchsia-400" : "bg-white/20"
                              }`}
                            />
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-fuchsia-200/55 text-xs mt-1.5 leading-relaxed max-w-xl">
                        NexStore uses cookies to keep your cart alive, understand how you shop, and serve you personalised deals. You choose what you allow.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    id="cookie-reject-all"
                    onClick={rejectAll}
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-bold text-fuchsia-300/70 bg-white/5 hover:bg-white/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                  >
                    Reject Optional
                  </button>
                  <button
                    id="cookie-manage-preferences"
                    onClick={openPreferences}
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-bold text-fuchsia-200 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/30 hover:border-fuchsia-500/60 transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                  >
                    {isReturningUser ? "Update Preferences" : "Manage Preferences"}
                  </button>
                  <button
                    id="cookie-accept-all"
                    onClick={acceptAll}
                    className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-black text-[#0b0213] bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:from-cyan-300 hover:to-fuchsia-300 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.97] whitespace-nowrap"
                  >
                    Accept All ✓
                  </button>
                </div>
              </div>

              {/* Footer note */}
              <p className="text-fuchsia-200/25 text-[10px] mt-4 leading-relaxed">
                By clicking &ldquo;Accept All&rdquo;, you agree to our use of cookies for analytics and personalisation.{" "}
                <a href="#" className="underline hover:text-fuchsia-300/60 transition-colors">
                  Cookie Policy
                </a>{" "}
                ·{" "}
                <a href="#" className="underline hover:text-fuchsia-300/60 transition-colors">
                  Privacy Notice
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal (rendered outside the banner for proper z-stacking) */}
      <PreferencesModal />
    </>
  );
}
