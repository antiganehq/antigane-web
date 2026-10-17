import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <p className="kicker flex items-center gap-3 text-muted-foreground">
          <span aria-hidden="true" className="inline-block h-px w-12 bg-foreground" />
          {t("kicker")}
        </p>
        <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
          <h1 className="col-span-12 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.04] tracking-[-0.01em] text-foreground md:col-start-1 md:col-span-9">
            {t("heading")}
          </h1>
          <p className="col-span-12 mt-6 max-w-[50ch] text-[clamp(1.15rem,1.6vw,1.5rem)] leading-relaxed text-muted-foreground md:col-start-1 md:col-span-6">
            {t("tagline")}
          </p>
          <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
            <p>{t("meta.place")}</p>
            <p className="mt-1">{t("meta.focus")}</p>
            <p className="mt-1">{t("meta.reading")}</p>
            <a
              href="#products"
              className="mt-4 inline-block text-foreground underline underline-offset-4 decoration-1"
            >
              {t("explore")} →
            </a>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6">
          {[
            { label: t("stats.products"), value: "3" },
            { label: t("stats.focus"), value: "3" },
            { label: t("stats.commercialUse"), value: t("stats.ready") },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
              <p className="tnum mt-2 text-2xl tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
