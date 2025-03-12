import clsx from "clsx";
import React from "react";

import weeks from "./data.json";

const startDate = new Date("1984-08-08");
const endDate = new Date("2084-08-08");
const today = new Date();

const getWeeksBetween = (start: Date, end: Date) => {
  const diffInMs = end.getTime() - start.getTime();
  return Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000));
};

const colorConfig = [
  {
    start: new Date("1984-08-08"),
    end: new Date("1994-08-08"),
    color: "bg-red-100 border-red-300",
  },
  {
    start: new Date("2023-04-01"),
    end: new Date(),
    color: "bg-[#f7ba86] border-[#f58220]",
  },
];

const getColorForWeek = (weekDate: Date) => {
  const config = colorConfig.find(
    (c) => weekDate >= c.start && weekDate <= c.end,
  );
  return config ? config.color : "bg-gray-200";
};

const weeksCount = getWeeksBetween(startDate, endDate) + 1;
const currentWeek = getWeeksBetween(startDate, today);

const remainingYearsStartDate = new Date(startDate);
remainingYearsStartDate.setDate(startDate.getDate() + currentWeek * 7);

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
      <div className="w-full bg-gray-200 rounded h-5 mb-4 relative">
        <div
          className="bg-blue-500 h-5 rounded flex items-center justify-end px-1"
          style={{ width: `${(currentWeek / weeksCount) * 100}%` }}
        >
          <span className="text-white text-xs font-sans">
            {((currentWeek / weeksCount) * 100).toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-evenly gap-1 font-sans text-sm">
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
                "h-5 rounded border flex items-center justify-center px-2",
                {
                  "bg-blue-500 border-blue-700 text-white min-w-auto flex-grow":
                    isHighlighted,
                  "bg-green-500 border-green-700 text-white min-w-auto flex-grow relative":
                    isCurrentWeek,
                  [getColorForWeek(weekDate)]: !isHighlighted && !isCurrentWeek,
                },
              )}
            >
              {isCurrentWeek ? (
                <div className="rounded absolute w-full h-full bg-green-500 border-green-700 text-white min-w-auto flex-grow animate-ping"></div>
              ) : null}
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
