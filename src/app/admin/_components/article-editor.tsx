import { AdminForm } from "./admin-form";
import type { AdminAction } from "./form-state";
import { BodyEditor } from "./body-editor";
import { RefEditor } from "./ref-editor";
import { Field, btn, input, label } from "./ui";
import type { ResearchItem } from "../../../features/research/types";

// Shared create/edit form for articles, manuscripts, and publications
// (identical journal-style shape).
export function ArticleEditor({
  action,
  initial,
  submitLabel,
  formClassName = "mt-4 space-y-3",
}: {
  action: AdminAction;
  initial: ResearchItem | null;
  submitLabel: string;
  formClassName?: string;
}) {
  return (
    <AdminForm action={action} className={formClassName}>
      <input type="hidden" name="original" value={initial?.slug ?? ""} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="slug" label="Slug" value={initial?.slug} placeholder="my-new-study" />
        <Field name="title" label="Title" value={initial?.title} />
        <Field name="authors" label="Authors (comma separated)" value={initial?.authors.join(", ")} />
        <Field name="date" label="Date" value={initial?.date} placeholder="Apr 2026" />
        <Field name="area" label="Area (optional)" value={initial?.area} placeholder="Game" />
        <Field name="venue" label="Venue (optional)" value={initial?.venue} />
      </div>
      <Field name="url" label="External URL (optional, e.g. DOI)" value={initial?.url} />
      <label className="block">
        <span className={label}>Abstract</span>
        <textarea name="abstract" rows={4} defaultValue={initial?.abstract} className={input} />
      </label>
      <BodyEditor initial={initial?.body ?? []} />
      <RefEditor initial={initial?.references ?? []} />
      <div className="flex gap-3 pt-2">
        <button type="submit" className={btn}>{submitLabel}</button>
      </div>
    </AdminForm>
  );
}
