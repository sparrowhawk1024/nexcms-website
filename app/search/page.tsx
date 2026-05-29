import { searchProducts, getProductCategories } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 0; // always fresh for search

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search Results` : "Search",
    description: q ? `Search results for "${q}" on NexStore` : "Search NexStore products",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", category } = await searchParams;
  const query = q.trim();

  const [rawResults, categories] = await Promise.all([
    query ? searchProducts(query).catch(() => []) : Promise.resolve([]),
    getProductCategories().catch(() => []),
  ]);

  const results = category
    ? rawResults.filter((p) => p.category === category)
    : rawResults;

  return (
    <div className="min-h-screen bg-[#0b0213]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Search header */}
        <div className="mb-8">
          {query ? (
            <>
              <p className="text-fuchsia-400/50 text-sm uppercase tracking-wider font-bold mb-2">
                Search Results
              </p>
              <h1 className="text-3xl font-black text-white">
                {results.length > 0 ? (
                  <>
                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                      &quot;{query}&quot;
                    </span>
                  </>
                ) : (
                  <>
                    No results for{" "}
                    <span className="text-fuchsia-400">&quot;{query}&quot;</span>
                  </>
                )}
              </h1>
            </>
          ) : (
            <h1 className="text-3xl font-black text-white">Search NexStore</h1>
          )}
        </div>

        {/* Category filter pills */}
        {query && rawResults.length > 0 && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                !category
                  ? "bg-cyan-500 text-[#0b0213] border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                  : "border-fuchsia-500/30 text-fuchsia-200/70 hover:border-cyan-400/50 hover:text-cyan-400"
              }`}
            >
              All ({rawResults.length})
            </Link>
            {categories
              .filter((cat) => rawResults.some((p) => p.category === cat))
              .map((cat) => {
                const count = rawResults.filter((p) => p.category === cat).length;
                return (
                  <Link
                    key={cat}
                    href={`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                      category === cat
                        ? "bg-fuchsia-500 text-white border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.4)]"
                        : "border-fuchsia-500/30 text-fuchsia-200/70 hover:border-fuchsia-400/50 hover:text-fuchsia-200"
                    }`}
                  >
                    {cat} ({count})
                  </Link>
                );
              })}
          </div>
        )}

        {/* Results or empty states */}
        {!query ? (
          <div className="text-center py-24 border border-fuchsia-500/10 rounded-2xl bg-fuchsia-500/5">
            <p className="text-6xl mb-5">🔍</p>
            <p className="text-xl font-semibold text-white mb-2">Start searching</p>
            <p className="text-fuchsia-400/50 text-sm mb-8">
              Type a product name, brand, or category in the search bar above
            </p>
            {/* Quick category links */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["mobiles", "laptops", "headphones", "speakers"].map((cat) => (
                <Link
                  key={cat}
                  href={`/search?q=${cat}`}
                  className="px-4 py-2 border border-fuchsia-500/30 hover:border-cyan-400/50 rounded-full text-sm text-fuchsia-200/60 hover:text-cyan-400 transition-all capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-24 border border-fuchsia-500/10 rounded-2xl bg-fuchsia-500/5">
            <p className="text-5xl mb-5">🤔</p>
            <p className="text-xl font-semibold text-white mb-2">
              No products found for &quot;{query}&quot;
            </p>
            <p className="text-fuchsia-400/50 text-sm mb-8">
              Try a different spelling or browse by category
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="px-4 py-2 border border-fuchsia-500/30 hover:border-cyan-400/50 rounded-full text-sm text-fuchsia-200/60 hover:text-cyan-400 transition-all capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {results.map((p) => (
              <ProductCard key={p.uid} product={p} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
