import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAuthorByUid, getAllAuthors, getBlogPostsByAuthor } from "@/lib/contentstack";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateStaticParams() {
  const authors = await getAllAuthors().catch(() => []);
  return authors.map((a) => ({ uid: a.uid }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const author = await getAuthorByUid(uid).catch(() => null);
  if (!author) return { title: "Author not found" };
  return {
    title: author.name,
    description: author.bio ?? author.name,
  };
}

export default async function AuthorDetailPage({ params }: Props) {
  const { uid } = await params;
  const [author, posts] = await Promise.all([
    getAuthorByUid(uid).catch(() => null),
    getBlogPostsByAuthor(uid).catch(() => []),
  ]);

  if (!author) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back */}
      <Link
        href="/authors"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        All Authors
      </Link>

      {/* Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
        {author.profile_image?.url ? (
          <Image
            src={author.profile_image.url}
            alt={author.name}
            width={100}
            height={100}
            className="rounded-2xl object-cover flex-shrink-0 border border-white/10"
          />
        ) : (
          <span className="h-[100px] w-[100px] rounded-2xl bg-violet-700 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {author.name?.[0]}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{author.name}</h1>
          {author.role && (
            <p className="text-violet-400 font-medium mb-3">{author.role}</p>
          )}
          {author.bio && (
            <p className="text-white/60 leading-relaxed max-w-xl">{author.bio}</p>
          )}

          {/* Social links */}
          {author.social_links && (
            <div className="flex gap-3 mt-4">
              {author.social_links.twitter && (
                <a
                  href={author.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  Twitter
                </a>
              )}
              {author.social_links.github && (
                <a
                  href={author.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  GitHub
                </a>
              )}
              {author.social_links.linkedin && (
                <a
                  href={author.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-6">
          {posts.length} {posts.length === 1 ? "Post" : "Posts"}
        </h2>
        {posts.length === 0 ? (
          <p className="text-white/30 text-sm">No posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.uid} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
