import { describe, expect, it } from "vitest";
import { collectServerDiagnostics } from "@/lib/diagnostics/collectServerDiagnostics";

describe("collectServerDiagnostics", () => {
  it("reports healthy content load for sample catalog", () => {
    const diagnostics = collectServerDiagnostics();
    expect(diagnostics.content.tools).toBe(6);
    expect(diagnostics.content.themesPublic).toBeGreaterThan(0);
    expect(diagnostics.checks.find((c) => c.id === "content-themes")?.ok).toBe(true);
    expect(diagnostics.ok).toBe(true);
  });
});
