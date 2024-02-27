import orderBy from "lodash/orderBy";
import { Metadata } from "next";
import Markdown from "shared/Markdown";
import ToolsBar from "shared/ToolsBar";

import { parseWihltdCsv } from "./parseWihltdCsv";

const _title = "WIHLTD";

export async function generateMetadata(): Promise<Metadata> {
  return { title: _title };
}

export default async function Page() {
  const list = await parseWihltdCsv("/app/wihltd/db.csv");
  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: _title, href: "/wihltd" },
        ]}
      />
      <div>
        <h1>{_title}</h1>
        <div className="font-mono">
          <ul>
            {orderBy(list, "date", "desc").map((item, index) => {
              return (
                <li key={index}>
                  <span>{item.date.toLocaleDateString()}</span>
                  <Markdown>{item.content}</Markdown>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
