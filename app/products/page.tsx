import { getAllProducts, getProductCategories } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };
export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts().catch(() => []),
    getProductCategories().catch(() => []),
  ]);

  const inStock = products.filter((p) => p.in_stock).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-white/50">
            {products.length} total · {inStock} in stock
          </p>
        </div>
        {/* Quick tip for CMS editors */}
        <p className="text-white/30 text-xs max-w-xs text-right hidden md:block">
          To add or remove products, go to Contentstack → Content → product content type.
        </p>
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 text-xs font-medium border border-violet-500/30">
            All
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs font-medium border border-white/10 hover:border-violet-500/30 hover:text-violet-300 cursor-pointer transition-all"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <p className="text-4xl mb-4">🛍️</p>
          <p className="text-lg font-medium">No products yet.</p>
          <p className="text-sm mt-1">
            Create entries with content type <code className="bg-white/10 px-1 rounded">product</code> in Contentstack.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.uid} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
