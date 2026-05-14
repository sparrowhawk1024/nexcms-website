import Link from "next/link";
import { getAllProducts } from "@/lib/contentstack";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

// Static filter sidebar sections
type SidebarItem = { label: string; href: string; checkbox?: boolean };
type SidebarSection = { title: string; items: SidebarItem[] };

const SIDEBAR: SidebarSection[] = [
  {
    title: "Deals & Drops",
    items: [{ label: "Neon Summer Drops", href: "#" }],
  },
  {
    title: "Crypto Pay",
    items: [{ label: "Eligible for Crypto Pay", href: "#", checkbox: true }],
  },
  {
    title: "Category",
    items: [
      { label: "Cybernetics", href: "#" },
      { label: "Neon Fashion", href: "#" },
      { label: "Smart Home", href: "#" },
      { label: "Holo-Displays", href: "#" },
    ],
  },
];

export default async function HomePage() {
  const products = await getAllProducts().catch(() => []);
  const total = products.length;

  return (
    <div className="bg-transparent min-h-screen text-fuchsia-50">

      {/* ── Results header bar ──────────────────────────────────────────── */}
      <div className="bg-[#0b0213]/90 backdrop-blur-md border-b border-fuchsia-500/20 px-6 py-3 text-[14px] shadow-[0_4px_15px_rgba(217,70,239,0.05)] relative z-40">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-fuchsia-200/80 tracking-wide">
            1–{total} of <strong className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{total}</strong> results for{" "}
            <span className="text-fuchsia-400 font-semibold drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">&quot;cyber-gear&quot;</span>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-fuchsia-200/60 uppercase tracking-wider text-[11px] font-bold">Sort by:</span>
            <select className="border border-fuchsia-500/30 rounded-md bg-white/5 hover:bg-white/10 px-3 py-1.5 text-sm outline-none cursor-pointer shadow-sm text-cyan-50 focus:ring-2 focus:ring-cyan-400 transition-all font-medium backdrop-blur-md">
              <option className="bg-[#0b0213]">Trending Matrix</option>
              <option className="bg-[#0b0213]">Price: Low to High</option>
              <option className="bg-[#0b0213]">Price: High to Low</option>
              <option className="bg-[#0b0213]">Avg. User Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Page body: sidebar + product grid ──────────────────────────── */}
      <div className="max-w-[1500px] mx-auto flex items-start gap-0 px-6 py-8">

        {/* ── Left Sidebar ────────────────────────────────────────────── */}
        <aside className="hidden md:block w-[240px] flex-shrink-0 pr-8 pt-2 border-r border-fuchsia-500/20 self-start sticky top-[120px]">

          {/* Free Shipping */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">Hyper-Delivery</h3>
            <label className="flex items-start gap-3 text-[13px] cursor-pointer group">
              <div className="relative flex items-center justify-center mt-[2px]">
                <input type="checkbox" className="peer appearance-none w-4 h-4 border border-fuchsia-500/50 rounded-sm bg-transparent checked:bg-cyan-500 checked:border-cyan-400 transition-colors cursor-pointer" />
                <svg className="absolute w-3 h-3 text-[#0b0213] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-fuchsia-100 group-hover:text-cyan-400 transition-colors">
                Free Shipping
                <span className="block text-[11px] text-fuchsia-200/50 mt-1">
                  Get FREE Hyper-Delivery on eligible orders.
                </span>
              </span>
            </label>
          </div>

          {/* Customer Review */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">User Rating</h3>
            {[4, 3, 2, 1].map((n) => (
              <div key={n} className="flex items-center gap-1 cursor-pointer group py-1">
                <span className="text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]">{"★".repeat(n)}</span>
                <span className="text-fuchsia-500/20">{"★".repeat(4 - n)}</span>
                <span className="text-[13px] text-fuchsia-200/60 group-hover:text-cyan-400 transition-colors ml-2">& Up</span>
              </div>
            ))}
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="text-[14px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">Availability</h3>
            <label className="flex items-center gap-3 text-[13px] cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-4 h-4 border border-fuchsia-500/50 rounded-sm bg-transparent checked:bg-cyan-500 checked:border-cyan-400 transition-colors cursor-pointer" />
                <svg className="absolute w-3 h-3 text-[#0b0213] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-fuchsia-100 group-hover:text-cyan-400 transition-colors">In Stock Only</span>
            </label>
          </div>

          {/* Separator */}
          <hr className="border-fuchsia-500/20 my-6" />

          {SIDEBAR.map((section) => (
            <div key={section.title} className="mb-8">
              <h3 className="text-[14px] font-bold mb-3 text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.checkbox ? (
                      <label className="flex items-center gap-3 text-[13px] cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" className="peer appearance-none w-4 h-4 border border-fuchsia-500/50 rounded-sm bg-transparent checked:bg-cyan-500 checked:border-cyan-400 transition-colors cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-[#0b0213] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-fuchsia-100 group-hover:text-cyan-400 transition-colors">{item.label}</span>
                      </label>
                    ) : (
                      <a href={item.href} className="text-[13px] text-fuchsia-100 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/30 group-hover:bg-cyan-400 group-hover:shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all"></span>
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* ── Main Product Area ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 md:pl-8">

          {/* Prime banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#170529] to-[#0b0213] border border-fuchsia-500/30 p-6 sm:p-8 mb-8 shadow-[0_0_30px_rgba(217,70,239,0.1)] group">
            {/* Glowing orb background effect */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 z-10">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-black text-[48px] italic shrink-0 leading-none drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                NEX<span className="text-fuchsia-400">+</span>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-white tracking-wide">NexStore Prime Protocol</h2>
                <p className="text-[14px] text-fuchsia-200/70 mt-1 max-w-lg leading-relaxed">Unlock unlimited hyper-delivery, exclusive neo-deals, and priority matrix access.</p>
                <div className="flex flex-wrap gap-4 mt-3 text-[13px] font-medium">
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">Initiate Protocol</a>
                  <span className="text-fuchsia-500/40">|</span>
                  <a href="#" className="text-fuchsia-400 hover:text-fuchsia-300 hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] transition-all">Manage Access</a>
                </div>
              </div>
            </div>
          </div>

          {/* Results label */}
          <div className="flex items-end gap-3 mb-6">
            <h1 className="text-[28px] font-bold text-white leading-none tracking-tight">System Results</h1>
            <p className="text-[13px] text-fuchsia-200/50 mb-1">Displaying compatible gear</p>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 text-fuchsia-200/30 border border-fuchsia-500/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <p className="text-5xl mb-4 animate-pulse">⚡</p>
              <p className="text-xl font-medium text-white">No active signals found.</p>
              <p className="text-sm mt-2">
                Deploy new <code className="bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded text-xs">product</code> nodes in Contentstack to populate the grid.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.uid} product={p} variant="grid" />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
