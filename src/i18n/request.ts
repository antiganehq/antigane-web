import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../messages/en.json";
import id from "../messages/id.json";

const messages = { en, id };

export default getRequestConfig(async () => {
  const paramValue = await rootParams.locale();
  if (!hasLocale(routing.locales, paramValue)) notFound();

  return {
    locale: paramValue,
    messages: messages[paramValue as keyof typeof messages],
  };
});
