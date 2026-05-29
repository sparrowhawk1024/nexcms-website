import Image from "next/image";
import Link from "next/link";
import SaleTimer from "./SaleTimer";
import StarRating from "./StarRating";
import type { Deal } from "@/types";

const CURRENCY = { symbol: "₹", locale: "en-IN" };
function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

export default function DealCard({ deal }: { deal: Deal }) {
  const { product } = deal;
  const original = product.compare_price ?? product.price;
  const dealPrice = deal.deal_price ?? product.price;
  const discount = original > dealPrice
    ? Math.round(((original - dealPrice) / original) * 100)
    : 0;
  const saving = original - dealPrice;

  return (
    <div className="group relative flex flex-col border border-red-500/30 bg-[#1a0520]/70 backdrop-blur-md rounded-2xl overflow-hidden hover:border-red-400/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all duration-300 h-full">
      {/* Hot deal strip */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black uppercase tracking-widest text-center py-1.5 flex items-center justify-center gap-2">
        <span>🔥</span>
        <span>{deal.title || "Deal of the Day"}</span>
        {discount > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full">{discount}% OFF</span>}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {/* Product image */}
        <Link
          href={`/products/${product.uid}`}
          className="block relative h-[180px] bg-black/40 rounded-xl overflow-hidden mb-4 border border-red-500/10 group-hover:border-red-400/30 transition-colors"
        >
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              sizes="300px"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-fuchsia-500/20 text-5xl">📦</div>
          )}
        </Link>

        {/* Title */}
        <Link href={`/products/${product.uid}`}>
          <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-red-300 transition-colors mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Stars */}
        {!!product.rating && (
          <StarRating
            rating={product.rating}
            reviewCount={product.review_count}
            size="xs"
          />
        )}

        {/* Pricing */}
        <div className="flex items-end gap-2 mt-3">
          <span className="text-white font-black text-2xl leading-none">
            <span className="text-sm text-fuchsia-300 align-top mr-0.5">{CURRENCY.symbol}</span>
            {fmt(dealPrice)}
          </span>
          {original > dealPrice && (
            <span className="text-fuchsia-500/50 text-sm line-through mb-0.5">
              {CURRENCY.symbol}{fmt(original)}
            </span>
          )}
        </div>

        {saving > 0 && (
          <p className="text-green-400 text-xs font-semibold mt-1">
            You save {CURRENCY.symbol}{fmt(saving)}
          </p>
        )}

        {/* Countdown */}
        {deal.ends_at && (
          <div className="mt-3">
            <SaleTimer endsAt={deal.ends_at} compact />
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={`/products/${product.uid}`}
            className="block w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-sm text-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-95"
          >
            Grab Deal →
          </Link>
        </div>
      </div>
    </div>
  );
}
