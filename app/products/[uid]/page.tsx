import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductByUid, getAllProducts, getReviews } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import SaleTimer from "@/components/SaleTimer";
import AddToCartButton from "@/components/AddToCartButton";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts().catch(() => []);
  return products.map((p) => ({ uid: p.uid }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const product = await getProductByUid(uid).catch(() => null);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.short_desc ?? product.title,
    openGraph: {
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

const CURRENCY = { symbol: "₹", locale: "en-IN" };
function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

function RatingBreakdown({ reviews }: { reviews: { rating: number }[] }) {
  if (reviews.length === 0) return null;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);
  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2.5">
          <span className="text-xs text-amber-400 font-bold w-4 shrink-0 text-right">{star}</span>
          <span className="star-filled text-xs">★</span>
          <div className="flex-1 h-2 rounded-full bg-fuchsia-500/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-fuchsia-400/50 w-4 shrink-0">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { uid } = await params;
  const [product, allProducts, reviews] = await Promise.all([
    getProductByUid(uid).catch(() => null),
    getAllProducts().catch(() => []),
    getReviews(uid).catch(() => []),
  ]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.uid !== product.uid && p.category === product.category)
    .slice(0, 4);

  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;

  const reviewCount = reviews.length > 0 ? reviews.length : product.review_count;

  return (
    <div className="min-h-screen bg-[#0b0213]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-fuchsia-200/40 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/products" className="hover:text-cyan-400 transition-colors">Products</Link>
          {product.category && (
            <>
              <span>›</span>
              <Link href={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-cyan-400 transition-colors">
                {product.category}
              </Link>
            </>
          )}
          <span>›</span>
          <span className="text-fuchsia-200/70 line-clamp-1">{product.title}</span>
        </nav>

        {/* Sale timer banner */}
        {product.sale_ends_at && (
          <div className="mb-6 border border-red-500/30 bg-red-500/5 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-red-400 font-bold text-sm">Lightning Deal — Limited Time!</p>
                <p className="text-red-400/60 text-xs">Prices may rise once this sale ends</p>
              </div>
            </div>
            <SaleTimer endsAt={product.sale_ends_at} />
          </div>
        )}

        {/* Main layout */}
        <div className="grid md:grid-cols-[1fr_1fr] gap-10 lg:gap-14">

          {/* ── Left: Images ─────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-fuchsia-500/20 bg-[#170529]/50 shadow-[0_0_40px_rgba(217,70,239,0.08)]">
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  fill
                  className="object-contain p-6"
                  priority
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-fuchsia-500/10 text-8xl">📦</div>
              )}
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_best_seller && (
                  <span className="px-3 py-1 bg-amber-400 text-[#0b0213] text-[11px] font-black uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                    🏆 Best Seller
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="px-3 py-1 bg-green-500/90 text-white text-[11px] font-black uppercase tracking-widest rounded-full">
                    🆕 New Arrival
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 bg-fuchsia-500/90 text-white text-[11px] font-black uppercase tracking-widest rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              {discount && (
                <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-black shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {product.images.slice(0, 6).map((img, i) => (
                  <div
                    key={i}
                    className={`relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                      i === 0
                        ? "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                        : "border-fuchsia-500/20 hover:border-fuchsia-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Category + Stock */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Link
                  href={`/?category=${encodeURIComponent(product.category)}`}
                  className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors bg-cyan-400/10 px-3 py-0.5 rounded-full border border-cyan-400/20"
                >
                  {product.category}
                </Link>
              )}
              {product.brand && (
                <span className="text-fuchsia-300/70 text-sm bg-fuchsia-500/10 px-3 py-0.5 rounded-full border border-fuchsia-500/20">
                  {product.brand}
                </span>
              )}
              {!product.in_stock && (
                <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 text-xs font-bold border border-red-500/30">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-[26px] sm:text-3xl font-black text-white leading-tight">
              {product.title}
            </h1>

            {/* Star rating */}
            {(avgRating !== undefined || reviewCount) && (
              <div className="flex items-center gap-3 flex-wrap">
                {avgRating !== undefined && (
                  <StarRating
                    rating={avgRating}
                    reviewCount={reviewCount}
                    size="md"
                    showNumeric
                  />
                )}
                {reviews.length > 0 && (
                  <a
                    href="#reviews"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
                  >
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </a>
                )}
              </div>
            )}

            {/* short desc */}
            {product.short_desc && (
              <p className="text-fuchsia-200/65 text-base leading-relaxed">{product.short_desc}</p>
            )}

            {/* Pricing */}
            <div className="flex items-baseline gap-3 flex-wrap p-5 rounded-2xl bg-[#170529]/60 border border-fuchsia-500/20">
              <span className="text-white font-black text-4xl leading-none">
                <span className="text-lg text-fuchsia-300 align-top">{CURRENCY.symbol}</span>
                {fmt(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="text-fuchsia-500/40 text-2xl line-through">
                    {CURRENCY.symbol}{fmt(product.compare_price)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-bold border border-green-500/25">
                    Save {CURRENCY.symbol}{fmt(product.compare_price - product.price)} ({discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/15">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="text-sm font-bold text-white">
                  {product.delivery_days !== undefined
                    ? `Delivery in ${product.delivery_days} day${product.delivery_days !== 1 ? "s" : ""}`
                    : "Tomorrow by 11:00 AM"}
                </p>
                <p className="text-xs text-cyan-400/70">Free hyper-delivery — NEX+ members only</p>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">
                  Key Specs
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-fuchsia-200/70 text-sm">
                        <strong className="text-white font-semibold">{f.label}:</strong> {f.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/5 text-fuchsia-400/60 text-xs border border-fuchsia-500/15 hover:border-fuchsia-400/30 hover:text-fuchsia-300 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <AddToCartButton product={product} label="Add to Cart" />
              {product.in_stock && product.cta_url && (
                <a
                  href={product.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black text-center text-base transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_35px_rgba(217,70,239,0.5)] active:scale-[0.98]"
                >
                  {product.cta_label ?? "Buy Now"} →
                </a>
              )}
              <button className="w-full py-2.5 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-400 text-fuchsia-300 hover:text-fuchsia-200 text-sm font-semibold transition-all hover:bg-fuchsia-500/10 flex items-center justify-center gap-2">
                ♡ Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* ── Description ─────────────────────────────────────────────── */}
        {product.description && (
          <section className="mt-14 pt-10 border-t border-fuchsia-500/20">
            <h2 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              Product Description
            </h2>
            <div
              className="prose prose-invert prose-violet max-w-none prose-headings:text-white prose-p:text-fuchsia-200/70 prose-a:text-cyan-400 prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-white/5 rounded-xl p-6 border border-fuchsia-500/10 bg-[#170529]/30"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}

        {/* ── Reviews ──────────────────────────────────────────────────── */}
        <section id="reviews" className="mt-14 pt-10 border-t border-fuchsia-500/20">
          <h2 className="text-white font-black text-xl mb-8 flex items-center gap-3">
            <span className="w-1 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <div>
              {/* Show product rating if in CS but no review entries */}
              {avgRating !== undefined && (
                <div className="flex items-center gap-4 mb-6 p-5 rounded-xl border border-fuchsia-500/15 bg-[#170529]/30">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white">{avgRating.toFixed(1)}</p>
                    <StarRating rating={avgRating} showCount={false} size="md" />
                    <p className="text-xs text-fuchsia-400/40 mt-1">
                      {reviewCount ?? 0} ratings
                    </p>
                  </div>
                </div>
              )}
              <div className="border border-fuchsia-500/10 rounded-xl bg-[#170529]/20 p-10 text-center">
                <p className="text-3xl mb-3">✍️</p>
                <p className="text-fuchsia-200/50 font-medium">No reviews yet.</p>
                <p className="text-fuchsia-400/30 text-sm mt-2">
                  Add review entries in Contentstack (content type: <code className="text-cyan-400/70">review</code>) with{" "}
                  <code className="text-cyan-400/70">product_uid</code> = <code className="text-fuchsia-300/50">{product.uid}</code>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-[240px_1fr] gap-8">
              {/* Summary panel */}
              <div className="p-5 rounded-xl border border-fuchsia-500/20 bg-[#170529]/40 h-fit">
                <div className="text-center mb-5">
                  <p className="text-6xl font-black text-white">{avgRating!.toFixed(1)}</p>
                  <StarRating rating={avgRating!} showCount={false} size="lg" />
                  <p className="text-xs text-fuchsia-400/50 mt-1">{reviews.length} reviews</p>
                </div>
                <RatingBreakdown reviews={reviews} />
              </div>

              {/* Review cards */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.uid} review={review} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Related Products ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-fuchsia-500/20">
            <h2 className="text-white font-black text-xl mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-fuchsia-400 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
              More in {product.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.uid} product={p} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
