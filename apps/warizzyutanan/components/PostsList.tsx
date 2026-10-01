import Link from "next/link";

import type { IPost } from "./lib/getPostData";

export type PostSummary = Pick<
  IPost,
  "date" | "id" | "tags" | "title" | "tldr"
>;

interface Props {
  activeTags: string[];
  posts: PostSummary[];
}

export default function PostsList({ activeTags, posts }: Props) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const tags = Array.from(new Set(sorted.flatMap((post) => post.tags)))
    .filter((tag) => tag !== "post")
    .sort();

  const visible = activeTags.length
    ? sorted.filter((post) => activeTags.some((t) => post.tags.includes(t)))
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
        <details className="mb-12" open={activeTags.length > 0 || undefined}>
          <summary className="cursor-pointer text-sm text-gray-500 select-none hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            {activeTags.length
              ? `🏷️ Filtering: ${activeTags.map((t) => `#${t}`).join(", ")}`
              : `🏷️ Tags (${tags.length})`}
          </summary>
          <nav
            aria-label="Filter posts by tag"
            className="mt-3 flex flex-wrap gap-2"
          >
            {tags.map((tag) => {
              const active = activeTags.includes(tag);
              const next = active
                ? activeTags.filter((t) => t !== tag)
                : [...activeTags, tag];
              return (
                <Link
                  key={tag}
                  href={
                    next.length
                      ? `/posts?${next.map((t) => `tag=${encodeURIComponent(t)}`).join("&")}`
                      : "/posts"
                  }
                  scroll={false}
                  aria-current={active ? "page" : "false"}
                  className={`rounded-full border px-3 py-0.5 text-sm no-underline transition-colors ${
                    active
                      ? "border-primary bg-primary text-white dark:border-primary-invert dark:bg-primary-invert dark:text-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  #{tag}
                </Link>
              );
            })}
          </nav>
        </details>
      ) : null}
      {visible.length === 0 ? (
        <p className="text-gray-500 italic dark:text-gray-400">
          Nothing tagged {activeTags.map((t) => `#${t}`).join(", ")} —{" "}
          <Link href="/posts" scroll={false} className="underline">
            clear the filter
          </Link>
          .
        </p>
      ) : (
        <div>
          {years.map(([year, yearPosts]) => (
            <section key={year} className="mb-10 lg:mb-14">
              <h2 className="mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-widest text-gray-400 uppercase dark:border-gray-800 dark:text-gray-500">
                {year}
              </h2>
              <ul className="m-0 list-none p-0">
                {yearPosts.map((post) => (
                  <li
                    key={post.id}
                    data-tags={post.tags.join(",")}
                    className="mb-5 lg:mb-7"
                  >
                    <div className="flex flex-wrap items-baseline gap-4">
                      <time
                        dateTime={post.date}
                        className="shrink-0 text-sm text-gray-400 tabular-nums dark:text-gray-500"
                      >
                        {new Intl.DateTimeFormat("default", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(post.date))}
                      </time>
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-serif text-lg font-bold text-primary no-underline hover:underline dark:text-primary-invert"
                      >
                        {post.title}
                      </Link>
                    </div>
                    {post.tldr ? (
                      <p className="m-0 mt-1 text-sm text-gray-500 italic dark:text-gray-400">
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
