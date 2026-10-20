import { PRODUCT_URLS } from "@/shared/lib/peridot-domains";

export type ProductSlug = "peridot" | "identity" | "live2dev";

export interface ProductMeta {
  slug: ProductSlug;
  /** i18n key under the `products` namespace (e.g. `peridot`, `peridotId`). */
  i18nKey: "peridot" | "peridotId" | "live2dev";
  url: string;
  image: string;
  verticalImage: string;
  /** Legacy / alternate slugs that resolve to the canonical slug
   * (non-canonical hits 308 to canonical — see [product]/page.tsx). */
  aliases: string[];
}

export const PRODUCTS: ProductMeta[] = [
  {
    slug: "peridot",
    i18nKey: "peridot",
    // ANT-99/ANT-117: primary is the new dashboard host
    // (https://dashboard.peridot.id, sandbox: https://sandbox.dashboard.peridot.id).
    // Legacy https://peridot.antigane.com (+ https://peridotvault.com) stays
    // live (dual-serve, no hard cutover) — see LEGACY_HOSTS.
    // The showcase row links out; /:locale/peridot redirects there (see [product]/page.tsx).
    url: PRODUCT_URLS.peridot,
    image: "/products/peridot-horizontal.png",
    verticalImage: "/products/peridot-vertical.png",
    aliases: [],
  },
  {
    // ANT-163: canonical route is /:locale/identity. The PeridotID /
    // Peridot ID brand copy (i18n key `peridotId`) is unchanged — only the
    // URL slug moved. Old /:locale/peridot-id URLs 308 to canonical
    // (aliases below + redirect in [product]/page.tsx and next.config.ts).
    slug: "identity",
    i18nKey: "peridotId",
    // ANT-99/ANT-117: wallet primary is https://peridot.id
    // (sandbox: https://sandbox.peridot.id). Legacy
    // https://pid.peridotvault.com (+ app.pid.peridotvault.com) stays live.
    url: PRODUCT_URLS.peridotId,
    image: "/products/peridotid-horizontal.png",
    verticalImage: "/products/peridotid-vertical.png",
    aliases: ["peridot_id", "peridotid", "peridot-id", "pid"], // "peridot-id" = pre-ANT-163 route
  },
  {
    slug: "live2dev",
    i18nKey: "live2dev",
    url: "https://live2dev.com",
    image: "/products/live2dev-horizontal.png",
    verticalImage: "/products/live2dev-vertical.png",
    aliases: [],
  },
];

export function getProduct(input: string): ProductMeta | null {
  const slug = input.toLowerCase();
  return (
    PRODUCTS.find((p) => p.slug === slug || p.aliases.includes(slug)) ?? null
  );
}

export function getOtherProducts(slug: string): ProductMeta[] {
  return PRODUCTS.filter((p) => p.slug !== slug);
}
