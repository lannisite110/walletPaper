import fs from "node:fs";
import path from "node:path";

type ThemePreviewProps = {
  previewImage?: string | null;
  title: string;
};

function hasLocalPreview(previewImage: string) {
  if (!previewImage.startsWith("/")) {
    return previewImage.startsWith("https://") || previewImage.startsWith("http://");
  }

  const publicDirectory = path.resolve(process.cwd(), "public");
  const imagePath = path.resolve(publicDirectory, `.${previewImage}`);

  return imagePath.startsWith(`${publicDirectory}${path.sep}`) && fs.existsSync(imagePath);
}

export function ThemePreview({ previewImage, title }: ThemePreviewProps) {
  if (!previewImage || !hasLocalPreview(previewImage)) {
    return (
      <div
        className="flex aspect-video items-center justify-center rounded-xl border border-[var(--accent-dim)] bg-[linear-gradient(135deg,#16324a,#0f766e)] p-6 text-center text-sm font-medium text-[var(--text)]"
        role="img"
        aria-label={`${title} preview pending`}
      >
        Preview pending
      </div>
    );
  }

  return (
    <img
      src={previewImage}
      alt={`${title} theme preview`}
      className="aspect-video w-full rounded-xl border border-[var(--border)] object-cover"
    />
  );
}
