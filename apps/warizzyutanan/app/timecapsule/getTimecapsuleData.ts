import { z } from "zod";

import {
  getContent,
  getContentFileNames,
} from "../../components/lib/getContent";

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
  const { data, markdownString, id } = getContent(fileName);

  return TimecapsuleItem.parse({
    description: data.description ?? "",
    endDate: data.endDate ?? null,
    id,
    isPublished: !!data.publish,
    markdownString,
    startDate: data.startDate,
    tags: data.tags ?? [],
    title: data.title,
    tldr: data.tldr,
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
  return getContentFileNames("timecapsule");
}

export function getTimecapsuleItems() {
  return getEventFileNames()
    .map((file) => getTimecapsuleData(file))
    .filter((item) => item.isPublished);
}
