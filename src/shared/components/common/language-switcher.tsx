"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "English",
  id: "Indonesia",
};

const localeCodes: Record<string, string> = {
  en: "EN",
  id: "ID",
};

export function LanguageSwitcher({
  onSelect,
  compact = false,
  enterDelay = "0ms",
}: {
  onSelect?: () => void;
  compact?: boolean;
  enterDelay?: string;
}): ReactNode {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (next: string): void => {
    setOpen(false);
    onSelect?.();
    if (next !== locale) {
      const hash = window.location.hash;
      router.replace(`${pathname}${hash}`, { locale: next });
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        style={{ ["--enter-delay" as string]: enterDelay }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((o) => !o)}
        className={`focus-ring enter inline-flex items-center gap-1.5 rounded-full bg-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-border ${
          compact ? "py-2" : "py-2.5"
        }`}
      >
        <Globe className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        <span>{localeCodes[locale] ?? locale.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Choose language"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg"
        >
          {routing.locales.map((l) => {
            const active = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => select(l)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>{localeLabels[l] ?? l}</span>
                {active ? (
                  <Check
                    className="h-4 w-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
