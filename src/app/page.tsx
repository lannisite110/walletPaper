import Link from "next/link";
import { ThemeCard } from "@/components/ThemeCard";
import { ToolBadge } from "@/components/ToolBadge";
import { getSiteConfig } from "@/config/site.config";
import { getFeaturedThemes } from "@/lib/content/loadThemes";
import { getAllTools, getToolBySlug } from "@/lib/content/loadTools";

export default function Home() {
  const site = getSiteConfig();
  const tools = getAllTools();
  const featuredThemes = getFeaturedThemes();

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(circle at 75% 30%, rgba(45,212,191,.38), transparent 0 25%), linear-gradient(135deg, #0b1220 10%, #153149 55%, #0f766e 140%)",
          }}
        />
        <div className="mx-auto flex min-h-[min(720px,calc(100vh-64px))] max-w-6xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--accent)] uppercase">
              Developer themes
            </p>
            <h1
              className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-[var(--text)] sm:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {site.siteName}
            </h1>
            <p className="mt-7 text-2xl font-medium tracking-tight sm:text-3xl">
              Make your coding surface feel intentional.
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Copy original configs, discover carefully attributed themes, and find the right
              palette for the tools where you work.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
              >
                Browse tools
              </Link>
              <Link
                href="#featured"
                className="rounded-md border border-[var(--border)] bg-[var(--bg)]/40 px-5 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)]"
              >
                Explore featured themes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold">Choose your tool</h2>
          <Link href="/tools" className="text-sm font-semibold text-[var(--accent)] hover:underline">
            View all tools →
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 hover:border-[var(--accent-dim)]"
            >
              <ToolBadge tool={tool} />
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          Featured collection
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Themes ready to shape your flow</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredThemes.map((theme) => {
            const tool = getToolBySlug(theme.tool);
            return tool ? <ThemeCard key={theme.slug} theme={theme} tool={tool} /> : null;
          })}
        </div>
      </section>
    </main>
  );
}
