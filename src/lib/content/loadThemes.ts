import fs from "node:fs";
import path from "node:path";
import type { Theme } from "./types";

const THEMES_DIR = path.join(process.cwd(), "content", "themes");

function readAllThemes(): Theme[] {
  if (!fs.existsSync(THEMES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(THEMES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(THEMES_DIR, file), "utf8");
      return JSON.parse(raw) as Theme;
    });
}

function sortByPubDateDesc(themes: Theme[]): Theme[] {
  return [...themes].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}

export function getAllThemes(): Theme[] {
  return sortByPubDateDesc(readAllThemes().filter((t) => t.draft !== true));
}

export function getThemeBySlug(slug: string): Theme | undefined {
  return readAllThemes().find((t) => t.slug === slug);
}

export function getThemesByTool(tool: string): Theme[] {
  return getAllThemes().filter((t) => t.tool === tool);
}

export function getFeaturedThemes(): Theme[] {
  return getAllThemes().filter((t) => t.featured === true);
}
