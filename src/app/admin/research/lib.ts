import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Article, Publication } from "./actions";

export type ResearchData = {
  articles: Article[];
  publications: Publication[];
  manuscripts: Article[];
};

export async function getResearch(locale: string): Promise<ResearchData> {
  const raw = await readFile(join(process.cwd(), "src", "messages", `${locale}.json`), "utf-8");
  const research = (JSON.parse(raw) as { research: ResearchData }).research;
  return {
    articles: research.articles ?? [],
    publications: research.publications ?? [],
    manuscripts: research.manuscripts ?? [],
  };
}
