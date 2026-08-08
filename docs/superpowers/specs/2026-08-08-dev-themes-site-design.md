# Dev Themes Site — Design Spec

> **Date:** 2026-08-08  
> **Status:** Approved for implementation planning  
> **Product type:** Developer theme tools catalog (traffic-racing matrix site)  
> **Architecture choice:** Static content-driven Next.js site (Approach 1)

---

## 1. Goal

Build a free, SEO-friendly catalog of developer tool themes (VS Code, Cursor, JetBrains, plus reserved slots for Chrome DevTools and Git clients). Users can **copy config** and/or **download theme packs**. Missing assets and API-backed tools use explicit placeholders with clear ownership. Site follows the matrix build standard for later hub merge.

**Out of scope (P0):** user accounts, payments, UGC submission backend, live theme APIs, social-app skins (WeChat/QQ/Facebook/X).

---

## 2. Decisions (locked)

| Topic | Choice |
|-------|--------|
| Product form | Developer theme tools site |
| Deliverables | Hybrid: copy config (A) + download packs (B) |
| MVP tools | Full: `vscode`, `cursor`, `jetbrains`. Placeholder: `chrome-devtools`, `github-desktop`, `sourcetree` |
| Content model | Dual track: `original` (host assets) + `curated` (preview + attribution + outbound link) |
| Business goal | Traffic racing (free, SEO, matrix PV validation) |
| Tech approach | Static JSON/MDX content + Next.js SSG on Vercel |

---

## 3. Information architecture & routing

| Route | Purpose |
|-------|---------|
| `/` | Home: brand, positioning, CTAs, featured themes, tool entry |
| `/tools` | All tools (ready + placeholder) |
| `/tools/[slug]` | Themes for one tool |
| `/themes/[slug]` | Theme detail: preview, copy, download/placeholder, attribution, API slot |
| `/posts/[slug]` | Install guides / SEO articles (2–3 in early content) |
| `/about` | Site purpose + original vs curated policy |

### Tool slugs (P0)

- Deliverable: `vscode`, `cursor`, `jetbrains`
- Placeholder: `chrome-devtools`, `github-desktop`, `sourcetree`

### Merge strategy

- Independent: `site-xxx.vercel.app/themes/[slug]`
- Merged: `main-hub.com/<category>/themes/[slug]` (prefix only; slug unchanged)
- Theme `id` prefixed with `site_id` to avoid matrix ID collisions

### Home first viewport

Brand name, one headline, one short supporting line, one CTA group, one dominant visual. No stats strip, no dashboard clutter.

---

## 4. Data model

### Theme record (`content/themes/*.json`)

```json
{
  "id": "site-0XX-theme-001",
  "slug": "midnight-cobalt-vscode",
  "title": "Midnight Cobalt",
  "description": "Cool dark theme for long coding sessions.",
  "tool": "vscode",
  "status": "ready",
  "sourceType": "original",
  "tags": ["dark", "blue", "minimal"],
  "previewImage": "/themes/midnight-cobalt/preview.webp",
  "gallery": ["/themes/midnight-cobalt/editor.webp"],
  "deliverables": {
    "copyConfig": {
      "enabled": true,
      "format": "json",
      "label": "VS Code theme JSON",
      "contentPath": "content/configs/midnight-cobalt.json"
    },
    "download": {
      "enabled": true,
      "label": "Theme pack (.vsix / zip)",
      "filePath": "/downloads/midnight-cobalt.vsix",
      "fileSize": "24KB"
    }
  },
  "attribution": {
    "author": "MatrixBot",
    "license": "MIT",
    "sourceUrl": null,
    "notes": null
  },
  "apiSlot": null,
  "pubDate": "2026-08-08",
  "updatedDate": "2026-08-08",
  "draft": false,
  "featured": true
}
```

### Enums

| Field | Values | Meaning |
|-------|--------|---------|
| `status` | `ready` \| `placeholder` \| `coming-soon` | Installability; placeholders still indexable |
| `sourceType` | `original` \| `curated` | Hosted deliverables vs outbound + attribution |
| `tool` | six slugs above | Parent tool |
| `apiSlot` | `null` or object | Reserved image+API capability; P0 display-only |

### Placeholder / curated example

```json
{
  "status": "placeholder",
  "sourceType": "curated",
  "deliverables": {
    "copyConfig": { "enabled": false },
    "download": { "enabled": false }
  },
  "attribution": {
    "author": "Upstream author",
    "license": "MIT",
    "sourceUrl": "https://marketplace.visualstudio.com/...",
    "notes": "Preview and taxonomy only; install at source."
  },
  "apiSlot": {
    "owner": "chrome-devtools",
    "purpose": "future-theme-preview-api",
    "status": "reserved",
    "note": "Reserved: DevTools theme preview/sync API, not wired yet."
  }
}
```

