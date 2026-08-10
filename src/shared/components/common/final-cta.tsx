import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { DitherShader } from "../dither-shader";

export async function FinalCTA(): Promise<ReactNode> {
  const t = await getTranslations("cta");

  return (
    <section className="bg-background p-6 sm:p-10 lg:p-14">
      <div className="overflow-hidden rounded-3xl border border-border bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div className="flex min-h-80 flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:border-r lg:border-neutral-200 lg:px-14 lg:py-20 dark:lg:border-neutral-800">
            <h2 className="max-w-md text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.5rem]">
              {t("heading")}
            </h2>
          </div>

          <div className="relative min-h-80 p-2 lg:min-h-90">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <DitherShader variant="cta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
