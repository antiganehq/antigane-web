import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { deleteArticle, deletePublication, saveArticle, saveCredentials, savePublication } from "./actions";
import type { Article, Publication } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const label = "mb-1 block text-[13px] text-muted-foreground";
const btn =
  "inline-block border border-foreground bg-foreground px-4 py-2 text-sm text-background";
const dangerBtn =
  "inline-block border border-border px-4 py-2 text-sm text-foreground";

async function getResearch(locale: string): Promise<{ articles: Article[]; publications: Publication[] }> {
  const raw = await readFile(join(process.cwd(), "src", "messages", `${locale}.json`), "utf-8");
  return (JSON.parse(raw) as { research: { articles: Article[]; publications: Publication[] } }).research;
}

function Field({ name, label: text, value = "", placeholder = "", type = "text" }: { name: string; label: string; value?: string; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className={label}>{text}</span>
      <input name={name} type={type} defaultValue={value} placeholder={placeholder} className={input} autoComplete="off" />
    </label>
  );
}

export default async function AdminResearchPage() {
  const en = await getResearch("en");
  const id = await getResearch("id");
  const savesToGitHub = Boolean(process.env.GITHUB_TOKEN);
  let currentUser = "";
  try {
    const raw = await readFile(join(process.cwd(), "src", "messages", "admin.json"), "utf-8");
    currentUser = (JSON.parse(raw) as { user?: string }).user ?? "";
  } catch {
    currentUser = "";
  }

  return (
    <div className="mx-auto max-w-[960px] px-6 py-12">
      <p className="kicker text-muted-foreground">Admin</p>
      <h1 className="mt-2 font-display text-4xl">Research content</h1>
      <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        {savesToGitHub
          ? "Saving commits to git — the live site rebuilds in about 1–2 minutes."
          : "Saving writes to disk (local dev only — set GITHUB_* env for durable saves)."}
      </p>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-2xl">Access</h2>
        <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
          Signed in as <span className="text-foreground">{currentUser || "(not set)"}</span>.
          Saving new credentials rebuilds the site — your saved login stops working and the login box returns.
        </p>
        <form action={saveCredentials} className="mt-4 max-w-md space-y-3">
          <Field name="user" label="Username" value={currentUser} />
          <Field name="newPass" label="New password (min 16 characters)" type="password" />
          <Field name="confirm" label="Confirm new password" type="password" />
          <button type="submit" className={btn}>Rotate credentials</button>
        </form>
      </section>

      {(["en", "id"] as const).map((locale) => {
        const data = locale === "en" ? en : id;
        return (
          <section key={locale} className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-2xl">Locale: {locale}</h2>

            <h3 className="kicker mt-8 text-muted-foreground">Articles ({data.articles.length})</h3>
            <div className="mt-4 space-y-4">
              {data.articles.map((a) => (
                <details key={a.slug} className="border border-border px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    {a.title} <span className="text-muted-foreground">/{a.slug}</span>
                  </summary>
                  <form action={saveArticle} className="mt-4 space-y-3">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="original" value={a.slug} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field name="slug" label="Slug" value={a.slug} />
                      <Field name="area" label="Area" value={a.area} />
                      <Field name="date" label="Date" value={a.date} />
                      <Field name="reading" label="Reading" value={a.reading} />
                    </div>
                    <Field name="title" label="Title" value={a.title} />
                    <Field name="standfirst" label="Standfirst" value={a.standfirst} />
                    <Field name="quote" label="Pull quote" value={a.quote} />
                    <label className="block">
                      <span className={label}>Paragraphs (one per line)</span>
                      <textarea name="paragraphs" rows={8} defaultValue={a.paragraphs.join("\n")} className={input} />
                    </label>
                    <div className="flex gap-3">
                      <button type="submit" className={btn}>Save</button>
                    </div>
                  </form>
                  <form action={deleteArticle} className="mt-3">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="slug" value={a.slug} />
                    <button type="submit" className={dangerBtn}>Delete article</button>
                  </form>
                </details>
              ))}
              <details className="border border-dashed border-border px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium">+ New article</summary>
                <form action={saveArticle} className="mt-4 space-y-3">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="original" value="" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field name="slug" label="Slug" placeholder="my-new-study" />
                    <Field name="area" label="Area" placeholder="Game" />
                    <Field name="date" label="Date" placeholder="Apr 2026" />
                    <Field name="reading" label="Reading" placeholder="5 min read" />
                  </div>
                  <Field name="title" label="Title" />
                  <Field name="standfirst" label="Standfirst" />
                  <Field name="quote" label="Pull quote" />
                  <label className="block">
                    <span className={label}>Paragraphs (one per line)</span>
                    <textarea name="paragraphs" rows={8} className={input} />
                  </label>
                  <button type="submit" className={btn}>Create</button>
                </form>
              </details>
            </div>

            <h3 className="kicker mt-10 text-muted-foreground">Publications ({data.publications.length})</h3>
            <div className="mt-4 space-y-4">
              {data.publications.map((p, i) => (
                <form key={`${p.title}-${i}`} action={savePublication} className="space-y-3 border border-border px-4 py-3">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="index" value={String(i)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field name="title" label="Title" value={p.title} />
                    <Field name="venue" label="Venue" value={p.venue} />
                    <Field name="year" label="Year" value={p.year} />
                    <Field name="authors" label="Authors" value={p.authors} />
                  </div>
                  <Field name="url" label="URL (empty = plain row)" value={p.url} />
                  <div className="flex gap-3">
                    <button type="submit" formAction={savePublication} className={btn}>Save</button>
                    <button type="submit" formAction={deletePublication} className={dangerBtn}>Delete</button>
                  </div>
                </form>
              ))}
              <details className="border border-dashed border-border px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium">+ New publication</summary>
                <form action={savePublication} className="mt-4 space-y-3">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="index" value="-1" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field name="title" label="Title" />
                    <Field name="venue" label="Venue" />
                    <Field name="year" label="Year" />
                    <Field name="authors" label="Authors" />
                  </div>
                  <Field name="url" label="URL (empty = plain row)" />
                  <button type="submit" className={btn}>Create</button>
                </form>
              </details>
            </div>
          </section>
        );
      })}
    </div>
  );
}
