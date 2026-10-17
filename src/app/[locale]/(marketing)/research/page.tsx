import { createMetadata } from "@/shared/lib/metadata";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import researchContent from "@/messages/research.json";
import type { ResearchItem } from "@/features/research/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "research" });

  return createMetadata({
    title: t("title"),
    description: t("standfirst"),
    path: "/research",
  });
}

export default async function ResearchPage() {
  const t = await getTranslations("research");

  const areas = [
    { no: "01", title: t("areas.game.title"), body: t("areas.game.body") },
    { no: "02", title: t("areas.blockchain.title"), body: t("areas.blockchain.body") },
    { no: "03", title: t("areas.ai.title"), body: t("areas.ai.body") },
  ];

  // Research content is locale-agnostic: one list for every locale.
  const notes = researchContent.articles as ResearchItem[];
  const pubs = researchContent.publications as ResearchItem[];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <p className="kicker flex items-center gap-3 text-muted-foreground">
            <span aria-hidden="true" className="inline-block h-px w-12 bg-foreground" />
            {t("kicker")}
          </p>
          <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <h1 className="col-span-12 font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.04] tracking-[-0.01em] md:col-start-1 md:col-span-9">
              {t("title")}
            </h1>
            <p className="col-span-12 mt-6 max-w-[50ch] text-[clamp(1.15rem,1.6vw,1.5rem)] leading-relaxed text-muted-foreground md:col-start-1 md:col-span-6">
              {t("standfirst")}
            </p>
            <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
              <p>{t("meta.byline")}</p>
              <p className="mt-1">{t("meta.date")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <div className="h-px w-full bg-border" aria-hidden="true" />
          <p className="kicker mt-6 text-muted-foreground">{t("areasKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("areasTitle")}
          </h2>
          <div className="mt-8 border-t border-border">
            {areas.map((a) => (
              <div
                key={a.no}
                className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-border py-6 md:gap-x-8"
              >
                <p className="tnum col-span-2 text-sm text-muted-foreground md:col-span-1">
                  {a.no}
                </p>
                <h3 className="col-span-10 font-display text-xl md:col-span-5 md:text-2xl">
                  {a.title}
                </h3>
                <p className="col-span-10 col-start-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground sm:text-base md:col-start-7 md:col-span-5">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background [--ring:var(--background)]">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <p className="kicker text-background/60">{t("indexKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("indexTitle")}
          </h2>
          <p className="tnum mt-3 text-sm text-background/60">
            {t("countLine", {
              total: notes.length + pubs.length,
              articles: notes.length,
              pubs: pubs.length,
            })}
          </p>
          <div className="mt-8 border-t border-background/15">
            {notes.map((n, i) => (
              <Link
                key={n.slug}
                href={`/research/${n.slug}`}
                className="focus-ring grid grid-cols-12 gap-x-6 gap-y-1 border-b border-background/15 py-5 md:gap-x-8"
              >
                <p className="tnum col-span-2 text-sm text-background/60 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="col-span-10 text-base font-medium text-background underline-offset-4 hover:underline md:col-span-5">
                  {n.title}
                </p>
                <p className="col-span-10 col-start-3 text-sm text-background/60 md:col-start-7 md:col-span-5">
                  {n.authors.join(", ")} · {n.date} →
                </p>
              </Link>
            ))}
          </div>
          <p className="kicker mt-12 text-background/60">{t("pubsKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("pubsTitle")}
          </h2>
          <div className="mt-8 border-t border-background/15">
            {pubs.length === 0 ? (
              <p className="border-b border-background/15 py-5 text-sm text-background/60">
                {t("forthcoming")}
              </p>
            ) : (
              pubs.map((p) => (
                <div
                  key={p.title}
                  className="grid grid-cols-12 gap-x-6 gap-y-1 border-b border-background/15 py-5 md:gap-x-8"
                >
                  <p className="tnum col-span-2 text-sm text-background/60 md:col-span-1">
                    {p.date}
                  </p>
                  <p className="col-span-10 text-base font-medium text-background md:col-span-5">
                    {p.slug ? (
                      <Link
                        href={`/research/${p.slug}`}
                        className="underline underline-offset-4 decoration-1"
                      >
                        {p.title} →
                      </Link>
                    ) : p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 decoration-1"
                      >
                        {p.title} →
                      </a>
                    ) : (
                      p.title
                    )}
                  </p>
                  <p className="col-span-10 col-start-3 text-sm text-background/60 md:col-start-7 md:col-span-5">
                    {p.authors.join(", ")} ({p.date}). {p.title}. {p.venue}.
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="mt-12 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <div className="col-span-12 md:col-start-2 md:col-span-6">
              <p className="kicker text-background/60">{t("closeKicker")}</p>
              <h2 className="mt-4 font-display text-2xl leading-tight md:text-3xl">
                {t("closeTitle")}
              </h2>
              <p className="mt-4 max-w-[66ch] leading-relaxed text-background/60">
                {t("closeBody")}
              </p>
              <Link
                href="/#products"
                className="focus-ring mt-6 inline-block text-sm text-background underline underline-offset-4 decoration-1"
              >
                See the products →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
