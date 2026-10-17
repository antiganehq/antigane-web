import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteManuscript, publishManuscript, saveManuscript } from "../../actions";
import { getResearch } from "../../lib";
import { AdminForm } from "../../../_components/admin-form";
import { ArticleEditor } from "../../../_components/article-editor";
import { btn, dangerBtn } from "../../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminManuscriptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { manuscripts } = await getResearch();
  const found = manuscripts.find((a) => a.slug === slug);
  if (!found) notFound();

  return (
    <div>
      <Link
        href="/admin/research/manuscripts"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Manuscripts
      </Link>
      <h1 className="mt-4 font-display text-4xl">Edit manuscript</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={saveManuscript} initial={found} submitLabel="Save" />
        <div className="mt-3 flex gap-3">
          <AdminForm action={publishManuscript}>
            <input type="hidden" name="slug" value={slug} />
            <button type="submit" className={btn}>Publish →</button>
          </AdminForm>
          <AdminForm action={deleteManuscript}>
            <input type="hidden" name="slug" value={slug} />
            <button type="submit" className={dangerBtn}>Delete manuscript</button>
          </AdminForm>
        </div>
      </div>
    </div>
  );
}
