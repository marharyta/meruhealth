import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import {
  Events,
  BaseEvents,
  Event,
  BaseEvent,
  LuxonDateTime,
} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsToLuxonDate(date: Date) {
  return DateTime.fromJSDate(date);
}

export function toReactBigCalendarEventFormat(
  event: BaseEvent & {
    start: Date;
    end: Date;
  }
) {
  return {
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    completed: event.completed,
    weekday: event.weekday,
    allDay: true,
  };
}

export const weekNumberMap = {
  week1: 1,
  week2: 2,
  week3: 3,
};

export const weekdayMap = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

export const dayWithEvent = (cellDate: LuxonDateTime, events: Events) => {
  const currentDate = cellDate.get("day");
  const currentMonth = cellDate.get("month");
  return events?.find((event: any) => {
    const eventStartDate = DateTime.fromJSDate(event?.start).get("day");
    const eventStartMonth = DateTime.fromJSDate(event?.start).get("month");

    return eventStartDate === currentDate && currentMonth === eventStartMonth;
  });
};

export const isSameDayMonthYear = (
  cellDate: LuxonDateTime,
  now: LuxonDateTime
) => {
  return (
    cellDate.hasSame(now, "day") &&
    cellDate.hasSame(now, "month") &&
    cellDate.hasSame(now, "year")
  );
};

export function nextDayofWeek(now: any, event: Event, weekdayMap: any) {
  return now.plus({
    days: (weekdayMap[event.weekday] + 7 - now.weekday) % 7,
  });
}

export function transformEvents(
  events: BaseEvents,
  currentLocalDate: LuxonDateTime,
  weekNumberMap: any,
  weekdayMap: any
) {
  const formattedEvents = Object.entries(events).reduce(
    (acc, [week, weekEvents]: [string, BaseEvent[]]) => {
      const weekNumber = weekNumberMap[week];
      const firstWeekOfCurrentMonth =
        currentLocalDate.startOf("month").weekNumber - 1;

      const transformedWeekEvents: Events = weekEvents.map(
        (event: BaseEvent) => {
          const startDate: LuxonDateTime = DateTime.fromObject({
            weekYear: currentLocalDate.get("year"),
            weekNumber: firstWeekOfCurrentMonth + weekNumber,
            weekday: weekdayMap[event.weekday],
          });

          // Calculate the end date (assuming each event is one day)
          const endDate: LuxonDateTime = startDate.plus({ days: 1 });

          return toReactBigCalendarEventFormat({
            title: event.title,
            //@ts-ignore
            start: startDate,
            //@ts-ignore
            end: endDate,
            completed: event.completed,
            weekday: event.weekday,
          });
        }
      );

      //@ts-ignore
      return acc.concat(transformedWeekEvents);
    },
    []
  );
  return formattedEvents;
}

export function shiftDays(formattedEvents: Events, currentLocalDate: any) {
  if (formattedEvents[0].completed === false) {
    return [];
  }

  let startCounterDate = currentLocalDate;
  let incompletedEvents = [...formattedEvents].filter((f) => !f.completed);

  if (incompletedEvents.length === 0) {
    return [];
  }

  let incompletedEventsDateShifted: Array<any> = [];

  incompletedEvents.forEach((event, index) => {
    if (index === 0) {
      incompletedEventsDateShifted.push({
        ...event,
        start: new Date(startCounterDate.toISODate()),
        end: new Date(startCounterDate.toISODate().split("T")[0]),
      });
    } else {
      incompletedEventsDateShifted.push({
        ...event,
        start: new Date(
          nextDayofWeek(startCounterDate, event, weekdayMap).toISODate()
        ),
        end: new Date(
          nextDayofWeek(startCounterDate, event, weekdayMap)
            .toISODate()
            .split("T")[0]
        ),
      });
    }

    startCounterDate = nextDayofWeek(startCounterDate, event, weekdayMap).plus({
      days: 1,
    });
  });

  return incompletedEventsDateShifted;
}
