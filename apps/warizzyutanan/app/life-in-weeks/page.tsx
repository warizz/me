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
          const isFutureWeek = i > currentWeek;

          return (
            <div
              key={i}
              content={isHighlighted ? (event?.detail ?? "") : ""}
              data-testid="week"
              className={clsx(
                "h-5 rounded border flex items-center justify-center px-2 grow",
                {
                  "bg-blue-500 border-blue-700 text-white min-w-auto":
                    isHighlighted,
                  "bg-[#FFAB5B] border-[#A31D1D] text-white min-w-auto":
                    isCurrentWeek,
                  "border-[#2DAA9E] bg-[#B4EBE6]":
                    !isHighlighted && !isCurrentWeek && !isFutureWeek,
                  "bg-gray-200":
                    isFutureWeek && !isHighlighted && !isCurrentWeek,
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
