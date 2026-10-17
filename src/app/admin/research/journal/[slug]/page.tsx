import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePublication, savePublication } from "../../actions";
import { getResearch } from "../../lib";
import { AdminForm } from "../../../_components/admin-form";
import { ArticleEditor } from "../../../_components/article-editor";
import { dangerBtn } from "../../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { publications } = await getResearch();
  const found = publications.find((p) => p.slug === slug);
  if (!found) notFound();

  return (
    <div>
      <Link
        href="/admin/research/journal"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Journal
      </Link>
      <h1 className="mt-4 font-display text-4xl">Edit publication</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={savePublication} initial={found} submitLabel="Save" />
        <AdminForm action={deletePublication} className="mt-3">
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className={dangerBtn}>Delete</button>
        </AdminForm>
      </div>
    </div>
  );
}
