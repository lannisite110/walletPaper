import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllPosts, getPostBySlug } from "@/lib/content/loadPosts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return post ? { title: post.title, description: post.description } : {};
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        {post.category}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-4 text-lg leading-7 text-[var(--muted)]">{post.description}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
        <span>By {post.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.pubDate}>{post.pubDate}</time>
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--border)] px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <article className="mt-10 border-t border-[var(--border)] pt-2">
        <div className="space-y-4 text-[var(--muted)]">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="mt-8 text-2xl font-semibold text-[var(--text)]">{children}</h2>
              ),
              ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
              p: ({ children }) => <p className="leading-7">{children}</p>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
