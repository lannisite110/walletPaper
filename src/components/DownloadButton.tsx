type DownloadButtonProps = {
  enabled: boolean;
  href?: string;
  label: string;
  missingReason?: string;
  fileAvailable?: boolean;
};

export function DownloadButton({
  enabled,
  href,
  label,
  missingReason,
  fileAvailable = true,
}: DownloadButtonProps) {
  const unavailable = !enabled || !fileAvailable || !href;

  if (unavailable) {
    return (
      <div className="space-y-1">
        <span
          aria-disabled="true"
          className="inline-flex cursor-not-allowed rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)]"
        >
          {label}
        </span>
        <p className="text-sm text-[var(--muted)]">
          {missingReason ?? "Download is not available yet."}
        </p>
      </div>
    );
  }

  return (
    <a
      href={href}
      download
      className="inline-flex rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
    >
      {label}
    </a>
  );
}
