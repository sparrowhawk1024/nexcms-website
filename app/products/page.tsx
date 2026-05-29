import { getAllProducts, getProductCategories } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "All Products",
  description: "Browse the full NexStore catalogue — mobiles, laptops, headphones, speakers and more.",
};

interface PageProps {
  searchParams: Promise<{ category?: string; view?: "grid" | "list" }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category, view = "grid" } = await searchParams;

  const [products, categories] = await Promise.all([
    getAllProducts(category ? { category } : undefined).catch(() => []),
    getProductCategories().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-[#0b0213]">
      {/* Page header */}
      <div className="border-b border-fuchsia-500/20 bg-[#0f0320]/80 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-white mb-1">
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "All Products"}
          </h1>
          <p className="text-fuchsia-200/50 text-sm">
            {products.length} item{products.length !== 1 ? "s" : ""} available
          </p>

          {/* Category tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto hide-scrollbar pb-1">
            <Link
              href="/products"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                !category
                  ? "bg-cyan-500 text-[#0b0213] border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "border-fuchsia-500/30 text-fuchsia-200/70 hover:border-cyan-400/50 hover:text-cyan-400"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border capitalize ${
                  category === cat
                    ? "bg-fuchsia-500 text-white border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.4)]"
                    : "border-fuchsia-500/30 text-fuchsia-200/70 hover:border-fuchsia-400/50 hover:text-fuchsia-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* View toggle + sort */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link
              href={`/products${category ? `?category=${encodeURIComponent(category)}` : ""}${category ? "&" : "?"}view=grid`}
              className={`p-2 rounded-lg border transition-all ${
                view === "grid"
                  ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-400"
                  : "border-fuchsia-500/20 text-fuchsia-400/50 hover:border-fuchsia-400/40 hover:text-fuchsia-300"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
              </svg>
            </Link>
            <Link
              href={`/products${category ? `?category=${encodeURIComponent(category)}` : ""}${category ? "&" : "?"}view=list`}
              className={`p-2 rounded-lg border transition-all ${
                view === "list"
                  ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-400"
                  : "border-fuchsia-500/20 text-fuchsia-400/50 hover:border-fuchsia-400/40 hover:text-fuchsia-300"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z" />
              </svg>
            </Link>
          </div>

          <select className="border border-fuchsia-500/30 rounded-lg bg-white/5 px-3 py-1.5 text-sm outline-none cursor-pointer text-cyan-50 focus:ring-2 focus:ring-cyan-400 transition-all">
            <option className="bg-[#0b0213]">Sort: Trending</option>
            <option className="bg-[#0b0213]">Price: Low → High</option>
            <option className="bg-[#0b0213]">Price: High → Low</option>
            <option className="bg-[#0b0213]">Best Rating</option>
          </select>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-24 border border-fuchsia-500/10 rounded-2xl bg-fuchsia-500/5">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl font-semibold text-white mb-2">No products found</p>
            {category && (
              <Link href="/products" className="mt-4 inline-block px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#0b0213] font-bold text-sm rounded-full transition-all">
                View All Products
              </Link>
            )}
          </div>
        ) : view === "list" ? (
          <div className="space-y-4">
            {products.map((p) => (
              <ProductCard key={p.uid} product={p} variant="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.uid} product={p} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
