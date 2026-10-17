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

function IndexRows({ items }: { items: ResearchItem[] }) {
  return (
    <>
      {items.map((n, i) => (
        <Link
          key={n.slug}
          href={`/research/${n.slug}`}
          className="focus-ring grid grid-cols-12 gap-x-6 gap-y-1 border-b border-border py-5 md:gap-x-8"
        >
          <p className="tnum col-span-2 text-sm text-muted-foreground md:col-span-1">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="col-span-10 text-base font-medium text-foreground underline-offset-4 hover:underline md:col-span-5">
            {n.title}
          </p>
          <p className="col-span-10 col-start-3 text-sm text-muted-foreground md:col-start-7 md:col-span-5">
            {n.authors.join(", ")} · {n.date} →
          </p>
        </Link>
      ))}
    </>
  );
}

export default async function ResearchPage() {
  const t = await getTranslations("research");

  // Research content is locale-agnostic: one list for every locale.
  const notes = researchContent.articles as ResearchItem[];
  const drafts = researchContent.manuscripts as ResearchItem[];
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
          <p className="kicker text-muted-foreground">{t("indexKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("indexTitle")}
          </h2>
          <p className="tnum mt-3 text-sm text-muted-foreground">
            {t("countLine", {
              total: notes.length + drafts.length + pubs.length,
              articles: notes.length,
              manuscripts: drafts.length,
              pubs: pubs.length,
            })}
          </p>

          <p className="kicker mt-12 text-muted-foreground">{t("pubsKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("pubsTitle")}
          </h2>
          <div className="mt-8 border-t border-border">
            {pubs.length === 0 ? (
              <p className="border-b border-border py-5 text-sm text-muted-foreground">
                {t("forthcoming")}
              </p>
            ) : (
              pubs.map((p) => (
                <div
                  key={p.slug}
                  className="grid grid-cols-12 gap-x-6 gap-y-1 border-b border-border py-5 md:gap-x-8"
                >
                  <p className="tnum col-span-2 text-sm text-muted-foreground md:col-span-1">
                    {p.date}
                  </p>
                  <p className="col-span-10 text-base font-medium text-foreground md:col-span-5">
                    <Link
                      href={`/research/${p.slug}`}
                      className="underline underline-offset-4 decoration-1"
                    >
                      {p.title} →
                    </Link>
                  </p>
                  <p className="col-span-10 col-start-3 text-sm text-muted-foreground md:col-start-7 md:col-span-5">
                    {p.authors.join(", ")} ({p.date}). {p.title}. {p.venue}.
                  </p>
                </div>
              ))
            )}
          </div>

          <p className="kicker mt-12 text-muted-foreground">{t("articlesKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("articlesTitle")}
          </h2>
          <div className="mt-8 border-t border-border">
            {notes.length === 0 ? (
              <p className="border-b border-border py-5 text-sm text-muted-foreground">
                {t("forthcoming")}
              </p>
            ) : (
              <IndexRows items={notes} />
            )}
          </div>

          <p className="kicker mt-12 text-muted-foreground">{t("mssKicker")}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
            {t("mssTitle")}
          </h2>
          <div className="mt-8 border-t border-border">
            {drafts.length === 0 ? (
              <p className="border-b border-border py-5 text-sm text-muted-foreground">
                {t("forthcoming")}
              </p>
            ) : (
              <IndexRows items={drafts} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
