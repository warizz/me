import { format } from "date-fns";
import orderBy from "lodash/orderBy";
import { Metadata } from "next";

import ToolsBar from "../../component/shared/ToolsBar";

import { parseCsv } from "./parseCsv";

const _title = "Trips";

export async function generateMetadata(): Promise<Metadata> {
  return { title: _title };
}

export default async function Page() {
  const list = await parseCsv("/app/trips/db.csv");
  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: _title, href: "/trips" },
        ]}
      />
      <div>
        <h1>{_title}</h1>
        <div className="font-mono">
          <ul>
            {orderBy(list, "started_at", "desc").map((item, index) => {
              return (
                <li key={index}>
                  <div>
                    <i>{format(item.started_at, "yyyy-MM-dd")}</i>
                    <span>{`: ${item.title}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
