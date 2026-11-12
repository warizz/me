"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  photos: string[];
  title: string;
  compact?: boolean;
}

export default function Lightbox({ photos, title, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDialogElement>(null);
  // compact thumbs render at ~96x64 CSS px; serve the 480w variant (repo's
  // <file>.<w>w.webp convention) instead of the full-size photo
  const thumbSrc = photos[0]?.replace(/\.webp$/, ".480w.webp");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return; // native dialog closes itself
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length);
      if (event.key === "ArrowLeft")
        setIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  useEffect(() => {
    if (open) ref.current?.showModal();
  }, [open]);

  function showAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <>
      {photos.length > 0 && (
        <button
          type="button"
          onClick={() => showAt(0)}
          className="block cursor-pointer"
        >
          {}
          <img
            src={compact ? thumbSrc : photos[0]}
            alt={title}
            loading={compact ? "lazy" : undefined}
            onError={
              compact
                ? (e) => {
                    // variant missing -> fall back to the full-size photo
                    if (e.currentTarget.src !== photos[0])
                      e.currentTarget.src = photos[0];
                  }
                : undefined
            }
            className={
              compact
                ? "h-16 w-24 rounded border border-black/10 object-cover dark:border-white/20"
                : "aspect-video w-full rounded-lg border border-black/10 object-cover dark:border-white/20"
            }
          />
          {!compact && photos.length > 1 && (
            <span className="mt-1 block text-xs text-black/50 dark:text-white/50">
              {photos.length} photos
            </span>
          )}
        </button>
      )}

      {open && (
        <dialog
          ref={ref}
          onClose={() => setOpen(false)}
          onClick={(event) =>
            event.target === ref.current && ref.current.close()
          }
          className="w-full max-w-3xl bg-transparent p-0 backdrop:bg-black/80"
        >
          <div className="relative">
            {}
            <img
              src={photos[index]}
              alt={`${title} photo ${index + 1}`}
              className="w-full rounded-lg"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="previous photo"
                  onClick={() =>
                    setIndex((i) => (i - 1 + photos.length) % photos.length)
                  }
                  className="absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer rounded-r bg-black/70 p-2 text-white"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  aria-label="next photo"
                  onClick={() => setIndex((i) => (i + 1) % photos.length)}
                  className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer rounded-l bg-black/70 p-2 text-white"
                >
                  &rarr;
                </button>
              </>
            )}
            <button
              type="button"
              aria-label="close"
              onClick={() => ref.current?.close()}
              className="absolute top-2 right-2 cursor-pointer rounded bg-black/70 p-2 text-white"
            >
              &times;
            </button>
            <span className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
              {index + 1}/{photos.length}
            </span>
          </div>
        </dialog>
      )}
    </>
  );
}
