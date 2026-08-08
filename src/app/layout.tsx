import type { Metadata } from "next";
import { getSiteConfig } from "@/config/site.config";
import "./globals.css";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: site.siteName,
  description: `${site.siteName} — developer theme catalog`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
