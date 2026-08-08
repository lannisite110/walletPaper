# Dev Themes Site (P0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static Next.js catalog for developer tool themes with copy-config, download/placeholders, dual-track attribution, and six tool slots on GitHub repo `lannisite110/walletPaper`.

**Architecture:** Content-driven SSG — theme/tool JSON under `content/`, App Router pages under `src/app/`, shared loaders in `src/lib/content/`, presentational components in `src/components/`. No CMS, auth, or live APIs in P0.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Vitest · Vercel · matrix env via `.env.example` + `SITE_CONFIG.md`

**Repo:** https://github.com/lannisite110/walletPaper  
**Spec:** `docs/superpowers/specs/2026-08-08-dev-themes-site-design.md`

## Global Constraints

- Site ID prefix on content ids: use `site-wallet` until a numeric matrix id is assigned (e.g. `site-wallet-theme-001`).
- Shallow routes only: `/`, `/tools`, `/tools/[slug]`, `/themes/[slug]`, `/posts/[slug]`, `/about`.
- Dual track: `original` may host copy/download; `curated` must show attribution + `sourceUrl`; never fake installability.
- `apiSlot` is display-only in P0.
- Exclude `draft: true` from lists, detail public routes, and sitemap.
- Visual direction: ink/slate + single accent (teal), not purple-on-white, not cream/terracotta broadsheet.
- Commit message style: concise imperative (`feat:`, `docs:`, `test:`).
- Do not commit secrets; use `.env.example` only.

## File map (create in P0)

```text
SITE_CONFIG.md
.env.example
package.json
next.config.ts
tsconfig.json
vitest.config.ts
src/config/site.config.ts
src/lib/content/types.ts
src/lib/content/loadThemes.ts
src/lib/content/loadTools.ts
src/lib/content/loadConfigFile.ts
src/lib/content/loadPosts.ts
src/components/ThemeCard.tsx
src/components/ThemePreview.tsx
src/components/CopyConfigButton.tsx
src/components/DownloadButton.tsx
src/components/AttributionBlock.tsx
src/components/ApiSlotBanner.tsx
src/components/ToolBadge.tsx
src/components/SiteHeader.tsx
src/components/SiteFooter.tsx
src/app/layout.tsx
src/app/globals.css
src/app/page.tsx
src/app/tools/page.tsx
src/app/tools/[slug]/page.tsx
src/app/themes/[slug]/page.tsx
src/app/posts/[slug]/page.tsx
src/app/about/page.tsx
src/app/sitemap.ts
src/app/robots.ts
content/tools/*.json          # 6 tools
content/themes/*.json         # 3 sample themes
content/configs/*.json        # copyable configs
content/posts/*.mdx           # 1–2 install guides
public/og-default.svg
public/themes/...             # optional placeholder previews
public/downloads/.gitkeep
tests/content/loadThemes.test.ts
tests/content/loadTools.test.ts
```

---

### Task 1: Scaffold Next.js + matrix config

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.env.example`, `SITE_CONFIG.md`, `src/config/site.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (temporary stub), `.gitignore`
- Test: manual `npm run build` after scaffold

**Interfaces:**
- Consumes: none
- Produces: `getSiteConfig()` returning `{ siteId, siteName, siteUrl, gaTrackingId, analyticsSiteTag, primaryHubUrl }`

- [ ] **Step 1: Create Next.js app in repo root**

If the repo only has docs, scaffold in place (do not nest an extra folder):

```bash
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

If create-next-app refuses non-empty dir, manually add the same dependency set (`next`, `react`, `react-dom`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `eslint`, `eslint-config-next`) and wire `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Add `.env.example` and `SITE_CONFIG.md`**

`.env.example`:

```bash
NEXT_PUBLIC_SITE_ID="site-wallet"
NEXT_PUBLIC_SITE_NAME="Wallet Paper Themes"
NEXT_PUBLIC_SITE_URL="https://walletpaper.vercel.app"
NEXT_PUBLIC_GA_TRACKING_ID=""
NEXT_PUBLIC_ANALYTICS_SITE_TAG="dev-themes"
NEXT_PUBLIC_PRIMARY_HUB_URL="https://www.your-main-hub.com"
```

