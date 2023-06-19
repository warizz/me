import { formatDuration, intervalToDuration } from "date-fns";
import lodashSortBy from "lodash.sortby";
import Head from "next/head";
import ColorSchemeToggle from "shared/ColorSchemeToggle";

import Button from "../components/Button";
import logGroups from "../db/log_groups.json";
import logItems from "../db/log_items.json";
import useSorting from "../utils/useSorting";

const groups = logGroups.map((group) => {
  const items = logItems.filter((item) => item.group_id === group.id);
  return {
    title: group.title,
    rank: Number(group.rank),
    log_items: items,
  };
});

export default function Home() {
  const title = "time. space. relativities.";
  const { sortBy, toggleSorting } = useSorting();

  return (
    <div className="bg-white dark:bg-black h-screen overflow-auto">
      <div className="container p-8 mx-auto prose dark:prose-invert font-serif">
        <Head>
          <title>{title}</title>
          <meta
            name="description"
            content="For keeping my relativities of time & space"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <h1>{title}</h1>

        <div className="flex gap-2 flex-wrap">
          <Button testId="sort-by" onClick={() => toggleSorting()}>
            {"Sort by "}
            <strong>
              <i>{sortBy}</i>
            </strong>
          </Button>

          <ColorSchemeToggle />
        </div>

        {groups
          .sort((a, b) => a.rank - b.rank)
          .map((cat) => {
            return (
              <section key={cat.rank}>
                <h2>{cat.title}</h2>
                <ul>
                  {lodashSortBy(cat.log_items, [sortBy]).map((item) => {
                    const duration = intervalToDuration({
                      start: new Date(item.date),
                      end: item.ended_at ? new Date(item.ended_at) : new Date(),
                    });
                    const formattedDuration = formatDuration(duration, {
                      format: ["years", "months", "days"],
                    });
                    return (
                      <li className="list-disc" key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <span className="font-mono">
                            {` (${formattedDuration})`}
                          </span>
                        </div>
                        {!!item.ended_at && (
                          <div className="text-xs">
                            {"ended at: "}
                            <span className="font-mono">{item.ended_at}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
      </div>
    </div>
  );
}
