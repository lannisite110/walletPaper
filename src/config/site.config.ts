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
