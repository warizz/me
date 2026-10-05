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
                ? "h-16 w-24 object-cover rounded border border-black/10 dark:border-white/20"
                : "w-full aspect-video object-cover rounded-lg border border-black/10 dark:border-white/20"
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
          className="backdrop:bg-black/80 bg-transparent p-0 max-w-3xl w-full"
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-black/70 text-white rounded-r cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  aria-label="next photo"
                  onClick={() => setIndex((i) => (i + 1) % photos.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-black/70 text-white rounded-l cursor-pointer"
                >
                  &rarr;
                </button>
              </>
            )}
            <button
              type="button"
              aria-label="close"
              onClick={() => ref.current?.close()}
              className="absolute right-2 top-2 p-2 bg-black/70 text-white rounded cursor-pointer"
            >
              &times;
            </button>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
              {index + 1}/{photos.length}
            </span>
          </div>
        </dialog>
      )}
    </>
  );
}