`SITE_CONFIG.md`: copy from `Matrix_Website_Base_Standard.md` and fill the same values (note actual GitHub repo is `walletPaper`, not the matrix naming example).

- [ ] **Step 3: Add `src/config/site.config.ts`**

```ts
export type SiteConfig = {
  siteId: string;
  siteName: string;
  siteUrl: string;
  gaTrackingId: string;
  analyticsSiteTag: string;
  primaryHubUrl: string;
};

export function getSiteConfig(): SiteConfig {
  return {
    siteId: process.env.NEXT_PUBLIC_SITE_ID ?? "site-wallet",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Wallet Paper Themes",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "",
    analyticsSiteTag: process.env.NEXT_PUBLIC_ANALYTICS_SITE_TAG ?? "dev-themes",
    primaryHubUrl: process.env.NEXT_PUBLIC_PRIMARY_HUB_URL ?? "",
  };
}
```

- [ ] **Step 4: Set CSS variables in `src/app/globals.css`**

Use ink background, paper text, teal accent (not purple):

```css
@import "tailwindcss";

:root {
  --bg: #0b1220;
  --bg-elevated: #121a2b;
  --text: #e8eef8;
  --muted: #9aa8c0;
  --accent: #2dd4bf;
  --accent-dim: #0f766e;
  --border: #243049;
  --danger: #f87171;
  --font-display: "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
  --font-body: "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
}

body {
  background: radial-gradient(1200px 600px at 10% -10%, #16324a 0%, transparent 55%),
    radial-gradient(900px 500px at 90% 0%, #1a2a1f 0%, transparent 50%), var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
}
```

- [ ] **Step 5: Verify stub build**

Run: `npm run build`  
Expected: success (default page OK)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs .gitignore .env.example SITE_CONFIG.md src/config/site.config.ts src/app
git commit -m "feat: scaffold Next.js app and matrix site config"
```

---

### Task 2: Content types + Vitest loaders

**Files:**
- Create: `src/lib/content/types.ts`, `src/lib/content/loadThemes.ts`, `src/lib/content/loadTools.ts`, `src/lib/content/loadConfigFile.ts`, `vitest.config.ts`, `tests/content/loadThemes.test.ts`, `tests/content/loadTools.test.ts`
- Modify: `package.json` (add `vitest`, ensure test script)

**Interfaces:**
- Consumes: filesystem under `content/`
- Produces:
  - `getAllThemes(): Theme[]` — non-draft only, sorted by `pubDate` desc
  - `getThemeBySlug(slug: string): Theme | undefined`
  - `getThemesByTool(tool: string): Theme[]`
  - `getFeaturedThemes(): Theme[]`
  - `getAllTools(): Tool[]`
  - `getToolBySlug(slug: string): Tool | undefined`
  - `readConfigFile(contentPath: string): string` — reads UTF-8 relative to repo root; throws if missing
  - Types: `Theme`, `Tool`, `ApiSlot`, `Deliverables` matching the spec JSON

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Write failing tests**

`tests/content/loadThemes.test.ts`:

```ts
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
```

`tests/content/loadTools.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `npm test`  
Expected: FAIL (modules or content missing)

- [ ] **Step 4: Add types**

`src/lib/content/types.ts` — define `Theme`, `Tool`, `CopyConfigDeliverable`, `DownloadDeliverable`, `Attribution`, `ApiSlot` exactly as in the design spec field names (`status`, `sourceType`, `deliverables`, `apiSlot`, etc.).

- [ ] **Step 5: Implement loaders**

Use `fs.readdirSync` + `JSON.parse` from `content/themes` and `content/tools`. Filter `draft !== true`. Sort themes by `pubDate` descending.

`readConfigFile`:

