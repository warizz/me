import fs from "fs";

import { parse } from "csv-parse";
import { z } from "zod";

const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  release_year: z.coerce.number(),
  watched_at: z.coerce.date(),
  rating: z.enum(["bad", "average", "good", "great"]),
  url: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;

export async function parseMoviesCsv(filePath: string) {
  return new Promise<Movie[]>((resolve, reject) => {
    const results: Movie[] = [];

    const parser = fs
      .createReadStream(process.cwd() + filePath, "utf-8")
      .pipe(parse({ columns: true }));

    parser.on("data", (data) => {
      try {
        const movie = MovieSchema.parse(data);
        results.push(movie);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error parsing row: ${error.message}`);
        }
        console.error(`Error parsing row: unknown error`);
      }
    });

    parser.on("error", (error) => {
      reject(error);
    });

    parser.on("end", () => {
      resolve(results);
    });
  });
}
