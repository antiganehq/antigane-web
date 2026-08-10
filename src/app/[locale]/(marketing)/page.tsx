import { Showcase } from "@/features/products/components/showcase";
import Hero from "./_components/hero";
import { Reveal } from "@/shared/components/ui/reveal";
import OurFocus from "./_components/our-focus";
import { createMetadata } from "@/shared/lib/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return createMetadata({
    title: t("title"),
    description: t("description"),
  });
}

export default function Home() {
  return (
    <div>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <OurFocus />
      </Reveal>
      <Reveal>
        <Showcase />
      </Reveal>
    </div>
  );
}
