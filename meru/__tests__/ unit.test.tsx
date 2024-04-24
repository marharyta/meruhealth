import { expect, describe, test, beforeAll } from "vitest";
import { DateTime } from "luxon";
import {
  nextDayofWeek,
  weekdayMap,
  weekNumberMap,
  transformEvents,
  shiftDays,
} from "../lib/utils";
import { BaseEvents, Event, LuxonDateTime } from "@/lib/types";

describe("Event Calendar behaviour", () => {
  let events: BaseEvents;
  let completedEvents: BaseEvents;
  let uncompletedEvents: BaseEvents;
  let event: Event;
  let currentLocalDate: LuxonDateTime;
  let currentLocalDate2: LuxonDateTime;

  beforeAll(() => {
    events = {
      week1: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: true,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: true,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: true,
        },
      ],
      week2: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: true,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: false,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: false,
        },
      ],
      week3: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: false,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: false,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: false,
        },
      ],
    };

    completedEvents = {
      week1: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: true,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: true,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: true,
        },
      ],
      week2: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: true,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: true,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: true,
        },
      ],
      week3: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: true,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: true,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: true,
        },
      ],
    };

    uncompletedEvents = {
      week1: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: false,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: false,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: false,
        },
      ],
      week2: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: false,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: false,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: false,
        },
      ],
      week3: [
        {
          weekday: "MONDAY",
          title: "Event 1",
          completed: false,
        },
        {
          weekday: "WEDNESDAY",
          title: "Introduction to the Program",
          completed: false,
        },
        {
          weekday: "FRIDAY",
          title: "The Science Behind Mindfulness",
          completed: false,
        },
      ],
    };

    currentLocalDate = DateTime.local();
    currentLocalDate2 = DateTime.utc(2024, 5, 28, 9, 30, 0, 0);

    event = {
      title: "Emotional support event",
      start: DateTime.fromObject({
        year: 2024,
        day: 17,
        month: 3,
        weekday: 3,
      }),
      end: DateTime.fromObject({
        year: 2024,
        day: 17,
        month: 3,
        weekday: 3,
      }),
      completed: true,
      weekday: "WEDNESDAY",
      allDay: true,
    };
  });

  test("transform events correctly when some are completed and some are not", () => {
    const formattedEvents = transformEvents(
      events,
      currentLocalDate,
      weekNumberMap,
      weekdayMap
    );
    const incompleteEvents = shiftDays(formattedEvents, currentLocalDate);

    expect(formattedEvents).toHaveLength(9);
    expect(incompleteEvents).toHaveLength(5);
    expect(incompleteEvents[0].completed).toBe(false);
    expect(DateTime.fromJSDate(incompleteEvents[0].start).get("day")).toEqual(
      currentLocalDate.get("day")
    );
  });

  test("transform events correctly when events are completed", () => {
    const formattedCompletedEvents = transformEvents(
      completedEvents,
      currentLocalDate,
      weekNumberMap,
      weekdayMap
    );
    const incompleteCompletedEvents = shiftDays(
      formattedCompletedEvents,
      currentLocalDate
    );

    expect(formattedCompletedEvents).toHaveLength(9);
    expect(incompleteCompletedEvents).toHaveLength(0);
  });

  test("transform events correctly when events are not completed", () => {
    const formattedUncompletedEvents = transformEvents(
      uncompletedEvents,
      currentLocalDate,
      weekNumberMap,
      weekdayMap
    );
    const incompleteUncompletedEvents = shiftDays(
      formattedUncompletedEvents,
      currentLocalDate
    );

    expect(formattedUncompletedEvents).toHaveLength(9);
    expect(incompleteUncompletedEvents).toHaveLength(0);
  });

  test("finds next day of the week correctly", () => {
    expect(
      nextDayofWeek(currentLocalDate, event, weekdayMap).get("day")
    ).toEqual(17);
    expect(
      nextDayofWeek(currentLocalDate2, event, weekdayMap).get("day")
    ).toEqual(29);

    expect(
      nextDayofWeek(
        currentLocalDate,
        event,
        weekdayMap
      ).weekdayLong.toLowerCase()
    ).toEqual(event.weekday.toLowerCase());
  });
});
