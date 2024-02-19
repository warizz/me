import { readdirSync } from "fs";

export function getMoviesYears() {
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
