import clsx from "clsx";
import React from "react";

import weeks from "../../weeks.json";

const startDate = new Date("1984-08-08");
const endDate = new Date(startDate);
endDate.setFullYear(startDate.getFullYear() + 100);

const getWeeksBetween = (start: Date, end: Date) => {
  const diffInMs = end.getTime() - start.getTime();
  return Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000));
};

const weeksCount = getWeeksBetween(startDate, endDate);
const currentWeek = getWeeksBetween(startDate, new Date());

const remainingYearsStartDate = new Date(startDate);
remainingYearsStartDate.setDate(startDate.getDate() + currentWeek * 7);

const colorConfig = [
  {
    start: new Date(
      weeks.find((w) => w.title === "🐣 Born in 1984")?.date ?? "",
    ),
    end: new Date(weeks.find((w) => w.title === "Fabrinet")?.date ?? ""),
    color: "bg-neutral-100 border-neutral-200",
  },
  {
    start: new Date(weeks.find((w) => w.title === "Fabrinet")?.date ?? ""),
    end: new Date(),
    color: "bg-orange-100 border-orange-200",
  },
] as const;

console.log("::colorConfig", colorConfig);

const getColorForWeek = (weekDate: Date) => {
  const config = colorConfig.find(
    (c) => weekDate >= c.start && weekDate <= c.end,
  );
  return config ? config.color : "";
};

const WeeklyTimeline = () => {
  return (
    <div>
      <h1>My Life In Weeks.</h1>
      <p>
        💡 Inspired by{" "}
        <a href="https://weeks.ginatrapani.org/">
          https://weeks.ginatrapani.org/
        </a>
      </p>
      <div className="flex flex-wrap justify-between gap-1 font-sans text-sm">
        {[...Array(weeksCount)].map((_, i) => {
          const weekDate = new Date(startDate);
          weekDate.setDate(startDate.getDate() + i * 7);

          const event = weeks.find((w) => {
            const eventDate = new Date(w.date);
            const eventWeek = getWeeksBetween(startDate, eventDate);
            return eventWeek === i;
          });
          const isHighlighted = event && !event.is_private;
          const isCurrentWeek = i === currentWeek;

          return (
            <div
              key={i}
              title={weekDate.toDateString()}
              content={isHighlighted ? (event?.detail ?? "") : ""}
              data-testid="week"
              className={clsx(
                "h-5 rounded border flex items-center justify-center px-2 grow",
                {
                  "bg-blue-500 border-blue-700 text-white min-w-auto cursor-pointer":
                    isHighlighted,
                  "bg-[#FFAB5B] border-[#A31D1D] text-white min-w-auto":
                    isCurrentWeek,
                  [getColorForWeek(weekDate)]: !isHighlighted && !isCurrentWeek,
                },
              )}
            >
              {isHighlighted ? event.title : ""}
            </div>
          );
        })}
        <div className=" grow"></div>
      </div>
    </div>
  );
};

export default WeeklyTimeline;
