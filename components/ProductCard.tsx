import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

// Config
const CURRENCY = { symbol: "₹", locale: "en-IN" };

function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

type CardVariant = "grid" | "list" | "featured";

interface ProductCardProps {
  product: Product;
  variant?: CardVariant;
  className?: string;
}

// ── Shared Rating Stars ────────────────────────────────────────────────────────
function Stars({ count = 120 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1.5 mt-2 mb-2">
      <div className="flex text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] text-sm tracking-widest">
        ★★★★<span className="text-fuchsia-500/30">★</span>
      </div>
      <span className="text-fuchsia-300 text-xs hover:text-fuchsia-200 hover:drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] cursor-pointer transition-all">[{count}]</span>
    </div>
  );
}

// ── Grid card (Neo-Purple Theme) ───────────────────────────────────────────────
function GridCard({ product: p }: { product: Product }) {
  return (
    <div className="group flex flex-col border border-fuchsia-500/20 bg-[#170529]/40 backdrop-blur-md rounded-xl overflow-hidden hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 h-full relative p-3">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Image container */}
      <Link href={`/products/${p.uid}`} className="block relative w-full h-[220px] bg-black/50 border border-fuchsia-500/10 rounded-lg mb-4 overflow-hidden group-hover:border-fuchsia-500/30 transition-colors">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/5 to-transparent pointer-events-none"></div>
        
        {p.images?.[0]?.url ? (
          <Image
            src={p.images[0].url}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-fuchsia-500/20 text-5xl">📦</div>
        )}
        
        {p.badge && (
          <span className="absolute top-2 left-2 px-2.5 py-1 bg-cyan-500/90 backdrop-blur-sm text-[#0b0213] text-[10px] font-black uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {p.badge}
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-1">
        {/* Sponsored tag */}
        <span className="text-[10px] text-fuchsia-400/50 mb-1.5 uppercase tracking-widest font-bold">Ad ⓘ</span>

        {/* Title */}
        <Link href={`/products/${p.uid}`}>
          <h3 className="text-fuchsia-50 group-hover:text-cyan-300 text-[15px] font-medium leading-relaxed line-clamp-2 min-h-[2.8rem] transition-colors drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
            {p.title}
          </h3>
        </Link>

        {/* Stars */}
        <Stars count={Math.floor(Math.random() * 500) + 50} />

        {/* Price block */}
        <div className="flex items-end gap-2 mt-2">
          <span className="text-white text-[24px] font-bold leading-none tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <span className="text-[14px] align-top mr-1 text-fuchsia-300">{CURRENCY.symbol}</span>
            {fmt(p.price)}
          </span>
          {p.compare_price && p.compare_price > p.price && (
            <span className="text-fuchsia-500/50 text-[13px] line-through decoration-fuchsia-500/50 font-medium mb-0.5">
              {CURRENCY.symbol}{fmt(p.compare_price)}
            </span>
          )}
        </div>

        {/* Prime badge */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-cyan-400 font-black italic text-[12px] uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">NEX+</span>
        </div>

        {/* Delivery */}
        <p className="text-[11px] text-fuchsia-200/60 mt-2 leading-relaxed font-medium">
          Hyper-drop by <strong className="text-fuchsia-200">Tomorrow, 11:00</strong><br />
          <span className="text-cyan-400/80">Zero-fee delivery sequence</span>
        </p>

        {/* CTA */}
        <div className="mt-auto pt-5">
          {p.in_stock ? (
            <button className="relative w-full py-2.5 rounded-lg bg-transparent overflow-hidden group/btn font-bold text-[13px] tracking-wide text-white border border-fuchsia-500/50 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/80 to-purple-600/80 group-hover/btn:from-cyan-500/80 group-hover/btn:to-blue-500/80 transition-all duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Initiate Purchase
              </span>
            </button>
          ) : (
            <p className="text-red-500 text-[13px] font-bold text-center tracking-widest uppercase bg-red-500/10 py-2.5 rounded-lg border border-red-500/20">Depleted</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── List card ─────────────────────────────────────────────────────────────────
function ListCard({ product: p }: { product: Product }) {
  return (
    <div className="group flex gap-6 border border-fuchsia-500/20 bg-[#170529]/40 backdrop-blur-md rounded-xl p-4 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all">
      {/* Image */}
      <Link href={`/products/${p.uid}`} className="relative h-40 w-40 flex-shrink-0 bg-black/50 border border-fuchsia-500/10 rounded-lg overflow-hidden group-hover:border-fuchsia-500/30 transition-colors">
        {p.images?.[0]?.url ? (
          <Image src={p.images[0].url} alt={p.title} fill sizes="160px" className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex h-full items-center justify-center text-fuchsia-500/20 text-4xl">📦</div>
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-start py-1">
        <Link href={`/products/${p.uid}`}>
          <h3 className="text-fuchsia-50 text-[18px] font-medium group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_2px_rgba(255,255,255,0.2)] line-clamp-2">
            {p.title}
          </h3>
        </Link>
        <Stars count={89} />
        {p.short_desc && (
          <p className="text-fuchsia-200/60 text-[13px] mt-2 line-clamp-2 leading-relaxed">{p.short_desc}</p>
        )}
        <div className="flex items-end gap-3 mt-4">
          <span className="text-white font-bold text-[26px] leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <span className="text-[14px] align-top mr-1 text-fuchsia-300">{CURRENCY.symbol}</span>
            {fmt(p.price)}
          </span>
          {p.compare_price && p.compare_price > p.price && (
            <span className="text-fuchsia-500/50 text-[14px] line-through decoration-fuchsia-500/50 font-medium mb-1">
              {CURRENCY.symbol}{fmt(p.compare_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Featured card ─────────────────────────────────────────────────────────────
function FeaturedCard({ product: p }: { product: Product }) {
  // Same neon styling but omitted for brevity as Grid is the primary
  return <GridCard product={p} />;
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function ProductCard({ product, variant = "grid", className = "" }: ProductCardProps) {
  const map = {
    grid:     <GridCard product={product} />,
    list:     <ListCard product={product} />,
    featured: <FeaturedCard product={product} />,
  };
  return <div className={className}>{map[variant]}</div>;
}
