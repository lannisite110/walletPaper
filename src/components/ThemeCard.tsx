import Link from "next/link";
import type { Theme, Tool } from "@/lib/content/types";
import { ToolBadge } from "@/components/ToolBadge";

type ThemeCardProps = {
  theme: Theme;
  tool: Tool;
};

export function ThemeCard({ theme, tool }: ThemeCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 shadow-sm transition-colors hover:border-[var(--accent-dim)]">
      <div className="flex items-start justify-between gap-3">
        <ToolBadge tool={tool} />
        <span className="rounded-full border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--muted)]">
          {theme.status}
        </span>
      </div>
      <h2 className="mt-5 text-xl font-semibold text-[var(--text)]">{theme.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{theme.description}</p>
      <Link
        href={`/themes/${theme.slug}`}
        className="mt-5 inline-flex w-fit text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        View theme <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
