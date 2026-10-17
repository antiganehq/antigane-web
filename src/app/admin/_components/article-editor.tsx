import { AdminForm, type AdminAction } from "./admin-form";
import { Field, btn, input, label } from "./ui";
import type { Article } from "../research/actions";

// Shared create/edit form for articles and manuscripts (identical shape).
export function ArticleEditor({
  locale,
  action,
  initial,
  submitLabel,
  formClassName = "mt-4 space-y-3",
}: {
  locale: string;
  action: AdminAction;
  initial: Article | null;
  submitLabel: string;
  formClassName?: string;
}) {
  return (
    <AdminForm action={action} className={formClassName}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="original" value={initial?.slug ?? ""} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="slug" label="Slug" value={initial?.slug} placeholder="my-new-study" />
        <Field name="area" label="Area" value={initial?.area} placeholder="Game" />
        <Field name="date" label="Date" value={initial?.date} placeholder="Apr 2026" />
        <Field name="reading" label="Reading" value={initial?.reading} placeholder="5 min read" />
      </div>
      <Field name="title" label="Title" value={initial?.title} />
      <Field name="standfirst" label="Standfirst" value={initial?.standfirst} />
      <Field name="quote" label="Pull quote" value={initial?.quote} />
      <label className="block">
        <span className={label}>Paragraphs (one per line)</span>
        <textarea
          name="paragraphs"
          rows={8}
          defaultValue={initial?.paragraphs.join("\n")}
          className={input}
        />
      </label>
      <div className="flex gap-3">
        <button type="submit" className={btn}>{submitLabel}</button>
      </div>
    </AdminForm>
  );
}
