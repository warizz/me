"use client";

import React, { useState } from "react";
import { LifeEvent, WeekData } from "./types";
import { getColorForEvent } from "./utils";
import clsx from "clsx";

interface WeekCellProps {
  week: WeekData;
  isSelected: boolean;
  isDimmed: boolean;
  onHover: (week: WeekData | null) => void;
  onClick: (event: LifeEvent) => void;
  selectedEventId: string | null;
}

export const WeekCell: React.FC<WeekCellProps> = ({
  week,
  isSelected,
  isDimmed,
  onHover,
  onClick,
  selectedEventId,
}) => {
  const events = week.events;
  const hasEvents = events.length > 0;

  const renderSegments = () => {
    if (events.length === 1) {
      const event = events[0];
      const isEventSelected = selectedEventId === event.id;
      return (
        <div
          className={clsx("w-full h-full transition-colors duration-200", {
            "ring-2 ring-black z-10": isEventSelected,
          })}
          style={{ backgroundColor: getColorForEvent(event) }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(event);
          }}
        />
      );
    }

    if (events.length === 2) {
      return (
        <div className="flex w-full h-full">
          {events.map((event) => (
             <div
              key={event.id}
              className={clsx("w-1/2 h-full border-r last:border-r-0 border-white/20 transition-colors duration-200", {
                "ring-2 ring-inset ring-black z-10": selectedEventId === event.id,
              })}
              style={{ backgroundColor: getColorForEvent(event) }}
              onClick={(e) => {
                e.stopPropagation();
                onClick(event);
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
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full relative">
          {displayEvents.map((event, i) => (
            <div
              key={event.id}
              className={clsx("border-r border-b border-white/20 transition-colors duration-200", {
                "ring-1 ring-inset ring-black z-10": selectedEventId === event.id,
                "border-r-0": i === 1 || i === 3,
                "border-b-0": i === 2 || i === 3,
              })}
              style={{ backgroundColor: getColorForEvent(event) }}
              onClick={(e) => {
                e.stopPropagation();
                onClick(event);
              }}
            />
          ))}
          {hasMore && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[8px] font-bold text-white bg-black/40 px-0.5 rounded shadow-sm">
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
      className={clsx(
        "aspect-square w-full min-w-[14px] border border-gray-100 dark:border-gray-800 rounded-sm relative overflow-hidden transition-all duration-300",
        {
          "bg-[#E5E7EB] dark:bg-gray-800/50": !hasEvents,
          "ring-2 ring-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] z-10": week.isCurrentWeek,
          "opacity-20 grayscale-[0.5]": isDimmed && !isSelected,
          "scale-125 z-20 shadow-lg border-gray-400 dark:border-gray-500": isSelected,
          "hover:border-gray-400 dark:hover:border-gray-500 hover:scale-150 hover:z-30 cursor-pointer shadow-sm": hasEvents || !hasEvents,
        }
      )}
      onMouseEnter={() => onHover(week)}
      onMouseLeave={() => onHover(null)}
    >
      {renderSegments()}
      {!hasEvents && week.isCurrentWeek && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-sm animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

interface YearRowProps {
  year: number;
  weeks: WeekData[];
  selectedEventId: string | null;
  hoveredWeekIndex: number | null;
  onHover: (week: WeekData | null) => void;
  onEventClick: (event: LifeEvent) => void;
}

export const YearRow: React.FC<YearRowProps> = ({
  year,
  weeks,
  selectedEventId,
  hoveredWeekIndex,
  onHover,
  onEventClick,
}) => {
  return (
    <div className="flex items-center gap-2 group">
      <div className="w-8 text-[10px] text-gray-400 font-mono text-right flex-shrink-0 group-hover:text-gray-900 transition-colors">
        {year === 0 ? `Age ${year}` : year}
      </div>
      <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] flex-grow">
        {weeks.map((week) => {
          const isSelected = selectedEventId ? week.events.some(e => e.id === selectedEventId) : false;
          const isDimmed = selectedEventId ? !isSelected : false;
          
          return (
            <WeekCell
              key={week.index}
              week={week}
              isSelected={isSelected}
              isDimmed={isDimmed}
              onHover={onHover}
              onClick={onEventClick}
              selectedEventId={selectedEventId}
            />
          );
        })}
      </div>
    </div>
  );
};
