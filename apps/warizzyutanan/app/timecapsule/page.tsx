import Link from "next/link";

import { formatDateRange, getTimecapsuleItems } from "./getTimecapsuleData";

export async function generateMetadata() {
  return {
    title: "Timecapsule - Warizz Yutanan",
    description: "Moments and events worth remembering",
    robots: "index, follow",
  };
}

async function TimecapsulePage() {
  const items = getTimecapsuleItems().sort((a, b) => {
    const aDate = new Date(a.startDate);
    const bDate = new Date(b.startDate);
    if (aDate > bDate) return -1;
    return 1;
  });

  return (
    <div data-testid="timecapsule">
      <header className="mb-10">
        <p className="m-0 mb-3 inline-block rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-3 py-1 font-mono text-[11px] tracking-widest text-white uppercase">
          timecapsule
        </p>
        <h1 className="m-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-3xl font-black tracking-tighter text-transparent md:text-4xl dark:from-rose-500 dark:via-orange-400 dark:to-amber-400">
          Moments worth remembering
        </h1>
        <p className="m-0 mt-2 text-sm opacity-60">
          News and events that left a mark — sealed and dated.
        </p>
      </header>
      <div className="mb-10 flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-400/10 px-4 py-3">
        <span className="mt-0.5 leading-none text-amber-500">⚠︎</span>
        <p className="m-0 font-mono text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
          AI-generated summaries of publicly reported news, human-moderated.
          Non-commercial personal archive.
        </p>
      </div>
      <ol className="m-0 list-none p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.id}
              className={`relative ml-1 pl-7 ${
                isLast
                  ? "pb-2"
                  : "border-l border-rose-500/25 pb-9 dark:border-amber-400/25"
              }`}
            >
              <span className="absolute top-[9px] -left-[5px] h-[9px] w-[9px] rounded-full bg-gradient-to-r from-rose-500 to-orange-400 dark:from-amber-400 dark:to-orange-500" />
              <time
                dateTime={item.startDate}
                suppressHydrationWarning
                className="mb-1 block font-mono text-[11px] tracking-widest text-rose-600 uppercase dark:text-amber-400"
              >
                {formatDateRange(item.startDate, item.endDate)}
              </time>
              <Link
                href={`/timecapsule/${item.id}`}
                className="text-xl font-bold tracking-tight no-underline hover:text-rose-600 dark:hover:text-amber-400"
              >
                {item.title}
              </Link>
              {item.tldr ? (
                <p className="m-0 mt-1 text-sm opacity-70">{item.tldr}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-rose-600 uppercase dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default TimecapsulePage;
