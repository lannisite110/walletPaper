import type { Metadata } from "next";
import { getSiteConfig } from "@/config/site.config";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.siteName,
    template: `%s | ${site.siteName}`,
  },
  description:
    "Developer themes for VS Code, Cursor, JetBrains, and reserved tool slots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
