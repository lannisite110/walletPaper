import type { Tool } from "@/lib/content/types";

type ToolBadgeProps = {
  tool: Pick<Tool, "name" | "capability">;
};

export function ToolBadge({ tool }: ToolBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--text)]">
      <span>{tool.name}</span>
      <span className="text-[var(--muted)]">·</span>
      <span className="text-[var(--accent)]">{tool.capability}</span>
    </span>
  );
}
