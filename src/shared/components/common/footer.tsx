import Image from "next/image";
import type { ReactNode } from "react";

const linkColumns: ReadonlyArray<{
  label: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    label: "Pages",
    items: [
      { label: "Homepage", href: "/#main-content" },
      { label: "Products", href: "/#products" },
      { label: "Our Focus", href: "/#focus" },
      { label: "Research", href: "/#research" },
    ],
  },
  {
    label: "Products",
    items: [
      { label: "Peridot Vault", href: "https://peridotvault.com" },
      { label: "Peridot Wallet", href: "/#products" },
      { label: "Peridot Code", href: "/#products" },
      { label: "MainGame", href: "/#products" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "License", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer(): ReactNode {
  return (
    <section className="bg-background p-3 sm:p-4 lg:p-6">
      <div className="rounded-3xl bg-neutral-950! px-5 py-8 text-neutral-100! sm:px-8 sm:py-10 lg:px-10 lg:py-12 dark:bg-neutral-50! dark:text-neutral-900!">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
          <div>
            <a
              href="#main-content"
              className="focus-ring inline-flex items-center gap-2 rounded-sm text-sm text-neutral-100 transition-colors hover:text-white dark:text-neutral-900 dark:hover:text-black"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </a>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-12"
          >
            {linkColumns.map((column) => (
              <div key={column.label}>
                <p className="mb-5 text-sm text-neutral-500 dark:text-neutral-500">
                  {column.label}
                </p>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="focus-ring rounded-sm text-sm text-neutral-100 transition-colors hover:text-white dark:text-neutral-900 dark:hover:text-black"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:pt-px">
            <a
              href="#contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-100 transition-colors hover:border-neutral-500 dark:border-neutral-300 dark:text-neutral-900 dark:hover:border-neutral-500"
            >
              Talk to the team
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 pt-8 sm:flex-row sm:items-center lg:mt-24">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src={"/logo-white-nobg.png"}
              alt="Logo Antigane"
              className="h-5 w-5 shrink-0 dark:invert"
              aria-hidden="true"
            />
            <span className="text-lg font-semibold leading-none tracking-tight">
              Antigane
            </span>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Antigane. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
