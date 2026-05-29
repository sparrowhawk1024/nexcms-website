"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const CURRENCY = { symbol: "₹", locale: "en-IN" };
function fmt(n: number) {
  return new Intl.NumberFormat(CURRENCY.locale).format(n);
}

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#0d0520] border-l border-fuchsia-500/20 shadow-[-30px_0_80px_rgba(217,70,239,0.1)] z-[101] flex flex-col animate-slide-left">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-fuchsia-500/20 bg-[#110326]/80 backdrop-blur-md">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            🛒 My Cart
            {totalItems > 0 && (
              <span className="bg-cyan-500 text-[#0b0213] text-xs font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-fuchsia-400/50 hover:text-white text-3xl font-thin transition-colors leading-none"
          >
            ×
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-6xl mb-5">🛒</p>
              <p className="text-fuchsia-200/50 text-lg font-semibold">Your cart is empty</p>
              <p className="text-fuchsia-400/30 text-sm mt-2 mb-8">
                Discover amazing products and add them here
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="px-7 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b0213] font-black text-sm rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                Browse Products →
              </Link>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const lineTotal = product.price * quantity;
              return (
                <div
                  key={product.uid}
                  className="flex gap-3 border border-fuchsia-500/15 rounded-xl p-3 bg-[#170529]/50 hover:border-fuchsia-500/30 transition-colors"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${product.uid}`}
                    onClick={() => setIsOpen(false)}
                    className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-fuchsia-500/10"
                  >
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">📦</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.uid}`}
                      onClick={() => setIsOpen(false)}
                      className="text-fuchsia-50 text-sm font-medium line-clamp-2 leading-tight hover:text-cyan-300 transition-colors"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-cyan-400 font-bold text-sm">
                        {CURRENCY.symbol}{fmt(lineTotal)}
                      </p>
                      <button
                        onClick={() => removeFromCart(product.uid)}
                        className="text-red-400/50 hover:text-red-400 text-xs transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.uid, quantity - 1)}
                        className="w-7 h-7 rounded-full border border-fuchsia-500/30 text-fuchsia-200 hover:bg-fuchsia-500/20 hover:border-fuchsia-400 transition-all text-base flex items-center justify-center font-bold"
                      >
                        −
                      </button>
                      <span className="text-white font-bold text-sm w-6 text-center tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.uid, quantity + 1)}
                        className="w-7 h-7 rounded-full border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 transition-all text-base flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-fuchsia-500/20 px-5 py-5 space-y-3 bg-[#110326]/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-fuchsia-200/60 text-sm">
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
              <span className="text-white font-black text-xl">
                {CURRENCY.symbol}{fmt(totalPrice)}
              </span>
            </div>
            <p className="text-xs text-fuchsia-400/40">
              Delivery and taxes calculated at checkout
            </p>
            <button className="w-full py-3.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_35px_rgba(217,70,239,0.5)] active:scale-[0.98]">
              Proceed to Checkout →
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-fuchsia-400/50 hover:text-fuchsia-200 text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
