import { describe, expect, it } from "vitest";
import { getAllTools, getToolBySlug } from "@/lib/content/loadTools";

describe("loadTools", () => {
  it("returns exactly six tools including placeholders", () => {
    const tools = getAllTools();
    expect(tools).toHaveLength(6);
    expect(getToolBySlug("chrome-devtools")?.capability).toBe("placeholder");
    expect(getToolBySlug("vscode")?.capability).toBe("full");
  });
});
