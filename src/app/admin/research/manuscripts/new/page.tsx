import Link from "next/link";
import { saveManuscript } from "../../actions";
import { ArticleEditor } from "../../../_components/article-editor";

export const dynamic = "force-dynamic";

export default function AdminManuscriptNewPage() {
  return (
    <div>
      <Link
        href="/admin/research/manuscripts"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Manuscripts
      </Link>
      <h1 className="mt-4 font-display text-4xl">New manuscript</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={saveManuscript} initial={null} submitLabel="Create" />
      </div>
    </div>
  );
}
