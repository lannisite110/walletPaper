import fs from "node:fs";
import path from "node:path";
import type { Tool } from "./types";

const TOOLS_DIR = path.join(process.cwd(), "content", "tools");

function readAllTools(): Tool[] {
  if (!fs.existsSync(TOOLS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(TOOLS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf8");
      return JSON.parse(raw) as Tool;
    });
}

export function getAllTools(): Tool[] {
  return readAllTools();
}

export function getToolBySlug(slug: string): Tool | undefined {
  return readAllTools().find((t) => t.slug === slug);
}
