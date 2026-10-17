"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSession,
  hashPassword,
  verifyPassword,
} from "../session";
import type { BodyBlock, Reference, ResearchData, ResearchItem } from "@/features/research/types";
import type { ActionState } from "../_components/form-state";

// Research admin storage. No database, no services: saves commit the JSON
// files to git. On Vercel (read-only disk) commits go through the GitHub API
// and auto-redeploy; in local dev without GITHUB_TOKEN they write to disk.
// Required env: only GITHUB_TOKEN (contents:write). Repo coordinates are
// static consts below; auth creds live hashed in src/messages/admin.json.
// Set them with: node scripts/set-admin-pass.mjs <user> <password-4+chars>

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Static repo coordinates — change here if the repo or deploy branch moves.
const GH_OWNER = "antiganehq";
const GH_REPO = "antigane-web";
const GH_BRANCH = "dev";

function gh(): { owner: string; repo: string; branch: string; token: string } | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return { owner: GH_OWNER, repo: GH_REPO, branch: GH_BRANCH, token };
}

// Research content is locale-agnostic: one list shown in every locale.
async function readResearch(): Promise<ResearchData> {
  const raw = await readFile(join(process.cwd(), "src", "messages", "research.json"), "utf-8");
  return JSON.parse(raw) as ResearchData;
}

async function persistFile(repoPath: string, body: string, message: string): Promise<void> {
  const g = gh();
  if (!g) {
    await writeFile(join(process.cwd(), repoPath), body, "utf-8");
    return;
  }
  const headers = {
    Authorization: `Bearer ${g.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const cur = await fetch(
    `https://api.github.com/repos/${g.owner}/${g.repo}/contents/${repoPath}?ref=${g.branch}`,
    { headers },
  );
  if (!cur.ok) throw new Error(`GitHub read failed (${cur.status})`);
  const { sha } = (await cur.json()) as { sha: string };
  const put = await fetch(`https://api.github.com/repos/${g.owner}/${g.repo}/contents/${repoPath}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: Buffer.from(body).toString("base64"), sha, branch: g.branch }),
  });
  if (!put.ok) throw new Error(`GitHub write failed (${put.status})`);
}

async function saveResearch(data: ResearchData, message: string): Promise<void> {
  await persistFile(`src/messages/research.json`, `${JSON.stringify(data, null, 2)}\n`, message);
}

function parseCredentials(formData: FormData): { user: string; pass: string } {
  const user = str(formData, "user");
  const pass = str(formData, "newPass");
  const confirm = str(formData, "confirm");
  need(user, "Username");
  if (user.includes(":")) throw new Error("Username cannot contain ':'");
  need(pass, "New password");
  if (pass.length < 4) throw new Error("Password must be at least 4 characters");
  if (pass !== confirm) throw new Error("Passwords do not match");
  return { user, pass };
}

async function writeCredentials(user: string, pass: string, message: string): Promise<void> {
  const { randomBytes } = await import("node:crypto");
  const salt = randomBytes(16).toString("hex");
  await persistFile(
    "src/messages/admin.json",
    `${JSON.stringify({ user, salt, hash: hashPassword(salt, user, pass) }, null, 2)}\n`,
    message,
  );
}

export async function loginAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = str(formData, "user");
    const pass = str(formData, "password");
    need(user, "Username");
    need(pass, "Password");
    const raw = await readFile(join(process.cwd(), "src", "messages", "admin.json"), "utf-8");
    const { user: u, salt, hash } = JSON.parse(raw) as { user?: string; salt?: string; hash?: string };
    if (!u || !salt || !hash || user !== u || !verifyPassword(salt, hash, user, pass)) {
      throw new Error("Wrong username or password");
    }
    const { cookies } = await import("next/headers");
    (await cookies()).set(SESSION_COOKIE, createSession(user, salt), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: SESSION_TTL_MS / 1000,
    });
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}

function fail(e: unknown): ActionState {
  return { error: e instanceof Error ? e.message : "Something went wrong" };
}

export async function registerAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
  let current = "";
  try {
    const raw = await readFile(join(process.cwd(), "src", "messages", "admin.json"), "utf-8");
    current = (JSON.parse(raw) as { user?: string }).user ?? "";
  } catch {
    current = "";
  }
  if (current) throw new Error("Admin already registered");
  const { user, pass } = parseCredentials(formData);
  await writeCredentials(user, pass, "research: register admin");
  } catch (e) {
    return fail(e);
  }
  done("/admin/login");
}

export async function saveCredentials(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { user, pass } = parseCredentials(formData);
    await writeCredentials(user, pass, "research: rotate admin credentials");
  } catch (e) {
    return fail(e);
  }
  done("/admin/access");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function need(value: string, label: string): void {
  if (!value) throw new Error(`${label} is required`);
}

function done(path = "/admin/research"): never {
  revalidatePath("/", "layout");
  redirect(path);
}

function parseBlocks(raw: string): BodyBlock[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Body blocks are not valid JSON");
  }
  if (!Array.isArray(parsed)) throw new Error("Body must be a list of blocks");
  return parsed.map((b, i) => {
    if (typeof b !== "object" || b === null) throw new Error(`Block #${i + 1} is invalid`);
    const block = b as Record<string, unknown>;
    if (block.type === "heading") {
      if (typeof block.text !== "string" || !block.text.trim()) {
        throw new Error(`Block #${i + 1} needs text`);
      }
      if (block.level !== 1 && block.level !== 2 && block.level !== 3) {
        throw new Error(`Heading block #${i + 1} needs level 1, 2, or 3`);
      }
      return { type: "heading", level: block.level, text: block.text };
    }
    if (block.type === "paragraph") {
      if (typeof block.text !== "string" || !block.text.trim()) {
        throw new Error(`Block #${i + 1} needs text`);
      }
      return { type: "paragraph", text: block.text };
    }
    if (block.type === "image") {
      if (typeof block.src !== "string" || !block.src.trim()) {
        throw new Error(`Image block #${i + 1} needs a source URL`);
      }
      return {
        type: "image",
        src: block.src,
        caption: typeof block.caption === "string" ? block.caption : "",
        alt: typeof block.alt === "string" ? block.alt : "",
      } as BodyBlock;
    }
    throw new Error(`Block #${i + 1} has an unknown type`);
  });
}

