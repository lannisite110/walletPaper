import type { ApiSlot } from "@/lib/content/types";

type ApiSlotBannerProps = {
  apiSlot: ApiSlot | null;
};

export function ApiSlotBanner({ apiSlot }: ApiSlotBannerProps) {
  if (!apiSlot) {
    return null;
  }

  return (
    <aside className="rounded-xl border border-[var(--accent-dim)] bg-[var(--bg-elevated)] p-5">
      <h2 className="text-lg font-semibold text-[var(--text)]">
        API slot: {apiSlot.owner}
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Purpose</dt>
          <dd>{apiSlot.purpose}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Status</dt>
          <dd className="text-[var(--accent)]">{apiSlot.status}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Note</dt>
          <dd>{apiSlot.note}</dd>
        </div>
      </dl>
    </aside>
  );
}
