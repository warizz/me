"use client";

import clsx from "clsx";
import { format } from "date-fns";
import { X, Calendar } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

import ColorSchemeToggle from "../../components/ColorSchemeToggle/ColorSchemeToggle";
import { YearRow } from "./components";
import { LifeEvent, WeekData } from "./types";
import { BIRTH_DATE, getColorForEvent } from "./utils";

interface LifeInWeeksClientProps {
  gridData: { year: number; weeks: WeekData[] }[];
}

const LifeInWeeksClient: React.FC<LifeInWeeksClientProps> = ({ gridData }) => {
  const birthYear = BIRTH_DATE.getFullYear();
  const [hoveredWeek, setHoveredWeek] = useState<WeekData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const lifeStats = React.useMemo(() => {
    let currentWeek = 0;
    let totalWeeks = 0;
    gridData.forEach((year) => {
      year.weeks.forEach((week) => {
        totalWeeks++;
        if (week.isCurrentWeek) currentWeek = totalWeeks;
      });
    });
    return {
      currentWeek,
      totalWeeks,
      percentage: (currentWeek / totalWeeks) * 100,
    };
  }, [gridData]);

  useEffect(() => {
    let frameId: number;

    const scrollToCurrentWeek = () => {
      const currentWeekEl = document.getElementById("current-week");
      if (currentWeekEl) {
        currentWeekEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        frameId = requestAnimationFrame(scrollToCurrentWeek);
      }
    };

    frameId = requestAnimationFrame(scrollToCurrentWeek);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (hoveredWeek) {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }
    },
    [hoveredWeek],
  );

  const handleEventClick = useCallback(
    (event: LifeEvent, e: React.MouseEvent) => {
      (e.currentTarget as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (selectedEventId === event.id) {
        setSelectedEventId(null);
        setSelectedEvent(null);
      } else {
        setSelectedEventId(event.id);
        setSelectedEvent(event);
      }
    },
    [selectedEventId],
  );

  const handleHover = useCallback((week: WeekData | null) => {
    setHoveredWeek(week);
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen bg-white p-4 font-sans text-gray-900 md:p-8 dark:bg-gray-950 dark:text-gray-100",
        selectedEventId && "has-selected-event",
      )}
      onMouseMove={handleMouseMove}
    >
      <header className="mx-auto mb-12 flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Life in Weeks
          </h1>
          <p className="max-w-2xl text-gray-500 dark:text-gray-400">
            A visualization of my life, one week at a time. Each cell represents
            seven days. The full grid spans 100 years. Empty squares are
            neutral, while colored segments mark significant life events.
          </p>
        </div>
        <div className="shrink-0">
          <ColorSchemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-2 pb-20 md:px-0">
        {/* Minimal Sticky Progress Navigation Line */}
        <div className="sticky top-0 z-30 mb-4 flex items-start gap-2 border-b border-gray-100/50 bg-white/80 pt-10 pb-4 backdrop-blur-md dark:border-white/5 dark:bg-gray-950/80">
          {/* Mobile Centered Progress Percent */}
          <div className="animate-in fade-in slide-in-from-top-1 absolute top-3 left-1/2 -translate-x-1/2 text-xs font-black whitespace-nowrap text-blue-600 drop-shadow-xs duration-500 sm:hidden dark:text-blue-400">
            {lifeStats.percentage.toFixed(1)}%
          </div>
          <div className="w-8 shrink-0 pt-1 text-right font-mono text-[10px] leading-tight text-gray-400 lowercase">
            <span className="block font-bold text-blue-500">
              {lifeStats.currentWeek}
            </span>
            passed
          </div>

          <div className="grid grow grid-cols-13 gap-[2px] sm:grid-cols-26 md:grid-cols-52">
            {Array.from({ length: 52 }).map((_, i) => {
              const segmentIndex = i;
              const totalSegments = 52;
              const isPassed =
                segmentIndex <
                Math.floor((lifeStats.percentage / 100) * totalSegments);
              const isCurrent =
                segmentIndex ===
                Math.floor((lifeStats.percentage / 100) * totalSegments);

              return (
                <div key={i} className="relative">
                  {isCurrent && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 text-xs font-black whitespace-nowrap text-blue-600 drop-shadow-xs duration-300 sm:block dark:text-blue-400">
                      {lifeStats.percentage.toFixed(1)}%
                      <div className="mx-auto mt-0.5 h-1.5 w-px bg-blue-600 dark:bg-blue-400" />
                    </div>
                  )}
                  <div
                    className={clsx(
                      "aspect-square w-full min-w-[4px] rounded-[1px] border transition-all duration-500",
                      isPassed
                        ? "border-blue-600 bg-blue-500 dark:border-blue-400 dark:bg-blue-500"
                        : isCurrent
                          ? "z-10 border-blue-500 bg-white shadow-[0_0_8px_rgba(59,130,246,0.6)] ring-2 ring-blue-500 dark:bg-gray-900"
                          : "border-gray-200 bg-[#E5E7EB] dark:border-gray-700/50 dark:bg-gray-800/50",
                    )}
                  />
                </div>
              );
            })}
          </div>

          <div className="w-10 shrink-0 pt-1 text-left font-mono text-[10px] leading-tight text-gray-400 lowercase">
            <span className="block font-bold text-gray-900 dark:text-gray-100">
              {lifeStats.totalWeeks - lifeStats.currentWeek}
            </span>
            left
          </div>
        </div>

        <div className="flex flex-col gap-[4px] md:gap-[2px]">
          {gridData.map((row) => (
            <YearRow
              key={row.year}
              year={row.year}
              calendarYear={birthYear + row.year}
              weeks={row.weeks}
              selectedEventId={selectedEventId}
              onHover={handleHover}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      </main>

      {/* Tooltip */}
      {hoveredWeek && (
        <div
          className="pointer-events-none fixed z-50 hidden max-w-[calc(100vw-32px)] rounded-lg border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur-xs transition-opacity duration-200 md:block md:max-w-xs dark:border-gray-800 dark:bg-gray-900/95"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`,
          }}
        >
          <div className="mb-1 text-[10px] tracking-wider text-gray-400 uppercase">
            Week of {format(hoveredWeek.date, "MMM d, yyyy")}
          </div>
          {hoveredWeek.events.length > 0 ? (
            <div className="space-y-2">
              {hoveredWeek.events.map((event) => (
                <div
                  key={event.id}
                  className="border-l-2 pl-2"
                  style={{ borderColor: getColorForEvent(event) }}
                >
                  <div className="text-sm font-semibold">{event.title}</div>
                  {event.description && (
                    <div className="line-clamp-2 text-xs text-gray-500">
                      {event.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No events this week</div>
          )}
        </div>
      )}

      {/* Detail Panel */}
      <div
        className={clsx(
          "fixed z-40 transition-all duration-300 ease-in-out",
          // Mobile: full width at bottom
          "right-0 bottom-0 left-0 w-full p-4 md:p-0",
          // Desktop: docked at bottom-right
          "md:right-8 md:bottom-8 md:left-auto md:w-full md:max-w-md",
          selectedEvent
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-12 opacity-0",
        )}
      >
        {selectedEvent && (
          <div className="max-h-[80vh] overflow-hidden overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl md:rounded-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="p-5 md:p-6">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="mb-2 h-2 w-12 rounded-full"
                  style={{ backgroundColor: getColorForEvent(selectedEvent) }}
                />
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedEventId(null);
                  }}
                  className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="mb-2 text-2xl font-bold">{selectedEvent.title}</h2>
              <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {format(new Date(selectedEvent.started_at), "MMM d, yyyy")}
                  </span>
                  {selectedEvent.ended_at &&
                    selectedEvent.ended_at !== selectedEvent.started_at && (
                      <>
                        <span>—</span>
                        <span>
                          {format(
                            new Date(selectedEvent.ended_at),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </>
                    )}
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {selectedEvent.description ||
                    "No further details available for this event."}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
              <span className="text-xs text-gray-400">
                Event #{selectedEvent.id}
              </span>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedEventId(null);
                }}
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeInWeeksClient;
