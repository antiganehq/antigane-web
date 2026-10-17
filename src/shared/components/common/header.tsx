"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

function Logo(): ReactNode {
  const t = useTranslations("header");

  return (
    <Link
      href="/"
      className="focus-ring inline-flex items-center gap-2 rounded-sm text-foreground"
      aria-label={t("logoAria")}
    >
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
    </Link>
  );
}

export function Header(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("header");

  const primaryLinks = [
    { label: t("nav.products"), href: "/#products" },
    { label: t("nav.focus"), href: "/#focus" },
    { label: t("nav.research"), href: "/research" },
  ];

  const mobileLinks = [{ label: t("homepage"), href: "/" }, ...primaryLinks];

  const utilityLinks = [
    { label: t("license"), href: "#license" },
    { label: t("security"), href: "#security" },
    { label: t("privacy"), href: "#privacy" },
    { label: t("terms"), href: "#terms" },
  ];

  const closeMenu = (): void => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("nav-open");

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("nav-open");
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Logo />

        <nav className="hidden lg:ml-12 lg:flex lg:items-center lg:gap-6" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring text-[13px] font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <LanguageSwitcher enterDelay="0ms" />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <LanguageSwitcher enterDelay="0ms" compact onSelect={closeMenu} />
          <button
            type="button"
            className="focus-ring inline-flex h-10 items-center justify-center border border-border px-3 text-sm text-foreground"
            aria-label={
              isOpen ? t("menu.close") : t("menu.open")
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-16 z-40 min-h-[calc(100dvh-4rem)] border-t border-border bg-background transition-[opacity,visibility] duration-200 sm:top-20 sm:min-h-[calc(100dvh-5rem)] lg:hidden ${
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="min-h-[calc(100dvh-4rem)] px-4 pt-16 sm:min-h-[calc(100dvh-5rem)] sm:px-6 sm:pt-20">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-2">
              {mobileLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring block rounded-lg text-4xl font-normal leading-tight tracking-[-0.04em] text-foreground transition-colors hover:text-muted-foreground sm:text-5xl"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 flex flex-col items-start gap-2 pb-10">
            <p className="text-base font-medium tracking-[-0.02em] text-muted-foreground">
              {t("desk")}
            </p>
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-md text-base font-normal text-foreground transition-colors hover:text-muted-foreground"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
