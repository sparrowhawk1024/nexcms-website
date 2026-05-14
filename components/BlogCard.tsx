import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// BlogCard  –  modular, composable blog card
//
// Usage variants:
//   <BlogCard post={post} />                      → default card
//   <BlogCard post={post} variant="featured" />   → large hero card
//   <BlogCard post={post} variant="compact" />    → horizontal compact row
//   <BlogCard post={post} variant="minimal" />    → text-only list item
// ─────────────────────────────────────────────────────────────────────────────

type CardVariant = "default" | "featured" | "compact" | "minimal";

interface BlogCardProps {
  post: BlogPost;
  variant?: CardVariant;
  className?: string;
}

function getAuthorName(author: BlogPost["author"]): string {
  if (Array.isArray(author)) return author[0]?.name ?? "Unknown";
  return (author as any)?.name ?? "Unknown";
}

function getAuthorAvatar(author: BlogPost["author"]): string | null {
  const a = Array.isArray(author) ? author[0] : author;
  return (a as any)?.profile_image?.url ?? null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Default card ──────────────────────────────────────────────────────────────
function DefaultCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.url}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/40 hover:bg-white/8 transition-all duration-300"
    >
      {post.featured_image?.url && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.featured_image.url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.category && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-violet-600/80 text-white text-xs font-medium backdrop-blur-sm">
              {post.category}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-violet-300 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            {getAuthorAvatar(post.author) ? (
              <Image
                src={getAuthorAvatar(post.author)!}
                alt={getAuthorName(post.author)}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="h-6 w-6 rounded-full bg-violet-700 flex items-center justify-center text-white text-xs font-bold">
                {getAuthorName(post.author)[0]}
              </span>
            )}
            <span className="text-white/50 text-xs">{getAuthorName(post.author)}</span>
          </div>
          <span className="text-white/30 text-xs">{formatDate(post.published_date)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Featured card ─────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.url}`}
      className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 min-h-[400px] flex"
    >
      {post.featured_image?.url && (
        <Image
          src={post.featured_image.url}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="relative mt-auto p-8">
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium mb-3">
            {post.category}
          </span>
        )}
        <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-3 group-hover:text-violet-300 transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-2xl line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm">{getAuthorName(post.author)}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/40 text-sm">{formatDate(post.published_date)}</span>
          {post.read_time && (
            <>
              <span className="text-white/30">·</span>
              <span className="text-white/40 text-sm">{post.read_time} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Compact card ──────────────────────────────────────────────────────────────
function CompactCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.url}`}
      className="group flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-violet-500/40 hover:bg-white/8 transition-all duration-200"
    >
      {post.featured_image?.url && (
        <div className="relative h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image src={post.featured_image.url} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <h3 className="text-white text-sm font-medium leading-snug group-hover:text-violet-300 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">{getAuthorName(post.author)}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/30 text-xs">{formatDate(post.published_date)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Minimal card ──────────────────────────────────────────────────────────────
function MinimalCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.url}`}
      className="group flex items-start gap-3 py-3 border-b border-white/10 hover:border-white/20 transition-colors"
    >
      <span className="text-white/20 text-xs font-mono pt-1 w-16 flex-shrink-0">
        {formatDate(post.published_date)}
      </span>
      <span className="text-white/80 text-sm group-hover:text-violet-300 transition-colors">
        {post.title}
      </span>
    </Link>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function BlogCard({ post, variant = "default", className = "" }: BlogCardProps) {
  const map = {
    default:  <DefaultCard post={post} />,
    featured: <FeaturedCard post={post} />,
    compact:  <CompactCard post={post} />,
    minimal:  <MinimalCard post={post} />,
  };
  return <div className={className}>{map[variant]}</div>;
}
