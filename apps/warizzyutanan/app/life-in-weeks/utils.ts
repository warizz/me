import { differenceInWeeks, addWeeks, startOfWeek } from "date-fns";

import { LifeEvent } from "./types";

export const BIRTH_DATE = new Date("1984-08-08");
export const TOTAL_YEARS = 100;
export const WEEKS_PER_YEAR = 52;

export const getWeekIndex = (date: Date, birthDate: Date = BIRTH_DATE) => {
  return differenceInWeeks(date, startOfWeek(birthDate));
};

export const getWeekDate = (index: number, birthDate: Date = BIRTH_DATE) => {
  return addWeeks(startOfWeek(birthDate), index);
};

// Seeded random for consistent colors
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const assignedHues = new Map<string, number>();

export const getColorForEvent = (event: LifeEvent) => {
  if (event.color) return event.color;

  const title = event.title;
  if (title.includes("🎂")) {
    return "hsl(48, 100%, 50%)"; // Standout Gold for birthdays
  }

  if (assignedHues.has(title)) {
    return `hsl(${assignedHues.get(title)}, 70%, 55%)`;
  }

  const hash = hashCode(title);
  // Ensure at least 20 degree difference by snapping to a grid if needed,
  // or just use a larger prime multiplier.
  const hue = Math.abs(hash % 360);

  // Simple collision avoidance: if too close to an existing hue, shift it
  let finalHue = hue;
  const existingHues = Array.from(assignedHues.values());

  let attempts = 0;
  while (
    existingHues.some(
      (h) => Math.abs(h - finalHue) < 20 || Math.abs(h - finalHue) > 340,
    ) &&
    attempts < 18
  ) {
    finalHue = (finalHue + 20) % 360;
    attempts++;
  }

  assignedHues.set(title, finalHue);
  return `hsl(${finalHue}, 70%, 55%)`;
};

export const isEventInWeek = (event: LifeEvent, weekDate: Date) => {
  const start = new Date(event.started_at);
  const end = event.ended_at ? new Date(event.ended_at) : start;

  // Check if the event overlaps with the week starting at weekDate
  const weekStart = startOfWeek(weekDate);
  const weekEnd = addWeeks(weekStart, 1);

  // Event overlaps if start is before weekEnd AND end is at or after weekStart
  return start < weekEnd && end >= weekStart;
};
