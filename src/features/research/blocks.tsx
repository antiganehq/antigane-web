import type { ReactNode } from "react";
import type { BodyBlock } from "./types";

// Inline marks: **bold**, *italic*, ++underline++, [text](url).
// Nesting and escaping are intentionally unsupported — keep it simple.
export function renderInline(text: string): ReactNode[] {
  const re = /\*\*(.+?)\*\*|\+\+(.+?)\+\+|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={k++}>{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      out.push(
        <span key={k++} className="underline underline-offset-4 decoration-1">
          {m[2]}
        </span>,
      );
    } else if (m[3] !== undefined) {
      out.push(<em key={k++}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      out.push(
        <a
          key={k++}
          href={m[5]}
          target={m[5].startsWith("http") ? "_blank" : undefined}
          rel={m[5].startsWith("http") ? "noopener noreferrer" : undefined}
          className="underline underline-offset-4 decoration-1"
        >
          {m[4]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Editorial body: display serif headings, measured paragraphs, plates.
export function BlockBody({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        if (b.type === "heading") {
          const cls =
            b.level === 1
              ? "mx-auto max-w-2xl font-display text-2xl leading-tight md:text-3xl"
              : b.level === 2
                ? "mx-auto max-w-2xl font-display text-xl leading-tight md:text-2xl"
                : "mx-auto max-w-2xl font-display text-lg leading-tight md:text-xl";
          // Tags shifted two levels down: the article title owns the page
          // h1 and section labels (Abstract/Content/References) are h2, so
          // author-chosen H1 renders as h3, H2 as h4, H3 as h5. Visual
          // scale stays H1-like per level.
          const Tag = `h${b.level + 2}` as "h3" | "h4" | "h5";
          return (
            <Tag key={i} className={cls}>
              {renderInline(b.text)}
            </Tag>
          );
        }
        if (b.type === "image") {
          // Plain <img>: CMS images may be external URLs without known dimensions.
          return (
            <figure key={i} className="mx-auto max-w-4xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.alt ?? ""} loading="lazy" className="h-auto w-full" />
              {b.caption ? (
                <figcaption className="mt-2 max-w-[32ch] text-[13px] leading-snug text-muted-foreground">
                  {b.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        return (
          <p key={i} className="mx-auto max-w-2xl text-[1.125rem] leading-[1.6]">
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}
