import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import id from "../messages/id.json";

const messages = { en, id };

export default getRequestConfig(async ({ requestLocale }) => {
  // NOTE: next/root-params cannot be statically imported here: Turbopack
  // builds one shared root-params module for the whole app, and the
  // locale-less /admin tree leaves it empty (no `locale` export), which
  // fails the build for every route. Dynamic import defers this to
  // runtime. Consequence: marketing routes render dynamically (SSR)
  // instead of SSG while /admin lives outside [locale].
  const rootParams = (await import("next/root-params")) as {
    locale?: () => Promise<string>;
  };
  const fromParams = await rootParams.locale?.();
  // requestLocale (middleware header) is evaluated only when root params
  // have no locale, e.g. Turbopack dev serving the shared empty module.
  const requested = fromParams ?? (await requestLocale);
  if (!hasLocale(routing.locales, requested)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  if (!requested) throw new Error("Missing locale");

  return {
    locale: requested,
    messages: messages[requested as keyof typeof messages],
  };
});
