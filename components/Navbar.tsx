"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  categories?: string[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setIsOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  }

  return (
    <header className="flex flex-col w-full sticky top-0 z-50 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
      {/* ── Top Nav ────────────────────────────────────────────────────── */}
      <nav className="bg-[#0b0213]/90 backdrop-blur-lg border-b border-fuchsia-500/20 text-white flex items-center gap-3 px-4 sm:px-6 h-[68px]">
        {/* Logo */}
        <Link href="/" className="flex items-center px-1 py-1 rounded-sm group shrink-0 mr-1">
          <span className="font-black text-[26px] tracking-tighter text-white leading-none group-hover:text-fuchsia-200 transition-colors">
            Nex<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Store</span>
            <span className="text-fuchsia-400 text-[13px] align-super drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] ml-0.5">.in</span>
          </span>
        </Link>

        {/* Deliver to */}
        <div className="hidden lg:flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30 shrink-0">
          <span className="text-[10px] text-fuchsia-200/50 leading-none ml-4 tracking-wide uppercase">
            Delivering to
          </span>
          <span className="text-[13px] font-bold leading-tight flex items-center gap-1 text-fuchsia-50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Bengaluru 560001
          </span>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 items-center h-[42px] rounded-full overflow-hidden bg-white/5 border border-fuchsia-500/20 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-transparent transition-all shadow-inner"
        >
          <select className="bg-transparent text-fuchsia-200 text-[12px] px-3 h-full border-r border-fuchsia-500/20 outline-none hover:bg-white/10 cursor-pointer hidden sm:block font-medium shrink-0">
            <option className="bg-[#0b0213]" value="">All</option>
            {categories.map((cat) => (
              <option key={cat} className="bg-[#0b0213]" value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NexStore..."
            className="flex-1 h-full px-4 text-white placeholder-fuchsia-200/35 bg-transparent outline-none text-[14px]"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 h-full px-5 flex items-center justify-center transition-all shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0b0213">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </form>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {/* Account */}
          <div className="flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30">
            <span className="text-[10px] text-fuchsia-200/50 leading-none">Hello, sign in</span>
            <span className="text-[12px] font-bold leading-tight flex items-center gap-1 text-fuchsia-50">
              Account <span className="text-[9px] text-cyan-400">▼</span>
            </span>
          </div>
          {/* Orders */}
          <div className="flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30">
            <span className="text-[10px] text-fuchsia-200/50 leading-none">Returns</span>
            <span className="text-[12px] font-bold leading-none text-fuchsia-50">&amp; Orders</span>
          </div>
          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30 group relative"
          >
            <div className="relative">
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)] z-10">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-400 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-fuchsia-50">Cart</span>
          </button>
        </div>

        {/* Mobile cart */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden relative p-2"
        >
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-fuchsia-500 text-white font-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </nav>

      {/* ── Sub Nav ─────────────────────────────────────────────────────── */}
      <nav className="bg-[#0b0213] border-b border-fuchsia-500/10 text-fuchsia-100 flex items-center gap-0.5 px-3 h-[42px] overflow-x-auto whitespace-nowrap hide-scrollbar">
        {/* All */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 h-full text-[12px] font-bold transition-colors rounded-sm shrink-0 uppercase tracking-wider ${
            pathname === "/" ? "text-cyan-400" : "hover:bg-white/5 hover:text-cyan-400"
          }`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
          All
        </Link>

        {/* Dynamic categories */}
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className="px-3 h-full flex items-center text-[12px] hover:bg-white/5 hover:text-cyan-400 transition-colors rounded-sm shrink-0 uppercase tracking-wide font-medium"
          >
            {cat}
          </Link>
        ))}

        {/* Divider */}
        <span className="w-px h-4 bg-fuchsia-500/20 mx-1 shrink-0" />

        {/* Fixed feature links */}
        <Link href="/deals" className="px-3 h-full flex items-center text-[12px] hover:bg-white/5 hover:text-red-400 transition-colors rounded-sm shrink-0 font-bold uppercase tracking-wide text-red-400/80">
          🔥 Deals
        </Link>
        <Link href="/best-sellers" className="px-3 h-full flex items-center text-[12px] hover:bg-white/5 hover:text-amber-400 transition-colors rounded-sm shrink-0 font-medium uppercase tracking-wide text-amber-400/70">
          🏆 Best Sellers
        </Link>
        <Link href="/new-arrivals" className="px-3 h-full flex items-center text-[12px] hover:bg-white/5 hover:text-green-400 transition-colors rounded-sm shrink-0 font-medium uppercase tracking-wide text-green-400/70">
          🆕 New Arrivals
        </Link>
        <Link href="/blog" className="px-3 h-full flex items-center text-[12px] hover:bg-white/5 hover:text-cyan-400 transition-colors rounded-sm shrink-0 font-medium uppercase tracking-wide">
          Blog
        </Link>

        {/* Live sale badge */}
        <span className="ml-auto pr-3 font-bold text-[11px] shrink-0 hidden lg:flex items-center gap-2 uppercase tracking-wider">
          <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
            Neon Summer Sale
          </span>
          <span className="text-cyan-400 flex items-center gap-1 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live
          </span>
        </span>
      </nav>
    </header>
  );
}
