import { PRODUCT_URLS } from "@/shared/lib/peridot-domains";

export type ProductSlug = "peridot" | "peridot-id" | "live2dev";

export interface ProductMeta {
  slug: ProductSlug;
  /** i18n key under the `products` namespace (e.g. `peridot`, `peridotId`). */
  i18nKey: "peridot" | "peridotId" | "live2dev";
  /** Optional "View Detail" link shown as a button on the showcase card. */
  detailUrl?: string;
  /** "Go to App" link shown as a button on the showcase card. */
  appUrl: string;
  image: string;
  verticalImage: string;
}

export const PRODUCTS: ProductMeta[] = [
  {
    slug: "peridot",
    i18nKey: "peridot",
    detailUrl: PRODUCT_URLS.peridotSite,
    appUrl: PRODUCT_URLS.peridotApp,
    image: "/products/peridot-horizontal.png",
    verticalImage: "/products/peridot-vertical.png",
  },
  {
    slug: "peridot-id",
    i18nKey: "peridotId",
    detailUrl: PRODUCT_URLS.peridotId,
    appUrl: PRODUCT_URLS.peridotIdApp,
    image: "/products/peridotid-horizontal.png",
    verticalImage: "/products/peridotid-vertical.png",
  },
  {
    slug: "live2dev",
    i18nKey: "live2dev",
    appUrl: "https://live2dev.com",
    image: "/products/live2dev-horizontal.png",
    verticalImage: "/products/live2dev-vertical.png",
  },
];
