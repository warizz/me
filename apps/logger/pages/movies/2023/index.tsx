import Head from "next/head";
import ColorSchemeToggle from "shared/ColorSchemeToggle";

import Button from "../../../components/Button";
import db from "../../../db/movies/2023.json";
import { useMoviesSortBy } from "../../../utils/useMoviesSortBy";

export default function Movies() {
  const { sortBy, toggleSorting } = useMoviesSortBy();
  return (
    <div className="bg-white dark:bg-black h-screen overflow-auto">
      <div className="container p-8 mx-auto prose dark:prose-invert font-serif">
        <Head>
          <title>2023 Movies - Warizz</title>
          <meta
            name="description"
            content="List of movies I have watched in 2023"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <h1>2023 Movies</h1>

        <div className="flex gap-2 flex-wrap">
          <Button testId="sort-by" onClick={() => toggleSorting()}>
            {"Sort by "}
            <strong>
              <i>{sortBy}</i>
            </strong>
          </Button>

          <ColorSchemeToggle />
        </div>

        <div id="movies" className="flex relative h-full gap-4 flex-wrap mt-8">
          {db
            .sort((a, b) => {
              const aDate = new Date(a.date);
              const bDate = new Date(b.date);
              if (sortBy === "date dsc") {
                if (aDate > bDate) return -1;
                return 1;
              }
              if (aDate < bDate) return -1;
              return 1;
            })
            .map((row, index) => {
              return (
                <div
                  key={row.slug}
                  className="h-[200px] md:h-[300px] overflow-hidden border border-primary relative"
                >
                  <img
                    className="w-full h-full p-0 m-0"
                    alt={row.title}
                    src={`/movies/2023/${row.slug}`}
                    loading={index > 3 ? "lazy" : "eager"}
                  />
                  <div className="absolute bottom-0 text-sm bg-primary px-1 text-black font-bold">
                    {row.date}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
