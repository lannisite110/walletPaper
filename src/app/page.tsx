import { getSiteConfig } from "@/config/site.config";

export default function Home() {
  const site = getSiteConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1
        className="text-3xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {site.siteName}
      </h1>
      <p className="text-[var(--muted)]">Developer theme catalog — scaffold stub</p>
    </main>
  );
}
