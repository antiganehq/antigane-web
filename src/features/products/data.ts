export type ProductSlug = "peridot" | "peridot-id" | "live2dev";

export interface ProductMeta {
  slug: ProductSlug;
  /** i18n key under the `products` namespace (e.g. `peridot`, `peridotId`). */
  i18nKey: "peridot" | "peridotId" | "live2dev";
  url: string;
  image: string;
  verticalImage: string;
  /** Legacy / alternate slugs that should resolve to the canonical slug. */
  aliases: string[];
}

export const PRODUCTS: ProductMeta[] = [
  {
    slug: "peridot",
    i18nKey: "peridot",
    url: "https://peridotvault.com",
    image: "/products/peridot-horizontal.png",
    verticalImage: "/products/peridot-vertical.png",
    aliases: [],
  },
  {
    slug: "peridot-id",
    i18nKey: "peridotId",
    url: "https://pid.peridotvault.com",
    image: "/products/peridotid-horizontal.png",
    verticalImage: "/products/peridotid-vertical.png",
    aliases: ["peridot_id", "peridotid", "peridot-id", "pid"],
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
