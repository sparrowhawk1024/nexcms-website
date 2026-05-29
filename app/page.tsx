import Link from "next/link";
import {
  getAllProducts,
  getProductCategories,
  getCategoryPages,
  getBanners,
  getDeals,
  getBestSellers,
  getNewArrivals,
} from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import DealCard from "@/components/DealCard";
import SectionHeader from "@/components/SectionHeader";

export const revalidate = 60;

type SidebarItem = { label: string; href: string; checkbox?: boolean };
type SidebarSection = { title: string; items: SidebarItem[] };

const STATIC_SIDEBAR: SidebarSection[] = [
  {
    title: "Hyper-Delivery",
    items: [{ label: "Free Delivery", href: "#", checkbox: true }],
  },
  {
    title: "Availability",
    items: [{ label: "In Stock Only", href: "#", checkbox: true }],
  },
  {
    title: "Deals & Drops",
    items: [{ label: "🔥 Today's Deals", href: "/deals" }],
  },
];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams.category;

  const [products, categories, categoryPages, banners, deals, bestSellers, newArrivals] =
    await Promise.all([
      getAllProducts(categoryFilter ? { category: categoryFilter } : undefined).catch(() => []),
      getProductCategories().catch(() => []),
      getCategoryPages().catch(() => []),
      getBanners().catch(() => []),
      getDeals().catch(() => []),
      getBestSellers(8).catch(() => []),
      getNewArrivals(8).catch(() => []),
    ]);

  const total = products.length;

  return (
    <div className="bg-transparent min-h-screen text-fuchsia-50">

      {/* ── Full-width sections (no sidebar constraint) ──────────────── */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-6 space-y-10">

        {/* Hero Banner */}
        <HeroBanner banners={banners} />

        {/* Category Grid */}
        <section>
          <SectionHeader title="Shop by Category" icon="🛍️" subtitle="Find exactly what you need" />
          <CategoryGrid categories={categoryPages} />
        </section>

        {/* Deals of the Day */}
        {deals.length > 0 && (
          <section>
            <SectionHeader
              title="Deals of the Day"
              icon="🔥"
              subtitle="Limited time — grab them before they're gone"
              viewAllHref="/deals"
              accent="fuchsia"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {deals.slice(0, 4).map((deal) => (
                <DealCard key={deal.uid} deal={deal} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section>
            <SectionHeader
              title="Best Sellers"
              icon="🏆"
              subtitle="Our most loved products right now"
              viewAllHref="/best-sellers"
              accent="amber"
            />
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {bestSellers.map((p, i) => (
                <div key={p.uid} className="flex-shrink-0 w-[220px]">
                  <ProductCard product={p} variant="grid" rank={i + 1} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section>
            <SectionHeader
              title="New Arrivals"
              icon="🆕"
              subtitle="Just dropped — be the first to own it"
              viewAllHref="/new-arrivals"
              accent="cyan"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newArrivals.slice(0, 5).map((p) => (
                <ProductCard key={p.uid} product={p} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Results bar ─────────────────────────────────────────────── */}
      <div className="bg-[#0b0213]/90 backdrop-blur-md border-y border-fuchsia-500/20 px-6 py-3 text-[13px] shadow-[0_4px_15px_rgba(217,70,239,0.05)] relative z-40 mt-10">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-fuchsia-200/75 tracking-wide">
            1–{total} of{" "}
            <strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{total}</strong>{" "}
            results for{" "}
            <span className="text-fuchsia-400 font-semibold drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
              &quot;{categoryFilter || "all products"}&quot;
            </span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-fuchsia-200/50 uppercase tracking-wider text-[11px] font-bold">
              Sort by:
            </span>
            <select className="border border-fuchsia-500/30 rounded-md bg-white/5 hover:bg-white/10 px-3 py-1.5 text-sm outline-none cursor-pointer text-cyan-50 focus:ring-2 focus:ring-cyan-400 transition-all font-medium backdrop-blur-md">
              <option className="bg-[#0b0213]">Trending</option>
              <option className="bg-[#0b0213]">Price: Low → High</option>
              <option className="bg-[#0b0213]">Price: High → Low</option>
              <option className="bg-[#0b0213]">Best Rating</option>
              <option className="bg-[#0b0213]">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Page body: sidebar + product grid ───────────────────────── */}
      <div className="max-w-[1500px] mx-auto flex items-start gap-0 px-4 sm:px-6 py-8">

        {/* Left Sidebar */}
        <aside className="hidden md:block w-[230px] flex-shrink-0 pr-8 pt-2 border-r border-fuchsia-500/20 self-start sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">

          {/* User Rating */}
          <div className="mb-7">
            <h3 className="text-[13px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
              User Rating
            </h3>
            {[4, 3, 2, 1].map((n) => (
              <div key={n} className="flex items-center gap-1.5 cursor-pointer group py-1">
                <span className="text-amber-400 text-sm">{" ★".repeat(n)}</span>
                <span className="text-fuchsia-500/20 text-sm">{" ★".repeat(4 - n)}</span>
                <span className="text-[12px] text-fuchsia-200/55 group-hover:text-cyan-400 transition-colors ml-1">
                  &amp; Up
                </span>
              </div>
            ))}
          </div>

          <hr className="border-fuchsia-500/20 my-5" />

          {/* Static sidebar sections */}
          {STATIC_SIDEBAR.map((section) => (
            <div key={section.title} className="mb-7">
              <h3 className="text-[13px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.checkbox ? (
                      <label className="flex items-center gap-3 text-[12px] cursor-pointer group">
                        <input
                          type="checkbox"
                          className="appearance-none w-4 h-4 border border-fuchsia-500/50 rounded-sm bg-transparent checked:bg-cyan-500 checked:border-cyan-400 transition-colors cursor-pointer"
                        />
                        <span className="text-fuchsia-100 group-hover:text-cyan-400 transition-colors">
                          {item.label}
                        </span>
                      </label>
                    ) : (
                      <a
                        href={item.href}
                        className="text-[12px] text-fuchsia-100 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/30 group-hover:bg-cyan-400 transition-all" />
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <hr className="border-fuchsia-500/20 my-5" />

          {/* Dynamic Categories */}
          <div className="mb-7">
            <h3 className="text-[13px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
              Category
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/"
                  className={`text-[12px] flex items-center gap-2 group transition-colors ${
                    !categoryFilter ? "text-cyan-400 font-bold" : "text-fuchsia-100 hover:text-cyan-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      !categoryFilter
                        ? "bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]"
                        : "bg-fuchsia-500/30 group-hover:bg-cyan-400"
                    }`}
                  />
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className={`text-[12px] flex items-center gap-2 group transition-colors ${
                      categoryFilter === cat
                        ? "text-cyan-400 font-bold"
                        : "text-fuchsia-100 hover:text-cyan-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        categoryFilter === cat
                          ? "bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]"
                          : "bg-fuchsia-500/30 group-hover:bg-cyan-400"
                      }`}
                    />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Product Area */}
        <div className="flex-1 min-w-0 md:pl-8">
          {/* Prime banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#170529] to-[#0b0213] border border-fuchsia-500/30 p-5 sm:p-7 mb-8 shadow-[0_0_30px_rgba(217,70,239,0.1)] group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700" />
            <div className="relative flex flex-col sm:flex-row items-center gap-5 z-10">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-black text-[44px] italic shrink-0 leading-none">
                NEX<span className="text-fuchsia-400">+</span>
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-white tracking-wide">
                  NexStore Prime Protocol
                </h2>
                <p className="text-[13px] text-fuchsia-200/60 mt-1 max-w-lg leading-relaxed">
                  Unlock unlimited hyper-delivery, exclusive neo-deals, and priority matrix access.
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-[12px] font-medium">
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
                    Initiate Protocol
                  </a>
                  <span className="text-fuchsia-500/40">|</span>
                  <a href="#" className="text-fuchsia-400 hover:text-fuchsia-300 transition-all">
                    Manage Access
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Results label */}
          <div className="flex items-end gap-3 mb-6">
            <h1 className="text-[24px] font-bold text-white leading-none tracking-tight">
              {categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : "All Products"}
            </h1>
            <p className="text-[12px] text-fuchsia-200/40 mb-0.5">{total} items found</p>
          </div>

          {/* Product grid or empty state */}
          {products.length === 0 ? (
            <div className="text-center py-24 text-fuchsia-200/30 border border-fuchsia-500/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <p className="text-5xl mb-4 animate-pulse">⚡</p>
              <p className="text-xl font-medium text-white">No products found.</p>
              <p className="text-sm mt-2">
                {categoryFilter
                  ? `No products in "${categoryFilter}" yet.`
                  : "Add product entries in Contentstack to populate this grid."}
              </p>
              {categoryFilter && (
                <Link
                  href="/"
                  className="inline-block mt-6 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0b0213] font-bold text-sm rounded-full transition-all"
                >
                  View All Products
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.uid} product={p} variant="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