```ts
import fs from "node:fs";
import path from "node:path";

export function readConfigFile(contentPath: string): string {
  const abs = path.join(process.cwd(), contentPath);
  if (!abs.startsWith(process.cwd())) {
    throw new Error("Invalid config path");
  }
  return fs.readFileSync(abs, "utf8");
}
```

- [ ] **Step 6: Add minimal fixture content so tests can pass**

Create the JSON files listed in Task 3 **before** re-running tests (or combine Task 2 Step 6 with Task 3). Minimum required for tests:

- `content/themes/midnight-cobalt-vscode.json` (`draft: false`, `featured: true`, `tool: "vscode"`)
- `content/themes/draft-hidden-theme.json` (`draft: true`)
- six `content/tools/*.json`

- [ ] **Step 7: Run tests — expect PASS**

Run: `npm test`  
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/content tests vitest.config.ts package.json package-lock.json content
git commit -m "feat: add theme/tool content loaders and tests"
```

---

### Task 3: Sample content (6 tools, 3 themes, configs, 1 post)

**Files:**
- Create: `content/tools/{vscode,cursor,jetbrains,chrome-devtools,github-desktop,sourcetree}.json`
- Create: `content/themes/midnight-cobalt-vscode.json`, `content/themes/cursor-ember-glow.json`, `content/themes/jetbrains-slate-reserve.json` (placeholder+apiSlot), `content/themes/draft-hidden-theme.json`
- Create: `content/configs/midnight-cobalt.json`, `content/configs/cursor-ember-glow.json`
- Create: `content/posts/install-vscode-theme.mdx`
- Create: `public/downloads/.gitkeep`, `public/og-default.svg`

**Interfaces:**
- Consumes: loader contracts from Task 2
- Produces: browsable sample catalog data

- [ ] **Step 1: Write six tool JSON files**

Example `content/tools/vscode.json`:

```json
{
  "id": "site-wallet-tool-vscode",
  "slug": "vscode",
  "name": "VS Code",
  "description": "Editor themes as JSON / VSIX.",
  "icon": "/tools/vscode.svg",
  "capability": "full",
  "installPostSlug": "install-vscode-theme",
  "supportedDeliverables": ["copyConfig", "download"]
}
```

Placeholder tools (`chrome-devtools`, `github-desktop`, `sourcetree`): `"capability": "placeholder"`, `supportedDeliverables: []`.

- [ ] **Step 2: Write three public themes + one draft**

1. `midnight-cobalt-vscode` — `original`, `ready`, copy+download enabled, `featured: true`
2. `cursor-ember-glow` — `original`, `ready`, copy only (`download.enabled: false`)
3. `jetbrains-slate-reserve` — `curated`, `placeholder`, both deliverables false, with `attribution.sourceUrl` and `apiSlot` for jetbrains
4. `draft-hidden-theme` — `draft: true`

For download: set `filePath` to `/downloads/midnight-cobalt.zip` but do **not** add the file yet — UI must disable when missing (Task 5).

Minimal copy config `content/configs/midnight-cobalt.json`:

```json
{
  "name": "Midnight Cobalt",
  "type": "dark",
  "colors": {
    "editor.background": "#0b1220",
    "editor.foreground": "#e8eef8"
  }
}
```

- [ ] **Step 3: Add one MDX post**

`content/posts/install-vscode-theme.mdx`:

```mdx
---
id: "site-wallet-post-01"
title: "Install a VS Code theme from Wallet Paper"
description: "Copy JSON or install a pack in under a minute."
slug: "install-vscode-theme"
pubDate: "2026-08-08"
updatedDate: "2026-08-08"
category: "dev-themes"
tags: ["vscode", "install"]
author: "MatrixBot"
draft: false
---

## Steps

1. Open the theme page and copy the JSON, or download the pack.
2. In VS Code, use Preferences: Color Theme or install from VSIX.
3. Reload the window if needed.
```

- [ ] **Step 4: Re-run tests**

Run: `npm test`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add content public
git commit -m "content: add sample tools, themes, configs, and install post"
```

---

### Task 4: Shell layout + navigation

