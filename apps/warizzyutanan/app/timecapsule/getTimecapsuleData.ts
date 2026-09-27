import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

export const timecapsuleDirectory = path.join(process.cwd(), "app/timecapsule");

export const TimecapsuleItem = z.object({
  description: z.string(),
  endDate: z.string().nullable().default(null),
  id: z.string(),
  isPublished: z.boolean(),
  markdownString: z.string(),
  startDate: z.string(),
  tags: z.string().array(),
  title: z.string(),
  tldr: z.string().nullable().default(null),
});

export type ITimecapsuleItem = z.infer<typeof TimecapsuleItem>;

export default function getTimecapsuleData(fileName: string) {
  const fullPath = path.join(timecapsuleDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const meta = matter(fileContents);
  const [id] = fileName.split(".");

  return TimecapsuleItem.parse({
    description: meta.data.description ?? "",
    endDate: meta.data.endDate ?? null,
    id,
    isPublished: !!meta.data.publish,
    markdownString: meta.content,
    startDate: meta.data.startDate,
    tags: meta.data.tags ?? [],
    title: meta.data.title,
    tldr: meta.data.tldr,
  });
}

export function formatDateRange(startDate: string, endDate?: string | null) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const fmt = (d: Date, withYear = true) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      ...(withYear ? { year: "numeric" } : {}),
    });

  if (!end) return `${fmt(start)} → ongoing`;
  if (start.getTime() === end.getTime()) return fmt(start);
  if (start.getFullYear() === end.getFullYear())
    return `${fmt(start, false)} → ${fmt(end)}`;
  return `${fmt(start)} → ${fmt(end)}`;
}

export function getEventFileNames() {
  return fs
    .readdirSync(timecapsuleDirectory)
    .filter((file) => file.endsWith(".md") && file !== "INSTRUCTIONS.md");
}

export function getTimecapsuleItems() {
  return getEventFileNames()
    .map((file) => getTimecapsuleData(file))
    .filter((item) => item.isPublished);
}
