# 100 站矩阵式建站通用基础规范 (Matrix Site Standard)

> **版本**：v1.0.0  
> **适用场景**：GitHub + Vercel 矩阵式独立建站、前期高并发赛马、后期无缝平滑合并。  
> **使用说明**：每次新建网站项目时，复制本文件至仓库根目录重命名为 `SITE_CONFIG.md`，并填入该站点的专属环境变量。

---

## 一、 项目初始化规范 (Project Standard)

### 1. 命名约定 (Naming Conventions)
* **GitHub 仓库名**：`walletPaper`（本站点实际仓库名）
* **Vercel 项目名**：`walletPaper`（或与 GitHub 仓库名一致）
* **目录结构规范**：
  ```text
  ├── content/            # 所有的文章/数据内容（纯 Markdown/MDX 或 JSON）
  ├── public/             # 静态资源 (favicon, og-image 等)
  ├── src/
  │   ├── config/         # 站点专属配置文件 (site.config.ts)
  │   ├── app/            # App Router 路由
  │   └── components/     # 通用 UI 组件
  ├── .env.example        # 环境变量模板
  └── SITE_CONFIG.md      # 本规范实例文件
  ```

### 2. 环境变量 (Environment Variables)
新建项目时，务必在 Vercel 控制台及本地 `.env.local` 中配置以下统一变量：

```bash
# 站点基础识别
NEXT_PUBLIC_SITE_ID="site-wallet"
NEXT_PUBLIC_SITE_NAME="Wallet Paper Themes"
NEXT_PUBLIC_SITE_URL="https://wallet-paper.vercel.app"

# 全局聚合分析 (100站共用一个GA4或Umami看板)
NEXT_PUBLIC_GA_TRACKING_ID=""
NEXT_PUBLIC_ANALYTICS_SITE_TAG="dev-themes"

# 架构备用 (后期合并/重定向目标主站)
NEXT_PUBLIC_PRIMARY_HUB_URL="https://www.your-main-hub.com"
```

---

## 二、 内容与路由规范 (Content & Routing Standard)

为确保后期合并时**零冲突**，所有内容数据必须遵循统一结构。

### 1. Markdown/MDX Frontmatter 必须包含字段
每个内容文件头部必须包含且仅包含以下结构：

```yaml
---
id: "site-wallet-post-01"         # 前缀包含 site_id，防止合并时 ID 重复
title: "How to Optimize Smart Contracts"
description: "A quick guide on solidity optimization."
slug: "how-to-optimize-smart-contracts" # 必须唯一且不带分类前缀
pubDate: "2026-08-03"
updatedDate: "2026-08-03"
category: "web3"                  # 分类，方便后期合并到主站的特定板块
tags: ["solidity", "ethereum"]
author: "MatrixBot"
draft: false
---
```

### 2. 标准防冲突 URL 路由模式
* **规则**：绝不使用深层无规则路由，所有内容路由统一使用 `/posts/[slug]` 或 `/tools/[slug]`。
* **合并公式**：
  * **前期独立**：`wallet-paper.vercel.app/posts/[slug]`
  * **后期合并**：`main-hub.com/category-a/posts/[slug]` （只需对文件夹重命名，无需修改 slug）

---

## 三、 全局数据统计与埋点 (Analytics Standard)

为避免维护 100 个 Analytics 账号，统一采用**单看板 + 多维度标记**模式：

1. **页面浏览 (PV)**：初始化代码中自动附加 `site_id` 参数。
   ```javascript
   // 统一埋点示例
   gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
     'custom_map': {'dimension1': 'site_id'},
     'site_id': process.env.NEXT_PUBLIC_SITE_ID
   });
   ```
2. **核心指标监控（决定是否合并）**：
   * 月 PV > 3,000 且 均停留时间 > 45s → **进入二级评估（准备买独立域名）**。
   * 月 PV > 10,000 或 有实际转化/付费 → **触发合并至主站规则**。

---

## 四、 后期平滑合并与 301 重定向 SOP (Migration SOP)

当决策将当前站点（如 `site-wallet`）合并入主站（如 `main-hub.com`）时，严格按照以下步骤操作：

### 1. 内容迁移
* 将 `site-wallet` 的 `content/` 目录下所有内容文件复制到主站 `content/site-wallet-category/` 下。
* 由于所有 `slug` 已做了全局防重，且数据结构完全一致，主站可直接渲染。

### 2. Vercel 301 重定向配置
**切勿删除原 Vercel 项目！** 将原站点的 `vercel.json` 覆盖为以下纯重定向配置：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/posts/:slug*",
      "destination": "https://www.your-main-hub.com/sub-site-wallet/posts/:slug*",
      "permanent": true
    },
    {
      "source": "/(.*)",
      "destination": "https://www.your-main-hub.com/sub-site-wallet",
      "permanent": true
    }
  ]
}
```

### 3. Google Search Console 迁移通知
1. 在 GSC 中添加主站域名及旧站点二级域名。
2. 使用 GSC 的 **“地址更改 (Change of Address)”** 工具，提交从旧域名至主站新路径的权重转移申请。

---

## 五、 新建站点 Check List (检查清单)

每次建立新站点，按顺序勾选：

- [ ] **仓库配置**：使用规范名称在 GitHub 创建独立 Repo。
- [ ] **Vercel 关联**：导入 GitHub Repo，设置 `NEXT_PUBLIC_SITE_ID` 环境变量。
- [ ] **基础配置**：复制本文件为 `SITE_CONFIG.md` 并填写站点标识。
- [ ] **SEO 基础**：确保 `sitemap.xml` 和 `robots.txt` 正常自动生成。
- [ ] **统计确认**：确认 GA4 / 统计工具能正常收到带 `site_id` 的流量日志。
- [ ] **发布上线**：推送到 `main` 分支完成首发。
