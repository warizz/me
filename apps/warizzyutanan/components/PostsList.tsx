import Link from "next/link";

import type { IPost } from "./lib/getPostData";

export type PostSummary = Pick<
  IPost,
  "date" | "id" | "tags" | "title" | "tldr"
>;

interface Props {
  activeTag: string | null;
  posts: PostSummary[];
}

export default function PostsList({ activeTag, posts }: Props) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const tags = Array.from(new Set(sorted.flatMap((post) => post.tags)))
    .filter((tag) => tag !== "post")
    .sort();

  const visible = activeTag
    ? sorted.filter((post) => post.tags.includes(activeTag))
    : sorted;

  const byYear = new Map<number, PostSummary[]>();
  for (const post of visible) {
    const year = new Date(post.date).getFullYear();
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  const years = Array.from(byYear.entries()).sort((a, b) => b[0] - a[0]);

  return (
    <div data-testid="posts" className="not-prose font-sans">
      {tags.length > 0 ? (
        <nav
          aria-label="Filter posts by tag"
          className="flex flex-wrap gap-2 mb-12"
        >
          {tags.map((tag) => {
            const active = tag === activeTag;
            return (
              <Link
                key={tag}
                href={
                  active ? "/posts" : `/posts?tag=${encodeURIComponent(tag)}`
                }
                scroll={false}
                aria-current={active ? "page" : "false"}
                className={`rounded-full border px-3 py-0.5 text-sm no-underline transition-colors ${
                  active
                    ? "bg-primary border-primary text-white dark:bg-primary-invert dark:border-primary-invert dark:text-black"
                    : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                #{tag}
              </Link>
            );
          })}
        </nav>
      ) : null}
      {visible.length === 0 ? (
        <p className="italic text-gray-500 dark:text-gray-400">
          Nothing tagged {activeTag} —{" "}
          <Link href="/posts" scroll={false} className="underline">
            clear the filter
          </Link>
          .
        </p>
      ) : (
        <div>
          {years.map(([year, yearPosts]) => (
            <section key={year} className="mb-10 lg:mb-14">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
                {year}
              </h2>
              <ul className="list-none p-0 m-0">
                {yearPosts.map((post) => (
                  <li
                    key={post.id}
                    data-tags={post.tags.join(",")}
                    className="mb-5 lg:mb-7"
                  >
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <time
                        dateTime={post.date}
                        className="shrink-0 text-sm tabular-nums text-gray-400 dark:text-gray-500"
                      >
                        {new Intl.DateTimeFormat("default", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(post.date))}
                      </time>
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-serif font-bold text-primary text-lg no-underline hover:underline dark:text-primary-invert"
                      >
                        {post.title}
                      </Link>
                    </div>
                    {post.tldr ? (
                      <p className="m-0 mt-1 text-sm italic text-gray-500 dark:text-gray-400">
                        {post.tldr}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
