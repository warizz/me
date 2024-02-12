import fs from "fs";

import { parse } from "csv-parse";
import { z } from "zod";

const LogSchema = z.object({
  category: z.enum(["life", "habit", "things", "subscription", "work"]),
  ended_at: z
    .string()
    .transform((value) => value || null)
    .transform(z.coerce.date().nullable().parse),
  id: z.string(),
  started_at: z.coerce.date(),
  title: z.string(),
});

export type Log = z.infer<typeof LogSchema>;

export async function parseLogsCsv(filePath: string) {
  return new Promise<Log[]>((resolve, reject) => {
    const results: Log[] = [];

    const parser = fs
      .createReadStream(process.cwd() + filePath, "utf-8")
      .pipe(parse({ columns: true }));

    parser.on("data", (data) => {
      try {
        console.log({ data });

        const movie = LogSchema.parse(data);
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
