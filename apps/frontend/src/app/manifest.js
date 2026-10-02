import { siteConfig } from "@/site.config";

// Next serves this at /manifest.webmanifest and links it from every page.
export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    icons: [{ src: "/favicon.png", type: "image/png", sizes: "512x512" }],
    start_url: "/",
    display: "standalone",
    theme_color: siteConfig.themeColor,
    background_color: siteConfig.backgroundColor,
  };
}
