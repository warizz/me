import fs from "fs";

import { parse } from "csv-parse";
import { z } from "zod";

const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  release_year: z.coerce.number(),
  rating: z.enum(["-1", "0", "1", "2"]).optional().or(z.literal("")),
  finished_at: z.string().optional().or(z.literal("")),
  earned_platinum_trophy: z.enum(["TRUE", "FALSE"]),
  slug: z.string().optional().or(z.literal("")),
});

export type Game = z.infer<typeof GameSchema>;

export async function parseGamesCsv() {
  return new Promise<Game[]>((resolve, reject) => {
    const results: Game[] = [];

    const parser = fs
      .createReadStream(`${process.cwd()}/app/games/games.csv`, "utf-8")
      .pipe(parse({ columns: true }));

    parser.on("data", (data) => {
      try {
        results.push(GameSchema.parse(data));
      } catch (error) {
        if (error instanceof Error) {
          console.error(`::error::parseGamesCsv::${error.message}`);
        }
      }
    });

    parser.on("error", (error) => reject(error));
    parser.on("end", () => resolve(results));
  });
}
