import type { Attribution } from "@/lib/content/types";

type AttributionBlockProps = {
  attribution: Attribution;
};

export function AttributionBlock({ attribution }: AttributionBlockProps) {
  return (
    <section
      aria-labelledby="attribution-heading"
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5"
    >
      <h2 id="attribution-heading" className="text-lg font-semibold text-[var(--text)]">
        Attribution
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-[var(--muted)]">Author:</dt>
          <dd>{attribution.author}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--muted)]">License:</dt>
          <dd>{attribution.license}</dd>
        </div>
        {attribution.sourceUrl ? (
          <div className="flex gap-2">
            <dt className="text-[var(--muted)]">Source:</dt>
            <dd>
              <a
                href={attribution.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                View original source
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      {attribution.notes ? (
        <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
          {attribution.notes}
        </p>
      ) : null}
    </section>
  );
}
