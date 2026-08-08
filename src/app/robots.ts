import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = getSiteConfig();
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
