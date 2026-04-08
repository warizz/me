"use client";

import React, { useState, useMemo, useEffect } from "react";
import { format, isSameWeek, addWeeks } from "date-fns";
import { YearRow } from "./components";
import { LifeEvent, WeekData } from "./types";
import { 
  BIRTH_DATE, 
  TOTAL_YEARS, 
  WEEKS_PER_YEAR, 
  getWeekDate, 
  isEventInWeek 
} from "./utils";
import rawData from "./data.json";
import { ChevronRight, Info, Calendar, MapPin, X } from "lucide-react";
import clsx from "clsx";

const LifeInWeeksPage = () => {
  const [hoveredWeek, setHoveredWeek] = useState<WeekData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map raw data to LifeEvent objects
  const events = useMemo(() => {
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.detail || "",
      started_at: item.date,
      ended_at: item.ended_at || item.end_date || item.date,
      color: item.color,
      is_private: item.is_private === "true" || item.is_private === true,
    })).filter(e => !e.is_private);
  }, []);

  // Pre-calculate all weeks data
  const gridData = useMemo(() => {
    const today = new Date();
    const rows = [];
    const birthYear = BIRTH_DATE.getFullYear();
    
    for (let year = 0; year < TOTAL_YEARS; year++) {
      const yearWeeks: WeekData[] = [];
      const currentYearValue = birthYear + year;
      const yearStart = new Date(currentYearValue, 0, 1); // January 1st
      
      for (let weekOfYear = 0; weekOfYear < WEEKS_PER_YEAR; weekOfYear++) {
        const globalWeekIndex = year * WEEKS_PER_YEAR + weekOfYear;
        const weekDate = addWeeks(yearStart, weekOfYear);
        
        const weekEvents = events.filter(event => isEventInWeek(event, weekDate));
        
        yearWeeks.push({
          index: globalWeekIndex,
          date: weekDate,
          events: weekEvents,
          isCurrentWeek: isSameWeek(weekDate, today, { weekStartsOn: 0 }),
        });
      }
      rows.push({ year, weeks: yearWeeks });
    }
    return rows;
  }, [events]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredWeek) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleEventClick = (event: LifeEvent) => {
    if (selectedEventId === event.id) {
      setSelectedEventId(null);
      setSelectedEvent(null);
    } else {
      setSelectedEventId(event.id);
      setSelectedEvent(event);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 p-4 md:p-8" onMouseMove={handleMouseMove}>
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Life in Weeks</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          A visualization of my life, one week at a time. Each cell represents seven days. 
          The full grid spans 100 years. Empty squares are neutral, while colored segments mark significant life events.
        </p>
      </header>

      <main className="max-w-[1400px] mx-auto overflow-x-auto pb-20">
        <div className="flex flex-col gap-[2px] min-w-[1000px]">
          {gridData.map((row) => (
            <YearRow
              key={row.year}
              year={row.year}
              weeks={row.weeks}
              selectedEventId={selectedEventId}
              hoveredWeekIndex={hoveredWeek?.index ?? null}
              onHover={setHoveredWeek}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      </main>

      {/* Tooltip */}
      {hoveredWeek && (
        <div 
          className="fixed z-50 pointer-events-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg p-3 max-w-xs transition-opacity duration-200"
          style={{ 
            left: `${tooltipPos.x + 15}px`, 
            top: `${tooltipPos.y + 15}px` 
          }}
        >
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            Week of {format(hoveredWeek.date, "MMM d, yyyy")}
          </div>
          {hoveredWeek.events.length > 0 ? (
            <div className="space-y-2">
              {hoveredWeek.events.map(event => (
                <div key={event.id} className="border-l-2 pl-2" style={{ borderColor: event.color || 'gray' }}>
                  <div className="text-sm font-semibold">{event.title}</div>
                  {event.description && (
                    <div className="text-xs text-gray-500 line-clamp-2">{event.description}</div>
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
      <div className={clsx(
        "fixed bottom-8 right-8 z-40 w-full max-w-md transform transition-all duration-300 ease-in-out",
        selectedEvent ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        {selectedEvent && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-2 w-12 rounded-full mb-2" style={{ backgroundColor: selectedEvent.color || 'gray' }} />
                <button 
                  onClick={() => { setSelectedEvent(null); setSelectedEventId(null); }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(selectedEvent.started_at), "MMM d, yyyy")}</span>
                  {selectedEvent.ended_at && selectedEvent.ended_at !== selectedEvent.started_at && (
                    <>
                      <span>—</span>
                      <span>{format(new Date(selectedEvent.ended_at), "MMM d, yyyy")}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedEvent.description || "No further details available for this event."}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-xs text-gray-400">Event #{selectedEvent.id}</span>
              <button 
                onClick={() => { setSelectedEvent(null); setSelectedEventId(null); }}
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

export default LifeInWeeksPage;
