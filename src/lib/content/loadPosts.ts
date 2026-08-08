import fs from "node:fs";
import path from "node:path";

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

function parseScalar(value: string): string | boolean | string[] {
  const trimmed = value.trim();

  if (trimmed === "true" || trimmed === "false") {
    return trimmed === "true";
  }

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return trimmed.replace(/^["']|["']$/g, "");
}

function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Post ${path.basename(filePath)} is missing frontmatter`);
  }

  const frontmatter = Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) {
          throw new Error(`Invalid frontmatter line in ${path.basename(filePath)}`);
        }

        return [line.slice(0, separator).trim(), parseScalar(line.slice(separator + 1))];
      }),
  );

  return {
    id: String(frontmatter.id ?? ""),
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    slug: String(frontmatter.slug ?? ""),
    pubDate: String(frontmatter.pubDate ?? ""),
    updatedDate: String(frontmatter.updatedDate ?? ""),
    category: String(frontmatter.category ?? ""),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    author: String(frontmatter.author ?? ""),
    draft: frontmatter.draft === true,
    content: match[2].trim(),
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
