"use client";

import { lazy, Suspense, useState } from "react";

// Deferred: react-markdown stack (~103 KiB) fetches on first expand, not page load
const Markdown = lazy(() => import("../../components/Markdown"));

export default function NoteCollapse({ body }: { body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-lg border-2 border-dashed border-emerald-500/70 dark:border-emerald-400/60">
      <button
        type="button"
        data-testid="tc-note-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3.5 py-2 text-left font-mono text-[11px] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400"
      >
        ✎ me
        <span className="ml-auto">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div
          data-testid="tc-note"
          className="border-t border-dashed border-emerald-500/40 px-3.5 py-2.5 dark:border-emerald-400/40"
        >
          <div className="prose prose-sm max-w-none font-sans dark:prose-invert">
            <Suspense fallback={null}>
              <Markdown>{body}</Markdown>
            </Suspense>
          </div>
        </div>
      ) : null}
    </div>
  );
}
