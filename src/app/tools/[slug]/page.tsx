import { notFound } from "next/navigation";
import { ThemeCard } from "@/components/ThemeCard";
import { ToolBadge } from "@/components/ToolBadge";
import { getThemesByTool } from "@/lib/content/loadThemes";
import { getAllTools, getToolBySlug } from "@/lib/content/loadTools";
import type { SourceType, ThemeStatus } from "@/lib/content/types";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sourceType?: string; status?: string }>;
};

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Pick<PageProps, "params">) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  return tool ? { title: `${tool.name} themes` } : {};
}

function isSourceType(value: string | undefined): value is SourceType {
  return value === "original" || value === "curated";
}

function isThemeStatus(value: string | undefined): value is ThemeStatus {
  return value === "ready" || value === "placeholder" || value === "coming-soon";
}

export default async function ToolDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const filters = await searchParams;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const themes = getThemesByTool(tool.slug).filter(
    (theme) =>
      (!isSourceType(filters.sourceType) || theme.sourceType === filters.sourceType) &&
      (!isThemeStatus(filters.status) || theme.status === filters.status),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ToolBadge tool={tool} />
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{tool.name} themes</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">{tool.description}</p>

      {tool.capability === "placeholder" ? (
        <section className="mt-10 rounded-xl border border-dashed border-[var(--accent-dim)] bg-[var(--bg-elevated)] p-8">
          <h2 className="text-xl font-semibold">Slot reserved, content coming</h2>
          <p className="mt-2 max-w-xl text-[var(--muted)]">
            This tool is part of the catalog roadmap. No themes or installation paths are claimed
            here yet.
          </p>
        </section>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap gap-2 text-sm">
            <a href={`/tools/${tool.slug}`} className="rounded-full border border-[var(--accent)] px-3 py-1 text-[var(--accent)]">
              All
            </a>
            <a href={`/tools/${tool.slug}?sourceType=original`} className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:border-[var(--accent)]">
              Original
            </a>
            <a href={`/tools/${tool.slug}?sourceType=curated`} className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:border-[var(--accent)]">
              Curated
            </a>
            <a href={`/tools/${tool.slug}?status=ready`} className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] hover:border-[var(--accent)]">
              Ready
            </a>
          </div>
          {themes.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme) => (
                <ThemeCard key={theme.slug} theme={theme} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-[var(--border)] p-6 text-[var(--muted)]">
              No themes match these filters yet.
            </p>
          )}
        </>
      )}
    </main>
  );
}
