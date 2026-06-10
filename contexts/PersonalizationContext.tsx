"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "@/types";

// ── Storage keys ───────────────────────────────────────────────────────────────
const RECENTLY_VIEWED_KEY  = "nexstore_recently_viewed";
const CATEGORY_COUNTS_KEY  = "nexstore_category_counts";
const LAST_CATEGORY_KEY    = "nexstore_last_category";
const PAGE_VIEWS_KEY       = "nexstore_page_views";

const MAX_RECENTLY_VIEWED  = 12;

// ── Slim product snapshot stored in localStorage ───────────────────────────────
export interface ViewedProduct {
  uid: string;
  title: string;
  slug: string;
  price: number;
  compare_price?: number;
  image?: string;
  category: string;
  brand?: string;
  rating?: number;
  in_stock: boolean;
  viewedAt: number; // timestamp ms
}

export interface PageView {
  path: string;
  viewedAt: number;
}

export interface PersonalizationData {
  recentlyViewed: ViewedProduct[];
  categoryCounts: Record<string, number>;
  lastCategory: string | null;
  topCategory: string | null;
  pageViews: PageView[];
}

interface PersonalizationContextType extends PersonalizationData {
  trackProductView: (product: Product) => void;
  trackCategoryClick: (category: string) => void;
  trackPageView: (path: string) => void;
  clearHistory: () => void;
  hydrated: boolean;
}

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

// ── Helpers ────────────────────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / storage quota — fail silently
  }
}

function getTopCategory(counts: Record<string, number>): string | null {
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function toViewedProduct(product: Product): ViewedProduct {
  return {
    uid:           product.uid,
    title:         product.title,
    slug:          product.slug,
    price:         product.price,
    compare_price: product.compare_price,
    image:         product.images?.[0]?.url,
    category:      product.category,
    brand:         product.brand,
    rating:        product.rating,
    in_stock:      product.in_stock,
    viewedAt:      Date.now(),
  };
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated]           = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedProduct[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [lastCategory, setLastCategory]   = useState<string | null>(null);
  const [pageViews, setPageViews]         = useState<PageView[]>([]);

  // ── Hydrate from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    setRecentlyViewed(readJSON<ViewedProduct[]>(RECENTLY_VIEWED_KEY, []));
    setCategoryCounts(readJSON<Record<string, number>>(CATEGORY_COUNTS_KEY, {}));
    setLastCategory(readJSON<string | null>(LAST_CATEGORY_KEY, null));
    setPageViews(readJSON<PageView[]>(PAGE_VIEWS_KEY, []));
    setHydrated(true);
  }, []);

  // ── Track product view ─────────────────────────────────────────────────────
  const trackProductView = useCallback((product: Product) => {
    const snapshot = toViewedProduct(product);

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.uid !== product.uid);
      const updated = [snapshot, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      writeJSON(RECENTLY_VIEWED_KEY, updated);
      return updated;
    });

    // Also bump category count
    setCategoryCounts((prev) => {
      const updated = { ...prev, [product.category]: (prev[product.category] ?? 0) + 1 };
      writeJSON(CATEGORY_COUNTS_KEY, updated);
      return updated;
    });
  }, []);

  // ── Track category click ───────────────────────────────────────────────────
  const trackCategoryClick = useCallback((category: string) => {
    setLastCategory(category);
    writeJSON(LAST_CATEGORY_KEY, category);

    setCategoryCounts((prev) => {
      const updated = { ...prev, [category]: (prev[category] ?? 0) + 1 };
      writeJSON(CATEGORY_COUNTS_KEY, updated);
      return updated;
    });
  }, []);

  // ── Track page view (analytics) ────────────────────────────────────────────
  const trackPageView = useCallback((path: string) => {
    setPageViews((prev) => {
      const entry: PageView = { path, viewedAt: Date.now() };
      const updated = [entry, ...prev].slice(0, 100); // keep last 100
      writeJSON(PAGE_VIEWS_KEY, updated);
      return updated;
    });
  }, []);

  // ── Clear all personalization data ─────────────────────────────────────────
  const clearHistory = useCallback(() => {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    localStorage.removeItem(CATEGORY_COUNTS_KEY);
    localStorage.removeItem(LAST_CATEGORY_KEY);
    localStorage.removeItem(PAGE_VIEWS_KEY);
    setRecentlyViewed([]);
    setCategoryCounts({});
    setLastCategory(null);
    setPageViews([]);
  }, []);

  const topCategory = getTopCategory(categoryCounts);

  return (
    <PersonalizationContext.Provider
      value={{
        recentlyViewed,
        categoryCounts,
        lastCategory,
        topCategory,
        pageViews,
        trackProductView,
        trackCategoryClick,
        trackPageView,
        clearHistory,
        hydrated,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) throw new Error("usePersonalization must be inside PersonalizationProvider");
  return ctx;
}
