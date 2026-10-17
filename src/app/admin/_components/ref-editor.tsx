"use client";

import { useState } from "react";
import { dangerBtn, input, label } from "./ui";
import type { Reference } from "../../../features/research/types";

const empty: Reference = { authors: "", year: "", title: "", venue: "", url: "" };

// Reference list editor, serialized to the hidden `references` field.
export function RefEditor({ initial }: { initial: Reference[] }) {
  const [refs, setRefs] = useState<Reference[]>(initial);

  const patch = (i: number, r: Reference) =>
    setRefs((rs) => rs.map((x, j) => (j === i ? r : x)));

  const remove = (i: number) => setRefs((rs) => rs.filter((_, j) => j !== i));

  return (
    <div>
      <span className={label}>References</span>
      <input type="hidden" name="references" value={JSON.stringify(refs)} readOnly />
      <div className="space-y-3">
        {refs.map((r, i) => (
          <div key={i} className="border border-border px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-medium text-muted-foreground">{i + 1}.</span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove reference"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={r.authors}
                onChange={(e) => patch(i, { ...r, authors: e.target.value })}
                placeholder="Authors"
                className={input}
              />
              <input
                value={r.year}
                onChange={(e) => patch(i, { ...r, year: e.target.value })}
                placeholder="Year"
                className={input}
              />
            </div>
            <div className="mt-2 space-y-2">
              <input
                value={r.title}
                onChange={(e) => patch(i, { ...r, title: e.target.value })}
                placeholder="Title (required)"
                className={input}
              />
              <input
                value={r.venue}
                onChange={(e) => patch(i, { ...r, venue: e.target.value })}
                placeholder="Venue"
                className={input}
              />
              <input
                value={r.url ?? ""}
                onChange={(e) => patch(i, { ...r, url: e.target.value })}
                placeholder="URL (optional)"
                className={input}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button type="button" onClick={() => setRefs((rs) => [...rs, { ...empty }])} className={dangerBtn}>
          + Reference
        </button>
      </div>
    </div>
  );
}
