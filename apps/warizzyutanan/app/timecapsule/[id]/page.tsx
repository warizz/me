import Link from "next/link";

import EventTimeline from "../EventTimeline";
import getTimecapsuleData, {
  formatDateRange,
  getEventFileNames,
} from "../getTimecapsuleData";

export function generateStaticParams() {
  return getEventFileNames().map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    return { id };
  });
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = getTimecapsuleData(`${id}.md`);
  return {
    title: `${item.title} - Warizz Yutanan`,
    description: item.description || item.tldr || undefined,
    robots: item.isPublished ? "index, follow" : "noindex, nofollow",
  };
}

export default async function TimecapsuleItemPage({ params }: Props) {
  const { id } = await params;
  const item = getTimecapsuleData(`${id}.md`);

  return (
    <article data-testid={`timecapsule-${item.id}`}>
      <header className="mb-8">
        <time
          dateTime={item.startDate}
          suppressHydrationWarning
          className="mb-3 inline-block rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-3 py-1 font-mono text-[11px] tracking-widest text-white uppercase"
        >
          {formatDateRange(item.startDate, item.endDate)}
        </time>
        <h1 className="m-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-3xl font-black tracking-tighter text-transparent md:text-4xl dark:from-rose-500 dark:via-orange-400 dark:to-amber-400">
          {item.title}
        </h1>
        {item.tldr ? (
          <p className="m-0 mt-3 text-sm opacity-80">{item.tldr}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-rose-600 uppercase dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-400/10 px-4 py-3">
        <span className="mt-0.5 leading-none text-amber-500">⚠︎</span>
        <p className="m-0 font-mono text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
          AI-generated summary of publicly reported news, human-moderated.
          Non-commercial personal archive — photos remain the property of their
          respective publishers.
        </p>
      </div>
      <EventTimeline markdownString={item.markdownString} />
      <footer className="mt-10 border-t border-rose-500/25 pt-4 dark:border-amber-400/25">
        <Link
          href="/timecapsule"
          className="font-mono text-[11px] tracking-widest text-rose-600 uppercase no-underline hover:underline dark:text-amber-400"
        >
          ← all moments
        </Link>
      </footer>
    </article>
  );
}
