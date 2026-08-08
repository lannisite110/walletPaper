import Link from "next/link";
import { ToolBadge } from "@/components/ToolBadge";
import { getAllTools } from "@/lib/content/loadTools";

export const metadata = {
  title: "Tools",
  description: "Browse developer tools with theme collections and reserved slots.",
};

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        Catalog
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Tools</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
        Browse current theme collections and the next tool slots we are reserving for the catalog.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition-colors hover:border-[var(--accent-dim)]"
          >
            <ToolBadge tool={tool} />
            <h2 className="mt-5 text-xl font-semibold">{tool.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{tool.description}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-[var(--accent)]">
              Explore {tool.name} →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
