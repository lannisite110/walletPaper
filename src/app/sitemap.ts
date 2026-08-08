import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/config/site.config";
import { getAllPosts } from "@/lib/content/loadPosts";
import { getAllThemes } from "@/lib/content/loadThemes";
import { getAllTools } from "@/lib/content/loadTools";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = getSiteConfig();
  const baseUrl = siteUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/tools` },
    { url: `${baseUrl}/about` },
  ];

  const toolRoutes = getAllTools().map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
  }));

  const themeRoutes = getAllThemes().map((theme) => ({
    url: `${baseUrl}/themes/${theme.slug}`,
    lastModified: new Date(theme.updatedDate || theme.pubDate),
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.pubDate),
  }));

  return [...staticRoutes, ...toolRoutes, ...themeRoutes, ...postRoutes];
}
