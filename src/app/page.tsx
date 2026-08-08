import { getSiteConfig } from "@/config/site.config";

export default function Home() {
  const site = getSiteConfig();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-16 sm:px-6">
      <h1
        className="text-3xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {site.siteName}
      </h1>
      <p className="max-w-xl text-[var(--muted)]">
        Developer theme catalog — home stub until Task 6.
      </p>
    </main>
  );
}
