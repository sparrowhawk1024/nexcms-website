import Link from "next/link";
import type { CategoryPage } from "@/types";

interface CategoryGridProps {
  categories: CategoryPage[];
}

// Shown when no category_page entries exist in Contentstack yet
const FALLBACK: { uid: string; title: string; icon: string; slug: string }[] = [
  { uid: "f-all",         title: "All",         icon: "🛍️", slug: "" },
  { uid: "f-mobiles",     title: "Mobiles",      icon: "📱", slug: "mobiles" },
  { uid: "f-laptops",     title: "Laptops",      icon: "💻", slug: "laptop" },
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
  const items =
    categories.length > 0
      ? categories.map((c) => ({ uid: c.uid, title: c.title, icon: c.icon ?? "🛍️", slug: c.slug }))
      : FALLBACK;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
      {items.map((cat) => (
        <Link
          key={cat.uid}
          href={cat.slug ? `/?category=${encodeURIComponent(cat.slug)}` : "/"}
          className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-fuchsia-500/10 bg-[#170529]/40 backdrop-blur-sm hover:border-cyan-400/50 hover:bg-cyan-400/5 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all duration-300 text-center min-w-0"
        >
          <span className="text-2xl group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
            {cat.icon}
          </span>
          <span className="text-[10px] sm:text-xs text-fuchsia-200/60 group-hover:text-cyan-300 font-medium transition-colors leading-tight truncate w-full">
            {cat.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
