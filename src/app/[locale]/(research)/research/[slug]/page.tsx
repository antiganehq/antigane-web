import { createMetadata } from "@/shared/lib/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import researchContent from "@/messages/research.json";
import { BlockBody } from "@/features/research/blocks";
import type { ResearchItem } from "@/features/research/types";

const articles = researchContent.articles as ResearchItem[];

function getArticle(slug: string): ResearchItem | null {
  // Locale-agnostic: articles, then manuscripts, then publications.
  const lists = [researchContent.articles, researchContent.manuscripts, researchContent.publications];
  for (const list of lists) {
    const hit = (list as ResearchItem[]).find((a) => a.slug === slug);
    if (hit) return hit;
  }
  return null;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    articles.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return createMetadata({
    title: article.title,
    description: article.abstract,
    path: `/research/${slug}`,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "research" });
  const article = getArticle(slug);
  if (!article) notFound();

  const idx = articles.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx >= 0 && idx < articles.length - 1 ? articles[idx + 1] : null;
  const authors = article.authors.join(", ");
  const reference = `${authors} (${article.date}). ${article.title}.${article.venue ? ` ${article.venue}.` : ""}`;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <p className="kicker flex items-center gap-3 text-muted-foreground">
            <span aria-hidden="true" className="inline-block h-px w-12 bg-foreground" />
            {t("kicker")}
            {article.area ? ` — ${article.area}` : ""}
          </p>
          <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <h1 className="col-span-12 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em] md:col-start-1 md:col-span-9">
              {article.title}
            </h1>
            <p className="col-span-12 mt-6 text-base font-medium text-foreground md:col-start-1 md:col-span-6">
              {authors}
            </p>
            <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
              <p>{article.date}</p>
              {article.venue ? <p className="mt-1">{article.venue}</p> : null}
              {article.area ? <p className="mt-1">{article.area}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
            <div className="col-span-12">
              <div className="mx-auto max-w-2xl">
                <h2 className="font-display text-3xl leading-tight md:text-4xl">{t("meta.abstractLabel")}</h2>
                <p className="mt-4 border-l border-border pl-4 text-[1.125rem] leading-[1.6] text-foreground">
                  {article.abstract}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <div className="col-span-12">
              <div className="mx-auto max-w-2xl">
                <h2 className="font-display text-3xl leading-tight md:text-4xl">{t("meta.bodyLabel")}</h2>
              </div>
              <div className="mt-4">
                <BlockBody blocks={article.body} />
              </div>
            </div>
          </div>
          {article.references.length > 0 ? (
            <div className="mt-12 grid grid-cols-12 gap-x-6 md:gap-x-8">
              <div className="col-span-12">
                <div className="mx-auto max-w-2xl">
                  <h2 className="font-display text-3xl leading-tight md:text-4xl">{t("meta.referenceLabel")}</h2>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-[1.125rem] leading-[1.6] text-foreground">
                  {article.references.map((r, i) => (
                    <li key={i}>
                      {r.authors} ({r.year}). {r.title}. {r.venue}.{" "}
                      {r.url ? (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground underline underline-offset-4 decoration-1"
                        >
                          {r.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ol>
                </div>
              </div>
            </div>
          ) : null}
          <nav
            aria-label="More research"
            className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-6"
          >
            <div>
              {prev ? (
                <Link
                  href={`/research/${prev.slug}`}
                  className="text-sm text-foreground underline underline-offset-4 decoration-1"
                >
                  ← {prev.title}
                </Link>
              ) : null}
            </div>
            <div className="text-right">
              {next ? (
                <Link
                  href={`/research/${next.slug}`}
                  className="text-sm text-foreground underline underline-offset-4 decoration-1"
                >
                  {next.title} →
                </Link>
              ) : (
                <Link
                  href="/research"
                  className="text-sm text-foreground underline underline-offset-4 decoration-1"
                >
                  Index ↑
                </Link>
              )}
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
