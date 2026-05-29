"use client";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  fullWidth?: boolean;
  label?: string;
}

export default function AddToCartButton({
  product,
  fullWidth = true,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  if (!product.in_stock) {
    return (
      <p
        className={`text-red-400 text-[13px] font-bold text-center tracking-widest uppercase bg-red-500/10 py-2.5 rounded-lg border border-red-500/20 ${fullWidth ? "w-full" : ""}`}
      >
        Out of Stock
      </p>
    );
  }

  return (
    <button
      onClick={() => addToCart(product)}
      className={`relative py-2.5 rounded-lg overflow-hidden group/btn font-bold text-[13px] tracking-wide text-white border border-fuchsia-500/50 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 ${fullWidth ? "w-full" : "px-6"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/80 to-purple-600/80 group-hover/btn:from-cyan-500/80 group-hover/btn:to-blue-500/80 transition-all duration-300" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        🛒 {label}
      </span>
    </button>
  );
}
