// ─────────────────────────────────────────────────────────────────────────────
// lib/contentstack.ts  –  SDK init + typed fetch helpers
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD A NEW CONTENT TYPE
// 1. Define its interface in types/index.ts
// 2. Copy one of the fetch patterns below and swap the content_type uid
// 3. Add the relevant references in .includeReference([...]) if needed
// ─────────────────────────────────────────────────────────────────────────────

import Contentstack from "contentstack";
import type { Author, BlogPost, Product, PaginatedResult } from "@/types";

// ── Stack config ──────────────────────────────────────────────────────────────
// Env variables are read at build time for static pages and at request time for
// dynamic segments. Set them in .env.local (never commit real tokens).
const stack = Contentstack.Stack({
  api_key:          process.env.CONTENTSTACK_API_KEY!,
  delivery_token:   process.env.CONTENTSTACK_DELIVERY_TOKEN!,
  environment:      process.env.CONTENTSTACK_ENVIRONMENT ?? "development",
  // Optional: uncomment to target a specific region
  region: Contentstack.Region.EU,
});

// ─────────────────────────────────────────────────────────────────────────────
// Generic query helper – avoids repeating the promise dance everywhere
// ─────────────────────────────────────────────────────────────────────────────
function query(ct: string) {
  return stack.ContentType(ct).Query();
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all published blog posts, sorted newest-first */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await query("blog")
    .descending("published_date")
    .includeReference(["author"])
    .toJSON()
    .find();
  return result[0] as BlogPost[];
}

/** Fetch a single blog post by its URL slug */
export async function getBlogPostByUrl(url: string): Promise<BlogPost | null> {
  const result = await query("blog")
    .where("url", url)
    .includeReference(["author"])
    .toJSON()
    .find();
  const posts = result[0] as BlogPost[];
  return posts.length > 0 ? posts[0] : null;
}

/** Fetch N most recent posts (used on homepage) */
export async function getRecentBlogPosts(limit = 6): Promise<BlogPost[]> {
  const result = await query("blog")
    .descending("published_date")
    .limit(limit)
    .includeReference(["author"])
    .toJSON()
    .find();
  return result[0] as BlogPost[];
}

/** Paginated blog listing */
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
    const entry = await stack
      .ContentType("author")
      .Entry(uid)
      .toJSON()
      .fetch();
    return entry as Author;
  } catch {
    return null;
  }
}

/** Posts written by a specific author uid */
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

/** Fetch all products – you can filter by category or in_stock */
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

/** Fetch a single product by its uid */
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

/** Paginated product listing */
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

/** All unique product categories */
export async function getProductCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  return cats.sort();
}
