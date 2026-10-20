import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PRODUCTS } from "@/features/products/data";
import { siteConfig } from "@/shared/lib/metadata";

/**
 * Sitemap — ANT-99/ANT-117.
 * Canonical host stays https://antigane.com (this site is NOT migrating;
 * only outbound wallet/dashboard/docs links moved to peridot.id).
 * The external-redirect page /:locale/peridot is intentionally excluded so
 * crawlers don't index a 307.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const indexable = PRODUCTS.filter((p) => p.slug !== "peridot");
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
    for (const product of indexable) {
      entries.push({
        url: `${base}/${locale}/${product.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
