import Link from "next/link";
import { deletePublication } from "../actions";
import { getResearch } from "../lib";
import { AdminForm } from "../../_components/admin-form";
import { btn } from "../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const { publications } = await getResearch();

  return (
    <div>
      <p className="kicker text-muted-foreground">Research</p>
      <h1 className="mt-2 font-display text-4xl">Journal</h1>
      <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        Journal publications on the public research record — in every locale. Click a title
        to edit.
      </p>
      <Link href="/admin/research/journal/new" className={`${btn} mt-6`}>
        + New publication
      </Link>

      <div className="mt-8 border-t border-border">
        {publications.map((p) => (
          <div
            key={p.slug}
            className="grid grid-cols-12 items-center gap-x-4 gap-y-1 border-b border-border py-3"
          >
            <p className="col-span-12 text-sm font-medium md:col-span-6">
              <Link
                href={`/admin/research/journal/${p.slug}`}
                className="underline-offset-4 hover:underline"
              >
                {p.title}
              </Link>{" "}
              <span className="text-muted-foreground">/{p.slug}</span>
            </p>
            <p className="col-span-6 text-[13px] text-muted-foreground md:col-span-4">
              {p.venue} · {p.date}
            </p>
            <div className="col-span-6 flex items-center justify-end gap-3 md:col-span-2">
              <Link
                href={`/admin/research/journal/${p.slug}`}
                className="text-sm text-foreground underline underline-offset-4 decoration-1"
              >
                Edit
              </Link>
              <AdminForm action={deletePublication}>
                <input type="hidden" name="slug" value={p.slug} />
                <button type="submit" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Delete
                </button>
              </AdminForm>
            </div>
          </div>
        ))}
        {publications.length === 0 ? (
          <p className="border-b border-border py-5 text-sm text-muted-foreground">Empty.</p>
        ) : null}
      </div>
    </div>
  );
}
