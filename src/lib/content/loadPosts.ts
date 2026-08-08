import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  id: string;
  title: string;
  description: string;
  slug: string;
  pubDate: string;
  updatedDate: string;
  category: string;
  tags: string[];
  author: string;
  draft: boolean;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!Object.keys(data).length) {
    throw new Error(`Post ${path.basename(filePath)} is missing frontmatter`);
  }

  return {
    id: String(data.id ?? ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    slug: String(data.slug ?? ""),
    pubDate: String(data.pubDate ?? ""),
    updatedDate: String(data.updatedDate ?? ""),
    category: String(data.category ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author ?? ""),
    draft: data.draft === true,
    content: content.trim(),
  };
}

function readAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => parsePost(path.join(POSTS_DIR, file)));
}

export function getAllPosts(): Post[] {
  return readAllPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