function parseReferences(raw: string): Reference[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("References are not valid JSON");
  }
  if (!Array.isArray(parsed)) throw new Error("References must be a list");
  return parsed.map((r, i) => {
    if (typeof r !== "object" || r === null) throw new Error(`Reference #${i + 1} is invalid`);
    const ref = r as Record<string, unknown>;
    if (typeof ref.title !== "string" || !ref.title.trim()) {
      throw new Error(`Reference #${i + 1} needs a title`);
    }
    const s = (v: unknown) => (typeof v === "string" ? v : "");
    return { authors: s(ref.authors), year: s(ref.year), title: ref.title, venue: s(ref.venue), url: s(ref.url) || undefined };
  });
}

function parseItem(formData: FormData): { original: string; item: ResearchItem } {
  const original = str(formData, "original");
  const authors = str(formData, "authors").split(",").map((a) => a.trim()).filter(Boolean);
  if (authors.length === 0) throw new Error("At least one author is required");
  const item: ResearchItem = {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    authors,
    date: str(formData, "date"),
    area: str(formData, "area") || undefined,
    venue: str(formData, "venue") || undefined,
    abstract: str(formData, "abstract"),
    body: parseBlocks(str(formData, "body")),
    references: parseReferences(str(formData, "references")),
    url: str(formData, "url") || undefined,
  };
  for (const [v, l] of [
    [item.slug, "Slug"], [item.title, "Title"], [item.date, "Date"], [item.abstract, "Abstract"],
  ] as const) need(v, l);
  if (!SLUG_RE.test(item.slug)) throw new Error("Slug must be lowercase letters, numbers, dashes");
  return { original, item };
}

export async function saveArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { original, item: article } = parseItem(formData);

  const data = await readResearch();
  if (original) {
    const i = data.articles.findIndex((a) => a.slug === original);
    if (i === -1) throw new Error("Article not found");
    if (article.slug !== original && data.articles.some((a) => a.slug === article.slug)) {
      throw new Error("Slug already exists");
    }
    data.articles[i] = article;
  } else {
    if (data.articles.some((a) => a.slug === article.slug)) throw new Error("Slug already exists");
    data.articles.push(article);
  }
  await saveResearch(data, `research: save article ${article.slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}

export async function deleteArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const slug = str(formData, "slug");
    const data = await readResearch();
    data.articles = data.articles.filter((a) => a.slug !== slug);
    await saveResearch(data, `research: delete article ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}

export async function savePublication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { original, item: pub } = parseItem(formData);
    const data = await readResearch();
    if (original) {
      const i = data.publications.findIndex((p) => p.slug === original);
      if (i === -1) throw new Error("Publication not found");
      if (pub.slug !== original && data.publications.some((p) => p.slug === pub.slug)) {
        throw new Error("Slug already exists");
      }
      data.publications[i] = pub;
    } else {
      if (data.publications.some((p) => p.slug === pub.slug)) throw new Error("Slug already exists");
      data.publications.push(pub);
    }
    await saveResearch(data, `research: save publication ${pub.slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/journal");
}

export async function deletePublication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const slug = str(formData, "slug");
    const data = await readResearch();
    data.publications = data.publications.filter((p) => p.slug !== slug);
    await saveResearch(data, `research: delete publication ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/journal");
}

export async function saveManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { original, item: article } = parseItem(formData);
    const data = await readResearch();
    if (original) {
      const i = data.manuscripts.findIndex((a) => a.slug === original);
      if (i === -1) throw new Error("Manuscript not found");
      if (article.slug !== original && data.manuscripts.some((a) => a.slug === article.slug)) {
        throw new Error("Slug already exists");
      }
      data.manuscripts[i] = article;
    } else {
      if (data.manuscripts.some((a) => a.slug === article.slug)) throw new Error("Slug already exists");
      data.manuscripts.push(article);
    }
    await saveResearch(data, `research: save manuscript ${article.slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/manuscripts");
}

export async function deleteManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const slug = str(formData, "slug");
    const data = await readResearch();
    data.manuscripts = data.manuscripts.filter((a) => a.slug !== slug);
    await saveResearch(data, `research: delete manuscript ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/manuscripts");
}

export async function publishManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const slug = str(formData, "slug");
    const data = await readResearch();
    const i = data.manuscripts.findIndex((a) => a.slug === slug);
    if (i === -1) throw new Error("Manuscript not found");
    if (data.articles.some((a) => a.slug === slug)) throw new Error("Slug already exists in articles");
    const [article] = data.manuscripts.splice(i, 1);
    data.articles.push(article);
    await saveResearch(data, `research: publish manuscript ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}
