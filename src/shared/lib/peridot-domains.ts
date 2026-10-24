/**
 * Peridot domain map — ANT-99 / ANT-117 (frontend).
 *
 * Canonical hosts (prod):
 *   wallet    → https://peridot.id
 *   api       → https://api.peridot.id
 *   docs      → https://docs.peridot.id
 *   dashboard → https://dashboard.peridot.id
 *
 * Sandbox variants prefix the host with `sandbox.`:
 *   https://sandbox.peridot.id, https://sandbox.api.peridot.id,
 *   https://sandbox.docs.peridot.id, https://sandbox.dashboard.peridot.id
 *
 * Dual-serve policy (no hard cutover): legacy production hosts stay active.
 * The frontend links to the new domains as primary but MUST NOT assume the
 * old ones are dead — keep them listed in LEGACY_* for reference and do not
 * add redirects that break old bookmarks/integrations.
 *   wallet legacy    → https://pid.peridotvault.com (+ app.pid.peridotvault.com)
 *   dashboard legacy → https://peridot.antigane.com, https://peridotvault.com
 *
 * Overrides (deploy-time, optional):
 *   NEXT_PUBLIC_WALLET_URL / NEXT_PUBLIC_API_URL /
 *   NEXT_PUBLIC_DOCS_URL / NEXT_PUBLIC_DASHBOARD_URL
 *   NEXT_PUBLIC_PERIDOT_ENV=prod|sandbox — picks the sandbox hosts when "sandbox".
 *
 * Assumption (flagged for ANT-115 spec confirmation): the "Peridot" showcase
 * product (game distribution surface) maps to the `dashboard` host, and
 * "Peridot ID" (unified identity / wallet) maps to the `wallet` host.
 */

export type PeridotEnv = "prod" | "sandbox";

export const PERIDOT_HOSTS = {
  prod: {
    wallet: "peridot.id",
    api: "api.peridot.id",
    docs: "docs.peridot.id",
    dashboard: "dashboard.peridot.id",
  },
  sandbox: {
    wallet: "sandbox.peridot.id",
    api: "sandbox.api.peridot.id",
    docs: "sandbox.docs.peridot.id",
    dashboard: "sandbox.dashboard.peridot.id",
  },
} as const;

/** Legacy production hosts — still live (dual-serve). Do not remove. */
export const LEGACY_HOSTS = {
  /** Old wallet links (pid + app subdomains observed in the wild). */
  wallet: ["pid.peridotvault.com", "app.pid.peridotvault.com"],
  /** Old dashboard / product-site links. */
  dashboard: ["peridot.antigane.com", "peridotvault.com"],
} as const;

function envOverride(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  return raw ? raw.replace(/\/$/, "") : undefined;
}

export function getPeridotEnv(): PeridotEnv {
  return process.env.NEXT_PUBLIC_PERIDOT_ENV === "sandbox" ? "sandbox" : "prod";
}

function hostUrl(host: string): string {
  return `https://${host}`;
}

export const peridotUrls = {
  get wallet(): string {
    return envOverride("NEXT_PUBLIC_WALLET_URL") ?? hostUrl(PERIDOT_HOSTS[getPeridotEnv()].wallet);
  },
  get api(): string {
    return envOverride("NEXT_PUBLIC_API_URL") ?? hostUrl(PERIDOT_HOSTS[getPeridotEnv()].api);
  },
  get docs(): string {
    return envOverride("NEXT_PUBLIC_DOCS_URL") ?? hostUrl(PERIDOT_HOSTS[getPeridotEnv()].docs);
  },
  get dashboard(): string {
    return (
      envOverride("NEXT_PUBLIC_DASHBOARD_URL") ??
      hostUrl(PERIDOT_HOSTS[getPeridotEnv()].dashboard)
    );
  },
};

/** Product → URL mapping used by showcase / detail / footer. */
export const PRODUCT_URLS = {
  /** Peridot ID detail = identity surface on the Peridot site (no internal detail page). */
  get peridotId(): string {
    return "https://peridot.antigane.com/identity";
  },
  /** Peridot ID app = wallet host. */
  get peridotIdApp(): string {
    return peridotUrls.wallet;
  },
  /** Peridot distribution surface = dashboard host (see assumption above). */
  get peridot(): string {
    return peridotUrls.dashboard;
  },
  /** Peridot detail page on the Peridot site. */
  get peridotSite(): string {
    return "https://peridot.antigane.com";
  },
  /** Peridot app = legacy product host. */
  get peridotApp(): string {
    return "https://peridotvault.com";
  },
};
