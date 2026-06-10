import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/contexts/CartContext";
import { CookieProvider } from "@/contexts/CookieContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import { getProductCategories } from "@/lib/contentstack";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "NexStore – Shop the Future", template: "%s · NexStore" },
  description:
    "NexStore – a premium cyberpunk-themed e-commerce store. Shop mobiles, laptops, headphones, speakers, and more. Powered by Contentstack.",
  keywords: ["NexStore", "online shopping", "mobiles", "laptops", "headphones", "deals"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getProductCategories().catch(() => []);

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#0b0213] text-[#e2d5f8] antialiased font-sans selection:bg-fuchsia-500/30">
        <CartProvider>
          <CookieProvider>
            <PersonalizationProvider>
              <Navbar categories={categories} />
              <CartDrawer />
              <CookieBanner />
              <main>{children}</main>
          <footer className="bg-black border-t border-fuchsia-500/30 shadow-[0_-5px_20px_rgba(217,70,239,0.1)] text-white py-14 mt-20 relative z-10">
            <div className="mx-auto max-w-[1500px] px-6">
              {/* Footer grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                <div>
                  <h3 className="text-cyan-400 font-black text-sm uppercase tracking-widest mb-4 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
                    Shop
                  </h3>
                  <ul className="space-y-2.5 text-sm text-fuchsia-200/50">
                    {[
                      ["Deals", "/deals"],
                      ["Best Sellers", "/best-sellers"],
                      ["New Arrivals", "/new-arrivals"],
                      ["All Products", "/products"],
                    ].map(([label, href]) => (
                      <li key={href}>
                        <a href={href} className="hover:text-cyan-400 transition-colors">{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-fuchsia-400 font-black text-sm uppercase tracking-widest mb-4 drop-shadow-[0_0_5px_rgba(217,70,239,0.4)]">
                    Help
                  </h3>
                  <ul className="space-y-2.5 text-sm text-fuchsia-200/50">
                    {["Returns & Orders", "Customer Service", "Track Package", "Report an Issue"].map(
                      (label) => (
                        <li key={label}>
                          <a href="#" className="hover:text-fuchsia-300 transition-colors">{label}</a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-black text-sm uppercase tracking-widest mb-4">
                    Discover
                  </h3>
                  <ul className="space-y-2.5 text-sm text-fuchsia-200/50">
                    {[["Blog", "/blog"], ["Authors", "/authors"], ["Products", "/products"]].map(
                      ([label, href]) => (
                        <li key={href}>
                          <a href={href} className="hover:text-amber-300 transition-colors">{label}</a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-green-400 font-black text-sm uppercase tracking-widest mb-4">
                    About
                  </h3>
                  <p className="text-fuchsia-200/40 text-sm leading-relaxed">
                    NexStore is a cutting-edge headless commerce platform powered by Next.js and
                    Contentstack.
                  </p>
                </div>
              </div>

              <div className="border-t border-fuchsia-500/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-fuchsia-500/30 text-sm tracking-wider">
                  © {new Date().getFullYear()} NexStore.in — All rights reserved
                </span>
                <div className="flex gap-6 flex-wrap justify-center text-sm text-fuchsia-200/40">
                  <a href="#" className="hover:text-fuchsia-300 transition-colors">Conditions of Use</a>
                  <a href="#" className="hover:text-fuchsia-300 transition-colors">Privacy Notice</a>
                  <a href="#" className="hover:text-fuchsia-300 transition-colors">Interest-Based Ads</a>
                </div>
              </div>
            </div>
          </footer>
            </PersonalizationProvider>
          </CookieProvider>
        </CartProvider>
      </body>
    </html>
  );
}
