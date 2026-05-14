import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "NexStore", template: "%s · NexStore" },
  description: "A modern, modular e-commerce platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#0b0213] text-[#e2d5f8] antialiased font-sans selection:bg-fuchsia-500/30">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-black border-t border-fuchsia-500/30 shadow-[0_-5px_20px_rgba(217,70,239,0.1)] text-white py-12 mt-20 relative z-10">
          <div className="mx-auto max-w-[1500px] px-6 flex flex-col items-center gap-6">
            <div className="flex gap-8 flex-wrap justify-center text-sm font-medium text-fuchsia-200/60">
              <a href="#" className="hover:text-fuchsia-400 hover:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">Conditions of Use & Sale</a>
              <a href="#" className="hover:text-fuchsia-400 hover:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">Privacy Notice</a>
              <a href="#" className="hover:text-fuchsia-400 hover:shadow-[0_0_10px_rgba(217,70,239,0.5)] transition-all">Interest-Based Ads</a>
            </div>
            <span className="text-fuchsia-500/40 text-sm tracking-wider">© {new Date().getFullYear()}, NexStore.com, Inc. or its affiliates</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
