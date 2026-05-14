import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostByUrl, getAllBlogPosts, getRecentBlogPosts } from "@/lib/contentstack";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";
import type { Author } from "@/types";

export const revalidate = 60;

interface Props {
  params: Promise<{ url: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts().catch(() => []);
  return posts.map((p) => ({ url: p.url }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { url } = await params;
  const post = await getBlogPostByUrl(url).catch(() => null);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    openGraph: {
      images: post.featured_image?.url ? [post.featured_image.url] : [],
    },
  };
}

function getAuthor(author: Author | Author[]): Author | null {
  if (Array.isArray(author)) return author[0] ?? null;
  return author ?? null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { url } = await params;
  const [post, related] = await Promise.all([
    getBlogPostByUrl(url).catch(() => null),
    getRecentBlogPosts(4).catch(() => []),
  ]);

  if (!post) notFound();

  const author = getAuthor(post.author);
  const relatedPosts = related.filter((p) => p.uid !== post.uid).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Blog
      </Link>

      {/* Article header */}
      <article>
        <header className="mb-8">
          {post.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-xs font-medium border border-violet-500/20 mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm mb-6">
            {author && (
              <div className="flex items-center gap-2">
                {author.profile_image?.url ? (
                  <Image
                    src={author.profile_image.url}
                    alt={author.name}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="h-7 w-7 rounded-full bg-violet-700 flex items-center justify-center text-white text-xs font-bold">
                    {author.name?.[0]}
                  </span>
                )}
                <Link
                  href={`/authors/${author.uid}`}
                  className="hover:text-violet-300 transition-colors"
                >
                  {author.name}
                </Link>
              </div>
            )}
            <span>{formatDate(post.published_date)}</span>
            {post.read_time && <span>{post.read_time} min read</span>}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-xs border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured image */}
          {post.featured_image?.url && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={post.featured_image.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-violet max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-p:text-white/70 prose-p:leading-relaxed
            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
            prose-code:text-violet-300 prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
            prose-blockquote:border-l-violet-500 prose-blockquote:text-white/60
            prose-img:rounded-xl prose-img:border prose-img:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Author card */}
      {author && (
        <div className="mt-16 p-6 rounded-2xl border border-white/10 bg-white/5 flex gap-4 items-start">
          {author.profile_image?.url ? (
            <Image
              src={author.profile_image.url}
              alt={author.name}
              width={56}
              height={56}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <span className="h-14 w-14 rounded-full bg-violet-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {author.name?.[0]}
            </span>
          )}
          <div>
            <p className="text-white font-semibold">{author.name}</p>
            {author.role && <p className="text-violet-400 text-sm mb-2">{author.role}</p>}
            <p className="text-white/50 text-sm">{author.bio}</p>
            <Link
              href={`/authors/${author.uid}`}
              className="inline-block mt-3 text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              View all posts →
            </Link>
          </div>
        </div>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-white font-semibold text-xl mb-6">More from the Blog</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPosts.map((p) => (
              <BlogCard key={p.uid} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