**Files:**
- Create: `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx` (still minimal until Task 6)

**Interfaces:**
- Consumes: `getSiteConfig()`
- Produces: shared chrome with links to `/`, `/tools`, `/about`

- [ ] **Step 1: Implement header/footer**

Header: site name (brand-forward), nav Tools / About.  
Footer: short dual-track note + link to primary hub env if set.

- [ ] **Step 2: Wire `layout.tsx` metadata**

```ts
import type { Metadata } from "next";
import { getSiteConfig } from "@/config/site.config";

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.siteName,
    template: `%s | ${site.siteName}`,
  },
  description: "Developer themes for VS Code, Cursor, JetBrains, and reserved tool slots.",
};
```

- [ ] **Step 3: Run `npm run build`**

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/app/layout.tsx
git commit -m "feat: add site shell header and footer"
```

---

### Task 5: Theme UI components

**Files:**
- Create: `src/components/ThemeCard.tsx`, `ThemePreview.tsx`, `CopyConfigButton.tsx`, `DownloadButton.tsx`, `AttributionBlock.tsx`, `ApiSlotBanner.tsx`, `ToolBadge.tsx`
- Create: `tests/content/readConfigFile.test.ts` (optional but preferred)

**Interfaces:**
- Consumes: `Theme`, `Tool`, `readConfigFile`
- Produces: presentational + client buttons for copy/download

- [ ] **Step 1: `ThemePreview`**

If `previewImage` missing/empty, render a block with tool-tinted background and text `Preview pending`. Do not use a broken `<img>`.

- [ ] **Step 2: `CopyConfigButton` (client component)**

Props: `{ contentPath: string; label: string }`.  
On click: fetch config via a small server action or embed config text from the server parent as `initialText` prop (prefer **pass `configText` from server page** to avoid client fs). Copy with `navigator.clipboard.writeText`; on failure set `showFallback` and render `<pre>`.

Recommended props:

```ts
type Props = { label: string; configText: string };
```

- [ ] **Step 3: `DownloadButton`**

Props: `{ enabled: boolean; href?: string; label: string; missingReason?: string }`.  
If `!enabled` or missing file: render disabled control + reason.  
File existence: check in the **server page** with `fs.existsSync(path.join(process.cwd(), "public", ...))` and pass `fileAvailable: boolean`.

- [ ] **Step 4: `AttributionBlock` / `ApiSlotBanner` / `ToolBadge` / `ThemeCard`**

- Curated: always show `sourceUrl` as external link (`rel="noopener noreferrer"`).
- `ApiSlotBanner`: render only when `apiSlot` non-null; title `API slot: {owner}`; show `purpose`, `status`, `note`.
- `ThemeCard`: link to `/themes/[slug]`; show tool badge + status chip.

- [ ] **Step 5: Manual smoke**

Run: `npm run dev` and open a temporary story page or wait for Task 6. Optionally add a unit test that `readConfigFile("content/configs/midnight-cobalt.json")` contains `"Midnight Cobalt"`.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "feat: add theme card, preview, copy, download, attribution components"
```

---

### Task 6: Pages — home, tools, theme detail, about, posts

**Files:**
- Modify/Create: `src/app/page.tsx`, `src/app/tools/page.tsx`, `src/app/tools/[slug]/page.tsx`, `src/app/themes/[slug]/page.tsx`, `src/app/about/page.tsx`, `src/app/posts/[slug]/page.tsx`
- Create: `src/lib/content/loadPosts.ts` (parse MDX frontmatter; for P0, simple gray-matter or hand-rolled YAML frontmatter parse)

**Interfaces:**
- Consumes: all loaders + components
- Produces: routable SSG pages; `generateStaticParams` for tools/themes/posts

- [ ] **Step 1: Home page**

Composition: brand hero (site name dominant), one headline, one sentence, CTA group (`/tools`, `#featured`), one dominant visual (CSS gradient plane or `public/og-default.svg` full-bleed feel — not inset card). Below fold: tool strip + featured grid.

