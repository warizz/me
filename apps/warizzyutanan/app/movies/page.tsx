import { Metadata } from "next";
import Link from "next/link";

import BlogLayout from "../../components/BlogLayout";
import {
  fmString,
  getContent,
  getContentFileNames,
} from "../../components/lib/getContent";

function thumbs(rating: unknown) {
  return rating === 2 ? "👍👍" : rating === 1 ? "👍" : "";
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Movies",
    description: "Movies I watched",
    robots: "index, follow",
  };
}

export default async function Page() {
  const movies = getContentFileNames("movie")
    .map((fileName) => {
      const { data, id } = getContent(fileName);
      return {
        date: fmString(data.date),
        id,
        title: fmString(data.title) || id,
        rating: data.rating,
        isPublished: !!data.publish,
      };
    })
    .filter((movie) => movie.isPublished)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  const years = [...new Set(movies.map((movie) => movie.date.slice(0, 4)))];

  return (
    <BlogLayout
      breadcrumbs={[{ text: "movies", href: "/movies" }]}
      h1={<h1 className="text-primary dark:text-primary-invert">Movies</h1>}
    >
      <div className="not-prose font-sans">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mt-6 mb-2 font-mono text-black dark:text-white">
              {year}
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {movies
                .filter((movie) => movie.date.startsWith(year))
                .map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/posts/${movie.id}`}
                    className="block no-underline"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden border border-black/10 dark:border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/posts/${movie.id}.webp`}
                        alt={movie.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-1 truncate text-sm font-bold text-primary dark:text-primary-invert">
                      {movie.title}
                    </div>
                    <div className="prose-sm text-black/60 dark:text-white/60">
                      {thumbs(movie.rating)}
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </BlogLayout>
  );
}
