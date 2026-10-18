import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createMetadata } from "@/shared/lib/metadata";
import { PRODUCTS, getOtherProducts, getProduct } from "@/features/products/data";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCTS.map((p) => ({ locale, product: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  const meta = getProduct(product);
  if (!meta) return {};
  const t = await getTranslations({ locale, namespace: "products" });
  const title = t(`${meta.i18nKey}.title`);
  const description = t(`${meta.i18nKey}.body`);

  return createMetadata({
    title,
    description,
    path: `/${meta.slug}`,
    image: meta.image,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  const meta = getProduct(product);
  if (!meta) notFound();

  const t = await getTranslations({ locale, namespace: "products" });
  const title = t(`${meta.i18nKey}.title`);
  const body = t(`${meta.i18nKey}.body`);
  const tagline = t(`${meta.i18nKey}.tagline`);
  const highlights = t.raw(`${meta.i18nKey}.highlights`) as string[];
  const host = meta.url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");
  const others = getOtherProducts(meta.slug);

  return (
    <div>
      {/* Breadcrumb / hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link
              href="/#products"
              className="text-muted-foreground underline underline-offset-4 decoration-1 hover:text-foreground"
            >
              {t("detail.breadcrumb")}
            </Link>
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <span className="text-foreground">{title}</span>
          </nav>
          <p className="kicker mt-8 flex items-center gap-3 text-muted-foreground">
            <span
              aria-hidden="true"
              className="inline-block h-px w-12 bg-foreground"
            />
            {t("detail.overviewKicker")}
          </p>
          <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <h1 className="col-span-12 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.04] tracking-[-0.01em] text-foreground md:col-start-1 md:col-span-9">
              {title}
            </h1>
            <p className="col-span-12 mt-6 max-w-[50ch] text-[clamp(1.15rem,1.6vw,1.5rem)] leading-relaxed text-muted-foreground md:col-start-1 md:col-span-6">
              {tagline}
            </p>
            <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
              <p>{t("detail.websiteLabel")}</p>
              <p className="mt-1 text-foreground">{host}</p>
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("visit", { title })}
                className="mt-4 inline-block text-foreground underline underline-offset-4 decoration-1"
              >
                {t("detail.visitSite")} →
              </a>
            </div>
          </div>
          <figure className="mt-12">
            <Image
              src={meta.image}
              alt=""
              width={1600}
              height={1000}
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="aspect-[16/10] h-auto w-full object-cover"
            />
            <figcaption className="mt-2 text-[13px] leading-snug text-muted-foreground">
              {title} — {tagline}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Overview + highlights */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
            <p className="lede col-span-12 max-w-[66ch] text-[1.125rem] leading-[1.6] md:col-start-2 md:col-span-6">
              {body}
            </p>
          </div>
          <p className="kicker mt-12 text-muted-foreground">
            {t("detail.highlightsKicker")}
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("detail.highlightsTitle")}
          </h2>
          <div className="mt-8 border-t border-border">
            {highlights.map((line, i) => (
              <div
                key={line}
                className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-border py-6 md:gap-x-8"
              >
                <p className="tnum col-span-2 text-sm text-muted-foreground md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="col-span-10 max-w-[66ch] text-base leading-relaxed text-foreground md:col-start-2 md:col-span-10">
                  {line}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-6 md:gap-x-8">
            <figure className="col-span-12 md:col-start-1 md:col-span-5">
              <Image
                src={meta.verticalImage}
                alt=""
                width={800}
                height={1200}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="aspect-[2/3] h-auto w-full object-cover"
              />
            </figure>
            <div className="col-span-12 md:col-start-7 md:col-span-5">
              <p className="kicker text-muted-foreground">
                {t("detail.ecosystemKicker")}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1]">
                {t("detail.ecosystemTitle")}
              </h2>
              <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-muted-foreground">
                {t("detail.ecosystemBody")}
              </p>
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
              >
                {host} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* More products */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
              {t("detail.moreTitle")}
            </h2>
            <Link
              href="/#products"
              className="text-sm text-foreground underline underline-offset-4 decoration-1"
            >
              ← {t("detail.backToProducts")}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {others.map((other) => {
              const otherTitle = t(`${other.i18nKey}.title`);
              const otherBody = t(`${other.i18nKey}.body`);
              return (
                <Link
                  key={other.slug}
                  href={`/${other.slug}`}
                  aria-label={t("openDetail", { title: otherTitle })}
                  className="focus-ring group block border border-border p-6"
                >
                  <p className="text-[13px] text-muted-foreground">
                    {t("detail.breadcrumb")}
                  </p>
                  <p className="mt-2 font-display text-2xl leading-tight group-hover:underline group-hover:underline-offset-4">
                    {otherTitle} →
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {otherBody}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
