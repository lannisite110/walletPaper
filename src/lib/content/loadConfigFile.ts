import fs from "node:fs";
import path from "node:path";

export function readConfigFile(contentPath: string): string {
  const root = path.resolve(process.cwd());
  const abs = path.resolve(root, contentPath);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw new Error("Invalid config path");
  }
  return fs.readFileSync(abs, "utf8");
}
