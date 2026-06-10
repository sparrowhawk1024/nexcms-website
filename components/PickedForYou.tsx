"use client";

import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { useCookieConsent } from "@/contexts/CookieContext";
import type { Product } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  mobiles:     "Mobiles",
  laptops:     "Laptops",
  headphones:  "Headphones",
  speakers:    "Speakers",
  tablets:     "Tablets",
  accessories: "Accessories",
  wearables:   "Wearables",
  tv:          "TVs",
  cameras:     "Cameras",
  gaming:      "Gaming",
};

interface PickedForYouProps {
  allProducts: Product[];
}

export default function PickedForYou({ allProducts }: PickedForYouProps) {
  const { topCategory, recentlyViewed, hydrated } = usePersonalization();
  const { consent } = useCookieConsent();

  // Only show if marketing consent is given AND we have enough data
  const shouldShow = hydrated && consent.marketing && topCategory && recentlyViewed.length >= 2;

  const recommended = useMemo(() => {
    if (!topCategory || !shouldShow) return [];

    const viewedUids = new Set(recentlyViewed.map((v) => v.uid));

    // Filter to top category, exclude already-viewed, sort by rating desc
    return allProducts
      .filter(
        (p) =>
          p.category === topCategory &&
          !viewedUids.has(p.uid) &&
          p.in_stock
      )
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5);
  }, [topCategory, allProducts, recentlyViewed, shouldShow]);

  if (!shouldShow || recommended.length === 0) return null;

  const categoryLabel = CATEGORY_LABELS[topCategory!] ?? topCategory;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Personalisation marker */}
          <div className="relative">
            <span className="text-2xl">✨</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fuchsia-500 border-2 border-[#0b0213] animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-black text-lg tracking-tight leading-none">
              Picked for You
            </h2>
            <p className="text-fuchsia-400/50 text-xs mt-0.5">
              Because you browse{" "}
              <span className="text-cyan-400 font-semibold">{categoryLabel}</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] text-fuchsia-500/30 border border-fuchsia-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
          ✨ Personalised
        </span>
      </div>

      {/* Product row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommended.map((p) => (
          <ProductCard key={p.uid} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
