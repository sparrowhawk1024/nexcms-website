"use client";

import Link from "next/link";
import Image from "next/image";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { useCookieConsent } from "@/contexts/CookieContext";
import type { ViewedProduct } from "@/contexts/PersonalizationContext";

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);

function RecentCard({ item }: { item: ViewedProduct }) {
  const discount =
    item.compare_price && item.compare_price > item.price
      ? Math.round(((item.compare_price - item.price) / item.compare_price) * 100)
      : null;

  return (
    <Link
      href={`/products/${item.uid}`}
      className="group flex-shrink-0 w-[155px] sm:w-[170px] relative rounded-2xl border border-fuchsia-500/20 bg-[#100120]/80 hover:border-fuchsia-400/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.12)] transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-[130px] bg-[#170529]/60 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="170px"
          />
        ) : (
          <span className="text-4xl text-fuchsia-500/20">📦</span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-500/90 text-white">
            -{discount}%
          </span>
        )}
        {!item.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-red-400 bg-black/70 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {item.brand && (
          <p className="text-[10px] text-cyan-400/70 font-semibold uppercase tracking-wider mb-0.5">
            {item.brand}
          </p>
        )}
        <p className="text-white text-xs font-bold leading-tight line-clamp-2 group-hover:text-fuchsia-200 transition-colors">
          {item.title}
        </p>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-fuchsia-100 font-black text-sm">₹{fmt(item.price)}</span>
          {item.compare_price && item.compare_price > item.price && (
            <span className="text-fuchsia-500/40 text-[10px] line-through">
              ₹{fmt(item.compare_price)}
            </span>
          )}
        </div>
        {item.rating && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-amber-400 text-[10px]">★</span>
            <span className="text-fuchsia-200/50 text-[10px]">{item.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function RecentlyViewed() {
  const { recentlyViewed, hydrated } = usePersonalization();
  const { consent } = useCookieConsent();

  // Show recently viewed even without marketing consent (it's essential UX)
  // but gate "personalised for you" messaging behind marketing consent
  if (!hydrated || recentlyViewed.length === 0) return null;

  const isPersonalised = consent.marketing;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕐</span>
          <div>
            <h2 className="text-white font-black text-lg tracking-tight leading-none">
              Recently Viewed
            </h2>
            {isPersonalised && (
              <p className="text-fuchsia-400/50 text-xs mt-0.5">
                Picked up where you left off
              </p>
            )}
          </div>
        </div>
        <span className="text-[11px] text-fuchsia-500/30 border border-fuchsia-500/15 px-2.5 py-1 rounded-full">
          {recentlyViewed.length} item{recentlyViewed.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Scroll row */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {recentlyViewed.map((item) => (
          <RecentCard key={item.uid} item={item} />
        ))}
      </div>
    </section>
  );
}
