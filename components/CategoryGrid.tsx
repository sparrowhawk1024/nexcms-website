"use client";

import Link from "next/link";
import type { CategoryPage } from "@/types";
import { usePersonalization } from "@/contexts/PersonalizationContext";

interface CategoryGridProps {
  categories: CategoryPage[];
}

// Shown when no category_page entries exist in Contentstack yet
const FALLBACK: { uid: string; title: string; icon: string; slug: string }[] = [
  { uid: "f-all",         title: "All",         icon: "🛍️", slug: "" },
  { uid: "f-mobiles",     title: "Mobiles",      icon: "📱", slug: "mobiles" },
  { uid: "f-laptops",     title: "Laptops",      icon: "💻", slug: "laptops" },
  { uid: "f-headphones",  title: "Headphones",   icon: "🎧", slug: "headphones" },
  { uid: "f-speakers",    title: "Speakers",     icon: "🔊", slug: "speakers" },
  { uid: "f-accessories", title: "Accessories",  icon: "⌨️", slug: "accessories" },
  { uid: "f-wearables",   title: "Wearables",    icon: "⌚", slug: "wearables" },
  { uid: "f-tv",          title: "TVs",          icon: "📺", slug: "tv" },
  { uid: "f-cameras",     title: "Cameras",      icon: "📷", slug: "cameras" },
  { uid: "f-gaming",      title: "Gaming",       icon: "🎮", slug: "gaming" },
  { uid: "f-tablets",     title: "Tablets",      icon: "📲", slug: "tablets" },
  { uid: "f-appliances",  title: "Appliances",   icon: "🏠", slug: "appliances" },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { trackCategoryClick, topCategory } = usePersonalization();

  const items =
    categories.length > 0
      ? categories.map((c) => ({ uid: c.uid, title: c.title, icon: c.icon ?? "🛍️", slug: c.slug }))
      : FALLBACK;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
      {items.map((cat) => {
        const isTop = cat.slug && cat.slug === topCategory;
        return (
          <Link
            key={cat.uid}
            href={cat.slug ? `/?category=${encodeURIComponent(cat.slug)}` : "/"}
            onClick={() => cat.slug && trackCategoryClick(cat.slug)}
            className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 text-center min-w-0 ${
              isTop
                ? "border-fuchsia-400/60 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.12)]"
                : "border-fuchsia-500/10 bg-[#170529]/40 backdrop-blur-sm hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            }`}
          >
            {/* "Your fave" indicator dot */}
            {isTop && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
            )}
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
              {cat.icon}
            </span>
            <span className={`text-[10px] sm:text-xs font-medium transition-colors leading-tight truncate w-full ${
              isTop ? "text-fuchsia-300" : "text-fuchsia-200/60 group-hover:text-cyan-300"
            }`}>
              {cat.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
