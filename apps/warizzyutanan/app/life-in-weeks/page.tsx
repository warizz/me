import { isSameWeek, addWeeks } from "date-fns";
import React from "react";

import rawData from "./data.json";
import LifeInWeeksClient from "./LifeInWeeksClient";
import { LifeEvent, WeekData } from "./types";
import {
  BIRTH_DATE,
  TOTAL_YEARS,
  WEEKS_PER_YEAR,
  isEventInWeek,
} from "./utils";

const LifeInWeeksPage = async () => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Map raw data to LifeEvent objects (Server Side)
  const events: LifeEvent[] = rawData
    .map((item: any) => {
      const rawEnd = item.ended_at || item.end_date || item.date;
      const finalEnd = rawEnd === "current" ? todayStr : rawEnd;

      return {
        id: item.id,
        title: item.title,
        description: item.detail || "",
        started_at: item.date,
        ended_at: finalEnd,
        color: item.color,
        is_private: item.is_private === "true" || item.is_private === true,
      };
    })
    .filter((e) => !e.is_private);

  // Pre-calculate all weeks data (Server Side)
  const birthYear = BIRTH_DATE.getFullYear();
  const gridData = [];

  for (let year = 0; year < TOTAL_YEARS; year++) {
    const yearWeeks: WeekData[] = [];
    const currentYearValue = birthYear + year;
    const yearStart = new Date(currentYearValue, 0, 1); // January 1st

    for (let weekOfYear = 0; weekOfYear < WEEKS_PER_YEAR; weekOfYear++) {
      const globalWeekIndex = year * WEEKS_PER_YEAR + weekOfYear;
      const weekDate = addWeeks(yearStart, weekOfYear);

      const weekEvents = events.filter((event) =>
        isEventInWeek(event, weekDate),
      );

      yearWeeks.push({
        index: globalWeekIndex,
        date: weekDate,
        events: weekEvents,
        isCurrentWeek: isSameWeek(weekDate, today, { weekStartsOn: 0 }),
      });
    }
    gridData.push({ year, weeks: yearWeeks });
  }

  return <LifeInWeeksClient gridData={gridData} />;
};

export default LifeInWeeksPage;
