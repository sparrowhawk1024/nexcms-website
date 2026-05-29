import { getBestSellers } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "NexStore's most loved and highly rated products. Shop the #1 best sellers across all categories.",
};

export default async function BestSellersPage() {
  const products = await getBestSellers(50).catch(() => []);

  return (
    <div className="min-h-screen bg-[#0b0213]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1000] to-[#0b0213] border-b border-amber-500/20 py-14 mb-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl bg-amber-500/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <p className="text-5xl mb-4">🏆</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Best{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Sellers
            </span>
          </h1>
          <p className="text-fuchsia-200/60 text-lg max-w-xl mx-auto">
            The products your fellow shoppers trust most. Curated from real ratings and sales data.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-24 border border-amber-500/10 rounded-2xl bg-amber-500/5">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-xl font-semibold text-white mb-2">No best sellers yet</p>
            <p className="text-fuchsia-400/50 text-sm max-w-md mx-auto">
              In Contentstack, open a product entry and set{" "}
              <code className="text-amber-400">is_best_seller = true</code> to feature it here.
            </p>
          </div>
        ) : (
          <>
            <SectionHeader
              title={`${products.length} Top-Rated Products`}
              subtitle="Ranked by customer love and sales volume"
              accent="amber"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <div key={p.uid} className="relative">
                  {/* Rank pill */}
                  <div className={`absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg ${
                    i === 0 ? "bg-amber-400 text-[#0b0213] shadow-[0_0_12px_rgba(251,191,36,0.8)]" :
                    i === 1 ? "bg-slate-300 text-[#0b0213]" :
                    i === 2 ? "bg-amber-700 text-white" :
                    "bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/30 text-xs"
                  }`}>
                    {i + 1}
                  </div>
                  <ProductCard product={p} variant="grid" rank={i + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
