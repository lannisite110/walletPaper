import { describe, expect, it } from "vitest";
import {
  getAllThemes,
  getFeaturedThemes,
  getThemeBySlug,
  getThemesByTool,
} from "@/lib/content/loadThemes";

describe("loadThemes", () => {
  it("excludes draft themes from getAllThemes", () => {
    const themes = getAllThemes();
    expect(themes.every((t) => t.draft === false)).toBe(true);
    expect(themes.find((t) => t.slug === "draft-hidden-theme")).toBeUndefined();
  });

  it("filters by tool slug", () => {
    const vscode = getThemesByTool("vscode");
    expect(vscode.length).toBeGreaterThan(0);
    expect(vscode.every((t) => t.tool === "vscode")).toBe(true);
  });

  it("returns featured themes only", () => {
    const featured = getFeaturedThemes();
    expect(featured.every((t) => t.featured && !t.draft)).toBe(true);
  });

  it("loads theme by slug", () => {
    const theme = getThemeBySlug("midnight-cobalt-vscode");
    expect(theme?.title).toBe("Midnight Cobalt");
  });
});
