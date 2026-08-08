import { getSiteConfig } from "@/config/site.config";

export function SiteFooter() {
  const site = getSiteConfig();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          <span className="font-medium text-[var(--text)]">Dual-track catalog.</span>{" "}
          Original themes ship with copy or download; curated entries reserve slots for
          third-party or API-sourced themes until they are ready.
        </p>
        {site.primaryHubUrl ? (
          <p className="mt-4">
            <a
              href={site.primaryHubUrl}
              className="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--text)]"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit primary hub →
            </a>
          </p>
        ) : null}
        <p className="mt-6 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {site.siteName}
        </p>
      </div>
    </footer>
  );
}
