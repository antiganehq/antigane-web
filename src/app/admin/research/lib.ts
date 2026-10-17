import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ResearchData } from "@/features/research/types";

export async function getResearch(): Promise<ResearchData> {
  const raw = await readFile(join(process.cwd(), "src", "messages", "research.json"), "utf-8");
  const data = JSON.parse(raw) as ResearchData;
  return {
    articles: data.articles ?? [],
    publications: data.publications ?? [],
    manuscripts: data.manuscripts ?? [],
  };
}
