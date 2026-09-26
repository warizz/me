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
        <p className="inline-block font-mono uppercase text-[11px] tracking-widest text-white bg-gradient-to-r from-rose-600 to-orange-500 rounded-full px-3 py-1 m-0 mb-3">
          timecapsule
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter m-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 dark:from-rose-500 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
          Moments worth remembering
        </h1>
        <p className="text-sm opacity-60 m-0 mt-2">
          News and events that left a mark — sealed and dated.
        </p>
      </header>
      <div className="mb-10 flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-400/10 px-4 py-3">
        <span className="text-amber-500 leading-none mt-0.5">⚠︎</span>
        <p className="font-mono text-[10px] leading-relaxed text-amber-700 dark:text-amber-300 m-0">
          AI-generated summaries of publicly reported news, human-moderated.
          Non-commercial personal archive.
        </p>
      </div>
      <ol className="list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.id}
              className={`relative pl-7 ml-1 ${
                isLast
                  ? "pb-2"
                  : "pb-9 border-l border-rose-500/25 dark:border-amber-400/25"
              }`}
            >
              <span className="absolute -left-[5px] top-[9px] w-[9px] h-[9px] rounded-full bg-gradient-to-r from-rose-500 to-orange-400 dark:from-amber-400 dark:to-orange-500" />
              <time
                dateTime={item.startDate}
                suppressHydrationWarning
                className="block font-mono uppercase text-[11px] tracking-widest text-rose-600 dark:text-amber-400 mb-1"
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
                <p className="text-sm opacity-70 m-0 mt-1">{item.tldr}</p>
              ) : null}
              <div className="flex gap-2 flex-wrap mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-wider bg-rose-500/10 dark:bg-amber-400/10 text-rose-600 dark:text-amber-400 border border-rose-500/20 dark:border-amber-400/20 rounded-full px-2 py-0.5"
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
