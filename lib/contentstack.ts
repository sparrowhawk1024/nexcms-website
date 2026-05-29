// ─────────────────────────────────────────────────────────────────────────────
// lib/contentstack.ts  –  SDK init + typed fetch helpers
// ─────────────────────────────────────────────────────────────────────────────

import Contentstack from "contentstack";
import type {
  Author,
  BlogPost,
  Product,
  PaginatedResult,
  Review,
  Banner,
  Deal,
  CategoryPage,
} from "@/types";

// ── Stack config ──────────────────────────────────────────────────────────────
const stack = Contentstack.Stack({
  api_key:        process.env.CONTENTSTACK_API_KEY!,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN!,
  environment:    process.env.CONTENTSTACK_ENVIRONMENT ?? "development",
  region: Contentstack.Region.EU,
});

// ── Generic query helper ──────────────────────────────────────────────────────
function query(ct: string) {
  return stack.ContentType(ct).Query();
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await query("blog")
    .descending("published_date")
    .includeReference(["author"])
    .toJSON()
    .find();
  return result[0] as BlogPost[];
}

export async function getBlogPostByUrl(url: string): Promise<BlogPost | null> {
  const result = await query("blog")
    .where("url", url)
    .includeReference(["author"])
    .toJSON()
    .find();
  const posts = result[0] as BlogPost[];
  return posts.length > 0 ? posts[0] : null;
}

export async function getRecentBlogPosts(limit = 6): Promise<BlogPost[]> {
  const result = await query("blog")
    .descending("published_date")
    .limit(limit)
    .includeReference(["author"])
    .toJSON()
    .find();
  return result[0] as BlogPost[];
}

export async function getPaginatedBlogPosts(
  page = 1,
  limit = 9
): Promise<PaginatedResult<BlogPost>> {
  const skip = (page - 1) * limit;
  const q = query("blog")
    .descending("published_date")
    .limit(limit)
    .skip(skip)
    .includeReference(["author"])
    .includeCount()
    .toJSON();
  const result = await q.find();
  return {
    items: result[0] as BlogPost[],
    total: result[result.length - 1] as unknown as number,
    page,
    limit,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHORS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllAuthors(): Promise<Author[]> {
  const result = await query("author")
    .ascending("name")
    .toJSON()
    .find();
  return result[0] as Author[];
}

export async function getAuthorByUid(uid: string): Promise<Author | null> {
  try {
    const entry = await stack.ContentType("author").Entry(uid).toJSON().fetch();
    return entry as Author;
  } catch {
    return null;
  }
}

export async function getBlogPostsByAuthor(authorUid: string): Promise<BlogPost[]> {
  const result = await query("blog")
    .where("author.uid", authorUid)
    .descending("published_date")
    .includeReference(["author"])
    .toJSON()
    .find();
  return result[0] as BlogPost[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllProducts(opts?: {
  category?: string;
  inStockOnly?: boolean;
}): Promise<Product[]> {
  let q = query("product").ascending("title").includeReference([]).toJSON();

  if (opts?.category) {
    (q as any).where("category", opts.category);
  }
  if (opts?.inStockOnly) {
    (q as any).where("in_stock", true);
  }

  const result = await (q as any).find();
  return result[0] as Product[];
}

export async function getProductByUid(uid: string): Promise<Product | null> {
  try {
    const entry = await stack
      .ContentType("product")
      .Entry(uid)
      .toJSON()
      .fetch();
    return entry as Product;
  } catch {
    return null;
  }
}

export async function getPaginatedProducts(
  page = 1,
  limit = 12
): Promise<PaginatedResult<Product>> {
  const skip = (page - 1) * limit;
  const q = query("product")
    .ascending("title")
    .limit(limit)
    .skip(skip)
    .includeCount()
    .toJSON();
  const result = await (q as any).find();
  return {
    items: result[0] as Product[],
    total: result[result.length - 1] as unknown as number,
    page,
    limit,
  };
}

export async function getProductCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  return cats.sort();
}

/** Best sellers – products with is_best_seller = true */
export async function getBestSellers(limit = 8): Promise<Product[]> {
  try {
    const result = await query("product")
      .where("is_best_seller", true)
      .limit(limit)
      .toJSON()
      .find();
    return result[0] as Product[];
  } catch {
    return [];
  }
}

/** Featured products – products with is_featured = true */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const result = await query("product")
      .where("is_featured", true)
      .limit(limit)
      .toJSON()
      .find();
    return result[0] as Product[];
  } catch {
    return [];
  }
}

/** New arrivals – products with is_new_arrival = true */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const result = await query("product")
      .where("is_new_arrival", true)
      .limit(limit)
      .toJSON()
      .find();
    return result[0] as Product[];
  } catch {
    return [];
  }
}

/** Search products by title/brand/tags */
export async function searchProducts(queryStr: string): Promise<Product[]> {
  try {
    const result = await stack
      .ContentType("product")
      .Query()
      .regex("title", queryStr, "i")
      .toJSON()
      .find();
    return result[0] as Product[];
  } catch {
    // Fallback: fetch all and filter client-side
    try {
      const all = await getAllProducts();
      const lower = queryStr.toLowerCase();
      return all.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.brand?.toLowerCase().includes(lower) ||
          p.tags?.some((t) => t.toLowerCase().includes(lower))
      );
    } catch {
      return [];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS  (content type uid: "review")
// ─────────────────────────────────────────────────────────────────────────────

export async function getReviews(productUid: string): Promise<Review[]> {
  try {
    const result = await query("review")
      .where("product_uid", productUid)
      .descending("published_date")
      .toJSON()
      .find();
    return result[0] as Review[];
  } catch {
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const result = await query("review").descending("published_date").toJSON().find();
    return result[0] as Review[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BANNERS  (content type uid: "banner")
// ─────────────────────────────────────────────────────────────────────────────

export async function getBanners(): Promise<Banner[]> {
  try {
    const result = await query("banner")
      .where("active", true)
      .ascending("sort_order")
      .toJSON()
      .find();
    return result[0] as Banner[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEALS  (content type uid: "deal")
// ─────────────────────────────────────────────────────────────────────────────

export async function getDeals(): Promise<Deal[]> {
  try {
    const result = await query("deal")
      .where("active", true)
      .includeReference(["product"])
      .toJSON()
      .find();
    return result[0] as Deal[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY PAGES  (content type uid: "category_page")
// ─────────────────────────────────────────────────────────────────────────────

export async function getCategoryPages(): Promise<CategoryPage[]> {
  try {
    const result = await query("category_page")
      .where("active", true)
      .ascending("sort_order")
      .toJSON()
      .find();
    return result[0] as CategoryPage[];
  } catch {
    return [];
  }
}
