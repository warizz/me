"use client";

import clsx from "clsx";
import React from "react";

import { LifeEvent, WeekData } from "./types";
import { getColorForEvent } from "./utils";

interface WeekCellProps {
  week: WeekData;
  isSelected: boolean;
  onHover: (week: WeekData | null) => void;
  onClick: (event: LifeEvent, e: React.MouseEvent) => void;
  selectedEventId: string | null;
}

export const WeekCell = React.memo(
  ({ week, isSelected, onHover, onClick, selectedEventId }: WeekCellProps) => {
    const events = week.events;
    const hasEvents = events.length > 0;

    const renderSegments = () => {
      const getSegmentColor = (event: LifeEvent) => {
        if (!selectedEventId || event.id === selectedEventId) {
          return getColorForEvent(event);
        }
        return "rgb(156 163 175 / 0.5)"; // Tailwind gray-400 with opacity
      };

      if (events.length === 1) {
        const event = events[0];
        return (
          <div
            data-event-id={event.id}
            className="h-full w-full"
            style={{ backgroundColor: getSegmentColor(event) }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(event, e);
            }}
          />
        );
      }

      if (events.length === 2) {
        return (
          <div className="flex h-full w-full">
            {events.map((event) => (
              <div
                key={event.id}
                data-event-id={event.id}
                className="h-full w-1/2 border-r border-white/20 last:border-r-0"
                style={{ backgroundColor: getSegmentColor(event) }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(event, e);
                }}
              />
            ))}
          </div>
        );
      }

      if (events.length >= 3) {
        const displayEvents = events.slice(0, 4);
        const hasMore = events.length > 4;

        return (
          <div className="relative grid h-full w-full grid-cols-2 grid-rows-2">
            {displayEvents.map((event, i) => (
              <div
                key={event.id}
                data-event-id={event.id}
                className={clsx("border-r border-b border-white/20", {
                  "border-r-0": i === 1 || i === 3,
                  "border-b-0": i === 2 || i === 3,
                })}
                style={{ backgroundColor: getSegmentColor(event) }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(event, e);
                }}
              />
            ))}
            {hasMore && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-sm bg-black/40 px-0.5 text-[8px] font-bold text-white shadow-xs">
                  +{events.length - 4}
                </span>
              </div>
            )}
          </div>
        );
      }

      return null;
    };

    return (
      <div
        id={week.isCurrentWeek ? "current-week" : undefined}
        className={clsx(
          "week-cell relative aspect-square w-full min-w-[14px] overflow-hidden rounded-xs border border-gray-100 dark:border-gray-600",
          {
            "bg-[#E5E7EB] dark:bg-gray-800/50": !hasEvents,
            "z-10 shadow-[0_0_12px_rgba(59,130,246,0.8)] ring-2 ring-blue-500":
              week.isCurrentWeek,
            "is-selected z-20 border-gray-400 dark:border-gray-500": isSelected,
            "cursor-pointer shadow-xs transition-transform duration-200 hover:z-30 hover:scale-150 hover:border-gray-400 dark:hover:border-gray-500": true,
          },
        )}
        onMouseEnter={() => onHover(week)}
        onMouseLeave={() => onHover(null)}
      >
        {renderSegments()}
        {!hasEvents && week.isCurrentWeek && (
          <div className="pointer-events-none absolute inset-0 animate-pulse rounded-xs border-2 border-blue-400" />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if selection status changes for THIS week
    if (prevProps.isSelected !== nextProps.isSelected) return false;

    // Only re-render if it IS part of the selection and the selection itself changed
    if (
      nextProps.isSelected &&
      prevProps.selectedEventId !== nextProps.selectedEventId
    )
      return false;

    return (
      prevProps.week.index === nextProps.week.index &&
      prevProps.onHover === nextProps.onHover &&
      prevProps.onClick === nextProps.onClick
    );
  },
);

WeekCell.displayName = "WeekCell";

interface YearRowProps {
  year: number;
  calendarYear: number;
  weeks: WeekData[];
  selectedEventId: string | null;
  onHover: (week: WeekData | null) => void;
  onEventClick: (event: LifeEvent, e: React.MouseEvent) => void;
}

export const YearRow = React.memo(
  ({
    year,
    calendarYear,
    weeks,
    selectedEventId,
    onHover,
    onEventClick,
  }: YearRowProps) => {
    return (
      <div className="group flex items-start gap-2 py-1 md:py-px">
        <div className="w-8 shrink-0 pt-[2px] text-right font-mono text-[10px] text-gray-400 lowercase transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-100">
          {year === 0 ? `Age ${year}` : year}
        </div>
        <div className="grid grow grid-cols-13 gap-[2px] sm:grid-cols-26 md:grid-cols-52">
          {weeks.map((week) => {
            const isSelected = selectedEventId
              ? week.events.some((e) => e.id === selectedEventId)
              : false;

            return (
              <WeekCell
                key={week.index}
                week={week}
                isSelected={isSelected}
                onHover={onHover}
                onClick={onEventClick}
                selectedEventId={selectedEventId}
              />
            );
          })}
        </div>
        <div className="w-10 shrink-0 pt-[2px] text-left font-mono text-[10px] text-gray-400 lowercase transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-100">
          {calendarYear}
        </div>
      </div>
    );
  },
);

YearRow.displayName = "YearRow";
