import orderBy from "lodash/orderBy";
import { Metadata } from "next";
import ToolsBar from "shared/ToolsBar";

import { parseMoviesCsv } from "./parseMoviesCsv";

export async function generateStaticParams() {
  return [{ year: "2023" }, { year: "2024" }];
}

export async function generateMetadata({
  params,
}: {
  params: { year: string };
}): Promise<Metadata> {
  return { title: `My movies of ${params.year}` };
}

interface Props {
  params: { year: string };
}

export default async function Page({ params: { year } }: Props) {
  const filePath = `/app/movies/[year]/${year}.csv`;
  const csv = await parseMoviesCsv(filePath);
  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: "movies", href: "/movies" },
          { text: year, href: "" },
        ]}
      />

      <div>
        <h1>{`My movies of ${year}`}</h1>
        <ul className="font-mono">
          {orderBy(csv, "watched_at", "desc").map((item) => {
            return (
              <li key={item.id}>
                <time>
                  {item.watched_at.toLocaleDateString("en", {
                    day: "2-digit",
                    month: "short",
                  })}
                </time>
                {" - "}
                <a
                  target="_blank"
                  href={item.url}
                >{`${item.title} (${item.release_year})`}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
