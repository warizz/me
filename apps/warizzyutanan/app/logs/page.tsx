import { Metadata } from "next";
import ToolsBar from "shared/ToolsBar";

import { parseLogsCsv } from "./parseLogsCsv";

const csvPath = `/app/logs/logs.csv`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My movies`,
  };
}

export default async function Page() {
  const list = await parseLogsCsv(csvPath);
  console.log({ list });

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
        <div className="bg-white dark:bg-black h-screen overflow-auto">
          <div className="container p-8 mx-auto prose dark:prose-invert font-serif">
            <ul>
              {list.map((item) => {
                return <li key={item.id}>{item.title}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
