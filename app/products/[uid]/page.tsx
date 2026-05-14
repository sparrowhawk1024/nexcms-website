import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductByUid, getAllProducts } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
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

// ── Currency config ──────────────────────────────────────────────────────────
const CURRENCY = { symbol: "₹", locale: "en-IN" };
function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

export default async function ProductDetailPage({ params }: Props) {
  const { uid } = await params;
  const [product, allProducts] = await Promise.all([
    getProductByUid(uid).catch(() => null),
    getAllProducts().catch(() => []),
  ]);

  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.uid !== product.uid && p.category === product.category)
    .slice(0, 3);

  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Products
      </Link>

      {/* Main product layout */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/20 text-6xl">📦</div>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-violet-600 text-white text-sm font-medium">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-green-600/80 text-white text-sm font-medium">
                -{discount}%
              </span>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className={`relative h-16 w-16 rounded-lg overflow-hidden border transition-colors ${
                    i === 0 ? "border-violet-500" : "border-white/10"
                  }`}
                >
                  <Image src={img.url} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-violet-400 text-sm font-medium">{product.category}</span>
              {!product.in_stock && (
                <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-400 text-xs">Out of Stock</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">{product.title}</h1>
            {product.short_desc && (
              <p className="text-white/60 text-base mt-3 leading-relaxed">{product.short_desc}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-white font-bold text-3xl">
              {CURRENCY.symbol}{fmt(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-white/30 text-xl line-through">
                  {CURRENCY.symbol}{fmt(product.compare_price)}
                </span>
                <span className="px-2 py-1 rounded bg-green-600/20 text-green-400 text-sm font-medium">
                  Save {CURRENCY.symbol}{fmt(product.compare_price - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">What's included</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-white/70 text-sm">
                      <strong className="text-white font-medium">{f.label}:</strong> {f.value}
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
                <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-xs border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            {product.in_stock ? (
              <a
                href={product.cta_url ?? "#"}
                target={product.cta_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex-1 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-center text-base transition-colors"
              >
                {product.cta_label ?? "Buy Now"} →
              </a>
            ) : (
              <span className="flex-1 py-4 rounded-xl bg-white/10 text-white/30 font-semibold text-center text-base cursor-not-allowed">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Full description */}
      {product.description && (
        <section className="mt-16">
          <h2 className="text-white font-semibold text-xl mb-6">Description</h2>
          <div
            className="prose prose-invert prose-violet max-w-none
              prose-headings:text-white prose-p:text-white/70
              prose-a:text-violet-400 prose-code:bg-white/5 prose-code:text-violet-300"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-white font-semibold text-xl mb-6">More in {product.category}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.uid} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
