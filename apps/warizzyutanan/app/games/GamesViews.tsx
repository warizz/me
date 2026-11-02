"use client";

import { Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RatingMarks } from "./RatingMarks";

export interface GameRow {
  key: string;
  title: string;
  image: string;
  href?: string;
  platinum: boolean;
  dateLabel: string;
  rating: unknown;
  sortDate: string;
}

export default function GamesViews({
  years,
  rowsByYear,
}: {
  years: string[];
  rowsByYear: Record<string, GameRow[]>;
}) {
  // mobile defaults to list; desktop to grid
  const [view, setView] = useState<"grid" | "list">("grid");
  useEffect(() => {
    setView(window.matchMedia("(max-width: 640px)").matches ? "list" : "grid");
  }, []);

  return (
    <div data-testid="games" className="not-prose font-sans">
      <div className="mb-4 inline-flex overflow-hidden rounded-md border border-black/20 dark:border-white/20">
        {(["grid", "list"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`px-3 py-1 font-mono text-xs ${
              view === v
                ? "bg-primary text-white dark:bg-primary-invert"
                : "bg-transparent text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            {v === "grid" ? "▦ grid" : "☰ list"}
          </button>
        ))}
      </div>

      {years.map((year) => (
        <section key={year}>
          <h2 className="mt-6 mb-2 font-mono text-black dark:text-white">
            {year}
          </h2>

          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {(rowsByYear[year] ?? []).map((game) => (
                <Link
                  key={game.key}
                  href={game.href ?? "#"}
                  className="block no-underline"
                >
                  <div
                    className={`relative aspect-video w-full overflow-hidden ${
                      game.platinum
                        ? "border-2 border-[#c0c8d0]"
                        : "border border-black/10 dark:border-white/10"
                    }`}
                  >
                    {game.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={game.image}
                        alt={game.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    {game.platinum ? (
                      <>
                        <span className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-yellow-300">
                          <Trophy size={18} aria-label="Platinum trophy" />
                        </span>
                        <span className="plat-sweep pointer-events-none absolute inset-0" />
                      </>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <div className="truncate text-sm font-bold text-primary dark:text-primary-invert">
                      {game.title}
                    </div>
                    <div className="shrink-0 font-mono text-xs text-black/60 dark:text-white/60">
                      {game.dateLabel}
                    </div>
                  </div>
                  <div className="prose-sm text-black/60 dark:text-white/60">
                    <RatingMarks rating={game.rating} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ul className="list-none space-y-1 p-0 font-mono text-sm">
              {(rowsByYear[year] ?? []).map((game) => (
                <li key={game.key} className="flex items-center gap-3">
                  {game.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={game.image}
                      alt=""
                      loading="lazy"
                      className="h-[32px] w-[56px] shrink-0 rounded-sm object-cover"
                    />
                  ) : (
                    <span className="h-[32px] w-[56px] shrink-0 rounded-sm border border-black/10 dark:border-white/10" />
                  )}
                  {game.href ? (
                    <Link
                      href={game.href}
                      className="flex-1 truncate no-underline"
                    >
                      {game.title}
                    </Link>
                  ) : (
                    <span className="flex-1 truncate">{game.title}</span>
                  )}
                  {game.platinum ? <span aria-hidden>🏆</span> : null}
                  <span className="text-xs text-black/60 dark:text-white/60">
                    {game.dateLabel}
                  </span>
                  <RatingMarks rating={game.rating} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
