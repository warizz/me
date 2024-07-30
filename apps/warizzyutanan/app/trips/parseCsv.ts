import fs from "fs";

import { parse } from "csv-parse";
import { z } from "zod";

const Schema = z.object({
  ended_at: z
    .string()
    .transform((value) => value || null)
    .transform(z.coerce.date().nullable().parse),
  id: z.string(),
  notes: z.string(),
  started_at: z.coerce.date(),
  title: z.string(),
});

export type Record = z.infer<typeof Schema>;

export async function parseCsv(filePath: string) {
  return new Promise<Record[]>((resolve, reject) => {
    const results: Record[] = [];

    const parser = fs
      .createReadStream(process.cwd() + filePath, "utf-8")
      .pipe(parse({ columns: true }));

    parser.on("data", (data) => {
      try {
        const record = Schema.parse(data);
        results.push(record);
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
