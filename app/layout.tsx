import "./globals.css";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import siteData from "../public/site-data.json";
import { AnalyticsScripts } from "./analytics";
import { AnalyticsEvents } from "./analytics-events";

const firstGameImage = ((siteData as any).media || []).find((asset: any) => asset.status === "ready" && asset.role !== "favicon" && asset.public_path)?.public_path;
const siteName = siteData.game?.name || "Game Guide";
const siteDescription = siteData.metadata?.description || "Evidence-backed game guides.";

export const metadata: Metadata = {
  metadataBase: new URL(siteData.site?.base_url || "http://localhost:3000"),
  title: siteData.metadata?.title || siteName,
  description: siteDescription,
  keywords: siteData.metadata?.keywords,
  alternates: { canonical: "/" },
  robots: siteData.site?.indexable === false ? "noindex" : "index,follow",
  icons: { icon: siteData.site?.favicon_path || "/favicon.svg", shortcut: siteData.site?.favicon_path || "/favicon.svg" },
  openGraph: { type: "website", siteName, title: siteData.metadata?.title || siteName, description: siteDescription, url: "/", images: firstGameImage ? [{ url: firstGameImage, alt: `${siteName} guide` }] : undefined },
  twitter: { card: firstGameImage ? "summary_large_image" : "summary", title: siteData.metadata?.title || siteName, description: siteDescription, images: firstGameImage ? [firstGameImage] : undefined }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = siteData.theme || { hue: 216, saturation: 92, lightness: 58, mode: "light" };
  const style = {
    "--theme-hue": theme.hue,
    "--theme-saturation": `${theme.saturation}%`,
    "--theme-lightness": `${theme.lightness}%`
  } as CSSProperties;
  return <html lang={siteData.site?.default_locale || "en"} data-theme={theme.mode || "light"} style={style}><body>{children}<AnalyticsScripts /><AnalyticsEvents /></body></html>;
}
