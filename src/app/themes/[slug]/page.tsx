import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { ApiSlotBanner } from "@/components/ApiSlotBanner";
import { AttributionBlock } from "@/components/AttributionBlock";
import { CopyConfigButton } from "@/components/CopyConfigButton";
import { DownloadButton } from "@/components/DownloadButton";
import { ThemeCard } from "@/components/ThemeCard";
import { ThemePreview } from "@/components/ThemePreview";
import { ToolBadge } from "@/components/ToolBadge";
import { readConfigFile } from "@/lib/content/loadConfigFile";
import { getAllThemes, getThemeBySlug } from "@/lib/content/loadThemes";
import { getToolBySlug } from "@/lib/content/loadTools";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllThemes().map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  const tool = theme ? getToolBySlug(theme.tool) : undefined;

  if (!theme || theme.draft || !tool) {
    return {};
  }

  return {
    title: `${theme.title} — ${tool.name} theme`,
    description: theme.description,
  };
}

function downloadExists(filePath: string | undefined): boolean {
  if (!filePath?.startsWith("/")) {
    return false;
  }

  const publicDirectory = path.resolve(process.cwd(), "public");
  const candidate = path.resolve(publicDirectory, `.${filePath}`);
  return candidate.startsWith(`${publicDirectory}${path.sep}`) && fs.existsSync(candidate);
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme || theme.draft) {
    notFound();
  }

  const tool = getToolBySlug(theme.tool);
  if (!tool) {
    notFound();
  }

  const copy = theme.deliverables.copyConfig;
  const download = theme.deliverables.download;
  const configText = copy.enabled && copy.contentPath ? readConfigFile(copy.contentPath) : undefined;
  const fileAvailable = downloadExists(download.filePath);
  const related = getAllThemes()
    .filter(
      (candidate) =>
        candidate.slug !== theme.slug &&
        (candidate.tool === theme.tool ||
          candidate.tags.some((tag) => theme.tags.includes(tag))),
    )
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ToolBadge tool={tool} />
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{theme.title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">{theme.description}</p>

      <section className="mt-10" aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="mb-4 text-xl font-semibold">Preview</h2>
        <ThemePreview previewImage={theme.previewImage} title={theme.title} />
      </section>

      <section className="mt-10" aria-labelledby="acquire-heading">
        <h2 id="acquire-heading" className="mb-4 text-xl font-semibold">Acquire</h2>
        {copy.enabled || download.enabled ? (
          <div className="flex flex-wrap items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            {copy.enabled && configText ? (
              <CopyConfigButton label={copy.label ?? "Copy configuration"} configText={configText} />
            ) : null}
            {download.enabled ? (
              <DownloadButton
                enabled={download.enabled}
                href={download.filePath}
                label={download.label ?? "Download theme pack"}
                fileAvailable={fileAvailable}
                missingReason="The theme pack is not available yet."
              />
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-[var(--muted)]">
            {theme.sourceType === "curated"
              ? "This is a curated reference. Use the attributed source for installation."
              : "This original theme is pending an installable deliverable from its owner."}
          </div>
        )}
      </section>

      <section className="mt-10">
        <AttributionBlock attribution={theme.attribution} />
      </section>

      {theme.apiSlot ? (
        <section className="mt-10">
          <ApiSlotBanner apiSlot={theme.apiSlot} />
        </section>
      ) : null}

      {related.length ? (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-semibold">Related themes</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {related.map((relatedTheme) => {
              const relatedTool = getToolBySlug(relatedTheme.tool);
              return relatedTool ? (
                <ThemeCard key={relatedTheme.slug} theme={relatedTheme} tool={relatedTool} />
              ) : null;
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
