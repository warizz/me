import { intervalToDuration, formatDuration } from "date-fns";
import capitalize from "lodash/capitalize";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { Metadata } from "next";

import ToolsBar from "../../component/shared/ToolsBar";

import { parseLogsCsv } from "./parseLogsCsv";

const csvPath = `/app/logs/logs.csv`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Logs of my whatever - Warizz`,
  };
}

export default async function Page() {
  const list = await parseLogsCsv(csvPath);
  const groupes = groupBy(list, "category");

  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: "logs", href: "/logs" },
        ]}
      />
      <div>
        <h1>Logs of my whatever.</h1>
        {map(groupes, (list, key) => {
          return (
            <div key={key}>
              <h2>{capitalize(key)}</h2>
              <ul>
                {list
                  .filter((item) => !item.ended_at)
                  .map((item) => {
                    const duration = intervalToDuration({
                      start: new Date(item.started_at),
                      end: item.ended_at ? new Date(item.ended_at) : new Date(),
                    });
                    const formattedDuration = formatDuration(duration, {
                      format: ["years", "months", "days"],
                    });
                    return (
                      <li key={item.id}>
                        <div>
                          <strong className="mr-2">{item.title}</strong>
                          <span className="font-mono">{`(${formattedDuration})`}</span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
