import { readdirSync } from "fs";

import Link from "next/link";

import EventTimeline from "../EventTimeline";
import getTimecapsuleData, {
  formatDateRange,
  timecapsuleDirectory,
} from "../getTimecapsuleData";

export function generateStaticParams() {
  const fileNames = readdirSync(timecapsuleDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
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
    description: item.description,
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
          className="inline-block font-mono uppercase text-[11px] tracking-widest text-white bg-gradient-to-r from-rose-600 to-orange-500 rounded-full px-3 py-1 mb-3"
        >
          {formatDateRange(item.startDate, item.endDate)}
        </time>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter m-0 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 dark:from-rose-500 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
          {item.title}
        </h1>
        {item.tldr ? (
          <p className="text-sm opacity-80 m-0 mt-3">{item.tldr}</p>
        ) : null}
        <div className="flex gap-2 flex-wrap mt-3">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider bg-rose-500/10 dark:bg-amber-400/10 text-rose-600 dark:text-amber-400 border border-rose-500/20 dark:border-amber-400/20 rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-400/10 px-4 py-3">
        <span className="text-amber-500 leading-none mt-0.5">⚠︎</span>
        <p className="font-mono text-[10px] leading-relaxed text-amber-700 dark:text-amber-300 m-0">
          AI-generated summary of publicly reported news, human-moderated.
          Non-commercial personal archive — photos remain the property of their
          respective publishers.
        </p>
      </div>
      <EventTimeline markdownString={item.markdownString} />
      <footer className="mt-10 pt-4 border-t border-rose-500/25 dark:border-amber-400/25">
        <Link
          href="/timecapsule"
          className="font-mono uppercase text-[11px] tracking-widest text-rose-600 dark:text-amber-400 no-underline hover:underline"
        >
          ← all moments
        </Link>
      </footer>
    </article>
  );
}
