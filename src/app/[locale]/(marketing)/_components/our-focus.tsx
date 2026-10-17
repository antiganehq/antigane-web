import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function OurFocus() {
  const t = await getTranslations("focus");

  const rows = [
    { no: "01", title: t("game.title"), body: t("game.body") },
    { no: "02", title: t("blockchain.title"), body: t("blockchain.body") },
    { no: "03", title: t("ai.title"), body: t("ai.body") },
  ] as const;

  return (
    <section id="focus" className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <div className="h-px w-full bg-border" aria-hidden="true" />
        <p className="kicker mt-6 text-muted-foreground">{t("kicker")}</p>
        <div className="mt-4 grid grid-cols-12 gap-x-6 md:gap-x-8">
          <h2 className="col-span-12 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] tracking-[-0.005em] md:col-start-1 md:col-span-8">
            {t("title")}
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-12 gap-x-6 md:gap-x-8">
          <p className="lede col-span-12 max-w-[66ch] text-[1.125rem] leading-[1.6] md:col-start-2 md:col-span-6">
            {t("lede")}
          </p>
        </div>
        <div className="mt-12 border-t border-border">
          {rows.map((row) => (
            <div
              key={row.no}
              className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-border py-6 md:gap-x-8"
            >
              <p className="tnum col-span-2 text-sm text-muted-foreground md:col-span-1">
                {row.no}
              </p>
              <h3 className="col-span-10 font-display text-xl leading-tight md:col-span-5 md:text-2xl">
                {row.title}
              </h3>
              <p className="col-span-10 col-start-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground sm:text-base md:col-start-7 md:col-span-5">
                {row.body}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/research"
          className="mt-8 inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
        >
          {t("methodLink")} →
        </Link>
      </div>
    </section>
  );
}
