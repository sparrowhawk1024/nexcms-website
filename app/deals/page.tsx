import { getDeals } from "@/lib/contentstack";
import DealCard from "@/components/DealCard";
import SectionHeader from "@/components/SectionHeader";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Today's Deals",
  description: "NexStore deals — massive discounts on top tech. Limited time offers updated daily.",
};

export default async function DealsPage() {
  const deals = await getDeals().catch(() => []);

  return (
    <div className="min-h-screen bg-[#0b0213]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1a0010] to-[#0b0213] border-b border-red-500/20 py-14 mb-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl bg-red-500/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <p className="text-5xl mb-4">🔥</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Today&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Deals
            </span>
          </h1>
          <p className="text-fuchsia-200/60 text-lg max-w-xl mx-auto">
            Handpicked discounts updated daily. Don&apos;t blink — prices disappear when the timer hits zero.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {deals.length === 0 ? (
          <div className="text-center py-24 border border-red-500/10 rounded-2xl bg-red-500/5">
            <p className="text-5xl mb-4">⏳</p>
            <p className="text-xl font-semibold text-white mb-2">No deals live right now</p>
            <p className="text-fuchsia-400/50 text-sm max-w-md mx-auto">
              Create <code className="text-red-400">deal</code> entries in Contentstack and set{" "}
              <code className="text-red-400">active = true</code> to see them here.
            </p>
          </div>
        ) : (
          <>
            <SectionHeader
              title={`${deals.length} Live Deal${deals.length !== 1 ? "s" : ""}`}
              subtitle="All prices are final — no hidden fees"
              accent="fuchsia"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {deals.map((deal) => (
                <DealCard key={deal.uid} deal={deal} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
