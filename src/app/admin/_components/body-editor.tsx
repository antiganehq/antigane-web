"use client";

import { useRef, useState } from "react";
import { dangerBtn, input, label } from "./ui";
import type { BodyBlock } from "../../../features/research/types";

// Reader-like canvas: blocks look like the published article — big serif
// headings, reading paragraphs, rendered images. Click any text to edit it
// in place; controls appear on hover (desktop) or focus (touch).
// Serialized to the hidden `body` field; validation unchanged.
export function BodyEditor({ initial }: { initial: BodyBlock[] }) {
  const [blocks, setBlocks] = useState<BodyBlock[]>(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const droppedRef = useRef(false);

  const patch = (i: number, b: BodyBlock) =>
    setBlocks((bs) => bs.map((x, j) => (j === i ? b : x)));

  const move = (from: number, to: number) =>
    setBlocks((bs) => {
      if (to < 0 || to >= bs.length || to === from) return bs;
      const next = bs.filter((_, j) => j !== from);
      next.splice(to, 0, bs[from]);
      return next;
    });

  const drop = () => {
    // onDrop and onDragEnd fire for one gesture with the same stale state —
    // execute the move exactly once.
    if (droppedRef.current) return;
    droppedRef.current = true;
    if (dragIndex !== null && dropIndex !== null)
      move(dragIndex, dropIndex > dragIndex ? dropIndex - 1 : dropIndex);
    setDragIndex(null);
    setDropIndex(null);
  };

  const add = (type: BodyBlock["type"]) =>
    setBlocks((bs) => [
      ...bs,
      type === "image"
        ? { type, src: "", caption: "", alt: "" }
        : type === "heading"
          ? { type, level: 2, text: "" }
          : { type, text: "" },
    ]);

  const remove = (i: number) => setBlocks((bs) => bs.filter((_, j) => j !== i));

  const switchType = (i: number, to: "paragraph" | "heading") => {
    const b = blocks[i];
    if (b.type !== "paragraph" && b.type !== "heading") return;
    patch(
      i,
      to === "heading" ? { type: "heading", level: 2, text: b.text } : { type: "paragraph", text: b.text },
    );
  };

  const words = blocks.reduce((n, b) => {
    if (b.type === "image") return n;
    return n + b.text.split(/\s+/).filter(Boolean).length;
  }, 0);

  return (
    <div>
      <span className={label}>
        Body — {blocks.length} blocks · {words} words · click text to edit, drag ⠿⋮ to reorder
      </span>
      <input type="hidden" name="body" value={JSON.stringify(blocks)} readOnly />
      <div className="mt-2 space-y-7 border-t border-border pt-6">
        {dropIndex === 0 ? <DropLine /> : null}
        {blocks.map((b, i) => (
          <div key={i}>
            <div
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setDropIndex(e.clientY > rect.top + rect.height / 2 ? i + 1 : i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop();
              }}
              className={`group relative ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="mb-1 flex items-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <span
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    droppedRef.current = false;
                    setDragIndex(i);
                  }}
                  onDragEnd={drop}
                  title="Drag to reorder"
                  aria-label={`Drag block ${i + 1} to reorder`}
                  className="cursor-grab touch-none select-none text-sm leading-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                >
                  ⠿⋮
                </span>
                <span className="text-[13px] capitalize text-muted-foreground">
                  {b.type === "heading" ? `Heading ${b.level}` : b.type} · {i + 1}/{blocks.length}
                </span>
                <span className="ml-auto flex gap-2">
                  {b.type === "paragraph" || b.type === "heading" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => switchType(i, "paragraph")}
                        aria-pressed={b.type === "paragraph"}
                        className={`text-[13px] underline-offset-4 hover:underline ${
                          b.type === "paragraph" ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        Text
                      </button>
                      <button
                        type="button"
                        onClick={() => switchType(i, "heading")}
                        aria-pressed={b.type === "heading"}
                        className={`text-[13px] underline-offset-4 hover:underline ${
                          b.type === "heading" ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        Heading
                      </button>
                      {b.type === "heading" ? (
                        <span className="flex gap-1" role="group" aria-label="Heading level">
                          {([1, 2, 3] as const).map((lv) => (
                            <button
                              key={lv}
                              type="button"
                              onClick={() => patch(i, { ...b, level: lv })}
                              aria-pressed={b.level === lv}
                              className={`text-[13px] underline-offset-4 hover:underline ${
                                b.level === lv ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              H{lv}
                            </button>
                          ))}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                  <button type="button" onClick={() => move(i, i - 1)} aria-label="Move up" className="text-[13px] text-muted-foreground hover:text-foreground">↑</button>
                  <button type="button" onClick={() => move(i, i + 1)} aria-label="Move down" className="text-[13px] text-muted-foreground hover:text-foreground">↓</button>
                  <button type="button" onClick={() => remove(i)} aria-label="Remove block" className="text-[13px] text-muted-foreground hover:text-foreground">✕</button>
                </span>
              </div>

              {b.type === "heading" ? (
                <AutoTextarea
                  value={b.text}
                  onChange={(v) => patch(i, { ...b, text: v })}
                  placeholder="Heading — click to write"
                  className={
                    b.level === 1
                      ? "mx-auto max-w-2xl font-display text-2xl leading-tight md:text-3xl"
                      : b.level === 2
                        ? "mx-auto max-w-2xl font-display text-xl leading-tight md:text-2xl"
                        : "mx-auto max-w-2xl font-display text-lg leading-tight md:text-xl"
                  }
                />
              ) : b.type === "paragraph" ? (
                <AutoTextarea
                  value={b.text}
                  onChange={(v) => patch(i, { ...b, text: v })}
                  placeholder="Paragraph — click to write"
                  className="mx-auto max-w-2xl text-[1.125rem] leading-[1.6]"
                />
              ) : (
                <figure className="mx-auto max-w-4xl">
                  {b.src ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.src}
                        alt={b.alt ?? ""}
                        loading="lazy"
                        className="h-auto w-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <figcaption className="mt-2 max-w-[32ch] text-[13px] leading-snug text-muted-foreground">
                        {b.caption || "Untitled image — set a caption below"}
                      </figcaption>
                    </>
                  ) : (
                    <p className="border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                      No image yet — paste a URL below
                    </p>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
                      Image settings
                    </summary>
                    <div className="mt-2 space-y-2">
                      <input
                        value={b.src}
                        onChange={(e) => patch(i, { ...b, src: e.target.value })}
                        placeholder="Image URL (https://…)"
                        className={input}
                      />
                      <input
                        value={b.caption ?? ""}
                        onChange={(e) => patch(i, { ...b, caption: e.target.value })}
                        placeholder="Caption (optional)"
                        className={input}
                      />
                      <input
                        value={b.alt ?? ""}
                        onChange={(e) => patch(i, { ...b, alt: e.target.value })}
                        placeholder="Alt text (optional)"
                        className={input}
                      />
                    </div>
                  </details>
                </figure>
              )}
            </div>
            {dropIndex === i + 1 ? <DropLine /> : null}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
        <button type="button" onClick={() => add("heading")} className={dangerBtn}>+ Heading</button>
        <button type="button" onClick={() => add("paragraph")} className={dangerBtn}>+ Paragraph</button>
        <button type="button" onClick={() => add("image")} className={dangerBtn}>+ Image</button>
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Inline marks: **bold**, *italic*, ++underline++, [text](url)
      </p>
    </div>
  );
}

function DropLine() {
  return <div aria-hidden="true" className="h-0.5 bg-foreground" />;
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <textarea
      ref={(el) => {
        ref.current = el;
        if (el) {
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }
      }}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        fit();
      }}
      rows={1}
      placeholder={placeholder}
      className={`w-full resize-none overflow-hidden border-0 bg-transparent p-0 placeholder:text-muted-foreground/70 focus:bg-muted/40 focus:outline-none ${className ?? ""}`}
    />
  );
}
