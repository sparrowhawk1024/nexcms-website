// ─────────────────────────────────────────────────────────────────────────────
// NexCMS – Contentstack type definitions
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
  content: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  read_time?: number;
  author: Author | Author[];
}

// ── Product ───────────────────────────────────────────────────────────────────
export interface Product {
  uid: string;
  title: string;
  slug: string;
  description: string;
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
  // ── New fields (add these in Contentstack) ─────────────────────────────────
  rating?: number;           // Number 1–5, e.g. 4.3
  review_count?: number;     // Total reviews
  is_best_seller?: boolean;  // Marks product as best seller
  is_featured?: boolean;     // Shows on homepage hero section
  is_new_arrival?: boolean;  // Shows in New Arrivals
  sale_ends_at?: string;     // ISO date-time string – enables countdown timer
  sponsored?: boolean;       // Shows "Sponsored" label
  brand?: string;            // e.g. "Samsung", "Apple"
  delivery_days?: number;    // e.g. 2 for "Delivery in 2 days"
}

// ── Review ────────────────────────────────────────────────────────────────────
// Contentstack content type UID: "review"
// Fields: title, product_uid (String), reviewer_name (String),
//         rating (Number), review_body (Rich text), verified_purchase (Boolean),
//         helpful_count (Number), published_date (Date)
export interface Review {
  uid: string;
  title: string;
  product_uid: string;
  reviewer_name: string;
  rating: number;
  review_body?: string;
  verified_purchase?: boolean;
  helpful_count?: number;
  published_date?: string;
}

// ── Banner ────────────────────────────────────────────────────────────────────
// Contentstack content type UID: "banner"
// Fields: title, subtitle (String), desktop_image (File), mobile_image (File),
//         cta_label (String), cta_url (String), badge_text (String),
//         active (Boolean), sort_order (Number)
export interface Banner {
  uid: string;
  title: string;
  subtitle?: string;
  desktop_image: CSFile;
  mobile_image?: CSFile;
  cta_label?: string;
  cta_url?: string;
  badge_text?: string;
  active: boolean;
  sort_order?: number;
}

// ── Deal ──────────────────────────────────────────────────────────────────────
// Contentstack content type UID: "deal"
// Fields: title, product (Reference → product), deal_price (Number),
//         ends_at (Date/Time), active (Boolean)
export interface Deal {
  uid: string;
  title: string;
  product: Product;
  deal_price: number;
  ends_at?: string;
  active: boolean;
}

// ── CategoryPage ──────────────────────────────────────────────────────────────
// Contentstack content type UID: "category_page"
// Fields: title, slug (String), icon (String – emoji), banner_image (File),
//         description (String), sort_order (Number), active (Boolean)
export interface CategoryPage {
  uid: string;
  title: string;
  slug: string;
  icon?: string;
  banner_image?: CSFile;
  description?: string;
  sort_order?: number;
  active: boolean;
}

// ── Shared pagination helper ───────────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
