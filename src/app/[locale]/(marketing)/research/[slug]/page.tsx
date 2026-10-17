import { createMetadata } from "@/shared/lib/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

// shortcut: slugs duplicated here for generateStaticParams; migrate to MDX/CMS past ~10 articles.
const SLUGS = [
  "player-led-distribution",
  "one-identity-across-worlds",
  "creators-as-growth",
] as const;

type Article = {
  slug: string;
  area: string;
  authors: string[];
  date: string;
  reading: string;
  title: string;
  standfirst: string;
  quote: string;
  paragraphs: string[];
  referenceUrl?: string;
};

type Pub = {
  slug?: string;
  title: string;
  venue: string;
  year: string;
  authors: string[];
  url: string;
  reference?: string;
  abstract?: string;
  body?: string[];
};

async function getArticle(locale: string, slug: string): Promise<Article | null> {
  const t = await getTranslations({ locale, namespace: "research" });
  const articles = t.raw("articles") as Article[];
  const hit = articles.find((a) => a.slug === slug);
  if (hit) return hit;
  // shortcut: pubs need slug + abstract/body for a full detail page; citation-only pubs stay index-only.
  const pubs = (t.raw("publications") as Pub[] | undefined) ?? [];
  const pub = pubs.find((p) => p.slug === slug);
  if (!pub) return null;
  return {
    slug,
    area: pub.venue,
    authors: pub.authors,
    date: pub.year,
    reading: "",
    title: pub.title,
    standfirst: pub.abstract ?? "",
    quote: "",
    paragraphs: pub.body ?? [],
  };
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) return {};

  return createMetadata({
    title: article.title,
    description: article.standfirst,
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
  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const articles = t.raw("articles") as Article[];
  const idx = articles.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx >= 0 && idx < articles.length - 1 ? articles[idx + 1] : null;
  const authors = article.authors.join(", ");
  // shortcut: reference derived from existing fields; add per-article citation field when DOIs/venues arrive.
  const reference = `${authors} (${article.date}). ${article.title}. ${t("kicker")} — ${article.area}.`;

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <div>
            <p className="kicker text-muted-foreground">{t("meta.referenceLabel")}</p>
            {/* shortcut: set per-article referenceUrl (e.g. DOI) to make the citation clickable. */}
            <p className="tnum mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {article.referenceUrl ? (
                <a
                  href={article.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-1"
                >
                  {reference}
                </a>
              ) : (
                reference
              )}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
            <h1 className="col-span-12 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em] md:col-start-1 md:col-span-9">
              {article.title}
            </h1>
            <p className="col-span-12 mt-6 text-base font-medium text-foreground md:col-start-1 md:col-span-6">
              {authors}
            </p>
            <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
              <p>{article.date}</p>
              <p className="mt-1">{article.area}</p>
              {article.reading ? <p className="mt-1">{article.reading}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          {article.standfirst ? (
            <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
              <div className="col-span-12 md:col-start-2 md:col-span-6">
                <p className="kicker text-muted-foreground">{t("meta.abstractLabel")}</p>
                <p className="mt-4 max-w-[66ch] border-l border-border pl-4 text-[1.125rem] leading-[1.6] text-muted-foreground">
                  {article.standfirst}
                </p>
              </div>
            </div>
          ) : null}
          {article.paragraphs.length > 0 ? (
            <div className="mt-12 grid grid-cols-12 gap-x-6 md:gap-x-8">
              <div className="col-span-12 md:col-start-2 md:col-span-6">
                <p className="kicker text-muted-foreground">{t("meta.bodyLabel")}</p>
                <div className="mt-4 space-y-6">
                  {article.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="max-w-[66ch] text-[1.125rem] leading-[1.6] text-foreground"
                    >
                      {p}
                    </p>
                  ))}
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
