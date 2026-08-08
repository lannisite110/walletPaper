export const metadata = {
  title: "About",
  description: "How Wallet Paper publishes original and curated developer themes.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
        About Wallet Paper
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">A calmer catalog for coding surfaces.</h1>
      <div className="mt-8 space-y-6 leading-7 text-[var(--muted)]">
        <p>
          Wallet Paper collects developer themes for the tools that shape your daily work. The
          catalog is small on purpose: each entry should make its availability and ownership clear.
        </p>
        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text)]">Original themes</h2>
          <p className="mt-2">
            Original entries may include a copyable configuration or a hosted download when that
            asset is genuinely available.
          </p>
        </section>
        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text)]">Curated references</h2>
          <p className="mt-2">
            Curated entries keep the upstream author, license, and source visible. They do not
            imply that Wallet Paper can install, host, or synchronize an upstream theme.
          </p>
        </section>
      </div>
    </main>
  );
}
