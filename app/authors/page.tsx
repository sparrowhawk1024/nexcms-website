import Image from "next/image";
import Link from "next/link";
import { getAllAuthors } from "@/lib/contentstack";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authors" };
export const revalidate = 60;

export default async function AuthorsPage() {
  const authors = await getAllAuthors().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Authors</h1>
        <p className="text-white/50">{authors.length} writers on NexCMS</p>
      </div>

      {authors.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <p className="text-4xl mb-4">👤</p>
          <p className="text-lg font-medium">No authors yet.</p>
          <p className="text-sm mt-1">Add entries in the <code className="bg-white/10 px-1 rounded">author</code> content type in Contentstack.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Link
              key={author.uid}
              href={`/authors/${author.uid}`}
              className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/40 hover:bg-white/8 transition-all duration-300"
            >
              {author.profile_image?.url ? (
                <Image
                  src={author.profile_image.url}
                  alt={author.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover mb-4"
                />
              ) : (
                <span className="h-18 w-18 rounded-full bg-violet-700 flex items-center justify-center text-white text-2xl font-bold mb-4 h-[72px] w-[72px]">
                  {author.name?.[0]}
                </span>
              )}
              <h2 className="text-white font-semibold text-lg group-hover:text-violet-300 transition-colors">
                {author.name}
              </h2>
              {author.role && (
                <span className="text-violet-400 text-sm mt-1">{author.role}</span>
              )}
              {author.bio && (
                <p className="text-white/50 text-sm mt-3 leading-relaxed line-clamp-3">{author.bio}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
