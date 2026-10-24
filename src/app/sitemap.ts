import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/shared/lib/metadata";

/**
 * Sitemap — ANT-99/ANT-117.
 * Canonical host stays https://antigane.com (this site is NOT migrating;
 * only outbound wallet/dashboard/docs links moved to peridot.id).
 * Product detail pages no longer exist (showcase rows link out directly),
 * so only static routes are indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPaths = ["", "/research"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
