"use client";

import Script from "next/script";
import { getSiteConfig } from "@/config/site.config";

export function Analytics() {
  const { gaTrackingId, siteId } = getSiteConfig();

  if (!gaTrackingId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaTrackingId}', {
            'custom_map': {'dimension1': 'site_id'},
            'site_id': '${siteId}'
          });
        `}
      </Script>
    </>
  );
}
