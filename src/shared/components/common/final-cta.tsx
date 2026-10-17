import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function FinalCTA(): Promise<ReactNode> {
  const t = await getTranslations("cta");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 md:col-start-2 md:col-span-6">
            <p className="kicker text-muted-foreground">{t("kicker")}</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
              {t("heading")}
            </h2>
            <Link
              href="/research"
              className="mt-6 inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
            >
              Read the research →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
