import { createClient } from "@supabase/supabase-js";
import { formatDuration, intervalToDuration } from "date-fns";
import lodashSortBy from "lodash.sortby";
import Head from "next/head";
import ColorSchemeToggle from "shared/ColorSchemeToggle";

import Button from "../components/Button";
import { secretEnvVars } from "../secretEnvVars";
import { definitions } from "../types/db";
import useSorting from "../utils/useSorting";

type Record = definitions["log_groups"] & {
  log_items: definitions["log_items"][];
};

export async function getServerSideProps() {
  const supabase = createClient(
    secretEnvVars.SUPABASE_PROJECT_URL,
    secretEnvVars.SUPABASE_API_SECRET_KEY
  );
  const { data } = await supabase
    .from<Record>("log_groups")
    .select(`*, log_items(*)`);

  return {
    props: { data },
  };
}

export default function Home({ data }: { data: Record[] | null }) {
  const title = "time. space. relativities.";
  const { sortBy, toggleSorting } = useSorting();

  if (!data) return null;

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

        {data
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
