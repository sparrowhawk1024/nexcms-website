# NexCMS 🚀

A modular, production-ready CMS website built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, and **Contentstack**. Includes a full blog system, a product catalog with pricing, author profiles, and on-demand ISR revalidation.

---

## Features

- **Modular blog system** — four card variants (`default`, `featured`, `compact`, `minimal`) you can mix anywhere
- **Product catalog** — add/remove products with pricing, compare prices, badges, stock status, CTA buttons, and feature lists — all from Contentstack
- **Author profiles** — author directory with individual pages listing their posts
- **On-demand ISR** — changes in Contentstack publish within seconds via a webhook → revalidation API
- **Fully typed** — every content type is modelled in `types/index.ts`; add a new one in three steps

---

## Project structure

```
nexcms/
├── app/
│   ├── page.tsx                  ← Homepage
│   ├── layout.tsx
│   ├── globals.css
│   ├── blog/
│   │   ├── page.tsx              ← Blog listing
│   │   └── [url]/page.tsx        ← Blog post
│   ├── products/
│   │   ├── page.tsx              ← Product listing
│   │   └── [uid]/page.tsx        ← Product detail
│   ├── authors/
│   │   ├── page.tsx              ← Authors directory
│   │   └── [uid]/page.tsx        ← Author + their posts
│   └── api/
│       └── revalidate/route.ts   ← Contentstack webhook handler
├── components/
│   ├── Navbar.tsx
│   ├── BlogCard.tsx              ← Modular (4 variants)
│   └── ProductCard.tsx           ← Modular (3 variants)
├── lib/
│   └── contentstack.ts           ← All CMS fetch helpers
└── types/
    └── index.ts                  ← Content type interfaces
```

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo>
cd nexcms
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

| Variable | Where to find it |
|---|---|
| `CONTENTSTACK_API_KEY` | Contentstack → Settings → Stack → API Keys → Stack API Key |
| `CONTENTSTACK_DELIVERY_TOKEN` | Contentstack → Settings → Tokens → Delivery Token |
| `CONTENTSTACK_ENVIRONMENT` | e.g. `development` or `production` |
| `REVALIDATE_SECRET` | Make up a long random string (used in your webhook URL) |

### 3. Create content types in Contentstack

You need three content types. Go to **Content Models** → **Add Content Type**.

#### `author`
| Field label | UID | Type | Notes |
|---|---|---|---|
| Name | `name` | Short text | Required |
| Bio | `bio` | Rich text | |
| Profile Image | `profile_image` | File | |
| Role | `role` | Short text | e.g. "Senior Editor" |
| Social Links | `social_links` | Group | |
| ↳ Twitter | `twitter` | Short text | |
| ↳ GitHub | `github` | Short text | |
| ↳ LinkedIn | `linkedin` | Short text | |

#### `blog`
| Field label | UID | Type | Notes |
|---|---|---|---|
| Title | `title` | Short text | Required |
| URL | `url` | Short text | Required – used in slug |
| Featured Image | `featured_image` | File | |
| Published Date | `published_date` | Date | |
| Content | `content` | Rich text | |
| Excerpt | `excerpt` | Short text | For card previews |
| Category | `category` | Short text | e.g. "Tutorial" |
| Tags | `tags` | Multiple short text | |
| Read Time | `read_time` | Number | Minutes |
| Author | `author` | Reference → author | |

#### `product`
| Field label | UID | Type | Notes |
|---|---|---|---|
| Title | `title` | Short text | Required |
| Slug | `slug` | Short text | Required – used in URL |
| Short Description | `short_desc` | Short text | Card excerpt |
| Description | `description` | Rich text | Full product page |
| Price | `price` | Number | Base price |
| Compare Price | `compare_price` | Number | Strike-through price |
| Images | `images` | Multiple files | First = primary |
| Category | `category` | Short text | e.g. "Plugin" |
| Tags | `tags` | Multiple short text | |
| In Stock | `in_stock` | Boolean | |
| Badge | `badge` | Short text | e.g. "New", "Sale" |
| Features | `features` | Group (multiple) | |
| ↳ Label | `label` | Short text | e.g. "Licence" |
| ↳ Value | `value` | Short text | e.g. "Lifetime" |
| CTA Label | `cta_label` | Short text | Default: "Buy Now" |
| CTA URL | `cta_url` | Short text | Checkout / Gumroad link |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding and removing products

All product management is done in **Contentstack** — no code changes needed.

**To add a product:**
1. Go to Contentstack → Content → `product` content type
2. Click **+ New Entry**
3. Fill in Title, Slug (URL-safe, e.g. `my-product`), Price, Images, etc.
4. Set **In Stock** to `true`
5. Click **Publish** → appears on site within 60 seconds (or instantly via webhook)

**To remove a product:**
- Unpublish or delete the entry in Contentstack

**To change pricing:**
- Edit the `price` or `compare_price` fields and republish

**To mark as out of stock:**
- Set `in_stock` to `false` and republish — the product stays visible but shows "Out of Stock" and disables the buy button

---

## On-demand revalidation (instant updates)

By default the site caches for 60 seconds (`export const revalidate = 60`). For instant updates, set up a webhook:

1. In Contentstack → **Settings → Webhooks → Add Webhook**
2. Set URL to: `https://your-domain.com/api/revalidate?secret=<REVALIDATE_SECRET>`
3. Triggers: check **Entry Published**, **Entry Unpublished**, **Entry Deleted**
4. Save

Now whenever you publish or unpublish content in Contentstack, the relevant pages revalidate immediately.

---

## Customisation

### Changing the currency

In `components/ProductCard.tsx` and `app/products/[uid]/page.tsx`, find:

```ts
const CURRENCY = { symbol: "₹", locale: "en-IN" };
```

Change to e.g. `{ symbol: "$", locale: "en-US" }` for USD.

### Using a different card variant

```tsx
// Blog
<BlogCard post={post} variant="featured" />  // large hero
<BlogCard post={post} variant="compact" />   // horizontal row
<BlogCard post={post} variant="minimal" />   // text-only list item
<BlogCard post={post} variant="default" />   // standard grid card

// Product
<ProductCard product={p} variant="list" />     // horizontal row
<ProductCard product={p} variant="featured" /> // large two-column hero
<ProductCard product={p} variant="grid" />     // standard grid card
```

### Adding a new content type

1. Define its TypeScript interface in `types/index.ts`
2. Add a fetch function in `lib/contentstack.ts` (copy an existing one and swap the content type uid)
3. Create the page in `app/your-new-type/page.tsx`
4. Add a nav link in `components/Navbar.tsx`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all four env variables in Vercel → Settings → Environment Variables
4. Deploy — Vercel auto-detects Next.js

After first deploy, update your Contentstack webhook URL to the production domain.
