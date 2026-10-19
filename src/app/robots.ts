import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/lib/metadata";

/** Robots — ANT-99/ANT-117. Keeps /admin out of the index; sitemap on canonical host. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
