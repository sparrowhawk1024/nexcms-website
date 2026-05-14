"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SUBNAV = [
  "Fresh",
  "MX Player",
  "Sell",
  "Bestsellers",
  "Mobiles",
  "Today's Deals",
  "New Releases",
  "Customer Service",
  "Prime",
  "Amazon Pay",
  "Electronics",
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex flex-col w-full sticky top-0 z-50 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
      {/* ── Top Nav ────────────────────────────────────────────────────── */}
      <nav className="bg-[#0b0213]/80 backdrop-blur-lg border-b border-fuchsia-500/20 text-white flex items-center gap-4 px-6 h-[70px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center px-2 py-1 rounded-sm group shrink-0 mr-2"
        >
          <span className="font-bold text-[28px] tracking-tighter text-white leading-none group-hover:text-fuchsia-200 transition-colors">
            Nex<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Store</span>
            <span className="text-fuchsia-400 text-[14px] align-super drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] ml-0.5">.in</span>
          </span>
        </Link>

        {/* Deliver to */}
        <div className="hidden lg:flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30 shrink-0">
          <span className="text-[11px] text-fuchsia-200/60 leading-none ml-4 tracking-wide uppercase">Delivering to</span>
          <span className="text-[14px] font-bold leading-tight flex items-center gap-1 text-fuchsia-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Bengaluru 562130
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center h-[44px] rounded-full overflow-hidden bg-white/5 border border-fuchsia-500/20 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-transparent transition-all shadow-inner">
          <select className="bg-transparent text-fuchsia-200 text-[13px] px-4 h-full border-r border-fuchsia-500/20 outline-none hover:bg-white/10 cursor-pointer hidden sm:block font-medium">
            <option className="bg-[#0b0213]">All</option>
            <option className="bg-[#0b0213]">Electronics</option>
            <option className="bg-[#0b0213]">Fashion</option>
            <option className="bg-[#0b0213]">Mobiles</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the neon web..."
            className="flex-1 h-full px-4 text-white placeholder-fuchsia-200/40 bg-transparent outline-none text-[15px]"
          />
          <button className="bg-cyan-500 hover:bg-cyan-400 h-full px-6 flex items-center justify-center transition-all shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0b0213">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>

        {/* Right-side controls */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Sign in */}
          <div className="flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30">
            <span className="text-[11px] text-fuchsia-200/60 leading-none">Hello, sign in</span>
            <span className="text-[13px] font-bold leading-tight flex items-center gap-1 text-fuchsia-50">
              Account &amp; Lists
              <span className="text-[10px] text-cyan-400">▼</span>
            </span>
          </div>
          {/* Returns */}
          <div className="flex flex-col px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30">
            <span className="text-[11px] text-fuchsia-200/60 leading-none">Returns</span>
            <span className="text-[13px] font-bold leading-tight text-fuchsia-50">&amp; Orders</span>
          </div>
          {/* Cart */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-fuchsia-500/30 group">
            <div className="relative">
              <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white font-bold text-[11px] w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]">0</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <span className="text-[13px] font-bold leading-none text-fuchsia-50">Cart</span>
          </div>
        </div>
      </nav>

      {/* ── Sub Nav ────────────────────────────────────────────────────── */}
      <nav className="bg-[#0b0213] border-b border-fuchsia-500/10 text-fuchsia-100 flex items-center gap-1 px-4 h-[44px] overflow-x-auto whitespace-nowrap hide-scrollbar">
        {/* Hamburger "All" */}
        <button className="flex items-center gap-2 px-4 h-full hover:bg-white/5 hover:text-cyan-400 transition-colors rounded-sm font-bold text-[13px] shrink-0 uppercase tracking-wider">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          All
        </button>
        {SUBNAV.map((label) => (
          <a
            key={label}
            href="#"
            className="px-4 h-full flex items-center text-[13px] hover:bg-white/5 hover:text-cyan-400 transition-colors rounded-sm shrink-0 uppercase tracking-wide font-medium"
          >
            {label}
          </a>
        ))}
        {/* Sale banner text */}
        <span className="ml-auto pr-4 font-bold text-[13px] shrink-0 hidden lg:flex items-center gap-2 uppercase tracking-wider">
          <span className="text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">Neon Summer Sale</span>
          <span className="text-cyan-400 flex items-center gap-1 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Live Now
          </span>
        </span>
      </nav>
    </header>
  );
}
