import { deletePublication, savePublication } from "../actions";
import { getResearch } from "../lib";
import { AdminForm } from "../../_components/admin-form";
import { Field, btn, dangerBtn } from "../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const en = await getResearch("en");
  const id = await getResearch("id");

  return (
    <div>
      <p className="kicker text-muted-foreground">Research</p>
      <h1 className="mt-2 font-display text-4xl">Journal</h1>
      <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        Journal publications on the public research record.
      </p>

      {(["en", "id"] as const).map((locale) => {
        const data = locale === "en" ? en : id;
        return (
          <section key={locale} className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-2xl">Locale: {locale} ({data.publications.length})</h2>
            <div className="mt-4 space-y-4">
              {data.publications.map((p, i) => (
                <div key={`${p.title}-${i}`}>
                  <AdminForm action={savePublication} className="space-y-3 border border-border px-4 py-3">
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
                      <button type="submit" className={btn}>Save</button>
                    </div>
                  </AdminForm>
                  <AdminForm action={deletePublication} className="mt-3">
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="index" value={String(i)} />
                    <button type="submit" className={dangerBtn}>Delete</button>
                  </AdminForm>
                </div>
              ))}
              <details className="border border-dashed border-border px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium">+ New publication</summary>
                <AdminForm action={savePublication} className="mt-4 space-y-3">
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
                </AdminForm>
              </details>
            </div>
          </section>
        );
      })}
    </div>
  );
}
