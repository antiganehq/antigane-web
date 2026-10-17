import Link from "next/link";
import { savePublication } from "../../actions";
import { ArticleEditor } from "../../../_components/article-editor";

export const dynamic = "force-dynamic";

export default function AdminPublicationNewPage() {
  return (
    <div>
      <Link
        href="/admin/research/journal"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← Journal
      </Link>
      <h1 className="mt-4 font-display text-4xl">New publication</h1>

      <div className="mt-8 border-t border-border pt-8">
        <ArticleEditor action={savePublication} initial={null} submitLabel="Create" />
      </div>
    </div>
  );
}