- [ ] **Step 2: `/tools` and `/tools/[slug]`**

- List all six tools with capability badges.
- Tool detail: description, empty state for placeholder tools (`Slot reserved, content coming`), theme grid for others.
- Filters: client query toggles for `sourceType` / `status` (simple buttons reading searchParams is fine).

- [ ] **Step 3: `/themes/[slug]`**

Sections in order: preview → acquire → attribution → apiSlot → related (max 4).  
Metadata title: `${theme.title} — ${toolName} theme`.

```ts
export function generateStaticParams() {
  return getAllThemes().map((t) => ({ slug: t.slug }));
}
```

Draft themes must not appear in `generateStaticParams`.

- [ ] **Step 4: `/about`**

Explain original vs curated policy in short copy.

- [ ] **Step 5: `/posts/[slug]`**

Load MDX: for P0 acceptable approaches — (a) `@next/mdx` or (b) store posts as `.md` and render markdown with a small lib. Prefer `content/posts/*.mdx` + `next-mdx-remote/rsc` if lightweight; otherwise convert sample to `.md` + `gray-matter` + `react-markdown`.

- [ ] **Step 6: Build**

Run: `npm run build`  
Expected: static paths for 3 public themes + 6 tools + posts; no draft theme path.

- [ ] **Step 7: Commit**

```bash
git add src/app src/lib/content/loadPosts.ts
git commit -m "feat: add home, tools, theme detail, about, and posts pages"
```

---

### Task 7: SEO — sitemap + robots + analytics stub

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/Analytics.tsx`
- Modify: `src/app/layout.tsx` (include Analytics)

**Interfaces:**
- Consumes: `getAllThemes`, `getAllTools`, `getSiteConfig`
- Produces: `/sitemap.xml`, `/robots.txt`, optional gtag when `gaTrackingId` set

- [ ] **Step 1: `sitemap.ts`**

Include `/`, `/tools`, `/about`, each tool, each non-draft theme, each non-draft post. Exclude drafts.

- [ ] **Step 2: `robots.ts`**

Allow `/`; sitemap URL = `${siteUrl}/sitemap.xml`.

- [ ] **Step 3: Analytics stub**

If `gaTrackingId` empty, render nothing. If set, inject gtag with `site_id` dimension per matrix standard.

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add src/app/sitemap.ts src/app/robots.ts src/components/Analytics.tsx src/app/layout.tsx
git commit -m "feat: add sitemap, robots, and analytics stub"
```

---

### Task 8: Verification + push

**Files:** none new (fix only)

- [ ] **Step 1: Run full checks**

```bash
npm test
npm run lint
npm run build
npm run dev
```

Manual checklist:

- [ ] Home shows brand + 6 tool entries
- [ ] `/themes/midnight-cobalt-vscode` copy works; download disabled or enabled per file presence
- [ ] `/themes/jetbrains-slate-reserve` shows attribution + ApiSlotBanner, no fake download
- [ ] `/themes/draft-hidden-theme` is 404
- [ ] Placeholder tool page empty state visible
- [ ] `/sitemap.xml` lists public themes only

- [ ] **Step 2: Commit any fixes**

```bash
git commit -m "fix: address P0 verification findings"
```

(Only if needed.)

- [ ] **Step 3: Push**

```bash
git push -u origin HEAD
```

Remote: `https://github.com/lannisite110/walletPaper`

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Routes `/`, `/tools`, `/tools/[slug]`, `/themes/[slug]`, `/posts`, `/about` | 6 |
| Theme/tool JSON model + placeholders + apiSlot | 2–3 |
| Copy + download hybrid | 5–6 |
| Original + curated attribution | 5–6 |
| Matrix env / SITE_CONFIG | 1 |
| SEO sitemap/robots | 7 |
| P0 sample content, no social skins | 3 |
| Exclude drafts | 2, 6, 7 |
| Tests for loaders / sitemap exclusions | 2, 7–8 |

No intentional TBD placeholders remain for P0. P1 AI image batch and real VSIX fleets are explicitly out of this plan.
