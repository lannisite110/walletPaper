import { describe, expect, it } from "vitest";
import { readConfigFile } from "@/lib/content/loadConfigFile";

describe("readConfigFile", () => {
  it("reads the Midnight Cobalt config", () => {
    expect(readConfigFile("content/configs/midnight-cobalt.json")).toContain(
      '"Midnight Cobalt"',
    );
  });

  it("rejects paths outside the repository", () => {
    expect(() => readConfigFile("../package.json")).toThrow("Invalid config path");
  });
});
