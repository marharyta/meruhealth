import { DateTime, Duration, Interval } from "luxon";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BaseEvent {
  weekday: Weekday;
  title: string;
  completed: boolean;
}

export interface Event extends BaseEvent {
  start: Date;
  end: Date;
}

export interface BaseEvents {
  [key: string]: BaseEvent[];
}

export type Events = Event[];

export type LuxonDateTime = DateTime;

export type LuxonDuration = Duration;
