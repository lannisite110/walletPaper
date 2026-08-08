import fs from "node:fs";
import path from "node:path";
import { getSiteConfig } from "@/config/site.config";
import { getAllPosts } from "@/lib/content/loadPosts";
import { getAllThemes } from "@/lib/content/loadThemes";
import { getAllTools } from "@/lib/content/loadTools";

export type DiagnosticCheck = {
  id: string;
  ok: boolean;
  detail: string;
};

export type ServerDiagnostics = {
  generatedAt: string;
  ok: boolean;
  runtime: {
    node: string;
    cwd: string;
    vercel: boolean;
    vercelEnv: string | null;
    region: string | null;
  };
  config: {
    siteId: string;
    siteName: string;
    siteUrl: string;
    analyticsSiteTag: string;
    hasGaTrackingId: boolean;
    hasPrimaryHubUrl: boolean;
  };
  content: {
    tools: number;
    themesPublic: number;
    postsPublic: number;
    themeSlugs: string[];
    toolSlugs: string[];
  };
  checks: DiagnosticCheck[];
};

function checkPath(relativePath: string, id: string, label: string): DiagnosticCheck {
  const abs = path.join(process.cwd(), relativePath);
  const ok = fs.existsSync(abs);
  return {
    id,
    ok,
    detail: ok ? `${label} present (${relativePath})` : `${label} missing (${relativePath})`,
  };
}

export function collectServerDiagnostics(): ServerDiagnostics {
  const site = getSiteConfig();
  const tools = getAllTools();
  const themes = getAllThemes();
  const posts = getAllPosts();

  let siteUrlOk = true;
  try {
    const parsed = new URL(site.siteUrl);
    siteUrlOk = Boolean(parsed.protocol && parsed.host);
  } catch {
    siteUrlOk = false;
  }

  const checks: DiagnosticCheck[] = [
    {
      id: "site-url",
      ok: siteUrlOk,
      detail: siteUrlOk
        ? `siteUrl parseable: ${site.siteUrl}`
        : `siteUrl invalid: ${site.siteUrl}`,
    },
    checkPath("content/themes", "content-themes", "Themes content dir"),
    checkPath("content/tools", "content-tools", "Tools content dir"),
    checkPath("content/posts", "content-posts", "Posts content dir"),
    checkPath("content/configs", "content-configs", "Configs content dir"),
    checkPath("public/og-default.svg", "og-default", "Default OG image"),
    {
      id: "tools-count",
      ok: tools.length === 6,
      detail: `tools loaded: ${tools.length} (expected 6)`,
    },
    {
      id: "themes-count",
      ok: themes.length >= 1,
      detail: `public themes loaded: ${themes.length}`,
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    ok: checks.every((c) => c.ok),
    runtime: {
      node: process.version,
      cwd: process.cwd(),
      vercel: Boolean(process.env.VERCEL),
      vercelEnv: process.env.VERCEL_ENV ?? null,
      region: process.env.VERCEL_REGION ?? null,
    },
    config: {
      siteId: site.siteId,
      siteName: site.siteName,
      siteUrl: site.siteUrl,
      analyticsSiteTag: site.analyticsSiteTag,
      hasGaTrackingId: Boolean(site.gaTrackingId),
      hasPrimaryHubUrl: Boolean(site.primaryHubUrl),
    },
    content: {
      tools: tools.length,
      themesPublic: themes.length,
      postsPublic: posts.length,
      themeSlugs: themes.map((t) => t.slug),
      toolSlugs: tools.map((t) => t.slug),
    },
    checks,
  };
}
