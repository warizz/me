import { readdirSync } from "fs";

import { orderBy } from "lodash";
import { Metadata } from "next";
import Link from "next/link";
import ToolsBar from "shared/ToolsBar";

function readMoviesFiles() {
  const pattern = /^\d{4}\.csv$/;

  const files: string[] = readdirSync(`${process.cwd()}/app/movies/[year]`);
  const matchingFiles: string[] = [];

  files.forEach((file) => {
    if (pattern.test(file)) {
      matchingFiles.push(file.replace(".csv", ""));
    }
  });

  return matchingFiles;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My movies`,
  };
}

export default async function Page() {
  const years = readMoviesFiles();
  return (
    <>
      <ToolsBar
        className="mb-3 lg:mb-2"
        breadcrumbs={[
          { text: "home", href: "/" },
          { text: "movies", href: "/movies" },
        ]}
      />
      <div>
        <h1>{`My movies`}</h1>
        <div className="font-mono">
          <ul>
            {orderBy(years, (item) => item, "desc").map((item) => {
              return (
                <li key={item}>
                  <Link href={`/movies/${item}`} key={item}>
                    {item}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
