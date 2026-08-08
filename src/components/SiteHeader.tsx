import Link from "next/link";
import { getSiteConfig } from "@/config/site.config";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const site = getSiteConfig();

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur-sm"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          {site.siteName}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--accent)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
