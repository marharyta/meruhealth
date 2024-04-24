"use client";

import { DateTime, Settings } from "luxon";
import { Calendar, luxonLocalizer } from "react-big-calendar";
import { HiCheckCircle } from "react-icons/hi";
import {
  transformEvents,
  shiftDays,
  weekNumberMap,
  weekdayMap,
  dayWithEvent,
  isSameDayMonthYear,
} from "@/lib/utils";
import { BaseEvents, Event, LuxonDateTime } from "@/lib/types";
import jstz from "jstz";

const EventCalendar = ({ events }: { events: BaseEvents }) => {
  const timezone = jstz.determine();
  Settings.defaultZone = timezone.name() || "Europe/Helsinki";
  const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });
  const currentLocalDate: LuxonDateTime = DateTime.local().setZone(
    timezone.name() || "Europe/Helsinki"
  );

  const formattedEvents: Array<Event> = transformEvents(
    events,
    currentLocalDate,
    weekNumberMap,
    weekdayMap
  );

  const completedEvents = formattedEvents[0].completed
    ? [...formattedEvents].filter((e: Event) => e?.completed)
    : [...formattedEvents];

  const rescheduledEvents: Array<Event> = shiftDays(
    formattedEvents,
    currentLocalDate
  );

  return (
    <div className="max-w-full overflow-hidden">
      <h2 className="text-3xl md:text-6xl text-center font-medium py-3 font-one leading-normal">
        Weekly Programme
        <span className="block text-2xl leading-normal text-black-300">
          {currentLocalDate.toLocaleString({ month: "long", year: "numeric" })}
        </span>
      </h2>
      <div className="min-w-full max-width-full overflow-scroll">
        <Calendar
          className="min-w-full w-[68rem]"
          components={{
            eventWrapper: ({ event }: { event: any }) => {
              const cellDate = DateTime.fromJSDate(event.start);

              const now = DateTime.now();
              const isToday = isSameDayMonthYear(cellDate, now);
              return (
                <div
                  className={`w-full h-full bg-transparent text-center text-pretty text-xs font-light uppercase overflow-hidden px-0.5 h-64 font-libre ${
                    event?.completed && " text-brand "
                  } ${isToday && " text-white "}`}
                >
                  {event?.completed && (
                    <HiCheckCircle className="block w-full text-center" />
                  )}
                  {event?.title}
                </div>
              );
            },
            dateCellWrapper: (obj) => {
              const { children, value } = obj;
              const cellDate = DateTime.fromJSDate(value);
              const now = DateTime.now();
              const isToday = isSameDayMonthYear(cellDate, now);

              return (
                <div
                  className={`w-full h-full border border-brand  ${
                    isToday && " !bg-brand "
                  }`}
                >
                  {children}
                </div>
              );
            },
            month: {
              dateHeader: (obj) => {
                const { date } = obj;
                const cellDate = DateTime.fromJSDate(date);
                const eventOnDay = dayWithEvent(cellDate, formattedEvents);
                const now = DateTime.now();
                const isToday = isSameDayMonthYear(cellDate, now);

                return (
                  <h1
                    className={`w-full h-full text-center font-semibold text-4xl md:text-6xl py-4 -mb-3 mt-1 font-libre ${
                      eventOnDay && "text-brand "
                    } ${isToday && " !text-white "}`}
                  >
                    {cellDate.get("day")}
                  </h1>
                );
              },
            },
          }}
          localizer={localizer}
          events={completedEvents.concat(rescheduledEvents)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          toolbar={false}
          defaultView="month"
        />
      </div>
    </div>
  );
};

export default EventCalendar;
