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

// Research admin storage. No database, no services: saves commit the JSON
// files to git. On Vercel (read-only disk) commits go through the GitHub API
// and auto-redeploy; in local dev without GITHUB_TOKEN they write to disk.
// Required env: only GITHUB_TOKEN (contents:write). Repo coordinates are
// static consts below; auth creds live hashed in src/messages/admin.json.
// Set them with: node scripts/set-admin-pass.mjs <user> <password-4+chars>

export type ActionState = { error?: string } | null;

export type Article = {
  slug: string;
  area: string;
  date: string;
  reading: string;
  title: string;
  standfirst: string;
  quote: string;
  paragraphs: string[];
};

export type Publication = {
  title: string;
  venue: string;
  year: string;
  authors: string;
  url: string;
};

type Messages = Record<string, unknown> & {
  research: { articles: Article[]; publications: Publication[]; manuscripts: Article[] };
};

const LOCALES = ["en", "id"] as const;
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

async function readMessages(locale: string): Promise<Messages> {
  const raw = await readFile(join(process.cwd(), "src", "messages", `${locale}.json`), "utf-8");
  return JSON.parse(raw) as Messages;
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

async function saveMessages(locale: string, data: Messages, message: string): Promise<void> {
  await persistFile(`src/messages/${locale}.json`, `${JSON.stringify(data, null, 2)}\n`, message);
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

function parseArticle(formData: FormData): { locale: string; original: string; article: Article } {
  const locale = str(formData, "locale");
  const original = str(formData, "original");
  if (!LOCALES.includes(locale as "en") && !LOCALES.includes(locale as "id")) throw new Error("Bad locale");
  const article: Article = {
    slug: str(formData, "slug"),
    area: str(formData, "area"),
    date: str(formData, "date"),
    reading: str(formData, "reading"),
    title: str(formData, "title"),
    standfirst: str(formData, "standfirst"),
    quote: str(formData, "quote"),
    paragraphs: str(formData, "paragraphs").split("\n").map((p) => p.trim()).filter(Boolean),
  };
  for (const [v, l] of [
    [article.slug, "Slug"], [article.area, "Area"], [article.date, "Date"],
    [article.reading, "Reading"], [article.title, "Title"],
    [article.standfirst, "Standfirst"], [article.quote, "Quote"],
  ] as const) need(v, l);
  if (!SLUG_RE.test(article.slug)) throw new Error("Slug must be lowercase letters, numbers, dashes");
  if (article.paragraphs.length === 0) throw new Error("At least one paragraph is required");
  return { locale, original, article };
}

export async function saveArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { locale, original, article } = parseArticle(formData);

  const data = await readMessages(locale);
  if (original) {
    const i = data.research.articles.findIndex((a) => a.slug === original);
    if (i === -1) throw new Error("Article not found");
    if (article.slug !== original && data.research.articles.some((a) => a.slug === article.slug)) {
      throw new Error("Slug already exists");
    }
    data.research.articles[i] = article;
  } else {
    if (data.research.articles.some((a) => a.slug === article.slug)) throw new Error("Slug already exists");
    data.research.articles.push(article);
  }
  await saveMessages(locale, data, `research(${locale}): save article ${article.slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}

export async function deleteArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const locale = str(formData, "locale");
    const slug = str(formData, "slug");
    const data = await readMessages(locale);
    data.research.articles = data.research.articles.filter((a) => a.slug !== slug);
    await saveMessages(locale, data, `research(${locale}): delete article ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}

export async function savePublication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const locale = str(formData, "locale");
  const index = Number(str(formData, "index"));
  const pub: Publication = {
    title: str(formData, "title"),
    venue: str(formData, "venue"),
    year: str(formData, "year"),
    authors: str(formData, "authors"),
    url: str(formData, "url"),
  };
  for (const [v, l] of [
    [pub.title, "Title"], [pub.venue, "Venue"], [pub.year, "Year"], [pub.authors, "Authors"],
  ] as const) need(v, l);
  const data = await readMessages(locale);
  if (Number.isInteger(index) && index >= 0 && index < data.research.publications.length) {
    data.research.publications[index] = pub;
  } else {
    data.research.publications.push(pub);
  }
  await saveMessages(locale, data, `research(${locale}): save publication ${pub.title}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/journal");
}

export async function deletePublication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const locale = str(formData, "locale");
    const index = Number(str(formData, "index"));
    const data = await readMessages(locale);
    data.research.publications = data.research.publications.filter((_, i) => i !== index);
    await saveMessages(locale, data, `research(${locale}): delete publication #${index}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/journal");
}

export async function saveManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { locale, original, article } = parseArticle(formData);
    const data = await readMessages(locale);
    if (original) {
      const i = data.research.manuscripts.findIndex((a) => a.slug === original);
      if (i === -1) throw new Error("Manuscript not found");
      if (article.slug !== original && data.research.manuscripts.some((a) => a.slug === article.slug)) {
        throw new Error("Slug already exists");
      }
      data.research.manuscripts[i] = article;
    } else {
      if (data.research.manuscripts.some((a) => a.slug === article.slug)) throw new Error("Slug already exists");
      data.research.manuscripts.push(article);
    }
    await saveMessages(locale, data, `research(${locale}): save manuscript ${article.slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/manuscripts");
}

export async function deleteManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const locale = str(formData, "locale");
    const slug = str(formData, "slug");
    const data = await readMessages(locale);
    data.research.manuscripts = data.research.manuscripts.filter((a) => a.slug !== slug);
    await saveMessages(locale, data, `research(${locale}): delete manuscript ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/manuscripts");
}

export async function publishManuscript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const locale = str(formData, "locale");
    const slug = str(formData, "slug");
    const data = await readMessages(locale);
    const i = data.research.manuscripts.findIndex((a) => a.slug === slug);
    if (i === -1) throw new Error("Manuscript not found");
    if (data.research.articles.some((a) => a.slug === slug)) throw new Error("Slug already exists in articles");
    const [article] = data.research.manuscripts.splice(i, 1);
    data.research.articles.push(article);
    await saveMessages(locale, data, `research(${locale}): publish manuscript ${slug}`);
  } catch (e) {
    return fail(e);
  }
  done("/admin/research/articles");
}
