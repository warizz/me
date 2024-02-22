import fs from "fs";

import { parse } from "csv-parse";
import { z } from "zod";

const Schema = z.object({
  date: z.coerce.date(),
  content: z.string(),
});

export type Wihltd = z.infer<typeof Schema>;

export async function parseWihltdCsv(filePath: string) {
  return new Promise<Wihltd[]>((resolve, reject) => {
    const results: Wihltd[] = [];

    const parser = fs
      .createReadStream(process.cwd() + filePath, "utf-8")
      .pipe(parse({ columns: true }));

    parser.on("data", (data) => {
      try {
        const movie = Schema.parse(data);
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
