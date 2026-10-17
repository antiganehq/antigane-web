import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle, saveArticle } from "../../actions";
import { getResearch } from "../../lib";
import { AdminForm } from "../../../_components/admin-form";
import { ArticleEditor } from "../../../_components/article-editor";
import { dangerBtn } from "../../../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articles } = await getResearch();
  const found = articles.find((a) => a.slug === slug);
  if (!found) notFound();

  return (
    <div>
      <Link
        href="/admin/research/articles"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Articles
      </Link>
      <h1 className="mt-4 font-display text-4xl">Edit article</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={saveArticle} initial={found} submitLabel="Save" />
        <AdminForm action={deleteArticle} className="mt-3">
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className={dangerBtn}>Delete article</button>
        </AdminForm>
      </div>
    </div>
  );
}
