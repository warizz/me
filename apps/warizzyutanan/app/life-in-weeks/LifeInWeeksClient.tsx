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
        "min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 p-4 md:p-8",
        selectedEventId && "has-selected-event",
      )}
      onMouseMove={handleMouseMove}
    >
      <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Life in Weeks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            A visualization of my life, one week at a time. Each cell represents
            seven days. The full grid spans 100 years. Empty squares are
            neutral, while colored segments mark significant life events.
          </p>
        </div>
        <div className="flex-shrink-0">
          <ColorSchemeToggle />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto pb-20 px-2 md:px-0">
        {/* Minimal Sticky Progress Navigation Line */}
        <div className="sticky top-0 z-30 flex items-start gap-2 pt-8 pb-4 mb-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100/50 dark:border-white/5">
          <div className="w-8 text-[10px] text-gray-400 font-mono text-right flex-shrink-0 lowercase leading-tight pt-1">
            <span className="text-blue-500 font-bold block">
              {lifeStats.currentWeek}
            </span>
            passed
          </div>

          <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] sm:grid-cols-[repeat(26,minmax(0,1fr))] md:grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] flex-grow">
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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-[10px] font-bold text-blue-500 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      {lifeStats.percentage.toFixed(1)}%
                      <div className="w-px h-1 bg-blue-500 mx-auto mt-0.5" />
                    </div>
                  )}
                  <div
                    className={clsx(
                      "aspect-square w-full min-w-[4px] rounded-[1px] border transition-all duration-500",
                      isPassed
                        ? "bg-blue-500 border-blue-600 dark:bg-blue-500 dark:border-blue-400"
                        : isCurrent
                          ? "bg-white dark:bg-gray-900 border-blue-500 ring-2 ring-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10"
                          : "bg-[#E5E7EB] dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50",
                    )}
                  />
                </div>
              );
            })}
          </div>

          <div className="w-10 text-[10px] text-gray-400 font-mono text-left flex-shrink-0 lowercase leading-tight pt-1">
            <span className="text-gray-900 dark:text-gray-100 font-bold block">
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
          className="fixed z-50 pointer-events-none hidden md:block bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg p-3 max-w-[calc(100vw-32px)] md:max-w-xs transition-opacity duration-200"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`,
          }}
        >
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
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
                    <div className="text-xs text-gray-500 line-clamp-2">
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
          "bottom-0 left-0 right-0 w-full p-4 md:p-0",
          // Desktop: docked at bottom-right
          "md:bottom-8 md:right-8 md:left-auto md:w-full md:max-w-md",
          selectedEvent
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0 pointer-events-none",
        )}
      >
        {selectedEvent && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl md:rounded-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <div
                  className="h-2 w-12 rounded-full mb-2"
                  style={{ backgroundColor: getColorForEvent(selectedEvent) }}
                />
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedEventId(null);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
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
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedEvent.description ||
                    "No further details available for this event."}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Event #{selectedEvent.id}
              </span>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedEventId(null);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
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
