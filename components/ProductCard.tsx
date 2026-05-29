import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import StarRating from "./StarRating";
import AddToCartButton from "./AddToCartButton";

const CURRENCY = { symbol: "₹", locale: "en-IN" };
function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

type CardVariant = "grid" | "list" | "featured";

interface ProductCardProps {
  product: Product;
  variant?: CardVariant;
  className?: string;
  rank?: number; // for best-seller ranking badges
}

// ── Badges helper ──────────────────────────────────────────────────────────────
function ProductBadges({ product, rank }: { product: Product; rank?: number }) {
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {rank && rank <= 3 && (
        <span
          className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-lg ${
            rank === 1
              ? "bg-amber-400 text-[#0b0213] shadow-[0_0_8px_rgba(251,191,36,0.7)]"
              : rank === 2
              ? "bg-slate-300 text-[#0b0213]"
              : "bg-amber-700 text-white"
          }`}
        >
          #{rank} Best Seller
        </span>
      )}
      {product.is_best_seller && !rank && (
        <span className="px-2 py-0.5 bg-amber-400 text-[#0b0213] text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          🏆 Best Seller
        </span>
      )}
      {product.is_new_arrival && (
        <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.5)]">
          🆕 New
        </span>
      )}
      {product.badge && !product.is_best_seller && !product.is_new_arrival && (
        <span className="px-2.5 py-1 bg-cyan-500/90 backdrop-blur-sm text-[#0b0213] text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          {product.badge}
        </span>
      )}
    </div>
  );
}

// ── Discount badge ─────────────────────────────────────────────────────────────
function DiscountBadge({ product }: { product: Product }) {
  if (!product.compare_price || product.compare_price <= product.price) return null;
  const pct = Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
  return (
    <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-black rounded-sm z-10">
      -{pct}%
    </span>
  );
}

// ── Grid card ──────────────────────────────────────────────────────────────────
function GridCard({ product: p, rank }: { product: Product; rank?: number }) {
  return (
    <div className="group flex flex-col border border-fuchsia-500/20 bg-[#170529]/40 backdrop-blur-md rounded-xl overflow-hidden hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 h-full p-3 relative">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-br-xl" />

      {/* Image */}
      <Link
        href={`/products/${p.uid}`}
        className="block relative w-full h-[200px] bg-black/50 border border-fuchsia-500/10 rounded-lg mb-4 overflow-hidden group-hover:border-fuchsia-500/30 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/5 to-transparent pointer-events-none" />
        {p.images?.[0]?.url ? (
          <Image
            src={p.images[0].url}
            alt={p.title}
            fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-fuchsia-500/20 text-5xl">📦</div>
        )}
        <ProductBadges product={p} rank={rank} />
        <DiscountBadge product={p} />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 px-1">
        {p.sponsored && (
          <span className="text-[10px] text-fuchsia-400/40 mb-1 uppercase tracking-widest font-bold">
            Ad ⓘ
          </span>
        )}
        {p.brand && (
          <span className="text-[11px] text-cyan-400/70 font-semibold uppercase tracking-wide mb-1">
            {p.brand}
          </span>
        )}

        <Link href={`/products/${p.uid}`}>
          <h3 className="text-fuchsia-50 group-hover:text-cyan-300 text-[14px] font-medium leading-relaxed line-clamp-2 min-h-[2.8rem] transition-colors">
            {p.title}
          </h3>
        </Link>

        {/* Rating */}
        {p.rating ? (
          <div className="mt-1.5 mb-1">
            <StarRating
              rating={p.rating}
              reviewCount={p.review_count}
              size="xs"
              showNumeric
            />
          </div>
        ) : (
          <div className="mt-1.5 mb-1 h-4" />
        )}

        {/* Price */}
        <div className="flex items-end gap-2 mt-1">
          <span className="text-white text-[22px] font-bold leading-none tracking-tight">
            <span className="text-[13px] align-top mr-0.5 text-fuchsia-300">{CURRENCY.symbol}</span>
            {fmt(p.price)}
          </span>
          {p.compare_price && p.compare_price > p.price && (
            <span className="text-fuchsia-500/45 text-[12px] line-through mb-0.5">
              {CURRENCY.symbol}{fmt(p.compare_price)}
            </span>
          )}
        </div>

        {/* NEX+ Prime */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-cyan-400 font-black italic text-[11px] uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
            NEX+
          </span>
          {p.delivery_days !== undefined ? (
            <span className="text-[11px] text-fuchsia-200/50">
              Delivery in <strong className="text-fuchsia-200">{p.delivery_days}d</strong>
            </span>
          ) : (
            <span className="text-[11px] text-fuchsia-200/50">
              Free <strong className="text-cyan-400/80">Hyper-Delivery</strong>
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <AddToCartButton product={p} />
        </div>
      </div>
    </div>
  );
}

// ── List card ──────────────────────────────────────────────────────────────────
function ListCard({ product: p, rank }: { product: Product; rank?: number }) {
  return (
    <div className="group flex gap-4 border border-fuchsia-500/20 bg-[#170529]/40 backdrop-blur-md rounded-xl p-4 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all">
      {/* Image */}
      <Link
        href={`/products/${p.uid}`}
        className="relative h-36 w-36 flex-shrink-0 bg-black/50 border border-fuchsia-500/10 rounded-lg overflow-hidden group-hover:border-fuchsia-500/30 transition-colors"
      >
        {p.images?.[0]?.url ? (
          <Image
            src={p.images[0].url}
            alt={p.title}
            fill
            sizes="144px"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-fuchsia-500/20 text-4xl">📦</div>
        )}
        <ProductBadges product={p} rank={rank} />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          {p.brand && (
            <span className="text-[11px] text-cyan-400/70 font-semibold uppercase tracking-wide">
              {p.brand}
            </span>
          )}
          <Link href={`/products/${p.uid}`}>
            <h3 className="text-fuchsia-50 text-base font-medium group-hover:text-cyan-300 transition-colors line-clamp-2 mt-0.5">
              {p.title}
            </h3>
          </Link>
          {p.rating && (
            <div className="mt-1.5">
              <StarRating rating={p.rating} reviewCount={p.review_count} size="xs" showNumeric />
            </div>
          )}
          {p.short_desc && (
            <p className="text-fuchsia-200/55 text-[13px] mt-2 line-clamp-2">{p.short_desc}</p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-end gap-2">
            <span className="text-white font-bold text-2xl leading-none">
              <span className="text-sm align-top mr-0.5 text-fuchsia-300">{CURRENCY.symbol}</span>
              {fmt(p.price)}
            </span>
            {p.compare_price && p.compare_price > p.price && (
              <span className="text-fuchsia-500/45 text-sm line-through mb-0.5">
                {CURRENCY.symbol}{fmt(p.compare_price)}
              </span>
            )}
          </div>
          <AddToCartButton product={p} fullWidth={false} />
        </div>
      </div>
    </div>
  );
}

// ── Featured card ──────────────────────────────────────────────────────────────
function FeaturedCard({ product: p }: { product: Product }) {
  return <GridCard product={p} />;
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function ProductCard({
  product,
  variant = "grid",
  className = "",
  rank,
}: ProductCardProps) {
  const map: Record<CardVariant, React.ReactNode> = {
    grid: <GridCard product={product} rank={rank} />,
    list: <ListCard product={product} rank={rank} />,
    featured: <FeaturedCard product={product} />,
  };
  return <div className={className}>{map[variant]}</div>;
}
