"use client";

import { useState } from "react";
import { dangerBtn, input, label } from "./ui";
import type { BodyBlock } from "../../../features/research/types";

// Structured body editor: heading / paragraph / image blocks with
// up-down-reorder. Inline marks inside text: **bold**, *italic*,
// ++underline++, [text](url). Serialized to the hidden `body` field.
export function BodyEditor({ initial }: { initial: BodyBlock[] }) {
  const [blocks, setBlocks] = useState<BodyBlock[]>(initial);

  const patch = (i: number, b: BodyBlock) =>
    setBlocks((bs) => bs.map((x, j) => (j === i ? b : x)));

  const move = (i: number, d: -1 | 1) =>
    setBlocks((bs) => {
      const j = i + d;
      if (j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

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

  return (
    <div>
      <span className={label}>Body blocks</span>
      <input type="hidden" name="body" value={JSON.stringify(blocks)} readOnly />
      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div key={i} className="border border-border px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-medium capitalize text-muted-foreground">
                {i + 1}. {b.type}
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="text-sm text-muted-foreground hover:text-foreground">↑</button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="text-sm text-muted-foreground hover:text-foreground">↓</button>
                <button type="button" onClick={() => remove(i)} aria-label="Remove block" className="text-sm text-muted-foreground hover:text-foreground">✕</button>
              </span>
            </div>
            {b.type === "image" ? (
              <div className="space-y-2">
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
            ) : (
              <>
                {b.type === "heading" ? (
                  <div className="mb-2 flex gap-2" role="group" aria-label="Heading level">
                    {([1, 2, 3] as const).map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => patch(i, { ...b, level: lv })}
                        aria-pressed={b.level === lv}
                        className={`border px-2 py-0.5 text-[13px] ${
                          b.level === lv
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        H{lv}
                      </button>
                    ))}
                  </div>
                ) : null}
                <textarea
                  value={b.text}
                  onChange={(e) => patch(i, { ...b, text: e.target.value })}
                  rows={b.type === "heading" ? 2 : 5}
                  placeholder={b.type === "heading" ? "Heading" : "Paragraph"}
                  className={input}
                />
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
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
