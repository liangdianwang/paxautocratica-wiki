import "./globals.css";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import siteData from "../public/site-data.json";
import { AnalyticsScripts } from "./analytics";

export const metadata: Metadata = {
  metadataBase: new URL(siteData.site?.base_url || "http://localhost:3000"),
  title: siteData.metadata?.title || siteData.game?.name || "Game Wiki",
  description: siteData.metadata?.description || "Evidence-backed game guides.",
  keywords: siteData.metadata?.keywords,
  alternates: { canonical: "/" },
  robots: siteData.site?.indexable === false ? "noindex" : "index,follow",
  icons: { icon: siteData.site?.favicon_path || "/favicon.svg", shortcut: siteData.site?.favicon_path || "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = siteData.theme || { hue: 216, saturation: 92, lightness: 58, mode: "light" };
  const style = {
    "--theme-hue": theme.hue,
    "--theme-saturation": `${theme.saturation}%`,
    "--theme-lightness": `${theme.lightness}%`
  } as CSSProperties;
  return <html lang={siteData.site?.default_locale || "en"} data-theme={theme.mode || "light"} style={style}><body>{children}<AnalyticsScripts /></body></html>;
}
