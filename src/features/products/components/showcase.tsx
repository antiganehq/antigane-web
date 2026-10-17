import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

const ITEMS = [
  {
    no: "01",
    i18nKey: "peridot",
    url: "https://peridotvault.com",
    image: "/products/peridot-horizontal.png",
  },
  {
    no: "02",
    i18nKey: "peridotId",
    url: "https://pid.peridotvault.com",
    image: "/products/peridotid-horizontal.png",
  },
  {
    no: "03",
    i18nKey: "live2dev",
    url: "https://live2dev.com",
    image: "/products/live2dev-horizontal.png",
  },
] as const;

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
          {ITEMS.map((item) => {
            const title = t(`${item.i18nKey}.title`);
            const body = t(`${item.i18nKey}.body`);
            const host = item.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <article
                key={item.no}
                className="grid grid-cols-12 items-start gap-x-6 gap-y-6 border-b border-border py-10 md:gap-x-8"
              >
                <div className="col-span-12 md:col-start-1 md:col-span-6">
                  <p className="tnum text-sm text-muted-foreground">{item.no}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight md:text-3xl">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-[66ch] text-base leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("visit", { title })}
                    className="mt-4 inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
                  >
                    {host} →
                  </a>
                </div>
                <figure className="col-span-12 md:col-start-7 md:col-span-6">
                  <Image
                    src={item.image}
                    alt=""
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="aspect-[3/2] h-auto w-full object-cover"
                  />
                  <figcaption className="mt-2 max-w-[32ch] text-[13px] leading-snug text-muted-foreground">
                    Plate {item.no} — {title}
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
