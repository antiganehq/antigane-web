"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS: ReadonlyArray<{
  label: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    label: "Research",
    links: [
      { href: "/admin/research/manuscripts", label: "Manuscripts" },
      { href: "/admin/research/articles", label: "Articles" },
      { href: "/admin/research/journal", label: "Journal" },
    ],
  },
  {
    label: "System",
    links: [{ href: "/admin/access", label: "Access" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="w-full shrink-0 border-b border-border py-6 pr-0 md:w-60 md:border-b-0 md:border-r md:py-12 md:pr-8">
      <p className="kicker text-muted-foreground">Antigane CMS</p>
      <div className="mt-6 space-y-6">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="kicker text-muted-foreground">{group.label}</p>
            <ul className="mt-3 space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block border-l px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-foreground font-medium text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-2 border-t border-border pt-4 text-sm">
        <a href="/" className="block text-muted-foreground transition-colors hover:text-foreground">
          ← Back to site
        </a>
        <a
          href="/admin/logout"
          className="block text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </a>
      </div>
    </nav>
  );
}
