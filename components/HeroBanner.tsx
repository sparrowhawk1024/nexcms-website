"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types";

// Shown before any banners are added in Contentstack
const FALLBACK = [
  {
    uid: "fb1",
    title: "Neon Summer Sale",
    subtitle: "Massive discounts on the latest tech — don't miss out",
    badge: "⚡ Up to 70% Off",
    cta: "Shop Deals",
    href: "/deals",
    from: "#0b0213",
    via: "#1a0535",
    accent: "#22d3ee",
  },
  {
    uid: "fb2",
    title: "New Arrivals Dropped",
    subtitle: "Be the first to own tomorrow's technology, today",
    badge: "🆕 Just Launched",
    cta: "Explore New",
    href: "/new-arrivals",
    from: "#0b0213",
    via: "#170529",
    accent: "#d946ef",
  },
  {
    uid: "fb3",
    title: "#1 Best Sellers",
    subtitle: "The products your fellow neo-shoppers trust and love",
    badge: "🏆 Top Rated",
    cta: "See Best Sellers",
    href: "/best-sellers",
    from: "#0b0213",
    via: "#0f1530",
    accent: "#fbbf24",
  },
];

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners: csBanners }: HeroBannerProps) {
  const [active, setActive] = useState(0);
  const hasCMS = csBanners.length > 0;
  const count = hasCMS ? csBanners.length : FALLBACK.length;

  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);

  useEffect(() => {
    const id = setInterval(next, 4_500);
    return () => clearInterval(id);
  }, [next]);

  // ── CMS Banners ──────────────────────────────────────────────────────────
  if (hasCMS) {
    const b = csBanners[active];
    return (
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-[0_0_50px_rgba(217,70,239,0.1)] select-none">
        {b.desktop_image?.url && (
          <Image
            src={b.desktop_image.url}
            alt={b.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0213]/95 via-[#0b0213]/55 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14 max-w-2xl">
          {b.badge_text && (
            <span className="inline-block mb-4 px-3 py-1 text-[11px] font-black uppercase tracking-widest bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 rounded-full w-fit">
              {b.badge_text}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            {b.title}
          </h1>
          {b.subtitle && (
            <p className="text-fuchsia-200/75 text-base sm:text-lg mb-6 max-w-md">{b.subtitle}</p>
          )}
          {b.cta_label && b.cta_url && (
            <Link
              href={b.cta_url}
              className="w-fit px-7 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b0213] font-black text-sm uppercase tracking-widest rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_35px_rgba(34,211,238,0.8)] active:scale-95"
            >
              {b.cta_label} →
            </Link>
          )}
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 right-8 flex gap-2">
          {csBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                  : "w-2 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Fallback animated banners ─────────────────────────────────────────────
  const fb = FALLBACK[active];
  return (
    <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-[0_0_50px_rgba(217,70,239,0.1)] select-none transition-all duration-500">
      {/* Animated background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${fb.accent}18 0%, transparent 60%), linear-gradient(135deg, ${fb.from}, ${fb.via}, ${fb.from})`,
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow orb */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{ background: fb.accent }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16">
        <span
          className="inline-block mb-4 px-4 py-1 text-[11px] font-black uppercase tracking-widest border rounded-full w-fit transition-all duration-500"
          style={{
            color: fb.accent,
            borderColor: `${fb.accent}40`,
            background: `${fb.accent}12`,
          }}
        >
          {fb.badge}
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none mb-4 transition-all duration-500">
          {fb.title}
        </h2>
        <p className="text-fuchsia-200/65 text-base sm:text-lg mb-8 max-w-lg transition-all duration-500">
          {fb.subtitle}
        </p>
        <Link
          href={fb.href}
          className="w-fit px-8 py-3.5 font-black text-sm uppercase tracking-widest rounded-full transition-all text-[#0b0213] active:scale-95"
          style={{
            background: fb.accent,
            boxShadow: `0 0 25px ${fb.accent}55`,
          }}
        >
          {fb.cta} →
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 right-8 flex gap-2">
        {FALLBACK.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? "1.5rem" : "0.5rem",
              background: i === active ? fb.accent : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
