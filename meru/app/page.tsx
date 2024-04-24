import EventCalendar from "./EventCalendar";
import { getEvents } from "@/api/events";
import { BaseEvents } from "@/lib/types";

export default async function Home() {
  const events: BaseEvents = await getEvents();
  return (
    <main>
      <EventCalendar events={events} />
    </main>
  );
}
