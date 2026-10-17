import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import id from "../messages/id.json";

const messages = { en, id };

export default getRequestConfig(async () => {
  // Static import would break the /admin tree: next/root-params only
  // exposes `locale` under [locale], so its generated module is empty
  // elsewhere and Turbopack fails the build. Dynamic import defers this
  // to runtime, where this config only ever runs for [locale] routes.
  const rootParams = (await import("next/root-params")) as {
    locale?: () => Promise<string>;
  };
  const paramValue = await rootParams.locale?.();
  if (!hasLocale(routing.locales, paramValue)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }
  if (!paramValue) throw new Error("Missing locale");

  return {
    locale: paramValue,
    messages: messages[paramValue as keyof typeof messages],
  };
});
