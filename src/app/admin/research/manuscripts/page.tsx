import { deleteManuscript, publishManuscript, saveManuscript } from "../actions";
import { getResearch } from "../lib";
import { AdminForm } from "../../_components/admin-form";
import { ArticleEditor } from "../../_components/article-editor";
import { btn, dangerBtn } from "../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminManuscriptsPage() {
  const en = await getResearch("en");
  const id = await getResearch("id");

  return (
    <div>
      <p className="kicker text-muted-foreground">Research</p>
      <h1 className="mt-2 font-display text-4xl">Manuscripts</h1>
      <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        Drafts. Invisible on the public site until published to Articles.
      </p>

      {(["en", "id"] as const).map((locale) => {
        const data = locale === "en" ? en : id;
        return (
          <section key={locale} className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-2xl">Locale: {locale} ({data.manuscripts.length})</h2>
            <div className="mt-4 space-y-4">
              {data.manuscripts.map((a) => (
                <details key={a.slug} className="border border-border px-4 py-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    {a.title} <span className="text-muted-foreground">/{a.slug}</span>
                  </summary>
                  <ArticleEditor locale={locale} action={saveManuscript} initial={a} submitLabel="Save" />
                  <div className="mt-3 flex gap-3">
                    <AdminForm action={publishManuscript}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="slug" value={a.slug} />
                      <button type="submit" className={btn}>Publish →</button>
                    </AdminForm>
                    <AdminForm action={deleteManuscript}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="slug" value={a.slug} />
                      <button type="submit" className={dangerBtn}>Delete</button>
                    </AdminForm>
                  </div>
                </details>
              ))}
              <details className="border border-dashed border-border px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium">+ New manuscript</summary>
                <ArticleEditor locale={locale} action={saveManuscript} initial={null} submitLabel="Create" />
              </details>
            </div>
          </section>
        );
      })}
    </div>
  );
}
