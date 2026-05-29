import { getNewArrivals } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Just dropped on NexStore — be the first to own the latest tech products.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(50).catch(() => []);

  return (
    <div className="min-h-screen bg-[#0b0213]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#001a05] to-[#0b0213] border-b border-green-500/20 py-14 mb-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl bg-green-500/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <p className="text-5xl mb-4">🆕</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            New{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Arrivals
            </span>
          </h1>
          <p className="text-fuchsia-200/60 text-lg max-w-xl mx-auto">
            Fresh drops, straight to your screen. Be the first to own tomorrow&apos;s technology.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-24 border border-green-500/10 rounded-2xl bg-green-500/5">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl font-semibold text-white mb-2">No new arrivals yet</p>
            <p className="text-fuchsia-400/50 text-sm max-w-md mx-auto">
              In Contentstack, open a product entry and set{" "}
              <code className="text-green-400">is_new_arrival = true</code> to feature it here.
            </p>
          </div>
        ) : (
          <>
            <SectionHeader
              title={`${products.length} New Product${products.length !== 1 ? "s" : ""}`}
              subtitle="Just landed — stock is limited"
              accent="cyan"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((p) => (
                <ProductCard key={p.uid} product={p} variant="grid" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