### Tool metadata (`content/tools/*.json`)

Name, icon, short blurb, install overview link, `capability` (`full` | `placeholder`), supported deliverable types.

### Content layout

```text
content/
  themes/          # theme metadata JSON
  tools/           # tool metadata JSON
  configs/         # copyable config source files
  posts/           # MDX install guides
public/
  themes/          # preview images (AI batch later)
  downloads/       # .vsix / zip (missing → download disabled + UI placeholder)
src/
  config/          # site.config
  components/      # ThemeCard, ThemePreview, CopyConfigButton, etc.
  app/             # App Router pages
SITE_CONFIG.md     # matrix instance from Matrix_Website_Base_Standard.md
```

---

## 5. UI modules & interaction

### Home `/`

- Hero: brand + positioning + CTAs (browse by tool / featured)
- Tool strip: six entries; placeholder tools labeled but clickable
- Featured grid: `featured: true` cards

### Tool page `/tools/[slug]`

- Tool intro + install overview
- Filters: `sourceType`, `status`, tags
- Theme grid; placeholders show “preview / go to source”, not fake download

### Theme detail `/themes/[slug]`

1. **Preview** — main image + gallery; missing image → colored placeholder “preview pending”
2. **Acquire**
   - `copyConfig.enabled` → Copy config (+ toast); fallback selectable `<pre>` on clipboard failure
   - `download.enabled` → Download link; missing file → disabled + reason
   - both off → acquire placeholder explaining ownership (original pending upload / curated outbound)
3. **Attribution** — author, license, `sourceUrl` (required UI for curated)
4. **API slot banner** — only if `apiSlot` set; never imply live API
5. **Related** — same tool or tags, max 4

### Components

| Component | Responsibility |
|-----------|----------------|
| `ThemeCard` | List card |
| `ThemePreview` | Image or missing-image placeholder |
| `CopyConfigButton` | Clipboard copy from `contentPath` |
| `DownloadButton` | Download or disabled placeholder |
| `AttributionBlock` | Source & license |
| `ApiSlotBanner` | Reserved API explanation |
| `ToolBadge` | Tool name + capability |

---

## 6. Tech stack & matrix config

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router + TypeScript |
| Styling | Tailwind CSS + site CSS variables (distinct brand; avoid default purple-on-white AI look) |
| Content | JSON themes/tools + MDX posts |
| Hosting | GitHub → Vercel |
| Analytics | GA4 or Umami with `site_id` |

### Suggested repo / env

- Repo name: `site-tools-dev-themes`
- Env: `NEXT_PUBLIC_SITE_ID`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_TRACKING_ID`, `NEXT_PUBLIC_ANALYTICS_SITE_TAG=dev-themes`, `NEXT_PUBLIC_PRIMARY_HUB_URL`

### SEO

- SSG for theme and tool pages; `sitemap.xml` + `robots.txt`
- Title pattern: `{Theme} — {Tool} theme | {SiteName}`
- OG: `previewImage` or site default

---

## 7. Phased delivery

| Phase | Deliver | Explicitly not |
|-------|---------|----------------|
| **P0 Framework** | Routes, layout, content loaders, cards/detail, copy/download/placeholder/ApiSlot, 2–3 sample themes, 6 tool records | AI batch images, real .vsix fleets |
| **P1 Content** | AI preview pipeline into `public/themes/`; fill vscode/cursor/jetbrains packs; install posts | Social app skins |
| **P2 Enhance** | Download metrics or light API; curated submit flow; promote DevTools/Git tools off placeholder | — |
| **P3 Matrix** | Domain or merge decision by PV / dwell | — |

### Success criteria (racing)

- Shareable URLs; theme pages indexable
- Original themes: preview + at least one acquire path (copy or download)
- Curated/placeholder: attribution clear; no false installability
- Matrix-safe IDs and shallow routes

---

## 8. Error & edge handling

- Missing `previewImage`: visual placeholder, page still 200
- Missing download file while `download.enabled: true`: treat as disabled at build or request time; surface reason
- `draft: true`: excluded from lists and sitemap
- Clipboard API unavailable: show raw config block
- Empty tool list (placeholder tools): empty state copy “slot reserved, content coming”

---

## 9. Testing (P0)

- Content loader returns only non-draft themes
- Tool page filters by `tool` slug
- Copy path resolves `contentPath` text
- Theme detail renders ApiSlotBanner iff `apiSlot` present
- Sitemap includes `ready` and `placeholder` public themes, excludes `draft`
