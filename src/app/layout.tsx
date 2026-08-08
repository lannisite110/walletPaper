import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { getSiteConfig } from "@/config/site.config";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const site = getSiteConfig();

const siteDescription =
  "Developer themes for VS Code, Cursor, JetBrains, and reserved tool slots.";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.siteName,
    template: `%s | ${site.siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: site.siteName,
    title: site.siteName,
    description: siteDescription,
    images: [{ url: "/og-default.svg", alt: site.siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.siteName,
    description: siteDescription,
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Analytics />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
