import { orderBy } from "lodash";
import { Metadata } from "next";
import Link from "next/link";

import ToolsBar from "../../component/shared/ToolsBar";

import { getMoviesYears } from "./getMoviesYears";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My movies`,
  };
}

export default async function Page() {
  const years = getMoviesYears();
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
