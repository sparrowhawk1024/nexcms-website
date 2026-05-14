import { getAllBlogPosts } from "@/lib/contentstack";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllBlogPosts().catch(() => []);

  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
        <p className="text-white/50">
          {posts.length} {posts.length === 1 ? "post" : "posts"} · updated from Contentstack
        </p>
      </div>

      {/* Category pills (client-side filter via URL would need a client component;
          for simplicity this renders all categories as anchor links with hash) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 text-xs font-medium border border-violet-500/30">
            All
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs font-medium border border-white/10 hover:border-violet-500/30 hover:text-violet-300 transition-all cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-lg font-medium">No posts yet.</p>
          <p className="text-sm mt-1">Add some in Contentstack and they'll appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.uid} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
