import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type LinkColumn = {
  label: string;
  items: ReadonlyArray<{ label: string; href: string }>;
};

export async function Footer(): Promise<ReactNode> {
  const t = await getTranslations("footer");
  const pt = await getTranslations("products");

  const linkColumns: ReadonlyArray<LinkColumn> = [
    {
      label: t("pages"),
      items: [
        { label: t("homepage"), href: "/" },
        { label: t("products"), href: "/#products" },
        { label: t("focus"), href: "/#focus" },
        { label: t("research"), href: "/research" },
      ],
    },
    {
      label: t("products"),
      items: [
        { label: pt("peridot.title"), href: "https://peridotvault.com" },
        {
          label: pt("peridotId.title"),
          href: "https://pid.peridotvault.com",
        },
        { label: pt("live2dev.title"), href: "https://live2dev.com" },
      ],
    },
    {
      label: t("company"),
      items: [
        { label: t("about"), href: "#" },
        { label: t("blog"), href: "#" },
        { label: t("careers"), href: "#" },
        { label: t("license"), href: "#" },
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
        <div className="h-px w-full bg-border" aria-hidden="true" />
        <div className="mt-8 grid grid-cols-12 gap-x-6 gap-y-10 md:gap-x-8">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-2">
              <Image
                width={20}
                height={20}
                src={"/logo-white-nobg.png"}
                alt="Logo Antigane"
                className="h-5 w-5 shrink-0 invert dark:invert-0"
                aria-hidden="true"
              />
              <span className="font-display text-lg leading-none tracking-tight">
                Antigane
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              PT Antigane Labs Indonesia
            </p>
            <Link
              href="#main-content"
              className="mt-4 inline-block text-[13px] text-foreground underline underline-offset-4 decoration-1"
            >
              {t("backToTop")} ↑
            </Link>
          </div>
          <nav
            aria-label="Footer"
            className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-7"
          >
            {linkColumns.map((column) => (
              <div key={column.label}>
                <p className="kicker text-muted-foreground">{column.label}</p>
                <ul className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith("http") || item.href.startsWith("#") ? (
                        <a
                          href={item.href}
                          className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="col-span-12 md:col-span-2">
            <a
              href="#contact"
              className="inline-block text-sm text-foreground underline underline-offset-4 decoration-1"
            >
              {t("talkToTeam")} →
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="kicker text-muted-foreground">Indonesia — Games · Blockchain · AI</p>
        </div>
      </div>
    </footer>
  );
}
