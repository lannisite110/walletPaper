export type SiteConfig = {
  siteId: string;
  siteName: string;
  siteUrl: string;
  gaTrackingId: string;
  analyticsSiteTag: string;
  primaryHubUrl: string;
};

function envOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function getSiteConfig(): SiteConfig {
  return {
    siteId: envOr(process.env.NEXT_PUBLIC_SITE_ID, "site-wallet"),
    siteName: envOr(process.env.NEXT_PUBLIC_SITE_NAME, "Wallet Paper Themes"),
    // Empty string in Vercel env must not reach `new URL("")` (build crash).
    siteUrl: envOr(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID?.trim() ?? "",
    analyticsSiteTag: envOr(
      process.env.NEXT_PUBLIC_ANALYTICS_SITE_TAG,
      "dev-themes",
    ),
    primaryHubUrl: process.env.NEXT_PUBLIC_PRIMARY_HUB_URL?.trim() ?? "",
  };
}
