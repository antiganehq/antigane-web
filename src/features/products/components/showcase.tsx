import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { PRODUCTS } from "@/features/products/data";

export async function Showcase(): Promise<ReactNode> {
  const t = await getTranslations("products");

  return (
    <section id="products" aria-label={t("heading")} className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <p className="kicker text-muted-foreground">{t("kicker")}</p>
        <div className="mt-4 grid grid-cols-12 gap-x-6 md:gap-x-8">
          <h2 className="col-span-12 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] md:col-start-1 md:col-span-8">
            {t("heading")}
            <br />
            <span className="text-muted-foreground">{t("subheading")}</span>
          </h2>
        </div>
        <div className="mt-12 border-t border-border">
          {PRODUCTS.map((item, idx) => {
            const no = String(idx + 1).padStart(2, "0");
            const title = t(`${item.i18nKey}.title`);
            const body = t(`${item.i18nKey}.body`);
            const host = item.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <article
                key={item.slug}
                className="group relative grid grid-cols-12 items-start gap-x-6 gap-y-6 border-b border-border py-10 transition-colors duration-200 hover:bg-muted/50 md:gap-x-8"
              >
                <Link
                  href={`/${item.slug}`}
                  aria-label={t("openDetail", { title })}
                  className="focus-ring absolute inset-0 z-0"
                >
                  <span className="sr-only">{t("openDetail", { title })}</span>
                </Link>
                <div className="pointer-events-none col-span-12 md:col-start-1 md:col-span-6">
                  <p className="tnum text-sm text-muted-foreground">{no}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight md:text-3xl">
                    <span className="underline-offset-4 group-hover:underline">
                      {title}
                    </span>
                  </h3>
                  <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span
                      aria-hidden="true"
                      className="inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
                    >
                      {t("openDetail", { title })} →
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("visit", { title })}
                      className="pointer-events-auto relative z-10 inline-block text-sm text-muted-foreground underline underline-offset-4 decoration-1 hover:text-foreground"
                    >
                      {host} ↗
                    </a>
                  </div>
                </div>
                <figure className="pointer-events-none col-span-12 md:col-start-7 md:col-span-6">
                  <div className="overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-2 max-w-[32ch] text-[13px] leading-snug text-muted-foreground">
                    Plate {no} — {title}
                  </figcaption>
                </figure>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
