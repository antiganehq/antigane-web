import Link from "next/link";
import { saveArticle } from "../../actions";
import { ArticleEditor } from "../../../_components/article-editor";

export const dynamic = "force-dynamic";

export default function AdminArticleNewPage() {
  return (
    <div>
      <Link
        href="/admin/research/articles"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Articles
      </Link>
      <h1 className="mt-4 font-display text-4xl">New article</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={saveArticle} initial={null} submitLabel="Create" />
      </div>
    </div>
  );
}
