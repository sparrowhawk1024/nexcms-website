// ─────────────────────────────────────────────────────────────────────────────
// NexCMS – Contentstack type definitions
// ─────────────────────────────────────────────────────────────────────────────
// To add a new content type:
//  1. Define its interface here
//  2. Add a fetch fn in lib/contentstack.ts
//  3. Create the page/component in app/
// ─────────────────────────────────────────────────────────────────────────────

export interface CSFile {
  url: string;
  title?: string;
  content_type?: string;
}

// ── Author ────────────────────────────────────────────────────────────────────
export interface Author {
  uid: string;
  title: string;
  name: string;
  bio: string;
  profile_image: CSFile;
  role?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface BlogPost {
  uid: string;
  title: string;
  url: string;
  featured_image: CSFile;
  published_date: string;
  content: string;        // rich text HTML
  excerpt?: string;
  tags?: string[];
  category?: string;
  read_time?: number;     // minutes – set manually in CMS
  author: Author | Author[];
}

// ── Product ───────────────────────────────────────────────────────────────────
// Contentstack content type UID: "product"
// Required fields in Contentstack:
//   title        (String)
//   uid          (auto)
//   slug         (String – used in URL)
//   description  (Rich Text)
//   short_desc   (String  – card excerpt)
//   price        (Number  – base price in INR/USD, set currency in CONFIG)
//   compare_price (Number – strike-through price, optional)
//   images       (File[]  – first image = primary)
//   category     (String  – e.g. "SaaS", "Plugin", "Template")
//   tags         (String[])
//   in_stock     (Boolean)
//   badge        (String  – e.g. "New", "Sale", "Popular")
//   features     (Group[] → { label: String, value: String })
//   cta_label    (String  – button text, default "Buy Now")
//   cta_url      (String  – external checkout / Gumroad / etc.)
export interface Product {
  uid: string;
  title: string;
  slug: string;
  description: string;    // rich text HTML
  short_desc: string;
  price: number;
  compare_price?: number;
  images: CSFile[];
  category: string;
  tags?: string[];
  in_stock: boolean;
  badge?: string;
  features?: { label: string; value: string }[];
  cta_label?: string;
  cta_url?: string;
}

// ── Shared pagination helper ───────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
